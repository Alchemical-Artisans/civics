<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-30"
  const ITEM = "road-opening-179-monument-st"
</script>

<p>
  <strong>EROM- 26-14-</strong> Lisa DeMeo, <em>City Engineer</em>, requests approval to open the
  roadway to repair a grade 2 gas leak, which requires National Grid to excavate in the right of way
</p>

<ul>
  <li>
    <strong>8.3.1.</strong> Order- approve request to excavate at 179 Monument Street
  </li>
</ul>

<AddressMap address="179 Monument St, Haverhill, MA" lat={42.7884432} lon={-71.1067959} />

<h2>Minutes</h2>

<p>
  MOTION BY COUNCILOR SULLIVAN TO APPROVE THE ORDER, SECOND BY COUNCILOR MCGONAGLE<br />
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
