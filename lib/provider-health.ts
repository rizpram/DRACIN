import { getSharedJson, setSharedJson } from "@/lib/shared-cache";

export type ProviderHealthStatus = "healthy" | "degraded" | "down" | "unknown";
export type ProviderHealth = {
  slug: string;
  status: ProviderHealthStatus;
  catalogCount: number;
  checkedAt: number;
};

const HEALTH_TTL_SECONDS = 10 * 60;

export async function recordProviderHealth(slug: string, catalogCount: number, degraded = false) {
  const value: ProviderHealth = {
    slug,
    status: catalogCount > 0 ? (degraded ? "degraded" : "healthy") : "down",
    catalogCount,
    checkedAt: Date.now(),
  };
  await setSharedJson(`health:${slug}`, value, HEALTH_TTL_SECONDS);
  return value;
}

export async function getProviderHealth(slug: string): Promise<ProviderHealth> {
  return (
    (await getSharedJson<ProviderHealth>(`health:${slug}`)) || {
      slug,
      status: "unknown",
      catalogCount: 0,
      checkedAt: 0,
    }
  );
}

export async function getProviderHealthMap(slugs: string[]) {
  const rows = await Promise.all(slugs.map((slug) => getProviderHealth(slug)));
  return Object.fromEntries(rows.map((row) => [row.slug, row])) as Record<string, ProviderHealth>;
}
