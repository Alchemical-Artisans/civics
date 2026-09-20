<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-22"
  const ITEM = "recreational-motorized-vehicles-ordinance"
</script>

<p>
  Mayor Barrett submits an ordinance relating to amending Chapter 222 Article XI Recreational
  Motorized Vehicles of the Haverhill City Ordinance restricting the use of motorized bicycles and
  scooters
</p>

<p class="text-right"><strong>File 10 Days</strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, September 18, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/city-solicitors-opinion`)}
      target="_blank"
      rel="noopener"
    >
      Opinion of City Solicitors Lisa Mead and Elizabeth Lydon, September 11, 2026<span
        class="sr-only"
      >
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/ordinance`)} target="_blank" rel="noopener">
      An Ordinance Relating to Amendment to Chapter 222 of the Haverhill City Ordinances<span
        class="sr-only"
      >
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/ordinance-amendments-marked`)}
      target="_blank"
      rel="noopener"
    >
      The same ordinance, with the deletions struck through and the additions in italic<span
        class="sr-only"
      >
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
