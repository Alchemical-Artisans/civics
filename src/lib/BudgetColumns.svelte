<!--
  The two sides of the budget as two columns on one scale: everything the city
  spends, and everything that pays for it.

  Two columns rather than two pies because the question this page opens with is
  not only what each side is made of but whether they are the same size, and two
  circles cannot be compared by eye. Side by side against one scale, the gap
  between the tops is the gap in the budget: what the year does not pay for
  itself, and takes out of last year's surplus to cover.

  Each column is divided into what it is made of, largest at the bottom, and a
  segment names and prices itself on hover or focus the way a wedge did. A
  segment's share is of its own column, since that is the whole it is a part of,
  and colour restarts on each column for the same reason.

  That restarting is right for two columns that are different things --
  Spending and Revenue share no categories, so there is nothing for a shared
  colour to mean. Several columns of the *same* categories, one per year, want
  the opposite: a category read down five bars is read by its colour, and a
  colour that changes bar to bar breaks that. `order` is for that case -- a
  fixed sequence of labels, stacked and coloured by position in it rather than
  by each column's own rank, so "Buildings" is the same colour and the same
  band of every bar whether or not it happens to be the largest that year.
-->
<script module lang="ts">
  export interface Part {
    /** The category, exactly as the book's table prints it. */
    label: string
    /** Dollars. */
    amount: number
  }

  export interface Column {
    /** What the column is: "Spending". */
    label: string
    /** The page it is drawn from, where there is one. */
    href?: string
    /** What it is made of, in any order -- the column draws them largest first. */
    parts: Part[]
    /**
     * The figure to print, where a document states one that is not the sum of
     * the parts. The book's appropriations column adds to a dollar more than
     * the total printed under it, and the site shows the stated one.
     */
    total?: number
  }
</script>

<script lang="ts">
  import { COLOURS } from "$lib/chart-colours"

  let {
    rows,
    order,
    minHeight = 256,
  }: {
    rows: Column[]
    /**
     * A fixed label order to stack and colour every column by, instead of
     * each column sorting and colouring its own parts independently. A
     * column missing one of these labels just skips that band -- a category
     * a given year has nothing in. A part whose label is not in `order` is
     * the other way around, a category `order` does not know about, and
     * throws rather than drawing nothing: silently dropping a real figure is
     * worse than a build failure that says which label to add.
     */
    order?: string[]
    /**
     * The plot's own floor, in pixels, for a page that hands this component
     * less room than that to grow into -- 16rem by default, which is what
     * `min-h-64` used to fix this at unconditionally, for the front page's
     * two full-height columns. A chart sitting above a page of reading wants
     * shorter than that; without an override here it would take the 16rem
     * anyway and run into whatever sits below it.
     */
    minHeight?: number
  } = $props()

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

  const totals = $derived(
    rows.map((row) => row.total ?? row.parts.reduce((sum, part) => sum + part.amount, 0)),
  )

  /** The taller column: what the top of the plot is worth. */
  const scale = $derived(Math.max(...totals, 0))

  const columns = $derived(
    rows.map((row, i) => {
      const total = totals[i]
      const drawn = row.parts.reduce((sum, part) => sum + part.amount, 0)

      // With no fixed `order`, each column sorts and colours its own parts
      // independently -- the two-column case this component started as.
      // With one, every part has to be in it: a label `order` does not know
      // stays undrawn silently otherwise, which is worse than a build error
      // naming it.
      const sequence = order
        ? order
            .map((label) => row.parts.find((part) => part.label === label))
            .filter((part): part is Part => part !== undefined)
        : [...row.parts].sort((a, b) => b.amount - a.amount)
      if (order) {
        for (const part of row.parts) {
          if (!order.includes(part.label)) {
            throw new Error(`"${part.label}" is not in the order BudgetColumns was given`)
          }
        }
      }

      return {
        ...row,
        total,
        // Of the scale, which is what makes the two columns comparable.
        height: scale ? (total / scale) * 100 : 0,
        parts: sequence.map((part) => ({
          ...part,
          // Of `order`'s own position when there is one, so a category keeps
          // its colour whether or not it is the largest in this column; of
          // this column's own rank otherwise.
          colour:
            COLOURS[(order ? order.indexOf(part.label) : sequence.indexOf(part)) % COLOURS.length],
          // Of its own column, so the segments fill it whatever it is worth.
          depth: drawn ? (part.amount / drawn) * 100 : 0,
          share:
            drawn && part.amount / drawn < 0.001
              ? "<0.1%"
              : percent.format(drawn ? part.amount / drawn : 0),
        })),
      }
    }),
  )

  /** The segment under the pointer, or the one holding focus. */
  let active = $state<{ column: string; part: string } | null>(null)
  const shown = $derived.by(() => {
    const at = active
    if (!at) return null
    return columns
      .find((column) => column.label === at.column)
      ?.parts.find((part) => part.label === at.part)
  })

  /** Full strength unless something else in the same column has the pointer. */
  const lit = (column: string, part: string) =>
    active === null || active.column !== column || active.part === part

  /**
   * Where the tooltip sits: over the segment, measured against the plot rather
   * than worked out from the widths, and pulled back from either edge so it
   * stays on the page.
   */
  let root = $state<HTMLElement | null>(null)
  let spot = $state({ x: 0, y: 0 })

  const TOOLTIP = 224

  const show = (column: string, part: string, segment: HTMLElement) => {
    active = { column, part }
    if (!root) return

    const edge = root.getBoundingClientRect()
    const box = segment.getBoundingClientRect()
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

<!-- `h-full` and a growing plot, so the chart fills whatever height it is given
     -- the front page hands it the window, less the fixed footer, and makes it
     stick. Where nothing sets a height, `minHeight` keeps it drawable. -->
<div class="budget-columns not-prose relative flex h-full flex-col" bind:this={root}>
  <!-- The columns are as wide as the words under them and no wider. A column
       carries one number; the width past that is width spent saying nothing,
       and two narrow columns side by side are easier to compare than two broad
       ones. -->
  <div class="flex flex-1 items-end gap-6" style="min-height: {minHeight}px">
    {#each columns as column (column.label)}
      <div class="budget-column flex h-full w-24 flex-col justify-end">
        <!-- `flex-col-reverse`, so the largest part sits on the ground and the
             columns are read against each other from the same baseline. -->
        <div class="flex flex-col-reverse gap-px overflow-hidden" style="height: {column.height}%">
          {#each column.parts as part (part.label)}
            {#if part.depth > 0}
              <!--
                Focusable, so the chart can be read without a mouse, and
                `role="img"` with a name because that is what it is: a picture
                of one figure.
              -->
              <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
              <div
                class="w-full cursor-default transition-opacity outline-none"
                style="height: {part.depth}%; background: {part.colour}; opacity: {lit(
                  column.label,
                  part.label,
                )
                  ? 1
                  : 0.4}"
                role="img"
                aria-label="{column.label}, {part.label}, {money.format(part.amount)}, {part.share}"
                tabindex="0"
                onpointerenter={(event) => show(column.label, part.label, event.currentTarget)}
                onpointerleave={() => (active = null)}
                onfocus={(event) => show(column.label, part.label, event.currentTarget)}
                onblur={() => (active = null)}
              ></div>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-2 flex gap-6">
    {#each columns as column (column.label)}
      <p class="m-0 w-24 text-xs">
        {#if column.href}
          <!-- The column's name is the way into the side of the book it is
               drawn from, which is why neither has a line in the contents. -->
          <a
            class="font-semibold text-slate-900 underline decoration-slate-400 decoration-2 underline-offset-2 hover:decoration-slate-900"
            href={column.href}
          >
            {column.label}
          </a>
        {:else}
          <span class="font-semibold text-slate-900">{column.label}</span>
        {/if}
        <span class="mt-0.5 block whitespace-nowrap text-slate-600 tabular-nums">
          {money.format(column.total)}
        </span>
      </p>
    {/each}
  </div>

  {#if shown}
    <!-- Over the segment it belongs to. Hidden from assistive technology,
         because the segment already carries all of it as its name. -->
    <div
      class="budget-tooltip pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/95 px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md ring-1 ring-slate-200"
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
