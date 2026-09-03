<!--
  A year's figures as one row each, run off a zero line: what is worth
  something to the right of it, what is owed against it to the left.

  Bars rather than lines where the figures are not a trend but a standing
  position at each year's close. A line drawn through four balances invites the
  eye to read the slope between them as though something happened along the
  way; a bar says only what the figure was, which is all the book claims.

  Rows rather than columns because the chart sits beside its own reading now,
  in a column that is wide and short rather than narrow and tall -- four years
  stacked as rows fit that shape, four side by side would not.

  Nothing is stacked. A stack claims its parts add up to the row, and the rows
  of a table like this are a figure and the things that moved it -- the figure
  is already net of them, so stacking would draw the same money twice and put
  the end of the row at a total no document states. Every bar starts at zero
  and runs the way its sign points; the first series is the full thickness of
  its row, and each series after it is thinner and drawn in front, so a smaller
  figure is read against the one behind rather than added to it.

  From zero always, and the zero line is drawn. A bar's meaning is its length,
  so a bar chart that begins somewhere else is a bar chart that lies -- unlike a
  line, which is read for its shape and may begin where it likes.
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

  let {
    years,
    rows,
  }: {
    /** The table's rows here, top to bottom -- the chart's own bands. */
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

  /**
   * A fixed viewBox scaled to whatever width the page gives it, so these are
   * the drawing's own units and not pixels. Wide and short, unlike the frame
   * `BudgetLines` shares across two charts on a page -- this is the only chart
   * on its own, drawn beside its reading rather than above it, and the years
   * are rows rather than columns because that is the shape that leaves.
   */
  const WIDTH = 640
  const HEIGHT = 75
  /** Room at the left for the year each row is. */
  const LEFT = 28
  const RIGHT = 10
  const TOP = 5
  /** Room under the plot for the figures at the ends of the scale. */
  const BOTTOM = 11

  const x = (value: number) =>
    LEFT + ((value - bounds.low) / (bounds.high - bounds.low)) * (WIDTH - LEFT - RIGHT)

  const rowHeight = (count: number) => (HEIGHT - TOP - BOTTOM) / Math.max(count, 1)
  const rowCentre = (at: number, count: number) => TOP + (at + 0.5) * rowHeight(count)

  /** The thickest bar in a row: thick enough to read, thin enough to leave air
      between one year and the next. Series after the first are drawn thinner
      than this, in front. */
  const thickness = $derived(Math.min(18, rowHeight(years.length) * 0.45))

  /**
   * Every bar the chart draws, placed.
   *
   * Every one starts at zero and runs in the direction of its sign. They are
   * not stacked, because a stack claims its parts add up to the row and these
   * do not: the rows of a table like page 18's are a figure and the things
   * that moved it, and the figure is already net of them. Stacking one on the
   * other would draw the same money twice and put the end of the row at a
   * total no document states.
   *
   * So they overlap instead. The first series is the thickness of the row and
   * is drawn first; each series after it is thinner and drawn in front,
   * centred, so a smaller figure is read against the one behind it rather than
   * beside it or on top of it. Where a sign puts a bar the other side of the
   * line there is nothing to be in front of, and it simply hangs to the left.
   *
   * Series are given headline first, which is why they narrow in that order:
   * the thickest bar is the figure the row is about, and its end is that
   * figure.
   */
  const bands = $derived(
    years.map((year, at) => {
      const parts = rows.flatMap((row, index) => {
        const value = row.values[at]
        if (value === null || value === 0) return []

        const bar = thickness * Math.pow(0.45, index)

        // Never thinner than a mark that can be seen. $97,098 against a scale
        // of twenty million is a third of a pixel, and this is a focus target
        // as well as a drawing. Nothing at all is drawn for $0, which has no
        // honest length. The rounding it costs is spent at the far end: the
        // bar is hung off the zero line, so what a reader measures it from is
        // exact whatever the clamp does to the other end.
        const span = Math.max(Math.abs(x(value) - x(0)), 2)

        return [
          {
            label: row.label,
            value,
            colour: COLOURS[index % COLOURS.length],
            left: value > 0 ? x(0) : x(0) - span,
            span,
            top: rowCentre(at, years.length) - bar / 2,
            thickness: bar,
          },
        ]
      })

      return { year, at, parts }
    }),
  )

  /** The segment under the pointer, or the one holding focus. */
  let active = $state<{ row: string; year: string } | null>(null)
  const shown = $derived.by(() => {
    const at = active
    if (!at) return null
    const band = bands.find((b) => b.year === at.year)
    const part = band?.parts.find((p) => p.label === at.row)
    return part ? { ...part, year: at.year } : null
  })

  /** Full strength unless the other figure for the same year has the pointer:
      the two are about one year, and dimming the year's other half is what
      says which of them the tooltip is naming. */
  const lit = (row: string, year: string) =>
    active === null || active.year !== year || active.row === row

  /** Where the tooltip sits: over the bar's centre, measured against the
      drawing, and pulled back from either edge so it stays on the page.
      Centred rather than pinned above, unlike the column chart this used to
      be -- a row near the top of a short, wide chart has nowhere above it to
      pin a tooltip to. */
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
      y: box.top + box.height / 2 - edge.top,
    }
  }
</script>

<div class="budget-bars not-prose relative" bind:this={root}>
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
        x1={x(edge)}
        x2={x(edge)}
        y1={TOP}
        y2={HEIGHT - BOTTOM}
        stroke="#e2e8f0"
        stroke-width="1"
      />
      <!-- Anchored inward from its own gridline rather than centred on it, so
           the figure at either end of the scale stays inside the viewBox
           instead of running off the edge the way a centred label at the
           rightmost line would. -->
      <text
        x={x(edge)}
        y={HEIGHT - 3}
        text-anchor={edge === bounds.high ? "end" : "start"}
        font-size="7"
        fill="#64748b"
      >
        {brief.format(edge)}
      </text>
    {/each}

    {#each bands as band (band.year)}
      {#each band.parts as part (part.label)}
        <!--
          Focusable and named, because a chart a mouse can read and a keyboard
          cannot is a chart half the readers cannot read.
        -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <rect
          class="cursor-default transition-opacity outline-none"
          x={part.left}
          y={part.top}
          width={part.span}
          height={part.thickness}
          fill={part.colour}
          opacity={lit(part.label, band.year) ? 1 : 0.4}
          role="img"
          aria-label="{part.label}, {band.year}, {money.format(part.value)}"
          tabindex="0"
          onpointerenter={(event) => show(part.label, band.year, event.currentTarget)}
          onpointerleave={() => (active = null)}
          onfocus={(event) => show(part.label, band.year, event.currentTarget)}
          onblur={() => (active = null)}
        />
      {/each}
    {/each}

    <!-- Zero last, so it is drawn over the bars that stand on it: it is the
         line every one of them is measured from. -->
    <line x1={x(0)} x2={x(0)} y1={TOP} y2={HEIGHT - BOTTOM} stroke="#475569" stroke-width="1" />
    <text x={x(0)} y={HEIGHT - 3} text-anchor="middle" font-size="7" fill="#64748b">$0</text>

    {#each years as year, at (year)}
      <text
        x={LEFT - 5}
        y={rowCentre(at, years.length) + 2.5}
        text-anchor="end"
        font-size="7"
        fill="#475569"
      >
        {year}
      </text>
    {/each}
  </svg>

  {#if shown}
    <!-- Over the bar it belongs to. Hidden from assistive technology, because
         the bar already carries all of it as its name. -->
    <div
      class="budget-tooltip pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/95 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md ring-1 ring-slate-200"
      style="left: {spot.x}px; top: {spot.y}px"
      aria-hidden="true"
    >
      <span class="block font-medium text-slate-900">{shown.label}</span>
      <span class="block text-slate-600 tabular-nums">
        {shown.year} &middot; {money.format(shown.value)}
      </span>
    </div>
  {/if}
</div>
