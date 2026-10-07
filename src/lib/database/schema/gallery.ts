import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { adminFullAccessPolicy, publicReadPolicy } from "./access-rules";

export const galleryCategories = pgTable(
  "gallery_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  () => [
    publicReadPolicy("gallery categories"),
    adminFullAccessPolicy("gallery categories"),
  ],
);

export const galleryImages = pgTable(
  "gallery_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Path inside the public "site-media" storage bucket. */
    storagePath: text("storage_path").notNull(),
    widthInPixels: integer("width_in_pixels").notNull(),
    heightInPixels: integer("height_in_pixels").notNull(),
    /** Tiny base64 preview shown while the full image loads. */
    blurPlaceholder: text("blur_placeholder"),
    altText: text("alt_text").notNull(),
    caption: text("caption"),
    categoryId: uuid("category_id").references(() => galleryCategories.id, {
      onDelete: "set null",
    }),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("gallery_images_display_order_index").on(
      table.sortOrder,
      table.createdAt,
    ),
    publicReadPolicy("gallery images"),
    adminFullAccessPolicy("gallery images"),
  ],
);

export type GalleryCategory = typeof galleryCategories.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
