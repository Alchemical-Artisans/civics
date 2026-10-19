<script lang="ts">
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import { boundsAround } from "$lib/map"
  import { Router } from "$lib/router"
  import { STRETCH } from "./stretch"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "parking-ordinance-washington-st-niagara-to-pleasant-view"
</script>

<p>
  Ordinance re: Vehicles and Traffic; Amend Ch 240, be further amended by ADDING the following
  to&sect; 240-85 schedule B; Parking Restriction and Prohibition:
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
      <td>Niagara St to Pleasant View Ave</td>
      <td>NO PARKING</td>
      <td>24 HRS</td>
    </tr>
  </tbody>
</table>

<!-- The stretch itself, drawn as the street runs. A table row reading
     "Niagara St to Pleasant View Ave" is two names a reader has to hold
     against a map of their own to see what is being banned; this is the
     quarter mile the ordinance covers, both sides of it, as the City
     Engineer's memo says. See `stretch.ts` for where the line comes from. -->
<div class="not-prose my-4 h-96 max-w-xl">
  <PrecinctMap
    interactive
    title="Washington Street from Niagara Street to Pleasant View Avenue, where the ordinance would prohibit parking"
    bounds={boundsAround(STRETCH)}
    areas={[]}
    lines={[
      {
        points: STRETCH,
        name: "Washington Street, Niagara Street to Pleasant View Avenue: no parking, 24 hours, on either side",
        label: "No parking",
      },
    ]}
    width={576}
    height={384}
    caption="The stretch is OpenStreetMap's own line for Washington Street."
  />
</div>

<p class="text-right"><strong>File 10 Days</strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa DeMeo, City Engineer, October 15, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      The ordinance<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>

<hr />

<h2>Memo from Lisa DeMeo, City Engineer, October 15, 2026</h2>

<p>Subject: Washington Street&ndash; No Parking Ordinance</p>

<p>
  As requested by Traffic &amp; Safety, attached is an Ordinance for No Parking on either side of
  Washington Street from Niagara Street to Pleasant View Ave due to an increase in pedestrian
  traffic and additional vehicular traffic. Please contact me if you have any questions.
</p>

<h2>An Ordinance Relating to Vehicles and Traffic</h2>

<p>MUNICIPAL ORDINANCE &ndash; CHAPTER 240</p>

<p>
  BE IT ORDAINED by the City Council of the City of Haverhill that the Code of the City of
  Haverhill, Chapter 240, as amended, be further amended by adding the following to &sect; 240-85
  Schedule B: Parking Restrictions and Prohibitions:
</p>

<table>
  <tbody>
    <tr>
      <td>Washington St:<br />Niagara St to Pleasant View Ave</td>
      <td>No Parking</td>
      <td>24 hrs</td>
    </tr>
  </tbody>
</table>
