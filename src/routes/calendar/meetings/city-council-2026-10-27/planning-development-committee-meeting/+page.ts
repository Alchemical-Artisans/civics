import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence; the title names the committee and the
 * day it is meeting, which is what the announcement is for -- the same form the
 * 6 October sitting's announcement of this committee's 19 October meeting uses.
 */
export const load: PageLoad = () => ({
  item: { title: "Planning and Development Committee, November 9, 2026" },
})
