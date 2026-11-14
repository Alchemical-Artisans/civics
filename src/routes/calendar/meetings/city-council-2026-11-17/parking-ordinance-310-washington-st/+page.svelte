<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "parking-ordinance-310-washington-st"
</script>

<p>
  <u><strong>Doc 10-S-</strong></u> Ordinance re: Vehicles and Traffic; Amend Ch 240, be further amended
  by ADDING the following to&sect; 240-85 schedule B; Parking Restrictions and Prohibitions:
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
      <td>310 Washington St</td>
      <td>No Parking (Except for 1 24- hour Handicap parking space)</td>
      <td>24 hours</td>
    </tr>
  </tbody>
</table>

<p class="text-right"><strong><u>Filed on October 21, 2026</u></strong></p>

<AddressMap address="310 Washington St, Haverhill, MA" lat={42.7711832} lon={-71.0908968} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/document-10-s`)} target="_blank" rel="noopener">
      Document # 10-S, with the clerk's record of October 6, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, P.E., City Engineer, October 14, 2026<span class="sr-only"
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
    <a href={Router.excerpt(MEETING, `${ITEM}/notice-confirmation`)} target="_blank" rel="noopener">
      Confirmation of the notice placed with the Haverhill Gazette<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
