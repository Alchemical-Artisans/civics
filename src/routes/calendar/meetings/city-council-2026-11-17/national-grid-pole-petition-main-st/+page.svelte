<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "national-grid-pole-petition-main-st"
</script>

<p>
  Petition from National Grid and Verizon, requesting a joint pole location for Main St WR#31383651
</p>

<p class="text-right"><strong><u>Hearing for December 8, 2026</u></strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/letter`)} target="_blank" rel="noopener">
      Letter from Dave Johnson, National Grid, September 21, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/petition`)} target="_blank" rel="noopener">
      Petition for Joint or Identical Pole Locations, Main Street<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/sketch`)} target="_blank" rel="noopener">
      Petition Sketch, Main St<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order for Joint or Identical Pole Locations, with certificate<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
