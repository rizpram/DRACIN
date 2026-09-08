import { getCatalog } from "@/lib/catalog";
import type { Drama, Episode } from "@/lib/dramas";
import { getProviderDrama, getProviderEpisodeStream } from "@/lib/captain-multi";
import { directoryProvider } from "@/lib/provider-directory";
import { getSansekaiDrama, getSansekaiEpisodeStream } from "@/lib/sansekai";
import { getSharedJson, setSharedJson } from "@/lib/shared-cache";

const TTL_SECONDS = 10 * 60;
const VERIFIED_DETAIL_TTL_SECONDS = 30 * 60;
const VERIFIED_STREAM_TTL_SECONDS = 3 * 60;
const MAX_CANDIDATES = 8;
const BATCH_SIZE = 2;
const MAX_PLAYABLE = 6;

function detailKey(id:string){return `playable:detail:${id}`}
function streamKey(id:string,episode:number){return `playable:stream:${id}:${episode}`}

async function resolveStream(detail:Drama,episode:Episode):Promise<string|null>{
  const provider=directoryProvider(detail.provider);
  if(!provider)return null;
  return provider.source==="captain"
    ? getProviderEpisodeStream(detail,episode)
    : getSansekaiEpisodeStream(detail,episode);
}

async function verifyOne(drama: Drama): Promise<Drama | null> {
  const provider = directoryProvider(drama.provider);
  if (!provider) return null;
  try {
    const detail = provider.source === "captain"
      ? await getProviderDrama(drama.id)
      : await getSansekaiDrama(drama.id);
    const episode = detail?.episodes?.[0];
    if (!detail || !episode) return null;
    const streamUrl = await resolveStream(detail,episode);
    if (!streamUrl) return null;
    await Promise.all([
      setSharedJson(detailKey(drama.id),detail,VERIFIED_DETAIL_TTL_SECONDS),
      setSharedJson(streamKey(drama.id,episode.number),streamUrl,VERIFIED_STREAM_TTL_SECONDS),
    ]);
    return drama;
  } catch {
    return null;
  }
}

export async function getVerifiedDrama(id:string):Promise<Drama|null>{
  return getSharedJson<Drama>(detailKey(id));
}

export async function getVerifiedEpisodeStream(drama:Drama,episodeNumber:number):Promise<string|null>{
  const cached=await getSharedJson<string>(streamKey(drama.id,episodeNumber));
  if(cached)return cached;
  const episode=drama.episodes.find(ep=>ep.number===episodeNumber);
  if(!episode)return null;
  try{
    const streamUrl=await resolveStream(drama,episode);
    if(streamUrl)await setSharedJson(streamKey(drama.id,episodeNumber),streamUrl,VERIFIED_STREAM_TTL_SECONDS);
    return streamUrl;
  }catch{return null}
}

export async function getPlayableCatalog(slug: string): Promise<Drama[]> {
  const key = `catalog:${slug}:playable-v3`;
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
