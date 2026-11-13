<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "vietnam-veterans-memorial-gift-louis-fossarelli"
</script>

<p>Mayor Barrett submits the following gift order:</p>

<ul>
  <li>
    <strong>5.2.1</strong> Order- Authorizing City Council to accept a gift of $1,000.00 to the Vietnam
    Veterans Memorial at Mill Brook Park in honor of Louis Fossarelli, the gift shall be used by the Vietnam
    Veterans Memorial Commission
  </li>
</ul>

<AddressMap address="Mill Brook Park, Haverhill, MA" lat={42.7781825} lon={-71.0661067} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, November 13, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order, Gift Acceptance<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/attorneys-letter`)} target="_blank" rel="noopener">
      Letter from Michael J. Migliori, Fiorello &amp; Migliori, Attorneys at Law<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
