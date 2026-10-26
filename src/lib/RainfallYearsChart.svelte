<!--
  Four years of Haverhill's rainfall accumulating across the calendar, one
  line each, against the 1991-2020 normal.

  Cumulative rather than each week's own amount: four jagged weekly-total
  lines laid over one axis read as noise, where four accumulating curves
  show the one thing the page is asking -- where in the year a dry year
  falls behind, and by how much. A week's own inches are still on the
  readout, so nothing the aggregation did is hidden.

  The current year's line simply stops at the last day a gauge read it.
  That needs no caveat on a cumulative chart: the x axis is the date, so a
  line ending in October reads as a year not finished rather than a year
  that stopped raining.

  Colour runs oldest to newest through the site's own palette, with the
  current year in the orange `drought-colours.ts` builds its stage ramp on
  -- the drought year drawn in the drought hue -- and a heavier stroke,
  since it is the line the other three are here to be compared against.
  The normal is slate and dashed: a reference, not a fifth year.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"
  import {
    type PrecipitationWeek,
    type PrecipitationYear,
    longDate,
    monthTicks,
  } from "./precipitation"

  let {
    years,
    normal,
    normalLabel = "1991–2020 normal",
  }: {
    years: PrecipitationYear[]
    normal: PrecipitationWeek[]
    normalLabel?: string
  } = $props()

  /** Oldest to newest; the last entry is the year being asked about. */
  const PALETTE = [COLOURS[0], COLOURS[2], COLOURS[3], COLOURS[1]]

  const WIDTH = 760
  const HEIGHT = 340
  const PAD = { top: 12, right: 10, bottom: 30, left: 46 }
  const PLOT = {
    width: WIDTH - PAD.left - PAD.right,
    height: HEIGHT - PAD.top - PAD.bottom,
  }

  const WEEKS = 53
  const current = $derived(years.at(-1))

  const ceiling = $derived.by(() => {
    const highest = Math.max(
      ...years.flatMap((year) => year.weeks.map((week) => week.cumulativeInches)),
      ...normal.map((week) => week.cumulativeInches),
    )
    return Math.ceil(highest / 10) * 10
  })

  const x = (week: number) => PAD.left + ((week - 1) / (WEEKS - 1)) * PLOT.width
  const y = (inches: number) => PAD.top + PLOT.height - (inches / ceiling) * PLOT.height

  const path = (weeks: PrecipitationWeek[]) =>
    weeks
      .map(
        (week, i) =>
          `${i === 0 ? "M" : "L"}${x(week.week).toFixed(1)} ${y(week.cumulativeInches).toFixed(1)}`,
      )
      .join(" ")

  /**
   * The week the current year has reached -- every figure in the legend is
   * read at this week rather than at each year's own end.
   *
   * A part-year against three whole ones is the one comparison this chart
   * must not invite: 2026 stood at 30.49 inches in late October against
   * 2025's full-year 37.72, and a legend printing those side by side says
   * the current year is seven inches drier when at the same week it is level
   * with it. The lines still run to each year's own end -- the x axis is the
   * date, so that reads correctly -- but a number lifted out of a line needs
   * the week it was lifted at.
   */
  const throughWeek = $derived(current?.weeks.at(-1)?.week ?? WEEKS)

  const comparable = (weeks: PrecipitationWeek[]) =>
    weeks.filter((week) => week.week <= throughWeek).at(-1)?.cumulativeInches ?? 0

  const series = $derived(
    years.map((year, i) => ({
      year,
      colour: PALETTE[i % PALETTE.length],
      isCurrent: i === years.length - 1,
      d: path(year.weeks),
      soFar: comparable(year.weeks),
    })),
  )

  const ticks = monthTicks()

  /** The last week at or before `week` -- what a year that has not reached it shows. */
  const at = (weeks: PrecipitationWeek[], week: number) =>
    weeks.filter((row) => row.week <= week).at(-1) ?? null

  /**
   * The sr-only table's own rows, built here rather than in the markup: a
   * `{@const}` may only sit as the immediate child of a block, and a cell
   * needing one per series plus one for the normal does not qualify.
   */
  const spokenRows = $derived(
    ticks.map((tick) => ({
      label: tick.label,
      cells: series.map(({ year }) => at(year.weeks, Math.floor(tick.week))),
      normal: at(normal, Math.floor(tick.week)),
    })),
  )
  const gridLines = $derived(
    Array.from({ length: ceiling / 10 + 1 }, (_, i) => i * 10).filter((v) => v > 0),
  )

  const inches = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })

  /** The week under the pointer, 1-53, or null when the pointer is away. */
  let hovered = $state<number | null>(null)
  let plot: SVGRectElement | undefined = $state()

  const track = (event: PointerEvent) => {
    if (!plot) return
    const box = plot.getBoundingClientRect()
    const across = (event.clientX - box.left) / box.width
    hovered = Math.min(WEEKS, Math.max(1, Math.round(across * (WEEKS - 1) + 1)))
  }

  /** What the readout lists: every year that had reached this week, plus the normal. */
  const readout = $derived.by(() => {
    if (hovered === null) return null
    const rows = series
      .map(({ year, colour, isCurrent }) => ({
        label: String(year.year),
        colour,
        isCurrent,
        week: at(year.weeks, hovered!),
      }))
      .filter((row) => row.week !== null)
    const normalWeek = at(normal, hovered)
    return { rows, normalWeek, week: hovered }
  })
</script>

<figure class="not-prose m-0">
  <div class="relative">
    <svg
      viewBox="0 0 {WIDTH} {HEIGHT}"
      class="block h-auto w-full"
      role="group"
      aria-label="Rainfall accumulating through the year, {years[0]?.year} to {current?.year}"
    >
      <!-- Horizontal grid, every ten inches. Behind everything else. -->
      {#each gridLines as line (line)}
        <line
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={y(line)}
          y2={y(line)}
          stroke="#e2e8f0"
          stroke-width="1"
        />
        <text x={PAD.left - 8} y={y(line) + 4} text-anchor="end" class="fill-slate-500 text-[11px]">
          {line}"
        </text>
      {/each}

      <!-- Baseline and month ticks. -->
      <line
        x1={PAD.left}
        x2={WIDTH - PAD.right}
        y1={y(0)}
        y2={y(0)}
        stroke="#94a3b8"
        stroke-width="1"
      />
      {#each ticks as tick (tick.label)}
        <text
          x={x(tick.week)}
          y={HEIGHT - 10}
          text-anchor="middle"
          class="fill-slate-500 text-[11px]"
        >
          {tick.label}
        </text>
      {/each}

      <!-- The normal, under the years: a reference, not a fifth year. -->
      <path
        d={path(normal)}
        fill="none"
        stroke="#64748b"
        stroke-width="1.5"
        stroke-dasharray="5 4"
        role="img"
        aria-label="{normalLabel}: {inches.format(
          normal.at(-1)?.cumulativeInches ?? 0,
        )} inches over a full year"
      />

      {#each series as line (line.year.year)}
        <!-- Focusable on purpose: a line is how a keyboard reader reaches the
             year's own figures, the same bargain RainfallChart's bars make. -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <path
          d={line.d}
          fill="none"
          stroke={line.colour}
          stroke-width={line.isCurrent ? 3 : 1.75}
          stroke-linejoin="round"
          stroke-linecap="round"
          opacity={hovered === null || line.isCurrent ? 1 : 0.75}
          tabindex="0"
          role="img"
          aria-label="{line.year.year}: {inches.format(line.soFar)} inches by {longDate(
            current?.throughDate ?? '',
          )}{line.isCurrent
            ? ''
            : `, ${inches.format(line.year.totalInches)} inches over the full year`}{line.year
            .filledDays
            ? `, ${line.year.filledDays} day${line.year.filledDays === 1 ? '' : 's'} filled from a neighbouring gauge`
            : ''}"
        />
      {/each}

      <!-- The guide, and a dot on each year that had reached this week. -->
      {#if readout}
        <line
          x1={x(readout.week)}
          x2={x(readout.week)}
          y1={PAD.top}
          y2={y(0)}
          stroke="#0f172a"
          stroke-width="1"
          opacity="0.35"
        />
        {#each readout.rows as row (row.label)}
          <circle
            cx={x(row.week!.week)}
            cy={y(row.week!.cumulativeInches)}
            r={row.isCurrent ? 4 : 3}
            fill={row.colour}
            stroke="#fff"
            stroke-width="1.5"
          />
        {/each}
      {/if}

      <!-- Transparent, on top, and the only thing the pointer talks to. Hidden
           from assistive tech: it reveals nothing the focusable lines and the
           table below do not already carry. -->
      <rect
        role="presentation"
        aria-hidden="true"
        bind:this={plot}
        x={PAD.left}
        y={PAD.top}
        width={PLOT.width}
        height={PLOT.height}
        fill="transparent"
        onpointermove={track}
        onpointerleave={() => (hovered = null)}
      />
    </svg>

    {#if readout}
      <div
        class="pointer-events-none absolute top-2 right-2 rounded-md bg-white/95 px-3 py-2 text-xs shadow-md ring-1 ring-slate-200"
        aria-hidden="true"
      >
        <p class="m-0 font-medium text-slate-900">
          Week of {longDate(`2023-${readout.rows[0]?.week!.startMonthDay}`)}
        </p>
        <table class="mt-1 border-separate border-spacing-x-2 border-spacing-y-0.5">
          <tbody>
            {#each [...readout.rows].reverse() as row (row.label)}
              <tr>
                <td class="align-middle">
                  <span class="inline-block h-2 w-2 rounded-full" style="background: {row.colour}"
                  ></span>
                </td>
                <th
                  scope="row"
                  class="text-left font-normal {row.isCurrent
                    ? 'font-semibold text-slate-900'
                    : 'text-slate-600'}"
                >
                  {row.label}
                </th>
                <td class="text-right text-slate-900 tabular-nums">
                  {inches.format(row.week!.cumulativeInches)}"
                </td>
                <td class="text-right text-slate-500 tabular-nums">
                  +{inches.format(row.week!.inches)}
                </td>
              </tr>
            {/each}
            {#if readout.normalWeek}
              <tr>
                <td><span class="inline-block h-px w-2 bg-slate-500 align-middle"></span></td>
                <th scope="row" class="text-left font-normal text-slate-500">normal</th>
                <td class="text-right text-slate-500 tabular-nums">
                  {inches.format(readout.normalWeek.cumulativeInches)}"
                </td>
                <td></td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <!-- Legend. Also the only place the years are named for a reader who never
       hovers anything and does not tab onto a line. -->
  <p class="mt-3 mb-1 text-xs text-slate-500">
    Accumulated by {longDate(current?.throughDate ?? "")}, each year read at the same week:
  </p>
  <ul class="flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs">
    {#each [...series].reverse() as line (line.year.year)}
      <li class="m-0 flex items-center gap-1.5">
        <span
          class="inline-block h-0.5 w-4 rounded"
          style="background: {line.colour}; height: {line.isCurrent ? 3 : 2}px"
        ></span>
        <span class={line.isCurrent ? "font-semibold text-slate-900" : "text-slate-600"}>
          {line.year.year}
        </span>
        <span class="text-slate-500 tabular-nums">{inches.format(line.soFar)}"</span>
      </li>
    {/each}
    <li class="m-0 flex items-center gap-1.5">
      <span
        class="inline-block h-0 w-4 border-t-2 border-dashed border-slate-500"
        aria-hidden="true"
      ></span>
      <span class="text-slate-600">{normalLabel}</span>
      <span class="text-slate-500 tabular-nums">{inches.format(comparable(normal))}"</span>
    </li>
  </ul>

  <!-- Every figure the lines carry, for a screen reader: by month rather than
       by week, which is 53 rows per year nobody wants read out. -->
  <table class="sr-only">
    <caption> Rainfall accumulated since January 1st, in inches, by month </caption>
    <thead>
      <tr>
        <th scope="col">Month</th>
        {#each series as line (line.year.year)}
          <th scope="col">{line.year.year}</th>
        {/each}
        <th scope="col">{normalLabel}</th>
      </tr>
    </thead>
    <tbody>
      {#each spokenRows as row (row.label)}
        <tr>
          <th scope="row">{row.label}</th>
          {#each row.cells as cell, i (i)}
            <td>{cell ? `${inches.format(cell.cumulativeInches)} in` : "—"}</td>
          {/each}
          <td>{row.normal ? `${inches.format(row.normal.cumulativeInches)} in` : "—"}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</figure>
