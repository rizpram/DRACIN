import type { Metadata, Viewport } from "next";
import { MonetizationScripts } from "@/components/Monetization";
import RegisterSW from "@/components/RegisterSW";
import { ADSENSE_CLIENT } from "@/lib/monetization";
import "./globals.css";
import "./premium.css";
import "./audit-fixes.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tv.rizpram.cloud"),
  applicationName: "DRACIN",
  title: "DRACIN — Drama Pendek",
  description: "Streaming drama pendek premium, cepat, dan mobile-first.",
  manifest: "/manifest.json",
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

export const viewport: Viewport = {
  themeColor: "#b41830",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        {children}
        <RegisterSW />
        <MonetizationScripts />
      </body>
    </html>
  );
}
