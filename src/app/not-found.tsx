import type { Metadata } from "next";

import { PageNotFoundMessage } from "@/components/sections/page-not-found-message";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/**
 * Fallback 404 for pages outside the public site (e.g. an admin link to a
 * deleted item). Public addresses use (site)/not-found.tsx, which shows the
 * header and footer. This one deliberately has no site shell: Next.js
 * includes the root 404 in every page's data, so a full header and footer
 * here would make every page on the site heavier.
 */
export default function NotFoundPage() {
  return <PageNotFoundMessage />;
}
