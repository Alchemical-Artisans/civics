/**
 * The debt the city carries, by what it was borrowed for: page 21's list.
 *
 * Data rather than markup because the book's front page charts it as a pie, and
 * a figure transcribed twice is a figure that will eventually disagree with
 * itself. The six lines add to $175,745,444, which is the total the page states
 * in its own sentence above them.
 *
 * `unheaded` because the book prints only its caption over these two columns.
 */
import type { BudgetTableData } from "$lib/budget-table"

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
