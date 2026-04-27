import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AEGIS",
    short_name: "AEGIS",
    description: "Protokol: Aegis pro ochranu pozornosti, soukromí a digitálního rozhodování.",
    start_url: "/ai-guard",
    display: "standalone",
    background_color: "#08121f",
    theme_color: "#22d3ee",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
