/*
 * Text search engines and screen readers get for a blog post when the admin
 * hasn't written it specifically: a search description, and the cover
 * image's alt text.
 */

const maximumDescriptionLength = 160;
/** Excerpts shorter than this (e.g. "FFL") don't describe the post. */
const minimumUsefulExcerptLength = 50;

/** Shortens text to the limit at a word boundary, adding "…" if cut. */
function shortenAtWord(text: string, maximumLength: number): string {
  if (text.length <= maximumLength) return text;
  const shortened = text.slice(0, maximumLength - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 0 ? lastSpace : undefined).replace(/[\s,;:–—-]+$/, "")}…`;
}

/** The opening of the post body, without a "By … · Published …" byline. */
function openingOfBody(plainText: string): string {
  return plainText
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /^By [^·]{3,160}· Published [A-Z][a-z]+ \d{1,2}, \d{4}(?: · \d+ min read)?\s*/,
      "",
    )
    .trim();
}

/**
 * The description for search results and share previews: the admin's search
 * description, else the excerpt if it is a real summary, else the opening of
 * the post itself.
 */
export function describePostForSearch(post: {
  title: string;
  excerpt: string;
  metaDescription: string | null;
  contentPlainText: string;
}): string {
  if (post.metaDescription?.trim()) return post.metaDescription.trim();

  const excerpt = post.excerpt.trim();
  const excerptIsUseful =
    excerpt.length >= minimumUsefulExcerptLength &&
    excerpt.toLowerCase() !== post.title.trim().toLowerCase();
  if (excerptIsUseful) return shortenAtWord(excerpt, maximumDescriptionLength);

  const opening = openingOfBody(post.contentPlainText);
  if (opening) return shortenAtWord(opening, maximumDescriptionLength);
  return shortenAtWord(post.title, maximumDescriptionLength);
}

/** Alt texts that say nothing about the picture, e.g. "Thumbnail". */
const placeholderAltText =
  /^(?:thumbnail|image|photo|picture|cover|logo|deltacon(?: security)?(?: logo)?|ffl)$/i;

/**
 * The cover image's alt text, falling back to the post's title when the
 * stored text is missing or a placeholder like "Thumbnail" or "Deltacon Logo".
 */
export function describeCoverImage(post: {
  title: string;
  coverImageAltText: string | null;
}): string {
  const altText = post.coverImageAltText?.trim() ?? "";
  return altText && !placeholderAltText.test(altText) ? altText : post.title;
}
