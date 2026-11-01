/**
 * The public URL of the site, without a trailing slash. Used to build absolute
 * links for emails and sign-in links (from NEXT_PUBLIC_SITE_URL).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The one address search engines should index. deltacon1.com (without www)
 * permanently redirects here, so canonical links must use www too.
 */
export const productionSiteUrl = "https://www.deltacon1.com";

/**
 * Origin for everything search engines read: metadataBase (canonical links
 * and og:url), the sitemap, robots.txt and structured data. The live site
 * always uses the www address, whatever NEXT_PUBLIC_SITE_URL says; local
 * builds and preview deployments use their own address.
 */
export const canonicalSiteUrl =
  process.env.VERCEL_ENV === "production" ? productionSiteUrl : siteUrl;

export function canonicalUrl(path: string): string {
  return `${canonicalSiteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
