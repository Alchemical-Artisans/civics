import type { PageLoad } from "./$types"

/**
 * The cover letter has no subject line, so this is what the agenda calls the
 * item, cut to what it is and which month it covers -- the form September's
 * report took on 27 October.
 *
 * `wide` for the five and six columns of figures.
 */
export const load: PageLoad = () => ({
  item: { title: "Revenue and Expense Reports, October 2026" },
  wide: true,
})
