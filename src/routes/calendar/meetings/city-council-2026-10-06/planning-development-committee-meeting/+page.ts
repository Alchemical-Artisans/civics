import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence; the title names the committee and the
 * day it is meeting, which is what the announcement is for.
 */
export const load: PageLoad = () => ({
  item: { title: "Planning and Development Committee, October 19, 2026" },
})
