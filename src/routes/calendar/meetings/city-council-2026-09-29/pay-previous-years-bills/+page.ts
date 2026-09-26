import type { PageLoad } from "./$types"

/**
 * The Mayor's letter's own subject line. The agenda's line for the item is the
 * order's opening sentence, which names no matter; "FY25 Bills" is what the
 * city calls these five.
 */
export const load: PageLoad = () => ({
  item: { title: "FY25 Bills" },
})
