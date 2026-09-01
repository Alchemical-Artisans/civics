<!--
  A pie of one budget total, with every slice named and priced beside it.

  A pie is what the book itself draws, and it is what this page wants: the
  question a budget's front page answers is what share of one pot each category
  takes, and a pie says "half of it is schools" without the reader doing any
  arithmetic. It also takes a fraction of the width a ranked list of fourteen
  rows does, which is what lets the figures sit beside it in columns rather than
  running down a narrow reading column for two screens.

  What a pie cannot do is let anyone compare the small slices to each other, so
  the legend does that instead: it is ranked largest first and prints the dollar
  figure and the share for every category, including the ones drawn as a
  hairline. Nothing here is available only to someone who can read an angle.

  There is no tooltip, deliberately. A hover layer earns its place when it
  carries something the chart cannot show; here every value is already printed
  in the legend, so a tooltip would restate what is on the page -- and it would
  put a script on a page that otherwise needs none.

  Colour is the ranking, not the category. Fourteen categorical hues cannot be
  told apart by anyone, colour-blind or not, so this is one hue stepped
  light-to-dark by size: the darkest slice is the largest, and the swatch beside
  a legend row is how a row is matched to its wedge. Identity comes from the
  label, never from the colour alone.
-->
<script lang="ts">
  export interface Slice {
    /** The category, exactly as the budget book's table prints it. */
    label: string
    /** Dollars. */
    amount: number
  }

  let { rows }: { rows: Slice[] } = $props()

  const sorted = $derived([...rows].sort((a, b) => b.amount - a.amount))
  const total = $derived(sorted.reduce((sum, row) => sum + row.amount, 0))

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
  const percent = new Intl.NumberFormat("en-US", {
    style: "percent",
    // One decimal always, so the column of shares lines up on its own point
    // rather than printing "1%" beside "2.9%".
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  /**
   * A slice's share, or "<0.1%" for the ones rounding would print as nothing.
   * Overlay is 1/589th of Education, and a row reading "0.1%" beside another
   * reading "0.1%" is less honest than saying both are under it.
   */
  const share = (amount: number) =>
    total && amount / total < 0.001 ? "<0.1%" : percent.format(total ? amount / total : 0)

  /**
   * One hue, lightest for the smallest slice. 26% to 78% keeps the darkest
   * slice off black and the lightest one visible against the white gaps
   * between wedges.
   */
  const colour = (index: number) =>
    `hsl(201 90% ${sorted.length > 1 ? 26 + (index / (sorted.length - 1)) * 52 : 26}%)`

  const point = (fraction: number) => {
    // From twelve o'clock, clockwise, which is where a reader starts.
    const angle = (fraction - 0.25) * 2 * Math.PI
    return `${(50 + 50 * Math.cos(angle)).toFixed(3)} ${(50 + 50 * Math.sin(angle)).toFixed(3)}`
  }

  /** Each wedge as a path, plus where the next one starts. */
  const wedges = $derived.by(() => {
    let start = 0
    return sorted.map((row) => {
      const end = start + (total ? row.amount / total : 0)
      const large = end - start > 0.5 ? 1 : 0
      const d = `M 50 50 L ${point(start)} A 50 50 0 ${large} 1 ${point(end)} Z`
      start = end
      return { label: row.label, d }
    })
  })
</script>

<div class="budget-chart not-prose flow-root">
  <!--
    Decorative: the legend beside it names and prices every slice, so
    announcing the drawing again would only repeat it.
  -->
  <!--
    The float starts at `sm`. On a phone there is no room to put anything
    beside a drawing: the legend would be squeezed to a strip too narrow for
    "$147,158,454", so the pie sits above its own figures instead.
  -->
  <svg
    class="mx-auto mb-4 block h-44 w-44 sm:float-left sm:mx-0 sm:mr-6 sm:mb-3 sm:h-56 sm:w-56"
    viewBox="0 0 100 100"
    aria-hidden="true"
  >
    {#if wedges.length === 1}
      <!-- An arc from a point back to itself draws nothing, so a lone category
           is a circle rather than an invisible full-turn wedge. -->
      <circle cx="50" cy="50" r="50" fill={colour(0)} />
    {:else}
      {#each wedges as wedge, i (wedge.label)}
        <!-- The white edge is the gap between neighbouring wedges: without it
             two adjacent steps of one ramp run together. -->
        <path d={wedge.d} fill={colour(i)} stroke="white" stroke-width="0.75" />
      {/each}
    {/if}
  </svg>

  <!--
    Columns, because this is a list of short lines beside a square drawing: one
    column would run far past the bottom of the pie and leave the rest of the
    page empty. They start at `lg` -- the pie has already taken 14rem, and a
    column narrower than the longest row wraps every label. `break-inside-avoid`
    keeps a row's swatch, label and figure together.
  -->
  <ol class="budget-legend m-0 list-none p-0 text-sm lg:columns-2 lg:gap-x-8 xl:columns-3">
    {#each sorted as row, i (row.label)}
      <li class="flex break-inside-avoid items-baseline gap-2 border-b border-slate-100 py-1.5">
        <span
          class="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style="background: {colour(i)}"
          aria-hidden="true"
        ></span>
        <span class="grow text-slate-700">{row.label}</span>
        <!-- Right-aligned and tabular so the thousands separators line up,
             which is what makes a column of figures scannable. -->
        <span class="shrink-0 text-right text-slate-600 tabular-nums">
          {money.format(row.amount)}
        </span>
        <span class="w-12 shrink-0 text-right text-slate-500 tabular-nums">{share(row.amount)}</span
        >
      </li>
    {/each}
  </ol>
</div>
