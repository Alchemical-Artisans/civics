import type { PageLoad } from "./$types"

/**
 * The order has no name of its own; the title names the two accounts it funds.
 */
export const load: PageLoad = () => ({
  item: { title: "Transfer to Outdoor Lighting and Vehicle Maintenance" },
})
