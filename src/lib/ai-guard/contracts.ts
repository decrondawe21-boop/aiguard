export const threatTypes = ["urgency", "scarcity", "social_proof"] as const;
export const threatSources = ["auto", "load", "mutation", "manual"] as const;
export const interventionModes = ["flag", "rewrite", "block"] as const;
export const auditStages = ["scan", "bridge", "rewrite", "revert"] as const;
export const auditLevels = ["info", "warn", "critical"] as const;

export type ThreatType = (typeof threatTypes)[number];
export type ThreatSource = (typeof threatSources)[number];
export type InterventionMode = (typeof interventionModes)[number];
export type AuditStage = (typeof auditStages)[number];
export type AuditLevel = (typeof auditLevels)[number];

export type ThreatSeverity = "low" | "medium" | "high";
export type InferenceProvider = "disabled" | "ollama" | "custom";

export type PageContext = {
  url: string;
  title: string;
  scannedAt: string;
  locale?: string;
};

export type ThreatRecord = {
  id: string;
  type: ThreatType;
  text: string;
  source: ThreatSource;
  confidence: number;
  severity: ThreatSeverity;
  selector?: string;
};

export type ThreatSessionStore = Partial<Record<number, ThreatRecord[]>>;

export type AuditTrailEntry = {
  id: string;
  at: string;
  stage: AuditStage;
  level: AuditLevel;
  message: string;
  threatId?: string;
};

export type InferenceSuggestion = {
  threatId: string;
  action: InterventionMode;
  confidence: number;
  rationale: string;
  selector?: string;
  replacementText?: string;
};

export type InferenceBridgeConfig = {
  enabled: boolean;
  provider: InferenceProvider;
  endpoint?: string;
  model?: string;
  interventionMode: InterventionMode;
  timeoutMs?: number;
};

export type InferenceEvaluationRequest = {
  page: PageContext;
  threats: ThreatRecord[];
  config: Pick<
    InferenceBridgeConfig,
    "provider" | "model" | "interventionMode"
  >;
};

export type InferenceEvaluationResponse =
  | {
      ok: true;
      provider: Exclude<InferenceProvider, "disabled">;
      model: string;
      suggestions: InferenceSuggestion[];
      auditTrail: AuditTrailEntry[];
    }
  | {
      ok: false;
      provider: InferenceProvider;
      error: string;
      auditTrail: AuditTrailEntry[];
    };

export type EvaluationSessionStore = Partial<
  Record<number, InferenceEvaluationResponse>
>;

export type ThreatsDetectedMessage = {
  action: "THREATS_DETECTED";
  payload: ThreatRecord[];
  source: ThreatSource;
  page: PageContext;
};

export type GetCurrentThreatsMessage = {
  action: "GET_CURRENT_THREATS";
  tabId: number;
};

export type GetCurrentThreatsResponse = {
  threats: ThreatRecord[];
  evaluation: InferenceEvaluationResponse | null;
};

export type RequestManualScanMessage = {
  action: "REQUEST_MANUAL_SCAN";
};

export type RequestManualScanResponse = {
  ok: true;
  count: number;
  threats: ThreatRecord[];
  source: "manual";
};

export type RuntimeInboundMessage =
  | ThreatsDetectedMessage
  | GetCurrentThreatsMessage
  | RequestManualScanMessage;

export type UpdateThreatListBroadcast = {
  type: "UPDATE_THREAT_LIST";
  tabId: number;
  threats: ThreatRecord[];
  evaluation: InferenceEvaluationResponse | null;
};

export type UpdateInferenceResultBroadcast = {
  type: "UPDATE_INFERENCE_RESULT";
  tabId: number;
  evaluation: InferenceEvaluationResponse;
};

export type RuntimeOutboundMessage =
  | UpdateThreatListBroadcast
  | UpdateInferenceResultBroadcast;
