import type { Drama } from "@/lib/dramas";
import { getPlayableCatalog } from "@/lib/playable-catalog";
import { recordProviderHealth, type ProviderHealthStatus } from "@/lib/provider-health";
import { VERIFIED_PLAYABLE_PROVIDERS } from "@/lib/playable-providers";
import { getSharedJsonWithStatus, setSharedJson, type SharedCacheStatus } from "@/lib/shared-cache";

const HOME_TTL_SECONDS = 300;
const CURATED_HOME = VERIFIED_PLAYABLE_PROVIDERS;
const HOME_CACHE_KEY = "home:playable-v3";

export type HomePayload = {
  dramas: Drama[];
  healthyProviders: string[];
  health: Record<string, ProviderHealthStatus>;
  generatedAt: number;
};

export type HomePayloadResult = {
  payload: HomePayload;
  cacheStatus: SharedCacheStatus;
};

function unique(rows: Drama[]) {
  const seen = new Set<string>();
  return rows.filter((drama) => {
    if (seen.has(drama.id)) return false;
    seen.add(drama.id);
    return true;
  });
}

export async function getHomePayloadWithMeta(): Promise<HomePayloadResult> {
  const cached = await getSharedJsonWithStatus<HomePayload>(HOME_CACHE_KEY);
  if (cached.value) return { payload: cached.value, cacheStatus: cached.status };

  const settled = await Promise.allSettled(
    CURATED_HOME.map(async (slug) => {
      const rows = await getPlayableCatalog(slug);
      await recordProviderHealth(slug, rows.length, rows.length === 0);
      return { slug, rows };
    }),
  );

  const health: Record<string, ProviderHealthStatus> = {};
  const healthyProviders: string[] = [];
  const rows: Drama[] = [];

  for (let i = 0; i < settled.length; i += 1) {
    const slug = CURATED_HOME[i];
    const result = settled[i];
    if (result.status === "fulfilled" && result.value.rows.length) {
      health[slug] = "healthy";
      healthyProviders.push(slug);
      rows.push(...result.value.rows);
    } else {
      health[slug] = "down";
    }
  }

  const dramas = unique(rows).slice(0, 24);
  const payload = { dramas, healthyProviders, health, generatedAt: Date.now() };
  if (dramas.length) await setSharedJson(HOME_CACHE_KEY, payload, HOME_TTL_SECONDS);
  return { payload, cacheStatus: "MISS" };
}

export async function getHomePayload(): Promise<HomePayload> {
  return (await getHomePayloadWithMeta()).payload;
}
