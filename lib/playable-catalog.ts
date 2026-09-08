import { getCatalog } from "@/lib/catalog";
import type { Drama } from "@/lib/dramas";
import { getProviderDrama, getProviderEpisodeStream } from "@/lib/captain-multi";
import { directoryProvider } from "@/lib/provider-directory";
import { getSansekaiDrama, getSansekaiEpisodeStream } from "@/lib/sansekai";
import { getSharedJson, setSharedJson } from "@/lib/shared-cache";

const TTL_SECONDS = 10 * 60;
const MAX_CANDIDATES = 8;
const BATCH_SIZE = 2;
const MAX_PLAYABLE = 6;

async function verifyOne(drama: Drama): Promise<Drama | null> {
  const provider = directoryProvider(drama.provider);
  if (!provider) return null;
  try {
    const detail = provider.source === "captain"
      ? await getProviderDrama(drama.id)
      : await getSansekaiDrama(drama.id);
    const episode = detail?.episodes?.[0];
    if (!detail || !episode) return null;
    const streamUrl = provider.source === "captain"
      ? await getProviderEpisodeStream(detail, episode)
      : await getSansekaiEpisodeStream(detail, episode);
    if (!streamUrl) return null;
    return drama;
  } catch {
    return null;
  }
}

export async function getPlayableCatalog(slug: string): Promise<Drama[]> {
  const key = `catalog:${slug}:playable-v2`;
  const cached = await getSharedJson<Drama[]>(key);
  if (cached) return cached;

  const catalog = await getCatalog(slug);
  const candidates = catalog.slice(0, MAX_CANDIDATES);
  const playable: Drama[] = [];

  for (let i = 0; i < candidates.length && playable.length < MAX_PLAYABLE; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);
    const checked = await Promise.all(batch.map(verifyOne));
    for (const row of checked) if (row) playable.push(row);
  }

  if (playable.length) await setSharedJson(key, playable, TTL_SECONDS);
  return playable;
}
