/** Longest web address part we create (search engines show ~75 characters). */
export const maximumSlugLength = 75;

/** Small words dropped only when a title is too long to fit whole. */
const fillerWords = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "is",
  "its",
  "of",
  "on",
  "the",
  "to",
  "with",
]);

/** The title's words in lowercase ASCII, without punctuation. */
function slugWords(text: string): string[] {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // remove accents
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "") // "America's" → "americas", not "america-s"
    .replace(/[^a-z0-9]+/g, "-")
    .split("-")
    .filter(Boolean);
}

/**
 * Turns a title into a web address part, e.g.
 * "5 Tips for Retail Security!" → "5-tips-for-retail-security".
 *
 * Long titles are shortened at a whole word, never mid-word: filler words
 * ("the", "of", …) are dropped first, then words are kept until the next one
 * would pass 75 characters. A lone letter left at the end is dropped too.
 */
export function createSlug(text: string): string {
  let words = slugWords(text);
  if (words.join("-").length <= maximumSlugLength) return words.join("-");

  words = words.filter((word, index) => index === 0 || !fillerWords.has(word));
  const keptWords: string[] = [];
  let length = 0;
  for (const word of words) {
    const lengthWithWord =
      length === 0 ? word.length : length + 1 + word.length;
    if (lengthWithWord > maximumSlugLength) break;
    keptWords.push(word);
    length = lengthWithWord;
  }
  while (keptWords.length > 1 && keptWords.at(-1)!.length === 1) {
    keptWords.pop();
  }
  // A single word longer than the limit is the only case cut mid-word.
  return keptWords.length > 0
    ? keptWords.join("-")
    : (words[0] ?? "").slice(0, maximumSlugLength);
}
