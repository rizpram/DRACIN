import Link from "next/link";
import { notFound } from "next/navigation";
import { BottomNav, ProviderBadge, TopBar } from "@/components/AppChrome";
import LazyDramaGrid from "@/components/LazyDramaGrid";
import { getCatalog } from "@/lib/catalog";
import { directoryProvider } from "@/lib/provider-directory";
import { recordProviderHealth } from "@/lib/provider-health";

export const dynamic="force-dynamic";

export default async function ProviderPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const provider=directoryProvider(slug);if(!provider)notFound();
  const dramas=await getCatalog(slug);await recordProviderHealth(slug,dramas.length);
  return <main className="app-shell premium-shell"><div className="mobile-frame premium-frame">
    <TopBar title={provider.name}/>
    <section className="provider-hero-premium"><Link href="/" className="round-action back-round">←</Link><div><span className="eyebrow">{provider.source==="captain"?"Primary source":"Fallback source"}</span><h1>{provider.name}</h1><p>{dramas.length?`${dramas.length} judul tersedia dan sudah bisa dijelajahi.`:"Katalog sedang tidak tersedia. DRACIN akan memakai fallback bila tersedia."}</p><ProviderBadge name={provider.source==="captain"?"Captain":"Sansekai"} source={provider.source}/></div></section>
    <section className="home-section premium-section"><div className="section-title-row"><h2>Daftar Konten</h2><span>{dramas.length} judul</span></div>{dramas.length?<LazyDramaGrid dramas={dramas}/>:<div className="premium-empty"><b>◌</b><h3>Belum ada katalog</h3><p>Coba provider lain. Source yang belum sehat tidak ditampilkan sebagai konten palsu.</p><Link href="/discover" className="ghost-action">Jelajahi provider lain</Link></div>}</section>
    <BottomNav/>
  </div></main>
}
