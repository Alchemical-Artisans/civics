<!--
  Daily water production in 2026 against 2022, over the months the outdoor
  restrictions covered.

  **Two years a day at a time, where the rainfall chart is one bar a year.**
  The question here is not how a year compares with another year -- the
  department states that outright, and the caption quotes it -- but whether
  the gap holds up day after day or rests on a few weeks. 122 points a line
  shows that; a pair of bars cannot.

  **These are read off the department's slide, not published as numbers**, so
  the lines are drawn dotted, the register this site draws a pixel reading in.
  See `$lib/water-usage.ts` for the calibration, the precision and the check
  that validates it: summing the day-by-day gap reproduces the department's
  own stated 150 million gallons to within half a percent.

  Colour follows `chart-colours.ts` -- the current year in the drought orange,
  the earlier year behind it -- which happens to be the way the city drew it
  too. Where 2022 goes missing behind the 2026 line the path breaks rather
  than bridging, so a gap reads as a gap.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"
  import { MONTH_NAMES } from "./precipitation"
  import { WATER_USAGE_SAVING, type WaterUsageDay } from "./water-usage"

  let { days }: { days: WaterUsageDay[] } = $props()

  const CURRENT = COLOURS[1]
  const EARLIER = COLOURS[0]

  const WIDTH = 460
  const PAD = { top: 20, right: 10, bottom: 30, left: 32 }
  const PLOT_H = 150
  const HEIGHT = PAD.top + PLOT_H + PAD.bottom
  const PLOT_W = WIDTH - PAD.left - PAD.right

  const mgd = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const x = (i: number) => PAD.left + (i / (days.length - 1)) * PLOT_W

  /** Zero-based: gallons is a quantity, and the gap is read against the floor. */
  const scale = $derived.by(() => {
    const max = Math.max(...days.flatMap((d) => [d.mgd2022 ?? 0, d.mgd2026]))
    const high = Math.ceil(max / 2) * 2
    const y = (v: number) => PAD.top + PLOT_H - (v / high) * PLOT_H
    const ticks: number[] = []
    for (let v = 2; v <= high; v += 2) ticks.push(v)
    return { high, y, ticks }
  })

  /**
   * One path per unbroken run. A null is a day the other line hides, and
   * joining across it would draw a straight segment the data does not have.
   */
  const runs = (pick: (d: WaterUsageDay) => number | null) =>
    days
      .reduce<string[]>(
        (paths, day, i) => {
          const v = pick(day)
          if (v === null) return [...paths, ""]
          const point = `${x(i).toFixed(1)} ${scale.y(v).toFixed(1)}`
          const last = paths.at(-1)
          return last
            ? [...paths.slice(0, -1), `${last} L${point}`]
            : [...paths.slice(0, -1), `M${point}`]
        },
        [""],
      )
      .filter((d) => d.includes("L"))

  const series = $derived([
    { year: 2026, colour: CURRENT, paths: runs((d) => d.mgd2026), isCurrent: true },
    { year: 2022, colour: EARLIER, paths: runs((d) => d.mgd2022), isCurrent: false },
  ])

  /** Month starts, for the axis -- the slide's own 15th-of-the-month labels. */
  const marks = $derived(
    days
      .map((d, i) => ({ i, day: d.date }))
      .filter(({ day }) => day.endsWith("-15"))
      .map(({ i, day }) => ({ i, label: `${MONTH_NAMES[Number(day.slice(0, 2)) - 1]} 15` })),
  )

  /** A month's mean, which is what the sr-only table carries. */
  const monthly = $derived.by(() => {
    const buckets = new Map<string, { a: number[]; b: number[] }>()
    for (const d of days) {
      const m = d.date.slice(0, 2)
      const bucket = buckets.get(m) ?? { a: [], b: [] }
      if (d.mgd2022 !== null) bucket.a.push(d.mgd2022)
      bucket.b.push(d.mgd2026)
      buckets.set(m, bucket)
    }
    const mean = (xs: number[]) => xs.reduce((s, v) => s + v, 0) / xs.length
    return [...buckets.entries()].map(([m, { a, b }]) => ({
      label: MONTH_NAMES[Number(m) - 1],
      a: mean(a),
      b: mean(b),
    }))
  })
</script>

<figure class="not-prose mx-auto my-0 max-w-xl">
  <svg
    viewBox="0 0 {WIDTH} {HEIGHT}"
    class="block h-auto w-full"
    role="group"
    aria-label="Water production a day, {WATER_USAGE_SAVING.from} to {WATER_USAGE_SAVING.to}, 2026 against 2022"
  >
    <text x={PAD.left} y={PAD.top - 7} class="fill-slate-600 text-[11px] font-medium">
      Water produced, million gallons a day
    </text>

    {#each scale.ticks as tick (tick)}
      <line
        x1={PAD.left}
        x2={WIDTH - PAD.right}
        y1={scale.y(tick)}
        y2={scale.y(tick)}
        stroke="#e2e8f0"
      />
      <text
        x={PAD.left - 6}
        y={scale.y(tick) + 4}
        text-anchor="end"
        class="fill-slate-500 text-[11px]"
      >
        {tick}
      </text>
    {/each}
    <line x1={PAD.left} x2={WIDTH - PAD.right} y1={scale.y(0)} y2={scale.y(0)} stroke="#94a3b8" />

    {#each series as line (line.year)}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <g
        tabindex="0"
        role="img"
        aria-label="{line.year}: {mgd.format(
          monthly.reduce((s, m) => s + (line.isCurrent ? m.b : m.a), 0) / monthly.length,
        )} million gallons a day on average over the period"
      >
        {#each line.paths as d, i (i)}
          <path
            {d}
            fill="none"
            stroke={line.colour}
            stroke-width={line.isCurrent ? 1.6 : 1.3}
            stroke-dasharray="1.5 2"
            stroke-linecap="round"
          />
        {/each}
      </g>
    {/each}

    {#each marks as mark (mark.i)}
      <text x={x(mark.i)} y={HEIGHT - 10} text-anchor="middle" class="fill-slate-500 text-[11px]">
        {mark.label}
      </text>
    {/each}
  </svg>

  <ul class="mt-2 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs">
    {#each series as line (line.year)}
      <li class="m-0 flex items-center gap-1.5">
        <span
          class="inline-block w-4 rounded"
          style="background: {line.colour}; height: {line.isCurrent ? 3 : 2}px"
        ></span>
        <span class={line.isCurrent ? "font-semibold text-slate-900" : "text-slate-600"}>
          {line.year}
        </span>
      </li>
    {/each}
  </ul>

  <!-- A month's mean rather than all 122 days: the daily series is dense and
       its point is the shape, which 122 spoken rows do not convey. The figure
       that matters is the department's own stated total, and the caption
       carries that in words. -->
  <table class="sr-only">
    <caption>Average water produced each month, million gallons a day</caption>
    <thead>
      <tr><th scope="col">Month</th><th scope="col">2022</th><th scope="col">2026</th></tr>
    </thead>
    <tbody>
      {#each monthly as row (row.label)}
        <tr>
          <th scope="row">{row.label}</th>
          <td>{mgd.format(row.a)}</td>
          <td>{mgd.format(row.b)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</figure>
