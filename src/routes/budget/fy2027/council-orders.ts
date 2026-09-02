/**
 * What the City Council actually appropriated for fiscal 2027, from the orders
 * on its agenda of 2 June 2026 (items 13.1, 13.2 and 13.3).
 *
 * The budget book is the Mayor's proposal for the general fund and nothing
 * else. Two things it leaves out are on this agenda:
 *
 * 1. **The water and wastewater departments.** They are enterprise funds --
 *    self-supporting, paid for by what households are billed rather than by the
 *    tax levy -- so they are appropriated in orders of their own and appear
 *    nowhere in the book's $285,272,159. That is a tenth of the city's spending
 *    the front page was silent about.
 *
 * 2. **What the Council votes is not the book's total.** Order 13.3 raises and
 *    appropriates $274,750,725; the book prints $285,272,159. The difference is
 *    the state assessments ($10,271,435) and the overlay ($250,000), which are
 *    charged to the city rather than voted by it, and which the book counts as
 *    appropriations while the Council's order does not.
 *
 * The figures are the orders' own, cell for cell, including where the agenda
 * prints a space inside a number ("$15, 967,043"). The source is a document
 * this site already carries: the City Council agenda for 2 June 2026, on the
 * calendar half.
 */
import type { BudgetTableData } from "$lib/budget-table"

/** The city's media page for that agenda, and the file behind it. */
export const AGENDA = {
  meeting: "city-council-2026-06-02",
  file: "https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/vuxlv1m5/full-agenda-6226.pdf",
}

/**
 * Orders 13.1 and 13.2: the sums appropriated to operate the two enterprise
 * departments. Each order also appropriates a further amount inside the general
 * fund, funded from that department's receipts -- $234,784 for water and
 * $698,981 for wastewater -- which are the two rows of the same names below, so
 * they are counted once, there.
 */
export const ENTERPRISE: BudgetTableData = {
  columns: ["Department", "Amount"],
  unheaded: true,
  rows: [
    { label: "Water Department", cells: ["$14,805,633"] },
    { label: "Wastewater Department", cells: ["$15, 967,043"] },
  ],
}

/** Order 13.3: the general fund appropriation, and how the order funds it. */
export const GENERAL_FUND: BudgetTableData = {
  columns: ["Source", "Amount"],
  unheaded: true,
  rows: [
    { label: "Taxation and Other Receipts", cells: ["$268,541,960"] },
    { label: "Free Cash", cells: ["$ 5,150,000"] },
    { label: "Wastewater Receipts", cells: ["$ 698,981"] },
    { label: "Water Receipts", cells: ["$234,784"] },
    { label: "Transfer from Other Available Funds", cells: ["$125,000"] },
  ],
}

/** The total order 13.3 states, which its five sources add up to. */
export const APPROPRIATED = "$ 274,750,725"
