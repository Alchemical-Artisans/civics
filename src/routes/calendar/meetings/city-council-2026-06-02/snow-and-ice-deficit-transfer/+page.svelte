<script lang="ts">
  import { Router } from "$lib/router"
  import { ORDERS } from "../../../../budget/fy2027/council-orders"

  const MEETING = "city-council-2026-06-02"
  const ITEM = "snow-and-ice-deficit-transfer"
</script>

<!-- The order's words come from `council-orders.ts`, which the reserves page
     reads too. -->
<p>13.4. {ORDERS[3].text}</p>

<h2>Minutes</h2>

<p>
  Mayor Barrett stated over two million of this will go towards starting to retire our 3.4 million
  snow and ice deficit. She noted the remaining are for grant matches and on a high note engineering
  and services for the fire station is among this money.
</p>

<p>
  MOTION BY COUNCILOR SULLIVAN, SECOND BY COUNCILOR LEPAGE<br />
  PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      The order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>
