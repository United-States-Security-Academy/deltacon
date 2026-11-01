/**
 * Names for cached data. None of them expire on a timer: after an admin
 * changes something, the matching tag is refreshed so public pages show the
 * update without a redeploy.
 */
export const cacheTags = {
  siteSettings: "site-settings",
  /** The /blog listing (category and page combinations, not searches). */
  postListings: "post-listings",
  gallery: "gallery",
} as const;
