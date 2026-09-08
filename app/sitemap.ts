import type { MetadataRoute } from "next";
import { PROVIDER_DIRECTORY } from "@/lib/provider-directory";

const SITE_URL = "https://tv.rizpram.cloud";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/discover`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const providers: MetadataRoute.Sitemap = PROVIDER_DIRECTORY.map((provider) => ({
    url: `${SITE_URL}/provider/${encodeURIComponent(provider.slug)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...providers];
}
