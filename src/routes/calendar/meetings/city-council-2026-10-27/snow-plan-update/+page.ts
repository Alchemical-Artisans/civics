import type { PageLoad } from "./$types"

/** The agenda prints a sentence; the title is what the councilors are asking for. */
export const load: PageLoad = () => ({
  item: { title: "Snow Plan Update" },
})
