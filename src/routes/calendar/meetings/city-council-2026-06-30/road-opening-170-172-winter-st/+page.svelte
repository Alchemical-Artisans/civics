<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-30"
  const ITEM = "road-opening-170-172-winter-st"
</script>

<p>
  <strong>EROM- 26-15-</strong> Lisa DeMeo, <em>City Engineer</em>, requests approval to open the
  roadway to allow for installation of a fire suppression water service, at 170-172 Winter Street,
  which is necessary to support the operational needs of the property
</p>

<ul>
  <li>
    <strong>8.4.1.</strong> Order- approve request to excavate within the Locust St right of way
  </li>
</ul>

<AddressMap address="170-172 Winter St, Haverhill, MA" lat={42.7775876} lon={-71.0836938} />

<h2>Minutes</h2>

<p>
  MOTION BY COUNCILOR SULLIVAN TO APPROVE THE ORDER, SECOND BY COUNCILOR TOOHEY<br />
  PASSED YEAS 11, NAYS 0, ABSENT 0
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Letter from Lisa DeMeo, City Engineer, and the order<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
