import type { PageLoad } from "./$types"

/**
 * The cover letter has no subject line, so this is what the agenda calls the
 * item, cut to what it is and which month it covers.
 *
 * `wide` for the same reason the water ordinance asks for it: the reports are
 * five and six columns of figures, and a 48rem reading column has nowhere to
 * put them. The reading here is one sentence; the page is the tables.
 */
export const load: PageLoad = () => ({
  item: { title: "Revenue and Expense Reports, August 2026" },
  wide: true,
})
