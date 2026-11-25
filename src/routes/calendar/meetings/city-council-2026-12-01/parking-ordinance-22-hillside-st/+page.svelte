<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-12-01"
  const ITEM = "parking-ordinance-22-hillside-st"
</script>

<p>
  <u><strong>Doc 40-C</strong></u> Ordinance re: Vehicles and Traffic; Amend Ch 240, be further amended
  by DELETING the following in &sect; 240-85 schedule B; Parking Restrictions and Prohibitions:
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
      <td>22 Hillside St</td>
      <td>(Except for 1 24-hour Handicap parking)</td>
      <td>24 hours</td>
    </tr>
  </tbody>
</table>

<p class="text-right"><strong><u>Filed November 18, 2026</u></strong></p>

<AddressMap address="22 Hillside Street, Haverhill, MA" lat={42.7762653} lon={-71.0900235} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/document-40-c`)} target="_blank" rel="noopener">
      Document # 40-C, with the record of November 17, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, P.E., City Engineer, November 12, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      An Ordinance Relating to Vehicles and Traffic<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/published-notice`)} target="_blank" rel="noopener">
      The ordinance as published in the Haverhill Gazette, 11/19/26<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.meetingItem("city-council-2026-11-17", ITEM)}>
      Its first reading, November 17, 2026
    </a>
  </li>
</ul>
