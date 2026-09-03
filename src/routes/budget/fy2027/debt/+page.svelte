<script lang="ts">
  // A script here for the same reason as reserves': LONG_TERM_DEBT is also a
  // bar on the book's front page, and the three tables below are what this
  // page's own charts read from, so a figure transcribed once cannot come
  // back different in a chart.
  import BudgetStack from "$lib/BudgetStack.svelte"
  import BudgetLines from "$lib/BudgetLines.svelte"
  import BookReferences from "$lib/BookReferences.svelte"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  import { amount, cell, column } from "$lib/budget-table"
  import { LONG_TERM_DEBT, ANNUAL_DEBT_PAYMENTS, DEBT_PER_CAPITA, DEBT_POLICIES } from "./tables"
  // The same offline icons reserves uses for the same mark.
  import Icon from "@iconify/svelte/dist/OfflineIcon.svelte"
  import checkCircle from "@iconify-icons/material-symbols/check-circle-rounded"
  import warning from "@iconify-icons/material-symbols/warning-rounded"

  let { data } = $props()

  /** Page 21's bar, as `BudgetStack` takes it -- one row, since this chart
      draws what the debt is made of rather than holding two bars against
      each other the way the front page's "Reserves and Debt" does. */
  const composition = [{ label: "Long Term Debt", parts: column(LONG_TERM_DEBT, "Amount") }]

  /** Page 22's payments, on their own scale: a quarter of a billion dollars
      of revenue and single-digit millions of debt service were never going
      to share one, and `BudgetLines` says as much in its own header comment.
      The revenue and the row for their share stay in `tables.ts` as the
      transcription and are what the policy's own "Results" paragraph
      quotes. */
  const paymentYears = ANNUAL_DEBT_PAYMENTS.columns.slice(1)
  const payments = [
    {
      label: "Annual Debt Payments",
      values: paymentYears.map((year) =>
        amount(cell(ANNUAL_DEBT_PAYMENTS, "Annual Debt Payments", year)),
      ),
    },
  ]

  /** Page 25's comparison, both series in the same units and so on the one
      scale `BudgetLines` insists on -- which is the whole point of the
      book's own chart here, holding the city against the state. */
  const capitaYears = DEBT_PER_CAPITA.rows.map((row) => row.label)
  const perCapita = ["Haverhill", "State Average"].map((series) => ({
    label: series,
    values: capitaYears.map((year) => amount(cell(DEBT_PER_CAPITA, year, series))),
  }))

  /**
   * Whether the city is inside a policy's limit, told the same two ways
   * `reserves`' own `standing` tells a fund's: "Within policy" when it is,
   * and which of the two ways it is not when it is not. Debt's three
   * policies never set both a floor and a ceiling the way a reserve can, so
   * these are two narrower functions rather than the one reserves needs.
   */
  type Standing = { ok: boolean; label: string }

  const ceiling = (limit: number, actual: number): Standing =>
    actual > limit ? { ok: false, label: "Above ceiling" } : { ok: true, label: "Within policy" }

  /** Policy #3 sets a floor, not a ceiling -- a minimum share of debt that
      has to be gone within ten years -- so it fails the other way a limit
      can: by falling short rather than running over. */
  const floor = (limit: number, actual: number): Standing =>
    actual < limit ? { ok: false, label: "Below floor" } : { ok: true, label: "Within policy" }

  /** A cell here is a bare percentage, "5%", and `amount` is built to read a
      dollar figure out of a cell -- see `tables.ts`. This reads the other
      kind. */
  const percent = (value: string) => Number(value.replace("%", ""))

  const point = (row: string) => ({
    limit: percent(cell(DEBT_POLICIES, row, "Limit")),
    actual: percent(cell(DEBT_POLICIES, row, "Actual")),
    actualCell: cell(DEBT_POLICIES, row, "Actual"),
  })

  const longTermDebt = point("Long Term Debt")
  const annualDebtPayments = point("Annual Debt Payments")
  const retiringDebt = point("Retiring Debt")

  const policy1 = ceiling(longTermDebt.limit, longTermDebt.actual)
  const policy2 = ceiling(annualDebtPayments.limit, annualDebtPayments.actual)
  const policy3 = floor(retiringDebt.limit, retiringDebt.actual)
</script>

<!--
  Laid out as `reserves` is: charts down the left and the reading in the only
  box that scrolls -- see that page for the full account of why. This page's
  three policies never share one base the way the three reserve dials share
  general fund revenue, so there is no single dial chart here; what a reader
  gets from the left column instead is what the debt is made of and how it has
  moved, and what a reader gets from the collapsed sections on the right is
  whether each policy is being kept, the same question reserves answers with a
  chart. Three policies, not four -- the book states Policy #1, #2a and #2b,
  and there is no #2 of its own the way reserves' #2 is a use for the label.
-->
<div class="lg:grid lg:h-[calc(100vh-181px)] lg:grid-cols-[24rem_minmax(0,1fr)] lg:gap-x-10">
  <!--
    Three charts stacked rather than reserves' three narrow columns, because
    none of these is shaped like a bullet column the way a reserve's floor
    and ceiling are -- a composition is one bar, and a trend is a line, and
    forcing either into `BudgetBands` would mean giving it a "minimum" or
    "maximum" the book never actually prints, which is inventing a figure
    rather than drawing one. Nothing heads any of them: the composition bar
    carries its own name, and each line chart's legend carries its series'.
  -->
  <div class="lg:flex lg:h-full lg:flex-col lg:justify-center lg:gap-6">
    <BudgetStack rows={composition} />
    <BudgetLines years={paymentYears} rows={payments} />
    <BudgetLines years={capitaYears} rows={perCapita} />
  </div>

  <div class="lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
    <!-- The one thing on this page that scrolls; see `reserves` for why the
         wrapper is `relative` and the reading keeps its own measure. -->
    <div class="lg:relative lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
      <div class="max-w-3xl">
        <p>
          <em>The city will evaluate debt limits per state statute and the city's debt policies.</em
          >
        </p>

        <!--
          Three policies, three collapsed sections, closed until asked for --
          the same treatment `reserves` gives its four, and the same reasons:
          a policy's standing is the first thing a reader wants, not a
          paragraph to search for a percentage in. Each summary carries its
          own "Policy #", 1 through 3, in the same voice reserves' four use;
          the book's own numbering ("City Debt Policy #1", "#2a", "#2b")
          stays out of the quoted paragraph below for the same reason it
          stays out of reserves' -- the reader wants one running count while
          comparing sections, not a label chosen for a different purpose.
        -->
        {#snippet summaryRow(
          number: number,
          name: string,
          figure: string,
          ok: boolean,
          label: string,
        )}
          <span class="text-xs font-medium text-slate-400 tabular-nums">Policy #{number}</span>
          <h2 class="m-0 flex-1 text-sm font-semibold text-slate-900">{name}</h2>
          <span class="font-normal text-slate-600 tabular-nums">{figure}</span>
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
            {@render summaryRow(
              1,
              "Long Term Debt",
              longTermDebt.actualCell,
              policy1.ok,
              policy1.label,
            )}
          </summary>

          <div class="border-t border-slate-100 px-3 pt-3 pb-1">
            <p>
              In accordance with MGL c.58 s.10c, debt shall not exceed 5% of the city's equalized
              <GlossaryTerm term="Valuation">valuation</GlossaryTerm>.
            </p>

            <p>
              <strong>Results:</strong> The city's total outstanding debt at the conclusion of 2027
              will be 1.5% of the city's equalized <GlossaryTerm term="Valuation"
                >valuation</GlossaryTerm
              >. This translates into $175,745,444 in outstanding bonds.
            </p>
          </div>
        </details>

        <details class="group my-3 rounded-lg border border-slate-200">
          <summary
            class="not-prose flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-2 select-none [&::-webkit-details-marker]:hidden"
          >
            {@render summaryRow(
              2,
              "Annual Debt Payments",
              annualDebtPayments.actualCell,
              policy2.ok,
              policy2.label,
            )}
          </summary>

          <div class="border-t border-slate-100 px-3 pt-3 pb-1">
            <p>
              Annual <GlossaryTerm term="General Fund">general fund</GlossaryTerm>
              <GlossaryTerm term="Debt Service">debt service</GlossaryTerm> payments shall not exceed
              4% of net <GlossaryTerm term="General Fund">general fund</GlossaryTerm> operating revenue.
            </p>

            <p>
              <strong>Results:</strong>
              <GlossaryTerm term="Debt Service">Debt service</GlossaryTerm> has remained well below the
              city's 4% benchmark, with 2027 debt payments expected to continue at 3.1% of <GlossaryTerm
                term="General Fund">general fund</GlossaryTerm
              > revenue. Going forward, the city's current debt payments will decline by 2&ndash;3% annually
              until 2044, when the first Consentino School construction bond retires.
            </p>

            <p>
              <em>
                The city recently issued $20,470,000 in tax-exempt general obligation debt with a
                true interest cost (TIC) of 3.34%, supported by the city's AA bond rating, which was
                recently reaffirmed by S&amp;P Global. The debt financed the replacement turf field
                at the stadium, improvements to the drainage on Locke Street, upgrades to two water
                booster pumping stations, and engineering costs for constructing a new drinking
                water source. This new debt is included in the debt payment listed below and in the
                total outstanding debt shown on the previous page.
              </em>
            </p>
          </div>
        </details>

        <h2>Bond Rating</h2>

        <p>The city's bond rating was reaffirmed with "AA"</p>

        <blockquote>
          <p>
            "Haverhill's creditworthiness is characterized by the city's stable local economy, along
            with robust budgeting practices and long-term planning that we believe are generally
            stronger than those of similarly rated state peers and will continue to support balanced
            operations despite pressures from unfunded retirement liabilities. Although available
            reserves are below those of similarly rated peers, the city has maintained them at
            consistent levels over the past few years. Nevertheless, we believe Haverhill's reserves
            and large pension and other postemployment benefit (OPEB) liabilities remain an upward
            limiting factor for the rating."
          </p>
        </blockquote>

        <p>The rating further reflects our view of Haverhill's:</p>

        <blockquote>
          <p>
            <em>
              "Stable local economy, characterized by income indicators that are above the national
              level but below those of Essex County, although we expect the city's economic growth
              will continue. The local economy will likely continue to expand, along with the tax
              base. In addition to local economic opportunities, residents have access to the
              broader Boston metropolitan statistical area."
            </em>
          </p>
          <p>
            <em>
              "Comprehensive budgeting practices and planning that include conservative budgeting
              assumptions, monthly budget-to-actuals reporting, a five-year capital improvement
              plan, and long-range revenue and expenditure forecasting, as well as a formal reserve
              and debt management policy."
            </em>
          </p>
        </blockquote>

        <p>S&amp;P Global Ratings April 1, 2026</p>

        <!--
          "Retiring Debt by Major Function", an area chart running 2026 to
          2037 across five bands -- City, City / Sewer, School, Sewer, Water.
          Only the axes carry numbers, so there are no figures on it to
          transcribe or chart.
        -->
        <details class="group my-3 rounded-lg border border-slate-200">
          <summary
            class="not-prose flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-2 select-none [&::-webkit-details-marker]:hidden"
          >
            {@render summaryRow(
              3,
              "Retiring Debt",
              retiringDebt.actualCell,
              policy3.ok,
              policy3.label,
            )}
          </summary>

          <div class="border-t border-slate-100 px-3 pt-3 pb-1">
            <p>65% of all debt shall retire at the end of 10 years.</p>

            <p>
              <strong>Results:</strong> The city is not currently on track to achieve this financial benchmark.
              At the end of 10 years, the city will have retired 59% of its current outstanding debt.
              However, because borrowing costs have declined significantly over the past several years,
              extending debt over longer periods has become less costly. In addition, while this approach
              differs from the philosophy of rapidly declining debt, aligning the repayment period with
              the useful life of the asset is considered a prudent fiscal practice.
            </p>
          </div>
        </details>

        <h2>Debt Comparison to State Average</h2>

        <p>
          <em>
            Haverhill's debt per capita has historically remained below the state average. It
            increased in 2026 with the addition of the Consentino debt. As of now, the state's 2026
            average has not been reported in the DLS databank; therefore, the chart below uses an
            estimate.
          </em>
        </p>

        <BookReferences items={data.references} book={data.book} />
      </div>
    </div>
  </div>
</div>
