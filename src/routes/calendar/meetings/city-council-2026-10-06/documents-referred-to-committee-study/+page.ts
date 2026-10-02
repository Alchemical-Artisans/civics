import type { PageLoad } from "./$types"

/**
 * The clerk's standing list, which the packet prints under the agenda's own
 * heading for item 19. The agenda leaves the heading bare; the list is the two
 * pages behind it, and it is the same list the packet of 29 September carried,
 * still footed "Updated: September 24, 2026".
 *
 * `wide` for the reason the revenue and expense reports ask for it: the table
 * is four columns and one of them is a whole motion, which a 48rem reading
 * column has nowhere to put. The page is the table.
 */
export const load: PageLoad = () => ({
  item: { title: "Documents Referred to Committee Study" },
  wide: true,
})
