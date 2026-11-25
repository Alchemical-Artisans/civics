import type { PageLoad } from "./$types"

/** The agenda prints a sentence; the title names what the update is about, in the Mayor's letter's own words. */
export const load: PageLoad = () => ({
  item: { title: "Water Emergency Declaration Update" },
})
