<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-07-14"
  const ITEM = "event-applications"
</script>

<p><strong>Amusement/Event Application:</strong> <em>with Police approval</em></p>

<ul>
  <li>
    <strong>12.4.1.</strong> <strong>EVNT-26-20</strong> &ndash; Cynthia Morgan of
    <em>Cyndie&rsquo;s Methodical Media</em> requests to hold Woofstock 2026 on Saturday September 19,
    2026 from 10 AM to 3 PM at Chris&rsquo; Farm Stand located at 436 Salem St
  </li>
</ul>

<AddressMap
  address="Chris' Farm Stand, 436 Salem St, Haverhill, MA"
  lat={42.755907}
  lon={-71.0600689}
/>

<h2>Minutes</h2>

<p>
  Moved to beginning of meeting.<br />
  Cynthia Morgan addressed the council. She stated we are proud to bring this free community event back
  for the third year. She noted 25 vendors and family activities will be part of this event this year.
</p>

<p>
  Motion by Councilor Sullivan to approve, Second by Councilor Rogers<br />
  PASSED &ndash; Yeas 9, Nays 0, Absent 2 (Toohey and Diodati)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Event application, EVNT-26-20<span class="sr-only">, PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/department-approvals`)}
      target="_blank"
      rel="noopener"
    >
      City Clerk, Building, Fire, Health, Police and Public Works approvals<span class="sr-only"
        >, PDF, nine pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/vendor-contract`)} target="_blank" rel="noopener">
      Haverhill&rsquo;s Woofstock 2026 Vendor Contract<span class="sr-only"
        >, PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/certificate-of-insurance`)}
      target="_blank"
      rel="noopener"
    >
      Certificate of liability insurance<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/property-use-acknowledgment`)}
      target="_blank"
      rel="noopener"
    >
      Property Use Acknowledgment, June 3, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/release-and-indemnity`)}
      target="_blank"
      rel="noopener"
    >
      General Release and Indemnity Agreement<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
