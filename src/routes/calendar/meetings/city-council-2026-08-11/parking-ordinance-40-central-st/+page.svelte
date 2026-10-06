<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "parking-ordinance-40-central-st"
</script>

<p>
  <strong>Doc 40-A</strong> - Ordinance re: Vehicles and Traffic; Amend Ch 240, be further amended
  by <strong><u>DELETING</u></strong> the following to &sect; 240-85 schedule B: Parking Restrictions
  and Prohibitions:
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Location</th>
      <th scope="col">Regulation</th>
      <th scope="col">Hours/Days</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>40 Central St</em></td>
      <td><em>No Parking<br />(except for 1 24-hour handicap parking space</em></td>
      <td><em>24 hours</em></td>
    </tr>
  </tbody>
</table>

<p class="text-right"><strong><u>Filed on July 29, 2026</u></strong></p>

<AddressMap address="40 Central St, Haverhill, MA" lat={42.7735867} lon={-71.0894935} />

<h2>Minutes</h2>

<p>
  Motion by Councilor McGonagle for approval, Second by Councilor Toohey<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Sullivan)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 40-A, with the Council&rsquo;s vote of July 28, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, City Engineer, July 17, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      Ordinance<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/legal-advertisement`)} target="_blank" rel="noopener">
      Legal advertisement order confirmation<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
