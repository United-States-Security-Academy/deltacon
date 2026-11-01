import "server-only";

import {
  and,
  count,
  desc,
  eq,
  ne,
  notInArray,
  sql,
  type SQL,
} from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { cacheTags } from "@/lib/cache-tags";
import { runAsVisitor } from "@/lib/database/access-roles";
import {
  posts,
  postTags,
  tags,
  type PostCategory,
} from "@/lib/database/schema";

/*
 * Caching: the home page and each post's page are static pages, so these
 * queries only run when such a page is (re)built, i.e. on deploy, when an
 * admin publishes or edits a post, or (post pages) at most once a day. They
 * are not cached separately, and they throw on database errors so Next.js
 * keeps the last good page instead of saving an empty one.
 *
 * The /blog listing is rendered per request (it reads ?category=, ?q=,
 * ?page=), so its results are cached under the "post-listings" tag with no
 * timer; saving a public post refreshes that tag. Searches are not cached.
 */

/** The fields needed to show a post in a list or card. */
export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  coverImagePath: string | null;
  coverImageAltText: string | null;
  /** ISO date string (cached data cannot hold Date objects). */
  publishedAt: string;
  readingTimeInMinutes: number;
  authorName: string;
};

const postSummaryColumns = {
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  category: posts.category,
  coverImagePath: posts.coverImagePath,
  coverImageAltText: posts.coverImageAltText,
  publishedAt: posts.publishedAt,
  readingTimeInMinutes: posts.readingTimeInMinutes,
  authorName: posts.authorName,
};

function toPostSummary(post: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  coverImagePath: string | null;
  coverImageAltText: string | null;
  publishedAt: Date | null;
  readingTimeInMinutes: number;
  authorName: string;
}): PostSummary {
  return {
    ...post,
    publishedAt: (post.publishedAt ?? new Date()).toISOString(),
  };
}

/** How many of the latest posts the home page lists. */
export const homePagePostCount = 3;

/**
 * Most recent posts visitors can see, for the home page. Row Level Security
 * already hides drafts, so no extra filtering is needed here.
 */
export async function getLatestPublishedPosts(
  numberOfPosts: number,
): Promise<PostSummary[]> {
  const latestPosts = await runAsVisitor((transaction) =>
    transaction
      .select(postSummaryColumns)
      .from(posts)
      .orderBy(desc(posts.publishedAt))
      .limit(numberOfPosts),
  );
  return latestPosts.map(toPostSummary);
}

export const blogPostsPerPage = 9;

export type BlogListingFilters = {
  category?: PostCategory;
  search?: string;
  /** 1-based page number. */
  page: number;
};

type BlogListingPage = { posts: PostSummary[]; totalCount: number };

/** Queries one page of the blog listing (throws on database errors). */
async function queryPublishedPostsPage(
  filters: BlogListingFilters,
): Promise<BlogListingPage> {
  const conditions: SQL[] = [];
  if (filters.category) conditions.push(eq(posts.category, filters.category));
  if (filters.search) {
    conditions.push(
      sql`${posts.searchVector} @@ websearch_to_tsquery('english', ${filters.search})`,
    );
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return runAsVisitor(async (transaction) => {
    const [{ totalCount }] = await transaction
      .select({ totalCount: count() })
      .from(posts)
      .where(whereClause);
    const pagePosts = await transaction
      .select(postSummaryColumns)
      .from(posts)
      .where(whereClause)
      .orderBy(desc(posts.publishedAt))
      .limit(blogPostsPerPage)
      .offset((filters.page - 1) * blogPostsPerPage);
    return { posts: pagePosts.map(toPostSummary), totalCount };
  });
}

/** Category and page combinations, kept until a public post changes. */
const getCachedPublishedPostsPage = unstable_cache(
  queryPublishedPostsPage,
  ["published-posts-page"],
  { tags: [cacheTags.postListings], revalidate: false },
);

/**
 * One page of the public blog, optionally filtered by category and searched
 * with Postgres full-text search (title, summary and content). Search
 * results are not cached: every different search term would otherwise be
 * stored as a new cache entry.
 */
export async function getPublishedPostsPage(
  filters: BlogListingFilters,
): Promise<BlogListingPage> {
  try {
    return filters.search
      ? await queryPublishedPostsPage(filters)
      : await getCachedPublishedPostsPage(filters);
  } catch (error) {
    console.error("Could not load blog posts.", error);
    return { posts: [], totalCount: 0 };
  }
}

export type PublishedPost = PostSummary & {
  contentHtml: string;
  /** The body as plain text, for a search description fallback. */
  contentPlainText: string;
  seoTitle: string | null;
  metaDescription: string | null;
  /** ISO date string. */
  updatedAt: string;
  tagNames: string[];
};

/**
 * A single visible post by its web address, or null if it doesn't exist or
 * isn't public. Shared between a page and its metadata in the same render.
 */
export const getPublishedPostBySlug = cache(
  async (slug: string): Promise<PublishedPost | null> =>
    runAsVisitor(async (transaction) => {
      const [post] = await transaction
        .select({
          ...postSummaryColumns,
          contentHtml: posts.contentHtml,
          contentPlainText: posts.contentPlainText,
          seoTitle: posts.seoTitle,
          metaDescription: posts.metaDescription,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);
      if (!post) return null;

      const tagRows = await transaction
        .select({ name: tags.name })
        .from(postTags)
        .innerJoin(tags, eq(tags.id, postTags.tagId))
        .where(eq(postTags.postId, post.id))
        .orderBy(tags.name);

      return {
        ...toPostSummary(post),
        contentHtml: post.contentHtml,
        contentPlainText: post.contentPlainText,
        seoTitle: post.seoTitle,
        metaDescription: post.metaDescription,
        updatedAt: post.updatedAt.toISOString(),
        tagNames: tagRows.map((row) => row.name),
      };
    }),
);

/** Up to three other posts, preferring the same category. */
export async function getRelatedPosts(
  postId: string,
  category: PostCategory,
): Promise<PostSummary[]> {
  try {
    return await runAsVisitor(async (transaction) => {
      const sameCategory = await transaction
        .select(postSummaryColumns)
        .from(posts)
        .where(and(eq(posts.category, category), ne(posts.id, postId)))
        .orderBy(desc(posts.publishedAt))
        .limit(3);
      if (sameCategory.length === 3) return sameCategory.map(toPostSummary);

      const excludedIds = [postId, ...sameCategory.map((post) => post.id)];
      const others = await transaction
        .select(postSummaryColumns)
        .from(posts)
        .where(notInArray(posts.id, excludedIds))
        .orderBy(desc(posts.publishedAt))
        .limit(3 - sameCategory.length);
      return [...sameCategory, ...others].map(toPostSummary);
    });
  } catch (error) {
    // Optional section: the post still shows without it.
    console.error("Could not load related posts.", error);
    return [];
  }
}

/** Every visible post's address and last update, for the sitemap and static pages. */
export const getAllPublishedPostSlugs = cache(
  async (): Promise<{ slug: string; updatedAt: string }[]> => {
    const rows = await runAsVisitor((transaction) =>
      transaction
        .select({ slug: posts.slug, updatedAt: posts.updatedAt })
        .from(posts)
        .orderBy(desc(posts.publishedAt)),
    );
    return rows.map((row) => ({
      slug: row.slug,
      updatedAt: row.updatedAt.toISOString(),
    }));
  },
);
