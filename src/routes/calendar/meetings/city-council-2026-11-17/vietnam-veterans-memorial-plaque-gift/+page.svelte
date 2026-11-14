<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "vietnam-veterans-memorial-plaque-gift"
</script>

<p>Mayor Barrett submits the following gift order:</p>

<ul>
  <li>
    <strong>5.3.1</strong> Order- Authorize the City Council to accept a gift of in-kind services with
    a retail value of $2,850.00 to restore a plaque at the Vietnam Veterans Memorial in memory of Norman
    L. Roy, US Army, from Atwood Memorial, Inc
  </li>
</ul>

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
    <a href={Router.excerpt(MEETING, `${ITEM}/donors-email`)} target="_blank" rel="noopener">
      Email from Atwood Memorial Co., November 10, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/invoice`)} target="_blank" rel="noopener">
      Order, Atwood Memorial Inc.<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>
