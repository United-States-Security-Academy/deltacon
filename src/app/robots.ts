import type { MetadataRoute } from "next";

import { canonicalUrl } from "@/lib/site-url";

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
    // Every private route (sign-in, dashboard, inbox, CV downloads and CSV
    // exports) lives under /admin; the site has no /api routes.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin"] },
    sitemap: canonicalUrl("/sitemap.xml"),
  };
}
