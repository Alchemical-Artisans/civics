import type { PageLoad } from "./$types"

/**
 * The order has no name of its own; the title is what it pays for.
 */
export const load: PageLoad = () => ({
  item: { title: "Transfer to Replace the Failing Fuel System" },
})
