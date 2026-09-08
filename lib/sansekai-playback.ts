import type { Drama } from "@/lib/dramas";
import { getSansekaiCatalog, getSansekaiDrama, getSansekaiEpisodeStream } from "@/lib/sansekai";

const PLAYBACK_PROVIDERS = ["pinedrama", "dramabox", "goodshort", "mydrama"] as const;

function normalizedTitle(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string) {
  return new Set(normalizedTitle(value).split(" ").filter((x) => x.length > 1));
}

function titleScore(a: string, b: string) {
  const na = normalizedTitle(a);
  const nb = normalizedTitle(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.92;
  const aa = tokens(a);
  const bb = tokens(b);
  if (!aa.size || !bb.size) return 0;
  let overlap = 0;
  for (const token of aa) if (bb.has(token)) overlap++;
  return (2 * overlap) / (aa.size + bb.size);
}

async function candidateFor(drama: Drama) {
  if (drama.id.startsWith("sansekai:")) return drama;
  let best: Drama | null = null;
  let bestScore = 0;
  for (const slug of PLAYBACK_PROVIDERS) {
    try {
      const catalog = await getSansekaiCatalog(slug);
      for (const item of catalog) {
        const score = titleScore(drama.title, item.title);
        if (score > bestScore) {
          best = item;
          bestScore = score;
        }
      }
      if (bestScore === 1) break;
    } catch {}
  }
  // Conservative matching: never switch an unrelated title merely to obtain a stream.
  if (!best || bestScore < 0.82) return null;
  return (await getSansekaiDrama(best.id)) || best;
}

export async function getSansekaiFirstStream(drama: Drama, episodeNumber: number): Promise<string | null> {
  try {
    const candidate = await candidateFor(drama);
    if (!candidate) return null;
    const episode = candidate.episodes.find((ep) => ep.number === episodeNumber);
    if (!episode) return null;
    return (await getSansekaiEpisodeStream(candidate, episode)) || episode.streamUrl || null;
  } catch (error) {
    console.warn("[DRACIN] Sansekai-first playback failed", {
      title: drama.title,
      episodeNumber,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
