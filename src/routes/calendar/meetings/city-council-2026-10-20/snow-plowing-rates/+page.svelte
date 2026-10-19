<script lang="ts">
  import Diff from "$lib/Diff.svelte"
  import { Router } from "$lib/router"
  import { CAPTION, COLUMNS, NOTES, SCHEDULE } from "./rates"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "snow-plowing-rates"

  /** The marked copy, the diff's way out to the city's own paper. */
  const MARKED = { href: Router.excerpt(MEETING, `${ITEM}/order-marked`), external: true }
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
     seven conditions under it are paragraphs and are drawn as paragraphs.
     Both are parts of one document and sit in one box. See `rates.ts`.

     The order's front matter is not here: a blank date, a document number the
     city has not filled in, the line about what the fees shall be printed
     twice, and a sentence explaining that the copy emboldens what it inserts
     and strikes what it removes -- which the diff below says in colour. Seven
     lines of it stood between the agenda and the figures, and none of them
     said anything the schedule does not. The order as filed and the marked
     copy are both at the foot of the page, and the header opens the marked
     one. -->

<Diff
  name="An Order to Amend Document 94-O of 2025"
  parts={[
    { kind: "table", caption: CAPTION, columns: COLUMNS, lines: SCHEDULE },
    { kind: "text", redline: NOTES },
  ]}
  strikeThrough={MARKED}
/>

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
