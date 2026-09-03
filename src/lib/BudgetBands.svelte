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

  Nothing is drawn but those. The figures under each column are the book's own
  cells, printed as it prints them, shares and all; the column's name is the
  name the book's own table carries. A bar that stops short of its band is a
  fund below its floor, which is this year's story in the middle column and is
  left to be read rather than announced.
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
</script>

<!-- `h-full` and a growing plot, so the chart fills whatever height it is
     given -- the reserves page hands it the window, less the fixed footer.
     Where nothing sets a height, `min-h-64` keeps it drawable. -->
<div class="budget-bands not-prose flex h-full flex-col">
  <!-- Rails are as wide as the words under them and no wider. A column carries
       one fund, and width past what its figures need is width spent saying
       nothing. -->
  <div class="flex min-h-64 flex-1 items-end gap-5">
    {#each rows as row (row.label)}
      {@const from = along(row.minimum.amount)}
      {@const to = row.maximum ? along(row.maximum.amount) : 100}
      <!--
        The rail is the whole scale and the band inside it is what the policy
        allows, so the height a bar has left to climb is as visible as the
        height it has covered. `role="img"` with a name, because a column is a
        picture of three figures and a screen reader gets all three; the lines
        under it print them too.
      -->
      <div
        class="budget-band relative h-full w-28 bg-slate-50"
        role="img"
        aria-label="{row.label}: {row.actual.label} {row.actual.cell}, {row.minimum.label} {row
          .minimum.cell}{row.maximum ? `, ${row.maximum.label} ${row.maximum.cell}` : ''}"
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
          class="absolute inset-x-5 bottom-0"
          style="height: {along(row.actual.amount)}%; background: {HELD}"
        ></div>
      </div>
    {/each}
  </div>

  <!-- Under the rails, in the order the column is drawn: what it holds, then
       the ceiling at the top of the band and the floor at the bottom of it. -->
  <div class="mt-2 flex gap-5">
    {#each rows as row (row.label)}
      <p class="m-0 w-28 text-[11px] leading-snug">
        <span class="block font-semibold text-slate-900">{row.label}</span>
        <span class="mt-0.5 block text-slate-700 tabular-nums">
          {row.actual.label}
          {row.actual.cell}
        </span>
        {#if row.maximum}
          <span class="block text-slate-500 tabular-nums">
            {row.maximum.label}
            {row.maximum.cell}
          </span>
        {/if}
        <span class="block text-slate-500 tabular-nums">
          {row.minimum.label}
          {row.minimum.cell}
        </span>
      </p>
    {/each}
  </div>
</div>
