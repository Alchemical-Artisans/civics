<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-22"
  const ITEM = "confirming-appointments"
</script>

<p><em>Haverhill Cultural Council, expires on September 30, 2029</em></p>

<ul>
  <li>
    <strong>11.1.1</strong>
    Tatana Burgos-Espinal, 16 Chandler St<br />
    Nicole Heena, 49 Mount Vernon St<br />
    Nancy Zlotsky,70 Washington St Unit 502<br />
    Emilee Hopkins, 28 Haverhill St
  </li>
</ul>

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
    <a href={Router.excerpt(MEETING, `${ITEM}/correspondence`)} target="_blank" rel="noopener">
      The appointees&rsquo; own letters of interest, forwarded by John Hassan, Chair of the
      Haverhill Cultural Council<span class="sr-only">, PDF, seven pages, opens in a new tab</span>
    </a>
  </li>
</ul>
