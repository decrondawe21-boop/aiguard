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
const SUPPRESSION_ATTRIBUTE = "data-ai-bodyguard-suppressed";
const COOKIE_NORMALIZED_ATTRIBUTE = "data-ai-bodyguard-cookie-normalized";
const COOKIE_TEXT_ATTRIBUTE = "data-ai-bodyguard-cookie-original-text";
const THREAT_ID_ATTRIBUTE = "data-ai-bodyguard-threat-id";
const THREAT_TYPE_ATTRIBUTE = "data-ai-bodyguard-threat-type";
const ORIGINAL_TEXT_ATTRIBUTE = "data-ai-bodyguard-original-text";
const ORIGINAL_STYLE_ATTRIBUTE = "data-ai-bodyguard-original-style";
const INTERVENTION_ATTRIBUTE = "data-ai-bodyguard-intervention";

const COOKIE_BANNER_SELECTOR = [
  "[id*='cookie' i]",
  "[class*='cookie' i]",
  "[id*='consent' i]",
  "[class*='consent' i]",
  "[aria-label*='cookie' i]",
  "[aria-label*='consent' i]",
].join(", ");

const COOKIE_ACCEPT_PATTERNS = [
  /accept all/i,
  /allow all/i,
  /agree/i,
  /souhlasím/i,
  /přijmout vše/i,
  /povolit vše/i,
];

const COOKIE_REJECT_PATTERNS = [
  /reject/i,
  /decline/i,
  /odmítnout/i,
  /jen nezbytné/i,
  /essential only/i,
];

const COOKIE_SETTINGS_PATTERNS = [
  /settings/i,
  /preferences/i,
  /manage/i,
  /upravit/i,
  /nastavení/i,
  /volby/i,
];

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
 */
function storeOriginalInlineStyle(element) {
  if (!element.hasAttribute(ORIGINAL_STYLE_ATTRIBUTE)) {
    element.setAttribute(ORIGINAL_STYLE_ATTRIBUTE, element.getAttribute("style") ?? "");
  }
}

/**
 * @param {HTMLElement} element
 * @param {"rewrite" | "suppress"} intervention
 */
function appendIntervention(element, intervention) {
  const current = element.getAttribute(INTERVENTION_ATTRIBUTE) ?? "";
  const parts = current
    .split("+")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!parts.includes(intervention)) {
    parts.push(intervention);
  }

  element.setAttribute(INTERVENTION_ATTRIBUTE, parts.join("+"));
}

/**
 * @param {HTMLElement} element
 * @param {string} nextText
 */
function rewriteElementText(element, nextText) {
  if (!element.hasAttribute(COOKIE_TEXT_ATTRIBUTE)) {
    element.setAttribute(COOKIE_TEXT_ATTRIBUTE, element.textContent?.trim() ?? "");
  }

  element.textContent = nextText;
}

/**
 * @param {HTMLElement} element
 * @param {"primary" | "secondary" | "tertiary"} emphasis
 */
function softenCookieControl(element, emphasis) {
  storeOriginalInlineStyle(element);
  element.style.transition = "none";
  element.style.animation = "none";
  element.style.boxShadow = "none";
  element.style.transform = "none";

  if (emphasis === "primary") {
    element.style.filter = "saturate(0.65) brightness(1.01)";
    element.style.opacity = "0.82";
  } else if (emphasis === "secondary") {
    element.style.filter = "saturate(0.85) brightness(1.02)";
    element.style.opacity = "0.92";
  } else {
    element.style.filter = "saturate(0.95) brightness(1.04)";
    element.style.opacity = "0.96";
  }
}

/**
 * @param {Element} root
 * @returns {HTMLElement[]}
 */
function getCookieControls(root) {
  /** @type {HTMLElement[]} */
  const controls = [];

  root.querySelectorAll("button, [role='button'], a").forEach((node) => {
    if (node instanceof HTMLElement && node.textContent?.trim()) {
      controls.push(node);
    }
  });

  return controls;
}

/**
 * @param {string} text
 * @param {RegExp[]} patterns
 * @returns {boolean}
 */
function matchesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

/**
 * @returns {void}
 */
function normalizeCookieBanners() {
  /** @type {NodeListOf<HTMLElement>} */
  const banners = document.querySelectorAll(COOKIE_BANNER_SELECTOR);

  banners.forEach((banner) => {
    if (banner.getAttribute(COOKIE_NORMALIZED_ATTRIBUTE) === "true") {
      return;
    }

    const controls = getCookieControls(banner);
    const acceptAllControl = controls.find((control) =>
      matchesAny(control.textContent?.trim() ?? "", COOKIE_ACCEPT_PATTERNS),
    );
    const rejectControl = controls.find((control) =>
      matchesAny(control.textContent?.trim() ?? "", COOKIE_REJECT_PATTERNS),
    );
    const settingsControl = controls.find((control) =>
      matchesAny(control.textContent?.trim() ?? "", COOKIE_SETTINGS_PATTERNS),
    );

    if (!acceptAllControl && !rejectControl && !settingsControl) {
      return;
    }

    banner.setAttribute(COOKIE_NORMALIZED_ATTRIBUTE, "true");
    banner.title = "AEGIS: Cookie banner byl upraven pro informovanější volbu soukromí.";

    if (acceptAllControl) {
      rewriteElementText(acceptAllControl, "Přijmout vše (včetně marketingu)");
      softenCookieControl(acceptAllControl, "primary");
    }

    if (rejectControl) {
      rewriteElementText(rejectControl, "Odmítnout nepovinné");
      softenCookieControl(rejectControl, "tertiary");
    }

    if (settingsControl) {
      rewriteElementText(settingsControl, "Upravit volby soukromí");
      softenCookieControl(settingsControl, "secondary");
    }
  });
}

/**
 * @param {HTMLElement} element
 * @param {ThreatType} type
 */
function applySuppression(element, type) {
  if (type !== "urgency" || element.getAttribute(SUPPRESSION_ATTRIBUTE) === "true") {
    return;
  }

  storeOriginalInlineStyle(element);
  element.setAttribute(SUPPRESSION_ATTRIBUTE, "true");
  appendIntervention(element, "suppress");

  // Tone down urgency treatments without removing the content from the page flow.
  element.style.animation = "none";
  element.style.transition = "none";
  element.style.transform = "none";
  element.style.boxShadow = "none";
  element.style.opacity = "0.78";
  element.style.filter = "saturate(0.55) contrast(0.96) brightness(1.03)";
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

  storeOriginalInlineStyle(element);
  element.setAttribute(THREAT_ID_ATTRIBUTE, threatId);
  element.setAttribute(THREAT_TYPE_ATTRIBUTE, type);
  element.setAttribute(ORIGINAL_TEXT_ATTRIBUTE, originalText);
  element.setAttribute(REWRITE_ATTRIBUTE, "true");
  appendIntervention(element, "rewrite");
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
  storeOriginalInlineStyle(element);
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
  normalizeCookieBanners();

  /** @type {NodeListOf<HTMLElement>} */
  const allElements = document.querySelectorAll("p, span, div, button");
  /** @type {ContentThreatRecord[]} */
  const threatsFound = [];

  allElements.forEach((element) => {
    const storedThreat = getStoredThreatRecord(element, source);

    if (storedThreat) {
      applySuppression(element, storedThreat.type);
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
            applySuppression(element, type);
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
