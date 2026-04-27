import { NextResponse } from "next/server";

import type {
  AuditLevel,
  AuditStage,
  AuditTrailEntry,
  InferenceEvaluationRequest,
  InferenceEvaluationResponse,
  InferenceSuggestion,
  InterventionMode,
  ThreatRecord,
} from "../../../../src/lib/ai-guard/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_OLLAMA_ENDPOINT =
  process.env.AEGIS_OLLAMA_ENDPOINT ?? "http://127.0.0.1:11434/api/generate";
const DEFAULT_OLLAMA_MODEL = process.env.AEGIS_OLLAMA_MODEL ?? "llama3.1:8b";

type OllamaGenerateResponse = {
  model?: string;
  response?: string;
};

type OllamaSuggestionShape = {
  threatId?: unknown;
  action?: unknown;
  confidence?: unknown;
  rationale?: unknown;
  selector?: unknown;
  replacementText?: unknown;
};

type OllamaResultShape = {
  suggestions?: unknown;
  auditTrail?: unknown;
};

const allowedActions = new Set<InterventionMode>(["flag", "rewrite", "block"]);

function createAuditEntry(
  stage: AuditStage,
  level: AuditLevel,
  message: string,
  threatId?: string,
): AuditTrailEntry {
  return {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    stage,
    level,
    message,
    threatId,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isThreatRecord(value: unknown): value is ThreatRecord {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    typeof value.text === "string" &&
    typeof value.source === "string" &&
    typeof value.confidence === "number" &&
    typeof value.severity === "string"
  );
}

function isInferenceEvaluationRequest(value: unknown): value is InferenceEvaluationRequest {
  if (!isObject(value)) return false;
  if (!isObject(value.page) || !isObject(value.config) || !Array.isArray(value.threats)) return false;

  return (
    typeof value.page.url === "string" &&
    typeof value.page.title === "string" &&
    typeof value.page.scannedAt === "string" &&
    typeof value.config.provider === "string" &&
    typeof value.config.interventionMode === "string" &&
    value.threats.every(isThreatRecord)
  );
}

function clampConfidence(value: unknown, fallback = 0.76): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(1, Math.max(0, value));
}

function sanitizeSuggestions(
  rawSuggestions: unknown,
  threats: ThreatRecord[],
  fallbackAction: InterventionMode,
): InferenceSuggestion[] {
  if (!Array.isArray(rawSuggestions)) {
    return [];
  }

  const knownThreatIds = new Set(threats.map((threat) => threat.id));
  const suggestions: InferenceSuggestion[] = [];

  rawSuggestions.forEach((item) => {
    if (!isObject(item)) {
      return;
    }

    const typedItem = item as OllamaSuggestionShape;
    const threatId =
      typeof typedItem.threatId === "string" && knownThreatIds.has(typedItem.threatId)
        ? typedItem.threatId
        : null;

    if (!threatId) {
      return;
    }

    const action =
      typeof typedItem.action === "string" &&
      allowedActions.has(typedItem.action as InterventionMode)
        ? (typedItem.action as InterventionMode)
        : fallbackAction;

    suggestions.push({
      threatId,
      action,
      confidence: clampConfidence(typedItem.confidence),
      rationale:
        typeof typedItem.rationale === "string" && typedItem.rationale.trim()
          ? typedItem.rationale.trim()
          : "Lokální inference doporučuje zásah podle detekovaného manipulačního patternu.",
      selector: typeof typedItem.selector === "string" ? typedItem.selector : undefined,
      replacementText:
        typeof typedItem.replacementText === "string" ? typedItem.replacementText : undefined,
    });
  });

  return suggestions;
}

function getFallbackAction(threat: ThreatRecord, preferredAction: InterventionMode): InterventionMode {
  if (preferredAction === "block" && threat.severity === "high") {
    return "block";
  }

  if (threat.type === "urgency" || threat.type === "scarcity") {
    return preferredAction === "flag" ? "rewrite" : preferredAction;
  }

  if (threat.type === "social_proof") {
    return preferredAction === "block" ? "flag" : preferredAction;
  }

  return preferredAction;
}

function buildLocalPolicySuggestions(request: InferenceEvaluationRequest): InferenceSuggestion[] {
  return request.threats.map((threat) => ({
    threatId: threat.id,
    action: getFallbackAction(threat, request.config.interventionMode),
    confidence: clampConfidence(Math.max(threat.confidence, 0.74)),
    rationale:
      threat.type === "urgency"
        ? "Lokální policy engine doporučuje omezit časový tlak a zachovat informativní copy bez urgency stimulů."
        : threat.type === "scarcity"
          ? "Lokální policy engine doporučuje neutralizovat tvrzení o omezené dostupnosti a ponechat ověřitelné informace."
          : "Lokální policy engine doporučuje označit sociální důkaz jako marketingový stimul a nepřidávat mu rozhodovací váhu.",
    selector: threat.selector,
  }));
}

function buildPrompt(request: InferenceEvaluationRequest): string {
  const serializedThreats = request.threats
    .map(
      (threat, index) =>
        `${index + 1}. id=${threat.id}; type=${threat.type}; severity=${threat.severity}; confidence=${threat.confidence}; selector=${threat.selector ?? "n/a"}; text=${JSON.stringify(threat.text)}`,
    )
    .join("\n");

  return [
    "You are AEGIS local inference engine.",
    "Return only valid JSON with this shape:",
    '{"suggestions":[{"threatId":"string","action":"flag|rewrite|block","confidence":0.0,"rationale":"string","selector":"string?","replacementText":"string?"}],"auditTrail":[{"message":"string","level":"info|warn|critical","stage":"bridge|rewrite|scan|revert","threatId":"string?"}]}',
    `Preferred intervention mode: ${request.config.interventionMode}`,
    `Page title: ${request.page.title}`,
    `Page url: ${request.page.url}`,
    "Threats:",
    serializedThreats,
    "Choose one suggestion per threat. Be conservative. Prefer rewrite over block unless severity is high and confidence is strong.",
  ].join("\n");
}

async function evaluateWithOllama(
  request: InferenceEvaluationRequest,
): Promise<InferenceEvaluationResponse> {
  const model = request.config.model?.trim() || DEFAULT_OLLAMA_MODEL;
  const response = await fetch(DEFAULT_OLLAMA_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: buildPrompt(request),
      stream: false,
      format: "json",
      options: {
        temperature: 0.1,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Ollama returned HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as OllamaGenerateResponse;

  if (typeof payload.response !== "string" || !payload.response.trim()) {
    throw new Error("Ollama returned an empty inference payload.");
  }

  const parsed = JSON.parse(payload.response) as OllamaResultShape;
  const suggestions = sanitizeSuggestions(
    parsed.suggestions,
    request.threats,
    request.config.interventionMode,
  );

  /** @type {AuditTrailEntry[]} */
  const auditTrail = [
    createAuditEntry(
      "bridge",
      "info",
      `Ollama inference completed for ${request.threats.length} threat(s) using model ${payload.model ?? model}.`,
    ),
  ];

  if (Array.isArray(parsed.auditTrail)) {
    parsed.auditTrail.forEach((entry) => {
      if (!isObject(entry) || typeof entry.message !== "string") {
        return;
      }

      auditTrail.push(
        createAuditEntry(
          entry.stage === "scan" ||
            entry.stage === "bridge" ||
            entry.stage === "rewrite" ||
            entry.stage === "revert"
            ? entry.stage
            : "bridge",
          entry.level === "info" || entry.level === "warn" || entry.level === "critical"
            ? entry.level
            : "info",
          entry.message,
          typeof entry.threatId === "string" ? entry.threatId : undefined,
        ),
      );
    });
  }

  return {
    ok: true,
    provider: "ollama",
    model: payload.model ?? model,
    suggestions,
    auditTrail,
  };
}

function buildLocalPolicyEvaluation(
  request: InferenceEvaluationRequest,
  auditTrail: AuditTrailEntry[] = [],
): InferenceEvaluationResponse {
  const suggestions = buildLocalPolicySuggestions(request);

  return {
    ok: true,
    provider: "custom",
    model: "aegis-local-policy",
    suggestions,
    auditTrail: [
      ...auditTrail,
      createAuditEntry(
        "bridge",
        "info",
        `AEGIS local policy engine produced ${suggestions.length} suggestion(s).`,
      ),
    ],
  };
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        provider: "custom",
        error: "Request body must be valid JSON.",
        auditTrail: [createAuditEntry("bridge", "warn", "Invalid JSON payload.")],
      } satisfies InferenceEvaluationResponse,
      { status: 400 },
    );
  }

  if (!isInferenceEvaluationRequest(payload)) {
    return NextResponse.json(
      {
        ok: false,
        provider: "custom",
        error: "Payload does not match InferenceEvaluationRequest.",
        auditTrail: [createAuditEntry("bridge", "warn", "Invalid inference request shape.")],
      } satisfies InferenceEvaluationResponse,
      { status: 400 },
    );
  }

  if (payload.threats.length === 0) {
    return NextResponse.json(
      {
        ok: true,
        provider: "custom",
        model: "aegis-local-policy",
        suggestions: [],
        auditTrail: [createAuditEntry("bridge", "info", "No threats supplied to local endpoint.")],
      } satisfies InferenceEvaluationResponse,
    );
  }

  if (payload.config.provider === "ollama") {
    try {
      const result = await evaluateWithOllama(payload);
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Ollama inference failure.";

      const fallback = buildLocalPolicyEvaluation(payload, [
        createAuditEntry(
          "bridge",
          "critical",
          `Ollama bridge failed and local policy fallback was used instead: ${message}`,
        ),
      ]);

      return NextResponse.json(fallback, { status: 200 });
    }
  }

  return NextResponse.json(buildLocalPolicyEvaluation(payload), { status: 200 });
}
