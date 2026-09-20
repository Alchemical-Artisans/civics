<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-22"
  const ITEM = "event-applications"
</script>

<p><strong>Amusement/Event Application:</strong> <em>with Police approval</em></p>

<ul>
  <li>
    <strong>12.2.1</strong> <strong>EVNT-26-29-</strong> Anastasia Dimopoulos for the
    <em>Hellenic Orthodox Community</em>
    located at 154 Winter St requests to hold a two-day Annual festival fundraiser on Friday, November
    6<sup>th</sup>, 2026 from 11:00AM - 10:00 PM &amp; Saturday November 7<sup>th</sup> from 11:00 AM
    - 1:00AM
  </li>
  <li>
    <strong>12.2.2</strong> <strong>EVNT-26-26 -</strong> Cynthia Graham for the
    <em>Haverhill Firefighting Museum</em>
    located at 75 Kenoza Ave to hold a Chili/ Chowder Cookoff on Sunday October 25<sup>th</sup>,
    2026 from 5:00 -10:00 PM
  </li>
</ul>

<hr />

<ul>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/hellenic-orthodox-community-application`)}
      target="_blank"
      rel="noopener"
    >
      Event permit application, EVNT-26-29, Hellenic Orthodox Community<span class="sr-only">
        , PDF, seventeen pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/firefighting-museum-application`)}
      target="_blank"
      rel="noopener"
    >
      Event permit application, EVNT-26-26, Haverhill Firefighting Museum<span class="sr-only">
        , PDF, ten pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
