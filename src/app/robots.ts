import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site-url";

/**
 * /robots.txt. The live site can be indexed (apart from the admin area);
 * Vercel preview deployments are hidden so they never compete with it.
 */
export default function robots(): MetadataRoute.Robots {
  const isPreviewDeployment =
    process.env.VERCEL_ENV !== undefined &&
    process.env.VERCEL_ENV !== "production";

  if (isPreviewDeployment) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
