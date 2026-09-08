import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BottomNav, TopBar } from "@/components/AppChrome";
import LazyDramaGrid from "@/components/LazyDramaGrid";
import { LegalFooter } from "@/components/Monetization";
import { filterByDefinition, genreBySlug } from "@/lib/discovery";
import { getHomePayload } from "@/lib/home-feed";

export const dynamic="force-dynamic";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const genre=genreBySlug(slug);
  if(!genre)return{};
  return{title:`${genre.label} — DRACIN`,description:genre.description};
}

export default async function GenrePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const genre=genreBySlug(slug);if(!genre)notFound();
  const {dramas}=await getHomePayload();const matched=filterByDefinition(dramas,genre);
  return <main className="app-shell premium-shell"><div className="mobile-frame premium-frame">
    <TopBar title="Genre"/>
    <section className="search-hero"><span className="eyebrow">Genre</span><h1>{genre.label}</h1><p>{genre.description}</p></section>
    <section className="home-section premium-section">{matched.length?<><div className="section-title-row"><h2>Judul {genre.label}</h2><span>{matched.length}</span></div><LazyDramaGrid dramas={matched}/></>:<div className="premium-empty"><b>◌</b><h3>Belum ada judul yang cocok</h3><p>Genre ini mengikuti metadata dari provider. Coba Browse untuk kategori lain.</p><Link className="ghost-action" href="/browse">Kembali ke Browse</Link></div>}</section>
    <LegalFooter/><BottomNav/>
  </div></main>
}
