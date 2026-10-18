import type { PageLoad } from "./$types"

/**
 * The order's own opening words. The agenda numbers it 13.1 and the minutes
 * 12.2; each is kept as its own document prints it.
 */
export const load: PageLoad = () => ({
  item: { title: "Pay Bills of Previous Years" },
})
