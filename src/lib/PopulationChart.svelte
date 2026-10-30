<!--
  Haverhill's population since the 2020 Census, a bar a year.

  **One series, one basis.** It began as ten bars and could not stay that way:
  the Census rebuilds its estimates on each decennial count, and the 2010-based
  series ran about 3,800 below what the 2020 Census then found, so a ten-year
  chart showed a cliff in 2020 that nobody moved to create. The years that can
  honestly sit beside each other are the ones built from the same count. The
  decade is answered in the page's own prose instead, from the two Census
  counts, which are counts rather than projections.

  **The axis does not start at zero**, which is right here and nowhere else on
  this site. Population is a level, not a quantity being accumulated: a
  zero-based axis puts a thousand people of actual change on top of sixty-seven
  thousand of baseline and draws five bars of identical height. The floor is a
  gridline rather than an axis, the bargain the Kenoza level panel made, so it
  is not read as a zero -- and the figures are on the bars, so nothing rests on
  judging their height by eye.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"
  import type { PopulationYear } from "./population"

  let { years }: { years: PopulationYear[] } = $props()

  const BAR = COLOURS[0]
  const WIDTH = 460
  const PAD = { top: 26, right: 12, bottom: 30, left: 46 }
  const PLOT_H = 150
  const HEIGHT = PAD.top + PLOT_H + PAD.bottom
  const PLOT_W = WIDTH - PAD.left - PAD.right

  const n = new Intl.NumberFormat("en-US")

  /**
   * Rounded out to whole thousands either side, never to zero: see above.
   * `low` is a floor to measure from, not a level the population could fall
   * to.
   */
  const scale = $derived.by(() => {
    const values = years.map((y) => y.people)
    const low = Math.floor((Math.min(...values) - 1200) / 1000) * 1000
    const high = Math.ceil((Math.max(...values) + 600) / 1000) * 1000
    const y = (v: number) => PAD.top + PLOT_H - ((v - low) / (high - low)) * PLOT_H
    const ticks: number[] = []
    for (let v = low; v <= high; v += 1000) ticks.push(v)
    return { low, high, y, ticks }
  })

  const slotW = $derived(PLOT_W / Math.max(years.length, 1))
  const barW = $derived(Math.min(42, slotW * 0.6))
  const cx = (i: number) => PAD.left + slotW * (i + 0.5)

  let hot = $state<number | null>(null)
</script>

<figure class="not-prose mx-auto my-0 max-w-md">
  <svg
    viewBox="0 0 {WIDTH} {HEIGHT}"
    class="block h-auto w-full"
    role="group"
    aria-label="Haverhill's population, {years[0]?.year} to {years.at(-1)
      ?.year}, from US Census Bureau estimates"
  >
    <text x={PAD.left} y={PAD.top - 10} class="fill-slate-600 text-[11px] font-medium">People</text>

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
        class="fill-slate-500 text-[10px]">{n.format(tick)}</text
      >
    {/each}

    {#each years as y, i (y.year)}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <g
        tabindex="0"
        role="img"
        aria-label="{y.year}: {n.format(y.people)} people"
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
          fill={BAR}
          opacity={hot === null || hot === y.year ? 1 : 0.55}
        />
        <!-- Always drawn, not only on hover: the axis is cropped, so the
             figure is what the reader is actually comparing. -->
        <text
          x={cx(i)}
          y={scale.y(y.people) - 6}
          text-anchor="middle"
          class="text-[10px] tabular-nums {hot === y.year
            ? 'fill-slate-900 font-semibold'
            : 'fill-slate-600'}"
        >
          {n.format(y.people)}
        </text>
      </g>
      <text
        x={cx(i)}
        y={HEIGHT - 12}
        text-anchor="middle"
        class="text-[11px] {hot === y.year ? 'fill-slate-900' : 'fill-slate-500'}"
      >
        {y.year}
      </text>
    {/each}

    <!-- A floor, not a zero: a gridline rather than an axis, so it does not
         claim the bars are measured from nothing. -->
    <line
      x1={PAD.left}
      x2={WIDTH - PAD.right}
      y1={scale.y(scale.low)}
      y2={scale.y(scale.low)}
      stroke="#94a3b8"
    />
  </svg>

  <table class="sr-only">
    <caption>Haverhill's population by year, US Census Bureau estimates</caption>
    <thead>
      <tr><th scope="col">Year</th><th scope="col">People</th></tr>
    </thead>
    <tbody>
      {#each years as y (y.year)}
        <tr><th scope="row">{y.year}</th><td>{n.format(y.people)}</td></tr>
      {/each}
    </tbody>
  </table>
</figure>
