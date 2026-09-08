import type { Metadata } from "next";
import { BottomNav, TopBar } from "@/components/AppChrome";
import { LegalFooter } from "@/components/Monetization";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — DRACIN",
  description: "Informasi privasi, penyimpanan lokal, iklan, dan layanan pihak ketiga di DRACIN.",
};

export default function PrivacyPage() {
  return (
    <main className="app-shell premium-shell">
      <div className="mobile-frame premium-frame">
        <TopBar title="Privasi" />
        <section className="search-hero">
          <span className="eyebrow">Legal</span>
          <h1>Kebijakan Privasi</h1>
          <p>Terakhir diperbarui: 8 September 2026.</p>
        </section>
        <section className="home-section premium-section legal-copy">
          <h2>Data yang tersimpan di perangkat</h2>
          <p>Fitur seperti Favorit dan Riwayat dapat menyimpan data di browser perangkat agar pengalaman menonton tetap berlanjut saat pengguna kembali.</p>

          <h2>Data dan layanan provider</h2>
          <p>DRACIN mengambil katalog dan metadata dari provider yang terintegrasi melalui server aplikasi. Ketersediaan konten, metadata, dan URL pemutaran dapat bergantung pada provider terkait.</p>

          <h2>Iklan dan cookie</h2>
          <p>DRACIN dapat menampilkan iklan dari Google AdSense atau mitra periklanan lain. Penyedia iklan dapat menggunakan cookie, identifier, atau teknologi serupa sesuai kebijakan mereka untuk pengukuran, pencegahan fraud, dan personalisasi bila diizinkan.</p>

          <h2>Pilihan pengguna</h2>
          <p>Pengguna dapat mengelola cookie dan penyimpanan situs melalui pengaturan browser. Untuk wilayah yang memerlukan consent management tambahan, DRACIN dapat menggunakan mekanisme consent dari penyedia iklan yang berlaku.</p>

          <h2>Tautan pihak ketiga</h2>
          <p>Tautan sponsor, provider, dan layanan dukungan dapat membuka situs pihak ketiga. Kebijakan privasi situs tersebut berlaku setelah pengguna meninggalkan DRACIN.</p>

          <h2>Perubahan kebijakan</h2>
          <p>Kebijakan ini dapat diperbarui saat fitur, provider, atau partner monetisasi berubah. Tanggal pembaruan akan ditampilkan di halaman ini.</p>
        </section>
        <LegalFooter />
        <BottomNav />
      </div>
    </main>
  );
}
