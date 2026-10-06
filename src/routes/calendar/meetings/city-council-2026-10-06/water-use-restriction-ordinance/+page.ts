import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the ordinance the order repeals and replaces, the
 * same matter the Mayor filed on 22 September and the same slug there; the
 * order, 16.2.1, is transcribed on this page rather than left on the outline
 * beside the link.
 */
export const load: PageLoad = () => ({
  item: { title: "Water Use Restriction Ordinance" },
})
