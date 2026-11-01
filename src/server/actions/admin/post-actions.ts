"use server";

import { randomBytes } from "node:crypto";

import type { JSONContent } from "@tiptap/core";
import { and, desc, eq, inArray, isNotNull, lte, ne, sql } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { createSlug } from "@/lib/blog/create-slug";
import { emptyPostDocument } from "@/lib/blog/post-content-extensions";
import {
  documentHasContent,
  processPostContent,
} from "@/lib/blog/process-post-content";
import { cacheTags } from "@/lib/cache-tags";
import { runAsSignedInUser } from "@/lib/database/access-roles";
import type { DatabaseTransaction } from "@/lib/database/database-client";
import { posts, postTags, tags, type PostStatus } from "@/lib/database/schema";
import {
  postFieldsSchema,
  postSaveIntentSchema,
} from "@/lib/validation/post-schemas";
import { toFieldErrors } from "@/lib/validation/submission-schemas";
import { requireAdmin } from "@/server/auth/require-admin";
import { homePagePostCount } from "@/server/queries/posts";

export type PostSaveResult =
  | {
      status: "success";
      postStatus: PostStatus;
      /** ISO date, or null for drafts. */
      publishedAt: string | null;
      savedAt: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string>;
    };

/**
 * Refreshes only the public pages that show this post: its own page (old and
 * new address), the /blog listing, the sitemap, and the home page only when
 * the post is, or was, one of the latest posts shown there. Other posts'
 * pages are left alone (their "related posts" catch up within a day).
 */
function refreshPublicBlogPages({
  slugs,
  isOnHomePage,
}: {
  slugs: string[];
  isOnHomePage: boolean;
}) {
  updateTag(cacheTags.postListings);
  for (const slug of new Set(slugs)) revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  if (isOnHomePage) revalidatePath("/");
}

/** Ids of the latest public posts, the ones the home page lists. */
async function findHomePagePostIds(
  transaction: DatabaseTransaction,
): Promise<string[]> {
  const rows = await transaction
    .select({ id: posts.id })
    .from(posts)
    .where(
      and(
        ne(posts.status, "draft"),
        isNotNull(posts.publishedAt),
        lte(posts.publishedAt, sql`now()`),
      ),
    )
    .orderBy(desc(posts.publishedAt))
    .limit(homePagePostCount);
  return rows.map((row) => row.id);
}

/** Replaces a post's tags, creating any tags that don't exist yet. */
async function replacePostTags(
  transaction: DatabaseTransaction,
  postId: string,
  tagNames: string[],
) {
  const uniqueTags = new Map<string, string>();
  for (const name of tagNames) {
    const slug = createSlug(name);
    if (slug && !uniqueTags.has(slug)) uniqueTags.set(slug, name);
  }

  await transaction.delete(postTags).where(eq(postTags.postId, postId));
  if (uniqueTags.size === 0) return;

  await transaction
    .insert(tags)
    .values([...uniqueTags].map(([slug, name]) => ({ slug, name })))
    .onConflictDoNothing({ target: tags.slug });
  const tagRows = await transaction
    .select({ id: tags.id })
    .from(tags)
    .where(inArray(tags.slug, [...uniqueTags.keys()]));
  await transaction
    .insert(postTags)
    .values(tagRows.map((tag) => ({ postId, tagId: tag.id })));
}

/** Creates an empty draft and opens it in the editor. */
export async function createPost(): Promise<void> {
  const admin = await requireAdmin();
  const postId = await runAsSignedInUser(admin.userId, async (transaction) => {
    const [createdPost] = await transaction
      .insert(posts)
      .values({
        title: "Untitled post",
        slug: `untitled-${randomBytes(3).toString("hex")}`,
        contentJson: emptyPostDocument,
        authorUserId: admin.userId,
        authorName: admin.displayName,
      })
      .returning({ id: posts.id });
    return createdPost!.id;
  });
  redirect(`/admin/posts/${postId}/edit`);
}

/**
 * Saves the editor's fields and, depending on the button pressed, publishes
 * or unpublishes the post. The HTML shown to visitors is generated and
 * sanitised here on the server, never taken from the browser.
 */
export async function savePost(
  postId: unknown,
  fieldValues: unknown,
  saveIntent: unknown,
): Promise<PostSaveResult> {
  const admin = await requireAdmin();
  if (typeof postId !== "string") {
    return { status: "error", message: "That post couldn't be found." };
  }

  const fieldsValidation = postFieldsSchema.safeParse(fieldValues);
  if (!fieldsValidation.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: toFieldErrors(fieldsValidation.error),
    };
  }
  const intentValidation = postSaveIntentSchema.safeParse(saveIntent);
  if (!intentValidation.success) {
    return {
      status: "error",
      message: "Please choose a valid date and time to publish.",
    };
  }
  const fields = fieldsValidation.data;
  const intent = intentValidation.data;
  const contentDocument = fields.contentJson as JSONContent;

  // Extra checks before a post becomes visible to the public.
  if (intent.intent === "publish") {
    const fieldErrors: Record<string, string> = {};
    if (fields.title === "Untitled post") {
      fieldErrors.title =
        "Please give the post a real title before publishing.";
    }
    if (!fields.excerpt) {
      fieldErrors.excerpt =
        "Please add a short summary; it appears on the blog page and in search results.";
    }
    if (fields.coverImagePath && !fields.coverImageAltText) {
      fieldErrors.coverImageAltText =
        "Please describe the cover image for people using screen readers.";
    }
    if (!documentHasContent(contentDocument)) {
      fieldErrors.contentJson = "The post has no content yet.";
    }
    if (Object.keys(fieldErrors).length > 0) {
      return {
        status: "error",
        message: "A few things are needed before this post can go live.",
        fieldErrors,
      };
    }
  }
  // Allow a minute of difference between the admin's clock and the server's.
  if (
    intent.intent === "publish" &&
    intent.publishedAt &&
    new Date(intent.publishedAt).getTime() > Date.now() + 60_000
  ) {
    return {
      status: "error",
      message: "A published post's date can't be in the future.",
      fieldErrors: { publishedAt: "Choose today or an earlier date." },
    };
  }

  const processedContent = processPostContent(contentDocument);

  const outcome = await runAsSignedInUser(admin.userId, async (transaction) => {
    const [existingPost] = await transaction
      .select({
        slug: posts.slug,
        status: posts.status,
        publishedAt: posts.publishedAt,
      })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);
    if (!existingPost) return { notFound: true as const };

    const [postUsingSlug] = await transaction
      .select({ id: posts.id })
      .from(posts)
      .where(and(eq(posts.slug, fields.slug), ne(posts.id, postId)))
      .limit(1);
    if (postUsingSlug) return { slugTaken: true as const };

    const homePagePostIdsBefore = await findHomePagePostIds(transaction);

    let status: PostStatus = existingPost.status;
    let publishedAt = existingPost.publishedAt;
    if (intent.intent === "publish") {
      status = "published";
      // Use the date the admin chose, if any. Otherwise keep the original
      // date for a post that is already live; a new post goes live now.
      const isAlreadyLive =
        existingPost.status !== "draft" &&
        existingPost.publishedAt !== null &&
        existingPost.publishedAt <= new Date();
      if (intent.publishedAt) {
        // Never later than now: pages no longer refresh on a timer, so a
        // date even seconds in the future would keep the post hidden.
        publishedAt = new Date(
          Math.min(new Date(intent.publishedAt).getTime(), Date.now()),
        );
      } else {
        publishedAt = isAlreadyLive ? existingPost.publishedAt : new Date();
      }
    } else if (intent.intent === "unpublish") {
      status = "draft";
      publishedAt = null;
    }

    await transaction
      .update(posts)
      .set({
        title: fields.title,
        slug: fields.slug,
        excerpt: fields.excerpt,
        category: fields.category,
        coverImagePath: fields.coverImagePath,
        coverImageAltText: fields.coverImageAltText || null,
        seoTitle: fields.seoTitle || null,
        metaDescription: fields.metaDescription || null,
        contentJson: contentDocument,
        contentHtml: processedContent.html,
        contentPlainText: processedContent.plainText,
        readingTimeInMinutes: processedContent.readingTimeInMinutes,
        status,
        publishedAt,
      })
      .where(eq(posts.id, postId));
    await replacePostTags(transaction, postId, fields.tagNames);

    const homePagePostIdsAfter = await findHomePagePostIds(transaction);

    return {
      previousSlug: existingPost.slug,
      wasPublic: existingPost.status !== "draft",
      status,
      publishedAt,
      isOnHomePage:
        homePagePostIdsBefore.includes(postId) ||
        homePagePostIdsAfter.includes(postId),
    };
  });

  if ("notFound" in outcome) {
    return { status: "error", message: "That post no longer exists." };
  }
  if ("slugTaken" in outcome) {
    return {
      status: "error",
      message: "Another post already uses that web address.",
      fieldErrors: { slug: "Another post already uses this web address." },
    };
  }

  // Drafts that were never public don't touch any public page. The admin
  // post list reads the sign-in cookie, so it is always rendered fresh and
  // needs no refresh here (saves run every few seconds while typing).
  if (outcome.wasPublic || outcome.status !== "draft") {
    refreshPublicBlogPages({
      slugs: [outcome.previousSlug, fields.slug],
      isOnHomePage: outcome.isOnHomePage,
    });
  }

  return {
    status: "success",
    postStatus: outcome.status,
    publishedAt: outcome.publishedAt?.toISOString() ?? null,
    savedAt: new Date().toISOString(),
  };
}

/** Deletes a post permanently and returns to the post list. */
export async function deletePost(postId: unknown): Promise<PostSaveResult> {
  const admin = await requireAdmin();
  if (typeof postId !== "string") {
    return { status: "error", message: "That post couldn't be found." };
  }

  const deletedPost = await runAsSignedInUser(
    admin.userId,
    async (transaction) => {
      const homePagePostIds = await findHomePagePostIds(transaction);
      const [post] = await transaction
        .delete(posts)
        .where(eq(posts.id, postId))
        .returning({ slug: posts.slug, status: posts.status });
      return (
        post && { ...post, isOnHomePage: homePagePostIds.includes(postId) }
      );
    },
  );

  if (deletedPost && deletedPost.status !== "draft") {
    refreshPublicBlogPages({
      slugs: [deletedPost.slug],
      isOnHomePage: deletedPost.isOnHomePage,
    });
  }
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

/** Suggests an unused web address based on a title. */
export async function suggestPostSlug(
  postId: unknown,
  title: unknown,
): Promise<string> {
  const admin = await requireAdmin();
  const baseSlug = createSlug(typeof title === "string" ? title : "") || "post";
  if (typeof postId !== "string") return baseSlug;

  return runAsSignedInUser(admin.userId, async (transaction) => {
    for (let attempt = 0; attempt < 20; attempt++) {
      const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
      const [postUsingSlug] = await transaction
        .select({ id: posts.id })
        .from(posts)
        .where(and(eq(posts.slug, candidate), ne(posts.id, postId)))
        .limit(1);
      if (!postUsingSlug) return candidate;
    }
    return `${baseSlug}-${randomBytes(2).toString("hex")}`;
  });
}
