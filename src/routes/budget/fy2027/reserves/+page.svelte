<script lang="ts">
  // A script here because these three tables are charted on the book's front
  // page as well; see docs/budget-pages.md. Nothing on the page is generated --
  // `BudgetTable` prints the cells exactly as `tables.ts` holds them, which is
  // exactly as the book sets them.
  import BudgetTable from "$lib/BudgetTable.svelte"
  import BudgetBands from "$lib/BudgetBands.svelte"
  import BudgetColumns from "$lib/BudgetColumns.svelte"
  import BookElsewhere from "$lib/BookElsewhere.svelte"
  import { amount, cell, type BudgetTableData } from "$lib/budget-table"
  import { FUND_BALANCE, FUND_BALANCE_HISTORY, FREE_CASH, STABILIZATION } from "./tables"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"

  let { data } = $props()

  /**
   * One figure off a dial: the book's own row label, its cell as printed, and
   * the dollars in it, which is the only part the drawing uses.
   *
   * The three dial tables are not printed on this page any more. The chart
   * draws every cell of them and prints every one beside its bar, and a table
   * saying again what the picture above it just said is a page asking to be
   * read twice. They are still the transcription, and still what the front page
   * reads its reserves bar out of.
   */
  const point = (table: BudgetTableData, row: string) => ({
    label: row,
    cell: cell(table, row, "Amount"),
    amount: amount(cell(table, row, "Amount"))!,
  })

  /**
   * The three policies on one scale, each named as its own table heads it.
   *
   * The row the book calls the city's position is not called the same thing
   * twice -- "Actual" on the fund balance, "Anticipated" on free cash, which is
   * a year not closed yet, and "Actual Balance" on stabilization -- so each is
   * named here rather than found by rule, and the chart prints whichever word
   * the book used.
   */
  const bands = [
    {
      label: FUND_BALANCE.columns[0],
      minimum: point(FUND_BALANCE, "Minimum"),
      actual: point(FUND_BALANCE, "Actual"),
      maximum: point(FUND_BALANCE, "Maximum"),
    },
    {
      label: FREE_CASH.columns[0],
      minimum: point(FREE_CASH, "Minimum"),
      actual: point(FREE_CASH, "Anticipated"),
      maximum: point(FREE_CASH, "Maximum"),
    },
    {
      label: STABILIZATION.columns[0],
      minimum: point(STABILIZATION, "Minimum Balance"),
      actual: point(STABILIZATION, "Actual Balance"),
    },
  ]

  /**
   * The bottom row of page 18's table, drawn: what the fund balance came to at
   * the end of each of the three years the book accounts for.
   *
   * Only that row. The four above it are the flows that moved it -- a year's
   * whole revenue and expenditure, a quarter of a billion dollars each -- and
   * on a scale that fits those, the balance they leave behind is a line one
   * pixel high. The table under the chart is where those belong.
   */
  const ENDING = "Ending Fund Balance"
  const balances = FUND_BALANCE_HISTORY.columns.slice(1).map((year) => ({
    label: year,
    parts: [{ label: ENDING, amount: amount(cell(FUND_BALANCE_HISTORY, ENDING, year))! }],
  }))
</script>

<!-- Page 17. The page is "Reserves", which is the bucket; this is the section
     of the book in it. -->
<h2>Fiscal Reserves</h2>

<p>
  <em>
    The city will monitor reserves to ensure they are adequate and sustainable for future fiscal
    years, while meeting or exceeding the city's financial policy benchmarks, Department of Revenue
    recommendations, bond rating agency standards, and aligning with GFOA best practices.
  </em>
</p>

<!--
  The three policies before the three sections that set them out, the way the
  book's front page opens on its two columns: the page is about whether each
  fund is where it is supposed to be, and that is one picture rather than three
  pages of reading. Each bar is repeated below in the book's own dial table, at
  the policy it belongs to.
-->
<BudgetBands rows={bands} />

<p>
  <strong>City Reserve Policy #1:</strong> The City shall maintain an undesignated <GlossaryTerm
    term="Fund">fund</GlossaryTerm
  > balance between 5% and 15% of <GlossaryTerm term="General Fund">general fund</GlossaryTerm>
  <GlossaryTerm term="Revenues">revenues</GlossaryTerm>, less debt exclusion and Ch. 70.
</p>

<p>
  <strong>Results:</strong> The city's undesignated <GlossaryTerm term="Fund">fund</GlossaryTerm> balance
  as of June 30, 2025, was $13,985,452 or 7.85% of <GlossaryTerm term="General Fund"
    >general fund</GlossaryTerm
  > revenue. This is up from June 2024, which was $12,569,995 or 7.36%.
</p>

<h2>Fund Balance</h2>

<p>
  <GlossaryTerm term="Fund">Fund</GlossaryTerm> balance is the net position of a governmental <GlossaryTerm
    term="Fund">fund</GlossaryTerm
  > (assets minus liabilities), representing the accumulated difference between <GlossaryTerm
    term="Revenues">revenues</GlossaryTerm
  > and <GlossaryTerm term="Expenditures">expenditures</GlossaryTerm> over time. It measures available
  financial resources, acting as a "net worth" or savings account for governments to pay bills, maintain
  cash flow, and ensure financial stability.
</p>

<!-- What the fund balance has come to at the close of each of the three years
     the table below accounts for. The columns are what the table's bottom row
     says; everything that moved it is in the table. -->
<!-- A definite height, and enough of it: the columns are a percentage of the
     plot's height, so a box that does not say how tall it is draws nothing at
     all, and one shorter than the chart's own `min-h-64` plus its labels pushes
     the years out from under the columns. -->
<div class="not-prose my-6 h-80">
  <BudgetColumns rows={balances} />
</div>

<BudgetTable table={FUND_BALANCE_HISTORY} />

<h2>Free Cash</h2>

<p>
  <strong>City Reserve Policy #3:</strong> The amount to be held in <GlossaryTerm term="Free Cash"
    >free cash</GlossaryTerm
  > shall not be less than 2% or more than 8% of <GlossaryTerm term="General Fund"
    >general fund</GlossaryTerm
  >
  <GlossaryTerm term="Revenues">revenues</GlossaryTerm>, less debt exclusion and Ch. 70.
</p>

<p>
  <strong>Results:</strong> The city is projected to have a <GlossaryTerm term="Free Cash"
    >free cash</GlossaryTerm
  > balance of $0 at the end of <GlossaryTerm term="Fiscal Year">fiscal year</GlossaryTerm> 2026, largely
  due to exceptionally high snow removal costs that exceeded $4.6 million during the past winter. This
  winter was the coldest and snowiest the area has experienced since 2014-2015. In light of these unprecedented
  expenses, the Mayor and the city's Emergency Management Director have requested financial assistance
  from the Commonwealth. This year's <GlossaryTerm term="Free Cash">free cash</GlossaryTerm> balance marks
  a significant decrease from the city's balance at the end of <GlossaryTerm term="Fiscal Year"
    >fiscal year</GlossaryTerm
  > 2025, which was $2,578,279, reflecting a decline of 1.51%.
</p>

<h2>Stabilization Reserve</h2>

<p>
  <strong>City Reserve Policy #4:</strong> The city shall maintain a Stabilization <GlossaryTerm
    term="Reserve Fund">Reserve Fund</GlossaryTerm
  > of at least 3% of <GlossaryTerm term="General Fund">general fund</GlossaryTerm> revenue, less debt
  exclusion and Chapter 70.
</p>

<p>
  <strong>Results:</strong> The city's <GlossaryTerm term="Stabilization Fund"
    >stabilization fund</GlossaryTerm
  > is $8,001,094 or 4.49% of <GlossaryTerm term="General Fund">general fund</GlossaryTerm> revenue, not
  including Chapter 70 and debt exclusions. This is up from fiscal 2025 which had a balance of $7,533,248
  or 4.41%.
</p>

<BookElsewhere items={data.elsewhere} book={data.book} />
