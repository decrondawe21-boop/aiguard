"use client";

import Link from "next/link";
import type { Route } from "next";
import React, { useEffect, useRef, useState } from "react";
import { Arrow } from "@once-ui-system/core/components/Arrow";
import { Badge } from "@once-ui-system/core/components/Badge";
import { Text } from "@once-ui-system/core/components/Text";
import { useTheme } from "@once-ui-system/core/contexts";
import { AiGuardOpsConsole } from "./AiGuardOpsConsole";
import {
  Activity,
  Brain,
  Eye,
  Fingerprint,
  Lock,
  Radar,
  ScanSearch,
  ServerCog,
  Shield,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AppPage = "ai-guard" | "philosophy" | "detection" | "defense" | "build";

type ContentCard = {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  points?: string[];
  tone?: "warm" | "cool" | "neutral" | "safe";
};

type SectionCardData = ContentCard & {
  icon: LucideIcon;
};

type DetectionLayer = {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  copy: string;
  details: string[];
};

type RouteCard = {
  href: Route;
  eyebrow: string;
  title: string;
  copy: string;
  tone: "warm" | "cool" | "neutral" | "safe";
  icon: LucideIcon;
};

type SignalData = {
  label: string;
  copy: string;
  level: string;
  tone?: "cool" | "safe";
};

type SectionHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  badge?: {
    icon: string;
    label: string;
  };
};

type SectionCardProps = SectionCardData;

type SignalMeterProps = SignalData;

const philosophyHighlights: SectionCardData[] = [
  {
    id: "inverse-marketing",
    icon: Sparkles,
    eyebrow: "Inverse Marketing",
    title: "Optimalizovat systém pro uživatele",
    copy:
      "Běžná marketingová AI tlačí člověka do kliknutí. AI Bodyguard se ptá, proč je tlak vytvořen právě teď a jestli je legitimní.",
    points: [
      "Konverze není cíl, ale podezřelý vedlejší efekt.",
      "Rozpor mezi zájmem uživatele a zájmem algoritmu se čte jako incident.",
      "Výsledkem není reklama, ale obranné rozhodnutí.",
    ],
  },
  {
    id: "attention-economy",
    icon: Eye,
    eyebrow: "Attention Economy",
    title: "Pozornost jako těžená komodita",
    copy:
      "Dopaminové smyčky, FOMO a sociální validace nejsou growth feature. Jsou to vektory psychologického nátlaku navržené pro maximalizaci time-on-site.",
    points: [
      "Manipulativní urgence se analyzuje jako bezpečnostní pattern.",
      "Obsah se hodnotí podle motivace, ne podle formátu.",
      "Systém odděluje informační výživu od informačního toxinu.",
    ],
  },
  {
    id: "user-first-logic",
    icon: Shield,
    eyebrow: "User-First Logic",
    title: "Digitální imunitní systém",
    copy:
      "Bodyguard neblokuje jen bannery. Reverzně analyzuje psychologický tlak a dává uživateli kontrolu nad tím, jak tvrdě má systém zasáhnout.",
    points: [
      "Rozhoduje v kontextu, ne podle slepých blacklistů.",
      "Dokáže vysvětlit, proč je pattern škodlivý.",
      "Prahování zásahu jde od signalizace až po úplný block.",
    ],
  },
];

const detectionLayers: DetectionLayer[] = [
  {
    id: "visual-ui",
    icon: Eye,
    eyebrow: "Layer A",
    title: "Vizuální a UI analýza",
    copy:
      "Renderovaná stránka se čte jako útokový povrch. Model hledá falešnou urgenci, confirmshaming, roach motel a reklamní bloky maskované jako editorial.",
    details: [
      "Countdown se křížově validuje proti DOMu a historii návštěv.",
      "Kontrast, velikost a umístění tlačítek odhalují skryté odmítnutí.",
      "Reklama imitující redakční styl je zvýrazněna jako native advertising.",
    ],
  },
  {
    id: "semantic-nlp",
    icon: Brain,
    eyebrow: "Layer B",
    title: "Sémantická a psychologická vrstva",
    copy:
      "Jemně doladěný LLM čte tón, motivaci i podtext. Rozpoznává FOMO, guilt-tripping, gaslighting a emoci, na kterou text útočí.",
    details: [
      "Nepodložené scarcity fráze jsou označeny jako psychologický nátlak.",
      "Toxické copy lze přepsat do neutrální formy v reálném čase.",
      "Analýza sleduje strach, chamtivost, nejistotu i útok na ego.",
    ],
  },
  {
    id: "code-inspection",
    icon: Fingerprint,
    eyebrow: "Layer C",
    title: "Behaviorální analýza kódu",
    copy:
      "Pod kapotou se sleduje fingerprinting, shadow tracking, prediktivní pre-loading a falešná logika cookie lišt.",
    details: [
      "Canvas, AudioContext a mikrointerakce myši se čtou jako telemetry signály.",
      "Podezřelé requesty je možné zmrazit ještě před akcí uživatele.",
      "Cookie banner se kontroluje podle skutečného API efektu, ne jen podle vzhledu.",
    ],
  },
];

const defenseCards: SectionCardData[] = [
  {
    id: "fog-screen",
    icon: Shield,
    eyebrow: "Fog Screen",
    title: "Aktivní obrana místo pasivního štítu",
    copy:
      "Po detekci útoku na pozornost nebo soukromí může AI Bodyguard přejít do protiopatření a rozbít jistotu sledovacích modelů.",
    points: [
      "Manipulativní vrstva se překryje klidnějším režimem.",
      "Tracker dostane konflikt místo čistého signálu.",
      "Zásah je auditovatelný a řízený prahem tolerance.",
    ],
  },
  {
    id: "data-poisoning",
    icon: Radar,
    eyebrow: "Data Poisoning",
    title: "Noise injection pro data brokery",
    copy:
      "Zatímco uživatel normálně čte stránku, obranná vrstva může simulovat nesouvisející zájmy a znehodnotit behaviorální profil.",
    points: [
      "Falešné zájmy rozbíjí scoring i lookalike modely.",
      "Algoritmus ztrácí schopnost přesně odhadovat intent.",
      "Uživatel se stává neprofitabilním cílem.",
    ],
  },
  {
    id: "intervention-modes",
    icon: ScanSearch,
    eyebrow: "Intervention",
    title: "Flag, rewrite, block",
    copy:
      "Zásah nesmí být binární. Lehké režimy zvýrazní problém, tvrdší varianty neutralizují copy nebo web úplně zastaví.",
    points: [
      "Flag přidá auditní vrstvu bez rozbití flow.",
      "Rewrite neutralizuje toxické formulace.",
      "Block uzavře přístup u systémově škodlivého obsahu.",
    ],
  },
  {
    id: "zen-overlay",
    icon: Sparkles,
    eyebrow: "Zen Overlay",
    title: "Desaturace vizuálního nátlaku",
    copy:
      "Agresivní barvy, autoplay videa a křičící titulky se tlumí do čitelnějšího a klidnějšího rozhraní.",
    points: [
      "Emocionální titulek se převádí na faktické shrnutí.",
      "Červená urgence ztrácí dominanci v hierarchii stránky.",
      "Uživatel znovu získá čas na úsudek.",
    ],
  },
];

const buildCards: SectionCardData[] = [
  {
    id: "hgx-h100",
    icon: ServerCog,
    eyebrow: "Infrastructure",
    title: "HGX H100 jako externí mozková kůra",
    copy:
      "Velký výpočetní výkon dává smysl tam, kde je potřeba v jednom kroku číst screenshot, DOM i kód a vracet obrannou instrukci.",
    points: [
      "Model chápe ironii, manipulaci i technický pattern současně.",
      "Heavy inference běží lokálně místo úniku do cloudu.",
      "Nízká latence slouží zásahu, ne těžbě dat.",
    ],
  },
  {
    id: "air-gapped",
    icon: Lock,
    eyebrow: "Secure Ops",
    title: "Air-gapped prostředí jako pevnost",
    copy:
      "Citlivý kontext uživatele zůstává uvnitř kontrolovaného perimetru. Ochrana soukromí není trade-off za analýzu.",
    points: [
      "Inference, logy i zásahy zůstávají v on-premise zóně.",
      "Architektura počítá s vysokou citlivostí a izolací.",
      "Bodyguard se sám nestává dalším trackerem.",
    ],
  },
];

const roadmapCards: ContentCard[] = [
  {
    id: "dataset-zla",
    eyebrow: "Phase 1",
    title: 'Dataset Zla',
    copy:
      "Kurátorovaný scraping šedé zóny internetu: scam weby, dark patterns, agresivní marketing, fake news a podvodné landingy.",
  },
  {
    id: "the-skeptic",
    eyebrow: "Phase 2",
    title: "The Skeptic",
    copy:
      "Fine-tuning modelu na behaviorální psychologii a persuasion techniques s důrazem na skeptickou, ne paranoidní interpretaci.",
  },
  {
    id: "intervention-threshold",
    eyebrow: "Phase 3",
    title: "Míra intervence",
    copy:
      "Etický panel nastavuje hranici mezi signalizací, přepisem a úplným blokováním toxického prostředí.",
  },
];

const systemStats = [
  {
    label: "Detection Rate",
    value: "99.2%",
  },
  {
    label: "Neural Latency",
    value: "< 12ms",
  },
  {
    label: "Inference Mode",
    value: "LOCAL",
  },
];

const systemSignals: SignalData[] = [
  {
    label: "Neural Infrastructure",
    copy: "Lokální GPU inference vrstva pro analýzu vizuálních i behaviorálních podnětů bez úniku kontextu.",
    level: "76%",
    tone: "cool",
  },
  {
    label: "Cognitive Load",
    copy: "Systém snižuje stresovou zátěž desaturací agresivních stimulů a neutralizací urgency patternů.",
    level: "24%",
    tone: "safe",
  },
];

const glossaryItems = [
  {
    term: "Attention Economy",
    description:
      "Ekonomický model, ve kterém je lidská pozornost hlavní komoditou a čas u obrazovky se mění na příjem a data.",
  },
  {
    term: "Dark Patterns",
    description:
      "Rozhraní úmyslně navržená tak, aby uživatele zmátla nebo dotlačila k akci, kterou by jinak neudělal.",
  },
  {
    term: "Confirmshaming",
    description:
      "Manipulace studem: odmítací volba je formulovaná tak, aby vyvolala pocit viny nebo vlastní méněcennosti.",
  },
  {
    term: "Roach Motel",
    description:
      "Je snadné dovnitř vstoupit, ale extrémně těžké odejít. Typicky předplatné, které se aktivuje jedním klikem a ruší telefonátem.",
  },
  {
    term: "Fingerprinting",
    description:
      "Sledování bez cookies skrze unikátní kombinaci hardwarových a prohlížečových signálů.",
  },
  {
    term: "Data Poisoning",
    description:
      "Obranné zasílání falešných nebo konfliktních behaviorálních dat, které degraduje přesnost profilovacích modelů.",
  },
  {
    term: "RLHF",
    description:
      "Dolaďování modelu pomocí lidské zpětné vazby, která učí AI rozlišovat jemné nuance legitimní nabídky a manipulace.",
  },
];

function RadarCompareChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<{ destroy: () => void } | null>(null);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const { default: Chart } = await import("chart.js/auto");
      const canvas = canvasRef.current;

      if (cancelled || !canvas) return;

      const existingChart = Chart.getChart(canvas);
      if (existingChart) {
        existingChart.destroy();
      }

      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }

      const instance = new Chart(canvas, {
        type: "radar",
        data: {
          labels: [
            "Kontextové chápání",
            "Ochrana soukromí",
            "Aktivní obrana",
            "Hloubka analýzy",
            "Rychlost reakce",
          ],
          datasets: [
            {
              label: "AI Bodyguard",
              data: [95, 100, 90, 96, 82],
              fill: true,
              backgroundColor: "rgba(34, 211, 238, 0.14)",
              borderColor: "rgba(34, 211, 238, 0.92)",
              pointBackgroundColor: "rgba(167, 243, 208, 1)",
              pointBorderColor: "rgba(8, 15, 20, 1)",
            },
            {
              label: "Běžný AdBlock",
              data: [12, 34, 0, 22, 94],
              fill: true,
              backgroundColor: "rgba(161, 251, 142, 0.1)",
              borderColor: "rgba(161, 251, 142, 0.84)",
              pointBackgroundColor: "rgba(235, 255, 232, 1)",
              pointBorderColor: "rgba(8, 15, 20, 1)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false },
              grid: { color: isLight ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.08)" },
              angleLines: { color: isLight ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.08)" },
              pointLabels: {
                color: isLight ? "rgba(15, 23, 42, 0.76)" : "rgba(255, 255, 255, 0.72)",
                font: {
                  family: "var(--font-body), ui-sans-serif, system-ui, sans-serif",
                  size: 11,
                  weight: 700,
                },
              },
            },
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: isLight ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.72)",
                usePointStyle: true,
                padding: 18,
              },
            },
            tooltip: {
              backgroundColor: isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(9, 9, 11, 0.92)",
              borderColor: isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.08)",
              borderWidth: 1,
              titleColor: isLight ? "rgba(15, 23, 42, 0.94)" : "rgba(248, 250, 252, 0.96)",
              bodyColor: isLight ? "rgba(30, 41, 59, 0.82)" : "rgba(255, 255, 255, 0.76)",
            },
          },
        },
      });

      if (cancelled) {
        instance.destroy();
        return;
      }

      chartRef.current = instance;
    };

    init();

    return () => {
      cancelled = true;

      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [isLight]);

  return (
    <div className="architecture-chart">
      <canvas ref={canvasRef} />
    </div>
  );
}

function SectionCard({
  icon: Icon,
  eyebrow,
  title,
  copy,
  points,
  id,
  tone = "cool",
}: SectionCardProps) {
  return (
    <article id={id} className={`architecture-card architecture-card--${tone} surface-inset`}>
      <div className="architecture-card__header">
        <span className="architecture-card__icon">
          <Icon size={18} />
        </span>
        <Text as="span" className="architecture-card__eyebrow">
          {eyebrow}
        </Text>
      </div>
      <Text as="h3" className="architecture-card__title">
        {title}
      </Text>
      <Text as="p" className="architecture-card__copy">
        {copy}
      </Text>
      {points ? (
        <div className="architecture-card__list">
          {points.map((point) => (
            <Text key={point} as="p" className="architecture-card__point">
              {point}
            </Text>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function SectionHero({ eyebrow, title, copy, badge }: SectionHeroProps) {
  return (
    <div className="section-page__hero">
      <div className="section-page__hero-meta">
        {badge ? (
          <Badge className="architecture-badge" icon={badge.icon} effect>
            {badge.label}
          </Badge>
        ) : null}
        <Text as="span" className="section-page__eyebrow">
          {eyebrow}
        </Text>
      </div>
      <Text as="h2" className="section-page__title">
        {title}
      </Text>
      <Text as="p" className="section-page__copy">
        {copy}
      </Text>
    </div>
  );
}

function SignalMeter({ label, copy, level, tone = "cool" }: SignalMeterProps) {
  return (
    <article className={`architecture-signal architecture-signal--${tone} surface-inset`}>
      <Text as="span" className="architecture-card__eyebrow">
        {label}
      </Text>
      <Text as="p" className="architecture-card__copy">
        {copy}
      </Text>
      <div className="architecture-signal__bar">
        <div
          className="architecture-signal__fill"
          style={{ width: level }}
        />
      </div>
    </article>
  );
}

const aiGuardRouteCards: RouteCard[] = [
  {
    href: "/ai-guard/philosophy",
    eyebrow: "Philosophy",
    title: "Inverzní marketing",
    copy: "Strategická vrstva vysvětlující proč je pozornost hlavní bojiště digitální manipulace.",
    tone: "cool",
    icon: Sparkles,
  },
  {
    href: "/ai-guard/detection",
    eyebrow: "Detection",
    title: "Triad of Truth",
    copy: "Multimodální pipeline pro vizuální, sémantickou a kódovou analýzu stránky.",
    tone: "cool",
    icon: Eye,
  },
  {
    href: "/ai-guard/defense",
    eyebrow: "Defense",
    title: "Projekt Mlhová Clona",
    copy: "Aktivní obrana, noise injection a zen overlay jako protiopatření proti nátlaku.",
    tone: "cool",
    icon: Shield,
  },
  {
    href: "/ai-guard/build",
    eyebrow: "Build",
    title: "On-Premise Intelligence",
    copy: "HGX H100, air-gapped inference a roadmap od datasetu až po The Skeptic.",
    tone: "cool",
    icon: ServerCog,
  },
];

export function AiGuardLandingPage() {
  return (
    <section className="section-page">
      <div className="section-page__inner surface-frame surface-frame--cool">
        <SectionHero
          eyebrow="AI Guard"
          title="Architektura detekce manipulace"
          copy="Tady už nezačíná brand prezentace, ale produktová mapa. Každá hlavní vrstva AI Bodyguardu má vlastní stránku a vlastní rozhodovací logiku."
          badge={{ icon: "security", label: "Separated AI Guard" }}
        />

        <div className="section-page__grid section-page__grid--landing">
          <div className="architecture-system-panel architecture-system-panel--primary surface-inset">
            <div className="architecture-system-panel__scanner" aria-hidden />
            <Text as="span" className="architecture-system-panel__status">
              Status: Online
            </Text>
            <Text as="h3" className="architecture-system-panel__title">
              Inverzní marketingová obrana
            </Text>
            <Text as="p" className="architecture-card__copy">
              AI Bodyguard není filtr na bannery. Je to lokální autonomní agent, který čte rozhraní jako útokový povrch a neutralizuje psychologický tlak dřív, než se stane rozhodovacím kontextem.
            </Text>

            <div className="architecture-status-grid">
              {systemStats.map((stat) => (
                <div key={stat.label} className="architecture-status-item">
                  <Text as="strong" className="architecture-status-item__value">
                    {stat.value}
                  </Text>
                  <Text as="span" className="architecture-status-item__label">
                    {stat.label}
                  </Text>
                </div>
              ))}
            </div>

            <div className="section-page__grid section-page__grid--two architecture-system-panel__signals">
              {systemSignals.map((signal) => (
                <SignalMeter key={signal.label} {...signal} />
              ))}
            </div>
          </div>

          <div className="surface-inset architecture-overview-card architecture-overview-card--cool architecture-overview-card--chart">
            <div className="architecture-overview-card__header">
              <Text as="span" className="architecture-card__eyebrow">
                Efficiency Radar
              </Text>
              <Text as="h3" className="architecture-card__title">
                System Contrast
              </Text>
              <Text as="p" className="architecture-card__copy">
                Přehled rozdílu mezi blacklistovým blokátorem a kognitivní obrannou vrstvou nad obrazem, textem i kódem.
              </Text>
            </div>
            <RadarCompareChart />
          </div>
        </div>

        <div className="section-page__grid section-page__grid--two">
          {aiGuardRouteCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                className={`architecture-route-card architecture-card architecture-card--${card.tone} surface-inset`}
              >
                <div className="architecture-card__header">
                  <span className="architecture-card__icon">
                    <Icon size={18} />
                  </span>
                  <Text as="span" className="architecture-card__eyebrow">
                    {card.eyebrow}
                  </Text>
                </div>
                <Text as="h3" className="architecture-card__title">
                  {card.title}
                </Text>
                <Text as="p" className="architecture-card__copy">
                  {card.copy}
                </Text>
              </Link>
            );
          })}
        </div>

        <AiGuardOpsConsole />
      </div>
    </section>
  );
}

export function PhilosophyPage() {
  return (
    <section id="war-for-attention" className="section-page">
      <div className="section-page__inner surface-frame surface-frame--cool">
        <SectionHero
          eyebrow="Philosophy"
          title="Inverzní marketing a válka o pozornost"
          copy="Běžná marketingová AI optimalizuje uživatele pro systém. AI Bodyguard obrací logiku: optimalizuje systém pro uživatele a čte manipulaci jako útok na úsudek."
          badge={{ icon: "security", label: "AI Bodyguard v2.1" }}
        />

        <div className="section-page__grid section-page__grid--philosophy">
          <div className="architecture-system-panel architecture-system-panel--primary surface-inset">
            <div className="architecture-system-panel__scanner" aria-hidden />
            <Text as="span" className="architecture-system-panel__status">
              System: User-First Logic
            </Text>
            <Text as="h3" className="architecture-system-panel__title">
              Pozornost není metrika růstu
            </Text>
            <Text as="p" className="architecture-card__copy">
              V AI Bodyguard architektuře je attention economy čtena jako konflikt zájmu. Když rozhraní těží strach, urgency nebo ego, systém to nevyhodnotí jako growth, ale jako bezpečnostní signál.
            </Text>
            <div className="architecture-pill-row">
              <span className="architecture-pill">User First</span>
              <span className="architecture-pill">Context Aware</span>
              <span className="architecture-pill">Cognitive Defense</span>
            </div>

            <div className="section-page__grid section-page__grid--two architecture-system-panel__signals">
              {systemSignals.map((signal) => (
                <SignalMeter key={signal.label} {...signal} />
              ))}
            </div>
          </div>

          <div className="surface-inset architecture-overview-card architecture-overview-card--cool architecture-overview-card--chart">
            <div className="architecture-overview-card__header">
              <Text as="span" className="architecture-card__eyebrow">
                Compare
              </Text>
              <Text as="h3" className="architecture-card__title">
                Analýza schopností systému
              </Text>
              <Text as="p" className="architecture-card__copy">
                Srovnání klasického blacklistového adblocku s kognitivní obrannou vrstvou nad textem, obrazem i kódem.
              </Text>
            </div>
            <RadarCompareChart />
          </div>

          <div className="surface-inset architecture-overview-card architecture-overview-card--cool architecture-overview-card--wide">
            <Text as="h3" className="architecture-card__title">
              Filosofie obrany
            </Text>
            <Text as="p" className="architecture-card__copy">
              Primární otázka systému není, jak vyvolat klik, ale proč je konkrétní tlak vytvářen právě tímto způsobem.
              Rozhraní se posuzuje podle motivace, ne podle toho, jak dobře prodává.
            </Text>
            <div className="architecture-system-bullets">
              <Text as="p" className="architecture-card__point">
                Manipulace se nehodnotí podle formátu, ale podle motivace a očekávaného zásahu do úsudku.
              </Text>
              <Text as="p" className="architecture-card__point">
                AI Bodyguard je navržený tak, aby uživateli vracel čas na rozhodnutí, ne další šok do feedu.
              </Text>
              <Text as="p" className="architecture-card__point">
                Rozhraní může být krásné, ale pokud těží úzkost a scarcity, systém jej označí jako hrozbu.
              </Text>
            </div>
          </div>
        </div>

        <div className="section-page__grid section-page__grid--three">
          {philosophyHighlights.map((item) => (
            <SectionCard
              key={item.id}
              {...item}
              tone="cool"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function DetectionPage() {
  const [selectedLayer, setSelectedLayer] = useState(detectionLayers[0]);
  const SelectedLayerIcon = selectedLayer.icon;

  return (
    <section id="triad-of-truth" className="section-page">
      <div className="section-page__inner surface-frame surface-frame--cool">
        <SectionHero
          eyebrow="Detection"
          title="Triad of Truth"
          copy="Manipulace je subtilní a kontextuální. Proto se web analyzuje multimodálně: obraz, text i kód běží paralelně a skládají jeden verdikt."
          badge={{ icon: "security", label: "3 vrstvy detekce" }}
        />

        <div className="section-page__grid section-page__grid--two section-page__grid--detection">
          <div className="architecture-layer-list">
            {detectionLayers.map((layer) => {
              const isActive = selectedLayer.id === layer.id;
              const Icon = layer.icon;

              return (
                <button
                  key={layer.id}
                  id={layer.id}
                  type="button"
                  className={`architecture-layer-button surface-inset${isActive ? " architecture-layer-button--active" : ""}`}
                  onMouseEnter={() => setSelectedLayer(layer)}
                  onFocus={() => setSelectedLayer(layer)}
                  onClick={() => setSelectedLayer(layer)}
                >
                  <span className="architecture-layer-button__icon">
                    <Icon size={18} />
                  </span>
                  <div className="architecture-layer-button__body">
                    <Text as="span" className="architecture-layer-button__eyebrow">
                      {layer.eyebrow}
                    </Text>
                    <Text as="span" className="architecture-layer-button__title">
                      {layer.title}
                    </Text>
                    <Text as="span" className="architecture-layer-button__copy">
                      {layer.copy}
                    </Text>
                  </div>
                  <span className="architecture-layer-button__arrow" aria-hidden="true">
                    <Arrow
                      trigger={`#${layer.id}`}
                      color="onSolid"
                      scale={0.9}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <article id={selectedLayer.id} className="surface-inset architecture-layer-detail">
            <div key={selectedLayer.id} className="architecture-layer-detail__content">
              <div className="architecture-card__header">
                <span className="architecture-card__icon">
                  <SelectedLayerIcon size={18} />
                </span>
                <Text as="span" className="architecture-card__eyebrow">
                  {selectedLayer.eyebrow}
                </Text>
              </div>
              <Text as="h3" className="architecture-card__title">
                {selectedLayer.title}
              </Text>
              <Text as="p" className="architecture-card__copy">
                {selectedLayer.copy}
              </Text>
              <div className="architecture-card__list">
                {selectedLayer.details.map((detail) => (
                  <Text key={detail} as="p" className="architecture-card__point">
                    {detail}
                  </Text>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function DefensePage() {
  const [zenMode, setZenMode] = useState(false);

  return (
    <section id="fog-screen" className="section-page">
      <div className="section-page__inner surface-frame surface-frame--cool">
        <SectionHero
          eyebrow="Defense"
          title="Projekt Mlhová Clona"
          copy="Bodyguard nemá být jen pasivní filtr. Po detekci útoku na pozornost nebo soukromí může přejít do protiopatření a rozbít jistotu trackerů i toxického copy."
          badge={{ icon: "sparkle", label: "Active Defense" }}
        />

        <div className="section-page__grid section-page__grid--two">
        <div className="section-page__grid section-page__grid--two architecture-defense-grid">
            {defenseCards.map((card) => (
              <SectionCard
                key={card.id}
                {...card}
                tone="cool"
              />
            ))}
          </div>

          <div id="zen-overlay" className={`surface-inset architecture-sim${zenMode ? " architecture-sim--zen" : ""}`}>
            <div className="architecture-sim__badge">
              {zenMode ? "Štít aktivní" : "Nezabezpečeno"}
            </div>
            <Text as="span" className="architecture-card__eyebrow">
              Zen Overlay Simulation
            </Text>
            <Text as="h3" className="architecture-card__title">
              Vizuální štít v akci
            </Text>
            <div className="architecture-sim__screen">
              <p className={`architecture-sim__toxic${zenMode ? " architecture-sim__toxic--muted" : ""}`}>
                ŠOKUJÍCÍ PRAVDA! AKCE KONČÍ ZA 00:05! Pokud nekoupíte hned, přijdete o životní šanci.
              </p>
              <p className={`architecture-sim__neutral${zenMode ? " architecture-sim__neutral--visible" : ""}`}>
                Běžná marketingová nabídka. Není vyžadována okamžitá akce. Doporučeno porovnat cenu a podmínky.
              </p>
              <div className="architecture-sim__actions">
                <button type="button" className={`architecture-sim__cta${zenMode ? " architecture-sim__cta--quiet" : ""}`}>
                  {zenMode ? "Prohlédnout parametry" : "Koupit ihned"}
                </button>
                <button type="button" className="architecture-sim__secondary">
                  {zenMode ? "Zavřít okno" : "Ne, chci přijít o peníze"}
                </button>
              </div>
            </div>
            <button
              type="button"
              className="architecture-sim__toggle"
              onClick={() => setZenMode((current) => !current)}
            >
              {zenMode ? "Deaktivovat štít" : "Aktivovat Zen Mode"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BuildPage() {
  return (
    <section id="hgx-h100" className="section-page">
      <div className="section-page__inner surface-frame surface-frame--cool">
        <SectionHero
          eyebrow="Build"
          title="On-Premise Intelligence"
          copy="Architektura stojí na lokální inferenci, auditovatelnosti zásahů a datasetu, který model naučí odlišit legitimní nabídku od psychologické manipulace."
          badge={{ icon: "computer", label: "NVIDIA HGX H100" }}
        />

        <div className="section-page__grid section-page__grid--two">
          {buildCards.map((card) => (
            <SectionCard
              key={card.id}
              {...card}
              tone="cool"
            />
          ))}
        </div>

        <div className="section-page__grid section-page__grid--two">
          <div className="surface-inset architecture-roadmap">
            <Text as="span" className="architecture-card__eyebrow">
              Roadmap
            </Text>
            <Text as="h3" className="architecture-card__title">
              Implementační fáze
            </Text>
            <div className="architecture-roadmap__list">
              {roadmapCards.map((item, index) => (
                <article
                  key={item.id}
                  id={item.id}
                  className={`architecture-roadmap__item architecture-roadmap__item--${index === 0 ? "warm" : index === 1 ? "cool" : "neutral"}`}
                >
                  <Text as="span" className="architecture-card__eyebrow">
                    {item.eyebrow}
                  </Text>
                  <Text as="h4" className="architecture-roadmap__title">
                    {item.title}
                  </Text>
                  <Text as="p" className="architecture-card__copy">
                    {item.copy}
                  </Text>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-inset architecture-glossary">
            <Text as="span" className="architecture-card__eyebrow">
              Glossary
            </Text>
            <Text as="h3" className="architecture-card__title">
              Slovníček pojmů
            </Text>
            <div className="architecture-glossary__list">
              {glossaryItems.map((item) => (
                <article key={item.term} className="architecture-glossary__item">
                  <Text as="h4" className="architecture-glossary__term">
                    {item.term}
                  </Text>
                  <Text as="p" className="architecture-card__copy">
                    {item.description}
                  </Text>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function renderSectionPage(page: AppPage) {
  switch (page) {
    case "ai-guard":
      return <AiGuardLandingPage />;
    case "philosophy":
      return <PhilosophyPage />;
    case "detection":
      return <DetectionPage />;
    case "defense":
      return <DefensePage />;
    case "build":
      return <BuildPage />;
    default:
      return null;
  }
}
