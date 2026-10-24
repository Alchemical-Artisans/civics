import type { PageLoad } from "./$types"

/**
 * The Mayor's own subject line, "FY25 Bills", which is also what the 20 October
 * sitting's copy of this order is titled; the agenda prints the sentence and
 * the sum instead.
 */
export const load: PageLoad = () => ({
  item: { title: "FY25 Bills" },
})
