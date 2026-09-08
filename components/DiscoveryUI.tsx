import Link from "next/link";
import type { Drama } from "@/lib/dramas";
import { DISCOVERY_COLLECTIONS } from "@/lib/discovery";
import { getVerifiedLatestEpisodeNumber } from "@/lib/playable-catalog";

export async function EpisodeUpdates({ dramas }: { dramas: Drama[] }) {
  const checked=await Promise.all(dramas.slice(0,12).map(async drama=>({drama,episode:await getVerifiedLatestEpisodeNumber(drama.id)})));
  const rows=checked.filter((row):row is {drama:Drama;episode:number}=>typeof row.episode==="number").slice(0,6);
  if (!rows.length) return null;
  return (
    <section className="home-section premium-section">
      <div className="section-title-row">
        <div><span className="eyebrow">Update</span><h2>Episode terbaru</h2></div>
        <Link href="/browse">Jelajahi ›</Link>
      </div>
      <div className="episode-update-list">
        {rows.map(({ drama, episode }) => (
          <Link key={drama.id} href={`/watch/${drama.id}/${episode}`} className="episode-update-card">
            <span className="episode-update-number">EP {episode}</span>
            <span className="episode-update-copy"><strong>{drama.title}</strong><small>{drama.providerName || drama.provider}</small></span>
            <span className="episode-update-play">▶</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CollectionStrip() {
  return (
    <section className="home-section premium-section">
      <div className="section-title-row">
        <div><span className="eyebrow">Collections</span><h2>Pilih sesuai cerita</h2></div>
        <Link href="/browse">Lihat semua ›</Link>
      </div>
      <div className="collection-scroll">
        {DISCOVERY_COLLECTIONS.slice(0, 8).map((collection) => (
          <Link key={collection.slug} href={`/collection/${collection.slug}`} className="collection-card">
            <strong>{collection.label}</strong>
            <small>{collection.description}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
