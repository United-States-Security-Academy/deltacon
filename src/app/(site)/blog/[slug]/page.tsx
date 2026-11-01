import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostArticle } from "@/components/blog/blog-post-article";
import { PostCard } from "@/components/blog/post-card";
import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { companyDetails } from "@/config/company-details";
import { StructuredDataScript } from "@/components/seo/structured-data-script";
import {
  describeCoverImage,
  describePostForSearch,
} from "@/lib/blog/post-search-text";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { canonicalUrl } from "@/lib/site-url";
import { getPublicMediaUrl } from "@/lib/storage/public-media";
import {
  getAllPublishedPostSlugs,
  getPublishedPostBySlug,
  getRelatedPosts,
} from "@/server/queries/posts";

// Pages are built ahead of time. Publishing or editing a post refreshes its
// page straight away; the one-day safety refresh only lets the "related
// posts" list pick up newer posts written since.
export const revalidate = 86400;

export async function generateStaticParams() {
  // Pre-building posts is an optimisation: if the database can't be reached
  // during a build, each post is simply built on its first visit instead.
  try {
    const publishedPosts = await getAllPublishedPostSlugs();
    return publishedPosts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Could not list posts to pre-build.", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };

  const searchTitle = post.seoTitle || post.title;
  const metadata = createPageMetadata({
    title: searchTitle,
    description: describePostForSearch(post),
    path: `/blog/${post.slug}`,
  });
  // Posts with a cover image share that; others keep the default picture.
  const coverImage = post.coverImagePath
    ? [
        {
          url: getPublicMediaUrl(post.coverImagePath),
          alt: describeCoverImage(post),
        },
      ]
    : undefined;
  return {
    ...metadata,
    // Post titles are long enough already; the company name is in the
    // share preview's site name instead of a "| Deltacon…" suffix.
    title: { absolute: searchTitle },
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      tags: post.tagNames,
      ...(coverImage ? { images: coverImage } : {}),
    },
    twitter: {
      ...metadata.twitter,
      ...(coverImage ? { images: coverImage } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.id, post.category);
  const postUrl = canonicalUrl(`/blog/${post.slug}`);

  // Structured data so search engines understand this is an article.
  const blogPostingStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: describePostForSearch(post),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.authorName },
    publisher: {
      "@type": "Organization",
      name: companyDetails.name,
      logo: {
        "@type": "ImageObject",
        url: canonicalUrl("/brand/deltacon-badge-512.png"),
      },
    },
    mainEntityOfPage: postUrl,
    ...(post.coverImagePath
      ? { image: getPublicMediaUrl(post.coverImagePath) }
      : {}),
    keywords: post.tagNames.join(", "),
  };

  return (
    <>
      <StructuredDataScript data={blogPostingStructuredData} />
      <BlogPostArticle post={post} shareUrl={postUrl} />

      {relatedPosts.length > 0 && (
        <section
          aria-labelledby="related-posts-heading"
          className="bg-paper section-spacing"
        >
          <div className="page-container flex flex-col gap-8">
            <h2
              id="related-posts-heading"
              className="text-3xl font-bold text-navy-900 uppercase"
            >
              Related posts
            </h2>
            <ul data-reveal-stagger className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <li key={relatedPost.id}>
                  <PostCard post={relatedPost} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CallToActionBand />
    </>
  );
}
