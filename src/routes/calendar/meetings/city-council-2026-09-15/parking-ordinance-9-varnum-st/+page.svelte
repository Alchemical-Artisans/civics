<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-15"
  const ITEM = "parking-ordinance-9-varnum-st"
</script>

<p>
  Ordinance re: Vehicles and Traffic; Amend Ch 24; be further amended by <strong>DELETING</strong> the
  following to &sect; 240-85 Schedule B: Parking Restrictions and Prohibitions:
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
      <td>9 Varnum St</td>
      <td>No Parking<br />(except for 1 24- hours Handicap parking space)</td>
      <td>24 hrs</td>
    </tr>
  </tbody>
</table>

<p class="text-right"><strong>File 10 Days</strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa DeMeo, City Engineer<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Ordinance<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>
