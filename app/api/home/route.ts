import { NextResponse } from "next/server";
import { getHomePayloadWithMeta } from "@/lib/home-feed";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = performance.now();
  try {
    const { payload, cacheStatus } = await getHomePayloadWithMeta();
    const durationMs = Math.max(0, performance.now() - started);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        "Server-Timing": `dracin;dur=${durationMs.toFixed(1)};desc=\"${cacheStatus}\"`,
        "X-DRACIN-Cache": cacheStatus,
        "X-DRACIN-Response-Time": `${durationMs.toFixed(1)}ms`,
      },
    });
  } catch (error) {
    const durationMs = Math.max(0, performance.now() - started);
    return NextResponse.json(
      {
        error: "Katalog sedang lambat. Silakan coba lagi sebentar.",
        detail: error instanceof Error ? error.message : String(error),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Server-Timing": `dracin;dur=${durationMs.toFixed(1)};desc=\"ERROR\"`,
          "X-DRACIN-Cache": "ERROR",
          "X-DRACIN-Response-Time": `${durationMs.toFixed(1)}ms`,
        },
      },
    );
  }
}
