import type { NextConfig } from "next";

// Images uploaded to the public "site-media" Supabase bucket are optimised by
// next/image. Only that bucket is allowed as a remote image source.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicMediaPattern = supabaseUrl
  ? [new URL("/storage/v1/object/public/site-media/**", supabaseUrl)]
  : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: publicMediaPattern,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
