import type { PageLoad } from "./$types"

/** The agenda prints a sentence; the title is its subject and street. */
export const load: PageLoad = () => ({
  item: { title: "Traffic Safety on Germain Ave" },
})
