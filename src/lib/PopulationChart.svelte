<!--
  Haverhill's population, a bar a year.

  **Two series, drawn apart, because the join between them is not growth.**
  The Census builds its annual estimates forward from the last decennial
  count. 2015-2019 were built from the 2010 Census; 2020-2024 from the 2020
  Census, which found about 3,800 more people than the older series had
  projected. Run as ten bars in one colour, the chart shows a cliff in 2020
  that nobody moved to create. So the two sit either side of a gap, in
  different weights, with the break named on the axis between them -- the
  reader is told they are looking at two rulers before they compare anything.

  The axis does not start at zero. That is the one chart on this site where
  that is right: population is a level, not a quantity being accumulated, and
  a zero-based axis puts sixty thousand people of baseline under four thousand
  of actual change and shows nothing at all. The floor is drawn as a gridline
  rather than an axis, the same bargain the Kenoza level panel made, so it
  does not read as a zero.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"
  import { CENSUS_COUNTS, type PopulationYear } from "./population"

  let { years }: { years: PopulationYear[] } = $props()

  const CURRENT = COLOURS[0]
  const SUPERSEDED = "#94a3b8"

  const WIDTH = 560
  const PAD = { top: 22, right: 12, bottom: 38, left: 46 }
  const PLOT_H = 160
  const HEIGHT = PAD.top + PLOT_H + PAD.bottom
  const PLOT_W = WIDTH - PAD.left - PAD.right

  const n = new Intl.NumberFormat("en-US")

  /**
   * Padded out to whole thousands either side of the range, never to zero:
   * see the note above. `low` is a floor to measure from, not a claim that
   * the population could reach it.
   */
  const scale = $derived.by(() => {
    const values = years.map((y) => y.people)
    const low = Math.floor((Math.min(...values) - 1500) / 1000) * 1000
    const high = Math.ceil((Math.max(...values) + 1000) / 1000) * 1000
    const y = (v: number) => PAD.top + PLOT_H - ((v - low) / (high - low)) * PLOT_H
    const ticks: number[] = []
    for (let v = low; v <= high; v += 2000) ticks.push(v)
    return { low, high, y, ticks }
  })

  /** A gap between the bases, so the two series are not read as one run. */
  const GAP = 0.6
  const slots = $derived(years.length + GAP)
  const slotW = $derived(PLOT_W / slots)
  const offset = (i: number) => i + (years[i].base === 2020 ? GAP : 0)
  const barW = $derived(Math.min(34, slotW * 0.68))
  const cx = (i: number) => PAD.left + slotW * (offset(i) + 0.5)

  /** Where the basis changes, for the rule drawn between the two series. */
  const breakAt = $derived(years.findIndex((y) => y.base === 2020))

  let hot = $state<number | null>(null)
</script>

<figure class="not-prose mx-auto my-0 max-w-lg">
  <svg
    viewBox="0 0 {WIDTH} {HEIGHT}"
    class="block h-auto w-full"
    role="group"
    aria-label="Haverhill's population, {years[0]?.year} to {years.at(-1)
      ?.year}, from US Census Bureau estimates"
  >
    <text x={PAD.left} y={PAD.top - 8} class="fill-slate-600 text-[11px] font-medium">People</text>

    {#each scale.ticks as tick (tick)}
      <line
        x1={PAD.left}
        x2={WIDTH - PAD.right}
        y1={scale.y(tick)}
        y2={scale.y(tick)}
        stroke="#e2e8f0"
      />
      <text
        x={PAD.left - 7}
        y={scale.y(tick) + 4}
        text-anchor="end"
        class="fill-slate-500 text-[10px]">{n.format(tick / 1000)}k</text
      >
    {/each}

    <!-- The break between the two bases, named on the chart rather than only
         in the caption: it is the one thing a reader has to know before
         comparing a bar on the left with one on the right. -->
    {#if breakAt > 0}
      {@const bx = PAD.left + slotW * (breakAt - 1 + 1 + GAP / 2)}
      <line
        x1={bx}
        x2={bx}
        y1={PAD.top - 2}
        y2={scale.y(scale.low)}
        stroke="#cbd5e1"
        stroke-width="1"
        stroke-dasharray="3 3"
      />
      <text x={bx} y={HEIGHT - 10} text-anchor="middle" class="fill-slate-500 text-[9px]">
        2020 Census rebase
      </text>
    {/if}

    {#each years as y, i (y.year)}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <g
        tabindex="0"
        role="img"
        aria-label="{y.year}: {n.format(
          y.people,
        )} people, estimated from the {y.base} Census{y.base === 2010
          ? ', a series since superseded'
          : ''}"
        onpointerenter={() => (hot = y.year)}
        onpointerleave={() => (hot = null)}
        onfocus={() => (hot = y.year)}
        onblur={() => (hot = null)}
      >
        <rect
          x={cx(i) - barW / 2}
          y={scale.y(y.people)}
          width={barW}
          height={Math.max(0, scale.y(scale.low) - scale.y(y.people))}
          fill={y.base === 2020 ? CURRENT : SUPERSEDED}
          opacity={hot === null || hot === y.year ? 1 : 0.55}
        />
        {#if hot === y.year}
          <text
            x={cx(i)}
            y={scale.y(y.people) - 6}
            text-anchor="middle"
            class="fill-slate-900 text-[10px] font-semibold tabular-nums"
          >
            {n.format(y.people)}
          </text>
        {/if}
      </g>
      <text
        x={cx(i)}
        y={HEIGHT - 24}
        text-anchor="middle"
        class="text-[10px] {hot === y.year ? 'fill-slate-900' : 'fill-slate-500'}"
      >
        {String(y.year).slice(2)}
      </text>
    {/each}

    <!-- A floor, not a zero: drawn as a gridline so it is not read as one. -->
    <line
      x1={PAD.left}
      x2={WIDTH - PAD.right}
      y1={scale.y(scale.low)}
      y2={scale.y(scale.low)}
      stroke="#94a3b8"
    />
  </svg>

  <ul class="mt-2 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs">
    <li class="m-0 flex items-center gap-1.5">
      <span class="inline-block h-2.5 w-4" style="background: {SUPERSEDED}"></span>
      <span class="text-slate-600">Estimated from the 2010 Census</span>
    </li>
    <li class="m-0 flex items-center gap-1.5">
      <span class="inline-block h-2.5 w-4" style="background: {CURRENT}"></span>
      <span class="text-slate-700">Estimated from the 2020 Census</span>
    </li>
  </ul>

  <table class="sr-only">
    <caption>Haverhill's population by year, and which Census each estimate is built from</caption>
    <thead>
      <tr><th scope="col">Year</th><th scope="col">People</th><th scope="col">Built from</th></tr>
    </thead>
    <tbody>
      {#each years as y (y.year)}
        <tr>
          <th scope="row">{y.year}</th>
          <td>{n.format(y.people)}</td>
          <td>{y.base} Census</td>
        </tr>
      {/each}
      <tr>
        <th scope="row">2010 Census count</th>
        <td>{n.format(CENSUS_COUNTS[2010])}</td>
        <td>counted</td>
      </tr>
      <tr>
        <th scope="row">2020 Census count</th>
        <td>{n.format(CENSUS_COUNTS[2020])}</td>
        <td>counted</td>
      </tr>
    </tbody>
  </table>
</figure>
