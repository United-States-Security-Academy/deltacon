import type { PostCategory } from "@/lib/database/schema/enums";

/** Labels shown to visitors for each blog category. */
export const postCategoryLabels: Record<PostCategory, string> = {
  blog: "Blog",
  news: "News",
  press: "Press & Media",
};

/** Every category, in display order. Must match the database's post_category values. */
export const postCategoryValues = [
  "blog",
  "news",
  "press",
] as const satisfies readonly PostCategory[];

export const postCategoryOrder: PostCategory[] = [...postCategoryValues];
