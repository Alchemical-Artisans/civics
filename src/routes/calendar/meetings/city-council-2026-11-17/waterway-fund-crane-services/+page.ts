import type { PageLoad } from "./$types"

/** The agenda's two lines are the Mayor's sentence and the order's; the title is what the money is for. */
export const load: PageLoad = () => ({
  item: { title: "Waterway Fund, Crane Services for Docks" },
})
