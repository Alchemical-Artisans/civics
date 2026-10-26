<!--
  Four years of Haverhill's rainfall across the calendar, one line each, a
  point per month, against the 1991-2020 normal.

  **Each month's own inches, not a running total.** The question this answers
  is when it rained, not how far behind a year is by now: a month at 11.23 in
  and a month at 0.36 are the thing being looked at, and accumulating them
  hides both inside a curve that can only rise. The year's total is still
  reported, in the legend and in the page's own prose beneath, so the
  magnitude comparison a monthly line cannot make is not lost -- it is just
  not what the lines are for.

  **Months rather than weeks**, which this drew first: a week swings between
  0.00 and 4.37 inches here, and four such lines over one axis obscure each
  other rather than comparing. Twelve points a line is legible, and see
  `$lib/precipitation.ts` for the two calendar problems months also dispose
  of.

  **A month short of its own length is drawn dashed, with a hollow point.**
  The current year's last month is almost always incomplete -- October read
  to the 25th is six days short of the Octobers it sits beside -- and an
  unmarked point there would show the current month as unusually dry on
  every build. The dash is the same device the normal uses, for the same
  reason: this is not quite a figure of the same kind as the solid ones
  around it.

  Colour runs oldest to newest through the site's own palette, with the
  current year in the orange `drought-colours.ts` builds its stage ramp on
  -- the drought year drawn in the drought hue -- heavier and fully opaque,
  the three behind it lighter. The normal is slate and dashed: a reference,
  not a fifth year.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"
  import { type PrecipitationMonth, type PrecipitationYear, longDate } from "./precipitation"

  let {
    years,
    normal,
    normalToDate,
    normalLabel = "1991–2020 normal",
  }: {
    years: PrecipitationYear[]
    normal: PrecipitationMonth[]
    /** The normal summed to the same day the newest year reaches. */
    normalToDate: number
    normalLabel?: string
  } = $props()

  /** Oldest to newest; the last entry is the year being asked about. */
  const PALETTE = [COLOURS[0], COLOURS[2], COLOURS[3], COLOURS[1]]

  const WIDTH = 760
  const HEIGHT = 320
  const PAD = { top: 14, right: 12, bottom: 30, left: 44 }
  const PLOT = {
    width: WIDTH - PAD.left - PAD.right,
    height: HEIGHT - PAD.top - PAD.bottom,
  }

  const MONTHS = 12
  const current = $derived(years.at(-1))

  const inches = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })

  /**
   * Rounded up to the next whole inch. The wettest month of these four years
   * is August 2023 at 11.23 in, nearly three times the normal for the month
   * -- the scale has to hold it, and a year's dry months then sit low on the
   * chart, which is the honest picture rather than a cramped one.
   */
  const ceiling = $derived.by(() =>
    Math.ceil(
      Math.max(
        ...years.flatMap((year) => year.months.map((month) => month.inches)),
        ...normal.map((month) => month.inches),
      ),
    ),
  )

  const x = (month: number) => PAD.left + ((month - 1) / (MONTHS - 1)) * PLOT.width
  const y = (value: number) => PAD.top + PLOT.height - (value / ceiling) * PLOT.height

  const point = (month: PrecipitationMonth) =>
    `${x(month.month).toFixed(1)} ${y(month.inches).toFixed(1)}`

  /**
   * A year draws as up to two paths: the whole months solid, and a dashed
   * tail joining the last whole month to an incomplete one. One path cannot
   * carry both, a `stroke-dasharray` applying to the whole of it.
   */
  const paths = (months: PrecipitationMonth[]) => {
    const whole = months.filter((month) => !month.partial)
    const tail = months.filter((month) => month.partial)
    const solid = whole.map((month, i) => `${i === 0 ? "M" : "L"}${point(month)}`).join(" ")
    const from = whole.at(-1)
    const joined = tail.length
      ? (from ? `M${point(from)} ` : `M${point(tail[0])} `) +
        tail.map((month) => `L${point(month)}`).join(" ")
      : ""
    return { solid, tail: joined }
  }

  /**
   * The lines draw monthly amounts, so the legend is where the year's total
   * is reported -- the magnitude comparison a monthly line cannot make. The
   * figure is `toDateInches`, each year summed to the same month and day the
   * current year reaches, which `$lib/precipitation.ts` explains: a legend
   * printing 2026's part-year beside 2025's full 37.72 would say the current
   * year is seven inches drier when at the same point it is level with it.
   */
  const series = $derived(
    years.map((year, i) => ({
      year,
      colour: PALETTE[i % PALETTE.length],
      isCurrent: i === years.length - 1,
      ...paths(year.months),
    })),
  )

  /** Every other inch; one line per inch is twelve lines at this ceiling. */
  const gridLines = $derived(
    Array.from({ length: ceiling + 1 }, (_, i) => i).filter((v) => v > 0 && v % 2 === 0),
  )

  /** The month under the pointer, 1-12, or null when the pointer is away. */
  let hovered = $state<number | null>(null)
  let plot: SVGRectElement | undefined = $state()

  const track = (event: PointerEvent) => {
    if (!plot) return
    const box = plot.getBoundingClientRect()
    const across = (event.clientX - box.left) / box.width
    hovered = Math.min(MONTHS, Math.max(1, Math.round(across * (MONTHS - 1) + 1)))
  }

  /**
   * What the readout lists: every year that has this month, plus the normal.
   * A partial month says how many days it is standing on, since that is what
   * makes it not comparable with the others in its own column.
   */
  const readout = $derived.by(() => {
    if (hovered === null) return null
    const rows = series
      .map(({ year, colour, isCurrent }) => ({
        label: String(year.year),
        colour,
        isCurrent,
        month: year.months.find((row) => row.month === hovered) ?? null,
      }))
      .filter((row) => row.month !== null)
    return {
      rows,
      normalMonth: normal.find((row) => row.month === hovered) ?? null,
      month: hovered,
    }
  })

  /**
   * The table's own rows: one per month, which is what the lines draw. Built
   * here rather than in the markup because a `{@const}` may only sit as the
   * immediate child of a block, and a cell needing one per series plus one
   * for the normal does not qualify.
   */
  const spokenRows = $derived(
    normal.map((month) => ({
      label: month.label,
      cells: series.map(({ year }) => year.months.find((row) => row.month === month.month) ?? null),
      normal: month,
    })),
  )
</script>

<figure class="not-prose m-0">
  <div class="relative">
    <svg
      viewBox="0 0 {WIDTH} {HEIGHT}"
      class="block h-auto w-full"
      role="group"
      aria-label="Rainfall by month, {years[0]?.year} to {current?.year}"
    >
      <!-- Horizontal grid, every two inches. Behind everything else. -->
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

      <!-- Baseline and month labels. -->
      <line
        x1={PAD.left}
        x2={WIDTH - PAD.right}
        y1={y(0)}
        y2={y(0)}
        stroke="#94a3b8"
        stroke-width="1"
      />
      {#each normal as month (month.month)}
        <text
          x={x(month.month)}
          y={HEIGHT - 10}
          text-anchor="middle"
          class="text-[11px] {hovered === month.month ? 'fill-slate-900' : 'fill-slate-500'}"
        >
          {month.label}
        </text>
      {/each}

      <!-- The normal, under the years: a reference, not a fifth year. It is
           flatter than the years are, 3.53 in in January to 5.32 in in
           October, so a month above the line was wetter than a month of its
           own name usually is. -->
      <path
        d={normal.map((month, i) => `${i === 0 ? "M" : "L"}${point(month)}`).join(" ")}
        fill="none"
        stroke="#64748b"
        stroke-width="1.5"
        stroke-dasharray="5 4"
        role="img"
        aria-label="{normalLabel}: {inches.format(
          normal.at(-1)?.cumulativeInches ?? 0,
        )} inches over a full year"
      />

      {#if readout}
        <line
          x1={x(readout.month)}
          x2={x(readout.month)}
          y1={PAD.top}
          y2={y(0)}
          stroke="#0f172a"
          stroke-width="1"
          opacity="0.3"
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
          aria-label="{line.year.year}: {inches.format(line.year.toDateInches)} inches by {longDate(
            current?.throughDate ?? '',
          )}{line.isCurrent
            ? ''
            : `, ${inches.format(line.year.totalInches)} inches over the full year`}{line.year
            .filledDays
            ? `, ${line.year.filledDays} day${line.year.filledDays === 1 ? '' : 's'} filled from a neighbouring gauge`
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
              cy={y(month.inches)}
              r={hovered === month.month ? (line.isCurrent ? 4 : 3.25) : line.isCurrent ? 2.75 : 2}
              fill={month.partial ? "#fff" : line.colour}
              stroke={line.colour}
              stroke-width={month.partial ? 1.75 : 1}
            />
          {/each}
        </g>
      {/each}

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
        <p class="m-0 font-medium text-slate-900">{readout.normalMonth?.label}</p>
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
                  {inches.format(row.month!.inches)}"
                </td>
                <td class="text-right text-slate-500 tabular-nums">
                  {row.month!.partial ? `${row.month!.days} days` : ""}
                </td>
              </tr>
            {/each}
            {#if readout.normalMonth}
              <tr>
                <td><span class="inline-block h-px w-2 bg-slate-500 align-middle"></span></td>
                <th scope="row" class="text-left font-normal text-slate-500">normal</th>
                <td class="text-right text-slate-500 tabular-nums">
                  {inches.format(readout.normalMonth.inches)}"
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
    Total by {longDate(current?.throughDate ?? "")}, each year read to the same day:
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
    <li class="m-0 flex items-center gap-1.5">
      <span
        class="inline-block h-0 w-4 border-t-2 border-dashed border-slate-500"
        aria-hidden="true"
      ></span>
      <span class="text-slate-600">{normalLabel}</span>
      <span class="text-slate-500 tabular-nums">{inches.format(normalToDate)}"</span>
    </li>
  </ul>

  <!-- Every figure the lines carry, for a screen reader: one row per month,
       which is what the lines draw. This table is here so nothing is only
       visible to a mouse, not to summarise. -->
  <table class="sr-only">
    <caption> Rainfall by month, in inches </caption>
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
            <td>
              {cell
                ? `${inches.format(cell.inches)} in${cell.partial ? ` (${cell.days} days)` : ""}`
                : "—"}
            </td>
          {/each}
          <td>{inches.format(row.normal.inches)} in</td>
        </tr>
      {/each}
    </tbody>
  </table>
</figure>
