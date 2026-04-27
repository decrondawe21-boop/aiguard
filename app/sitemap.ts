import type { MetadataRoute } from "next";

const baseURL = "https://aegis.d-international.eu";
const lastModified = new Date("2026-04-27T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseURL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseURL}/ai-guard`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseURL}/ai-guard/philosophy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseURL}/ai-guard/detection`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseURL}/ai-guard/defense`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseURL}/ai-guard/build`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.76,
    },
    {
      url: `${baseURL}/ai-guard/results`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
