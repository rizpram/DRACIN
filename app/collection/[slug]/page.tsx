import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BottomNav, TopBar } from "@/components/AppChrome";
import LazyDramaGrid from "@/components/LazyDramaGrid";
import { LegalFooter } from "@/components/Monetization";
import { collectionBySlug, filterByDefinition } from "@/lib/discovery";
import { getHomePayload } from "@/lib/home-feed";

export const dynamic="force-dynamic";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const collection=collectionBySlug(slug);
  if(!collection)return{};
  return{title:`${collection.label} — DRACIN`,description:collection.description};
}

export default async function CollectionPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const collection=collectionBySlug(slug);if(!collection)notFound();
  const {dramas}=await getHomePayload();const matched=filterByDefinition(dramas,collection);
  return <main className="app-shell premium-shell"><div className="mobile-frame premium-frame">
    <TopBar title="Collection"/>
    <section className="search-hero"><span className="eyebrow">Collection</span><h1>{collection.label}</h1><p>{collection.description}</p></section>
    <section className="home-section premium-section">{matched.length?<><div className="section-title-row"><h2>Untuk collection ini</h2><span>{matched.length} judul</span></div><LazyDramaGrid dramas={matched}/></>:<div className="premium-empty"><b>◌</b><h3>Belum ada judul yang cocok</h3><p>Collection ini memakai metadata katalog yang tersedia. Coba lagi saat katalog provider diperbarui atau jelajahi collection lain.</p><Link className="ghost-action" href="/browse">Kembali ke Browse</Link></div>}</section>
    <LegalFooter/><BottomNav/>
  </div></main>
}
