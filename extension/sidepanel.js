// @ts-check
/// <reference types="chrome" />

/**
 * @typedef {import("../src/lib/ai-guard/contracts").GetCurrentThreatsResponse} GetCurrentThreatsResponse
 * @typedef {import("../src/lib/ai-guard/contracts").InferenceEvaluationResponse} InferenceEvaluationResponse
 * @typedef {import("../src/lib/ai-guard/contracts").RequestManualScanResponse} SidepanelRequestManualScanResponse
 * @typedef {import("../src/lib/ai-guard/contracts").RuntimeOutboundMessage} RuntimeOutboundMessage
 * @typedef {import("../src/lib/ai-guard/contracts").ThreatRecord} SidepanelThreatRecord
 */

/** @type {HTMLButtonElement[]} */
const tabButtons = [...document.querySelectorAll("[data-tab-target]")].filter(
  (node) => node instanceof HTMLButtonElement,
);
/** @type {HTMLElement[]} */
const tabContents = [...document.querySelectorAll(".tab-content")].filter(
  (node) => node instanceof HTMLElement,
);
const logContainer = document.getElementById("log-container");
const threatList = document.getElementById("threat-list");
const analyticsBreakdown = document.getElementById("analytics-breakdown");
const counterThreats = document.getElementById("counter-threats");
const securityScore = document.getElementById("security-score");
const privacyScore = document.getElementById("privacy-score");
const cognitiveScore = document.getElementById("cognitive-score");
const privacyFill = document.getElementById("privacy-fill");
const cognitiveFill = document.getElementById("cognitive-fill");
const scanLine = document.getElementById("scan-line");
const webContent = document.getElementById("web-content");
const detectedThreat = document.getElementById("detected-threat");
const runScanButton = document.getElementById("run-scan");
const refreshThreatsButton = document.getElementById("refresh-threats");
const openScanTabButton = document.getElementById("open-scan-tab");
const startProtectionButton = document.getElementById("start-protection");

/** @type {number | null} */
let activeTabId = null;
/** @type {SidepanelThreatRecord[]} */
let currentThreats = [];
/** @type {InferenceEvaluationResponse | null} */
let currentEvaluation = null;
/** @type {{ timestamp: string; message: string }[]} */
const logs = [];
/** @type {string | null} */
let lastEvaluationLogKey = null;

tabButtons.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tabTarget ?? "", button));
});

openScanTabButton?.addEventListener("click", () => {
  const button = tabButtons.find((item) => item.dataset.tabTarget === "live-scan");
  if (button) switchTab("live-scan", button);
});

startProtectionButton?.addEventListener("click", async () => {
  await refreshThreats();
  appendLog("Protection handshake completed. Passive monitoring online.");
});

runScanButton?.addEventListener("click", async () => {
  startScanAnimation();
  const threats = await requestManualScan();
  if (threats) {
    currentThreats = threats;
    renderThreats();
    appendLog(`Manual scan completed. ${threats.length} threat(s) detected.`);
  }
});

refreshThreatsButton?.addEventListener("click", async () => {
  await refreshThreats();
  appendLog("Threat cache refreshed from active tab.");
});

chrome.runtime.onMessage.addListener((message) => {
  /** @type {RuntimeOutboundMessage} */
  const runtimeMessage = message;

  if (runtimeMessage.type === "UPDATE_THREAT_LIST" && runtimeMessage.tabId === activeTabId) {
    currentThreats = runtimeMessage.threats;
    currentEvaluation = runtimeMessage.evaluation;
    renderThreats();
    appendLog(`Live update received. ${currentThreats.length} threat(s) in current tab.`);
  }

  if (
    runtimeMessage.type === "UPDATE_INFERENCE_RESULT" &&
    runtimeMessage.tabId === activeTabId
  ) {
    currentEvaluation = runtimeMessage.evaluation;
    appendInferenceLog(runtimeMessage.evaluation);
  }
});

chrome.tabs.onActivated?.addListener(async () => {
  await hydrateActiveTab();
  await refreshThreats();
});

chrome.tabs.onUpdated?.addListener(async (tabId, changeInfo) => {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    await refreshThreats();
  }
});

void hydrateActiveTab().then(refreshThreats);

/**
 * @param {string} id
 * @param {HTMLButtonElement} button
 */
function switchTab(id, button) {
  tabContents.forEach((content) => {
    content.classList.toggle("active", content.id === id);
  });

  tabButtons.forEach((tabButton) => {
    tabButton.classList.toggle("active", tabButton === button);
  });
}

async function hydrateActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  activeTabId = tab?.id ?? null;
}

async function refreshThreats() {
  if (!activeTabId) {
    currentThreats = [];
    currentEvaluation = null;
    renderThreats();
    return;
  }

  /** @type {GetCurrentThreatsResponse} */
  const response = await chrome.runtime.sendMessage({
    action: "GET_CURRENT_THREATS",
    tabId: activeTabId,
  });

  currentThreats = response?.threats ?? [];
  currentEvaluation = response?.evaluation ?? null;
  renderThreats();
}

/**
 * @returns {Promise<SidepanelThreatRecord[] | null>}
 */
async function requestManualScan() {
  if (!activeTabId) return null;

  try {
    /** @type {SidepanelRequestManualScanResponse} */
    const response = await chrome.tabs.sendMessage(activeTabId, {
      action: "REQUEST_MANUAL_SCAN",
    });

    finishScanAnimation();
    return response?.threats ?? [];
  } catch (error) {
    void error;
    finishScanAnimation();
    appendLog("Manual scan failed. Content script is not available on this tab.");
    return null;
  }
}

function renderThreats() {
  const totalThreats = currentThreats.length;
  if (counterThreats) {
    counterThreats.textContent = totalThreats.toLocaleString("cs-CZ");
  }

  if (!threatList || !analyticsBreakdown) {
    return;
  }

  if (!totalThreats) {
    threatList.innerHTML = '<div class="panel-empty">Žádné aktivní hrozby na aktuální kartě.</div>';
    analyticsBreakdown.innerHTML = '<div class="panel-empty">Žádná data k rozložení hrozeb.</div>';
    updateScores(100, 96);
    return;
  }

  /** @type {Record<string, number>} */
  const grouped = currentThreats.reduce((acc, threat) => {
    acc[threat.type] = (acc[threat.type] || 0) + 1;
    return acc;
  }, /** @type {Record<string, number>} */ ({}));

  threatList.innerHTML = currentThreats
    .slice(0, 8)
    .map(
      (threat) => `
        <article class="threat-item">
          <div class="threat-item__meta">
            <span class="threat-item__type">${threat.type}</span>
            <span>${threat.text.length} chars</span>
          </div>
          <div class="threat-item__text">${escapeHtml(threat.text)}</div>
        </article>
      `,
    )
    .join("");

  const max = Math.max(...Object.values(grouped));
  analyticsBreakdown.innerHTML = Object.entries(grouped)
    .map(
      ([type, count]) => `
        <article class="analytics-item">
          <div class="analytics-item__meta">
            <span>${type}</span>
            <span>${count}</span>
          </div>
          <div class="analytics-item__bar">
            <div class="analytics-item__fill" style="width:${(count / max) * 100}%"></div>
          </div>
        </article>
      `,
    )
    .join("");

  const integrity = Math.max(72, 100 - totalThreats * 2);
  const privacy = Math.max(76, 100 - totalThreats);
  const cognitive = Math.max(68, 96 - totalThreats * 1.4);
  updateScores(integrity, privacy, cognitive);

  if (currentEvaluation) {
    appendInferenceLog(currentEvaluation);
  }
}

/**
 * @param {InferenceEvaluationResponse} evaluation
 */
function appendInferenceLog(evaluation) {
  const evaluationKey = JSON.stringify(evaluation);
  if (lastEvaluationLogKey === evaluationKey) {
    return;
  }

  lastEvaluationLogKey = evaluationKey;

  if (evaluation.ok) {
    const actionSummary = evaluation.suggestions
      .map((suggestion) => `${suggestion.action}:${suggestion.threatId}`)
      .join(", ");

    appendLog(
      `Inference bridge: ${evaluation.suggestions.length} suggestion(s) from ${evaluation.model}${actionSummary ? ` [${actionSummary}]` : ""}.`,
    );
    evaluation.auditTrail.forEach((entry) => {
      appendLog(`${entry.stage.toUpperCase()} ${entry.level.toUpperCase()}: ${entry.message}`);
    });
    return;
  }

  appendLog(`Inference bridge unavailable: ${evaluation.error}`);
  evaluation.auditTrail.forEach((entry) => {
    appendLog(`${entry.stage.toUpperCase()} ${entry.level.toUpperCase()}: ${entry.message}`);
  });
}

/**
 * @param {number} integrity
 * @param {number} [privacy]
 * @param {number} [cognitive]
 */
function updateScores(integrity, privacy = 100, cognitive = 96) {
  if (securityScore) securityScore.textContent = integrity.toFixed(1);
  if (privacyScore) privacyScore.textContent = `${Math.round(privacy)}%`;
  if (cognitiveScore) cognitiveScore.textContent = `${Math.round(cognitive)}%`;
  if (privacyFill) privacyFill.style.width = `${privacy}%`;
  if (cognitiveFill) cognitiveFill.style.width = `${cognitive}%`;
}

/**
 * @param {string} message
 */
function appendLog(message) {
  if (!logContainer) return;

  const timestamp = new Date().toLocaleTimeString("cs-CZ");
  logs.unshift({ timestamp, message });
  logs.splice(18);

  logContainer.innerHTML = logs
    .map(
      (entry) => `
        <div class="log-entry">
          <span class="log-entry__time">[${entry.timestamp}]</span> ${escapeHtml(entry.message)}
        </div>
      `,
    )
    .join("");
}

function startScanAnimation() {
  if (!scanLine || !webContent || !detectedThreat) return;

  scanLine.classList.remove("is-active");
  void scanLine.offsetWidth;
  scanLine.classList.add("is-active");
  webContent.classList.add("is-active");
  detectedThreat.classList.remove("is-visible");
}

function finishScanAnimation() {
  if (!scanLine || !detectedThreat) return;

  globalThis.setTimeout(() => {
    scanLine.classList.remove("is-active");
    detectedThreat.classList.add("is-visible");
  }, 1650);
}

/**
 * @param {string} value
 */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
