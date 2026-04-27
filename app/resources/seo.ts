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

const baseURL = "https://aegis.d-international.eu";
const authorURL = "https://www.david-kozak.com";

const author = {
  name: "David Kozák",
  url: authorURL,
};

const defaultMeta: MetaProps = {
  title: "AEGIS | Ultimate OS a protokol digitální obrany",
  description:
    "AEGIS propojuje Ultimate OS, digitální identitu a lokální AI obranu proti manipulaci, digitálnímu nátlaku a sledování.",
  baseURL,
  type: "website",
  image: "/gallery/cat-neon-city.png",
  author,
};

const defaultSchema: SchemaProps = {
  as: "website",
  title: "AEGIS",
  description: defaultMeta.description,
  baseURL,
  path: "/",
  image: defaultMeta.image,
  author,
  sameAs: [baseURL, authorURL],
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
      title: "Ultimate OS | Surface systému AEGIS",
      description:
        "Ultimate OS je prémiový designový surface systému AEGIS propojující digitální identitu, noční atmosféru a rozhraní postavené na Once UI.",
      path: "/",
      image: "/gallery/neon-frame.png",
    },
    schema: {
      as: "website",
      title: "Ultimate OS",
      description:
        "Designový surface systému AEGIS propojující digitální identitu, noční atmosféru a prémiové rozhraní.",
      path: "/",
      image: "/gallery/neon-frame.png",
    },
  },
  aiGuard: {
    meta: {
      title: "AEGIS | Protokol: Aegis",
      description:
        "Protokol: Aegis mapuje vrstvy detekce manipulace, aktivní obranu a on-premise AI infrastrukturu pro ochranu pozornosti a soukromí.",
      path: "/ai-guard",
      image: "/gallery/cat-neon-city.png",
    },
    schema: {
      as: "webPage",
      title: "Protokol: Aegis",
      description:
        "Architektura detekce manipulace a aktivní obrany protokolu AEGIS proti digitálnímu nátlaku.",
      path: "/ai-guard",
      image: "/gallery/cat-neon-city.png",
    },
  },
  philosophy: {
    meta: {
      title: "AEGIS Philosophy | Inverzní marketing a válka o pozornost",
      description:
        "Filosofie protokolu AEGIS: attention economy, inverzní marketing a user-first logika digitálního imunitního systému.",
      path: "/ai-guard/philosophy",
      image: "/gallery/cat-moon-silhouette.png",
    },
    schema: {
      as: "webPage",
      title: "AEGIS Philosophy",
      description:
        "Attention economy, inverzní marketing a user-first logika protokolu AEGIS.",
      path: "/ai-guard/philosophy",
      image: "/gallery/cat-moon-silhouette.png",
    },
  },
  detection: {
    meta: {
      title: "AEGIS Detection | Triad of Truth",
      description:
        "Vizuální, sémantická a kódová vrstva protokolu AEGIS spojují obraz, text a chování skriptů do jednoho obranného verdiktu.",
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
      title: "AEGIS Defense | Projekt Mlhová Clona",
      description:
        "Fog Screen, data poisoning, zen overlay a režimy zásahu protokolu AEGIS pro aktivní obranu proti digitální manipulaci.",
      path: "/ai-guard/defense",
      image: "/gallery/neon-eclipse.png",
    },
    schema: {
      as: "webPage",
      title: "Projekt Mlhová Clona",
      description:
        "Aktivní obrana protokolu AEGIS: fog screen, zen overlay a řízené režimy intervence.",
      path: "/ai-guard/defense",
      image: "/gallery/neon-eclipse.png",
    },
  },
  build: {
    meta: {
      title: "AEGIS Build | HGX H100 a The Skeptic",
      description:
        "On-premise architektura protokolu AEGIS: HGX H100, air-gapped inference, Dataset Zla a fine-tuning modelu The Skeptic.",
      path: "/ai-guard/build",
      image: "/gallery/cat-nebula-01.png",
    },
    schema: {
      as: "webPage",
      title: "AEGIS Build",
      description:
        "HGX H100, air-gapped inference a roadmap od Datasetu Zla po model The Skeptic.",
      path: "/ai-guard/build",
      image: "/gallery/cat-nebula-01.png",
    },
  },
  results: {
    meta: {
      title: "AEGIS Results | Analýza očekávaných výsledků",
      description:
        "Vizualizace očekávaného růstu efektivity, snížení rizik a návratnosti investice po implementaci řešení v ekosystému AEGIS pomocí Once UI chart komponent.",
      path: "/expected-results",
      image: "/gallery/neon-frame.png",
    },
    schema: {
      as: "webPage",
      title: "AEGIS Results",
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
