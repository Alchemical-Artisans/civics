import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the item, warrant number and month both.
 *
 * Three of the five items under New Business this evening are purchasing-card
 * warrants for three different months -- September, July and August -- and
 * the month is the only thing telling two of them apart, since the city gave
 * September's and August's the same number, JE20261023B. So the month stays
 * in the title and in the directory name.
 *
 * What the Committee votes on is two pages: the warrant the Chief Financial
 * Officer signs, and the Auditor's listing of the six charges behind it.
 * Those are transcribed, and so is the third page -- the card-by-card summary
 * the Business Department keeps, which is the only page that says what each
 * charge was for. It is a wide sheet scanned sideways and is rotated upright
 * in the excerpt.
 *
 * **The two reports do not agree on one account string.** The Auditor's
 * listing files the $0.99 Audible charge to 1010000.4.1210.6560.32.310.00.10
 * and the summary to 1010000.4.1210.6650.32.310.00.10, 6560 against 6650.
 * Each is transcribed as its own page prints it rather than one being
 * corrected to the other.
 *
 * The nineteen pages after those three are the evidence: Bank of America
 * cardholder statements, the district's own pre-authorization forms filled in
 * by hand, and the vendors' receipts. They are linked whole rather than
 * transcribed -- they are the backing for figures the two reports already
 * state, and they carry card numbers, signatures and private billing
 * addresses that the reports do not.
 */
export const load: PageLoad = () => ({
  item: { title: "Warrant Number JE20261023B September P-Card" },
  wide: true,
})
