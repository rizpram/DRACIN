import type { Drama } from "@/lib/dramas";

export type DiscoveryDefinition = {
  slug: string;
  label: string;
  description: string;
  keywords: string[];
};

type DramaWithCount = Drama & { episodeCount?: number };

export const DISCOVERY_GENRES: DiscoveryDefinition[] = [
  { slug: "romance", label: "Romansa", description: "Kisah cinta, hubungan, dan kehidupan rumah tangga.", keywords: ["romance", "romansa", "cinta", "love", "marriage", "pernikahan", "suami", "istri"] },
  { slug: "action", label: "Action", description: "Konflik, pertarungan, dan drama berenergi tinggi.", keywords: ["action", "aksi", "fight", "war", "battle", "kungfu", "martial"] },
  { slug: "comedy", label: "Komedi", description: "Drama ringan dengan unsur humor dan situasi absurd.", keywords: ["comedy", "komedi", "funny", "humor"] },
  { slug: "fantasy", label: "Fantasi", description: "Dunia alternatif, kekuatan khusus, dan unsur supernatural.", keywords: ["fantasy", "fantasi", "supernatural", "immortal", "cultivation", "magic"] },
  { slug: "thriller", label: "Thriller", description: "Ketegangan, bahaya, dan konflik penuh kejutan.", keywords: ["thriller", "suspense", "crime", "kriminal", "murder", "killer"] },
  { slug: "drama", label: "Drama", description: "Konflik keluarga, kehidupan, dan emosi yang intens.", keywords: ["drama", "family", "keluarga", "life", "kehidupan"] },
  { slug: "mystery", label: "Misteri", description: "Rahasia, identitas tersembunyi, dan teka-teki.", keywords: ["mystery", "misteri", "secret", "rahasia", "unknown"] },
];

export const DISCOVERY_COLLECTIONS: DiscoveryDefinition[] = [
  { slug: "ceo-romance", label: "CEO Romance", description: "Bos, CEO, pewaris, dan romansa dunia bisnis.", keywords: ["ceo", "boss", "bos", "billionaire", "miliarder", "president", "direktur", "heir", "pewaris"] },
  { slug: "contract-marriage", label: "Contract Marriage", description: "Hubungan yang dimulai dari kontrak, perjanjian, atau pernikahan mendadak.", keywords: ["contract marriage", "marriage contract", "nikah kontrak", "pernikahan kontrak", "suami kontrak", "istri kontrak"] },
  { slug: "revenge", label: "Revenge", description: "Balas dendam, pengkhianatan, dan pembalasan.", keywords: ["revenge", "vengeance", "balas dendam", "pembalasan", "betray", "pengkhianatan"] },
  { slug: "hidden-identity", label: "Hidden Identity", description: "Tokoh yang menyembunyikan status, kekayaan, atau identitas sebenarnya.", keywords: ["hidden identity", "secret identity", "identitas", "rahasia", "ternyata", "disguise", "menyamar"] },
  { slug: "secret-baby", label: "Secret Baby", description: "Anak rahasia, kehamilan, kembar, dan reuni keluarga.", keywords: ["secret baby", "anak rahasia", "baby", "bayi", "pregnant", "hamil", "triplet", "kembar"] },
  { slug: "second-chance", label: "Second Chance", description: "Kesempatan kedua, kembali ke masa lalu, atau memulai ulang hidup.", keywords: ["second chance", "kesempatan kedua", "reborn", "reincarn", "kembali", "regret", "comeback"] },
  { slug: "mafia-romance", label: "Mafia Romance", description: "Romansa penuh risiko dengan dunia mafia atau gangster.", keywords: ["mafia", "gangster", "mob", "underworld"] },
  { slug: "strong-female-lead", label: "Strong Female Lead", description: "Tokoh perempuan dominan, tangguh, dan tidak mudah dikendalikan.", keywords: ["strong female", "wanita kuat", "queen", "ratu", "female lead", "heroine", "cewek kuat"] },
  { slug: "rich-family", label: "Rich Family", description: "Keluarga konglomerat, pewaris, dan konflik kelas atas.", keywords: ["rich family", "keluarga kaya", "konglomerat", "heir", "pewaris", "miliarder", "wealthy"] },
  { slug: "love-after-marriage", label: "Love After Marriage", description: "Cinta yang berkembang setelah menikah atau hidup bersama.", keywords: ["after marriage", "setelah menikah", "marriage", "pernikahan", "suami", "istri"] },
];

export function episodeCount(drama: Drama): number {
  const enriched = drama as DramaWithCount;
  return enriched.episodeCount ?? drama.episodes.length;
}

function searchable(drama: Drama): string {
  return `${drama.title} ${drama.synopsis} ${drama.genre} ${drama.providerName ?? ""}`.toLowerCase();
}

export function matchesDefinition(drama: Drama, definition: DiscoveryDefinition): boolean {
  const haystack = searchable(drama);
  return definition.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

export function collectionBySlug(slug: string): DiscoveryDefinition | undefined {
  return DISCOVERY_COLLECTIONS.find((item) => item.slug === slug);
}

export function genreBySlug(slug: string): DiscoveryDefinition | undefined {
  return DISCOVERY_GENRES.find((item) => item.slug === slug);
}

export function filterByDefinition(dramas: Drama[], definition: DiscoveryDefinition): Drama[] {
  return dramas.filter((drama) => matchesDefinition(drama, definition));
}

export function latestEpisodeRows(dramas: Drama[], limit = 6): Array<{ drama: Drama; episode: number }> {
  return dramas
    .map((drama) => ({ drama, episode: episodeCount(drama) }))
    .filter((row) => row.episode > 0)
    .slice(0, limit);
}
