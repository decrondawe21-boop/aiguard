"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text } from "@once-ui-system/core/components/Text";
import {
  Activity,
  AlertTriangle,
  Archive,
  ChevronRight,
  Database,
  Eye,
  Lock,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Terminal,
  Unlock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ThreatStatus = "detected" | "blocked" | "quarantined";
type OpsTab = "live" | "vault";
type ThreatTypeKey = "PHISHING" | "TRACKER" | "SCRIPT" | "INJECTION";

type ThreatMeta = {
  label: string;
  icon: LucideIcon;
  badgeTone: string;
  chipTone: string;
};

type ThreatRecord = {
  id: number;
  type: ThreatTypeKey;
  target: string;
  site: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  time: string;
  status: ThreatStatus;
  quarantined: boolean;
  summary: string;
  trace: string;
};

type ChatMessage = {
  role: "ai" | "user";
  text: string;
};

const THREAT_TYPES: Record<ThreatTypeKey, ThreatMeta> = {
  PHISHING: {
    label: "Phishing Attempt",
    icon: AlertTriangle,
    badgeTone: "architecture-ops__status--danger",
    chipTone: "architecture-ops__type-chip--danger",
  },
  TRACKER: {
    label: "Hidden Tracker",
    icon: Eye,
    badgeTone: "architecture-ops__status--warning",
    chipTone: "architecture-ops__type-chip--warning",
  },
  SCRIPT: {
    label: "Malicious Script",
    icon: Terminal,
    badgeTone: "architecture-ops__status--violet",
    chipTone: "architecture-ops__type-chip--violet",
  },
  INJECTION: {
    label: "Injection Attempt",
    icon: Database,
    badgeTone: "architecture-ops__status--cool",
    chipTone: "architecture-ops__type-chip--cool",
  },
};

const INITIAL_THREATS: ThreatRecord[] = [
  {
    id: 1,
    type: "PHISHING",
    target: "login-form-01",
    site: "fake-bank-auth.com",
    severity: "Critical",
    time: "2m ago",
    status: "detected",
    quarantined: false,
    summary:
      "Falešný auth flow maskovaný jako legitimní přihlašovací obrazovka s tlakem na okamžité ověření účtu.",
    trace: "/assets/vendors.min.js:421",
  },
  {
    id: 2,
    type: "TRACKER",
    target: "pixel-track",
    site: "global-ad-net.io",
    severity: "Low",
    time: "5m ago",
    status: "blocked",
    quarantined: false,
    summary:
      "Skrytý pixel sbírá přítomnost v DOMu a návaznost na reklamní identitu napříč sessions.",
    trace: "/collect/pixel.js:88",
  },
  {
    id: 3,
    type: "SCRIPT",
    target: "crypto-miner.js",
    site: "shady-downloads.net",
    severity: "High",
    time: "12m ago",
    status: "detected",
    quarantined: false,
    summary:
      "Agresivní script chain mění DOM a připojuje dodatečné third-party payloady mimo primární flow stránky.",
    trace: "/runtime/chunk-guard.js:219",
  },
  {
    id: 4,
    type: "INJECTION",
    target: "offer-query-param",
    site: "promo-checkout.cloud",
    severity: "Medium",
    time: "18m ago",
    status: "quarantined",
    quarantined: true,
    summary:
      "Pokus o injektáž škodlivého parametru do checkout logiky s cílem obejít validaci a vložit falešnou urgenci.",
    trace: "/checkout/resolve-offer.ts:144",
  },
];

function StatusBadge({ status }: { status: ThreatStatus }) {
  const toneClass =
    status === "detected"
      ? "architecture-ops__status--danger"
      : status === "blocked"
        ? "architecture-ops__status--safe"
        : "architecture-ops__status--vault";

  return (
    <span className={`architecture-ops__status ${toneClass}`}>
      {status}
    </span>
  );
}

export function AiGuardOpsConsole() {
  const [activeTab, setActiveTab] = useState<OpsTab>("live");
  const [threats, setThreats] = useState<ThreatRecord[]>(INITIAL_THREATS);
  const [selectedThreatId, setSelectedThreatId] = useState<number>(INITIAL_THREATS[0].id);
  const [scanProgress, setScanProgress] = useState(18);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Analyzoval jsem vybraný objekt. Můžu vysvětlit důvod označení, doporučený zásah nebo riziko ponechání v DOMu.",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const visibleThreats = useMemo(
    () => threats.filter((threat) => (activeTab === "live" ? !threat.quarantined : threat.quarantined)),
    [activeTab, threats],
  );

  const selectedThreat =
    visibleThreats.find((threat) => threat.id === selectedThreatId) ??
    visibleThreats[0] ??
    threats[0];

  useEffect(() => {
    if (!selectedThreat) return;

    const stillVisible = visibleThreats.some((threat) => threat.id === selectedThreatId);
    if (!stillVisible) {
      setSelectedThreatId(selectedThreat.id);
    }
  }, [selectedThreat, selectedThreatId, visibleThreats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setScanProgress((previous) => (previous >= 100 ? 0 : previous + 1));
    }, 280);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleIsolate = (id: number) => {
    setThreats((previous) =>
      previous.map((threat) =>
        threat.id === id
          ? { ...threat, status: "quarantined", quarantined: true }
          : threat,
      ),
    );
  };

  const handleRestore = (id: number) => {
    setThreats((previous) =>
      previous.map((threat) =>
        threat.id === id
          ? { ...threat, status: "detected", quarantined: false }
          : threat,
      ),
    );
  };

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = chatInput.trim();
    if (!trimmed || !selectedThreat) return;

    setChatHistory((previous) => [...previous, { role: "user", text: trimmed }]);
    setChatInput("");

    window.setTimeout(() => {
      setChatHistory((previous) => [
        ...previous,
        {
          role: "ai",
          text: `${THREAT_TYPES[selectedThreat.type].label} na ${selectedThreat.site} využívá pattern "${selectedThreat.target}". Doporučení: ${selectedThreat.quarantined ? "ponechat v trezoru a auditovat původ" : "izolovat a připravit neutral rewrite"} .`,
        },
      ]);
    }, 820);
  };

  const selectedMeta = THREAT_TYPES[selectedThreat.type];
  const SelectedIcon = selectedMeta.icon;
  const quarantinedCount = threats.filter((threat) => threat.quarantined).length;

  return (
    <section className="architecture-ops surface-inset">
      <div className="architecture-ops__header">
        <div className="architecture-ops__meta">
          <Text as="span" className="architecture-card__eyebrow">
            Live Product Layer
          </Text>
          <Text as="h3" className="architecture-card__title">
            Ops console pro aktivní obranu
          </Text>
          <Text as="p" className="architecture-card__copy">
            Simulovaná produktová vrstva nad reálným DOMem: threat feed, karanténa objektů,
            forenzní asistent a explicitní zásahový loop mezi detekcí a izolací.
          </Text>
        </div>
        <div className="architecture-ops__session-strip">
          <div className="architecture-ops__session-item">
            <span className="architecture-ops__session-value">98%</span>
            <span className="architecture-ops__session-label">Engine depth</span>
          </div>
          <div className="architecture-ops__session-item">
            <span className="architecture-ops__session-value">{threats.length}</span>
            <span className="architecture-ops__session-label">Tracked objects</span>
          </div>
          <div className="architecture-ops__session-item architecture-ops__session-item--safe">
            <span className="architecture-ops__session-value">Encrypted</span>
            <span className="architecture-ops__session-label">Secure link</span>
          </div>
        </div>
      </div>

      <div className="architecture-ops__grid">
        <div className="architecture-ops__feed-shell">
          <div className="architecture-ops__panel-header">
            <div>
              <Text as="span" className="architecture-card__eyebrow">
                Threat Feed
              </Text>
              <Text as="p" className="architecture-ops__panel-copy">
                {activeTab === "live"
                  ? "Monitoring aktivních DOM mutací a podezřelých requestů."
                  : "Objekty přesunuté do izolovaného trezoru mimo hlavní flow stránky."}
              </Text>
            </div>
            <div className="architecture-ops__tab-toggle">
              <button
                type="button"
                className={`architecture-ops__tab-button${activeTab === "live" ? " architecture-ops__tab-button--active" : ""}`}
                onClick={() => setActiveTab("live")}
              >
                <Activity size={13} />
                <span>Live Monitor</span>
              </button>
              <button
                type="button"
                className={`architecture-ops__tab-button${activeTab === "vault" ? " architecture-ops__tab-button--active architecture-ops__tab-button--vault" : ""}`}
                onClick={() => setActiveTab("vault")}
              >
                <Lock size={13} />
                <span>Security Vault</span>
                {quarantinedCount > 0 ? (
                  <span className="architecture-ops__counter">{quarantinedCount}</span>
                ) : null}
              </button>
            </div>
          </div>

          {activeTab === "live" ? (
            <div className="architecture-ops__scan-row">
              <div className="architecture-ops__scan-meta">
                <span className="architecture-ops__scan-label">Neural sweep</span>
                <span className="architecture-ops__scan-value">{scanProgress}%</span>
              </div>
              <div className="architecture-ops__scan-bar">
                <div
                  className="architecture-ops__scan-fill"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="architecture-ops__list architecture-scrollbar">
            {visibleThreats.length > 0 ? (
              visibleThreats.map((threat) => {
                const meta = THREAT_TYPES[threat.type];
                const Icon = meta.icon;
                const isActive = threat.id === selectedThreat.id;

                return (
                  <button
                    key={threat.id}
                    type="button"
                    className={`architecture-ops__list-item${isActive ? " architecture-ops__list-item--active" : ""}`}
                    onClick={() => setSelectedThreatId(threat.id)}
                  >
                    <span className={`architecture-ops__type-chip ${meta.chipTone}`}>
                      <Icon size={18} />
                    </span>

                    <span className="architecture-ops__list-body">
                      <span className="architecture-ops__list-topline">
                        <span className="architecture-ops__list-title">{meta.label}</span>
                        <StatusBadge status={threat.status} />
                      </span>
                      <span className="architecture-ops__list-copy">
                        {threat.site} | {threat.target}
                      </span>
                    </span>

                    <span className="architecture-ops__list-side">
                      <span className="architecture-ops__list-time">{threat.time}</span>
                      <ChevronRight size={15} className="architecture-ops__list-arrow" />
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="architecture-ops__empty-state">
                {activeTab === "live" ? (
                  <ShieldCheck size={42} className="text-emerald-300/72" />
                ) : (
                  <Archive size={42} className="text-cyan-300/72" />
                )}
                <Text as="p" className="architecture-ops__empty-title">
                  {activeTab === "live" ? "Aktivní feed je čistý" : "Trezor je prázdný"}
                </Text>
                <Text as="p" className="architecture-ops__empty-copy">
                  {activeTab === "live"
                    ? "Aktuálně nebyly zachyceny žádné nové manipulační objekty."
                    : "Žádný objekt zatím nebyl přesunut do izolace."}
                </Text>
              </div>
            )}
          </div>
        </div>

        <div className="architecture-ops__inspector-shell">
          <div className="architecture-ops__panel-header">
            <div>
              <Text as="span" className="architecture-card__eyebrow">
                Object Inspector
              </Text>
              <Text as="p" className="architecture-ops__panel-copy">
                Forenzní výklad, stav izolace a technický dump vybraného objektu.
              </Text>
            </div>
            <div className="architecture-ops__indicator-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="architecture-ops__inspector-scroll architecture-scrollbar">
            <div className="architecture-ops__identity">
              <span className={`architecture-ops__identity-icon ${selectedMeta.chipTone}`}>
                <SelectedIcon size={28} />
              </span>
              <Text as="h4" className="architecture-ops__identity-title">
                {selectedMeta.label}
              </Text>
              <Text as="p" className="architecture-ops__identity-site">
                {selectedThreat.site}
              </Text>
              <div className="architecture-ops__identity-meta">
                <span>Severity: {selectedThreat.severity}</span>
                <span>Target: {selectedThreat.target}</span>
              </div>
              <div className="architecture-ops__action-row">
                {selectedThreat.quarantined ? (
                  <button
                    type="button"
                    className="architecture-ops__action architecture-ops__action--restore"
                    onClick={() => handleRestore(selectedThreat.id)}
                  >
                    <Unlock size={14} />
                    <span>Uvolnit z trezoru</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="architecture-ops__action architecture-ops__action--isolate"
                    onClick={() => handleIsolate(selectedThreat.id)}
                  >
                    <Lock size={14} />
                    <span>Izolovat objekt</span>
                  </button>
                )}
              </div>
            </div>

            <div className="architecture-ops__inspector-card">
              <div className="architecture-ops__section-heading">
                <MessageSquare size={14} className="text-cyan-300/78" />
                <span>AI Forensic Assistant</span>
              </div>

              <div className="architecture-ops__chat-shell">
                <div className="architecture-ops__chat-log architecture-scrollbar">
                  {chatHistory.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`architecture-ops__chat-row${message.role === "user" ? " architecture-ops__chat-row--user" : ""}`}
                    >
                      <div
                        className={`architecture-ops__chat-bubble${message.role === "user" ? " architecture-ops__chat-bubble--user" : ""}`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <form className="architecture-ops__chat-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Zeptej se na detaily hrozby..."
                    className="architecture-ops__chat-input"
                  />
                  <button type="submit" className="architecture-ops__chat-submit" aria-label="Send message">
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>

            <div className="architecture-ops__inspector-card architecture-ops__inspector-card--dump">
              <div className="architecture-ops__dump-header">
                <span>DUMP_ANALYSIS_V4</span>
                <Search size={12} />
              </div>
              <div className="architecture-ops__dump-lines">
                <p>
                  <span className="architecture-ops__dump-key">INIT:</span> handshake_syn_ack
                </p>
                <p>
                  <span className="architecture-ops__dump-key architecture-ops__dump-key--warn">WARN:</span>{" "}
                  unexpected_dom_mutation
                </p>
                <p>
                  <span className="architecture-ops__dump-prefix">&gt;&gt;</span> trace: {selectedThreat.trace}
                </p>
                <p>
                  <span className="architecture-ops__dump-prefix">&gt;&gt;</span> target: {selectedThreat.target}
                </p>
                <p>
                  <span className="architecture-ops__dump-prefix">&gt;&gt;</span> summary: {selectedThreat.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="architecture-ops__footer">
            <Text as="span" className="architecture-ops__footer-label">
              Secure-Link Active
            </Text>
            <div className="architecture-ops__footer-meter">
              <span style={{ width: "68%" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
