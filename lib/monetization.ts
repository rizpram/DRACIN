export type MonetizationMode = "off" | "adsense" | "sponsor" | "hybrid";
export type AdPlacement = "home" | "discover" | "search" | "provider" | "detail" | "watch";

const DEFAULT_ADSENSE_CLIENT = "ca-pub-9886009042389859";
const requestedMode = (process.env.NEXT_PUBLIC_MONETIZATION_MODE || "hybrid").toLowerCase();

export const MONETIZATION_MODE: MonetizationMode =
  requestedMode === "off" || requestedMode === "adsense" || requestedMode === "sponsor" || requestedMode === "hybrid"
    ? requestedMode
    : "hybrid";

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || DEFAULT_ADSENSE_CLIENT;

export const AD_SLOTS: Record<AdPlacement, string | undefined> = {
  home: process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT,
  discover: process.env.NEXT_PUBLIC_ADSENSE_DISCOVER_SLOT,
  search: process.env.NEXT_PUBLIC_ADSENSE_SEARCH_SLOT,
  provider: process.env.NEXT_PUBLIC_ADSENSE_PROVIDER_SLOT,
  detail: process.env.NEXT_PUBLIC_ADSENSE_DETAIL_SLOT,
  watch: process.env.NEXT_PUBLIC_ADSENSE_WATCH_SLOT,
};

const SPONSORS: Record<AdPlacement, { title?: string; url?: string; cta?: string }> = {
  home: {
    title: process.env.NEXT_PUBLIC_SPONSOR_HOME_TITLE,
    url: process.env.NEXT_PUBLIC_SPONSOR_HOME_URL,
    cta: process.env.NEXT_PUBLIC_SPONSOR_HOME_CTA,
  },
  discover: {
    title: process.env.NEXT_PUBLIC_SPONSOR_DISCOVER_TITLE,
    url: process.env.NEXT_PUBLIC_SPONSOR_DISCOVER_URL,
    cta: process.env.NEXT_PUBLIC_SPONSOR_DISCOVER_CTA,
  },
  search: {
    title: process.env.NEXT_PUBLIC_SPONSOR_SEARCH_TITLE,
    url: process.env.NEXT_PUBLIC_SPONSOR_SEARCH_URL,
    cta: process.env.NEXT_PUBLIC_SPONSOR_SEARCH_CTA,
  },
  provider: {
    title: process.env.NEXT_PUBLIC_SPONSOR_PROVIDER_TITLE,
    url: process.env.NEXT_PUBLIC_SPONSOR_PROVIDER_URL,
    cta: process.env.NEXT_PUBLIC_SPONSOR_PROVIDER_CTA,
  },
  detail: {
    title: process.env.NEXT_PUBLIC_SPONSOR_DETAIL_TITLE,
    url: process.env.NEXT_PUBLIC_SPONSOR_DETAIL_URL,
    cta: process.env.NEXT_PUBLIC_SPONSOR_DETAIL_CTA,
  },
  watch: {
    title: process.env.NEXT_PUBLIC_SPONSOR_WATCH_TITLE,
    url: process.env.NEXT_PUBLIC_SPONSOR_WATCH_URL,
    cta: process.env.NEXT_PUBLIC_SPONSOR_WATCH_CTA,
  },
};

export function adsenseEnabled() {
  return MONETIZATION_MODE === "adsense" || MONETIZATION_MODE === "hybrid";
}

export function sponsorEnabled() {
  return MONETIZATION_MODE === "sponsor" || MONETIZATION_MODE === "hybrid";
}

export function sponsorFor(placement: AdPlacement) {
  const sponsor = SPONSORS[placement];
  if (!sponsorEnabled() || !sponsor.title || !sponsor.url) return null;
  return {
    title: sponsor.title,
    url: sponsor.url,
    cta: sponsor.cta || "Lihat sponsor",
  };
}

export function monetizationReadiness() {
  const configuredSlots = Object.entries(AD_SLOTS)
    .filter(([, value]) => Boolean(value))
    .map(([placement]) => placement as AdPlacement);
  const configuredSponsors = (Object.keys(SPONSORS) as AdPlacement[]).filter((placement) => Boolean(sponsorFor(placement)));

  return {
    mode: MONETIZATION_MODE,
    adsenseClient: Boolean(ADSENSE_CLIENT),
    configuredSlots,
    configuredSponsors,
    adsenseLoader: adsenseEnabled() && Boolean(ADSENSE_CLIENT),
  };
}
