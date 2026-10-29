<!--
  Daily water production across three summers: 2022 and 2023 as the Water
  Department drew them, and 2026 under the outdoor restrictions.

  **A day at a time, where the rainfall chart is one bar a year.** The
  question is not how a year compares with another year -- the department
  states that outright and the caption quotes it -- but whether the gap holds
  day after day or rests on a few weeks. Six months of daily points show
  that; a pair of bars cannot.

  **These are read off the department's slides, not published as numbers**, so
  every line is dotted, the register this site draws a pixel reading in. See
  `$lib/water-usage.ts` for the calibration and for the three checks that
  validate it -- including the one that measures the precision rather than
  asserting it, 2022 being drawn on both slides and read twice.

  A year is null where another line hides it, or outside the window its own
  slide draws; the path breaks there rather than bridging, so a gap reads as
  a gap and 2026 does not appear to begin at zero in April.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"
  import { MONTH_NAMES } from "./precipitation"
  import { WATER_USAGE_SOURCE, WATER_USAGE_STATED, type WaterUsageDay } from "./water-usage"

  let { days }: { days: WaterUsageDay[] } = $props()

  const WIDTH = 460
  const PAD = { top: 20, right: 10, bottom: 30, left: 30 }
  const PLOT_H = 150
  const HEIGHT = PAD.top + PLOT_H + PAD.bottom
  const PLOT_W = WIDTH - PAD.left - PAD.right

  const mgd = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })

  const x = (i: number) => PAD.left + (i / (days.length - 1)) * PLOT_W

  /** Zero-based: gallons is a quantity, and the gaps are read against the floor. */
  const scale = $derived.by(() => {
    const values = days.flatMap((d) => [d.mgd2022, d.mgd2023, d.mgd2026])
    const high = Math.ceil(Math.max(...values.filter((v) => v !== null), 1) / 2) * 2
    const y = (v: number) => PAD.top + PLOT_H - (v / high) * PLOT_H
    const ticks: number[] = []
    for (let v = 2; v <= high; v += 2) ticks.push(v)
    return { high, y, ticks }
  })

  /**
   * One path per unbroken run. A null is a day another line hides, or a day
   * outside that slide's own window; joining across either would draw a
   * segment the data does not have.
   */
  const runs = (pick: (d: WaterUsageDay) => number | null): string[] => {
    const out: string[] = []
    let open = ""
    days.forEach((day, i) => {
      const v = pick(day)
      if (v === null) {
        if (open.includes("L")) out.push(open)
        open = ""
        return
      }
      const point = `${x(i).toFixed(1)} ${scale.y(v).toFixed(1)}`
      open = open ? `${open} L${point}` : `M${point}`
    })
    if (open.includes("L")) out.push(open)
    return out
  }

  const mean = (pick: (d: WaterUsageDay) => number | null) => {
    const vs = days.map(pick).filter((v): v is number => v !== null)
    return vs.reduce((s, v) => s + v, 0) / vs.length
  }

  const series = $derived(
    [
      { year: 2022, colour: COLOURS[0], pick: (d: WaterUsageDay) => d.mgd2022, isCurrent: false },
      { year: 2023, colour: COLOURS[2], pick: (d: WaterUsageDay) => d.mgd2023, isCurrent: false },
      { year: 2026, colour: COLOURS[1], pick: (d: WaterUsageDay) => d.mgd2026, isCurrent: true },
    ].map((s) => ({ ...s, paths: runs(s.pick), average: mean(s.pick) })),
  )

  /** The 15th of each month, which is how both slides label their axis. */
  const marks = $derived(
    days
      .map((d, i) => ({ i, date: d.date }))
      .filter(({ date }) => date.endsWith("-15"))
      .map(({ i, date }) => ({ i, label: MONTH_NAMES[Number(date.slice(0, 2)) - 1] })),
  )

  /** A month's mean per year -- what the table carries, the daily series being dense. */
  const monthly = $derived.by(() => {
    const months = [...new Set(days.map((d) => d.date.slice(0, 2)))]
    return months.map((m) => {
      const inMonth = days.filter((d) => d.date.slice(0, 2) === m)
      const avg = (pick: (d: WaterUsageDay) => number | null) => {
        const vs = inMonth.map(pick).filter((v): v is number => v !== null)
        return vs.length ? vs.reduce((s, v) => s + v, 0) / vs.length : null
      }
      return {
        label: MONTH_NAMES[Number(m) - 1],
        cells: series.map((s) => avg(s.pick)),
      }
    })
  })
</script>

<figure class="not-prose mx-auto my-0 max-w-xl">
  <svg
    viewBox="0 0 {WIDTH} {HEIGHT}"
    class="block h-auto w-full"
    role="group"
    aria-label="Water produced each day from April 15th to October 15th, in 2022, 2023 and 2026"
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
          line.average,
        )} million gallons a day on average over the days drawn"
      >
        {#each line.paths as d, i (i)}
          <path
            {d}
            fill="none"
            stroke={line.colour}
            stroke-width={line.isCurrent ? 1.7 : 1.3}
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
        <span class="text-slate-500 tabular-nums">{mgd.format(line.average)} avg</span>
      </li>
    {/each}
  </ul>

  <!-- A month's mean rather than all 184 days in each of three years: the
       point of the daily series is its shape, which 552 spoken figures do not
       convey, and the totals that matter are the department's own, quoted in
       the caption. -->
  <table class="sr-only">
    <caption>Average water produced each month, million gallons a day</caption>
    <thead>
      <tr>
        <th scope="col">Month</th>
        {#each series as line (line.year)}<th scope="col">{line.year}</th>{/each}
      </tr>
    </thead>
    <tbody>
      {#each monthly as row (row.label)}
        <tr>
          <th scope="row">{row.label}</th>
          {#each row.cells as cell, i (i)}
            <td>{cell === null ? "—" : mgd.format(cell)}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <figcaption class="mt-2 text-xs text-slate-500">
    Read off two charts the Water Department showed the {WATER_USAGE_SOURCE.meeting} &mdash; good to about
    a twentieth of a million gallons on a typical day. The department states the totals: &ldquo;{WATER_USAGE_STATED
      .restrictions.stated}&rdquo;, and &ldquo;{WATER_USAGE_STATED.wetAgainstDry.stated}&rdquo; over
    April 15th to October 15th, whose percentage is a share of the year rather than of those months.
  </figcaption>
</figure>
