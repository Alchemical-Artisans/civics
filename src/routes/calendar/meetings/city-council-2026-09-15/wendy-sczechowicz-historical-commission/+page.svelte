<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-15"
  const ITEM = "wendy-sczechowicz-historical-commission"
</script>

<p>
  <em>Haverhill Historical Commission,</em> Wendy Sczechowicz, 40 Locke Street, expires September 30,
  2029
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
    <a href={Router.excerpt(MEETING, `${ITEM}/her-email`)} target="_blank" rel="noopener">
      Email from Wendy Sczechowicz expressing interest in serving, September 3, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/resume`)} target="_blank" rel="noopener">
      Resume<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
</ul>
