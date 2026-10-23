import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the item, warrant number and month both -- see
 * the September P-Card's page for why the month is in the directory name.
 *
 * The three pages the Committee votes on are transcribed: the warrant the
 * Chief Financial Officer signs, the Auditor's listing of the eight charges,
 * and the Business Department's card-by-card summary, which is the only page
 * saying what each charge was for. The summary is a wide sheet scanned
 * sideways and is rotated upright in the excerpt -- the other way round from
 * September's and August's, which were turned the opposite way.
 *
 * The thirty pages behind them are Bank of America cardholder statements,
 * the district's pre-authorization forms filled in by hand, and the vendors'
 * receipts. They are linked whole rather than transcribed, for the reason the
 * September warrant's page gives.
 */
export const load: PageLoad = () => ({
  item: { title: "Warrant Number JE20261023 July P-Card" },
  wide: true,
})
