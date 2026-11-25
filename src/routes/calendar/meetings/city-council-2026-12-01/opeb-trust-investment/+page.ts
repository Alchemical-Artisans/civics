import type { PageLoad } from "./$types"

/** The Mayor's letter's subject is "Order OPEB Trust Funds"; this says what the order does with them. */
export const load: PageLoad = () => ({
  item: { title: "Investment of OPEB Trust Funds" },
})
