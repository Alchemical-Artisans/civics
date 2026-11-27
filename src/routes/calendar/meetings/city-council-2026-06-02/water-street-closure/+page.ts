import type { PageLoad } from "./$types"

/** The agenda gives a sentence; the title is what the discussion is about. */
export const load: PageLoad = () => ({
  item: { title: "Partial Water Street Closure" },
})
