<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-02"
  const ITEM = "parking-ordinance-30-lancaster-st"
</script>

<p>
  <u><strong>Doc 10-M-</strong></u> Ordinance re: Vehicles and Traffic; Amend Ch 240, be further amended
  by ADDING the following to § 240-85 schedule B: Parking Restrictions and Prohibitions:
</p>

<table>
  <thead>
    <tr>
      <th scope="col">LOCATION</th>
      <th scope="col">REGULATION</th>
      <th scope="col">HOURS/ DAYS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="3">Lancaster St:</td>
    </tr>
    <tr>
      <td>In front of #30</td>
      <td>No Parking (except for 1 24- hour handicap parking space)</td>
      <td>24-Hours</td>
    </tr>
  </tbody>
</table>

<p class="text-right"><strong><em>Filed on May 13, 2026</em></strong></p>

<AddressMap address="30 Lancaster St, Haverhill, MA" lat={42.7803099} lon={-71.0863949} />

<h2>Minutes</h2>

<p>
  MOTION BY COUNCILOR ROGERS, SECOND BY COUNCILOR MCGONAGLE<br />
  PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Document # 10-M with the clerk&rsquo;s record of May 12, 2026, the memo from Lisa E. DeMeo,
      P.E., City Engineer, April 30, 2026, the ordinance and the notice confirmation<span
        class="sr-only">, PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
