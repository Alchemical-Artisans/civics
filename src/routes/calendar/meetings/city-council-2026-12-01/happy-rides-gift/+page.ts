import type { PageLoad } from "./$types"

/** Who gives, and the Council on Aging program the gift is for. The packet's cheque is not excerpted: it carries account and routing numbers. */
export const load: PageLoad = () => ({
  item: { title: "Gift for the Happy Rides Program, Breakfast Exchange Club" },
})
