<script lang="ts">
  // A script here because these three tables are charted on the book's front
  // page as well; see docs/budget-pages.md. Nothing on the page is generated --
  // `BudgetTable` prints the cells exactly as `tables.ts` holds them, which is
  // exactly as the book sets them.
  import BudgetBands from "$lib/BudgetBands.svelte"
  import BudgetLines from "$lib/BudgetLines.svelte"
  import BudgetBars from "$lib/BudgetBars.svelte"
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
   * Page 18's table, turned from three columns into four years.
   *
   * The book accounts for 2023, 2024 and 2025, and opens each of them with the
   * balance carried in. That first figure is a year the table's own columns do
   * not name -- the balance the city closed 2022 with -- so the charts run from
   * 2022, and every row gives `null` for a year the book prints nothing for.
   */
  const BOOK_YEARS = FUND_BALANCE_HISTORY.columns.slice(1)
  const years = [String(Number(BOOK_YEARS[0]) - 1), ...BOOK_YEARS]

  /** A row of the table, read across the years the chart draws. */
  const row = (label: string, from = 1) =>
    years.map((year, at) =>
      at < from ? null : Math.abs(amount(cell(FUND_BALANCE_HISTORY, label, year))!),
    )

  /**
   * What came in and what went out, at the size of the money.
   *
   * The book prints these inside a sum -- "Plus Fiscal Year Revenue", "Less
   * Fiscal Year Expenditures" -- and writes the expenditure in parentheses,
   * which is the sum's minus sign rather than a negative amount of spending.
   * The line is drawn at what was spent; the label is the book's, sum and all,
   * because renaming a row to suit a chart is inventing text.
   */
  const flows = [
    { label: "Plus Fiscal Year Revenue", values: row("Plus Fiscal Year Revenue") },
    { label: "Less Fiscal Year Expenditures", values: row("Less Fiscal Year Expenditures") },
  ]

  /**
   * What they left behind, as columns standing on a zero line.
   *
   * "Beginning Fund Balance" and "Ending Fund Balance" are the same figure read
   * twice -- each year opens where the last one closed -- so they are one row
   * running from the close of 2022 to the close of 2025.
   *
   * It is charted as "Undesignated Fund Balance", which is the book's own name
   * for this figure everywhere but in this table: the dial on page 17 heads its
   * column with it, and the prose gives the same $13,985,452 for the same date.
   * That is the name worth using, because it says what the figure is -- money
   * nobody has spoken for, which is the only part of a fund balance a Council
   * can appropriate.
   *
   * The encumbrances go under the line because that is where their sign puts
   * them, not because they are subtracted from the bar above: the book's row is
   * the *change* in what is set aside for open purchase orders over the year,
   * and the balance beside it is already net of that change. The two are a year
   * and its result, in one place because they are the same size and about the
   * same money.
   *
   * They are given second, and the chart stacks its last row against the zero
   * line, so the encumbrances sit at the foot of the column in the one year
   * where they are positive rather than perched on top of the balance.
   */
  const CLOSING = "Ending Fund Balance"
  const ENCUMBRANCES = "Net Reserve for Encumbrances"
  const balance = [
    {
      label: "Undesignated Fund Balance",
      values: years.map((year, at) =>
        at === 0
          ? amount(cell(FUND_BALANCE_HISTORY, "Beginning Fund Balance", BOOK_YEARS[0]))
          : amount(cell(FUND_BALANCE_HISTORY, CLOSING, year)),
      ),
    },
    {
      label: ENCUMBRANCES,
      values: years.map((year, at) =>
        at === 0 ? null : amount(cell(FUND_BALANCE_HISTORY, ENCUMBRANCES, year)),
      ),
    },
  ]
</script>

<!-- Page 17. The page is "Reserves", which is the bucket; this is the section
     of the book in it. -->
<h2>Fiscal Reserves</h2>

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

<!--
  Page 18's whole table, as two charts sharing a row of years.

  Two and not one because the table holds figures of two sizes: a year's revenue
  and expenditure are a quarter of a billion dollars each, and the balance they
  leave behind is fourteen million. On one scale the balance is a flat line on
  the floor; on two axes the drawing could be made to say anything. So the flows
  are one chart and what they leave is the other, drawn against the same four
  years so a reader can look straight down from one to the next.

  The flows first, because they are the cause. The book prints them as a sum --
  "Plus", "Less" -- and the signs are that sum's, not the money's: what the city
  spent in 2023 is $233,787,846, and the line is drawn at what was spent. The
  row labels are the book's own, sum and all.
-->
<BudgetLines {years} rows={flows} />

<!--
  And what they left: columns rather than a line, because these are not a trend
  but where the city stood at four closes of business. A line between two
  balances invites the eye to read its slope as though something happened along
  the way, and the book claims nothing about the months in between.

  The undesignated balance stands above the zero line and the year's
  encumbrances hang below it, so a column's span is the distance between what
  the city could spend and what it had already promised. The beginning and
  ending balances are one row, because they are one figure read twice -- every
  year opens where the last one closed, which `reserves.spec.ts` checks against
  the book's own cells -- so it starts a year before the flows do: the balance
  the city carried into 2023 is the balance it closed 2022 with. That is why the
  years belong to the charts rather than to the rows.
-->
<BudgetBars {years} rows={balance} />

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
