"use client";

import { useEffect, useRef } from "react";

export default function AdsenseUnit({
  client,
  slot,
  format = "auto",
}: {
  client: string;
  slot: string;
  format?: string;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const target = window as typeof window & { adsbygoogle?: Array<Record<string, unknown>> };
      target.adsbygoogle = target.adsbygoogle || [];
      target.adsbygoogle.push({});
      pushed.current = true;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[DRACIN] adsense unit init failed", error);
      }
    }
  }, [client, slot]);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
