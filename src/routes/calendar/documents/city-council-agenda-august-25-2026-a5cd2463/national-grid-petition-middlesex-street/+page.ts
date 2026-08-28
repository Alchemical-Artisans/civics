import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. Nothing in
 * the packet gives the item a short name -- the petition, the order and the
 * plan each title themselves after the form they are. The directory keeps the
 * street, which the title does not, because the agenda carries a second
 * National Grid pole petition at 12.1 for Emerson St.
 */
export const load: PageLoad = () => ({
  item: { title: "Additional National Grid Poles" },
})
