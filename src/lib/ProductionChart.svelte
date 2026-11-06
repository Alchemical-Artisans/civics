<!--
  Forty trailing twelve-month windows: water produced as bars, with the same
  windows' rainfall and mean temperature over them as lines. See
  $lib/server/water-series for how a window is tiled and why the rows arrive
  from a server load rather than an import.

  **Every series is drawn as its departure from its own forty-year normal,
  which is what lets one axis carry three of them.** Gallons, inches and
  degrees share no scale -- the earlier version of this chart gave gallons
  and inches an axis each, and where the two crossed meant nothing at all.
  Departures have no units to disagree about, so there is one axis here, one
  set of gridlines, and a zero that means the same thing for all three: an
  ordinary year for that measurement.

  Departure in **standard deviations**, not per cent, because per cent is
  wrong for temperature: °F has an arbitrary zero, so "4% warmer than
  normal" is not a quantity. Dividing each series by its own spread also
  puts them on equal visual footing -- rainfall swings ±20% of its mean
  where temperature moves a degree or two, and a shared per-cent axis would
  draw temperature as a flat line whatever it did. The hover carries the
  real figures in real units, so nothing here has to be read in sigmas to
  get a number.

  **This is also why the bars are no longer zero-based in gallons.** A bar's
  length is its value, so a truncated gallons axis would have drawn lengths
  that lie; the fix is not to cut the axis but to change what the bar
  measures. Against a normal, zero is meaningful again and the bar's length
  is an honest reading of how far from ordinary that year was.

  **The three series are not the same kind of evidence.** The bars are
  fabricated (data/consumption/README.md) and their departures are the
  placeholder's own noise, not a signal; the two lines are the Haverhill
  COOP station's own record. The legend says which is which. An open point
  marks a window the station did not record in full, whose figure is a floor
  rather than a reading.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"

  interface WindowRow {
    startDate: string
    endDate: string
    producedMg: number
    rainfallInches: number
    rainfallMissingDays: number
    avgTempF: number
    tempMissingDays: number
  }

  let { windows }: { windows: WindowRow[] } = $props()

  // Blue, orange and violet: the palette's own slots 1, 2 and 4, which
  // clear the dataviz separation checks together where its blue/teal pair
  // does not. Violet for temperature is the one concession -- a warm hue
  // would read better, but every warm pairing here collides with rainfall's
  // orange under simulated colour-blindness.
  const PRODUCED = COLOURS[0]
  const RAIN = COLOURS[1]
  const TEMP = COLOURS[3]

  const WIDTH = 620
  const HEIGHT = 230
  const MARGIN = { top: 10, right: 14, bottom: 20, left: 40 }
  const innerW = WIDTH - MARGIN.left - MARGIN.right
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom
  const GAP = 2

  /** A label under every bar is forty labels; this marks both ends and every fifth between. */
  const LABEL_EVERY = 5

  /**
   * Days a window can be missing from the station's record before its
   * figure is drawn as a floor rather than a reading -- 5% of a year. A
   * missing day is not a dry day or a cold one.
   */
  const INCOMPLETE_ABOVE = 18

  const gallons = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })
  const inches = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 })
  const degrees = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 })
  const sigma = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  })

  const parse = (date: string) => new Date(`${date}T00:00:00Z`)

  const longLabel = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(parse(date))

  const monthOf = (date: string) =>
    new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(parse(date))

  const mean = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length

  /** Population standard deviation -- these forty windows are the whole record, not a sample of it. */
  function spread(values: number[]): number {
    const m = mean(values)
    return Math.sqrt(mean(values.map((v) => (v - m) ** 2)))
  }

  /** How far from its own normal a value sits, in that series' own standard deviations. */
  function departures(values: number[]): { normal: number; sd: number; z: number[] } {
    const normal = mean(values)
    const sd = spread(values)
    return { normal, sd, z: values.map((v) => (sd ? (v - normal) / sd : 0)) }
  }

  const produced = $derived(departures(windows.map((w) => w.producedMg)))
  const rainfall = $derived(departures(windows.map((w) => w.rainfallInches)))
  const temperature = $derived(departures(windows.map((w) => w.avgTempF)))

  /** Round tops a scale is allowed to stop at, as multiples of its own magnitude. */
  const NICE_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10]

  function niceTop(max: number): number {
    if (max <= 0) return 1
    const magnitude = 10 ** Math.floor(Math.log10(max))
    const step = NICE_STEPS.find((candidate) => max / magnitude <= candidate) ?? 10
    return step * magnitude
  }

  /** Symmetric about zero: a year above normal and one below should read the same distance. */
  const top = $derived(
    niceTop(Math.max(...[...produced.z, ...rainfall.z, ...temperature.z].map(Math.abs), 1)),
  )

  const last = $derived(windows.length - 1)
  const barW = $derived((innerW - (windows.length - 1) * GAP) / windows.length)
  const barX = (i: number) => MARGIN.left + i * (barW + GAP)
  const centreX = (i: number) => barX(i) + barW / 2

  /** Zero sits in the middle; the axis runs from +top down to -top. */
  const yOf = (z: number) => MARGIN.top + innerH / 2 - (z / top) * (innerH / 2)
  const zeroY = $derived(yOf(0))

  const rows = $derived(
    windows.map((row, i) => ({
      key: row.endDate,
      tick: `'${row.endDate.slice(2, 4)}`,
      labelled: (last - i) % LABEL_EVERY === 0 || i === 0,
      x: barX(i),
      centre: centreX(i),
      producedZ: produced.z[i],
      rainZ: rainfall.z[i],
      tempZ: temperature.z[i],
      producedMg: row.producedMg,
      rainfallInches: row.rainfallInches,
      avgTempF: row.avgTempF,
      rainIncomplete: row.rainfallMissingDays > INCOMPLETE_ABOVE,
      tempIncomplete: row.tempMissingDays > INCOMPLETE_ABOVE,
      rainfallMissingDays: row.rainfallMissingDays,
      tempMissingDays: row.tempMissingDays,
      span: `${longLabel(row.startDate)} – ${longLabel(row.endDate)}`,
    })),
  )

  const linePath = (key: "rainZ" | "tempZ") =>
    rows
      .map((r, i) => `${i === 0 ? "M" : "L"} ${r.centre.toFixed(1)} ${yOf(r[key]).toFixed(1)}`)
      .join(" ")

  const anyIncomplete = $derived(rows.some((r) => r.rainIncomplete || r.tempIncomplete))

  /** Gridlines at whole standard deviations, zero included and drawn darker. */
  const gridlines = $derived(
    Array.from({ length: Math.floor(top) * 2 + 1 }, (_, i) => Math.floor(top) - i),
  )

  const window = $derived(
    windows.length ? `12 months ending ${monthOf(windows[last].endDate)}` : "",
  )

  let active = $state<string | null>(null)
  const shown = $derived(rows.find((row) => row.key === active) ?? null)
  const lit = (key: string) => active === null || active === key
</script>

<div class="production-chart not-prose relative">
  <p class="m-0 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
    <span>
      <span class="mr-1 inline-block h-2 w-2 rounded-xs align-middle" style="background: {PRODUCED}"
      ></span>Water produced <span class="text-slate-400">(fabricated)</span>
    </span>
    <span>
      <span class="mr-1 inline-block h-2 w-2 rounded-xs align-middle" style="background: {RAIN}"
      ></span>Rainfall <span class="text-slate-400">(station record)</span>
    </span>
    <span>
      <span class="mr-1 inline-block h-2 w-2 rounded-xs align-middle" style="background: {TEMP}"
      ></span>Mean temperature <span class="text-slate-400">(station record)</span>
    </span>
  </p>

  <svg
    viewBox="0 0 {WIDTH} {HEIGHT}"
    style="aspect-ratio: {WIDTH} / {HEIGHT}"
    class="mt-1 h-auto w-full"
    role="img"
    aria-label="Forty years of water produced, rainfall and mean temperature, each drawn as its distance from its own forty-year normal. Every window's own figures are reachable below."
  >
    {#each gridlines as line (line)}
      <line
        x1={MARGIN.left}
        x2={WIDTH - MARGIN.right}
        y1={yOf(line)}
        y2={yOf(line)}
        stroke={line === 0 ? "#94a3b8" : "#e2e8f0"}
        stroke-width="1"
      />
      <text
        x={MARGIN.left - 6}
        y={yOf(line)}
        text-anchor="end"
        dominant-baseline="middle"
        class="fill-slate-400 text-[9px]"
      >
        {line === 0 ? "normal" : sigma.format(line)}
      </text>
    {/each}

    {#each rows as row (row.key)}
      <rect
        x={row.x}
        y={Math.min(zeroY, yOf(row.producedZ))}
        width={barW}
        height={Math.abs(yOf(row.producedZ) - zeroY)}
        fill={PRODUCED}
        opacity={lit(row.key) ? 1 : 0.35}
      />
    {/each}

    <path
      d={linePath("rainZ")}
      fill="none"
      stroke={RAIN}
      stroke-width="2"
      stroke-linejoin="round"
    />
    <path
      d={linePath("tempZ")}
      fill="none"
      stroke={TEMP}
      stroke-width="2"
      stroke-linejoin="round"
    />

    <!-- An open point is a window the station did not record in full: its
         figure is a floor, not a reading. Drawn on the line rather than
         noted beneath it, so the shape can't be read without them. -->
    {#each rows.filter((r) => r.rainIncomplete) as row (row.key)}
      <circle
        cx={row.centre}
        cy={yOf(row.rainZ)}
        r="3"
        fill="white"
        stroke={RAIN}
        stroke-width="1.5"
      />
    {/each}
    {#each rows.filter((r) => r.tempIncomplete) as row (row.key)}
      <circle
        cx={row.centre}
        cy={yOf(row.tempZ)}
        r="3"
        fill="white"
        stroke={TEMP}
        stroke-width="1.5"
      />
    {/each}

    <!-- One hit target per window, the full height of the plot, so the
         lines are as reachable as the bar under them. -->
    {#each rows as row (row.key)}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <rect
        x={row.x}
        y={MARGIN.top}
        width={barW}
        height={innerH}
        fill="transparent"
        class="cursor-default outline-none"
        role="img"
        aria-label="{row.span}: {gallons.format(row.producedMg)} million gallons produced
          (fabricated), {sigma.format(row.producedZ)} standard deviations from normal;
          {inches.format(row.rainfallInches)} inches of rain, {sigma.format(
          row.rainZ,
        )} from normal{row.rainIncomplete
          ? `, ${row.rainfallMissingDays} days unrecorded`
          : ''}; mean temperature {degrees.format(row.avgTempF)} degrees Fahrenheit,
          {sigma.format(row.tempZ)} from normal{row.tempIncomplete
          ? `, ${row.tempMissingDays} days unrecorded`
          : ''}"
        tabindex="0"
        onpointerenter={() => (active = row.key)}
        onpointerleave={() => (active = null)}
        onfocus={() => (active = row.key)}
        onblur={() => (active = null)}
      ></rect>
    {/each}

    {#each rows as row (row.key)}
      {#if row.labelled}
        <text
          x={row.centre}
          y={HEIGHT - 6}
          text-anchor="middle"
          class="fill-slate-500 text-[9px]"
          aria-hidden="true"
        >
          {row.tick}
        </text>
      {/if}
    {/each}
  </svg>

  <p class="m-0 flex flex-wrap justify-between gap-x-4 text-[10px] text-slate-500">
    <span>
      {#if anyIncomplete}
        <span
          class="mr-1 inline-block h-2 w-2 rounded-full border-[1.5px] bg-white align-middle"
          style="border-color: {RAIN}"
        ></span>the station missed days that year, so the figure is a floor
      {/if}
    </span>
    <span>{window}</span>
  </p>

  {#if shown}
    <div
      class="pointer-events-none absolute top-4 z-10 -translate-x-1/2 -translate-y-full rounded-md bg-white/95 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md ring-1 ring-slate-200"
      style="left: {Math.min(Math.max((shown.centre / WIDTH) * 100, 16), 84)}%"
      aria-hidden="true"
    >
      <span class="block font-medium text-slate-900">{shown.span}</span>
      <span class="block text-slate-600 tabular-nums">
        <span class="inline-block h-2 w-2 rounded-xs align-middle" style="background: {PRODUCED}"
        ></span>
        {gallons.format(shown.producedMg)} MG
        <span class="text-slate-400">({sigma.format(shown.producedZ)}&sigma;)</span>
      </span>
      <span class="block text-slate-600 tabular-nums">
        <span class="inline-block h-2 w-2 rounded-xs align-middle" style="background: {RAIN}"
        ></span>
        {inches.format(shown.rainfallInches)} in
        <span class="text-slate-400">({sigma.format(shown.rainZ)}&sigma;)</span>
        {#if shown.rainIncomplete}
          <span class="text-slate-400">&mdash; {shown.rainfallMissingDays}d unrecorded</span>
        {/if}
      </span>
      <span class="block text-slate-600 tabular-nums">
        <span class="inline-block h-2 w-2 rounded-xs align-middle" style="background: {TEMP}"
        ></span>
        {degrees.format(shown.avgTempF)}&deg;F
        <span class="text-slate-400">({sigma.format(shown.tempZ)}&sigma;)</span>
        {#if shown.tempIncomplete}
          <span class="text-slate-400">&mdash; {shown.tempMissingDays}d unrecorded</span>
        {/if}
      </span>
    </div>
  {/if}
</div>
