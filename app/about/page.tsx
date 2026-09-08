import Link from "next/link";
import { BottomNav, TopBar } from "@/components/AppChrome";
import { LegalFooter } from "@/components/Monetization";

export const metadata = {
  title: "Tentang DRACIN",
  description: "Tentang DRACIN, aplikasi discovery dan streaming drama pendek multi-provider.",
};

export default function AboutPage(){return <main className="app-shell premium-shell"><div className="mobile-frame premium-frame"><TopBar title="Tentang"/><section className="search-hero"><span className="eyebrow">DRACIN</span><h1>Drama pendek, satu tempat.</h1><p>DRACIN dirancang mobile-first untuk membantu penonton menemukan dan melanjutkan drama pendek dari beberapa integrasi provider.</p></section><section className="home-section premium-section legal-copy"><h2>Apa yang dilakukan DRACIN</h2><p>DRACIN menyatukan katalog, detail, episode, pencarian, favorit, riwayat, dan pemutaran yang tersedia dari provider terintegrasi ke dalam satu pengalaman 9:16 yang ringan.</p><h2>Discovery</h2><p>Selain pencarian judul, DRACIN mengelompokkan metadata yang tersedia menjadi genre dan collection seperti CEO Romance, Revenge, Hidden Identity, dan tema lainnya agar konten lebih mudah ditemukan.</p><h2>Ketersediaan</h2><p>Katalog, jumlah episode, metadata, dan playback dapat berubah mengikuti respons provider. Karena itu beberapa judul atau episode dapat tersedia berbeda dari waktu ke waktu.</p><h2>Sumber konten</h2><p>Daftar integrasi dan cara DRACIN memperlakukan sumber katalog dijelaskan di halaman Content Sources.</p><Link href="/content-sources" className="ghost-action">Lihat Content Sources</Link></section><LegalFooter/><BottomNav/></div></main>}
