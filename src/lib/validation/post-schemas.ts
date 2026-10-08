import { z } from "zod";

import { postCategoryValues } from "@/config/post-categories";

/*
 * Validation for the blog post editor, shared by the browser and the server.
 */

export const slugRule = z
  .string()
  .trim()
  .min(1, "Please enter a web address for the post.")
  .max(80, "Keep the web address to 80 characters or fewer.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and single dashes only (e.g. retail-security-tips).",
  );

/** Fields the editor saves. The content is the editor's JSON document. */
export const postFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Please give the post a title.")
    .max(160, "Keep the title to 160 characters or fewer."),
  slug: slugRule,
  excerpt: z
    .string()
    .trim()
    .max(300, "Keep the summary to 300 characters or fewer."),
  category: z.enum(postCategoryValues, {
    error: "Please choose a category.",
  }),
  tagNames: z
    .array(z.string().trim().min(1).max(40, "Keep each tag to 40 characters."))
    .max(10, "Use 10 tags or fewer."),
  // Exactly the shape uploads use ("posts/2026-10/<uuid>.jpg"), so a path
  // can never point outside the posts folder (e.g. with "..").
  coverImagePath: z
    .string()
    .regex(
      /^posts\/\d{4}-\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif)$/,
      "That cover image isn't valid.",
    )
    .nullable(),
  coverImageAltText: z
    .string()
    .trim()
    .max(200, "Keep the image description to 200 characters or fewer."),
  seoTitle: z
    .string()
    .trim()
    .max(70, "Search engines show about 60–70 characters; keep it shorter."),
  metaDescription: z
    .string()
    .trim()
    .max(160, "Search engines show about 155–160 characters; keep it shorter."),
  contentJson: z.looseObject({ type: z.literal("doc") }),
});

export type PostFields = z.infer<typeof postFieldsSchema>;

/** What the editor buttons ask the server to do. */
export const postSaveIntentSchema = z.discriminatedUnion("intent", [
  z.object({ intent: z.literal("save") }),
  z.object({ intent: z.literal("publish") }),
  z.object({
    intent: z.literal("schedule"),
    publishAt: z.iso.datetime({
      offset: true,
      error: "Please choose a date and time.",
    }),
  }),
  z.object({ intent: z.literal("unpublish") }),
]);

export type PostSaveIntent = z.infer<typeof postSaveIntentSchema>;
