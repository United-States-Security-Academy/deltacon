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

import { cacheTags } from "@/lib/cache-tags";
import { runAsVisitor } from "@/lib/database/access-roles";
import {
  posts,
  postTags,
  tags,
  type PostCategory,
} from "@/lib/database/schema";

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

/**
 * Most recent posts visitors can see. Row Level Security already hides drafts
 * and posts scheduled for the future, so no extra filtering is needed here.
 */
export const getLatestPublishedPosts = unstable_cache(
  async (numberOfPosts: number): Promise<PostSummary[]> => {
    try {
      const latestPosts = await runAsVisitor((transaction) =>
        transaction
          .select(postSummaryColumns)
          .from(posts)
          .orderBy(desc(posts.publishedAt))
          .limit(numberOfPosts),
      );
      return latestPosts.map((post) => ({
        ...post,
        publishedAt: (post.publishedAt ?? new Date()).toISOString(),
      }));
    } catch (error) {
      console.error("Could not load latest posts.", error);
      return [];
    }
  },
  ["latest-published-posts"],
  // Scheduled posts become visible on their own, so refresh regularly too.
  { tags: [cacheTags.posts], revalidate: 900 },
);

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

export const blogPostsPerPage = 9;

export type BlogListingFilters = {
  category?: PostCategory;
  search?: string;
  /** 1-based page number. */
  page: number;
};

/**
 * One page of the public blog, optionally filtered by category and searched
 * with Postgres full-text search (title, summary and content).
 */
export const getPublishedPostsPage = unstable_cache(
  async (
    filters: BlogListingFilters,
  ): Promise<{ posts: PostSummary[]; totalCount: number }> => {
    try {
      const conditions: SQL[] = [];
      if (filters.category)
        conditions.push(eq(posts.category, filters.category));
      if (filters.search) {
        conditions.push(
          sql`${posts.searchVector} @@ websearch_to_tsquery('english', ${filters.search})`,
        );
      }
      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      return await runAsVisitor(async (transaction) => {
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
    } catch (error) {
      console.error("Could not load blog posts.", error);
      return { posts: [], totalCount: 0 };
    }
  },
  ["published-posts-page"],
  { tags: [cacheTags.posts], revalidate: 300 },
);

export type PublishedPost = PostSummary & {
  contentHtml: string;
  seoTitle: string | null;
  metaDescription: string | null;
  /** ISO date string. */
  updatedAt: string;
  tagNames: string[];
};

/** A single visible post by its web address, or null if it doesn't exist or isn't live yet. */
export const getPublishedPostBySlug = unstable_cache(
  async (slug: string): Promise<PublishedPost | null> => {
    try {
      return await runAsVisitor(async (transaction) => {
        const [post] = await transaction
          .select({
            ...postSummaryColumns,
            contentHtml: posts.contentHtml,
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
          seoTitle: post.seoTitle,
          metaDescription: post.metaDescription,
          updatedAt: post.updatedAt.toISOString(),
          tagNames: tagRows.map((row) => row.name),
        };
      });
    } catch (error) {
      console.error("Could not load blog post.", error);
      return null;
    }
  },
  ["published-post-by-slug"],
  { tags: [cacheTags.posts], revalidate: 300 },
);

/** Up to three other posts, preferring the same category. */
export const getRelatedPosts = unstable_cache(
  async (postId: string, category: PostCategory): Promise<PostSummary[]> => {
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
      console.error("Could not load related posts.", error);
      return [];
    }
  },
  ["related-posts"],
  { tags: [cacheTags.posts], revalidate: 300 },
);

/** Every visible post's address and last update, for the sitemap and static pages. */
export const getAllPublishedPostSlugs = unstable_cache(
  async (): Promise<{ slug: string; updatedAt: string }[]> => {
    try {
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
    } catch (error) {
      console.error("Could not load post addresses.", error);
      return [];
    }
  },
  ["all-published-post-slugs"],
  { tags: [cacheTags.posts], revalidate: 300 },
);
