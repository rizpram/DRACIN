import { NextResponse } from "next/server";
import { getProviderCacheStats } from "@/lib/provider-cache";
import { checkSharedCacheConnection, getSharedCacheStats } from "@/lib/shared-cache";

export async function GET() {
  const sharedCache = getSharedCacheStats();
  const redisConnected = sharedCache.redis ? await checkSharedCacheConnection() : false;

  return NextResponse.json({
    ok: true,
    service: "dracin",
    cache: getProviderCacheStats(),
    sharedCache: { ...sharedCache, redisConnected },
    timestamp: new Date().toISOString(),
  });
}
