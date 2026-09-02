/**
 * The three reserve dials of "Fiscal Reserves", pages 17 to 20.
 *
 * The book draws each policy as a dial: a floor, a ceiling where the policy
 * sets one, and where the city actually stands. Nothing on the dial is labelled
 * beyond those figures, so those figures are the transcription.
 *
 * They are data rather than markup because the book's front page now charts
 * them as well, and a figure transcribed in one place and typed again in
 * another is a figure that will eventually disagree with itself. `BudgetTable`
 * renders them here; the front page's `+page.ts` reads the same cells.
 *
 * `unheaded` because the book puts nothing over the columns -- the names below
 * are what a chart asks for a column by, and are never printed.
 */
import type { BudgetTableData } from "$lib/budget-table"

/** Policy #1: 5% to 15% of general fund revenue, less debt exclusion and Ch. 70. */
export const FUND_BALANCE: BudgetTableData = {
  columns: ["Undesignated Fund Balance", "Amount"],
  unheaded: true,
  rows: [
    { label: "Minimum", cells: ["$8,913,079"] },
    { label: "Actual", cells: ["$13,985,452 (7.85%)"] },
    { label: "Maximum", cells: ["$26,739,238"] },
  ],
}

/** Policy #3: not less than 2% nor more than 8% of the same revenue. */
export const FREE_CASH: BudgetTableData = {
  columns: ["Free Cash", "Amount"],
  unheaded: true,
  rows: [
    { label: "Minimum", cells: ["$3,565,232"] },
    { label: "Anticipated", cells: ["$0 (0%)"] },
    { label: "Maximum", cells: ["$14,260,927"] },
  ],
}

/** Policy #4: at least 3% of the same revenue, with no ceiling set. */
export const STABILIZATION: BudgetTableData = {
  columns: ["Stabilization Reserve", "Amount"],
  unheaded: true,
  rows: [
    { label: "Minimum Balance", cells: ["$5,347,848 (3%)"] },
    { label: "Actual Balance", cells: ["$8,001,094 (4.49%)"] },
  ],
}

/**
 * Page 18: three years of the fund balance, and what moved it each year.
 *
 * Data rather than markup for the same reason as the dials -- the page draws
 * the bottom row as well as printing it, and a figure typed twice is a figure
 * that will eventually disagree with itself.
 *
 * The book heads the first column with nothing, so neither does the page. Its
 * own ending balance for 2025 is $13,985,453, a dollar over the $13,985,452 the
 * dial above it gives for the same figure on the same date; both are printed as
 * the book prints them, and `overview.spec.ts` holds them against each other so
 * that a correction has to account for the dollar rather than absorb it.
 */
export const FUND_BALANCE_HISTORY: BudgetTableData = {
  columns: ["", "2023", "2024", "2025"],
  rows: [
    { label: "Beginning Fund Balance", cells: ["$12,429,870", "$10,209,394", "$12,569,995"] },
    { label: "Net Reserve for Encumbrances", cells: ["$97,098", "$(617,924)", "$(3,738,924)"] },
    { label: "Plus Fiscal Year Revenue", cells: ["$231,470,272", "$244,738,056", "$262,614,748"] },
    {
      label: "Less Fiscal Year Expenditures",
      cells: ["$(233,787,846)", "$(241,759,531)", "$(257,460,366)"],
    },
    { label: "Ending Fund Balance", cells: ["$10,209,394", "$12,569,995", "$13,985,453"] },
  ],
}
