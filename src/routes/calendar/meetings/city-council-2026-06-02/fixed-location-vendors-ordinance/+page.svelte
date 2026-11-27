<script lang="ts">
  import { Router } from "$lib/router"
  import Diff from "$lib/Diff.svelte"
  import { HEADING, REDLINE } from "./ordinance"

  const MEETING = "city-council-2026-06-02"
  const ITEM = "fixed-location-vendors-ordinance"
</script>

<p>
  5.5. Mayor Barrett along with Councilor Ferreira submits an Ordinance Relating to Fixed Location
  vendors:
</p>

<ul>
  <li><strong>5.5.1.</strong> Order re: Fixed location Vendor: Amend Chapter 191, Article IV</li>
</ul>

<p class="text-right"><strong><u>FILE 10 DAYS</u></strong></p>

<p>
  <strong
    >BE IT ORDAINED by the City Council of the City of Haverhill that Chapter 191, Article IV
    Peddlers and Hawkers, Transient Vendors and Fixed Location Vendors of the Code of the City of
    Haverhill, as amended, being and is hereby further amended as follows:</strong
  >
</p>

<h2>Minutes</h2>

<p>
  MOTION BY COUNCILOR SULLIVAN, SECOND BY COUNCILOR MCGONAGLE<br />
  PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)
</p>

<hr />

<h2>{HEADING.chapter}, {HEADING.article}, {HEADING.title}</h2>

<Diff
  parts={[{ kind: "text", redline: REDLINE }]}
  name="{HEADING.chapter}, {HEADING.article}, {HEADING.title}"
  strikeThrough={{
    href: Router.excerpt(MEETING, `${ITEM}/ordinance-amendments-marked`),
    external: true,
  }}
/>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, May 29, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/ordinance-amendments-marked`)}
      target="_blank"
      rel="noopener"
    >
      An Ordinance Amending Article IV Relating to Fixed Location Vendors, with the deletions struck
      through and the additions underlined<span class="sr-only"
        >, PDF, six pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      The same ordinance, as amended<span class="sr-only">, PDF, six pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
