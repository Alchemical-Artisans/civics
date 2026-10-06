import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the ordinance the order repeals and replaces. The
 * order itself, 5.2.1, is transcribed on this page rather than left on the
 * outline beside the link.
 *
 * `wide` for the diff, which lays today's text and the amended text side by
 * side by default, and a 48rem reading column halves each to a few words a
 * line.
 */
export const load: PageLoad = () => ({
  item: { title: "Water Use Restriction Ordinance" },
  wide: true,
})
