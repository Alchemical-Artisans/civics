<script lang="ts">
  import ShapeMap from "$lib/ShapeMap.svelte"
  import { boundsAround } from "$lib/map"
  import { Router } from "$lib/router"
  // The stretch is drawn once, for the sitting that first took the ordinance up,
  // and is read from there rather than traced a second time.
  import { STRETCH } from "../../city-council-2026-10-20/parking-ordinance-washington-st-niagara-to-pleasant-view/stretch"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "parking-ordinance-washington-st-niagara-to-pleasant-view"
</script>

<p>
  <u><strong>Doc 10-T-</strong></u> Ordinance re: Vehicles and Traffic; Amend Ch 240, be further amended
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
      <td>Niagara st to Pleasant View Av</td>
      <td>No Parking</td>
      <td>24 hours</td>
    </tr>
  </tbody>
</table>

<div class="not-prose my-4 h-96 max-w-xl">
  <ShapeMap
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

<p class="text-right"><strong><u>Filed on October 21, 2026</u></strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/document-10-t`)} target="_blank" rel="noopener">
      Document # 10-T, with the clerk's record of October 20, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, P.E., City Engineer, October 15, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      An Ordinance Relating to Vehicles and Traffic<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/notice-confirmation`)} target="_blank" rel="noopener">
      Confirmation of the notice placed with the Haverhill Gazette<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
