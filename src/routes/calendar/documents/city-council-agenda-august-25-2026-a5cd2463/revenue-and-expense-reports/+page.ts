import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The cover
 * letter has no subject line, so this is what the agenda calls the item, cut
 * to what it is and which months it covers.
 */
export const load: PageLoad = () => ({
  item: { title: "Revenue and Expense Reports, June and July 2026" },
})
