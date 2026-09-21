import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the ordinance the order repeals and replaces. The
 * order itself, 5.2.1, is transcribed on this page rather than left on the
 * outline beside the link.
 *
 * `wide` for the same reason a budget section asks for it: the page is a
 * two-column comparison of the article the order would replace against the
 * article it would put in its place, and a 48rem reading column has nowhere to
 * put two columns of legal prose. See `ordinances.ts`.
 */
export const load: PageLoad = () => ({
  item: { title: "Water Use Restriction Ordinance" },
  wide: true,
})
