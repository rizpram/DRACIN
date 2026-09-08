type LocalEntry = { expiresAt: number; value: unknown };

const local = new Map<string, LocalEntry>();
const inflight = new Map<string, Promise<unknown>>();

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
    if (!response.ok) return null;
    const payload = (await response.json()) as { result?: unknown };
    return payload.result ?? null;
  } catch {
    return null;
  }
}

export function sharedCacheEnabled() {
  return Boolean(redisUrl && redisToken);
}

export async function getSharedJson<T>(key: string): Promise<T | null> {
  const memory = localGet<T>(key);
  if (memory !== null) return memory;

  const raw = await redisCommand(["GET", fullKey(key)]);
  if (typeof raw !== "string" || !raw) return null;
  try {
    const parsed = JSON.parse(raw) as { expiresAt?: number; value?: T };
    if (!parsed.expiresAt || parsed.expiresAt <= Date.now()) return null;
    const remaining = Math.max(1, Math.ceil((parsed.expiresAt - Date.now()) / 1000));
    localSet(key, parsed.value as T, remaining);
    return parsed.value as T;
  } catch {
    return null;
  }
}

export async function setSharedJson<T>(key: string, value: T, ttlSeconds: number) {
  localSet(key, value, ttlSeconds);
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
  return { localEntries: local.size, fresh, inflight: inflight.size, redis: sharedCacheEnabled() };
}
