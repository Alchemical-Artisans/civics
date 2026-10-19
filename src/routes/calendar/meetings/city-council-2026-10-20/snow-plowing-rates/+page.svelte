<script lang="ts">
  import DiffFrame from "$lib/DiffFrame.svelte"
  import DiffLines from "$lib/DiffLines.svelte"
  import { DIFF_BORDER } from "$lib/diff-style"
  import { diffLines } from "$lib/redline"
  import { Router } from "$lib/router"
  import RateDiff from "./RateDiff.svelte"
  import { CAPTION, COLUMNS, NOTES, SCHEDULE, amended } from "./rates"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "snow-plowing-rates"

  /** The marked copy, the diff's way out to the city's own paper. */
  const MARKED = { href: Router.excerpt(MEETING, `${ITEM}/order-marked`), external: true }

  const notes = diffLines(NOTES)
  const rows = SCHEDULE.filter(amended).length
  const added = rows + notes.filter((line) => line.type === "added").length
  const removed = rows + notes.filter((line) => line.type === "removed").length
</script>

<p>Mayor Barrett proposes an Order to amend Existing Snow Plowing Rates</p>

<ul>
  <li>
    <strong>5.3.1</strong> Order- Amend
    <a href={Router.meeting("city-council-2025-10-21")}>Document 94-O of 2025</a>
  </li>
</ul>

<hr />

<!-- The marked copy rather than the order as filed: the two carry the same
     schedule, but this one also carries the figures the order drops beside
     the ones it puts in their place -- which is what the Council is being
     asked to vote on -- so it is the copy the diff below is transcribed from
     and the one its header opens.

     Drawn as a diff, the way every other amendment on the site is: what the
     order strikes in red, what it adds in green. The schedule is a
     four-column table and a row of it is a line of the diff, since flattening
     a row to a paragraph would lose which column each figure sits in; the
     seven conditions under it are paragraphs and are drawn as `OrdinanceDiff`
     draws paragraphs. See `rates.ts` and `RateDiff.svelte`. -->

<h2>An Order to Amend Document 94-O of 2025</h2>

<p>October___, 2026</p>

<p>AN ORDER TO AMEND DOCUMENT ___ OF 2026</p>

<p>That the fees for private snow plowing and hauling by the City shall be as follows:</p>

<!-- The order's own account of how its copy is marked up. Kept although the
     marks here are a diff's rather than the copy's: it is the order's
     sentence, and the copy it describes is one button away. -->
<p>
  <em>
    Amended by inserting the following <strong>emboldened</strong> language and removing the
    language <del>stricken through</del>:
  </em>
</p>

<p>That the fees for private snow plowing and hauling by the City shall be as follows:</p>

<DiffFrame
  name="An Order to Amend Document 94-O of 2025"
  {added}
  {removed}
  unit={{ one: "line", many: "lines" }}
  strikeThrough={MARKED}
>
  <RateDiff lines={SCHEDULE} columns={COLUMNS} caption={CAPTION} />
  <!-- The conditions follow the schedule in the order and follow it here,
       inside the same box: one document, one diff. -->
  <div class="border-t {DIFF_BORDER} pt-1">
    <DiffLines items={notes} />
  </div>
</DiffFrame>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 16, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/dpw-directors-memo`)} target="_blank" rel="noopener">
      Memo from Robert Kimball, Director, Department of Public Works, October 16, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/city-solicitors-letter`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Lisa L. Mead, City Solicitor, October 16, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/current-rates`)} target="_blank" rel="noopener">
      Document 94-O of 2025, the rates now in force<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      An Order to Amend Document 94-O of 2025, as filed<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={MARKED.href} target="_blank" rel="noopener">
      The same order with the changed figures and wording marked<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
