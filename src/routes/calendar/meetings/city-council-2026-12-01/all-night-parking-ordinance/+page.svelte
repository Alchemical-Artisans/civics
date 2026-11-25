<script lang="ts">
  import Diff from "$lib/Diff.svelte"
  import { Router } from "$lib/router"
  import { HEADING, REDLINE } from "./ordinance"

  const MEETING = "city-council-2026-12-01"
  const ITEM = "all-night-parking-ordinance"
</script>

<p>5.1. Mayor Barrett submits the following order:</p>

<ul>
  <li>
    <strong>5.1.1.</strong> Order- Authorizing City Council to amend Chapter 240, Article V, &sect; 240-24
    (&ldquo;All- night parking&rdquo;) of the Code of the City of Haverhill
  </li>
</ul>

<p class="text-right"><strong><u>FILE 10 DAYS</u></strong></p>

<hr />

<!-- The section this corrects was amended by the order of 29 September and
     20 October, whose new Subsection D named November 15 as the publication
     deadline; this order changes that one word. -->

<h2>Letter from the Mayor</h2>

<p>
  I respectfully submit an Order to amend the Code of the City of Haverhill, Ch. 240, Article V,
  &sect;240-24 (&ldquo;All Night Parking&rdquo;) to correct a scrivener&rsquo;s error in Section D
  regarding the commencement date of the ordinance.
</p>

<p>I recommend approval.</p>

<h2>An Order Relating to the Amendment of the All-Night Parking Ordinance</h2>

<p>
  BE IT ORDERED by the City Council of the City of Haverhill that the City Council votes to amend
  Chapter 240, Article V, &sect; 240-24 (&ldquo;All-night parking&rdquo;) of the Code of the City of
  Haverhill as follows:
</p>

<h2>{HEADING.chapter}, {HEADING.article}, {HEADING.title}</h2>

<Diff
  parts={[{ kind: "text", redline: REDLINE }]}
  name="{HEADING.chapter}, {HEADING.article}, {HEADING.title}"
  strikeThrough={{
    href: Router.excerpt(MEETING, `${ITEM}/marked-ordinance`),
    external: true,
  }}
/>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, November 25, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      An Order Relating to the Amendment of the All-Night Parking Ordinance<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/marked-ordinance`)} target="_blank" rel="noopener">
      The same order with the changed word marked<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.meetingItem("city-council-2026-10-20", ITEM)}>
      The order this corrects, as the Council had it on October 20, 2026
    </a>
  </li>
</ul>
