import type { Route } from "next";

type InternalHashHref = `${Route}#${string}`;
type ExternalHref = `http://${string}` | `https://${string}`;
export type MenuHref = Route | InternalHashHref | ExternalHref;

export type MenuLink = {
  label: string;
  href: MenuHref;
  icon: string;
  description: string;
};

export type MenuSection = {
  title: string;
  links: MenuLink[];
};

export type MegaMenuGroup = {
  id: string;
  label: string;
  suffixIcon: string;
  sections: MenuSection[];
};

export const ultimateMegaMenuGroups: MegaMenuGroup[] = [
  {
    id: "ultimate-product",
    label: "Product",
    suffixIcon: "chevronDown",
    sections: [
      {
        title: "Featured",
        links: [
          {
            label: "Ultimate Overview",
            href: "/#ultimate-overview",
            icon: "sparkle",
            description: "Hlavní výraz Ultimate identity a vstup do celého vizuálního systému.",
          },
          {
            label: "Genesis",
            href: "/#ultimate-genesis",
            icon: "gift",
            description: "Počáteční bod produktu a výchozí osa celé brand architektury.",
          },
        ],
      },
      {
        title: "Framework",
        links: [
          {
            label: "Scalability",
            href: "/#ultimate-scalability",
            icon: "chevronsLeftRight",
            description: "Modulární rámec pro rozšiřování značky, produktu i rozhraní.",
          },
          {
            label: "Brand Core",
            href: "/#ultimate-overview",
            icon: "security",
            description: "Centrální jádro identity, ze kterého vyrůstá celý Ultimate surface.",
          },
        ],
      },
    ],
  },
  {
    id: "ultimate-experience",
    label: "Experience",
    suffixIcon: "chevronDown",
    sections: [
      {
        title: "Atmosphere",
        links: [
          {
            label: "Night Protocol",
            href: "/#night-protocol",
            icon: "eye",
            description: "Citace, rytmus a noční vrstva, která dává prostředí charakter.",
          },
          {
            label: "Vision Archive",
            href: "/#vision-archive",
            icon: "document",
            description: "Kurátorská galerie vizí, koček a měsíčních scén s rychlým přepínáním.",
          },
        ],
      },
      {
        title: "Signature",
        links: [
          {
            label: "DK Contact",
            href: "/#contact-dk",
            icon: "symbol",
            description: "Kontaktní vrstva se signature identitou a přímým napojením na autora.",
          },
          {
            label: "Signature Layer",
            href: "/#signature-layer",
            icon: "copy",
            description: "Závěrečná podpisová vrstva, která celý Ultimate systém uzavírá.",
          },
        ],
      },
    ],
  },
  {
    id: "ultimate-identity",
    label: "Identity",
    suffixIcon: "chevronDown",
    sections: [
      {
        title: "Presence",
        links: [
          {
            label: "Personal Site",
            href: "https://www.osobni.david-kozak.com",
            icon: "link",
            description: "Osobní vrstva identity a další kontext kolem David Kozák brand universe.",
          },
          {
            label: "Ultimate OS",
            href: "/#ultimate-overview",
            icon: "screen",
            description: "Návrat na hlavní surface Ultimate OS a jeho produktový vstup.",
          },
        ],
      },
      {
        title: "Archive",
        links: [
          {
            label: "Quote Layer",
            href: "/#night-protocol",
            icon: "document",
            description: "Editorial vrstva s mottem a nočním protokolem rozhraní.",
          },
          {
            label: "Gallery Deck",
            href: "/#vision-archive",
            icon: "screen",
            description: "Obrazová knihovna stylu, atmosféry a nočních nálad.",
          },
        ],
      },
    ],
  },
];

export const aiGuardMegaMenuGroups: MegaMenuGroup[] = [
  {
    id: "philosophy",
    label: "Philosophy",
    suffixIcon: "chevronDown",
    sections: [
      {
        title: "Featured",
        links: [
          {
            label: "AEGIS Overview",
            href: "/ai-guard",
            icon: "security",
            description: "Rozcestník celé architektury AEGIS a hlavních obranných vrstev.",
          },
          {
            label: "War for Attention",
            href: "/ai-guard/philosophy#war-for-attention",
            icon: "eye",
            description: "Proč je pozornost hlavní bojiště digitální manipulace a behaviorálního nátlaku.",
          },
        ],
      },
      {
        title: "Principles",
        links: [
          {
            label: "Inverse Marketing",
            href: "/ai-guard/philosophy#inverse-marketing",
            icon: "refresh",
            description: "Optimalizace systému pro člověka místo člověka pro konverzní algoritmus.",
          },
          {
            label: "User-First Logic",
            href: "/ai-guard/philosophy#user-first-logic",
            icon: "check",
            description: "Rozhodovací logika, která vrací kontrolu nad rozhraním zpátky uživateli.",
          },
          {
            label: "Attention Economy",
            href: "/ai-guard/philosophy#attention-economy",
            icon: "world",
            description: "Ekonomický model, který monetizuje čas, emoci a pozornost uživatele.",
          },
        ],
      },
    ],
  },
  {
    id: "detection",
    label: "Detection",
    suffixIcon: "chevronDown",
    sections: [
      {
        title: "Triad of Truth",
        links: [
          {
            label: "Triad Overview",
            href: "/ai-guard/detection#triad-of-truth",
            icon: "radialGauge",
            description: "Holistická pipeline, ve které obraz, text i kód skládají jeden verdikt.",
          },
          {
            label: "Visual & UI",
            href: "/ai-guard/detection#visual-ui",
            icon: "screen",
            description: "Dark patterns, confirmshaming, roach motel a falešná urgence v rozhraní.",
          },
        ],
      },
      {
        title: "Analysis",
        links: [
          {
            label: "Semantic NLP",
            href: "/ai-guard/detection#semantic-nlp",
            icon: "document",
            description: "FOMO, guilt-tripping, gaslighting a psychologický tlak skrytý v textu.",
          },
          {
            label: "Code Inspection",
            href: "/ai-guard/detection#code-inspection",
            icon: "search",
            description: "Fingerprinting, shadow tracking a skryté chování skriptů pod kapotou stránky.",
          },
        ],
      },
    ],
  },
  {
    id: "defense",
    label: "Defense",
    suffixIcon: "chevronDown",
    sections: [
      {
        title: "Countermeasures",
        links: [
          {
            label: "Fog Screen",
            href: "/ai-guard/defense#fog-screen",
            icon: "opacity",
            description: "Aktivní mlhová clona proti manipulativní infrastruktuře a nátlakovým vrstvám.",
          },
          {
            label: "Data Poisoning",
            href: "/ai-guard/defense#data-poisoning",
            icon: "warning",
            description: "Noise injection a znehodnocení profilů data brokerů i sledovacích modelů.",
          },
        ],
      },
      {
        title: "Control",
        links: [
          {
            label: "Zen Overlay",
            href: "/ai-guard/defense#zen-overlay",
            icon: "smiley",
            description: "Vizuální neutralizace agresivních stimulů, urgency barev a křiku UI.",
          },
          {
            label: "Intervention Modes",
            href: "/ai-guard/defense#intervention-modes",
            icon: "flag",
            description: "Flag, rewrite, block a přesné prahování zásahu do reality stránky.",
          },
        ],
      },
    ],
  },
  {
    id: "build",
    label: "Build",
    suffixIcon: "chevronDown",
    sections: [
      {
        title: "Infrastructure",
        links: [
          {
            label: "HGX H100",
            href: "/ai-guard/build#hgx-h100",
            icon: "computer",
            description: "On-premise inference vrstva pro hluboké čtení screenshotu, DOMu i kódu.",
          },
          {
            label: "Air-Gapped Ops",
            href: "/ai-guard/build#air-gapped",
            icon: "security",
            description: "Lokální pevnost pro citlivá data, bezpečné zpracování a nulový únik kontextu.",
          },
        ],
      },
      {
        title: "Training",
        links: [
          {
            label: "Dataset Zla",
            href: "/ai-guard/build#dataset-zla",
            icon: "clipboard",
            description: "Sběr a kurátorování manipulativních webů, dark patterns a scam patternů.",
          },
          {
            label: "The Skeptic",
            href: "/ai-guard/build#the-skeptic",
            icon: "help",
            description: "Fine-tuning modelu pro skeptickou, auditovatelnou interpretaci manipulace.",
          },
        ],
      },
    ],
  },
];
