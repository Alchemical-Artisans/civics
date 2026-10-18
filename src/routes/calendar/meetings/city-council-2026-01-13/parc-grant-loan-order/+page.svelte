<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "parc-grant-loan-order"
</script>

<p>
  <strong>Doc 19-H</strong> - Mayor Barrett submits a Loan Order for the Parkland Acquisitions and Renovations
  for Communities (PARC) Grant 5.1.1. Order -that the City Council on behalf of the City votes to appropriate
  and authorize the Treasurer, with approval of the Mayor to raise or borrow the sum of up to $644,564.00
  for the Clement Farm Conservation Area improvement project
</p>

<p><em>This requires a two-thirds majority vote.</em></p>

<p class="text-right"><em>Filed December 16, 2025</em></p>

<AddressMap address="Clement Farm, Haverhill, MA" lat={42.8131801} lon={-71.1085} />

<h2>Minutes</h2>

<p>
  Mayor Barrett addressed the council. She noted this was on December 16<sup>th</sup> meeting, but
  it did not have the 2/3<sup>rd</sup>s vote due to not a full council. She noted this is for
  improvements.
</p>

<p>
  Motion by Councilor Sullivan, Second by Vice President Michitson<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Document # 19-G, the Mayor&rsquo;s letter, the order and the papers filed with it<span
        class="sr-only">, PDF, eight pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
