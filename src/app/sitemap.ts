import type { MetadataRoute } from "next";

import { industries } from "@/config/industries";
import { services } from "@/config/services";
import { trainingCourses } from "@/config/training-courses";
import { absoluteUrl } from "@/lib/site-url";
import { getAllPublishedPostSlugs } from "@/server/queries/posts";

// Rebuilt hourly; publishing a post also refreshes it through the posts tag.
export const revalidate = 3600;

type SitemapEntry = MetadataRoute.Sitemap[number];

/** /sitemap.xml: every public page, so search engines can find them all. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const page = (
    path: string,
    priority: number,
    changeFrequency: SitemapEntry["changeFrequency"] = "monthly",
  ): SitemapEntry => ({ url: absoluteUrl(path), priority, changeFrequency });

  const publishedPosts = await getAllPublishedPostSlugs();

  return [
    page("/", 1, "weekly"),
    page("/services", 0.9),
    ...services.map((service) => page(`/services/${service.slug}`, 0.8)),
    page("/industries", 0.8),
    ...industries.map((industry) => page(`/industries/${industry.slug}`, 0.7)),
    page("/training", 0.8),
    ...trainingCourses.map((course) => page(`/training/${course.slug}`, 0.7)),
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
