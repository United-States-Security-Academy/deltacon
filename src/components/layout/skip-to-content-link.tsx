export const mainContentId = "main-content";

/** Lets keyboard and screen-reader users jump past the navigation. */
export function SkipToContentLink() {
  return (
    <a
      href={`#${mainContentId}`}
      className="sr-only z-50 rounded-md bg-gold-500 px-4 py-3 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to main content
    </a>
  );
}
