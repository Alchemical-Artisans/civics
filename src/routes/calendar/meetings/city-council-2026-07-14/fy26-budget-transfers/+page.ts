import type { PageLoad } from "./$types"

/**
 * The agenda gives the order's sentence; the two tables it prints are
 * transcribed beside it.
 */
export const load: PageLoad = () => ({
  item: { title: "FY26 Budget Transfers" },
})
