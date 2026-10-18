import type { PageLoad } from "./$types"

/**
 * The cover letter has no subject line, so this is what the agenda calls the
 * item, cut to what it is and which month it covers.
 *
 * `wide` for the same reason the August reports ask for it: five and six
 * columns of figures have nowhere to go in a 48rem reading column. The reading
 * here is one sentence; the page is the tables.
 */
export const load: PageLoad = () => ({
  item: { title: "Revenue and Expense Reports, December 2025" },
  wide: true,
})
