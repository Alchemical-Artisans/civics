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
  what lets the three sit under each other here: the pale rail is what the
  policy allows, the bar is what the city holds, and the same inch of width is
  the same money on every row.

  Nothing is drawn but those. The figures beside each row are the book's own
  cells, printed as it prints them, shares and all; the row's name is the name
  the book's own table carries. A bar that stops short of its rail is a fund
  below its floor, which is this year's story on the middle row and is left to
  be read rather than announced.
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

  const across = (money: number) => (scale ? (money / scale) * 100 : 0)

  /** One hue for all three: the bars are one measure, and their names tell them
      apart. A colour each would say the funds are categories to be told apart
      by eye, when what a reader compares here is a bar against its own rail. */
  const HELD = COLOURS[0]
</script>

<div class="budget-bands not-prose my-6 flex flex-col gap-5">
  {#each rows as row (row.label)}
    {@const from = across(row.minimum.amount)}
    {@const to = row.maximum ? across(row.maximum.amount) : 100}
    <div class="budget-band">
      <p class="m-0 flex items-baseline justify-between gap-4 text-sm">
        <span class="font-semibold text-slate-900">{row.label}</span>
        <span class="whitespace-nowrap text-slate-700 tabular-nums">
          {row.actual.label}
          {row.actual.cell}
        </span>
      </p>

      <!--
        The rail is the whole scale and the band inside it is what the policy
        allows, so the width a bar has left to travel is as visible as the width
        it has covered. `role="img"` with a name, because the row is a picture of
        three figures and a screen reader gets all three; the line under it
        prints the two the heading does not.
      -->
      <div
        class="relative mt-1.5 h-6 w-full bg-slate-50"
        role="img"
        aria-label="{row.label}: {row.actual.label} {row.actual.cell}, {row.minimum.label} {row
          .minimum.cell}{row.maximum ? `, ${row.maximum.label} ${row.maximum.cell}` : ''}"
      >
        <!-- What the policy allows. Where it sets no ceiling the band runs to
             the end of the rail and is given no closing edge, since the only
             honest thing to draw at a limit that does not exist is nothing. -->
        <div
          class="absolute inset-y-0 border-l-2 border-slate-500 bg-slate-200"
          class:border-r-2={row.maximum}
          style="left: {from}%; width: {to - from}%"
        ></div>

        <!-- What the city holds. Thinner than the rail and centred in it, so
             the band shows through either side of it and the two are read as
             different kinds of thing rather than as two bars. -->
        <div
          class="absolute inset-y-1.5 left-0"
          style="width: {across(row.actual.amount)}%; background: {HELD}"
        ></div>
      </div>

      <p class="m-0 mt-1 flex justify-between gap-4 text-xs text-slate-600 tabular-nums">
        <span>{row.minimum.label} {row.minimum.cell}</span>
        {#if row.maximum}<span>{row.maximum.label} {row.maximum.cell}</span>{/if}
      </p>
    </div>
  {/each}
</div>
