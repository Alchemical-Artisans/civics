import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The name of
 * the business, as the agenda quotes it, and what the application form calls
 * itself. "Doc 21-D" is left off, as the cover sheet behind the item is titled
 * Document # 21-D.
 */
export const load: PageLoad = () => ({
  item: { title: "Mariam's Cottage Special Permit" },
})
