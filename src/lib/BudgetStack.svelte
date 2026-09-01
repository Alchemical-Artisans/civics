<!--
  One bar, divided into what it is made of: the reserves a city holds, in the
  proportions it holds them.

  The bar is here because the front page's question about reserves is how much
  there is, not whether each fund is inside the band its policy sets. The bands
  are what the section itself is about -- three dials, a floor and a ceiling
  apiece -- and the contents line below this opens the page that has them.

  The figures are in the segments rather than on lines under the bar, the way
  the pies beside it work: hover a segment, or tab to it, and it names itself
  and prints its dollars and its share. Three lines of legend under a bar this
  small was more chrome than chart, and the page has a table of contents to get
  down to.

  What a segment says is its share of the reserves and not the share of city
  revenue the book prints beside each balance -- in a bar divided into parts, a
  percentage reads as a part of the bar, and the two numbers are nothing alike.
  The revenue share is on the section's own page, next to the policy it answers.

  A fund worth nothing draws no segment: there is no honest width for $0. It
  keeps a line of its own for a screen reader, so walking the chart still
  reaches every fund the book lists.
-->
<script module lang="ts">
  export interface Part {
    /** What the money is: "Fund Balance". */
    label: string
    /** Dollars. */
    amount: number
  }
</script>

<script lang="ts">
  let { rows }: { rows: Part[] } = $props()

  /**
   * The first colours of the pie's sequence, in its order, so a page carrying
   * both draws its categories from one palette rather than two.
   */
  const COLOURS = ["#0369a1", "#ea580c", "#0d9488"]

  const total = $derived(rows.reduce((sum, row) => sum + row.amount, 0))

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
  const percent = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  const parts = $derived(
    rows.map((row, i) => ({
      ...row,
      colour: COLOURS[i % COLOURS.length],
      width: total ? (row.amount / total) * 100 : 0,
      share: percent.format(total ? row.amount / total : 0),
    })),
  )

  /** The funds with nothing in them, which are the ones the bar cannot draw. */
  const empty = $derived(parts.filter((part) => part.width <= 0))

  /** The segment under the pointer, or the one holding focus. */
  let active = $state<number | null>(null)
  const shown = $derived(active === null ? null : parts[active])

  /**
   * Where the tooltip points: the middle of that segment, measured against the
   * bar rather than worked out from the widths, and then pulled back from
   * either edge so a tooltip on the first or last part stays on the page.
   */
  let root = $state<HTMLElement | null>(null)
  let spot = $state(0)

  const TOOLTIP = 224

  const show = (i: number, segment: HTMLElement) => {
    active = i
    if (!root) return

    const edge = root.getBoundingClientRect()
    const middle = segment.getBoundingClientRect()
    const half = Math.min(TOOLTIP, edge.width) / 2
    spot = Math.min(
      Math.max(middle.left + middle.width / 2 - edge.left, half),
      Math.max(edge.width - half, half),
    )
  }
</script>

<div class="budget-stack not-prose relative" bind:this={root}>
  <!-- `gap` rather than borders between the segments: two fills meeting edge to
       edge read as one shape with a seam, and a gap the colour of the page is
       what separates them everywhere else on this site. -->
  <div class="flex h-4 gap-0.5 overflow-hidden rounded-full bg-slate-100">
    {#each parts as part, i (part.label)}
      {#if part.width > 0}
        <!--
          Focusable, so the bar can be read without a mouse, and `role="img"`
          with a name because that is what it is: a picture of one figure.
          Nothing happens when it is activated; it only says what it is.
        -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
          class="cursor-default transition-opacity outline-none"
          style="width: {part.width}%; background: {part.colour}; opacity: {active === null ||
          active === i
            ? 1
            : 0.4}"
          role="img"
          aria-label="{part.label}, {money.format(part.amount)}, {part.share}"
          tabindex="0"
          onpointerenter={(event) => show(i, event.currentTarget)}
          onpointerleave={() => (active = null)}
          onfocus={(event) => show(i, event.currentTarget)}
          onblur={() => (active = null)}
        ></div>
      {/if}
    {/each}
  </div>

  <!--
    Under the bar rather than over it: above is the heading, which carries the
    total, and there is nothing under it but a table of contents a tooltip can
    sit over for as long as a pointer rests on a segment.

    Hidden from assistive technology, because the segment already carries all
    three as its accessible name.
  -->
  {#if shown}
    <div
      class="budget-tooltip pointer-events-none absolute top-full z-10 mt-2 -translate-x-1/2 rounded-md bg-white/95 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md ring-1 ring-slate-200"
      style="left: {spot}px"
      aria-hidden="true"
    >
      <span class="block font-medium text-slate-900">{shown.label}</span>
      <span class="block text-slate-600 tabular-nums">
        {money.format(shown.amount)} &middot; {shown.share}
      </span>
    </div>
  {/if}

  {#if empty.length}
    <ul class="sr-only">
      {#each empty as part (part.label)}
        <li>{part.label}, {money.format(part.amount)}</li>
      {/each}
    </ul>
  {/if}
</div>
