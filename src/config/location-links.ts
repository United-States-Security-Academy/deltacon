import type { NavigationLink } from "@/config/navigation";

/**
 * The location pages as menu links (Locations dropdown in the header).
 *
 * Kept separate from config/locations.ts so the header, which runs in the
 * browser, doesn't download every location page's text. A unit test checks
 * this list matches `locations` (same pages, same names, same order), so
 * add new locations to both.
 */
export const locationNavigationLinks: NavigationLink[] = [
  { label: "Houston Metro Area", href: "/locations/houston-metro-area" },
  {
    label: "Dallas–Fort Worth Metro",
    href: "/locations/dallas-fort-worth-metro",
  },
];

/**
 * Slugs the location pages had before they were renamed (2026-11-14), mapped
 * to the current slug. next.config.ts permanently redirects the old addresses,
 * so search results and shared links keep working, and the Request Service
 * form still accepts an old ?location= value. Never remove an entry.
 */
export const previousLocationSlugs: Record<string, string> = {
  "houston-sugar-land": "houston-metro-area",
  "dallas-fort-worth": "dallas-fort-worth-metro",
};
