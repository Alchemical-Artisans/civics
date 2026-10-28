<!--
  Haverhill's rainfall, one bar a year, with a ten-year average beside them.

  **Bars per year, not a line per month.** This chart answers "how has the
  rainfall changed year to year", and the answer to that is one bar per year;
  a seasonal line per year answers "when in the year does it rain", which is
  a different question and buries this one. It was a month-by-month line
  chart for a while, two years overlaid, with cumulative and lake-level
  panels stacked under it -- three panels of one tall column, from which the
  trend this draws in five bars could not be read at all.

  **Every bar is read to the same day, and that is the whole integrity of
  it.** The current year is ten months old. Drawn against four whole years
  and a ten-whole-year average it would look like a catastrophe every time
  the page was built, in June as much as in December. So each bar is
  `toDateInches` -- that year summed only through the current year's own last
  read day -- and the average is the mean of ten such figures, not of ten
  whole years. See `averageToDate` in `$lib/precipitation.ts`. The caption
  says the day out loud, because a reader cannot infer it from bars.

  **The average is a bar and a line.** A bar, to the right and set apart by a
  gap and a neutral colour, because that is a fifth quantity on the same
  scale and belongs on the same axis. A faint dashed rule at the same height
  across the year bars, because the thing worth seeing is which years fall
  under it, and eye-tracking from a bar at one end of the chart to a bar at
  the other is exactly the comparison bars are bad at.

  Colour: the current year in the orange `drought-colours.ts` builds its
  stage ramp on -- the drought year in the drought hue -- the years behind it
  lighter, and the average in slate, since it is a reference rather than a
  year. Picked by name rather than by position, so the current year stays
  orange whatever the span's length.

  Every bar prints its own figure above it, so there is no tooltip here and
  nothing is visible only to a mouse; the bars are focusable for a keyboard
  reader and the table underneath carries the same five numbers.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"
  import { type PrecipitationYear, longDate } from "./precipitation"

  interface Baseline {
    inches: number
    from: number
    to: number
    years: number
  }

  let { years, baseline }: { years: PrecipitationYear[]; baseline: Baseline } = $props()

  /** The drought hue, for whichever year is the current one. */
  const CURRENT_COLOUR = COLOURS[1]
  /** The years behind it, oldest first. */
  const EARLIER_COLOURS = [COLOURS[0], COLOURS[2], COLOURS[3], COLOURS[4], COLOURS[5]]
  /** The average is a reference, not a year, so it is not on the year ramp. */
  const BASELINE_COLOUR = "#94a3b8"

  // The viewBox is what sets how large the 11px type renders: the SVG is
  // `w-full`, so the browser scales the whole drawing -- text included -- by
  // (rendered width / WIDTH). A 700-wide box measured 13.4px of label in the
  // wide two-column layout and 5.9px at `sm`, where the left column is only
  // 372px. So the box is drawn small and the figure is capped at `max-w-xl`
  // instead: the scale factor then sits near 1 from a phone up, and five bars
  // never needed 850px of canvas anyway.
  //
  // Being capped, the figure is narrower than the column it sits in, so it is
  // centred there with `mx-auto` -- which is also why the figure's margin is
  // `my-0` rather than `m-0`: the shorthand zeroes the side margins too, and
  // auto is what does the centring.
  const WIDTH = 460
  const PAD = { top: 22, right: 10, bottom: 34, left: 34 }
  const PLOT_H = 144
  const HEIGHT = PAD.top + PLOT_H + PAD.bottom
  const PLOT_W = WIDTH - PAD.left - PAD.right

  const inches = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })

  const current = $derived(years.at(-1))

  /**
   * Zero-based and rounded out to a whole ten inches: inches of rain is a
   * quantity, so a bar's height has to be its share of the axis, and a
   * cropped axis would turn a seven-inch shortfall into a cliff.
   */
  const scale = $derived.by(() => {
    const max = Math.max(baseline.inches, ...years.map((y) => y.toDateInches), 1)
    const high = Math.ceil(max / 10) * 10
    const y = (value: number) => PAD.top + PLOT_H - (value / high) * PLOT_H
    const ticks: number[] = []
    for (let v = 10; v <= high; v += 10) ticks.push(v)
    return { high, y, ticks }
  })

  /**
   * Five slots across the plot, the average's set off by half a slot so it
   * reads as a reference standing apart from the run of years rather than as
   * a fifth year.
   */
  const SLOTS = $derived(years.length + 1.5)
  const slotW = $derived(PLOT_W / SLOTS)
  const barW = $derived(Math.min(48, slotW * 0.62))
  const centre = (offset: number) => PAD.left + slotW * (offset + 0.5)

  const bars = $derived([
    ...years.map((year, i) => ({
      key: String(year.year),
      label: String(year.year),
      sub: null as string | null,
      value: year.toDateInches,
      colour: i === years.length - 1 ? CURRENT_COLOUR : EARLIER_COLOURS[i % EARLIER_COLOURS.length],
      isCurrent: i === years.length - 1,
      isBaseline: false,
      x: centre(i),
      year,
    })),
    {
      key: "baseline",
      label: `${baseline.years}-yr avg`,
      sub: `${baseline.from}–${baseline.to}`,
      value: baseline.inches,
      colour: BASELINE_COLOUR,
      isCurrent: false,
      isBaseline: true,
      x: centre(years.length + 0.5),
      year: null,
    },
  ])

  /** Which bar is hovered or focused, for the highlight only -- no tooltip. */
  let active = $state<string | null>(null)

  const against = (value: number) => {
    const delta = Math.round((value - baseline.inches) * 100) / 100
    if (delta === 0) return `level with the ${baseline.years}-year average`
    return `${inches.format(Math.abs(delta))} inches ${delta > 0 ? "above" : "below"} the ${baseline.years}-year average`
  }
</script>

<figure class="not-prose mx-auto my-0 max-w-xl">
  <svg
    viewBox="0 0 {WIDTH} {HEIGHT}"
    class="block h-auto w-full"
    role="group"
    aria-label="Rainfall by year through {longDate(current?.throughDate ?? '')}, {years[0]
      ?.year} to {current?.year}, against the {baseline.years}-year average"
  >
    {#each scale.ticks as tick (tick)}
      <line
        x1={PAD.left}
        x2={WIDTH - PAD.right}
        y1={scale.y(tick)}
        y2={scale.y(tick)}
        stroke="#e2e8f0"
      />
      <text
        x={PAD.left - 8}
        y={scale.y(tick) + 4}
        text-anchor="end"
        class="fill-slate-500 text-[11px]"
      >
        {tick}"
      </text>
    {/each}

    <line x1={PAD.left} x2={WIDTH - PAD.right} y1={scale.y(0)} y2={scale.y(0)} stroke="#94a3b8" />

    <!-- The average, drawn across the years as well as standing as its own
         bar: which years fall under it is the point, and comparing a bar at
         one end of a chart with a bar at the other is what bars do worst. -->
    <line
      x1={PAD.left}
      x2={WIDTH - PAD.right}
      y1={scale.y(baseline.inches)}
      y2={scale.y(baseline.inches)}
      stroke={BASELINE_COLOUR}
      stroke-width="1.5"
      stroke-dasharray="5 4"
    />

    {#each bars as bar (bar.key)}
      <!-- Focusable on purpose: a bar is how a keyboard reader reaches the
           year's own figure and how it stands against the average. -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <g
        tabindex="0"
        role="img"
        aria-label={bar.isBaseline
          ? `${bar.label}, ${baseline.from} to ${baseline.to}: ${inches.format(bar.value)} inches by ${longDate(current?.throughDate ?? "")}`
          : `${bar.label}: ${inches.format(bar.value)} inches by ${longDate(current?.throughDate ?? "")}, ${against(bar.value)}${
              bar.year?.filledDays
                ? `. ${bar.year.filledDays} ${bar.year.filledDays === 1 ? "day carries" : "days carry"} no reading from the city's own gauge`
                : ""
            }`}
        onpointerenter={() => (active = bar.key)}
        onpointerleave={() => (active = null)}
        onfocus={() => (active = bar.key)}
        onblur={() => (active = null)}
      >
        <rect
          x={bar.x - barW / 2}
          y={scale.y(bar.value)}
          width={barW}
          height={Math.max(0, scale.y(0) - scale.y(bar.value))}
          rx="2"
          fill={bar.colour}
          opacity={active === null || active === bar.key ? 1 : 0.55}
        />

        <!-- Its own figure, always drawn: five bars leave room for it, and a
             number a reader has to hover for is a number half of them never
             see. -->
        <text
          x={bar.x}
          y={scale.y(bar.value) - 7}
          text-anchor="middle"
          class="text-[11px] tabular-nums {bar.isCurrent
            ? 'fill-slate-900 font-semibold'
            : 'fill-slate-600'}"
        >
          {inches.format(bar.value)}"
        </text>

        <text
          x={bar.x}
          y={HEIGHT - (bar.sub ? 21 : 16)}
          text-anchor="middle"
          class="text-[11px] {bar.isCurrent ? 'fill-slate-900 font-semibold' : 'fill-slate-600'}"
        >
          {bar.label}
        </text>
        {#if bar.sub}
          <text x={bar.x} y={HEIGHT - 9} text-anchor="middle" class="fill-slate-500 text-[10px]">
            {bar.sub}
          </text>
        {/if}
      </g>
    {/each}
  </svg>

  <!-- The same five figures, for a reader who hovers nothing. Here so
       nothing is only visible to a mouse, not to summarise. -->
  <table class="sr-only">
    <caption>
      Rainfall in inches by year, each read to {longDate(current?.throughDate ?? "")}
    </caption>
    <thead>
      <tr>
        <th scope="col">Year</th>
        <th scope="col">Rainfall</th>
        <th scope="col">Against the {baseline.years}-year average</th>
      </tr>
    </thead>
    <tbody>
      {#each bars as bar (bar.key)}
        <tr>
          <th scope="row">{bar.isBaseline ? `${bar.label} (${bar.sub})` : bar.label}</th>
          <td>{inches.format(bar.value)} in</td>
          <td>{bar.isBaseline ? "—" : against(bar.value)}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- The day every bar is read to. A reader cannot infer it from bars, and
       it is what makes the current year's bar comparable with the rest. -->
  <figcaption class="mt-2 text-xs text-slate-500">
    Inches of rain since January 1st, each year read to {longDate(current?.throughDate ?? "")} — the last
    day Haverhill's gauges have reported {current?.year}. The dashed rule is the
    {baseline.years}-year average, {baseline.from}&ndash;{baseline.to}.
  </figcaption>
</figure>
