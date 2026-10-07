/**
 * Names for cached data. After an admin changes something, the matching tag
 * is revalidated so public pages show the update without a redeploy.
 */
export const cacheTags = {
  siteSettings: "site-settings",
  posts: "posts",
  gallery: "gallery",
} as const;
