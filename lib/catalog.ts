import type { Drama } from "@/lib/dramas";
import { getProviderCatalog } from "@/lib/captain-multi";
import { getSansekaiCatalog } from "@/lib/sansekai";
import { directoryProvider } from "@/lib/provider-directory";
import { withSharedCache } from "@/lib/shared-cache";

const CATALOG_TTL_SECONDS = 300;

function compactCatalog(rows: Drama[]): Drama[] {
  return rows.map((drama) => ({
    ...drama,
    episodeCount: drama.episodes.length,
    episodes: [],
  })) as Drama[];
}

export async function getCatalog(slug: string): Promise<Drama[]> {
  const provider = directoryProvider(slug);
  if (!provider) return [];

  return withSharedCache(`catalog:${slug}:compact-v1`, CATALOG_TTL_SECONDS, async () => {
    try {
      const rows = provider.source === "captain"
        ? await getProviderCatalog(slug)
        : await getSansekaiCatalog(slug);
      return compactCatalog(rows);
    } catch (error) {
      console.error("[DRACIN]", "catalog-failed", {
        provider: slug,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  });
}
