<script lang="ts">
  // A script here for the same reason as reserves': LONG_TERM_DEBT is also a
  // bar on the book's front page, and the three tables below are what this
  // page's own charts read from, so a figure transcribed once cannot come
  // back different in a chart.
  import BookReferences from "$lib/BookReferences.svelte"
  import GlossaryTerm from "$lib/GlossaryTerm.svelte"
  import { Router } from "$lib/router"
  import { cell, column, sum } from "$lib/budget-table"
  import { LONG_TERM_DEBT, DEBT_POLICIES } from "./tables"
  import { COLOURS } from "$lib/chart-colours"
  // The same offline icons reserves uses for the same mark.
  import Icon from "@iconify/svelte/dist/OfflineIcon.svelte"
  import checkCircle from "@iconify-icons/material-symbols/check-circle-rounded"
  import warning from "@iconify-icons/material-symbols/warning-rounded"

  let { data } = $props()

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
  const share = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  /**
   * Page 21's list, as one bar standing on end rather than lying flat -- the
   * same rail-and-segments idea `BudgetStack` draws for the front page's
   * "Reserves and Debt", turned vertical to sit in the narrow left column
   * `BudgetBands` sits in on `reserves`. Largest first and drawn from the
   * foot up, the way a bar's meaning is its length whichever way it runs.
   */
  const compositionTotal = sum(column(LONG_TERM_DEBT, "Amount"))
  const composition = column(LONG_TERM_DEBT, "Amount")
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .map((part, at) => ({ ...part, colour: COLOURS[at % COLOURS.length] }))

  /** The segment under the pointer, or the one holding focus -- the same
      pattern every chart on this site names itself by. */
  let active = $state<string | null>(null)
  const shown = $derived(composition.find((part) => part.label === active) ?? null)

  /** Centred on the segment, the way `BudgetBands`' tooltip is on a column
      that runs the full height of the chart rather than pinned above it. */
  let root = $state<HTMLElement | null>(null)
  let spot = $state({ x: 0, y: 0 })

  const TOOLTIP = 200

  const show = (label: string, segment: HTMLElement) => {
    active = label
    if (!root) return

    const edge = root.getBoundingClientRect()
    const box = segment.getBoundingClientRect()
    const half = Math.min(TOOLTIP, edge.width) / 2

    spot = {
      x: Math.min(
        Math.max(box.left + box.width / 2 - edge.left, half),
        Math.max(edge.width - half, half),
      ),
      y: box.top + box.height / 2 - edge.top,
    }
  }

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

  /** Page 23 in full: the two S&P quotes the book prints there. A card that
      opens the page they're on is a truer transcription of a rating agency's
      own words than a copy of them would be, and it is a fifth of the
      reading this page used to carry for a section that answers none of the
      three policies. */
  const bondRatingHref = $derived(Router.pdfPage(data.book.budget!, 23))
</script>

<!--
  Laid out as `reserves` is: charts down the left and the reading in the only
  box that scrolls -- see that page for the full account of why. This page's
  three policies never share one base the way the three reserve dials share
  general fund revenue -- a percentage of equalized valuation, of general fund
  revenue, of the debt itself -- so there is still no `BudgetBands` dial chart
  here; what a reader gets from the collapsed sections on the right is whether
  each policy is being kept, the same question `reserves` answers with a
  chart. Three policies, not four -- the book states Policy #1, #2a and #2b,
  and there is no #2 of its own the way reserves' #2 is a use for the label.
-->
<div class="lg:grid lg:h-[calc(100vh-221px)] lg:grid-cols-[max-content_minmax(0,1fr)] lg:gap-x-10">
  <!--
    What the debt is made of, standing on end in the narrow column
    `BudgetBands` occupies on `reserves` -- a composition rather than a
    policy, so it is a single bar in parts rather than a set of them, but the
    same idea: a rail run vertically, each figure named and priced on hover
    or focus, and nothing printed until then. Its own name is the one thing
    always on the page, the way a `BudgetBands` column keeps its fund's name
    under the rail.
  -->
  <div class="lg:h-full">
    <div
      class="budget-debt-bar not-prose relative flex h-full flex-col items-center"
      bind:this={root}
    >
      <div
        class="flex min-h-64 w-20 flex-1 flex-col-reverse gap-0.5 overflow-hidden rounded-sm bg-slate-100"
      >
        {#each composition as part (part.label)}
          <!--
            Focusable and named, the same as every segment on this site: a
            picture of one figure, reachable without a mouse.
          -->
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <div
            class="cursor-default transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-inset"
            style="height: {(part.amount / compositionTotal) *
              100}%; background: {part.colour}; opacity: {active === null || active === part.label
              ? 1
              : 0.4}"
            role="img"
            aria-label="{part.label}, {money.format(part.amount)}, {share.format(
              part.amount / compositionTotal,
            )}"
            tabindex="0"
            onpointerenter={(event) => show(part.label, event.currentTarget)}
            onpointerleave={() => (active = null)}
            onfocus={(event) => show(part.label, event.currentTarget)}
            onblur={() => (active = null)}
          ></div>
        {/each}
      </div>

      <p class="m-0 mt-2 text-center text-sm font-semibold text-slate-900">Long Term Debt</p>

      {#if shown}
        <!-- Over the segment it belongs to. Hidden from assistive technology,
             because the segment already carries all of it as its name. -->
        <div
          class="budget-tooltip pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/95 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md ring-1 ring-slate-200"
          style="left: {spot.x}px; top: {spot.y}px"
          aria-hidden="true"
        >
          <span class="block font-medium text-slate-900">{shown.label}</span>
          <span class="block text-slate-600 tabular-nums">
            {money.format(shown.amount)} &middot; {share.format(shown.amount / compositionTotal)}
          </span>
        </div>
      {/if}
    </div>
  </div>

  <div class="lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
    <!--
      Page 22's payments and page 25's per-capita comparison were two lines
      here, both trends across several years -- cut along with the rest of
      the site's history and forecasts, since this page describes 2027's own
      debt, not the years either side of it. What is left of the three is one
      card, not a row: the bond rating, this year's own single fact rather
      than a shape.
    -->
    <div class="flex">
      <!--
        Page 23 is two S&P quotes and nothing to chart, so it is a card
        rather than a line -- the rating itself, which is the one fact of
        the page worth a reader's first look, and a link to the page those
        quotes are on rather than a copy of them. A reader who wants the
        words S&P actually used gets them from S&P, in the city's own file,
        rather than from a second copy of them here that could drift from
        the first.
      -->
      <a
        href={bondRatingHref}
        target="_blank"
        rel="external noopener noreferrer"
        class="not-prose flex w-48 flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 px-4 py-6 text-center text-inherit no-underline transition-colors hover:border-slate-400"
      >
        <span class="text-xs font-medium text-slate-500">Bond Rating</span>
        <span class="text-4xl font-bold text-slate-900">AA</span>
        <span class="text-xs text-slate-500">S&amp;P Global Ratings April 1, 2026</span>
        <span class="sr-only">, in the city's PDF, opens in a new tab</span>
      </a>
    </div>

    <!-- The one thing on this page that scrolls; see `reserves` for why the
         wrapper is `relative` and the reading keeps its own measure. -->
    <div class="lg:relative lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
      <div class="max-w-3xl">
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
          <span class="text-xs font-medium text-slate-500 tabular-nums">Policy #{number}</span>
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

        <BookReferences items={data.references} book={data.book} />
      </div>
    </div>
  </div>
</div>
