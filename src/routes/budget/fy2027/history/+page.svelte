<script lang="ts">
  // The table is page 18's, transcribed beside the reserves page because that
  // page draws the rest of it: the balance those flows left behind, which is
  // reserves' own business and stays there. One copy, read from both.
  import BudgetLines from "$lib/BudgetLines.svelte"
  import { amount, cell } from "$lib/budget-table"
  import { FUND_BALANCE_HISTORY } from "../reserves/tables"

  /** The years page 18 accounts for, which are its own columns. */
  const years = FUND_BALANCE_HISTORY.columns.slice(1)

  /**
   * What came in and what went out, at the size of the money.
   *
   * The book prints these inside a sum -- "Plus Fiscal Year Revenue", "Less
   * Fiscal Year Expenditures" -- and writes the expenditure in parentheses,
   * which is the sum's minus sign rather than a negative amount of spending.
   * The line is drawn at what was spent; the label is the book's, sum and all,
   * because renaming a row to suit a chart is inventing text.
   */
  const flows = ["Plus Fiscal Year Revenue", "Less Fiscal Year Expenditures"].map((label) => ({
    label,
    values: years.map((year) => Math.abs(amount(cell(FUND_BALANCE_HISTORY, label, year))!)),
  }))
</script>

<!--
  Two lines on one scale, because the whole of what these two figures have to
  say to each other is which of them is on top: the year they cross, 2023, is
  the year the city spent more than it took in, and everything the reserves page
  shows about the fund balance falling follows from it.
-->
<BudgetLines {years} rows={flows} />
