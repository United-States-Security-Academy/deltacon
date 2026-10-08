import { z } from "zod";

/*
 * Rules for the gallery manager, shared by the admin forms and the server
 * actions.
 */

export const galleryImageIdRule = z.uuid("That photo doesn't exist.");

export const galleryCategoryIdRule = z.uuid("That category no longer exists.");

/** Gallery uploads must sit in the gallery folder, e.g. "gallery/2026-10/<uuid>.jpg". */
export const galleryStoragePathRule = z
  .string()
  .regex(
    /^gallery\/\d{4}-\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif)$/,
    "The upload location isn't valid.",
  );

export const galleryAltTextRule = z
  .string()
  .trim()
  .min(
    5,
    "Describe the photo for people who can't see it (at least 5 characters).",
  )
  .max(200, "Keep the description under 200 characters.");

export const galleryCaptionRule = z
  .string()
  .trim()
  .max(300, "Keep the caption under 300 characters.");

/** An empty choice means "no category". */
export const galleryCategoryChoiceRule = z
  .union([z.uuid(), z.literal("")])
  .transform((value) => value || null);

export const galleryImageDetailsSchema = z.object({
  altText: galleryAltTextRule,
  caption: galleryCaptionRule,
  categoryId: galleryCategoryChoiceRule,
});

export type GalleryImageDetails = z.input<typeof galleryImageDetailsSchema>;

export const newGalleryImageSchema = galleryImageDetailsSchema.extend({
  storagePath: galleryStoragePathRule,
});

export const galleryOrderSchema = z
  .array(galleryImageIdRule)
  .max(2000)
  .refine(
    (ids) => new Set(ids).size === ids.length,
    "Each photo can only appear once.",
  );

export const galleryCategoryNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category names need at least 2 characters.")
    .max(40, "Keep category names under 40 characters."),
});
