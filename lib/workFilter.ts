/**
 * The filter, search and pagination of the Work listing (ruling 20b). These
 * are pure functions, so `tests/workFilter.test.ts` checks them without a
 * browser.
 */

/** Six cards on a page: the three rows that Figma draws (3353:3341). */
export const PER_PAGE = 6;

interface Filterable {
  title: string;
  tags: string[];
}

/** Lower case, no accents, no outer spaces: "Numériques" matches "numeriques". */
const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/** The Category options: every tag once, in alphabetical order. */
export const categoriesOf = (items: Filterable[]): string[] =>
  [...new Set(items.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b));

/**
 * The cards that have the category (when one is set) and that match the search
 * in the title or in a tag (when there is a search). The order does not change.
 */
export const filterProjects = <T extends Filterable>(items: T[], { category, q }: { category: string; q: string }): T[] => {
  const needle = fold(q);
  return items.filter(
    (p) =>
      (!category || p.tags.includes(category)) &&
      (!needle || fold(p.title).includes(needle) || p.tags.some((t) => fold(t).includes(needle))),
  );
};

/**
 * One page of the list. A page number out of range goes to the nearest page,
 * and an empty list is one empty page.
 */
export const paginate = <T>(items: T[], page: number): { items: T[]; page: number; pages: number } => {
  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const current = Number.isFinite(page) ? Math.min(Math.max(1, Math.trunc(page)), pages) : 1;
  return { items: items.slice((current - 1) * PER_PAGE, current * PER_PAGE), page: current, pages };
};
