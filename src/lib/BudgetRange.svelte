<!--
  A reserve against the policy that governs it: where the money actually stands,
  and the band the city's own rules say it should stand in.

  The book draws each of these as a dial with three numbers on it and no scale.
  A bar is the same three numbers in a form that can be compared at a glance --
  the band is where the policy allows the balance to be, the bar is where it is,
  and a bar stopping short of the band says "below the floor" without anyone
  reading a figure.

  Everything the chart shows is also printed beside it: the balance on the line
  above, the floor and ceiling on the line below. Nothing here is a hover away
  and nothing is carried by colour, so the bars are `aria-hidden` decoration
  over text that already says it -- which is also why this component, unlike the
  pie, has no script behind it beyond the arithmetic.

  The track runs from zero to a little past the ceiling, so a balance at the top
  of its band is visibly inside the band rather than filling the track. Where a
  policy sets no ceiling -- the stabilization fund, which has a floor and no
  more -- the band runs to the end of the track, because above the floor is
  where the policy is satisfied.
-->
<script module lang="ts">
  export interface Band {
    /** What the policy governs: "Fund Balance". */
    label: string
    /** The floor the policy sets, in dollars. */
    minimum: number
    /** The ceiling, where the policy sets one. */
    maximum?: number
    /** Where the balance actually is. */
    actual: number
    /** The share of revenue the book prints beside that balance: "7.85%". */
    share?: string
  }
</script>

<script lang="ts">
  let { rows }: { rows: Band[] } = $props()

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  /** What the far end of the track is worth: past the ceiling, or past the balance. */
  const scale = (row: Band) =>
    row.maximum ? row.maximum * 1.15 : Math.max(row.actual, row.minimum) * 1.25

  const across = (value: number, row: Band) => Math.min(100, (value / scale(row)) * 100)

  const bars = $derived(
    rows.map((row) => ({
      ...row,
      from: across(row.minimum, row),
      to: row.maximum ? across(row.maximum, row) : 100,
      bar: across(row.actual, row),
    })),
  )
</script>

<div class="budget-range not-prose space-y-3">
  {#each bars as row (row.label)}
    <div>
      <p class="m-0 flex items-baseline justify-between gap-3 text-xs">
        <span class="font-medium text-slate-900">{row.label}</span>
        <span class="text-slate-600 tabular-nums">
          {money.format(row.actual)}
          {#if row.share}&middot; {row.share}{/if}
        </span>
      </p>

      <div class="relative mt-1 h-2.5 rounded-full bg-slate-100" aria-hidden="true">
        <!-- The band the policy allows. -->
        <div
          class="absolute inset-y-0 rounded-full bg-sky-200"
          style="left: {row.from}%; width: {row.to - row.from}%"
        ></div>
        <!-- The balance itself, thinner so the band stays readable behind it. -->
        <div
          class="absolute inset-y-[3px] left-0 rounded-full bg-sky-700"
          style="width: {row.bar}%"
        ></div>
      </div>

      <p class="m-0 mt-1 text-[11px] text-slate-500 tabular-nums">
        {#if row.maximum}
          Policy {money.format(row.minimum)} to {money.format(row.maximum)}
        {:else}
          Policy {money.format(row.minimum)} or more
        {/if}
      </p>
    </div>
  {/each}
</div>
