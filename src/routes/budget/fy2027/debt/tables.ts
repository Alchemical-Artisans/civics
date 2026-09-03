/**
 * The debt the city carries, and the three policies it answers to: pages 21
 * to 25.
 *
 * Data rather than markup for the same reason as the reserve dials -- the
 * book's front page charts `LONG_TERM_DEBT` as a bar, and this page charts
 * all three tables itself now, so a figure transcribed once and typed again
 * in a chart's own data is a figure that can come back different.
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
 * Page 22's table: five years of what the city took in against what it paid
 * on its debt, and the book's own row for the second as a share of the
 * first.
 *
 * Revenue and debt payments are not on one scale -- a quarter of a billion
 * against single-digit millions -- so the page draws only the payments as a
 * chart of their own; the revenue and share rows stay here as the
 * transcription and are the figures the policy's own "Results" paragraph
 * quotes.
 */
export const ANNUAL_DEBT_PAYMENTS: BudgetTableData = {
  columns: ["", "2023", "2024", "2025", "2026", "2027"],
  rows: [
    {
      label: "General Fund Revenue",
      cells: ["$231,786,682", "$248,636,640", "$262,190,091", "$277,121,624", "$285,272,159"],
    },
    {
      label: "Annual Debt Payments",
      cells: ["$5,819,489", "$4,437,422", "$4,354,994", "$8,500,192", "$8,834,819"],
    },
    {
      label: "Debt Payments as % of Revenue",
      cells: ["2.5%", "1.8%", "1.7%", "3.1%", "3.1%"],
    },
  ],
}

/**
 * Page 25's table: Haverhill's debt per capita against the state average,
 * 2016 to 2026, both in the same units and on the same scale -- the point of
 * the book's own chart is holding the two against each other.
 */
export const DEBT_PER_CAPITA: BudgetTableData = {
  columns: ["Year", "Haverhill", "State Average"],
  caption: "Debt per capita",
  rows: [
    { label: "2016", cells: ["$1,454", "$1,875"] },
    { label: "2017", cells: ["$1,318", "$1,875"] },
    { label: "2018", cells: ["$1,414", "$1,906"] },
    { label: "2019", cells: ["$1,701", "$1,982"] },
    { label: "2020", cells: ["$1,390", "$2,120"] },
    { label: "2021", cells: ["$1,385", "$2,215"] },
    { label: "2022", cells: ["$1,326", "$2,336"] },
    { label: "2023", cells: ["$1,238", "$2,526"] },
    { label: "2024", cells: ["$1,849", "$2,626"] },
    { label: "2025", cells: ["$1,851", "$2,698"] },
    { label: "2026", cells: ["$2,562", "$2,698"] },
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
