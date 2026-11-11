import type { MetadataRoute } from "next";

import { industries } from "@/config/industries";
import { locations } from "@/config/locations";
import { serviceLinesWithContent } from "@/config/service-lines";
import { services } from "@/config/services";
import { trainingCourses } from "@/config/training-courses";
import { canonicalUrl } from "@/lib/site-url";
import { getAllPublishedPostSlugs } from "@/server/queries/posts";

// No timer: rebuilt on deploy, and whenever an admin publishes, edits or
// deletes a public post (post actions refresh /sitemap.xml).
export const revalidate = false;

type SitemapEntry = MetadataRoute.Sitemap[number];

/** /sitemap.xml: every public page, so search engines can find them all. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const page = (
    path: string,
    priority: number,
    changeFrequency: SitemapEntry["changeFrequency"] = "monthly",
  ): SitemapEntry => ({ url: canonicalUrl(path), priority, changeFrequency });

  const publishedPosts = await getAllPublishedPostSlugs();

  return [
    page("/", 1, "weekly"),
    page("/services", 0.9),
    page("/government-contracting", 0.8),
    page("/locations", 0.7),
    page("/security-guard-pricing", 0.7),
    page("/training-advantage", 0.6),
    ...locations.map((location) => page(`/locations/${location.slug}`, 0.8)),
    ...services.map((service) => page(`/services/${service.slug}`, 0.8)),
    // Consulting, Staffing and Custodial Services, once their pages have content.
    ...serviceLinesWithContent.map((serviceLine) =>
      page(serviceLine.href, 0.8),
    ),
    page("/industries", 0.8),
    ...industries.map((industry) => page(`/industries/${industry.slug}`, 0.7)),
    page("/training", 0.8),
    ...trainingCourses.map((course) => page(`/training/${course.slug}`, 0.7)),
    page("/guide", 0.7),
    page("/request-service", 0.9),
    page("/security-assessment", 0.7),
    page("/apply", 0.7),
    page("/about", 0.6),
    page("/blog", 0.7, "weekly"),
    ...publishedPosts.map((post) => ({
      ...page(`/blog/${post.slug}`, 0.6),
      lastModified: post.updatedAt,
    })),
    page("/gallery", 0.5, "weekly"),
    page("/privacy", 0.2, "yearly"),
  ];
}
