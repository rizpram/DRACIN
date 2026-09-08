import Link from "next/link";
import { BottomNav, TopBar } from "@/components/AppChrome";
import { LegalFooter } from "@/components/Monetization";
import { DISCOVERY_COLLECTIONS, DISCOVERY_GENRES } from "@/lib/discovery";
import { PROVIDER_DIRECTORY } from "@/lib/provider-directory";

export const metadata = {
  title: "Browse Drama Pendek — DRACIN",
  description: "Jelajahi drama pendek berdasarkan genre, collection, trope, dan provider.",
};

export default function BrowsePage(){
  const captain=PROVIDER_DIRECTORY.filter(p=>p.source==="captain");
  const sansekai=PROVIDER_DIRECTORY.filter(p=>p.source==="sansekai");
  return <main className="app-shell premium-shell"><div className="mobile-frame premium-frame">
    <TopBar title="Browse"/>
    <section className="search-hero"><span className="eyebrow">Discovery</span><h1>Jelajahi DRACIN</h1><p>Cari cerita lewat genre, trope, collection, atau provider tanpa harus menebak judul.</p></section>

    <section className="home-section premium-section"><div className="section-title-row"><div><span className="eyebrow">Genre</span><h2>Pilih suasana</h2></div><span>{DISCOVERY_GENRES.length}</span></div><div className="browse-grid">{DISCOVERY_GENRES.map(item=><Link key={item.slug} href={`/genre/${item.slug}`} className="browse-tile"><strong>{item.label}</strong><small>{item.description}</small></Link>)}</div></section>

    <section className="home-section premium-section"><div className="section-title-row"><div><span className="eyebrow">Collections</span><h2>Pilih pola cerita</h2></div><span>{DISCOVERY_COLLECTIONS.length}</span></div><div className="browse-grid">{DISCOVERY_COLLECTIONS.map(item=><Link key={item.slug} href={`/collection/${item.slug}`} className="browse-tile"><strong>{item.label}</strong><small>{item.description}</small></Link>)}</div></section>

    <section className="home-section premium-section" id="providers"><div className="section-title-row"><div><span className="eyebrow">Provider</span><h2>Sumber katalog</h2></div><Link href="/content-sources">Tentang sumber ›</Link></div>{captain.length?<div className="provider-block"><h3>Captain <small>primary</small></h3><div className="provider-chip-grid">{captain.map(p=><Link key={p.slug} href={`/provider/${p.slug}`}><span className="source-dot captain"/><strong>{p.name}</strong></Link>)}</div></div>:null}{sansekai.length?<div className="provider-block"><h3>Sansekai <small>fallback</small></h3><div className="provider-chip-grid">{sansekai.map(p=><Link key={p.slug} href={`/provider/${p.slug}`}><span className="source-dot sansekai"/><strong>{p.name}</strong></Link>)}</div></div>:null}</section>

    <LegalFooter/><BottomNav/>
  </div></main>
}
