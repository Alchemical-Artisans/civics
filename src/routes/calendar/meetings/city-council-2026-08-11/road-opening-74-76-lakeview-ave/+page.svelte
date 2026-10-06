<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "road-opening-74-76-lakeview-ave"
</script>

<p>
  <strong>EROM-26-18</strong> - Lisa DeMeo, <em>City Engineer,</em> requests approval to open the roadway
  to allow for the cut off of existing gas service at the main for demo purposes, which requires National
  Grid to excavate in the right of way
</p>

<ul>
  <li><strong>8.2.1.</strong> Order &ndash; approve request to excavate at 74-76 Lakeview Ave</li>
</ul>

<AddressMap address="74-76 Lakeview Ave, Haverhill, MA" lat={42.7945912} lon={-71.0796589} />

<h2>Minutes</h2>

<p>
  Motion by Councilor Sullivan for approval, Second by Councilor Toohey<br />
  PASSED &ndash; Yeas 11, Nays 0, Absent 0
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, City Engineer, July 29, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/national-grid-request`)}
      target="_blank"
      rel="noopener"
    >
      Request from National Grid, July 28, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/sketch`)} target="_blank" rel="noopener">
      National Grid sketch of the excavation<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
