import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The parties
 * and the unit, short: the agreement names itself in full over three lines,
 * and the agenda repeats that in both 16.1 and 16.1.1. "Document 19-D" is left
 * off, as the cover sheet behind the item is titled Document # 19-D.
 */
export const load: PageLoad = () => ({
  item: { title: "NEPBA Local 119 Dispatchers Agreement" },
})
