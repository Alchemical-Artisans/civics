import type { PageLoad } from "./$types"

/**
 * The Mayor's letter's own subject line, the same title and slug the matter
 * carries on 29 September. The agenda's line for the item is the order's
 * opening sentence, which names no matter.
 */
export const load: PageLoad = () => ({
  item: { title: "FY25 Bills" },
})
