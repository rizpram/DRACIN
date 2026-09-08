import Link from "next/link";
import { BottomNav, TopBar } from "@/components/AppChrome";
import { LegalFooter } from "@/components/Monetization";
import { PROVIDER_DIRECTORY } from "@/lib/provider-directory";

export const metadata = {
  title: "Content Sources — DRACIN",
  description: "Transparansi sumber katalog dan integrasi provider DRACIN.",
};

export default function ContentSourcesPage(){
  const captain=PROVIDER_DIRECTORY.filter(p=>p.source==="captain");
  const sansekai=PROVIDER_DIRECTORY.filter(p=>p.source==="sansekai");
  return <main className="app-shell premium-shell"><div className="mobile-frame premium-frame"><TopBar title="Content Sources"/><section className="search-hero"><span className="eyebrow">Transparency</span><h1>Sumber konten DRACIN</h1><p>DRACIN menampilkan metadata dan playback yang dikembalikan oleh integrasi provider yang dikonfigurasi di server aplikasi.</p></section><section className="home-section premium-section legal-copy"><h2>Cara integrasi bekerja</h2><p>Provider utama diproses melalui layer Captain. Untuk provider tertentu, DRACIN dapat memakai Sansekai sebagai fallback. Setiap adapter hanya memakai route playback yang telah ditandai aman di registry aplikasi.</p><h2>Ketersediaan dapat berubah</h2><p>Judul, poster, sinopsis, jumlah episode, dan URL pemutaran dapat berubah atau berhenti tersedia sesuai respons provider. DRACIN tidak membuat episode palsu ketika sumber tidak mengembalikan data yang dapat dinormalisasi.</p><h2>Nama dan merek provider</h2><p>Nama provider digunakan untuk menjelaskan sumber katalog di dalam aplikasi. Merek dan materi milik pihak ketiga tetap terkait dengan pemiliknya masing-masing.</p></section><section className="home-section premium-section"><div className="section-title-row"><h2>Captain</h2><span>{captain.length} integrasi</span></div><div className="provider-chip-grid">{captain.map(p=><Link key={p.slug} href={`/provider/${p.slug}`}><span className="source-dot captain"/><strong>{p.name}</strong></Link>)}</div></section><section className="home-section premium-section"><div className="section-title-row"><h2>Sansekai</h2><span>{sansekai.length} integrasi</span></div><div className="provider-chip-grid">{sansekai.map(p=><Link key={p.slug} href={`/provider/${p.slug}`}><span className="source-dot sansekai"/><strong>{p.name}</strong></Link>)}</div></section><LegalFooter/><BottomNav/></div></main>
}
