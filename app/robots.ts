import type { MetadataRoute } from "next";

const baseURL = "https://aegis.d-international.eu";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseURL}/sitemap.xml`,
    host: baseURL,
  };
}
