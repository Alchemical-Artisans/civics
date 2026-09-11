<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-15"
  const ITEM = "drought-emergency-update"
</script>

<p>
  Mayor Barrett wishes to introduce Robert Ward, Director of Water/ Wastewater to provide an update
  on the Drought Emergency
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, September 11, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/drought-chart`)} target="_blank" rel="noopener">
      Kenoza Lake Drought Stages with Current, 2025, and Average Levels<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
