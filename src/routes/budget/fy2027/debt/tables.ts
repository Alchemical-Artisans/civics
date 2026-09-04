/**
 * The debt the city carries, and the three policies it answers to: page 21
 * and the policy pages beside it.
 *
 * Data rather than markup for the same reason as the reserve dials -- the
 * book's front page charts `LONG_TERM_DEBT` as a bar, and this page charts it
 * again on its own, so a figure transcribed once and typed again in a
 * chart's own data is a figure that can come back different.
 */
import type { BudgetTableData } from "$lib/budget-table"

/**
 * Page 21's bar: what the city owes, by what it was borrowed for.
 *
 * `unheaded` because the book prints only its caption over these two
 * columns. The six lines add to $175,745,444, which is the total Policy #1's
 * own results state.
 */
export const LONG_TERM_DEBT: BudgetTableData = {
  columns: ["Purpose", "Amount"],
  caption: "Long Term Debt",
  unheaded: true,
  rows: [
    { label: "Water", cells: ["$55,755,389"] },
    { label: "Wastewater", cells: ["$36,457,555"] },
    { label: "General Government", cells: ["$5,880,000"] },
    { label: "Public Works", cells: ["$1,455,200"] },
    { label: "Public Safety", cells: ["$4,680,000"] },
    { label: "School Department", cells: ["$71,517,300"] },
  ],
}

/**
 * The three debt policies, as the book states each one's limit against where
 * the city actually stands: pages 21, 22 and 24.
 *
 * `unheaded` for the same reason as the reserve dials, but the cells
 * themselves are unlike them -- a reserve dial gives a dollar figure with its
 * share in parenthesis, "$13,985,452 (7.85%)", because the policy is a
 * percentage of a dollar base the book also prints. Debt's three policies are
 * each a percentage of a different base -- equalized valuation, general fund
 * revenue, the debt itself -- and the book gives none of those bases in
 * dollars here, only the percentage each policy sets and the percentage the
 * city stands at. So the cells are bare percentages, "5%" and "1.5%", and
 * `amount` -- built to read a dollar figure out of a cell -- is no use to
 * them; `percent` in the page script reads these instead.
 *
 * The rows are named for the book's own page each policy sits on -- "Long
 * Term Debt" (21), "Annual Debt Payments" (22), "Retiring Debt" (24) -- rather
 * than a label invented for the dial, since the book gives none of its own
 * the way page 17 heads its reserve dials. Naming a row for its page is what
 * also lets the same three strings head the page's own collapsed sections and
 * its References list without a second vocabulary for the same three things.
 */
export const DEBT_POLICIES: BudgetTableData = {
  columns: ["Policy", "Limit", "Actual"],
  unheaded: true,
  rows: [
    { label: "Long Term Debt", cells: ["5%", "1.5%"] },
    { label: "Annual Debt Payments", cells: ["4%", "3.1%"] },
    { label: "Retiring Debt", cells: ["65%", "59%"] },
  ],
}
