<script lang="ts">
  import { Router } from "$lib/router"

  const DOCUMENT = "city-council-agenda-august-25-2026-a5cd2463"
  const ITEM = "mohawk-trail-no-parking"
</script>

<p>
  Ordinance re: Vehicles and Traffic; Amend Ch 24; be further amended by <strong>ADDING</strong> the following
  to &sect; 240-85 Schedule B: Parking Restrictions and Prohibitions:
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
      <td>Mohawk Trail<br />Both sides, entire length</td>
      <td>No Parking</td>
      <td>24 hrs</td>
    </tr>
  </tbody>
</table>

<p class="text-right"><strong>File 10 Days</strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(DOCUMENT, `${ITEM}/city-engineer-memo`)} target="_blank" rel="noopener">
      Memo from Lisa DeMeo, City Engineer, August 6, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(DOCUMENT, `${ITEM}/order`)} target="_blank" rel="noopener">
      Ordinance<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(DOCUMENT, `${ITEM}/gazette-confirmation`)}
      target="_blank"
      rel="noopener"
    >
      Confirmation of the notice placed with the Haverhill Gazette<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
