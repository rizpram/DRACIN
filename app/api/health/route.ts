import { NextResponse } from "next/server";
import { getProviderCacheStats } from "@/lib/provider-cache";
import { getSharedCacheStats } from "@/lib/shared-cache";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "dracin",
    cache: getProviderCacheStats(),
    sharedCache: getSharedCacheStats(),
    timestamp: new Date().toISOString(),
  });
}
