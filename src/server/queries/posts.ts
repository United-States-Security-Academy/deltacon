import "server-only";

import { desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { cacheTags } from "@/lib/cache-tags";
import { runAsVisitor } from "@/lib/database/access-roles";
import { posts, type PostCategory } from "@/lib/database/schema";

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
