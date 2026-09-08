import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  }
};

export default nextConfig;
