<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "parking-ordinance-310-washington-st"
</script>

<p>
  Ordinance re: Vehicles and Traffic; Amend Ch 240, be further amended by <strong>ADDING</strong> the
  following to&sect; 240-85 schedule B; Parking Restriction and Prohibition:
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Location</th>
      <th scope="col">Regulation</th>
      <th scope="col">Hours/ Days</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>310 Washington St</td>
      <td>No Parking<br />(Expect for 1 24- hour Handicap parking space)</td>
      <td>24 hours</td>
    </tr>
  </tbody>
</table>

<p class="text-right"><strong>File 10 Days</strong></p>

<AddressMap address="310 Washington St, Haverhill, MA" lat={42.7711832} lon={-71.0908968} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, City Engineer, October 14, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      The ordinance<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/gazette-confirmation`)}
      target="_blank"
      rel="noopener"
    >
      Confirmation of the notice placed with the Haverhill Gazette<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>

<hr />

<h2>Memo from Lisa E. DeMeo, City Engineer, October 14, 2026</h2>

<p>Subject: Washington Street #310 &ndash; HPS-26-18 - Add Handicap Parking</p>

<p>As requested, attached is the subject Ordinance to add handicap parking.</p>

<p>Please contact me if you have any questions.</p>

<h2>An Ordinance Relating to Vehicles and Traffic</h2>

<p>
  BE IT ORDAINED by the City Council of the City of Haverhill that the Code of the City of
  Haverhill, Chapter 240, &sect;85, Schedule B: Parking Restrictions and Prohibitions, as amended,
  is hereby further amended by ADDING the following:
</p>

<table>
  <tbody>
    <tr>
      <td>Washington Street:<br />In front of #310</td>
      <td>No Parking<br />(except for 1 24-hour handicap parking space)</td>
      <td>24 hours</td>
    </tr>
  </tbody>
</table>
