import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the ordinance the order repeals and replaces, the
 * same matter the Mayor filed on 22 September and the same slug there; the
 * order, 16.2.1, is transcribed on this page rather than left on the outline
 * beside the link.
 *
 * `wide` for the same reason the 22 September page asks for it: the page is a
 * two-column comparison of the article the order would replace against the
 * article it would put in its place, and a 48rem reading column has nowhere to
 * put two columns of legal prose.
 */
export const load: PageLoad = () => ({
  item: { title: "Water Use Restriction Ordinance" },
  wide: true,
})
