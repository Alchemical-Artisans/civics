<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-15"
  const ITEM = "mary-grise-historic-shoe-district"
</script>

<p>
  <em>Washington Street Historic Shoe District Commission,</em> Mary Grise, 18 Essex Street, expires September
  30, 2028
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/her-letter`)} target="_blank" rel="noopener">
      Letter from Mary E. Grise expressing interest in serving, September 10, 2026<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/resume`)} target="_blank" rel="noopener">
      Resume<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
</ul>
