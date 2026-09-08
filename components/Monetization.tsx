import Link from "next/link";
import Script from "next/script";
import AdsenseUnit from "@/components/AdsenseUnit";
import {
  ADSENSE_CLIENT,
  AD_SLOTS,
  adsenseEnabled,
  sponsorFor,
  type AdPlacement,
} from "@/lib/monetization";

const saweriaUrl = process.env.NEXT_PUBLIC_SAWERIA_QR_URL || process.env.NEXT_PUBLIC_SAWERIA_URL;

export function MonetizationScripts() {
  if (!adsenseEnabled() || !ADSENSE_CLIENT) return null;
  return (
    <Script
      id="adsense-loader"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}

export function AdSlot({
  slot,
  placement,
  format = "auto",
  minHeight = 100,
}: {
  slot?: string;
  placement?: AdPlacement;
  format?: string;
  minHeight?: number;
}) {
  const sponsor = placement ? sponsorFor(placement) : null;
  if (sponsor) {
    return (
      <a
        className="sponsor-shell"
        style={{ minHeight }}
        href={sponsor.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={`Sponsor: ${sponsor.title}`}
      >
        <span className="ad-label">Sponsor</span>
        <strong>{sponsor.title}</strong>
        <em>{sponsor.cta}</em>
      </a>
    );
  }

  const resolvedSlot = slot || (placement ? AD_SLOTS[placement] : undefined);
  if (!adsenseEnabled() || !ADSENSE_CLIENT || !resolvedSlot) return null;

  return (
    <div className="ad-shell" style={{ minHeight }} aria-label="Iklan">
      <span className="ad-label">Iklan</span>
      <AdsenseUnit client={ADSENSE_CLIENT} slot={resolvedSlot} format={format} />
    </div>
  );
}

export function SupportButton() {
  if (!saweriaUrl) return null;
  return (
    <a
      className="support-fab"
      href={saweriaUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Dukung DRACIN via Saweria QR"
    >
      ❤ <span>Saweria</span>
    </a>
  );
}

export function LegalFooter() {
  return (
    <footer className="legal-footer" aria-label="Informasi legal dan iklan">
      <Link href="/privacy">Privasi</Link>
      <a href="/ads.txt">ads.txt</a>
    </footer>
  );
}
