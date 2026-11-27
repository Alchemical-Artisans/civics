import type { PageLoad } from "./$types"

/**
 * Who gives, and the Council on Aging program the gift is for -- the title the
 * same gift's return on 1 December 2026 uses. The packet's cheque (page 9) is
 * not excerpted: it carries account and routing numbers.
 */
export const load: PageLoad = () => ({
  item: { title: "Gift for the Happy Rides Program, Breakfast Exchange Club" },
})
