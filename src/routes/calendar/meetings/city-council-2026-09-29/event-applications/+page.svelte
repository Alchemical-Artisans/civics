<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-29"
  const ITEM = "event-applications"
</script>

<p><strong>Amusement/Event Application:</strong> <em>with Police approval</em></p>

<ul>
  <li>
    <strong>12.2.1</strong> <strong>EVNT-26-22-</strong> Laura McQuiston for
    <em>Northshore Magazine</em>, requesting to hold a magazine event at 151 Essex St
    <em>Historic New England Center</em> from 6 &ndash; 9 PM on Tuesday November 17, 2026
  </li>
</ul>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Event permit application, EVNT-26-22, Northshore Magazine<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/permit-record`)} target="_blank" rel="noopener">
      The permit record: payment, the departments&rsquo; approvals, and the clerk&rsquo;s messages<span
        class="sr-only"
      >
        , PDF, twelve pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/release-and-indemnity`)}
      target="_blank"
      rel="noopener"
    >
      General Release &amp; Indemnity Agreement, signed for RMS Media Group, Inc<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/venue-permission`)} target="_blank" rel="noopener">
      Letter from Charles Frizzell, Senior Vice President and COO, Historic New England, July 28,
      2026<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/insurance`)} target="_blank" rel="noopener">
      Certificates of liability insurance<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
