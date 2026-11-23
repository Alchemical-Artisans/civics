import type { PageLoad } from "./$types"

/**
 * The agenda line names an appropriation for waterway maintenance; the title is what the order says the money buys.
 */
export const load: PageLoad = () => ({
  item: { title: "Crane Services for City Docks" },
})
