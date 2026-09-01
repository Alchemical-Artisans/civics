<!--
  One bar, divided into what it is made of: the reserves a city holds, in the
  proportions it holds them.

  The bar is here because the front page's question about reserves is how much
  there is, not whether each fund is inside the band its policy sets. The bands
  are what the section itself is about -- three dials, a floor and a ceiling
  apiece, which is a page of reading and was a chart of three tracks that took
  more of this page than the answer is worth. One bar says the total and what it
  is made of, and the contents line below it opens the page that says the rest.

  Every figure the bar draws is printed under it, one line per part, so nothing
  is a hover away and nothing is carried by colour -- the bar itself is
  `aria-hidden` decoration over a list that already says it. A part worth
  nothing this year keeps its line and draws no segment, which is the honest
  drawing of $0 and is the case free cash is in.
-->
<script module lang="ts">
  export interface Part {
    /** What the money is: "Fund Balance". */
    label: string
    /** Dollars. */
    amount: number
    /** The share of revenue the book prints beside it: "7.85%". */
    share?: string
  }
</script>

<script lang="ts">
  let { rows }: { rows: Part[] } = $props()

  /**
   * The first three of the pie's colours, in its order, so a page carrying
   * both draws its categories from one sequence rather than two.
   */
  const COLOURS = ["#0369a1", "#ea580c", "#0d9488"]

  const total = $derived(rows.reduce((sum, row) => sum + row.amount, 0))

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  const parts = $derived(
    rows.map((row, i) => ({
      ...row,
      colour: COLOURS[i % COLOURS.length],
      width: total ? (row.amount / total) * 100 : 0,
    })),
  )
</script>

<div class="budget-stack not-prose">
  <!-- `gap` rather than borders between the segments: two fills meeting edge to
       edge read as one shape with a seam, and a gap the colour of the page is
       what separates them everywhere else on this site. -->
  <div class="flex h-4 gap-0.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
    {#each parts as part (part.label)}
      {#if part.width > 0}
        <div style="width: {part.width}%; background: {part.colour}"></div>
      {/if}
    {/each}
  </div>

  <ul class="m-0 mt-3 list-none space-y-1 p-0">
    {#each parts as part (part.label)}
      <li class="flex items-baseline gap-2 text-xs">
        <span
          class="mt-1 inline-block h-2 w-2 shrink-0 rounded-full"
          style="background: {part.colour}"
          aria-hidden="true"
        ></span>
        <span class="text-slate-700">{part.label}</span>
        <span class="ml-auto text-slate-600 tabular-nums">
          {money.format(part.amount)}
          {#if part.share}&middot; {part.share}{/if}
        </span>
      </li>
    {/each}
  </ul>
</div>
