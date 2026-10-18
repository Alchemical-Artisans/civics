<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "add-handicap-parking-60-franklin-st"
</script>

<p>
  Ordinance re: Vehicles and Traffic; Amend Ch 240, be further amended by ADDING the following to
  &sect; 240-85 schedule B: Parking Restrictions and Prohibitions:
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
    <tr><td><em>60 Franklin St</em></td><td><em>No Parking</em></td><td><em>24-Hrs</em></td></tr>
  </tbody>
</table>

<p>(except for 1 24-hr handicap parking space)</p>

<p class="text-right"><em>File for 10 days</em></p>

<AddressMap address="60 Franklin St, Haverhill, MA" lat={42.779445} lon={-71.0830908} />

<h2>Minutes</h2>

<p>
  Motion by Councilor Toohey, Second by Councilor LePage<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/memo`)} target="_blank" rel="noopener">
      Memorandum from Robert E. Ward, DPW Director, January 6, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      Ordinance, in Municipal Council<span class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
