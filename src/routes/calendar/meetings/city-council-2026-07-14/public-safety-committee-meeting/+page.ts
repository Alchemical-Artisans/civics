import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence; the title names the committee and the
 * day it is meeting, which is what the announcement is for. The sitting has
 * records of its own, so it needs no placeholder.
 */
export const load: PageLoad = () => ({
  item: { title: "Public Safety Committee, July 29, 2026" },
})
