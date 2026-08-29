import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The agenda's
 * own label for the item, title-cased as the other headings here are.
 */
export const load: PageLoad = () => ({
  item: { title: "Annual License Renewals" },
})
