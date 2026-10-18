import type { PageLoad } from "./$types"

/**
 * The grant the order borrows against. On the crossed document numbers, see
 * the Land and Water Conservation Fund order filed beside this one.
 */
export const load: PageLoad = () => ({
  item: { title: "Loan Order, PARC Grant" },
})
