import type { PostCategory } from "@/lib/database/schema/enums";

/** Labels shown to visitors for each blog category. */
export const postCategoryLabels: Record<PostCategory, string> = {
  blog: "Blog",
  news: "News",
  press: "Press & Media",
};

export const postCategoryOrder: PostCategory[] = ["blog", "news", "press"];
