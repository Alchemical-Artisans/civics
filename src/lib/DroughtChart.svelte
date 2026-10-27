<!--
  Two charts stacked on one calendar, a line per year in each: rainfall a
  month at a time above, Kenoza Lake's own level below.

  **Stacked rather than overlaid, because the two do not share a scale.**
  Rainfall is inches falling in a month and belongs on an axis starting at
  zero; a reservoir level is feet above a datum and belongs on one that does
  not. Drawn together they would need two y axes, and a reader would be left
  working out which line answered to which -- the usual trouble with a
  twin-axis chart. Stacked, each panel keeps its own scale and the shared x
  axis does the comparing: a dry month in the top panel sits directly above
  what the lake did next.

  The months are drawn once, under the lower panel, and one hover guide runs
  through both -- the point of stacking being that a reader reads down a
  column, so the column has to be visible in both at once.

  **Each month's own inches above, not a running total.** The question is
  when it rained, not how far behind a year is by now. The year's total is
  reported in the legend instead, each year read to the same day.

  **The lake panel's lines are dotted**, and not only for looks: those
  figures are read off a picture of a chart rather than published as numbers,
  so they are drawn in the register a site like this should draw an estimate
  in. See `$lib/kenoza-levels.ts`, which carries the provenance, the method
  and the precision.

  **A series that stops, stops.** 2026's rainfall stops at the last day a
  gauge read, and its lake level at September 15th, the day the city's chart
  was drawn. The x axis is the date, so a line ending early reads as a year
  not finished rather than a year that went to zero. A rainfall month short
  of its own length is drawn dashed with a hollow point, so the current
  month is not read as a dry one.

  Colour runs oldest to newest, the current year always in the orange
  `drought-colours.ts` builds its stage ramp on -- the drought year drawn in
  the drought hue -- heavier and fully opaque, the years behind it lighter.
  Picked by name rather than by position, so it stays orange whatever the
  span's length.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"
  import type { LakeLevelMonth, LakeLevelYear } from "./kenoza-levels"
  import {
    MONTH_NAMES,
    type PrecipitationMonth,
    type PrecipitationYear,
    longDate,
  } from "./precipitation"

  let {
    years,
    levels,
  }: {
    years: PrecipitationYear[]
    levels: LakeLevelYear[]
  } = $props()

  /** The drought hue, for whichever year is the current one. */
  const CURRENT_COLOUR = COLOURS[1]
  /** The years behind it, oldest first. */
  const EARLIER_COLOURS = [COLOURS[0], COLOURS[2], COLOURS[3], COLOURS[4], COLOURS[5]]

  const WIDTH = 760
  const PAD = { top: 14, right: 12, bottom: 30, left: 46 }
  /** The two plot boxes and the gap between them, top to bottom. */
  const RAIN_H = 190
  const GAP = 44
  const LAKE_H = 150
  const HEIGHT = PAD.top + RAIN_H + GAP + LAKE_H + PAD.bottom
  const RAIN_TOP = PAD.top
  const LAKE_TOP = PAD.top + RAIN_H + GAP

  const PLOT_W = WIDTH - PAD.left - PAD.right
  const MONTHS = 12

  const current = $derived(years.at(-1))

  const inches = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })
  const feet = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  const x = (month: number) => PAD.left + ((month - 1) / (MONTHS - 1)) * PLOT_W

  // --- rainfall panel, zero-based because inches in a month is a quantity ---
  const rainCeiling = $derived(
    Math.ceil(Math.max(...years.flatMap((year) => year.months.map((month) => month.inches)))),
  )
  const yRain = (value: number) => RAIN_TOP + RAIN_H - (value / rainCeiling) * RAIN_H
  const rainGrid = $derived(
    Array.from({ length: rainCeiling + 1 }, (_, i) => i).filter((v) => v > 0 && v % 2 === 0),
  )

  /**
   * The lake panel does not start at zero, and should not: a reservoir level
   * is feet above a gauge datum, not an amount of water, and a zero-based
   * axis would squeeze the whole drought into the top tenth of the box. It is
   * padded a foot either side of the range actually drawn and rounded out to
   * whole feet.
   */
  const lakeRange = $derived.by(() => {
    const all = levels.flatMap((year) => year.months.map((month) => month.feet))
    return { low: Math.floor(Math.min(...all) - 1), high: Math.ceil(Math.max(...all) + 1) }
  })
  const yLake = (value: number) =>
    LAKE_TOP + LAKE_H - ((value - lakeRange.low) / (lakeRange.high - lakeRange.low)) * LAKE_H
  const lakeGrid = $derived.by(() => {
    const ticks: number[] = []
    for (let v = Math.ceil(lakeRange.low / 2) * 2; v <= lakeRange.high; v += 2) ticks.push(v)
    return ticks
  })

  /**
   * A rainfall year draws as up to two paths: the whole months solid, and a
   * dashed tail joining the last whole month to an incomplete one. One path
   * cannot carry both, a `stroke-dasharray` applying to the whole of it.
   */
  const rainPaths = (months: PrecipitationMonth[]) => {
    const at = (m: PrecipitationMonth) => `${x(m.month).toFixed(1)} ${yRain(m.inches).toFixed(1)}`
    const whole = months.filter((month) => !month.partial)
    const tail = months.filter((month) => month.partial)
    const solid = whole.map((month, i) => `${i === 0 ? "M" : "L"}${at(month)}`).join(" ")
    const from = whole.at(-1)
    const joined = tail.length
      ? (from ? `M${at(from)} ` : `M${at(tail[0])} `) + tail.map((m) => `L${at(m)}`).join(" ")
      : ""
    return { solid, tail: joined }
  }

  const lakePath = (months: LakeLevelMonth[]) =>
    months
      .map((m, i) => `${i === 0 ? "M" : "L"}${x(m.month).toFixed(1)} ${yLake(m.feet).toFixed(1)}`)
      .join(" ")

  /**
   * The legend reports each year's rainfall total, since the lines draw
   * monthly amounts and cannot. The figure is `toDateInches`, each year
   * summed to the same month and day the current year reaches -- see
   * `$lib/precipitation.ts`: a legend printing 2026's part-year beside 2025's
   * full 37.72 would say the current year is seven inches drier when at the
   * same point it is level with it.
   */
  const series = $derived(
    years.map((year, i) => {
      const isCurrent = i === years.length - 1
      return {
        year,
        isCurrent,
        colour: isCurrent ? CURRENT_COLOUR : EARLIER_COLOURS[i % EARLIER_COLOURS.length],
        ...rainPaths(year.months),
        level: levels.find((row) => row.year === year.year) ?? null,
      }
    }),
  )

  const axisMonths = MONTH_NAMES.map((label, i) => ({ month: i + 1, label }))

  /** The month under the pointer, 1-12, or null when the pointer is away. */
  let hovered = $state<number | null>(null)
  let plot: SVGRectElement | undefined = $state()

  const track = (event: PointerEvent) => {
    if (!plot) return
    const box = plot.getBoundingClientRect()
    const across = (event.clientX - box.left) / box.width
    hovered = Math.min(MONTHS, Math.max(1, Math.round(across * (MONTHS - 1) + 1)))
  }

  /** Both panels' figures for the month under the pointer, in one readout. */
  const readout = $derived.by(() => {
    if (hovered === null) return null
    const rows = series
      .map(({ year, colour, isCurrent, level }) => ({
        label: String(year.year),
        colour,
        isCurrent,
        month: year.months.find((row) => row.month === hovered) ?? null,
        feet: level?.months.find((row) => row.month === hovered)?.feet ?? null,
      }))
      .filter((row) => row.month !== null || row.feet !== null)
    return { rows, label: MONTH_NAMES[hovered - 1], month: hovered }
  })

  /** One row per month, which is what the lines draw -- see the table below. */
  const spokenRows = $derived(
    axisMonths.map(({ month, label }) => ({
      label,
      cells: series.map(({ year, level }) => ({
        rain: year.months.find((row) => row.month === month) ?? null,
        feet: level?.months.find((row) => row.month === month)?.feet ?? null,
      })),
    })),
  )
</script>

<figure class="not-prose m-0">
  <div class="relative">
    <svg
      viewBox="0 0 {WIDTH} {HEIGHT}"
      class="block h-auto w-full"
      role="group"
      aria-label="Rainfall by month and Kenoza Lake's level, {years[0]?.year} to {current?.year}"
    >
      <!-- Panel titles, inside the drawing so they scale with it. -->
      <text x={PAD.left} y={RAIN_TOP - 3} class="fill-slate-600 text-[11px] font-medium">
        Rainfall, inches in the month
      </text>
      <text x={PAD.left} y={LAKE_TOP - 3} class="fill-slate-600 text-[11px] font-medium">
        Kenoza Lake, feet &mdash; read off the city's chart
      </text>

      <!-- Rainfall grid and baseline. -->
      {#each rainGrid as line (line)}
        <line
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={yRain(line)}
          y2={yRain(line)}
          stroke="#e2e8f0"
        />
        <text
          x={PAD.left - 8}
          y={yRain(line) + 4}
          text-anchor="end"
          class="fill-slate-500 text-[11px]">{line}"</text
        >
      {/each}
      <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yRain(0)} y2={yRain(0)} stroke="#94a3b8" />

      <!-- Lake grid and floor. The floor is not zero, so it is drawn as a
           grid line rather than an axis, which would imply one. -->
      {#each lakeGrid as line (line)}
        <line
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={yLake(line)}
          y2={yLake(line)}
          stroke="#e2e8f0"
        />
        <text
          x={PAD.left - 8}
          y={yLake(line) + 4}
          text-anchor="end"
          class="fill-slate-500 text-[11px]">{line}</text
        >
      {/each}

      <!-- One guide through both panels: the point of stacking is reading
           down a column, so the column has to show in both. -->
      {#if readout}
        <line
          x1={x(readout.month)}
          x2={x(readout.month)}
          y1={RAIN_TOP}
          y2={LAKE_TOP + LAKE_H}
          stroke="#0f172a"
          stroke-width="1"
          opacity="0.25"
        />
      {/if}

      {#each series as line (line.year.year)}
        <!-- Focusable on purpose: a line is how a keyboard reader reaches the
             year's own figures, the same bargain RainfallChart's bars make. -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <g
          tabindex="0"
          role="img"
          opacity={line.isCurrent ? 1 : 0.6}
          aria-label="{line.year.year}: {inches.format(
            line.year.toDateInches,
          )} inches of rain by {longDate(current?.throughDate ?? '')}{line.isCurrent
            ? ''
            : `, ${inches.format(line.year.totalInches)} inches over the full year`}{line.level
            ? `. Kenoza Lake ${feet.format(line.level.months.at(-1)!.feet)} feet by ${line.level.months.at(-1)!.label}, low of ${feet.format(line.level.low.feet)} feet in ${line.level.low.note}`
            : ''}{line.year.filledDays
            ? `. ${line.year.filledDays} rainfall day${line.year.filledDays === 1 ? '' : 's'} filled from a neighbouring gauge`
            : ''}"
        >
          <path
            d={line.solid}
            fill="none"
            stroke={line.colour}
            stroke-width={line.isCurrent ? 2.5 : 1.75}
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          {#if line.tail}
            <!-- The incomplete month: dashed, so it is not read as a dry one. -->
            <path
              d={line.tail}
              fill="none"
              stroke={line.colour}
              stroke-width={line.isCurrent ? 2.5 : 1.75}
              stroke-dasharray="3 3"
              stroke-linecap="round"
            />
          {/if}
          {#each line.year.months as month (month.month)}
            <circle
              cx={x(month.month)}
              cy={yRain(month.inches)}
              r={hovered === month.month ? (line.isCurrent ? 4 : 3.25) : line.isCurrent ? 2.75 : 2}
              fill={month.partial ? "#fff" : line.colour}
              stroke={line.colour}
              stroke-width={month.partial ? 1.75 : 1}
            />
          {/each}

          {#if line.level}
            <!-- Dotted: these are read off a picture, not published as
                 numbers. See $lib/kenoza-levels.ts. -->
            <path
              d={lakePath(line.level.months)}
              fill="none"
              stroke={line.colour}
              stroke-width={line.isCurrent ? 2.25 : 1.75}
              stroke-dasharray="1.5 3.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            {#each line.level.months as month (month.month)}
              <circle
                cx={x(month.month)}
                cy={yLake(month.feet)}
                r={hovered === month.month
                  ? line.isCurrent
                    ? 3.5
                    : 3
                  : line.isCurrent
                    ? 2.25
                    : 1.75}
                fill={line.colour}
              />
            {/each}
          {/if}
        </g>
      {/each}

      <!-- Months once, under the lower panel: one calendar for both. -->
      {#each axisMonths as month (month.month)}
        <text
          x={x(month.month)}
          y={HEIGHT - 10}
          text-anchor="middle"
          class="text-[11px] {hovered === month.month ? 'fill-slate-900' : 'fill-slate-500'}"
        >
          {month.label}
        </text>
      {/each}

      <!-- Transparent, on top, spanning both panels, and the only thing the
           pointer talks to. Hidden from assistive tech: it reveals nothing
           the focusable lines and the table below do not already carry. -->
      <rect
        role="presentation"
        aria-hidden="true"
        bind:this={plot}
        x={PAD.left}
        y={RAIN_TOP}
        width={PLOT_W}
        height={LAKE_TOP + LAKE_H - RAIN_TOP}
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
        <p class="m-0 font-medium text-slate-900">{readout.label}</p>
        <table class="mt-1 border-separate border-spacing-x-2 border-spacing-y-0.5">
          <thead>
            <tr class="text-slate-400">
              <td></td>
              <td></td>
              <th scope="col" class="text-right font-normal">rain</th>
              <th scope="col" class="text-right font-normal">lake</th>
            </tr>
          </thead>
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
                  {row.month ? `${inches.format(row.month.inches)}"` : "—"}
                </td>
                <td class="text-right text-slate-600 tabular-nums">
                  {row.feet === null ? "—" : `${feet.format(row.feet)} ft`}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <!-- Legend. Also the only place the years are named for a reader who never
       hovers anything and does not tab onto a line. -->
  <p class="mt-3 mb-1 text-xs text-slate-500">
    Rainfall total by {longDate(current?.throughDate ?? "")}, each year read to the same day:
  </p>
  <ul class="flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs">
    {#each [...series].reverse() as line (line.year.year)}
      <li class="m-0 flex items-center gap-1.5">
        <span
          class="inline-block w-4 rounded"
          style="background: {line.colour}; height: {line.isCurrent ? 3 : 2}px"
        ></span>
        <span class={line.isCurrent ? "font-semibold text-slate-900" : "text-slate-600"}>
          {line.year.year}
        </span>
        <span class="text-slate-500 tabular-nums">
          {inches.format(line.year.toDateInches)}"
        </span>
      </li>
    {/each}
  </ul>

  <!-- Every figure both panels carry, for a screen reader: one row per month,
       which is what the lines draw. Here so nothing is only visible to a
       mouse, not to summarise. -->
  <table class="sr-only">
    <caption> Rainfall in inches and Kenoza Lake's level in feet, by month </caption>
    <thead>
      <tr>
        <th scope="col">Month</th>
        {#each series as line (line.year.year)}
          <th scope="col">{line.year.year} rainfall</th>
          <th scope="col">{line.year.year} lake level</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each spokenRows as row (row.label)}
        <tr>
          <th scope="row">{row.label}</th>
          {#each row.cells as cell, i (i)}
            <td>
              {cell.rain
                ? `${inches.format(cell.rain.inches)} in${cell.rain.partial ? ` (${cell.rain.days} days)` : ""}`
                : "—"}
            </td>
            <td>{cell.feet === null ? "—" : `${feet.format(cell.feet)} ft`}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</figure>
