<script lang="ts">
  // A script here because these three tables are charted on the book's front
  // page as well; see docs/budget-pages.md. Nothing on the page is generated --
  // `BudgetTable` prints the cells exactly as `tables.ts` holds them, which is
  // exactly as the book sets them.
  import BudgetBands from "$lib/BudgetBands.svelte"
  import BudgetBars from "$lib/BudgetBars.svelte"
  import BookReferences from "$lib/BookReferences.svelte"
  import { amount, cell, type BudgetTableData } from "$lib/budget-table"
  import { FUND_BALANCE, FUND_BALANCE_HISTORY, FREE_CASH, STABILIZATION } from "./tables"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  // Iconify's offline component, the same one `Note` uses: the artwork is
  // inlined at build time rather than fetched, so a reader's browser never has
  // to reach api.iconify.design for a checkmark.
  import Icon from "@iconify/svelte/dist/OfflineIcon.svelte"
  import checkCircle from "@iconify-icons/material-symbols/check-circle-rounded"
  import warning from "@iconify-icons/material-symbols/warning-rounded"

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
   * Whether a fund sits inside the band its own policy sets -- the same test
   * the chart draws as a bar falling short of, or past, its rail. Kept to bare
   * facts rather than a sentence, the way an accessible name built from the
   * book's own cells is elsewhere on this page: "Within policy" names what the
   * chart already shows, "Below floor" and "Above ceiling" the two ways a fund
   * can fail to.
   */
  const standing = (band: (typeof bands)[number]): { ok: boolean; label: string } => {
    if (band.actual.amount < band.minimum.amount) return { ok: false, label: "Below floor" }
    if (band.maximum && band.actual.amount > band.maximum.amount) {
      return { ok: false, label: "Above ceiling" }
    }
    return { ok: true, label: "Within policy" }
  }

  /**
   * Policy #2 sets no band of its own to be measured against -- it is what has
   * to happen when #1's does not hold, so its standing is #1's turned into the
   * question of whether the plan it names is currently owed.
   */
  const trigger = (band: (typeof bands)[number]): { ok: boolean; label: string } =>
    standing(band).ok ? { ok: true, label: "Not triggered" } : { ok: false, label: "Triggered" }

  const policy1 = standing(bands[0])
  const policy2 = trigger(bands[0])
  const policy3 = standing(bands[1])
  const policy4 = standing(bands[2])

  /** What Reserve Policy 2 itself is quoted calling the figure it answers to,
      in the sentence that names it -- there is no dial table to read a label
      off, the way the other three sections' names come off `bands`. */
  const FUND_BALANCE_FLOOR = "Fund Balance Floor"

  /**
   * The years page 18 accounts for, plus one it does not have a column of its
   * own for: the book gives no row headed 2022, but its own "Beginning Fund
   * Balance" for 2023 is the balance the city closed 2022 with, so that figure
   * belongs to 2022 rather than to the year that happens to print it.
   *
   * It reads fine now in a way it did not before the chart turned on its side:
   * a column holding this figure and nothing else used to be a gap in the
   * middle of the axis, three full years either side of an empty one. A row is
   * a whole line with one bar on it instead of half a column, so the year that
   * has only this to show does not read as a year with something missing.
   *
   * The top of the same table -- what came in and what went out each of these
   * years -- is on `history`, which is not about reserves and has no 2022 to
   * add back: page 18 gives no revenue or expenditure figure for a year before
   * its own first column. What it says about this chart is that 2023, the year
   * the balance fell, is the year the city spent more than it took in.
   */
  const HISTORY_YEARS = FUND_BALANCE_HISTORY.columns.slice(1)
  const years = ["2022", ...HISTORY_YEARS]

  /**
   * What they left behind, as rows run off a zero line.
   *
   * The book's "Ending Fund Balance" row, which is where 2023 through 2025
   * left it. "Beginning Fund Balance" is the same figure read a second time
   * for each of those -- every year opens where the last one closed, which
   * `reserves.spec.ts` checks against the book's own cells -- so charting both
   * would be one row drawn twice, a year apart. 2022 is the exception: the
   * table's first column is 2023, so it has no "Ending Fund Balance" of its
   * own, and its "Beginning Fund Balance" -- otherwise the figure charting
   * skips -- is the only one the book gives for where 2022 closed.
   *
   * It is charted as "Undesignated Fund Balance", which is the book's own name
   * for this figure everywhere but in this table: the dial on page 17 heads its
   * column with it, and the prose gives the same $13,985,452 for the same date.
   * That is the name worth using, because it says what the figure is -- money
   * nobody has spoken for, which is the only part of a fund balance a Council
   * can appropriate.
   *
   * The encumbrances go on the other side of the line because that is where
   * their sign puts them, not because they are subtracted from the balance
   * beside them: the book's row is the *change* in what is set aside for open
   * purchase orders over the year, and the balance is already net of that
   * change. The two are a year and its result, in one place because they are
   * the same size and about the same money. 2022 draws none: the table gives
   * no encumbrance movement for a year before its own first column, so that
   * row is a single bar.
   *
   * Nothing is stacked, for the same reason: page 18 only reconciles with the
   * encumbrance term in it -- 2023 comes to $10,209,394 with it and $10,112,296
   * without -- so the bar beside it would be the same money drawn twice. They
   * are given second, and the chart draws each series after the first thinner
   * and in front, so the year the reserve released money reads against the
   * balance rather than on top of it.
   */
  const OPENING = "Beginning Fund Balance"
  const CLOSING = "Ending Fund Balance"
  const ENCUMBRANCES = "Net Reserve for Encumbrances"
  const balance = [
    {
      label: "Undesignated Fund Balance",
      values: [
        amount(cell(FUND_BALANCE_HISTORY, OPENING, HISTORY_YEARS[0])),
        ...HISTORY_YEARS.map((year) => amount(cell(FUND_BALANCE_HISTORY, CLOSING, year))),
      ],
    },
    {
      label: ENCUMBRANCES,
      values: [
        null,
        ...HISTORY_YEARS.map((year) => amount(cell(FUND_BALANCE_HISTORY, ENCUMBRANCES, year))),
      ],
    },
  ]
</script>

<!--
  Laid out as the book's front page is: the charts down the left and across the
  top, and the reading under them in the only box that scrolls.

  A section is usually a reading column, and this one is not, because it is not
  usually two charts either. The three policies are the page's answer -- is each
  fund where it is supposed to be -- and a reader working down four sections of
  the city's prose is exactly the reader who wants that answer still in view.

  So the page is one screen on a wide window: 181px of it is spoken for -- the
  bar at the top (53), the padding the layout puts above the page (16) and the
  padding it puts below to clear the fixed calendar (112) -- and the grid takes
  the rest. Below `lg` it is a single column and scrolls as a page, charts
  first, because a column narrower than these has nowhere to put them.
-->
<div class="lg:grid lg:h-[calc(100vh-181px)] lg:grid-cols-[max-content_minmax(0,1fr)] lg:gap-x-10">
  <!--
    The three policies as three columns, down the left where the book's front
    page keeps its two: the page's whole question is whether each fund is where
    it is supposed to be, and that is one picture rather than four pages of
    reading. Nothing heads it -- each column carries its own name, and the
    prose it belongs to is the first thing in the column beside it.
  -->
  <div class="lg:h-full">
    <BudgetBands rows={bands} />
  </div>

  <div class="lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
    <!--
    Page 18's bottom rows: what each of those years left behind, as rows rather
    than a line, because these are not a trend but where the city stood at four
    closes of business. A line between two balances invites the eye to read its
    slope as though something happened along the way, and the book claims
    nothing about the months in between.

    The undesignated balance runs to the right of the zero line and the year's
    encumbrances hang to the left of it, so a bar's span is the distance
    between what the city could spend and what it had already promised. The
    balance is the book's closing row alone: the opening one is the same
    figure a year earlier, which `reserves.spec.ts` checks against the book's
    own cells, so charting both would be one row drawn twice -- except 2022,
    which has no closing row of its own and draws the opening one instead.
  -->
    <BudgetBars {years} rows={balance} />

    <!-- The one thing on this page that scrolls. `min-h-0` because a flex child
         will not shrink below its content without it, and a box that cannot
         shrink cannot scroll; `relative` because the `sr-only` note on a
         reference that opens the city's PDF is absolutely positioned, and
         without a positioned ancestor it is laid out against the page instead
         of this box -- which a scroller does not clip, so the page grew by the
         height of the list hanging out of the bottom of it. The prose keeps its
         own reading measure in here, since the page around it no longer sets
         one. -->
    <div class="lg:relative lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
      <div class="max-w-3xl">
        <!--
          Four policies, four sections, each closed until asked for.

          The book gives each one a paragraph or two, which read fine end to
          end when this was the only thing on the page. It no longer is: the
          reading now sits beside the two charts rather than under them, in a
          column that is short as well as narrow, and a fund's standing is the
          first thing a reader wants from it -- not a paragraph to search for
          the word "below" in. `<details>` costs nothing to get that for free:
          a native disclosure with its own keyboard handling, closed by
          default so the column opens on four one-line answers rather than
          four paragraphs to scroll past, and open on request for the reader
          who wants the policy's own words.

          The indicator repeats a comparison `BudgetBands` already draws --
          a bar reaching its rail or falling short of it -- as a word rather
          than a length, for the reader who wants the verdict without reading
          a bar chart. `standing` and `trigger` above compute it from the same
          `bands` the chart draws from, so the two can not disagree.
        -->
        {#snippet summaryRow(name: string, figure: string | undefined, ok: boolean, label: string)}
          <h2 class="m-0 flex-1 text-sm font-semibold text-slate-900">{name}</h2>
          {#if figure}
            <span class="font-normal text-slate-600 tabular-nums">{figure}</span>
          {/if}
          <span
            class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium {ok
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'}"
          >
            <Icon icon={ok ? checkCircle : warning} width="14" height="14" aria-hidden="true" />
            {label}
          </span>
          <span
            aria-hidden="true"
            class="text-slate-400 transition-transform duration-150 group-open:rotate-180"
            >&#9662;</span
          >
        {/snippet}

        <details class="group my-3 rounded-lg border border-slate-200">
          <summary
            class="not-prose flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-2 select-none [&::-webkit-details-marker]:hidden"
          >
            {@render summaryRow(bands[0].label, bands[0].actual.cell, policy1.ok, policy1.label)}
          </summary>

          <div class="border-t border-slate-100 px-3 pt-3 pb-1">
            <p>
              <strong>City Reserve Policy #1:</strong> The City shall maintain an undesignated <GlossaryTerm
                term="Fund">fund</GlossaryTerm
              > balance between 5% and 15% of <GlossaryTerm term="General Fund"
                >general fund</GlossaryTerm
              >
              <GlossaryTerm term="Revenues">revenues</GlossaryTerm>, less debt exclusion and Ch. 70.
            </p>

            <p>
              <strong>Results:</strong> The city's undesignated <GlossaryTerm term="Fund"
                >fund</GlossaryTerm
              > balance as of June 30, 2025, was $13,985,452 or 7.85% of <GlossaryTerm
                term="General Fund">general fund</GlossaryTerm
              > revenue. This is up from June 2024, which was $12,569,995 or 7.36%.
            </p>
          </div>
        </details>

        <!--
          Page 228, not page 17.

          The book's own "Fiscal Reserves" section runs #1, #3, #4 and skips
          #2, which reads on a page as a policy that went missing. It did not:
          #2 is the only one of the four with no dial to draw, because it is
          not a band to sit inside but what has to happen if the fund balance
          falls out of the bottom of #1's. The book states it in "Financial
          Reserve Policies" (page 228), which is where this is quoted from,
          label and all -- that page numbers them "Reserve Policy 2" where the
          reserves section writes "City Reserve Policy #2:", and the words on
          this site are the city's, so the label is the one printed over the
          sentence.

          It is the next of the four sections because it is #1's consequence:
          the floor it names is #1's own, and its indicator is #1's standing
          read the other way -- triggered exactly when #1 is not.
        -->
        <details class="group my-3 rounded-lg border border-slate-200">
          <summary
            class="not-prose flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-2 select-none [&::-webkit-details-marker]:hidden"
          >
            {@render summaryRow(FUND_BALANCE_FLOOR, undefined, policy2.ok, policy2.label)}
          </summary>

          <div class="border-t border-slate-100 px-3 pt-3 pb-1">
            <p>
              <strong>Reserve Policy 2:</strong> In the event that the city's undesignated
              <GlossaryTerm term="Fund">fund</GlossaryTerm> balance falls below 5% of
              <GlossaryTerm term="General Fund">general fund</GlossaryTerm>
              <GlossaryTerm term="Revenues">revenues</GlossaryTerm>, less debt exclusions and
              Chapter 70 Aid, (the "Fund Balance Floor"), a plan for specific expenditure reductions
              and/or revenue increases shall be submitted to the City Council during the next budget
              cycle.
            </p>
          </div>
        </details>

        <details class="group my-3 rounded-lg border border-slate-200">
          <summary
            class="not-prose flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-2 select-none [&::-webkit-details-marker]:hidden"
          >
            {@render summaryRow(bands[1].label, bands[1].actual.cell, policy3.ok, policy3.label)}
          </summary>

          <div class="border-t border-slate-100 px-3 pt-3 pb-1">
            <p>
              <strong>City Reserve Policy #3:</strong> The amount to be held in <GlossaryTerm
                term="Free Cash">free cash</GlossaryTerm
              > shall not be less than 2% or more than 8% of <GlossaryTerm term="General Fund"
                >general fund</GlossaryTerm
              >
              <GlossaryTerm term="Revenues">revenues</GlossaryTerm>, less debt exclusion and Ch. 70.
            </p>

            <p>
              <strong>Results:</strong> The city is projected to have a <GlossaryTerm
                term="Free Cash">free cash</GlossaryTerm
              > balance of $0 at the end of <GlossaryTerm term="Fiscal Year"
                >fiscal year</GlossaryTerm
              > 2026, largely due to exceptionally high snow removal costs that exceeded $4.6 million
              during the past winter. This winter was the coldest and snowiest the area has experienced
              since 2014-2015. In light of these unprecedented expenses, the Mayor and the city's Emergency
              Management Director have requested financial assistance from the Commonwealth. This year's
              <GlossaryTerm term="Free Cash">free cash</GlossaryTerm> balance marks a significant decrease
              from the city's balance at the end of <GlossaryTerm term="Fiscal Year"
                >fiscal year</GlossaryTerm
              > 2025, which was $2,578,279, reflecting a decline of 1.51%.
            </p>
          </div>
        </details>

        <details class="group my-3 rounded-lg border border-slate-200">
          <summary
            class="not-prose flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-2 select-none [&::-webkit-details-marker]:hidden"
          >
            {@render summaryRow(bands[2].label, bands[2].actual.cell, policy4.ok, policy4.label)}
          </summary>

          <div class="border-t border-slate-100 px-3 pt-3 pb-1">
            <p>
              <strong>City Reserve Policy #4:</strong> The city shall maintain a Stabilization <GlossaryTerm
                term="Reserve Fund">Reserve Fund</GlossaryTerm
              > of at least 3% of <GlossaryTerm term="General Fund">general fund</GlossaryTerm> revenue,
              less debt exclusion and Chapter 70.
            </p>

            <p>
              <strong>Results:</strong> The city's <GlossaryTerm term="Stabilization Fund"
                >stabilization fund</GlossaryTerm
              > is $8,001,094 or 4.49% of <GlossaryTerm term="General Fund"
                >general fund</GlossaryTerm
              > revenue, not including Chapter 70 and debt exclusions. This is up from fiscal 2025 which
              had a balance of $7,533,248 or 4.41%.
            </p>
          </div>
        </details>

        <BookReferences items={data.references} book={data.book} />
      </div>
    </div>
  </div>
</div>
