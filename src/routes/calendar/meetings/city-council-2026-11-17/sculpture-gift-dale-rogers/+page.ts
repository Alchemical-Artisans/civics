import type { PageLoad } from "./$types"

/** The agenda prints a sentence for the order; the title is what is being given and by whom. */
export const load: PageLoad = () => ({
  item: { title: "Gift of a Sculpture, Dale Rogers" },
})
