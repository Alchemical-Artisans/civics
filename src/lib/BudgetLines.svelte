<!--
  A few figures of a budget book followed across the years the book gives them
  for.

  A table of three columns is read one cell at a time, and the thing a reader
  wants out of it -- which way is this going, and by how much -- is arithmetic
  they have to do themselves. A line does it for them, and it is the one shape
  that holds a balance and the flows that moved it in the same picture without
  adding them up.

  The years belong to the chart, not to each series: every series gives one
  value per year and `null` where the book prints none, so two charts drawn from
  one table line up column for column even when one of them starts a year
  earlier. A null breaks the line rather than being drawn across.

  One scale per chart and never a second axis. Where a table holds figures of
  different sizes -- a quarter of a billion dollars of revenue against a fund
  balance of fourteen million -- that is two charts sharing a row of years, not
  one chart with two axes: two scales can be slid past each other until the
  lines cross wherever the person drawing them wanted, which is a drawing that
  can say anything.

  A point names and prices itself on hover or focus and carries the same as its
  accessible name, so every figure the book prints is reachable without a mouse.
-->
<script module lang="ts">
  export interface Series {
    /** The row, exactly as the book's table labels it. */
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
    /** The table's columns, which are the chart's x positions. */
    years: string[]
    rows: Series[]
  } = $props()

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  /** The two axis ends only, where a rounded figure is furniture rather than a
      quotation. Everything a reader is meant to read is printed whole. */
  const brief = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  })

  // A fixed viewBox scaled to whatever width the page gives it, so these are
  // the drawing's own units and not pixels.
  const WIDTH = 640
  const HEIGHT = 210
  const LEFT = 62
  // Room for half of the last year's label, which is centred under its point.
  const RIGHT = 26
  const TOP = 10
  const FOOT = 24

  const drawn = $derived(
    rows.flatMap((row) => row.values.filter((value): value is number => value !== null)),
  )

  /**
   * The band the lines are drawn in, which does not start at zero.
   *
   * A line chart is read for its shape, and a year's revenue moving from $231
   * million to $263 million against an axis that starts at nothing is a line
   * that never leaves the top of the plot. The figures at the two ends of the
   * axis are what say where the plot begins, which is why they are drawn
   * whatever else is.
   */
  const bounds = $derived.by(() => {
    const low = Math.min(...drawn)
    const high = Math.max(...drawn)
    const pad = (high - low) * 0.12 || Math.abs(high) * 0.1 || 1
    return { low: low - pad, high: high + pad }
  })

  const across = (at: number) =>
    years.length < 2
      ? LEFT + (WIDTH - LEFT - RIGHT) / 2
      : LEFT + (at * (WIDTH - LEFT - RIGHT)) / (years.length - 1)

  const up = (value: number) =>
    TOP + (1 - (value - bounds.low) / (bounds.high - bounds.low)) * (HEIGHT - TOP - FOOT)

  /**
   * Each series as the runs of years it actually has figures for.
   *
   * A run is one polyline. Splitting on the gaps rather than dropping them is
   * what keeps a line from being drawn straight through a year the book says
   * nothing about.
   */
  const series = $derived(
    rows.map((row, at) => {
      const runs: { year: number; value: number }[][] = []
      row.values.forEach((value, year) => {
        if (value === null) return runs.push([])
        ;(runs.at(-1) ?? runs[runs.push([]) - 1]).push({ year, value })
      })

      return {
        ...row,
        colour: COLOURS[at % COLOURS.length],
        runs: runs.filter((run) => run.length),
        points: row.values
          .map((value, year) => ({ value, year }))
          .filter((point): point is { value: number; year: number } => point.value !== null),
      }
    }),
  )

  /** The point under the pointer, or the one holding focus. */
  let active = $state<{ row: string; year: number } | null>(null)
  const shown = $derived.by(() => {
    const at = active
    if (!at) return null
    const row = series.find((line) => line.label === at.row)
    const point = row?.points.find((p) => p.year === at.year)
    return row && point ? { label: row.label, year: years[point.year], value: point.value } : null
  })

  /** Where the tooltip sits: over the point, measured against the drawing, and
      pulled back from either edge so it stays on the page. */
  let root = $state<HTMLElement | null>(null)
  let spot = $state({ x: 0, y: 0 })

  const TOOLTIP = 240

  const show = (row: string, year: number, mark: SVGElement) => {
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

<div class="budget-lines not-prose relative my-4" bind:this={root}>
  <!-- A legend whatever the count, because a line is told from its neighbour by
       colour and by nothing else. -->
  <ul class="m-0 mb-1 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-xs">
    {#each series as line (line.label)}
      <li class="flex items-center gap-1.5">
        <span class="inline-block h-0.5 w-4" style="background: {line.colour}"></span>
        <span class="text-slate-700">{line.label}</span>
      </li>
    {/each}
  </ul>

  <svg class="block h-auto w-full" viewBox="0 0 {WIDTH} {HEIGHT}" role="presentation">
    <!-- The two ends of the scale, drawn because the scale does not start at
         zero and a reader is owed the figures that say so. -->
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

    <!-- Zero, where the plot happens to contain it: a line crossing it has
         changed sign, which no shape on its own says. -->
    {#if bounds.low < 0 && bounds.high > 0}
      <line
        x1={LEFT}
        x2={WIDTH - RIGHT}
        y1={up(0)}
        y2={up(0)}
        stroke="#94a3b8"
        stroke-width="1"
        stroke-dasharray="3 3"
      />
      <text x={LEFT - 8} y={up(0) + 4} text-anchor="end" font-size="11" fill="#64748b">$0</text>
    {/if}

    {#each years as year, at (year)}
      <text x={across(at)} y={HEIGHT - 6} text-anchor="middle" font-size="11" fill="#475569">
        {year}
      </text>
    {/each}

    {#each series as line (line.label)}
      {#each line.runs as run, at (at)}
        <polyline
          points={run.map((point) => `${across(point.year)},${up(point.value)}`).join(" ")}
          fill="none"
          stroke={line.colour}
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      {/each}

      {#each line.points as point (point.year)}
        <!--
          Focusable and named, because a chart a mouse can read and a keyboard
          cannot is a chart half the readers cannot read. The white ring is what
          keeps two marks apart where two lines cross.
        -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <circle
          class="cursor-default outline-none"
          cx={across(point.year)}
          cy={up(point.value)}
          r={active && active.row === line.label && active.year === point.year ? 5.5 : 4}
          fill={line.colour}
          stroke="#ffffff"
          stroke-width="2"
          role="img"
          aria-label="{line.label}, {years[point.year]}, {money.format(point.value)}"
          tabindex="0"
          onpointerenter={(event) => show(line.label, point.year, event.currentTarget)}
          onpointerleave={() => (active = null)}
          onfocus={(event) => show(line.label, point.year, event.currentTarget)}
          onblur={() => (active = null)}
        />
      {/each}
    {/each}
  </svg>

  {#if shown}
    <!-- Over the point it belongs to. Hidden from assistive technology, because
         the point already carries all of it as its name. -->
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
