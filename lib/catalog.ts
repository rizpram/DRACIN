import type { Drama } from "@/lib/dramas";
import { getProviderCatalog } from "@/lib/captain-multi";
import { getSansekaiCatalog } from "@/lib/sansekai";
import { directoryProvider } from "@/lib/provider-directory";
import { getSharedJson, setSharedJson } from "@/lib/shared-cache";

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

  const key=`catalog:${slug}:compact-v1`;
  const cached=await getSharedJson<Drama[]>(key);
  if(cached)return cached;

  try {
    const rows = provider.source === "captain"
      ? await getProviderCatalog(slug)
      : await getSansekaiCatalog(slug);
    const compact=compactCatalog(rows);
    if(compact.length)await setSharedJson(key,compact,CATALOG_TTL_SECONDS);
    return compact;
  } catch (error) {
    console.error("[DRACIN]", "catalog-failed", {
      provider: slug,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
