<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "eagle-scout-ryan-hiro"
</script>

<p>Councilor Sullivan wishes to recognize Ryan Hiro for having earned his Eagle Scout</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Letter from Councilor Thomas J. Sullivan, October 22, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
