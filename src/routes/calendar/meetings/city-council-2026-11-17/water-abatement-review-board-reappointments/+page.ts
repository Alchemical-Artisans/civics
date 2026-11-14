import type { PageLoad } from "./$types"

/** The agenda prints the board in italics with the term; the title is the board and what is being done to its membership. */
export const load: PageLoad = () => ({
  item: { title: "Water Abatement Review Board Reappointments" },
})
