import type { Drama } from "@/lib/dramas";
import { getProviderCatalog } from "@/lib/captain-multi";
import { getSansekaiCatalog } from "@/lib/sansekai";
import { directoryProvider } from "@/lib/provider-directory";
import { withSharedCache } from "@/lib/shared-cache";

const CATALOG_TTL_SECONDS = 300;

export async function getCatalog(slug: string): Promise<Drama[]> {
  const provider = directoryProvider(slug);
  if (!provider) return [];

  return withSharedCache(`catalog:${slug}`, CATALOG_TTL_SECONDS, async () => {
    try {
      return provider.source === "captain"
        ? await getProviderCatalog(slug)
        : await getSansekaiCatalog(slug);
    } catch (error) {
      console.error("[DRACIN]", "catalog-failed", {
        provider: slug,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  });
}
