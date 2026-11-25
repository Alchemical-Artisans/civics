import type { PageLoad } from "./$types"

/**
 * The same title and slug as the order this amends, written up under the
 * sitting of 27 September 2016 where it was first read, so a reader following
 * one to the other reads the same words. The packet carries that order as
 * adopted, Document 15-J, passed on 11 October 2016.
 *
 * `wide` for the cost estimate's five columns.
 */
export const load: PageLoad = () => ({
  item: { title: "Loan Order, New Drinking Water Source" },
  wide: true,
})
