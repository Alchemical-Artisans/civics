<!--
  Each reserve against the policy it answers to, as bullet bars on one scale.

  The book draws these three as dials -- a needle in a coloured arc -- one to a
  page, which answers "is this fund inside its band" and nothing else. Three
  dials cannot be held against each other at all: a needle halfway round a small
  arc and a needle halfway round a large one look alike, and there is no reading
  off a dial how much money it is about.

  They are comparable, though, and by more than luck. All three policies are a
  percentage of the same figure -- general fund revenue less debt exclusion and
  Chapter 70 -- so their floors and ceilings are dollars on one scale, which is
  what lets the three stand beside each other here: the pale rail is what the
  policy allows, the bar is what the city holds, and the same inch of height is
  the same money in every column.

  Nothing is drawn but those, and nothing is printed but the column's own name:
  the reserves page sits the chart beside its reading now, and the actual,
  minimum and maximum cells the book gives each fund cost more width than three
  narrow columns have to spend. They still name and price themselves, on hover
  or focus, the way a pie wedge does; the column's accessible name carries the
  same three figures for a reader who never hovers anything. A bar that stops
  short of its band is a fund below its floor, which is this year's story in
  the middle column and is left to be read rather than announced.
-->
<script module lang="ts">
  /** One figure of a policy, as the book's dial table gives it. */
  export interface Point {
    /** The book's own row label: "Minimum", "Anticipated", "Actual Balance". */
    label: string
    /** The cell, exactly as the book prints it -- "$13,985,452 (7.85%)". */
    cell: string
    /** The dollars in that cell, which is all the drawing uses. */
    amount: number
  }

  export interface Band {
    /** The fund, as its own table heads it: "Free Cash". */
    label: string
    /** Where the city stands. */
    actual: Point
    /** The floor the policy sets. */
    minimum: Point
    /** The ceiling, for the two policies that set one. */
    maximum?: Point
  }
</script>

<script lang="ts">
  import { COLOURS } from "$lib/chart-colours"

  let { rows }: { rows: Band[] } = $props()

  /**
   * The widest thing drawn, which is the top of every rail.
   *
   * The ceilings, the floors and the balances all together: a fund over its
   * ceiling would otherwise run off the end of the chart, and a year where that
   * happens is exactly the year the chart has to be right about.
   */
  const scale = $derived(
    Math.max(
      ...rows.flatMap((row) => [row.minimum.amount, row.actual.amount, row.maximum?.amount ?? 0]),
    ),
  )

  const along = (money: number) => (scale ? (money / scale) * 100 : 0)

  /** One hue for all three: the bars are one measure, and their names tell them
      apart. A colour each would say the funds are categories to be told apart
      by eye, when what a reader compares here is a bar against its own band. */
  const HELD = COLOURS[0]

  /** The column under the pointer, or the one holding focus. */
  let active = $state<string | null>(null)
  const shown = $derived(active ? (rows.find((row) => row.label === active) ?? null) : null)

  /** Where the tooltip sits: over the column's centre, measured against the
      plot rather than worked out from the widths, and pulled back from either
      edge so it stays on the page. Centred on the rail rather than pinned
      above it, because the rail runs the full height of the chart and a
      column's tallest bar can reach to within a few pixels of the top of the
      window -- pinned above, the tooltip would run off the top of the page. */
  let root = $state<HTMLElement | null>(null)
  let spot = $state({ x: 0, y: 0 })

  const TOOLTIP = 200

  const show = (label: string, column: HTMLElement) => {
    active = label
    if (!root) return

    const edge = root.getBoundingClientRect()
    const box = column.getBoundingClientRect()
    const half = Math.min(TOOLTIP, edge.width) / 2

    spot = {
      x: Math.min(
        Math.max(box.left + box.width / 2 - edge.left, half),
        Math.max(edge.width - half, half),
      ),
      y: box.top + box.height / 2 - edge.top,
    }
  }
</script>

<!-- `h-full` and a growing plot, so the chart fills whatever height it is
     given -- the reserves page hands it the window, less the fixed footer.
     Where nothing sets a height, `min-h-64` keeps it drawable. `relative` so
     the tooltip below sits over this chart and not the page it is on. -->
<div class="budget-bands not-prose relative flex h-full flex-col" bind:this={root}>
  <!-- Rails are as wide as the name under them and no wider. A column carries
       one fund, and width past what its name needs is width spent saying
       nothing. -->
  <div class="flex min-h-64 flex-1 items-end gap-5">
    {#each rows as row (row.label)}
      {@const from = along(row.minimum.amount)}
      {@const to = row.maximum ? along(row.maximum.amount) : 100}
      <!--
        The rail is the whole scale and the band inside it is what the policy
        allows, so the height a bar has left to climb is as visible as the
        height it has covered. `role="img"` with a name, because a column is a
        picture of three figures and a screen reader gets all three whether or
        not it can hover; a sighted reader gets them the same way a pie wedge
        gives up its figures, over the mark on hover or focus.
      -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div
        class="budget-band relative h-full w-20 cursor-default bg-slate-50 outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-inset"
        role="img"
        aria-label="{row.label}: {row.actual.label} {row.actual.cell}, {row.minimum.label} {row
          .minimum.cell}{row.maximum ? `, ${row.maximum.label} ${row.maximum.cell}` : ''}"
        tabindex="0"
        onpointerenter={(event) => show(row.label, event.currentTarget)}
        onpointerleave={() => (active = null)}
        onfocus={(event) => show(row.label, event.currentTarget)}
        onblur={() => (active = null)}
      >
        <!-- What the policy allows. Where it sets no ceiling the band runs to
             the top of the rail and is given no closing edge, since the only
             honest thing to draw at a limit that does not exist is nothing. -->
        <div
          class="absolute inset-x-0 border-b-2 border-slate-500 bg-slate-200"
          class:border-t-2={row.maximum}
          style="bottom: {from}%; height: {to - from}%"
        ></div>

        <!-- What the city holds. Narrower than the rail and centred in it, so
             the band shows past it either side and the two are read as
             different kinds of thing rather than as two bars. -->
        <div
          class="absolute inset-x-3 bottom-0"
          style="height: {along(row.actual.amount)}%; background: {HELD}"
        ></div>
      </div>
    {/each}
  </div>

  <!-- The fund's own name, and nothing else: the figures moved into the
       tooltip above, which is what let this column narrow. -->
  <div class="mt-2 flex gap-5">
    {#each rows as row (row.label)}
      <p class="m-0 w-20 text-center text-[11px] leading-snug font-semibold text-slate-900">
        {row.label}
      </p>
    {/each}
  </div>

  {#if shown}
    <!-- Over the column it belongs to. Hidden from assistive technology,
         because the column already carries all of it as its name. -->
    <div
      class="budget-tooltip pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/95 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md ring-1 ring-slate-200"
      style="left: {spot.x}px; top: {spot.y}px"
      aria-hidden="true"
    >
      <span class="block font-medium text-slate-900">{shown.label}</span>
      <span class="block text-slate-600 tabular-nums">
        {shown.actual.label}
        {shown.actual.cell}
      </span>
      {#if shown.maximum}
        <span class="block text-slate-600 tabular-nums">
          {shown.maximum.label}
          {shown.maximum.cell}
        </span>
      {/if}
      <span class="block text-slate-600 tabular-nums">
        {shown.minimum.label}
        {shown.minimum.cell}
      </span>
    </div>
  {/if}
</div>
