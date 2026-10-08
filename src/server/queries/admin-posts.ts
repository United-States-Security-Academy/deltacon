import "server-only";

import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";

import { runAsSignedInUser } from "@/lib/database/access-roles";
import {
  posts,
  postTags,
  tags,
  type PostCategory,
  type PostStatus,
} from "@/lib/database/schema";

/*
 * Post queries for the admin area. They run as the signed-in admin, so the
 * database's Row Level Security confirms access (admins can see drafts).
 */

export type AdminPostListItem = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  category: PostCategory;
  publishedAt: Date | null;
  updatedAt: Date;
  authorName: string;
};

export async function listAdminPosts(
  adminUserId: string,
  filters: { status?: PostStatus; search?: string },
): Promise<AdminPostListItem[]> {
  const conditions: SQL[] = [];
  if (filters.status) conditions.push(eq(posts.status, filters.status));
  if (filters.search) {
    const pattern = `%${filters.search.replace(/[%_\\]/g, "\\$&")}%`;
    conditions.push(
      or(ilike(posts.title, pattern), ilike(posts.slug, pattern)) as SQL,
    );
  }

  return runAsSignedInUser(adminUserId, (transaction) =>
    transaction
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        status: posts.status,
        category: posts.category,
        publishedAt: posts.publishedAt,
        updatedAt: posts.updatedAt,
        authorName: posts.authorName,
      })
      .from(posts)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(posts.updatedAt)),
  );
}

export type AdminPost = typeof posts.$inferSelect & { tagNames: string[] };

export async function getAdminPost(
  adminUserId: string,
  postId: string,
): Promise<AdminPost | undefined> {
  return runAsSignedInUser(adminUserId, async (transaction) => {
    const [post] = await transaction
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);
    if (!post) return undefined;

    const postTagRows = await transaction
      .select({ name: tags.name })
      .from(postTags)
      .innerJoin(tags, eq(tags.id, postTags.tagId))
      .where(eq(postTags.postId, postId))
      .orderBy(tags.name);

    return { ...post, tagNames: postTagRows.map((row) => row.name) };
  });
}

/** Every existing tag name, offered as suggestions in the editor. */
export async function listTagNames(adminUserId: string): Promise<string[]> {
  const rows = await runAsSignedInUser(adminUserId, (transaction) =>
    transaction.select({ name: tags.name }).from(tags).orderBy(tags.name),
  );
  return rows.map((row) => row.name);
}
