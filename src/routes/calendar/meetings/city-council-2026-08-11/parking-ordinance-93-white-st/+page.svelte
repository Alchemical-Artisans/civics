<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "parking-ordinance-93-white-st"
</script>

<p>
  <strong>Doc 10-O</strong> - Ordinance re: Vehicles and Traffic; Amend Ch 240, be further amended
  by <strong><u>ADDING</u></strong> the following to &sect; 240-85 schedule B: Parking Restrictions and
  Prohibition:
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
      <td><em>93 White St</em></td>
      <td><em>No Parking<br />(except for 1 24- hour handicap parking space)</em></td>
      <td><em>24 hours</em></td>
    </tr>
  </tbody>
</table>

<p class="text-right"><strong><u>Filed on July 29, 2026</u></strong></p>

<AddressMap address="93 White St, Haverhill, MA" lat={42.7778127} lon={-71.0819022} />

<h2>Minutes</h2>

<p>
  Motion by Councilor LePage for approval, Second by Councilor Ferreira<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (Sullivan)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 10-O, with the Council&rsquo;s vote of July 28, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, City Engineer, July 10, 2026<span class="sr-only"
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
