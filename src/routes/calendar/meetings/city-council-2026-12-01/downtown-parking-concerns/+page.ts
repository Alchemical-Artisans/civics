import type { PageLoad } from "./$types"

/** The agenda prints a sentence; the title is the subject the two residents bring. */
export const load: PageLoad = () => ({
  item: { title: "Downtown Parking Concerns" },
})
