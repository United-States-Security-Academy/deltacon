import type { NextConfig } from "next";

import { buildSecurityHeaders } from "./src/lib/security/security-headers";

// Images uploaded to the public "site-media" Supabase bucket are optimised by
// next/image. Only that bucket is allowed as a remote image source.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicMediaPattern = supabaseUrl
  ? [new URL("/storage/v1/object/public/site-media/**", supabaseUrl)]
  : [];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: publicMediaPattern,
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: buildSecurityHeaders({
          supabaseUrl,
          isDevelopment: process.env.NODE_ENV === "development",
          isVercelPreview: process.env.VERCEL_ENV === "preview",
        }),
      },
      {
        // The admin area must never appear in search results.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
