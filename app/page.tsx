import Link from "next/link";
import { AdSlot, LegalFooter, SupportButton } from "@/components/Monetization";
import { BottomNav, TopBar } from "@/components/AppChrome";
import { DramaCard } from "@/components/DramaUI";
import { CollectionStrip, EpisodeUpdates } from "@/components/DiscoveryUI";
import { DISCOVERY_GENRES, episodeCount } from "@/lib/discovery";
import { getHomePayload } from "@/lib/home-feed";
import { PROVIDER_DIRECTORY } from "@/lib/provider-directory";

export const dynamic="force-dynamic";

export default async function HomePage(){
  const {dramas,healthyProviders}=await getHomePayload();
  const featured=dramas.slice(0,3);
  const visibleProviders=PROVIDER_DIRECTORY.filter(p=>healthyProviders.includes(p.slug));
  const captain=visibleProviders.filter(p=>p.source==="captain");
  const sansekai=visibleProviders.filter(p=>p.source==="sansekai");
  return <main className="app-shell premium-shell"><div className="mobile-frame premium-frame">
    <TopBar />
    <section className="premium-hero">
      {featured.length?featured.map((drama,index)=><article key={drama.id} className={`premium-hero-slide ${index===0?"primary":""}`} style={{backgroundImage:`url(${drama.backdrop||drama.cover})`}}>
        <div className="premium-hero-gradient"/><div className="premium-hero-copy"><span className="eyebrow">Pilihan Hari Ini · {drama.providerName||"FreeReels"}</span><h1>{drama.title}</h1><p>{drama.synopsis}</p><div className="hero-meta"><span>★ 4.8</span><span>{episodeCount(drama)||"?"} EP</span><span>{drama.genre}</span></div><div className="hero-actions"><Link className="primary-action" href={`/watch/${drama.id}/1`}>▶ Tonton</Link><Link className="ghost-action" href={`/drama/${drama.id}`}>Detail</Link></div></div>
      </article>):<div className="premium-hero-empty"><span className="eyebrow">DRACIN LIVE</span><h1>Katalog sedang dimuat</h1><p>Provider belum mengembalikan katalog.</p></div>}
    </section>

    <section className="genre-strip" aria-label="Genre"><Link className="active" href="/browse">Browse</Link>{DISCOVERY_GENRES.map(item=><Link href={`/genre/${item.slug}`} key={item.slug}>{item.label}</Link>)}</section>

    <section className="home-section premium-section"><div className="section-title-row"><div><span className="eyebrow">Trending</span><h2>Sedang ramai</h2></div><Link href="/discover">Lihat semua ›</Link></div><div className="premium-grid">{dramas.slice(0,8).map((d,i)=><DramaCard key={d.id} drama={d} index={i} priority={i<2}/>)}</div></section>

    <EpisodeUpdates dramas={dramas}/>
    <AdSlot placement="home"/>
    <CollectionStrip/>

    <section className="home-section premium-section" id="providers"><div className="section-title-row"><div><span className="eyebrow">Sumber Konten</span><h2>Provider sehat</h2></div><Link href="/browse#providers">Semua provider ›</Link></div>
      {captain.length?<div className="provider-block"><h3>Captain <small>primary</small></h3><div className="provider-chip-grid">{captain.map(p=><Link href={`/provider/${p.slug}`} key={p.slug}><span className="source-dot captain"/><strong>{p.name}</strong></Link>)}</div></div>:null}
      {sansekai.length?<div className="provider-block"><h3>Sansekai <small>fallback</small></h3><div className="provider-chip-grid">{sansekai.map(p=><Link href={`/provider/${p.slug}`} key={p.slug}><span className="source-dot sansekai"/><strong>{p.name}</strong></Link>)}</div></div>:null}
    </section>

    <section className="home-section premium-section"><div className="section-title-row"><div><span className="eyebrow">Untuk Kamu</span><h2>Lanjut jelajah</h2></div></div><div className="premium-grid">{dramas.slice(8,20).map((d,i)=><DramaCard key={d.id} drama={d} index={i}/>)}</div></section>
    <LegalFooter/><SupportButton/><BottomNav/>
  </div></main>
}
