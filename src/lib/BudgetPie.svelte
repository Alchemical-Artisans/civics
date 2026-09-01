<!--
  A pie of one budget total: one wedge per category, largest first from twelve
  o'clock, naming and pricing itself when a reader hovers or tabs to it.

  A pie is what the book itself draws, and it is what this page wants: the
  question a budget's front page answers is what share of one pot each category
  takes, and a pie says "half of it is schools" without the reader doing any
  arithmetic. Printing all fourteen figures beside it, which is what this page
  used to do, spent the width the book's own table of contents wants and
  restated a table the contents already links: these are page 78, transcribed at
  2027 Budget in Brief. So the figures moved into the wedges: hover one, or tab
  to it, and it says what it is and what it costs.

  This is the one page on the site with a script behind it, and the reason is
  that hover is the whole feature. A wedge still carries its label, its dollars
  and its share as its accessible name, so a screen reader gets all fourteen by
  walking them, and the transcription in the contents beside the chart carries
  every figure as text either way. Every wedge is focusable, which is also what makes the
  smallest of them reachable at all -- Overlay is 1/589th of Education, about a
  third of a degree, and no mouse will ever land on it.

  Colour is the category, from a fixed order (see COLOURS). Fourteen hues is
  more than colour alone can carry, which is why nothing here is identified by
  colour: the wedge under the pointer says its own name.
-->
<script lang="ts">
  export interface Slice {
    /** The category, exactly as the budget book's table prints it. */
    label: string
    /** Dollars. */
    amount: number
  }

  let { rows }: { rows: Slice[] } = $props()

  /**
   * The wedge colours, in the order they are handed out -- biggest category
   * first, so a category keeps its colour whatever else is in the book.
   *
   * Ordered so that neighbouring wedges are far apart in hue, then checked
   * with the palette validator rather than by eye: every step clears the
   * lightness band, the chroma floor and 3:1 against the page, and the closest
   * adjacent pair under simulated deuteranopia is Lime/Rose at dE 6.3 -- inside
   * the 6-8 band that is allowed only where something other than colour
   * identifies the mark, which here is the label on hover and the white gap
   * between wedges.
   */
  const COLOURS = [
    "#0369a1",
    "#ea580c",
    "#0d9488",
    "#7c3aed",
    "#65a30d",
    "#e11d48",
    "#0891b2",
    "#d97706",
    "#4f46e5",
    "#16a34a",
    "#a21caf",
    "#a16207",
    "#2563eb",
    "#db2777",
  ]

  const sorted = $derived([...rows].sort((a, b) => b.amount - a.amount))
  const total = $derived(sorted.reduce((sum, row) => sum + row.amount, 0))

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
  const percent = new Intl.NumberFormat("en-US", {
    style: "percent",
    // One decimal always, so a share reads "1.0%" rather than "1%" beside
    // "2.9%".
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  /**
   * A wedge's share, or "<0.1%" for the ones rounding would print as nothing.
   * A wedge reading "0.1%" beside another reading "0.1%" claims a precision
   * this end of the table does not have.
   */
  const share = (amount: number) =>
    total && amount / total < 0.001 ? "<0.1%" : percent.format(total ? amount / total : 0)

  /** A point on the circle, from twelve o'clock, clockwise. */
  const point = (fraction: number, radius = 50) => {
    const angle = (fraction - 0.25) * 2 * Math.PI
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    }
  }

  const wedges = $derived.by(() => {
    let start = 0
    return sorted.map((row, i) => {
      const end = start + (total ? row.amount / total : 0)
      const from = point(start)
      const to = point(end)
      const large = end - start > 0.5 ? 1 : 0
      // Where the label sits: out along the middle of the wedge, far enough
      // from the centre that it is over its own colour rather than the hub.
      const at = point((start + end) / 2, 30)
      start = end

      return {
        ...row,
        colour: COLOURS[i % COLOURS.length],
        share: share(row.amount),
        at,
        d: `M 50 50 L ${from.x.toFixed(3)} ${from.y.toFixed(3)} A 50 50 0 ${large} 1 ${to.x.toFixed(3)} ${to.y.toFixed(3)} Z`,
      }
    })
  })

  /** The wedge under the pointer, or the one holding focus. */
  let active = $state<number | null>(null)
  const shown = $derived(active === null ? null : wedges[active])
</script>

<figure class="budget-chart not-prose relative m-0 h-52 w-52 sm:h-64 sm:w-64">
  <svg
    class="h-full w-full"
    viewBox="0 0 100 100"
    onpointerleave={() => (active = null)}
    role="presentation"
  >
    {#if wedges.length === 1}
      <!-- An arc from a point back to itself draws nothing, so a lone category
           is a circle rather than an invisible full-turn wedge. -->
      <circle cx="50" cy="50" r="50" fill={wedges[0].colour} />
    {:else}
      {#each wedges as wedge, i (wedge.label)}
        <!--
          Focusable so that every wedge is reachable without a mouse, which is
          the only way to reach the ones drawn as a hairline. `role="img"` with
          a name is what it is -- a picture of one figure -- rather than a
          control: nothing happens when it is activated, it only says what it
          is.
        -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <path
          d={wedge.d}
          fill={wedge.colour}
          stroke={active === i ? "#0f172a" : "white"}
          stroke-width={active === i ? 1.5 : 0.75}
          opacity={active === null || active === i ? 1 : 0.35}
          class="cursor-default transition-opacity outline-none"
          role="img"
          aria-label="{wedge.label}, {money.format(wedge.amount)}, {wedge.share}"
          tabindex="0"
          onpointerenter={() => (active = i)}
          onfocus={() => (active = i)}
          onblur={() => (active = null)}
        ></path>
      {/each}
    {/if}
  </svg>

  <!--
    The wedge's own name and figures, over the middle of it. Hidden from
    assistive technology because the wedge already carries all three as its
    accessible name, and announcing them twice is worse than once.
  -->
  {#if shown}
    <div
      class="budget-tooltip pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/95 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md ring-1 ring-slate-200"
      style="left: {shown.at.x}%; top: {shown.at.y}%"
      aria-hidden="true"
    >
      <span class="block font-medium text-slate-900">{shown.label}</span>
      <span class="block text-slate-600 tabular-nums">
        {money.format(shown.amount)} &middot; {shown.share}
      </span>
    </div>
  {/if}
</figure>
