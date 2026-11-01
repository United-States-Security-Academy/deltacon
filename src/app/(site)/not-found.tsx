import { PageNotFoundMessage } from "@/components/sections/page-not-found-message";

/**
 * 404 for public pages. It renders inside the public layout, which already
 * provides the header and footer, so this file must not add them again.
 * (Next.js includes this component in every public page's data, so keeping
 * the site shell out of it keeps every page smaller.)
 */
export default function PublicPageNotFound() {
  return <PageNotFoundMessage />;
}
