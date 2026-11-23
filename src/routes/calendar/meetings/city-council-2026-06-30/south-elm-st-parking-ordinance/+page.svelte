<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-30"
  const ITEM = "south-elm-st-parking-ordinance"
</script>

<p>
  <strong>Doc 17-H-</strong> Ordinance re: Vehicles and traffic: Amend Ch 240, be further amended by
  <strong>ADDING</strong> the following to § 240-85 schedule B: Parking Restriction and prohibition:
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
      <td>South Elm St<br />In front of # 146</td>
      <td>No Parking<br />(expect for 1-24 hours handicap parking space)</td>
      <td>24 hours</td>
    </tr>
  </tbody>
</table>

<p class="text-right"><strong><em>Filed June 17, 2026</em></strong></p>

<AddressMap address="146 South Elm St, Haverhill, MA" lat={42.7693637} lon={-71.0841817} />

<h2>Minutes</h2>

<p>
  MOTION BY COUNCILOR SULLIVAN, SECOND BY COUNCILOR FERREIRA<br />
  PASSED YEAS 11, NAYS 0, ABSENT 0
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Document # 17-H, the City Engineer&rsquo;s letter, the ordinance, and the legal notice<span
        class="sr-only">, PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
