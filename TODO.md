# TODO

## Navigation / Shell

- Ověřit desktop `MegaMenu` přímo ve viewportu po zvýšení `z-index`, hlavně aby dropdown nikdy nepadal pod hero nebo section panely.
- Doladit tablet breakpoint mezi burger navigací a desktop `MegaMenu`, aby lišta nepůsobila přecpaně na šířkách mezi mobile a `xl`.
- Dokončeno: výraznější `active route` stav pro desktop i mobile navigaci.

## AI Guard Product UI

- Dokončeno: AI Guard landing page má nový app-like `ops console` modul:
  - live threat feed
  - security vault / quarantine simulaci
  - object inspector
  - AI forensic assistant chat
  - session scan progress
- Dovést AI Guard ještě víc do režimu "app", ne jen prezentační dashboard:
  - persistent live scan state
  - session stats
  - real threat feed
  - hlubší simulace zásahů do stránky
- Doladit cross-page konzistenci AI Guard sekcí:
  - stejné spacing rhythm
  - stejné hover/focus chování
  - sjednocené akcentní barvy u interactive cards a panelů
- Vyladit `Detection` detail panel ještě víc do app stylu, pokud bude potřeba:
  - richer state transitions
  - explicitnější aktivní vazba mezi levou vrstvou a pravým panelem

## Style Panel

- Dokončeno: lokální fork `StylePanel` je nasazený místo importu z `@once-ui-system/core/components/StylePanel`.
- Dokončeno: panel používá vlastní `StylePanel.module.scss`, swatche, shape selector, solid style / effect, surface / scaling / transition i `Data Style`.
- Dokončeno: lokální panel je napojený na současný settings shell a drží dark glass vizuál projektu.
- Zvážit, jestli lokální panel nemá mít užší, víc "system console" layout pro AI Guard a jemnější, luxusnější variantu pro Ultimate.

## Browser Extension

- Dokončeno: extension vrstva má shared contracts pro hrozby, runtime messages, audit trail i inference bridge payloady.
- Dokončeno: `background.js`, `content.js` a `sidepanel.js` běží pod `@ts-check` a mají samostatný `typecheck:extension`.
- Dokončeno: je připravený volitelný `inference-bridge.js` pro lokální endpoint přes `chrome.storage.local` config.
- Dokončeno: placeholder extension ikony byly nahrazené finální sadou (`16 / 48 / 128`) podle oficiálního AEGIS štítu.
- Rozšířit `content.js` z highlight-only režimu na reálné zásahy:
  - Dokončeno: první bezpečný `rewrite` krok přepisuje urgency / scarcity / social proof do neutrálního copy a drží originál v `data-*` pro další scan i budoucí revert.
  - Dokončeno: `urgency` patterny teď dostávají i jemný suppression pass, který tlumí animaci / glow / tlakový styling bez rozbití layoutu.
  - neutral rewrite copy
  - Dokončeno: první cookie-banner override krok přepisuje accept/settings/reject copy do srozumitelnější formy a tlumí nátlakový vizuál bez automatického consent zásahu.
- Dokončeno: extension bridge má teď skutečný lokální endpoint přes `/api/aegis/evaluate`, bezpečné defaulty na localhost a fail-soft fallback do AEGIS local policy engine, když Ollama není dostupná.
- Dokončeno: sidepanel umí `Revert DOM`, takže rewrite / suppression / cookie override zásahy je možné vrátit a ponechat je do reloadu vypnuté.
- Ověřit unpacked extension flow v Chrome:
  - side panel
  - background messaging
  - content script scanning
  - cleanup po zavření tabu

## Architecture / AI

- Rozhodnout MVP inference cestu:
  - čistě heuristická vrstva
  - heuristika + lokální LLM escalation
  - Ollama / WebGPU / jiný lokální runtime
- Připravit auditovatelný zásahový model:
  - `flag`
  - `rewrite`
  - `block`
- Připravit první návrh datasetu pro manipulativní patterny v češtině.

## Type Safety / Tooling

- Dokončeno: projekt má `tsconfig.json`, `next.config.ts`, `next-env.d.ts` a `typedRoutes`.
- Dokončeno: zapnuté `experimental.typedEnv`.
- Dokončeno: route pages, SEO/config vrstva, menu data a `SectionPages` jsou převedené na TypeScript.
- Dokončeno: druhá vlna migrace:
  - hlavní `src/App.jsx` je převedené na `App.tsx`
  - lokální `StylePanel.jsx` je převedený na `StylePanel.tsx`
  - shell utility, refs, page unions, menu shaping a CSS variable styly v `App` jsou typované
- Dokončeno: zpřísnění typů i kolem extension vrstvy a lokálního inference bridge.
- Do té doby držet routing data konzistentní ručně v `src/mocks/megaMenuData.ts`.



další progress by DAVID:
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Eye, 
  Lock, 
  Settings, 
  AlertTriangle, 
  ChevronRight, 
  Ghost, 
  Globe,
  Database,
  Terminal,
  Cpu,
  RefreshCw,
  Info,
  MessageSquare,
  Send,
  Unlock,
  Archive,
  Search
} from 'lucide-react';

// --- Mock Data & Constants ---
const THREAT_TYPES = {
  PHISHING: { label: 'Phishing Attempt', color: 'text-rose-500', bg: 'bg-rose-500/10', icon: AlertTriangle },
  TRACKER: { label: 'Hidden Tracker', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Eye },
  SCRIPT: { label: 'Malicious Script', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Terminal },
  INJECTION: { label: 'SQL Injection', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Database },
};

const INITIAL_THREATS = [
  { id: 1, type: 'PHISHING', target: 'login-form-01', site: 'fake-bank-auth.com', severity: 'Critical', time: '2m ago', status: 'detected', quarantined: false },
  { id: 2, type: 'TRACKER', target: 'pixel-track', site: 'global-ad-net.io', severity: 'Low', time: '5m ago', status: 'blocked', quarantined: false },
  { id: 3, type: 'SCRIPT', target: 'crypto-miner.js', site: 'shady-downloads.net', severity: 'High', time: '12m ago', status: 'detected', quarantined: false },
];

// --- Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    detected: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    blocked: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    quarantined: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    scanning: "bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse",
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('live'); // 'live' or 'vault'
  const [threats, setThreats] = useState(INITIAL_THREATS);
  const [selectedThreat, setSelectedThreat] = useState(INITIAL_THREATS[0]);
  const [scanProgress, setScanProgress] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Analyzoval jsem tento element. Chcete vysvětlit, proč byl označen jako rizikový?' }
  ]);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Simulace live skenování
  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const handleIsolate = (id) => {
    setThreats(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'quarantined', quarantined: true } : t
    ));
    // Pokud jsme v live tabu a izolujeme, přepneme výběr na další hrozbu
    if (activeTab === 'live') {
      const remaining = threats.filter(t => t.id !== id && !t.quarantined);
      if (remaining.length > 0) setSelectedThreat(remaining[0]);
    }
  };

  const handleRestore = (id) => {
    setThreats(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'detected', quarantined: false } : t
    ));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatHistory([...chatHistory, { role: 'user', text: chatInput }]);
    setChatInput("");
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: `Tento typ útoku (${THREAT_TYPES[selectedThreat.type].label}) obvykle využívá zranitelnosti v DOM struktuře. Doporučuji ponechat v izolaci.` 
      }]);
    }, 1000);
  };

  const visibleThreats = threats.filter(t => activeTab === 'live' ? !t.quarantined : t.quarantined);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans selection:bg-emerald-500/30 flex flex-col">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 bg-[#0d0d0d]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Shield size={20} className="text-black stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">AI GUARD <span className="text-emerald-400">PRO</span></h1>
            <p className="text-[10px] text-white/40 leading-none uppercase tracking-widest">Active Protection</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'live' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Activity size={14} /> Live Monitor
          </button>
          <button 
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'vault' ? 'bg-indigo-500/20 text-indigo-400 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]' : 'text-white/40 hover:text-white'}`}
          >
            <Lock size={14} /> Security Vault
            {threats.filter(t => t.quarantined).length > 0 && (
              <span className="ml-1 w-4 h-4 bg-indigo-500 text-white text-[9px] flex items-center justify-center rounded-full">
                {threats.filter(t => t.quarantined).length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-400 tracking-wider">ENCRYPTED</span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1500px] mx-auto p-6 grid grid-cols-12 gap-6 w-full flex-1">
        
        {/* LEFT COLUMN: The List */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className={`bg-[#141414] border border-white/5 rounded-3xl overflow-hidden flex flex-col min-h-[650px] shadow-2xl transition-all duration-500 ${activeTab === 'vault' ? 'ring-1 ring-indigo-500/30' : ''}`}>
            
            {/* Header Area */}
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2">
                  {activeTab === 'live' ? <Activity size={16} className="text-emerald-400"/> : <Lock size={16} className="text-indigo-400"/>}
                  {activeTab === 'live' ? 'Real-time Threat Feed' : 'Isolated Objects (Quarantine)'}
                </h2>
                <p className="text-[11px] text-white/40 mt-0.5">
                  {activeTab === 'live' ? 'Monitoring active DOM mutations and network requests' : 'Objects here are strictly isolated from the host page'}
                </p>
              </div>
              
              {activeTab === 'live' && (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-tighter">Engine Depth: 98%</span>
                    <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {visibleThreats.length > 0 ? (
                visibleThreats.map((threat) => (
                  <div 
                    key={threat.id}
                    onClick={() => setSelectedThreat(threat)}
                    className={`group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                      selectedThreat.id === threat.id 
                        ? (activeTab === 'live' ? 'bg-emerald-500/[0.03] border-emerald-500/40' : 'bg-indigo-500/[0.03] border-indigo-500/40 shadow-lg')
                        : 'bg-[#1a1a1a] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-all duration-300 ${
                        selectedThreat.id === threat.id 
                        ? (activeTab === 'live' ? 'bg-emerald-500 text-black' : 'bg-indigo-500 text-white') 
                        : THREAT_TYPES[threat.type].bg + ' ' + THREAT_TYPES[threat.type].color
                      }`}>
                        {React.createElement(THREAT_TYPES[threat.type].icon, { size: 20 })}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold tracking-tight">{THREAT_TYPES[threat.type].label}</span>
                          <StatusBadge status={threat.status} />
                        </div>
                        <p className="text-[11px] font-mono text-white/40 mt-0.5 truncate max-w-[200px] md:max-w-none">
                          {threat.site} <span className="opacity-20 px-1">|</span> {threat.target}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest leading-none">Detected</p>
                        <p className="text-xs font-bold mt-1">{threat.time}</p>
                      </div>
                      <ChevronRight size={16} className={`transition-transform ${selectedThreat.id === threat.id ? 'translate-x-1 opacity-100' : 'opacity-20'}`} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-24 opacity-30 text-center">
                  {activeTab === 'live' ? <ShieldCheck size={48} className="mb-4 text-emerald-500" /> : <Archive size={48} className="mb-4 text-indigo-500" />}
                  <p className="text-sm font-bold">{activeTab === 'live' ? 'Všechny systémy jsou čisté' : 'Trezor je prázdný'}</p>
                  <p className="text-xs mt-1">Žádné {activeTab === 'live' ? 'aktivní' : 'izolované'} hrozby nebyly nalezeny.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Inspector & Chat */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          <div className="bg-[#141414] border border-white/5 rounded-3xl overflow-hidden flex flex-col flex-1 shadow-2xl sticky top-24 max-h-[calc(100vh-120px)]">
            
            {/* Inspector Header */}
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Object Inspector</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Threat Identity */}
              <div className="p-6 text-center border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-white/5 transition-transform duration-500 hover:scale-105 ${THREAT_TYPES[selectedThreat.type].bg}`}>
                  {React.createElement(THREAT_TYPES[selectedThreat.type].icon, { size: 32, className: THREAT_TYPES[selectedThreat.type].color })}
                </div>
                <h3 className="text-lg font-bold">{THREAT_TYPES[selectedThreat.type].label}</h3>
                <p className="text-xs text-white/40 font-mono mt-1 px-4 truncate">{selectedThreat.site}</p>
                
                <div className="mt-6 flex flex-col gap-2">
                  {selectedThreat.quarantined ? (
                    <button 
                      onClick={() => handleRestore(selectedThreat.id)}
                      className="w-full py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Unlock size={14} /> Uvolnit z trezoru
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleIsolate(selectedThreat.id)}
                      className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Lock size={14} /> Izolovat v trezoru
                    </button>
                  )}
                </div>
              </div>

              {/* AI CHAT SECTION */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 px-1">
                  <MessageSquare size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">AI Forensic Assistant</span>
                </div>

                <div className="bg-[#0d0d0d] rounded-2xl border border-white/5 flex flex-col h-[300px] shadow-inner">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                          ? 'bg-emerald-500 text-black font-medium rounded-tr-none' 
                          : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-white/[0.01] flex gap-2">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Zeptej se na detaily hrozby..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-white/20"
                    />
                    <button type="submit" className="p-2 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 transition-colors shadow-lg">
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Technical Stack Trace - FIXED CHARACTERS */}
              <div className="p-5 pt-0">
                <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 font-mono text-[10px]">
                  <div className="flex justify-between items-center mb-2 text-white/30">
                    <span>DUMP_ANALYSIS_V4</span>
                    <Search size={12} />
                  </div>
                  <div className="space-y-1 text-white/50">
                    <p><span className="text-emerald-500">INIT:</span> handshake_syn_ack</p>
                    <p><span className="text-rose-500">WARN:</span> unexpected_dom_mutation</p>
                    <p><span className="text-white/20">{" >> "}</span> trace: /assets/vendors.min.js:421</p>
                    <p><span className="text-white/20">{" >> "}</span> target: {selectedThreat.target}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
               <span className="text-[10px] text-white/20 font-bold uppercase italic tracking-tighter">Secure-Link Active</span>
               <div className="flex gap-2">
                  <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-2/3 animate-pulse"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global CSS for scrollbar and animations */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.2);
        }
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
