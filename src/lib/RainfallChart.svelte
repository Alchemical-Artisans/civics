<!--
  Haverhill's rainfall, one bar a year, with a ten-year average beside them.

  **Bars per year, not a line per month.** This chart answers "how has the
  rainfall changed year to year", and the answer to that is one bar per year;
  a seasonal line per year answers "when in the year does it rain", which is
  a different question and buries this one. It was a month-by-month line
  chart for a while, two years overlaid, with cumulative and lake-level
  panels stacked under it -- three panels of one tall column, from which the
  trend this draws in five bars could not be read at all.

  **A bar is a whole calendar year, and the unfinished one says so twice.**
  Every bar used to be `toDateInches` instead -- each year summed only to the
  current year's own last read day, the average with it -- so that a year ten
  months old was never drawn against twelve months of anything. That is safe
  and it is also not what the chart is asked: "how much rain did 2024 get" is
  a question about 2024, and a reader comparing nine years of ten-month
  figures has to be told, and remember, that none of the numbers is the year's
  own. So the bars are `totalInches` now. What keeps the running year from
  reading as a dry one is that it is labelled as unfinished and carries a
  ghost: a dashed outline above its solid bar, `averageRemainder` -- what the
  previous ten years added on average after this date. That ghost is the one
  quantity on this chart nobody measured, and the legend and the caption both
  say so.

  **The average is a line and nothing else.** A faint dashed rule across the
  bars, because the thing worth seeing is which years fall under it, and
  eye-tracking from a bar at one end of the chart to a bar at the other is
  exactly the comparison bars are bad at. It had a bar of its own to the right
  as well, set apart by a gap and a neutral colour, which earned its place
  while there were four years to anchor; at ten the rule already crosses every
  bar it is meant to be compared with, and an eleventh bar standing for the
  average of the ten beside it reads as one more year.

  Colour: the current year in `chart-colours.ts`'s own orange (slot 2) --
  the drought year in the hue the site's drought scale was built on -- the
  years behind it lighter, and the average in slate, since it is a reference
  rather than a year. Picked by name rather than by position, so the current year stays
  orange whatever the span's length.

  Every bar prints its own figure, so there is no tooltip here and nothing is
  visible only to a mouse; each bar carries its figure as an accessible name
  and the table underneath carries every one of them again. The drawing
  itself is a link to the daily records it is summed from -- see the comment
  on the anchor below, and the one on the bars for why they are named but
  not focusable.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"
  import { type PrecipitationYear, longDate } from "./precipitation"

  interface Baseline {
    /** Mean of their whole-year totals -- what the dashed rule draws. */
    fullYearInches: number
    /** Mean of what they added after that day -- the ghost. Estimated. */
    remainderInches: number
    from: number
    to: number
    years: number
  }

  /** Where the figures came from, for the link the whole drawing is. */
  interface Source {
    href: string
    /** Named, not described: it goes in a legend row with no room for prose. */
    name: string
  }

  let {
    years,
    baseline,
    source,
  }: { years: PrecipitationYear[]; baseline: Baseline; source: Source } = $props()

  /** The drought hue, for whichever year is the current one. */
  const CURRENT_COLOUR = COLOURS[1]
  /** The years behind it, oldest first. */
  const EARLIER_COLOURS = [COLOURS[0], COLOURS[2], COLOURS[3], COLOURS[4], COLOURS[5]]
  /**
   * The average is a reference, not a year, so it is not on the year ramp.
   *
   * Slate-500 rather than the slate-400 this was. Which years fall under the
   * rule is the whole point of drawing it, which makes it a graphical object
   * a reader has to make out: 1.4.11 asks 3:1 of one, and slate-400 on white
   * is 2.56:1. Slate-500 is 4.76:1 and reads as the same grey. The zero axis
   * and the gridlines are still the lighter one -- they are the frame rather
   * than a quantity, and darkening them would cost the rule the distinction
   * this gives it.
   */
  const BASELINE_COLOUR = "#64748b"

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
   * A year is still running when its record stops short of December 31st.
   * Read off the data rather than by comparing to a clock: the scrape and the
   * build are separate acts, and the chart must say what the record says.
   */
  const isRunning = (year: PrecipitationYear) => !year.throughDate.endsWith("-12-31")

  /**
   * Zero-based and rounded out to a whole ten inches: inches of rain is a
   * quantity, so a bar's height has to be its share of the axis, and a
   * cropped axis would turn a seven-inch shortfall into a cliff.
   */
  const scale = $derived.by(() => {
    const max = Math.max(
      baseline.fullYearInches,
      ...years.map((y) => y.totalInches + (isRunning(y) ? baseline.remainderInches : 0)),
      1,
    )
    const high = Math.ceil(max / 10) * 10
    const y = (value: number) => PAD.top + PLOT_H - (value / high) * PLOT_H
    const ticks: number[] = []
    for (let v = 10; v <= high; v += 10) ticks.push(v)
    return { high, y, ticks }
  })

  /** One slot a year, the gap for the average's own bar having gone with it. */
  const SLOTS = $derived(years.length)
  const slotW = $derived(PLOT_W / SLOTS)
  const barW = $derived(Math.min(48, slotW * 0.62))
  const centre = (slot: number) => PAD.left + slotW * (slot + 0.5)

  /**
   * Years only. The average had a bar of its own beside them, set apart by a
   * gap; it is the dashed rule and nothing else now. With four bars the extra
   * one was a useful anchor to read them against, but at ten the rule already
   * crosses every bar it is meant to be compared with, and a bar standing for
   * an average of the bars next to it reads as an eleventh year.
   */
  const bars = $derived(
    years.map((year, i) => ({
      key: String(year.year),
      label: String(year.year),
      sub: null as string | null,
      value: year.totalInches,
      /** Only the unfinished year carries a ghost, and only it is `running`. */
      running: isRunning(year),
      ghost: isRunning(year) ? baseline.remainderInches : 0,
      colour: i === years.length - 1 ? CURRENT_COLOUR : EARLIER_COLOURS[i % EARLIER_COLOURS.length],
      isCurrent: i === years.length - 1,
      isBaseline: false,
      x: centre(i),
      year,
    })),
  )

  /** The unfinished year, if any -- what the caption has to explain. */
  const running = $derived(years.find(isRunning) ?? null)

  /** Which bar is hovered or focused, for the highlight only -- no tooltip. */
  let active = $state<string | null>(null)

  const against = (value: number) => {
    const delta = Math.round((value - baseline.fullYearInches) * 100) / 100
    if (delta === 0) return `level with the ${baseline.years}-year average`
    return `${inches.format(Math.abs(delta))} inches ${delta > 0 ? "above" : "below"} the ${baseline.years}-year average`
  }
</script>

<figure class="not-prose mx-auto my-0 max-w-xl">
  <!-- The whole drawing is one link to the daily records it is summed from.
       The chart carried no attribution at all -- every other figure on this
       page names its source in prose or a caption, and ten bars of rainfall
       named none, which for the one chart here built out of a dataset rather
       than quoted off a city document is the wrong way round.

       A link around the chart rather than a line of small print under it,
       at the site owner's direction: the figures are the citation's own
       subject, so the thing a reader is looking at is the thing to click.
       It wraps the legend too, so there is no dead strip inside the figure
       that looks like the chart and is not the link.

       Clicking a bar therefore navigates. The bars stay focusable and keep
       their hover highlight -- nothing is laid over them, so the pointer
       still reaches them -- and nothing is lost by the click going here
       instead, because a bar has no action of its own: it prints its figure
       unconditionally and has never had a tooltip.

       `no-underline` because `.prose a` underlines every link in an island,
       which here would rule a line under the legend; the source row puts the
       underline back on hover, so the figure still behaves like a link. -->
  <a
    class="group block no-underline"
    href={source.href}
    target="_blank"
    rel="external noopener noreferrer"
    aria-label="The daily rainfall records behind this chart, at {source.name} (opens in a new tab)"
  >
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
        y1={scale.y(baseline.fullYearInches)}
        y2={scale.y(baseline.fullYearInches)}
        stroke={BASELINE_COLOUR}
        stroke-width="1.5"
        stroke-dasharray="5 4"
      />

      {#each bars as bar (bar.key)}
        <!-- Named but not focusable. Each bar was `tabindex="0"`, on the
             reasoning that a bar is how a keyboard reader reaches the year's
             figure -- but the whole drawing is a link now, and a focusable
             child inside one means Tab lands on "2023: 64.87 inches" and
             Enter leaves the site for xmACIS2. A bar has no action of its
             own to justify that: it prints its figure unconditionally and
             has never had a tooltip, so focusing one showed nothing a
             reader was not already looking at. `role="img"` and the label
             stay, so a screen reader still reads every bar where it stands;
             what goes is ten tab stops and a link fired by mistake. -->
        <g
          role="img"
          aria-label={`${bar.label}: ${inches.format(bar.value)} inches${
            bar.running
              ? ` so far, to ${longDate(current?.throughDate ?? "")} — the year is not over, and a typical one adds ${inches.format(bar.ghost)} more after this date`
              : ` over the year, ${against(bar.value)}`
          }${
            bar.year?.filledDays
              ? `. ${bar.year.filledDays} ${bar.year.filledDays === 1 ? "day carries" : "days carry"} no reading from the city's own gauge`
              : ""
          }`}
          onpointerenter={() => (active = bar.key)}
          onpointerleave={() => (active = null)}
        >
          <rect
            x={bar.x - barW / 2}
            y={scale.y(bar.value)}
            width={barW}
            height={Math.max(0, scale.y(0) - scale.y(bar.value))}
            fill={bar.colour}
            opacity={active === null || active === bar.key ? 1 : 0.55}
          />

          <!-- The ghost: what a typical year still adds after today's date,
               stacked on what has actually fallen. Drawn in outline with no
               solid fill and the figure in brackets, because it is the one
               quantity on this chart nobody measured -- an average of ten past
               remainders, spread wide. It exists so a year ten months old is
               not read as a dry year; it must never be read as rain. -->
          {#if bar.running && bar.ghost > 0}
            <rect
              x={bar.x - barW / 2}
              y={scale.y(bar.value + bar.ghost)}
              width={barW}
              height={Math.max(0, scale.y(bar.value) - scale.y(bar.value + bar.ghost))}
              fill={bar.colour}
              fill-opacity="0.13"
              stroke={bar.colour}
              stroke-width="1"
              stroke-dasharray="3 2"
            />
            <text
              x={bar.x}
              y={scale.y(bar.value + bar.ghost) - 6}
              text-anchor="middle"
              class="fill-slate-500 text-[10px] tabular-nums"
            >
              (+{inches.format(bar.ghost)}")
            </text>
          {/if}

          <!-- Its own figure, always drawn: five bars leave room for it, and a
               number a reader has to hover for is a number half of them never
               see. -->
          <text
            x={bar.x}
            y={scale.y(bar.value) + (bar.running ? 12 : -7)}
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

    <!-- A legend rather than a paragraph, because only two marks on this chart
         need decoding and prose was a wordy way to do it: the dashed rule has
         no label, and neither does the outlined block. The block especially --
         it is the one quantity here nobody measured, and a reader who takes it
         for rain has been misled by us.

         The fuller wording lives in the caption below, which is `sr-only`: a
         swatch beside a line of text says in a glance what a sentence has to
         spell out, but a swatch says nothing at all to a screen reader. -->
    <ul
      aria-hidden="true"
      class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 p-0 text-xs text-slate-500"
    >
      <li class="m-0 flex items-center gap-1.5">
        <svg width="22" height="8" aria-hidden="true" class="shrink-0">
          <line
            x1="0"
            y1="4"
            x2="22"
            y2="4"
            stroke={BASELINE_COLOUR}
            stroke-width="1.5"
            stroke-dasharray="5 4"
          />
        </svg>
        <span>{baseline.years}-yr average {inches.format(baseline.fullYearInches)}"</span>
      </li>
      {#if running}
        <li class="m-0 flex items-center gap-1.5">
          <svg width="14" height="12" aria-hidden="true" class="shrink-0">
            <rect
              x="0.5"
              y="0.5"
              width="13"
              height="11"
              fill={CURRENT_COLOUR}
              fill-opacity="0.13"
              stroke={CURRENT_COLOUR}
              stroke-width="1"
              stroke-dasharray="3 2"
            />
          </svg>
          <span>predicted rest of year</span>
        </li>
      {/if}
    </ul>
  </a>

  <!-- The same five figures, for a reader who hovers nothing. Here so
       nothing is only visible to a mouse, not to summarise.

       **`sr-only` goes on a wrapper, never on the table itself.** The class
       is `width: 1px` with `overflow: hidden` and `white-space: nowrap`, and
       a table will not lay out narrower than its own widest cell: the table
       kept its natural 591px and that box still counted towards the
       document's scrollable overflow, so a phone could be swiped sideways
       over 280px of nothing. A `div` honours the 1px and clips the table
       inside it, which takes the overflow out while leaving every row where
       a screen reader can read it. -->
  <div class="sr-only">
    <table>
      <caption>Rainfall in inches by year</caption>
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
            <th scope="row">{bar.label}{bar.running ? " (so far)" : ""}</th>
            <td>{inches.format(bar.value)} in</td>
            <td>
              {bar.running
                ? `year not over; a typical one adds ${inches.format(bar.ghost)} in after this date`
                : against(bar.value)}
            </td>
          </tr>
        {/each}
      </tbody>
      <!-- The average lost its bar, not its figure. It is still the thing every
         row above is measured against, and the dashed rule states it to anyone
         looking at the drawing; a reader who is not must get it here. -->
      <tfoot>
        <tr>
          <th scope="row">{baseline.years}-yr avg ({baseline.from}&ndash;{baseline.to})</th>
          <td>{inches.format(baseline.fullYearInches)} in</td>
          <td>&mdash;</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- Said in full for a reader who cannot see the legend above. Everything
       the swatches stand for, plus the part no swatch can carry: that the
       outlined block is an average of ten past remainders and those ten
       ranged widely around it. -->
  <figcaption class="sr-only">
    Inches of rain over the whole calendar year. The dashed rule is the {baseline.years}-year
    average, {baseline.from}&ndash;{baseline.to}, at {inches.format(baseline.fullYearInches)} inches.
    {#if running}
      {running.year} is not over: its solid bar is what has fallen to {longDate(
        current?.throughDate ?? "",
      )}, and the outlined block above it is {inches.format(baseline.remainderInches)} inches &mdash;
      what the previous {baseline.years} years added on average after this date. That block is an expectation,
      not rainfall, and those ten years ranged widely around it.
    {/if}
  </figcaption>
</figure>
