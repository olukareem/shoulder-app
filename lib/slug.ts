/**
 * Generate a URL-safe slug from a title string.
 * Strips accents, lowercases, replaces spaces/punctuation with hyphens.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")      // remove non-alphanumeric (keep spaces/hyphens)
    .replace(/\s+/g, "-")              // spaces → hyphens
    .replace(/-+/g, "-")               // collapse multiple hyphens
    .replace(/^-|-$/g, "");            // trim leading/trailing hyphens
}

/**
 * Generate a unique slug for a post, deduplicating against existing slugs
 * by appending -2, -3, … as needed.
 *
 * existingSlugs should be a Set of currently-used slugs from the database.
 */
export function uniqueSlug(title: string, existingSlugs: Set<string>): string {
  const base = slugify(title);
  if (!existingSlugs.has(base)) return base;

  let i = 2;
  while (existingSlugs.has(`${base}-${i}`)) {
    i++;
  }
  return `${base}-${i}`;
}
