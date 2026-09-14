<!--
  What the city stands on, as two bars on one scale: the reserves it holds, and
  the debt it owes.

  One chart rather than two, because the only useful thing to do with these two
  figures is hold them against each other, and two charts of their own would
  have drawn a bar of $22 million and a bar of $176 million the same length. On
  a shared scale the reserves are the eighth of the debt that they are, which is
  the whole answer and needs no arithmetic from the reader.

  Each bar is divided into what it is made of, and a segment names and prices
  itself on hover or focus, the way the pie wedges above it do -- a segment's
  share is of its own bar, since that is the whole it is a part of, and so is
  its colour, from the same sequence each pie starts from.

  What the city is *allowed* to hold -- a floor for each reserve, a ceiling for
  two of them, a debt limit set in statute -- is what those sections are about,
  and each bar's own name opens the section it is drawn from. This is the
  overview: how much there is.

  A part worth nothing draws no segment, because there is no honest width for
  $0. It keeps a line of its own for a screen reader, so walking the chart still
  reaches every fund the book lists.
-->
<script module lang="ts">
  export interface Part {
    /** What the money is: "Fund Balance". */
    label: string
    /** Dollars. */
    amount: number
  }

  export interface Series {
    /** What the bar is: "Reserves". */
    label: string
    /** The section of the book this bar is drawn from, where there is one. */
    href?: string
    /** What it is made of, in any order -- the bar draws them largest first. */
    parts: Part[]
  }
</script>

<script lang="ts">
  import { COLOURS } from "$lib/chart-colours"

  let { rows }: { rows: Series[] } = $props()

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

  const totals = $derived(rows.map((row) => row.parts.reduce((sum, part) => sum + part.amount, 0)))

  /** The longest bar's total: what the far end of every track is worth. */
  const scale = $derived(Math.max(...totals, 0))

  const bars = $derived(
    rows.map((row, i) => {
      const total = totals[i]

      return {
        label: row.label,
        href: row.href,
        total,
        parts: [...row.parts]
          .sort((a, b) => b.amount - a.amount)
          .map((part, at) => ({
            ...part,
            // The sequence restarts on each bar, as it does on each of the two
            // pies above: a bar is its own whole, and running one sequence
            // through both would put the site's blue on a reserve and hand the
            // largest thing the city owes a hue picked by what came before it.
            colour: COLOURS[at % COLOURS.length],
            // Of the scale, not of its own bar: that is what makes the two
            // bars comparable.
            width: scale ? (part.amount / scale) * 100 : 0,
            // Of its own bar, which is the whole this part is a part of.
            share:
              total && part.amount / total < 0.001
                ? "<0.1%"
                : percent.format(total ? part.amount / total : 0),
          })),
      }
    }),
  )

  /**
   * The segment under the pointer, or the one holding focus, as the bar it is
   * in and its own name -- the bar as well, both because two bars could name a
   * part the same thing and because dimming is per bar: hovering a reserve
   * fades the other reserves and leaves the debt alone, since the two bars are
   * being compared and fading one of them defeats the chart.
   */
  let active = $state<{ bar: string; part: string } | null>(null)
  const shown = $derived.by(() => {
    const at = active
    if (!at) return null
    return bars.find((bar) => bar.label === at.bar)?.parts.find((part) => part.label === at.part)
  })

  /** Whether a segment is drawn at full strength. */
  const lit = (bar: string, part: string) =>
    active === null || active.bar !== bar || active.part === part

  /**
   * Where the tooltip points: the middle of that segment, measured against the
   * chart rather than worked out from the widths, and then pulled back from
   * either edge so a tooltip on the first or last part stays on the page.
   */
  let root = $state<HTMLElement | null>(null)
  let spot = $state({ x: 0, y: 0 })

  const TOOLTIP = 224

  const show = (bar: string, part: string, segment: HTMLElement) => {
    active = { bar, part }
    if (!root) return

    const edge = root.getBoundingClientRect()
    const middle = segment.getBoundingClientRect()
    const half = Math.min(TOOLTIP, edge.width) / 2
    spot = {
      x: Math.min(
        Math.max(middle.left + middle.width / 2 - edge.left, half),
        Math.max(edge.width - half, half),
      ),
      y: middle.bottom - edge.top,
    }
  }
</script>

<div class="budget-stack not-prose relative" bind:this={root}>
  {#each bars as bar (bar.label)}
    <div class="budget-series mt-3 first:mt-0">
      <p class="m-0 flex items-baseline justify-between gap-3 text-xs">
        <!-- The bar's name is the way into the section it is drawn from, which
             is where the policy behind these figures is written out. That is
             the only link to it: a contents line below saying the same thing
             again would be the same page offered twice. -->
        {#if bar.href}
          <!-- The same underline the pie's heading carries: these three are
               the page's chart titles, and a title is the last thing a reader
               expects to be a link, so it says so plainly. -->
          <a
            class="font-medium text-slate-900 underline decoration-slate-400 decoration-2 underline-offset-2 hover:decoration-slate-900"
            href={bar.href}
          >
            {bar.label}
          </a>
        {:else}
          <span class="font-medium text-slate-900">{bar.label}</span>
        {/if}
        <span class="text-slate-600 tabular-nums">{money.format(bar.total)}</span>
      </p>

      <!-- `gap` rather than borders between the segments: two fills meeting
           edge to edge read as one shape with a seam, and a gap the colour of
           the page is what separates them everywhere else on this site.

           Square ends: a rounded bar reads as a pill, a thing with a shape of
           its own, when what it is is a length being measured against another
           length. -->
      <div class="mt-1 flex h-4 gap-0.5 overflow-hidden bg-slate-100">
        {#each bar.parts as part (part.label)}
          {#if part.width > 0}
            <!--
              Focusable, so the bar can be read without a mouse, and
              `role="img"` with a name because that is what it is: a picture of
              one figure. Nothing happens when it is activated; it only says
              what it is.
            -->
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              class="cursor-default transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-inset"
              style="width: {part.width}%; background: {part.colour}; opacity: {lit(
                bar.label,
                part.label,
              )
                ? 1
                : 0.4}"
              role="img"
              aria-label="{bar.label}, {part.label}, {money.format(part.amount)}, {part.share}"
              tabindex="0"
              onpointerenter={(event) => show(bar.label, part.label, event.currentTarget)}
              onpointerleave={() => (active = null)}
              onfocus={(event) => show(bar.label, part.label, event.currentTarget)}
              onblur={() => (active = null)}
            ></div>
          {/if}
        {/each}
      </div>

      {#each bar.parts.filter((part) => part.width <= 0) as part (part.label)}
        <p class="sr-only">{bar.label}, {part.label}, {money.format(part.amount)}</p>
      {/each}
    </div>
  {/each}

  <!--
    Under the segment it belongs to, which on the upper bar is over the lower
    one: a tooltip is wanted for as long as a pointer rests somewhere, and a
    lane held open for it under each bar would double what this chart costs the
    page. Hidden from assistive technology, because the segment already carries
    all of it as its accessible name.
  -->
  {#if shown}
    <div
      class="budget-tooltip pointer-events-none absolute z-10 mt-2 -translate-x-1/2 rounded-md bg-white/95 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md ring-1 ring-slate-200"
      style="left: {spot.x}px; top: {spot.y}px"
      aria-hidden="true"
    >
      <span class="block font-medium text-slate-900">{shown.label}</span>
      <span class="block text-slate-600 tabular-nums">
        {money.format(shown.amount)} &middot; {shown.share}
      </span>
    </div>
  {/if}
</div>
