<!--
  A year's figures as one column each, drawn from a zero line: what is worth
  something above it, what is owed against it below.

  Bars rather than lines where the figures are not a trend but a standing
  position at each year's close. A line drawn through four balances invites the
  eye to read the slope between them as though something happened along the way;
  a bar says only what the figure was, which is all the book claims.

  Positive and negative are the same column, stacked away from zero in the
  direction of their sign, so a column's whole span is the distance between the
  best and worst of what it holds. Nothing is added up: the parts of a column
  are not necessarily parts of one total, and a stack is only drawn so that two
  figures about one year can share a place on the page.

  From zero always, and the zero line is drawn. A bar's meaning is its length,
  so a bar chart that begins somewhere else is a bar chart that lies -- unlike a
  line, which is read for its shape and may begin where it likes.

  The frame is `chart-frame.ts`, shared with the line chart, so a year is in the
  same place in both and a reader can look straight down from one to the other.
-->
<script module lang="ts">
  export interface Series {
    /** The row, as the book's own table labels it. */
    label: string
    /** One value per year, `null` where the book gives none. */
    values: (number | null)[]
  }
</script>

<script lang="ts">
  import { COLOURS } from "$lib/chart-colours"
  import { WIDTH, HEIGHT, LEFT, RIGHT, TOP, FOOT, bandCentre, bandWidth } from "$lib/chart-frame"

  let {
    years,
    rows,
  }: {
    /** The table's columns, which are the chart's bands. */
    years: string[]
    rows: Series[]
  } = $props()

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  /** The two ends of the scale only, where a rounded figure is furniture. */
  const brief = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  })

  const drawn = $derived(
    rows.flatMap((row) => row.values.filter((value): value is number => value !== null)),
  )

  /** Zero is in the band whatever the figures do, because the bars start there. */
  const bounds = $derived.by(() => {
    const low = Math.min(...drawn, 0)
    const high = Math.max(...drawn, 0)
    const pad = (high - low) * 0.08 || 1
    return { low: low - pad, high: high + pad }
  })

  const up = (value: number) =>
    TOP + (1 - (value - bounds.low) / (bounds.high - bounds.low)) * (HEIGHT - TOP - FOOT)

  /** Wide enough to read, narrow enough to leave air between one year and the
      next: a column is one figure, and the width past that says nothing. */
  const width = $derived(Math.min(56, bandWidth(years.length) * 0.42))

  /**
   * Every segment the chart draws, placed.
   *
   * A year's positives stack up from zero in the order the rows are given and
   * its negatives stack down, so a row keeps its colour and its side whatever
   * the sign of any one year -- the encumbrances are a small positive in one
   * year of three and a large negative in another, and the column has to stay
   * readable either way.
   */
  const columns = $derived(
    years.map((year, at) => {
      let above = 0
      let below = 0

      const parts = rows.flatMap((row, index) => {
        const value = row.values[at]
        if (value === null || value === 0) return []

        const from = value > 0 ? above : below
        const to = from + value
        if (value > 0) above = to
        else below = to

        return [
          {
            label: row.label,
            value,
            colour: COLOURS[index % COLOURS.length],
            top: up(Math.max(from, to)),
            depth: Math.abs(up(to) - up(from)),
          },
        ]
      })

      return { year, at, left: bandCentre(at, years.length) - width / 2, parts }
    }),
  )

  /** The segment under the pointer, or the one holding focus. */
  let active = $state<{ row: string; year: string } | null>(null)
  const shown = $derived.by(() => {
    const at = active
    if (!at) return null
    const column = columns.find((c) => c.year === at.year)
    const part = column?.parts.find((p) => p.label === at.row)
    return part ? { ...part, year: at.year } : null
  })

  /** Full strength unless the other figure for the same year has the pointer:
      the two are about one year, and dimming the year's other half is what
      says which of them the tooltip is naming. */
  const lit = (row: string, year: string) =>
    active === null || active.year !== year || active.row === row

  /** Where the tooltip sits: over the segment, measured against the drawing,
      and pulled back from either edge so it stays on the page. */
  let root = $state<HTMLElement | null>(null)
  let spot = $state({ x: 0, y: 0 })

  const TOOLTIP = 240

  const show = (row: string, year: string, mark: SVGElement) => {
    active = { row, year }
    if (!root) return

    const edge = root.getBoundingClientRect()
    const box = mark.getBoundingClientRect()
    const half = Math.min(TOOLTIP, edge.width) / 2

    spot = {
      x: Math.min(
        Math.max(box.left + box.width / 2 - edge.left, half),
        Math.max(edge.width - half, half),
      ),
      y: box.top - edge.top,
    }
  }
</script>

<div class="budget-bars not-prose relative my-4" bind:this={root}>
  <!-- A legend whatever the count, because one bar is told from the one under
       it by colour and by nothing else. -->
  <ul class="m-0 mb-1 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-xs">
    {#each rows as row, at (row.label)}
      <li class="flex items-center gap-1.5">
        <span class="inline-block h-2.5 w-2.5" style="background: {COLOURS[at % COLOURS.length]}"
        ></span>
        <span class="text-slate-700">{row.label}</span>
      </li>
    {/each}
  </ul>

  <svg class="block h-auto w-full" viewBox="0 0 {WIDTH} {HEIGHT}" role="presentation">
    {#each [bounds.high, bounds.low] as edge (edge)}
      <line
        x1={LEFT}
        x2={WIDTH - RIGHT}
        y1={up(edge)}
        y2={up(edge)}
        stroke="#e2e8f0"
        stroke-width="1"
      />
      <text x={LEFT - 8} y={up(edge) + 4} text-anchor="end" font-size="11" fill="#64748b">
        {brief.format(edge)}
      </text>
    {/each}

    {#each columns as column (column.year)}
      {#each column.parts as part (part.label)}
        <!--
          Focusable and named, because a chart a mouse can read and a keyboard
          cannot is a chart half the readers cannot read.
        -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <rect
          class="cursor-default transition-opacity outline-none"
          x={column.left}
          y={part.top}
          {width}
          height={Math.max(part.depth, 1)}
          fill={part.colour}
          opacity={lit(part.label, column.year) ? 1 : 0.4}
          role="img"
          aria-label="{part.label}, {column.year}, {money.format(part.value)}"
          tabindex="0"
          onpointerenter={(event) => show(part.label, column.year, event.currentTarget)}
          onpointerleave={() => (active = null)}
          onfocus={(event) => show(part.label, column.year, event.currentTarget)}
          onblur={() => (active = null)}
        />
      {/each}
    {/each}

    <!-- Zero last, so it is drawn over the bars that stand on it: it is the
         line every one of them is measured from. -->
    <line x1={LEFT} x2={WIDTH - RIGHT} y1={up(0)} y2={up(0)} stroke="#475569" stroke-width="1" />
    <text x={LEFT - 8} y={up(0) + 4} text-anchor="end" font-size="11" fill="#64748b">$0</text>

    {#each years as year, at (year)}
      <text
        x={bandCentre(at, years.length)}
        y={HEIGHT - 6}
        text-anchor="middle"
        font-size="11"
        fill="#475569"
      >
        {year}
      </text>
    {/each}
  </svg>

  {#if shown}
    <!-- Over the segment it belongs to. Hidden from assistive technology,
         because the segment already carries all of it as its name. -->
    <div
      class="budget-tooltip pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-white/95 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md ring-1 ring-slate-200"
      style="left: {spot.x}px; top: {spot.y - 6}px"
      aria-hidden="true"
    >
      <span class="block font-medium text-slate-900">{shown.label}</span>
      <span class="block text-slate-600 tabular-nums">
        {shown.year} &middot; {money.format(shown.value)}
      </span>
    </div>
  {/if}
</div>
