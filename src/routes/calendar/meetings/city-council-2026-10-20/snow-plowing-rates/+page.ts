import type { PageLoad } from "./$types"

/**
 * The Mayor's letter's own subject line, "Proposed Order to Amend Existing
 * Snow Plowing Rates", cut to the matter: the agenda's 5.3.1 is "Order- Amend
 * Document 94-O of 2025", which names a document number and nothing a reader
 * would recognise.
 *
 * Document 94-O of 2025 is the order the Council adopted on 21 October 2025 as
 * item 5.6.1, which deleted Document 117 of December 28, 2021 and put the
 * current rates in its place; the agenda line links there.
 *
 * `wide` for the four-column rate table, which carries both the figure struck
 * and the figure put in its place in every cell.
 */
export const load: PageLoad = () => ({
  item: { title: "Snow Plowing Rates" },
  wide: true,
})
