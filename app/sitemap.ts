import type { MetadataRoute } from "next";
import { DISCOVERY_COLLECTIONS, DISCOVERY_GENRES } from "@/lib/discovery";
import { PROVIDER_DIRECTORY } from "@/lib/provider-directory";

const SITE_URL = "https://tv.rizpram.cloud";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/discover`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/browse`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/content-sources`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const genres: MetadataRoute.Sitemap = DISCOVERY_GENRES.map((genre) => ({
    url: `${SITE_URL}/genre/${genre.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const collections: MetadataRoute.Sitemap = DISCOVERY_COLLECTIONS.map((collection) => ({
    url: `${SITE_URL}/collection/${collection.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));

  const providers: MetadataRoute.Sitemap = PROVIDER_DIRECTORY.map((provider) => ({
    url: `${SITE_URL}/provider/${encodeURIComponent(provider.slug)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...genres, ...collections, ...providers];
}
