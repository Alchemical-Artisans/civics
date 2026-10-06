<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "natural-resources-and-public-property-committee-meeting"
  // The sitting this item announces, which has records of its own.
  const COMMITTEE = "natural-resources-and-public-property-committee-2026-09-14"
</script>

<p>
  Councilor Lewandowski wishes to announce the Natural Resources and Public Property subcommittee
  meeting on
  <a href={Router.meeting(COMMITTEE)}>Monday, September 14, 2026, at 6PM</a>
  in Room 202, City Council Chambers
</p>

<h2>Minutes</h2>

<p>
  Councilor Lewandowski addressed the council. She stated we will be discussing fixed vendor
  locations and whether or not we will be updating our ordinance including an increase of vendors at
  each of our six locations.
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/announcement`)} target="_blank" rel="noopener">
      Letter from Councilor Melissa J. Lewandowski, August 4, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/public-meeting-notice`)}
      target="_blank"
      rel="noopener"
    >
      Public Meeting Notice, July 20, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/remote-link-email`)} target="_blank" rel="noopener">
      Email from HC Media with the link to join<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/fixed-vendor-ordinance-materials`)}
      target="_blank"
      rel="noopener"
    >
      Mayor&rsquo;s letter of May 29, 2026, draft ordinances amending Article IV of Chapter 191, and
      emails on fixed location vendors<span class="sr-only"
        >, PDF, 42 pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
