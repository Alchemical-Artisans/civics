import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. "City
 * Council Special Permit" is what the application form calls itself; the
 * address is the agenda's. "Doc 21-I" is left off, as the cover sheet behind
 * the item is titled Document # 21-I.
 */
export const load: PageLoad = () => ({
  item: { title: "Special Permit, 125 River St" },
})
