import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence; the title names the committee and the
 * day it is meeting. The sitting has its own page, linked from the item.
 */
export const load: PageLoad = () => ({
  item: { title: "Natural Resources and Public Property Committee, September 14, 2026" },
})
