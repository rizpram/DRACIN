import { getCatalog } from "@/lib/catalog";
import { getDramas, type Drama } from "@/lib/dramas";
import { recordProviderHealth, type ProviderHealthStatus } from "@/lib/provider-health";
import { withSharedCache } from "@/lib/shared-cache";

const HOME_TTL_SECONDS = 300;
const CURATED_HOME = ["flickreels", "cubetv", "netshort", "pinedrama"] as const;

export type HomePayload = {
  dramas: Drama[];
  healthyProviders: string[];
  health: Record<string, ProviderHealthStatus>;
  generatedAt: number;
};

function unique(rows: Drama[]) {
  const seen = new Set<string>();
  return rows.filter((drama) => {
    if (seen.has(drama.id)) return false;
    seen.add(drama.id);
    return true;
  });
}

export async function getHomePayload(): Promise<HomePayload> {
  return withSharedCache("home:v3", HOME_TTL_SECONDS, async () => {
    const defaultPromise = getDramas();
    const providerPromises = CURATED_HOME.map(async (slug) => {
      const rows = await getCatalog(slug);
      await recordProviderHealth(slug, rows.length);
      return { slug, rows };
    });

    const [defaultRows, settled] = await Promise.all([
      defaultPromise,
      Promise.allSettled(providerPromises),
    ]);

    await recordProviderHealth("freereels", defaultRows.length);

    const health: Record<string, ProviderHealthStatus> = {
      freereels: defaultRows.length ? "healthy" : "down",
    };
    const healthyProviders = defaultRows.length ? ["freereels"] : [];
    const extra: Drama[] = [];

    for (let i = 0; i < settled.length; i += 1) {
      const slug = CURATED_HOME[i];
      const result = settled[i];
      if (result.status === "fulfilled" && result.value.rows.length) {
        health[slug] = "healthy";
        healthyProviders.push(slug);
        extra.push(...result.value.rows.slice(0, 4));
      } else {
        health[slug] = "down";
      }
    }

    const dramas = unique([...defaultRows.slice(0, 16), ...extra]).slice(0, 28);
    return { dramas, healthyProviders, health, generatedAt: Date.now() };
  });
}
