type LocalEntry = { expiresAt: number; value: unknown };

export type SharedCacheStatus = "MEMORY_HIT" | "REDIS_HIT" | "MISS";
export type SharedCacheResult<T> = { value: T | null; status: SharedCacheStatus };

const local = new Map<string, LocalEntry>();
const inflight = new Map<string, Promise<unknown>>();
const metrics = {
  memoryHits: 0,
  redisHits: 0,
  misses: 0,
  sets: 0,
  redisFailures: 0,
};

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
const prefix = process.env.DRACIN_CACHE_PREFIX || "dracin";

function fullKey(key: string) {
  return `${prefix}:${key}`;
}

function localGet<T>(key: string): T | null {
  const hit = local.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    local.delete(key);
    return null;
  }
  return hit.value as T;
}

function localSet<T>(key: string, value: T, ttlSeconds: number) {
  local.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

async function redisCommand(command: unknown[]): Promise<unknown> {
  if (!redisUrl || !redisToken) return null;
  try {
    const response = await fetch(redisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) {
      metrics.redisFailures += 1;
      return null;
    }
    const payload = (await response.json()) as { result?: unknown };
    return payload.result ?? null;
  } catch {
    metrics.redisFailures += 1;
    return null;
  }
}

export function sharedCacheEnabled() {
  return Boolean(redisUrl && redisToken);
}

export async function checkSharedCacheConnection() {
  if (!sharedCacheEnabled()) return false;
  return (await redisCommand(["PING"])) === "PONG";
}

export async function getSharedJsonWithStatus<T>(key: string): Promise<SharedCacheResult<T>> {
  const memory = localGet<T>(key);
  if (memory !== null) {
    metrics.memoryHits += 1;
    return { value: memory, status: "MEMORY_HIT" };
  }

  const raw = await redisCommand(["GET", fullKey(key)]);
  if (typeof raw !== "string" || !raw) {
    metrics.misses += 1;
    return { value: null, status: "MISS" };
  }

  try {
    const parsed = JSON.parse(raw) as { expiresAt?: number; value?: T };
    if (!parsed.expiresAt || parsed.expiresAt <= Date.now()) {
      metrics.misses += 1;
      return { value: null, status: "MISS" };
    }
    const remaining = Math.max(1, Math.ceil((parsed.expiresAt - Date.now()) / 1000));
    localSet(key, parsed.value as T, remaining);
    metrics.redisHits += 1;
    return { value: parsed.value as T, status: "REDIS_HIT" };
  } catch {
    metrics.misses += 1;
    return { value: null, status: "MISS" };
  }
}

export async function getSharedJson<T>(key: string): Promise<T | null> {
  return (await getSharedJsonWithStatus<T>(key)).value;
}

export async function setSharedJson<T>(key: string, value: T, ttlSeconds: number) {
  localSet(key, value, ttlSeconds);
  metrics.sets += 1;
  if (!redisUrl || !redisToken) return;
  const envelope = JSON.stringify({ expiresAt: Date.now() + ttlSeconds * 1000, value });
  await redisCommand(["SETEX", fullKey(key), ttlSeconds, envelope]);
}

export async function withSharedCache<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
  const cached = await getSharedJson<T>(key);
  if (cached !== null) return cached;

  const running = inflight.get(key) as Promise<T> | undefined;
  if (running) return running;

  const request = (async () => {
    try {
      const value = await loader();
      await setSharedJson(key, value, ttlSeconds);
      return value;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, request);
  return request;
}

export function getSharedCacheStats() {
  const now = Date.now();
  let fresh = 0;
  for (const entry of local.values()) if (entry.expiresAt > now) fresh += 1;
  const totalLookups = metrics.memoryHits + metrics.redisHits + metrics.misses;
  const totalHits = metrics.memoryHits + metrics.redisHits;
  return {
    localEntries: local.size,
    fresh,
    inflight: inflight.size,
    redis: sharedCacheEnabled(),
    lookups: totalLookups,
    hits: totalHits,
    misses: metrics.misses,
    memoryHits: metrics.memoryHits,
    redisHits: metrics.redisHits,
    hitRate: totalLookups ? Math.round((totalHits / totalLookups) * 1000) / 10 : 0,
    sets: metrics.sets,
    redisFailures: metrics.redisFailures,
  };
}
