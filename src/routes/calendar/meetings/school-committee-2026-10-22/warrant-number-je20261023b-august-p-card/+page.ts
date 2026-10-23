import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the item, warrant number and month both. August's
 * warrant and September's carry the same number, JE20261023B, so the month is
 * the only thing telling the two items apart and stays in the directory name.
 *
 * The three pages the Committee votes on are transcribed, as on the other two
 * P-Card items; the ten behind them -- statements, pre-authorization forms and
 * receipts -- are linked whole, for the reason the September warrant's page
 * gives.
 *
 * The summary's last row dates the MCPPO charge "8/25/20260", five digits of
 * year, and the cell overruns its own column on the printed page. It stays as
 * printed; the Auditor's listing of the same charge gives no date at all, so
 * there is nothing here to set it against.
 */
export const load: PageLoad = () => ({
  item: { title: "Warrant Number JE20261023B August P-Card" },
  wide: true,
})
