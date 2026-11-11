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
  { label: "Houston & Sugar Land", href: "/locations/houston-sugar-land" },
  { label: "Dallas–Fort Worth", href: "/locations/dallas-fort-worth" },
];
