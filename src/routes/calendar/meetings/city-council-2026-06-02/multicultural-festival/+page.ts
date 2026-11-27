import type { PageLoad } from "./$types"

/** The agenda gives a sentence; the title is the festival and who holds it. */
export const load: PageLoad = () => ({
  item: { title: "Multicultural Festival, Haverhill's Cultural Council" },
})
