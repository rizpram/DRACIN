import Link from "next/link";
import { BottomNav, TopBar } from "@/components/AppChrome";
import LazyDramaGrid from "@/components/LazyDramaGrid";
import { getHomePayload } from "@/lib/home-feed";
import { PROVIDER_DIRECTORY } from "@/lib/provider-directory";

export const dynamic="force-dynamic";

export default async function DiscoverPage({searchParams}:{searchParams:Promise<{genre?:string}>}){
 const {genre="Semua"}=await searchParams;const {dramas,health}=await getHomePayload();const filtered=genre==="Semua"?dramas:dramas.filter(d=>d.genre.toLowerCase().includes(genre.toLowerCase()));const visibleProviders=PROVIDER_DIRECTORY.filter(p=>health[p.slug]!=="down");
 return <main className="app-shell premium-shell"><div className="mobile-frame premium-frame"><TopBar title="Explore"/><section className="search-hero"><span className="eyebrow">Jelajahi</span><h1>Temukan drama baru</h1><div className="provider-filter-scroll"><Link className={genre==="Semua"?"active":""} href="/discover">Semua</Link>{["Romansa","Action","Komedi","Fantasi","Thriller","Drama","Misteri"].map(g=><Link className={genre===g?"active":""} href={`/discover?genre=${encodeURIComponent(g)}`} key={g}>{g}</Link>)}</div></section><section className="home-section premium-section"><LazyDramaGrid dramas={filtered}/></section><section className="home-section premium-section"><div className="section-title-row"><h2>Semua Provider</h2><span>{visibleProviders.length}</span></div><div className="provider-chip-grid">{visibleProviders.map(p=><Link key={p.slug} href={`/provider/${p.slug}`}><span className={`source-dot ${p.source}`}/><strong>{p.name}</strong></Link>)}</div></section><BottomNav/></div></main>
}
