import { Newspaper } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  BlogCategoryTabs,
  BlogPagination,
  BlogSearchForm,
} from "@/components/blog/blog-listing-controls";
import { PostCard } from "@/components/blog/post-card";
import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import {
  postCategoryLabels,
  postCategoryValues,
} from "@/config/post-categories";
import type { PostCategory } from "@/lib/database/schema/enums";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import {
  blogPostsPerPage,
  getPublishedPostsPage,
} from "@/server/queries/posts";

type BlogSearchParameters = Awaited<PageProps<"/blog">["searchParams"]>;

/** Reads and cleans the ?category=, ?q= and ?page= values from the address. */
function readListingFilters(searchParameters: BlogSearchParameters) {
  const { category, q, page } = searchParameters;
  const activeCategory = (postCategoryValues as readonly string[]).includes(
    String(category),
  )
    ? (category as PostCategory)
    : undefined;
  const search =
    typeof q === "string" && q.trim() ? q.trim().slice(0, 100) : undefined;
  const pageNumber = Number(page);
  const currentPage =
    Number.isInteger(pageNumber) && pageNumber > 1
      ? Math.min(pageNumber, 500)
      : 1;
  return { activeCategory, search, currentPage };
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/blog">): Promise<Metadata> {
  const { activeCategory, search, currentPage } = readListingFilters(
    await searchParams,
  );
  const metadata = createPageMetadata({
    title: activeCategory
      ? `${postCategoryLabels[activeCategory]} | Blog & Media`
      : "Blog & Media",
    description:
      "News, security advice and press from Deltacon Security Group, protecting businesses and communities across Texas.",
    path: activeCategory ? `/blog?category=${activeCategory}` : "/blog",
  });
  // Search results and later pages shouldn't compete with the main listing in search engines.
  if (search || currentPage > 1)
    metadata.robots = { index: false, follow: true };
  return metadata;
}

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const { activeCategory, search, currentPage } = readListingFilters(
    await searchParams,
  );
  const { posts, totalCount } = await getPublishedPostsPage({
    category: activeCategory,
    search,
    page: currentPage,
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / blogPostsPerPage));
  const isFiltered = Boolean(activeCategory || search);

  return (
    <>
      <PageHeader
        eyebrow="Blog & Media"
        title="News & insights"
        introduction="Security advice, company news and press coverage from the Deltacon Security Group team."
        breadcrumbs={[{ label: "Blog & Media" }]}
      />

      <section
        aria-labelledby="blog-posts-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-8">
          <h2 id="blog-posts-heading" className="sr-only">
            {search ? `Search results for "${search}"` : "Posts"}
          </h2>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <BlogCategoryTabs activeCategory={activeCategory} search={search} />
            <BlogSearchForm activeCategory={activeCategory} search={search} />
          </div>

          {search && (
            <p aria-live="polite" className="text-navy-800">
              {totalCount === 1 ? "1 post" : `${totalCount} posts`} matching
              &ldquo;{search}&rdquo;.{" "}
              <Link
                href={
                  activeCategory ? `/blog?category=${activeCategory}` : "/blog"
                }
                className="font-semibold text-gold-700 underline"
              >
                Clear search
              </Link>
            </p>
          )}

          {posts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
              <Newspaper aria-hidden="true" className="size-10 text-gold-600" />
              <p className="text-lg font-semibold text-navy-900">
                {isFiltered
                  ? "No posts match your search."
                  : "News and insights are on their way."}
              </p>
              <p className="max-w-md text-muted-foreground">
                {isFiltered
                  ? "Try a different word or category."
                  : "Our first articles will appear here soon. Check back shortly."}
              </p>
              {isFiltered && (
                <Link
                  href="/blog"
                  className="font-semibold text-gold-700 underline"
                >
                  See all posts
                </Link>
              )}
            </div>
          ) : (
            <ul
              data-reveal-stagger
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {posts.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}

          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            activeCategory={activeCategory}
            search={search}
          />
        </div>
      </section>

      <CallToActionBand />
    </>
  );
}
