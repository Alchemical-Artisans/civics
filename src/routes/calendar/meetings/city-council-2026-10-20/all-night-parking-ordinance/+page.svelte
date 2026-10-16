<script lang="ts">
  import OrdinanceDiff from "$lib/OrdinanceDiff.svelte"
  import { Router } from "$lib/router"
  import { HEADING, REDLINE } from "./ordinance"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "all-night-parking-ordinance"
</script>

<p>
  16.1. Mayor Barrett submits an order relating to the amendment of the all-night parking ordinance
</p>

<ul>
  <li>
    <strong>16.1.1</strong> Order- That the City Council votes to amend Chapter 240, Article V, &sect;
    240-24 (&ldquo;All-night parking&rdquo;) of the Code of the City of Haverhill
  </li>
</ul>

<p class="text-right"><strong>Filed September 30, 2026</strong></p>

<hr />

<!-- The same order the Council gave its first reading on 29 September; it
     comes back here as unfinished business, so the packet's cover sheet
     carries that reading's own record. The section as the order would amend
     it is drawn as a diff below, and the strike-through the diff links to is
     the city's own marked copy rather than one generated here -- see
     `ordinance.ts`. -->

<h2>Document # 45-A</h2>

<p>
  Order- That the City Council votes to amend Chapter 240, Article V, &sect; 240-24
  (&ldquo;All-night parking&rdquo;) of the Code of the City of Haverhill
</p>

<p>
  IN CITY COUNCIL:
  <a href={Router.meeting("city-council-2026-09-29")}>September 29, 2026</a>
</p>

<p>File 10 Days</p>

<p>10 YEAS, 0 NAYS, 1 ABSENT</p>

<p>Attest: Kaitlin M. Wright Esposito, CMC<br />City Clerk</p>

<h2>An Order Relating to the Amendment of the All-Night Parking Ordinance</h2>

<p>
  BE IT ORDERED by the City Council of the City of Haverhill that the City Council votes to amend
  Chapter 240, Article V, &sect; 240-24 (&ldquo;All-night parking&rdquo;) of the Code of the City of
  Haverhill by adding the language denoted as emboldened as outlined in the following ordinance:
</p>

<h2>{HEADING.chapter}, {HEADING.article}, {HEADING.title}</h2>

<OrdinanceDiff
  redline={REDLINE}
  name="{HEADING.chapter}, {HEADING.article}, {HEADING.title}"
  strikeThrough={{
    href: Router.excerpt(MEETING, `${ITEM}/marked-ordinance`),
    external: true,
  }}
/>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/vote-record`)} target="_blank" rel="noopener">
      Document # 45-A, with the record of the first reading, September 29, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, September 25, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      An Order Relating to the Amendment of the All-Night Parking Ordinance, as filed<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/marked-ordinance`)} target="_blank" rel="noopener">
      The same order with the changed wording marked<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/gazette-confirmation`)}
      target="_blank"
      rel="noopener"
    >
      Confirmation of the notice placed with the Haverhill Gazette<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
