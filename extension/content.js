// @ts-check
/// <reference types="chrome" />

/**
 * @typedef {import("../src/lib/ai-guard/contracts").PageContext} PageContext
 * @typedef {import("../src/lib/ai-guard/contracts").RequestManualScanMessage} ContentRequestManualScanMessage
 * @typedef {import("../src/lib/ai-guard/contracts").RequestManualScanResponse} ContentRequestManualScanResponse
 * @typedef {import("../src/lib/ai-guard/contracts").ThreatRecord} ContentThreatRecord
 * @typedef {import("../src/lib/ai-guard/contracts").ThreatSource} ThreatSource
 * @typedef {import("../src/lib/ai-guard/contracts").ThreatType} ThreatType
 * @typedef {import("../src/lib/ai-guard/contracts").ThreatsDetectedMessage} ThreatsDetectedMessage
 */

/** @type {Record<ThreatType, RegExp[]>} */
const THREAT_PATTERNS = {
  urgency: [
    /pouze dnes/i,
    /vyprší za/i,
    /poslední šance/i,
    /limited offer/i,
    /seconds left/i,
  ],
  scarcity: [
    /poslední kus/i,
    /skladem pouze/i,
    /ostatní si právě prohlížejí/i,
    /only \d left/i,
  ],
  social_proof: [/právě zakoupil/i, /x lidí si prohlíží/i, /v košíku má/i],
};

const BADGE_ATTRIBUTE = "data-ai-bodyguard-detected";
const REWRITE_ATTRIBUTE = "data-ai-bodyguard-rewritten";
const THREAT_ID_ATTRIBUTE = "data-ai-bodyguard-threat-id";
const THREAT_TYPE_ATTRIBUTE = "data-ai-bodyguard-threat-type";
const ORIGINAL_TEXT_ATTRIBUTE = "data-ai-bodyguard-original-text";
const INTERVENTION_ATTRIBUTE = "data-ai-bodyguard-intervention";

/** @type {ReturnType<typeof globalThis.setTimeout> | undefined} */
let scanTimer;

/**
 * @param {HTMLElement} element
 * @returns {string}
 */
function createElementSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }

  const tag = element.tagName.toLowerCase();
  const classes = [...element.classList].slice(0, 2);

  if (classes.length > 0) {
    return `${tag}.${classes.join(".")}`;
  }

  return tag;
}

/**
 * @param {ThreatType} type
 * @returns {number}
 */
function getThreatConfidence(type) {
  switch (type) {
    case "urgency":
      return 0.88;
    case "scarcity":
      return 0.82;
    case "social_proof":
      return 0.78;
    default:
      return 0.7;
  }
}

/**
 * @param {ThreatType} type
 * @returns {"low" | "medium" | "high"}
 */
function getThreatSeverity(type) {
  switch (type) {
    case "urgency":
      return "high";
    case "scarcity":
      return "medium";
    case "social_proof":
      return "medium";
    default:
      return "low";
  }
}

/**
 * @param {ContentThreatRecord[]} threats
 * @returns {ContentThreatRecord[]}
 */
function normalizeThreats(threats) {
  const seen = new Set();

  return threats.filter((threat) => {
    const key = `${threat.type}:${threat.text}:${threat.selector ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * @param {ThreatType} type
 * @param {string} originalText
 * @returns {string}
 */
function getNeutralizedCopy(type, originalText) {
  switch (type) {
    case "urgency":
      return "Prodejce uvádí časově omezenou nabídku. Doporučeno ověřit podmínky bez tlaku na okamžitou akci.";
    case "scarcity":
      return "Prodejce uvádí omezenou dostupnost. Doporučeno ověřit skutečný stav zásob a porovnat nabídku.";
    case "social_proof":
      return "Stránka používá sociální důkaz jako nákupní stimul. Berte tvrzení o aktivitě ostatních s rezervou.";
    default:
      return originalText;
  }
}

/**
 * @param {HTMLElement} element
 * @param {ThreatType} type
 * @param {string} originalText
 * @returns {string}
 */
function applyRewrite(element, type, originalText) {
  const threatId = element.getAttribute(THREAT_ID_ATTRIBUTE) ?? crypto.randomUUID();
  const neutralizedText = getNeutralizedCopy(type, originalText);

  element.setAttribute(THREAT_ID_ATTRIBUTE, threatId);
  element.setAttribute(THREAT_TYPE_ATTRIBUTE, type);
  element.setAttribute(ORIGINAL_TEXT_ATTRIBUTE, originalText);
  element.setAttribute(REWRITE_ATTRIBUTE, "true");
  element.setAttribute(INTERVENTION_ATTRIBUTE, "rewrite");
  element.textContent = neutralizedText;

  return threatId;
}

/**
 * @param {HTMLElement} element
 * @param {ThreatSource} source
 * @returns {ContentThreatRecord | null}
 */
function getStoredThreatRecord(element, source) {
  const threatId = element.getAttribute(THREAT_ID_ATTRIBUTE);
  const type = element.getAttribute(THREAT_TYPE_ATTRIBUTE);
  const originalText = element.getAttribute(ORIGINAL_TEXT_ATTRIBUTE);

  if (!threatId || !type || !originalText) {
    return null;
  }

  /** @type {ThreatType | null} */
  const normalizedType =
    type === "urgency" || type === "scarcity" || type === "social_proof" ? type : null;

  if (!normalizedType) {
    return null;
  }

  return {
    id: threatId,
    type: normalizedType,
    text: originalText,
    source,
    selector: createElementSelector(element),
    confidence: getThreatConfidence(normalizedType),
    severity: getThreatSeverity(normalizedType),
  };
}

/**
 * @param {HTMLElement} element
 * @param {ThreatType} type
 */
function highlightThreat(element, type) {
  element.style.outline = "2px dashed #ef4444";
  element.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
  element.title = `AEGIS: Detekována technika ${type}`;

  if (!element.getAttribute(BADGE_ATTRIBUTE)) {
    const shieldBadge = document.createElement("span");
    shieldBadge.textContent = " ⚠️";
    shieldBadge.style.fontSize = "0.8rem";
    element.appendChild(shieldBadge);
    element.setAttribute(BADGE_ATTRIBUTE, "true");
  }
}

/**
 * @param {ThreatSource} source
 * @returns {PageContext}
 */
function getPageContext(source) {
  return {
    url: window.location.href,
    title: document.title || "Untitled page",
    scannedAt: new Date().toISOString(),
    locale: document.documentElement.lang || (source === "manual" ? "cs" : undefined),
  };
}

/**
 * @param {ThreatSource} [source]
 * @returns {ContentThreatRecord[]}
 */
function scanForCognitiveThreats(source = "auto") {
  /** @type {NodeListOf<HTMLElement>} */
  const allElements = document.querySelectorAll("p, span, div, button");
  /** @type {ContentThreatRecord[]} */
  const threatsFound = [];

  allElements.forEach((element) => {
    const storedThreat = getStoredThreatRecord(element, source);

    if (storedThreat) {
      highlightThreat(element, storedThreat.type);
      threatsFound.push(storedThreat);
      return;
    }

    if (
      element.innerText &&
      element.innerText.length < 200 &&
      element.children.length === 0
    ) {
      const text = element.innerText.trim();

      /** @type {[ThreatType, RegExp[]][]} */
      const entries = /** @type {[ThreatType, RegExp[]][]} */ (Object.entries(THREAT_PATTERNS));

      for (const [type, patterns] of entries) {
        for (const pattern of patterns) {
          if (pattern.test(text)) {
            const threatId = applyRewrite(element, type, text);
            highlightThreat(element, type);
            threatsFound.push({
              id: threatId,
              type,
              text,
              source,
              selector: createElementSelector(element),
              confidence: getThreatConfidence(type),
              severity: getThreatSeverity(type),
            });
            break;
          }
        }
      }
    }
  });

  const normalizedThreats = normalizeThreats(threatsFound);

  /** @type {ThreatsDetectedMessage} */
  const payload = {
    action: "THREATS_DETECTED",
    payload: normalizedThreats,
    source,
    page: getPageContext(source),
  };

  void chrome.runtime.sendMessage(payload);
  return normalizedThreats;
}

/**
 * @param {ThreatSource} [source]
 */
function scheduleScan(source = "mutation") {
  globalThis.clearTimeout(scanTimer);
  scanTimer = globalThis.setTimeout(() => {
    scanForCognitiveThreats(source);
  }, 300);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  /** @type {ContentRequestManualScanMessage} */
  const runtimeMessage = message;

  if (runtimeMessage.action === "REQUEST_MANUAL_SCAN") {
    const threats = scanForCognitiveThreats("manual");
    /** @type {ContentRequestManualScanResponse} */
    const response = {
      ok: true,
      count: threats.length,
      threats,
      source: "manual",
    };

    sendResponse(response);
    return true;
  }

  return false;
});

window.addEventListener("load", () => {
  globalThis.setTimeout(() => scanForCognitiveThreats("load"), 2000);

  const observer = new MutationObserver(() => {
    scheduleScan("mutation");
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
});

console.log("🛡️ AEGIS: Content script aktivní.");
