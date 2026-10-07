import { sql, type SQL } from "drizzle-orm";
import {
  customType,
  index,
  integer,
  jsonb,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import {
  adminFullAccessPolicy,
  everyone,
  publicReadPolicy,
} from "./access-rules";
import { adminUsers } from "./admin-users";
import { postCategoryEnum, postStatusEnum } from "./enums";

/** Postgres full-text search vector. */
const textSearchVector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

/**
 * A post is visible to the public once it is published (or scheduled) and its
 * publish date has arrived. Scheduled posts therefore go live on their own.
 */
const postIsPubliclyVisible = sql`status in ('published', 'scheduled') and published_at is not null and published_at <= now()`;

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    /** The editor document exactly as TipTap produces it (used for editing). */
    contentJson: jsonb("content_json").notNull().default({}),
    /** Sanitised HTML generated from contentJson on save (used for display). */
    contentHtml: text("content_html").notNull().default(""),
    /** Plain text version of the content, used for search and reading time. */
    contentPlainText: text("content_plain_text").notNull().default(""),
    coverImagePath: text("cover_image_path"),
    coverImageAltText: text("cover_image_alt_text"),
    category: postCategoryEnum("category").notNull().default("blog"),
    status: postStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    metaDescription: text("meta_description"),
    readingTimeInMinutes: integer("reading_time_in_minutes")
      .notNull()
      .default(1),
    authorUserId: uuid("author_user_id").references(() => adminUsers.userId, {
      onDelete: "set null",
    }),
    /** Stored on the post so the public site never needs to read admin_users. */
    authorName: text("author_name").notNull().default("Deltacon Security"),
    searchVector: textSearchVector("search_vector").generatedAlwaysAs(
      (): SQL =>
        sql`setweight(to_tsvector('english', coalesce(${posts.title}, '')), 'A') || setweight(to_tsvector('english', coalesce(${posts.excerpt}, '')), 'B') || setweight(to_tsvector('english', coalesce(${posts.contentPlainText}, '')), 'C')`,
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("posts_public_listing_index").on(
      table.status,
      table.category,
      table.publishedAt.desc(),
    ),
    index("posts_search_index").using("gin", table.searchVector),
    pgPolicy("anyone can read visible posts", {
      for: "select",
      to: everyone,
      using: postIsPubliclyVisible,
    }),
    adminFullAccessPolicy("posts"),
  ],
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
  },
  () => [publicReadPolicy("tags"), adminFullAccessPolicy("tags")],
);

export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
    index("post_tags_by_tag_index").on(table.tagId),
    pgPolicy("anyone can read tags of visible posts", {
      for: "select",
      to: everyone,
      // The posts table's own policy hides posts that are not yet visible.
      using: sql`exists (select 1 from public.posts where posts.id = ${table.postId})`,
    }),
    adminFullAccessPolicy("post tags"),
  ],
);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Tag = typeof tags.$inferSelect;
