export const VERIFIED_PLAYABLE_PROVIDERS = ["cubetv", "starshort", "pinedrama"] as const;

export type VerifiedPlayableProvider = (typeof VERIFIED_PLAYABLE_PROVIDERS)[number];

export function isVerifiedPlayableProvider(slug: string): slug is VerifiedPlayableProvider {
  return (VERIFIED_PLAYABLE_PROVIDERS as readonly string[]).includes(slug);
}

export const TEMPORARILY_UNSTABLE_PROVIDERS = ["freereels", "flickreels", "netshort"] as const;
