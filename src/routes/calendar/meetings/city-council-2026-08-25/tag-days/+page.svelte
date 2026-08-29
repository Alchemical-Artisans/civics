<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-25"
  const ITEM = "tag-days"
</script>

<p><strong>Tag Days</strong>: <em>with Police approval</em></p>

<ul>
  <li>
    <strong>12.5.1</strong> <em>Haverhill High Boys and Girls Soccer</em>, October 10, 2026
  </li>
</ul>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/permit-application`)} target="_blank" rel="noopener">
      Tag Day Permit, TAGD-26-12<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/market-basket-letters`)}
      target="_blank"
      rel="noopener"
    >
      Permission letters from Demoulas Super Markets, Inc., August 6, 2026<span class="sr-only">
        , PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
