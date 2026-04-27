// @ts-check
/// <reference types="chrome" />

/**
 * @typedef {import("../src/lib/ai-guard/contracts").InferenceBridgeConfig} InferenceBridgeConfig
 * @typedef {import("../src/lib/ai-guard/contracts").InferenceEvaluationRequest} InferenceEvaluationRequest
 * @typedef {import("../src/lib/ai-guard/contracts").InferenceEvaluationResponse} InferenceEvaluationResponse
 * @typedef {import("../src/lib/ai-guard/contracts").PageContext} PageContext
 * @typedef {import("../src/lib/ai-guard/contracts").ThreatRecord} ThreatRecord
 * @typedef {{ page: PageContext; threats: ThreatRecord[] }} EvaluateThreatBundleInput
 */

/** @type {InferenceBridgeConfig} */
const defaultBridgeConfig = {
  enabled: false,
  provider: "disabled",
  interventionMode: "flag",
  timeoutMs: 3500,
};

async function getBridgeConfig() {
  const stored = await chrome.storage.local.get("inferenceBridge");
  const value = stored.inferenceBridge;

  if (!value || typeof value !== "object") {
    return defaultBridgeConfig;
  }

  return {
    ...defaultBridgeConfig,
    ...value,
  };
}

/**
 * @param {EvaluateThreatBundleInput} input
 * @returns {Promise<InferenceEvaluationResponse | null>}
 */
export async function evaluateThreatBundle(input) {
  const config = await getBridgeConfig();

  if (!config.enabled || config.provider === "disabled" || !config.endpoint) {
    return null;
  }

  /** @type {InferenceEvaluationRequest} */
  const payload = {
    page: input.page,
    threats: input.threats,
    config: {
      provider: config.provider,
      model: config.model,
      interventionMode: config.interventionMode,
    },
  };

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), config.timeoutMs ?? 3500);

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        provider: config.provider,
        error: `Bridge request failed with ${response.status}.`,
        auditTrail: [
          {
            id: crypto.randomUUID(),
            at: new Date().toISOString(),
            stage: "bridge",
            level: "warn",
            message: `Inference bridge returned HTTP ${response.status}.`,
          },
        ],
      };
    }

    /** @type {InferenceEvaluationResponse} */
    const result = await response.json();
    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown local inference bridge failure.";

    return {
      ok: false,
      provider: config.provider,
      error: message,
      auditTrail: [
        {
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          stage: "bridge",
          level: "critical",
          message,
        },
      ],
    };
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}
