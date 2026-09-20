<!--
  Fifteen years of Massachusetts rainfall, January through August, as a bar
  reaching up from a normal line for a wetter year and down for a drier one
  -- the delta a departure-from-normal figure is, drawn rather than stated.

  Diverging rather than a single hue: this is polarity, wetter or drier than
  the 1901-2000 average, not magnitude alone, so it takes two hues rather
  than one going darker. Blue and orange are the site's own slots 1 and 2 in
  `chart-colours.ts`, already checked as an adjacent pair by that palette's
  own validation -- reused here as a two-color diverging pair rather than as
  two categories, the same hues doing a different job.

  Fifteen years, not the full 132: `rainfall.ts` carries all it needs to
  cite 2026's rank against the whole record, but a bar chart of 132 columns
  says nothing at a glance that fifteen doesn't -- this is "is this year
  unusual against recent memory," and recent memory is what it draws.
-->
<script lang="ts">
  import { COLOURS } from "./chart-colours"
  import { RAINFALL_JAN_AUG, CURRENT_RAINFALL_YEAR, rainfallDeparture } from "./rainfall"

  const WET = COLOURS[0]
  const DRY = COLOURS[1]

  const rows = RAINFALL_JAN_AUG.map((row) => ({
    year: row.year,
    inches: row.inches,
    departure: rainfallDeparture(row.inches),
  }))

  /** The largest departure from normal shown, either direction: what the half-height is worth. */
  const scale = Math.max(...rows.map((row) => Math.abs(row.departure)), 0)

  const inches = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })
  const signed = (n: number) => `${n >= 0 ? "+" : ""}${inches.format(n)}`

  /** The bar under the pointer, or the one holding focus. */
  let active = $state<number | null>(null)
  const shown = $derived(rows.find((row) => row.year === active) ?? null)

  let root: HTMLElement | undefined = $state()
  let spot = $state({ x: 0, y: 0 })

  const TOOLTIP = 200

  const show = (year: number, segment: HTMLElement) => {
    active = year
    if (!root) return

    const edge = root.getBoundingClientRect()
    const box = segment.getBoundingClientRect()
    const half = Math.min(TOOLTIP, edge.width) / 2
    spot = {
      x: Math.min(
        Math.max(box.left + box.width / 2 - edge.left, half),
        Math.max(edge.width - half, half),
      ),
      y: box.top - edge.top,
    }
  }
</script>

<div class="rainfall-chart not-prose relative" bind:this={root}>
  <div class="flex h-40 items-stretch gap-1">
    {#each rows as row (row.year)}
      {@const current = row.year === CURRENT_RAINFALL_YEAR}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div
        class="flex flex-1 cursor-default flex-col outline-none"
        role="img"
        aria-label="{row.year}: {inches.format(row.inches)} in, {signed(
          row.departure,
        )} in vs. the 1901-2000 average"
        tabindex="0"
        onpointerenter={(event) => show(row.year, event.currentTarget)}
        onpointerleave={() => (active = null)}
        onfocus={(event) => show(row.year, event.currentTarget)}
        onblur={() => (active = null)}
      >
        <div class="flex h-1/2 flex-col justify-end">
          {#if row.departure > 0}
            <div
              class="rounded-t-xs transition-opacity {current
                ? 'ring-2 ring-slate-900 ring-inset'
                : ''}"
              style="height: {(row.departure / scale) *
                100}%; background: {WET}; opacity: {active === null || active === row.year
                ? 1
                : 0.4}"
            ></div>
          {/if}
        </div>
        <div class="h-px shrink-0 bg-slate-300"></div>
        <div class="flex h-1/2 flex-col justify-start">
          {#if row.departure < 0}
            <div
              class="rounded-b-xs transition-opacity {current
                ? 'ring-2 ring-slate-900 ring-inset'
                : ''}"
              style="height: {(-row.departure / scale) *
                100}%; background: {DRY}; opacity: {active === null || active === row.year
                ? 1
                : 0.4}"
            ></div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-1 flex gap-1 text-[10px]" aria-hidden="true">
    {#each rows as row (row.year)}
      <p
        class="m-0 flex-1 text-center {row.year === CURRENT_RAINFALL_YEAR
          ? 'font-semibold text-slate-900'
          : 'text-slate-500'}"
      >
        '{String(row.year).slice(2)}
      </p>
    {/each}
  </div>

  {#if shown}
    <div
      class="rainfall-tooltip pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-white/95 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md ring-1 ring-slate-200"
      style="left: {spot.x}px; top: {spot.y}px"
      aria-hidden="true"
    >
      <span class="block font-medium text-slate-900">{shown.year}</span>
      <span class="block text-slate-600 tabular-nums">
        {inches.format(shown.inches)} in &middot; {signed(shown.departure)} in vs. normal
      </span>
    </div>
  {/if}
</div>
