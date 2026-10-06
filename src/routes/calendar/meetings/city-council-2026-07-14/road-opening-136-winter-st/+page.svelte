<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-07-14"
  const ITEM = "road-opening-136-winter-st"
</script>

<p>
  <strong>EROM-26-16</strong> &ndash; Lisa DeMeo, <em>City Engineer</em>, requests approval to open
  the roadway to allow for the installation of a fire suppression water service, which requires
  Kelley Excavation to excavate in the right of way
</p>

<ul>
  <li><strong>8.4.1.</strong> Order &ndash; approve request to excavate at 136 Winter St</li>
</ul>

<AddressMap address="136 Winter St, Haverhill, MA" lat={42.7774813} lon={-71.0824996} />

<h2>Minutes</h2>

<p>
  Motion by Councilor Rogers, Second by Councilor LePage<br />
  PASSED &ndash; Yeas 9, Nays 0, Absent 2 (Toohey and Diodati)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, City Engineer, July 9, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>
