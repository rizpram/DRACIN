import { NextResponse } from "next/server";
import { getHomePayload } from "@/lib/home-feed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getHomePayload();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Katalog sedang lambat. Silakan coba lagi sebentar.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
