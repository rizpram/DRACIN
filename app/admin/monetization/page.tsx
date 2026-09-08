import Link from "next/link";
import { TopBar } from "@/components/AppChrome";
import { AD_SLOTS, monetizationReadiness, type AdPlacement } from "@/lib/monetization";

const placements: AdPlacement[] = ["home", "discover", "search", "provider", "detail", "watch"];

export default function MonetizationAdminPage() {
  const readiness = monetizationReadiness();
  return (
    <main className="app-shell premium-shell">
      <div className="mobile-frame premium-frame">
        <TopBar title="Monetization" />
        <section className="search-hero">
          <span className="eyebrow">Revenue Readiness</span>
          <h1>Monetization</h1>
          <p>Checklist aman untuk AdSense, sponsor langsung, dan placement iklan tanpa menampilkan secret.</p>
        </section>

        <section className="home-section premium-section">
          <div className="readiness-list">
            <div><span>{readiness.adsenseClient ? "✓" : "!"}</span><strong>AdSense publisher</strong><small>{readiness.adsenseClient ? "Publisher ID siap" : "Belum dikonfigurasi"}</small></div>
            <div><span>{readiness.adsenseLoader ? "✓" : "!"}</span><strong>AdSense loader</strong><small>Mode: {readiness.mode}</small></div>
            <div><span>✓</span><strong>ads.txt</strong><small><Link href="/ads.txt">/ads.txt</Link></small></div>
            <div><span>✓</span><strong>Privacy policy</strong><small><Link href="/privacy">/privacy</Link></small></div>
            <div><span>✓</span><strong>Sitemap & crawler</strong><small><Link href="/sitemap.xml">/sitemap.xml</Link></small></div>
          </div>
        </section>

        <section className="home-section premium-section">
          <div className="section-title-row"><h2>AdSense slots</h2><span>{readiness.configuredSlots.length}/{placements.length}</span></div>
          <div className="readiness-grid">
            {placements.map((placement) => <div key={placement}><strong>{placement}</strong><span>{AD_SLOTS[placement] ? "READY" : "NEED SLOT ID"}</span></div>)}
          </div>
        </section>

        <section className="home-section premium-section">
          <div className="section-title-row"><h2>Direct sponsor</h2><span>{readiness.configuredSponsors.length}/{placements.length}</span></div>
          <p className="muted">Mode hybrid akan memprioritaskan sponsor placement yang lengkap, lalu fallback ke AdSense.</p>
          <div className="readiness-grid">
            {placements.map((placement) => <div key={placement}><strong>{placement}</strong><span>{readiness.configuredSponsors.includes(placement) ? "READY" : "OPTIONAL"}</span></div>)}
          </div>
        </section>

        <section className="home-section premium-section">
          <div className="premium-empty">
            <h3>Masih perlu dilakukan di dashboard Google</h3>
            <p>Buat ad unit untuk placement yang diinginkan, aktifkan Auto Ads bila diperlukan, dan konfigurasi Privacy & Messaging/CMP Google untuk wilayah yang mewajibkannya.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
