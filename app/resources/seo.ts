type SeoAuthor = {
  name: string;
  url?: string;
  image?: string;
};

type MetaProps = {
  title: string;
  description: string;
  baseURL: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
  author?: SeoAuthor;
};

type SchemaProps = {
  as: "website" | "article" | "blogPosting" | "techArticle" | "webPage" | "organization";
  title: string;
  description: string;
  baseURL: string;
  path: string;
  image?: string;
  sameAs?: string[];
  author?: SeoAuthor;
};

const baseURL = "https://www.osobni.david-kozak.com";

const author = {
  name: "David Kozák",
  url: baseURL,
};

const defaultMeta: MetaProps = {
  title: "Ultimate OS | Digitální identita a AI obrana",
  description:
    "Ultimate OS propojuje designovou identitu, prémiové rozhraní a architekturu AI Bodyguard pro ochranu pozornosti a soukromí.",
  baseURL,
  type: "website",
  image: "/gallery/cat-neon-city.png",
  author,
};

const defaultSchema: SchemaProps = {
  as: "website",
  title: "Ultimate OS",
  description: defaultMeta.description,
  baseURL,
  path: "/",
  image: defaultMeta.image,
  author,
  sameAs: [baseURL],
};

const pageSeo: Record<
  string,
  {
    meta: Pick<MetaProps, "title" | "description" | "path" | "image">;
    schema: Pick<SchemaProps, "as" | "title" | "description" | "path" | "image">;
  }
> = {
  ultimate: {
    meta: {
      title: "Ultimate OS | Digitální identita a designová suverenita",
      description:
        "Ultimate OS je designový surface Davida Kozáka propojující digitální identitu, noční atmosféru a prémiové rozhraní postavené na Once UI.",
      path: "/",
      image: "/gallery/neon-frame.png",
    },
    schema: {
      as: "website",
      title: "Ultimate OS",
      description:
        "Designový surface propojující digitální identitu, noční atmosféru a prémiové rozhraní.",
      path: "/",
      image: "/gallery/neon-frame.png",
    },
  },
  aiGuard: {
    meta: {
      title: "AI Bodyguard | Architektura detekce manipulace",
      description:
        "AI Bodyguard mapuje vrstvy detekce manipulace, aktivní obranu a on-premise AI infrastrukturu pro ochranu pozornosti a soukromí.",
      path: "/ai-guard",
      image: "/gallery/cat-neon-city.png",
    },
    schema: {
      as: "webPage",
      title: "AI Bodyguard",
      description:
        "Architektura detekce manipulace a aktivní obrany proti digitálnímu nátlaku.",
      path: "/ai-guard",
      image: "/gallery/cat-neon-city.png",
    },
  },
  philosophy: {
    meta: {
      title: "AI Bodyguard Philosophy | Inverzní marketing a válka o pozornost",
      description:
        "Filosofie AI Bodyguard: attention economy, inverzní marketing a user-first logika digitálního imunitního systému.",
      path: "/ai-guard/philosophy",
      image: "/gallery/cat-moon-silhouette.png",
    },
    schema: {
      as: "webPage",
      title: "AI Bodyguard Philosophy",
      description:
        "Attention economy, inverzní marketing a user-first logika AI Bodyguardu.",
      path: "/ai-guard/philosophy",
      image: "/gallery/cat-moon-silhouette.png",
    },
  },
  detection: {
    meta: {
      title: "AI Bodyguard Detection | Triad of Truth",
      description:
        "Vizuální, sémantická a kódová vrstva AI Bodyguardu spojují obraz, text a chování skriptů do jednoho obranného verdiktu.",
      path: "/ai-guard/detection",
      image: "/gallery/cat-closeup.png",
    },
    schema: {
      as: "webPage",
      title: "Triad of Truth",
      description:
        "Multimodální pipeline kombinující obraz, text a kód do jednoho obranného verdiktu.",
      path: "/ai-guard/detection",
      image: "/gallery/cat-closeup.png",
    },
  },
  defense: {
    meta: {
      title: "AI Bodyguard Defense | Projekt Mlhová Clona",
      description:
        "Fog Screen, data poisoning, zen overlay a režimy zásahu pro aktivní obranu proti digitální manipulaci.",
      path: "/ai-guard/defense",
      image: "/gallery/neon-eclipse.png",
    },
    schema: {
      as: "webPage",
      title: "Projekt Mlhová Clona",
      description:
        "Aktivní obrana AI Bodyguardu: fog screen, zen overlay a řízené režimy intervence.",
      path: "/ai-guard/defense",
      image: "/gallery/neon-eclipse.png",
    },
  },
  build: {
    meta: {
      title: "AI Bodyguard Build | HGX H100 a The Skeptic",
      description:
        "On-premise architektura AI Bodyguardu: HGX H100, air-gapped inference, Dataset Zla a fine-tuning modelu The Skeptic.",
      path: "/ai-guard/build",
      image: "/gallery/cat-nebula-01.png",
    },
    schema: {
      as: "webPage",
      title: "AI Bodyguard Build",
      description:
        "HGX H100, air-gapped inference a roadmap od Datasetu Zla po model The Skeptic.",
      path: "/ai-guard/build",
      image: "/gallery/cat-nebula-01.png",
    },
  },
  results: {
    meta: {
      title: "Expected Results | Analýza očekávaných výsledků",
      description:
        "Vizualizace očekávaného růstu efektivity, snížení rizik a návratnosti investice po implementaci řešení pomocí Once UI chart komponent.",
      path: "/expected-results",
      image: "/gallery/neon-frame.png",
    },
    schema: {
      as: "webPage",
      title: "Expected Results",
      description:
        "Analytická page s projekcí výkonu v čase, srovnáním rizik a strukturou přínosů.",
      path: "/expected-results",
      image: "/gallery/neon-frame.png",
    },
  },
};

export type PageSeoKey = keyof typeof pageSeo;

export function getPageMeta(pageKey: PageSeoKey) {
  return {
    ...defaultMeta,
    ...pageSeo[pageKey]?.meta,
  };
}

export function getPageSchema(pageKey: PageSeoKey) {
  return {
    ...defaultSchema,
    ...pageSeo[pageKey]?.schema,
  };
}

export { author, baseURL, defaultMeta, defaultSchema };
