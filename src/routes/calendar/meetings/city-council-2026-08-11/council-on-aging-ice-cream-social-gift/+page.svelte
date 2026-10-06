<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-11"
  const ITEM = "council-on-aging-ice-cream-social-gift"
</script>

<p>Mayor Barrett submits the following gift order:</p>

<ul>
  <li>
    <strong>5.2.1.</strong> Order- Authorizing Mayor Barrett to accept a gift donation from the WSL Haverhill
    AL LLCIN in the amount of $150.00 for the Council on Aging Ice Cream Social at the Citizen Center
  </li>
</ul>

<h2>Minutes</h2>

<p>Mayor Barrett thanked Wingate for their generous donation.</p>

<p>
  Motion by Vice President Michitson to accept, Second by Councilor Sullivan<br />
  PASSED &ndash; Yeas 11, Nays 0, Absent 0
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, August 7, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order, Gift Acceptance<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>
