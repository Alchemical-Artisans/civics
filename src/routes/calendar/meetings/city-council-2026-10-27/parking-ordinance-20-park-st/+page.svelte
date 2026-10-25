<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "parking-ordinance-20-park-st"
</script>

<p>
  City Engineer, Lisa DeMeo, submits an Ordinance relating to Vehicles and Traffic to add handicap
  parking in front of #20 Park Street
</p>

<p class="text-right"><strong>File 10 days</strong></p>

<AddressMap address="20 Park Street, Haverhill, MA" lat={42.7796054} lon={-71.0730276} />

<hr />

<h2>Memo from the City Engineer</h2>

<p>October 22, 2026</p>

<p>MEMO TO: CITY COUNCIL PRESIDENT TIMOTHY JORDAN AND MEMBERS OF THE CITY COUNCIL</p>

<p>Subject: <em>Park Street #20 &ndash; HPS-26-21 &ndash; Add Handicap Parking</em></p>

<p>As requested, attached is the subject Ordinance to add handicap parking.</p>

<p>Please contact me if you have any questions.</p>

<p>
  Sincerely,<br />
  Lisa E. DeMeo, P.E.<br />
  City Engineer
</p>

<p>C: Mayor Barrett, Lt. Lynch, K. Wright, R. Kimball, L. Mead</p>

<h2>An Ordinance Relating to Vehicles and Traffic</h2>

<p>
  BE IT ORDAINED by the City Council of the City of Haverhill that the Code of the City of
  Haverhill, Chapter 240, &sect;85, Schedule B: Parking Restrictions and Prohibitions, as amended,
  is hereby further amended by ADDING the following:
</p>

<table>
  <thead>
    <tr>
      <th scope="col">Park Street:</th>
      <th scope="col"></th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>In front of #20</td>
      <td>No Parking (except for 1 24-hour handicap parking space)</td>
      <td>24 hours</td>
    </tr>
  </tbody>
</table>

<p>APPROVED AS TO LEGALITY</p>

<p>City Solicitor</p>

<hr />

<ul>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/city-engineers-letter`)}
      target="_blank"
      rel="noopener"
    >
      Memo from Lisa E. DeMeo, P.E., City Engineer, October 22, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      An Ordinance Relating to Vehicles and Traffic, and the confirmation of the notice placed with
      the Haverhill Gazette<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
</ul>
