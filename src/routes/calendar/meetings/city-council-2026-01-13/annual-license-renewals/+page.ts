import type { PageLoad } from "./$types"

/**
 * Eighteen sub-items, of which only 12.7.2 has anything filed against it this
 * sitting; the other seventeen are category headings with nothing under them.
 * A numbered list that is seventeen empty categories and one real entry has no
 * reader value split across the outline, so the whole list is here and the
 * agenda carries a single 12.7 link.
 */
export const load: PageLoad = () => ({
  item: { title: "Annual License Renewals" },
})
