// @ts-check
/// <reference types="chrome" />

import { evaluateThreatBundle } from "./inference-bridge.js";

/**
 * @typedef {import("../src/lib/ai-guard/contracts").EvaluationSessionStore} EvaluationSessionStore
 * @typedef {import("../src/lib/ai-guard/contracts").GetCurrentThreatsMessage} GetCurrentThreatsMessage
 * @typedef {import("../src/lib/ai-guard/contracts").GetCurrentThreatsResponse} GetCurrentThreatsResponse
 * @typedef {import("../src/lib/ai-guard/contracts").InferenceEvaluationResponse} InferenceEvaluationResponse
 * @typedef {import("../src/lib/ai-guard/contracts").RuntimeInboundMessage} RuntimeInboundMessage
 * @typedef {import("../src/lib/ai-guard/contracts").ThreatSessionStore} ThreatSessionStore
 * @typedef {import("../src/lib/ai-guard/contracts").ThreatsDetectedMessage} ThreatsDetectedMessage
 * @typedef {import("../src/lib/ai-guard/contracts").UpdateInferenceResultBroadcast} UpdateInferenceResultBroadcast
 * @typedef {import("../src/lib/ai-guard/contracts").UpdateThreatListBroadcast} UpdateThreatListBroadcast
 */

/** @type {ThreatSessionStore} */
const currentSessionThreats = {};

/** @type {EvaluationSessionStore} */
const currentSessionEvaluations = {};

chrome.runtime.onInstalled.addListener(() => {
  console.log("🛡️ AI Bodyguard: Service Worker inicializován.");

  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((/** @type {unknown} */ error) => console.error(error));
});

chrome.runtime.onMessage.addListener((/** @type {RuntimeInboundMessage} */ message, sender, sendResponse) => {
  /** @type {RuntimeInboundMessage} */
  const runtimeMessage = message;
  const tabId = sender.tab?.id ?? null;

  switch (runtimeMessage.action) {
    case "THREATS_DETECTED": {
      if (tabId === null) break;
      void handleThreatDetection(tabId, runtimeMessage);
      break;
    }

    case "GET_CURRENT_THREATS": {
      const response = getCurrentThreatsResponse(runtimeMessage);
      sendResponse(response);
      return true;
    }

    default:
      console.warn("Neznámá akce:", /** @type {{ action?: string }} */ (runtimeMessage).action);
  }

  return false;
});

/**
 * @param {number} tabId
 * @param {ThreatsDetectedMessage} message
 */
async function handleThreatDetection(tabId, message) {
  currentSessionThreats[tabId] = message.payload;

  await broadcastThreatList(tabId);

  const evaluation = await evaluateThreatBundle({
    page: message.page,
    threats: message.payload,
  });

  if (!evaluation) {
    return;
  }

  currentSessionEvaluations[tabId] = evaluation;
  await broadcastInferenceResult(tabId, evaluation);
}

/**
 * @param {GetCurrentThreatsMessage} message
 * @returns {GetCurrentThreatsResponse}
 */
function getCurrentThreatsResponse(message) {
  return {
    threats: currentSessionThreats[message.tabId] ?? [],
    evaluation: currentSessionEvaluations[message.tabId] ?? null,
  };
}

/**
 * @param {number} tabId
 * @returns {Promise<void>}
 */
async function broadcastThreatList(tabId) {
  /** @type {UpdateThreatListBroadcast} */
  const payload = {
    type: "UPDATE_THREAT_LIST",
    tabId,
    threats: currentSessionThreats[tabId] ?? [],
    evaluation: currentSessionEvaluations[tabId] ?? null,
  };

  await broadcastToUI(payload);
}

/**
 * @param {number} tabId
 * @param {InferenceEvaluationResponse} evaluation
 * @returns {Promise<void>}
 */
async function broadcastInferenceResult(tabId, evaluation) {
  /** @type {UpdateInferenceResultBroadcast} */
  const payload = {
    type: "UPDATE_INFERENCE_RESULT",
    tabId,
    evaluation,
  };

  await broadcastToUI(payload);
}

/**
 * @param {UpdateThreatListBroadcast | UpdateInferenceResultBroadcast} data
 */
async function broadcastToUI(data) {
  try {
    await chrome.runtime.sendMessage(data);
  } catch (error) {
    void error;
  }
}

chrome.tabs.onRemoved.addListener((/** @type {number} */ tabId) => {
  delete currentSessionThreats[tabId];
  delete currentSessionEvaluations[tabId];
});

console.log("🛰️ AI Bodyguard: Background Engine běží.");
