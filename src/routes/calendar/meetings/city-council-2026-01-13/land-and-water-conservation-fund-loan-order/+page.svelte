<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "land-and-water-conservation-fund-loan-order"
</script>

<p>
  <strong>Doc 19-G</strong> - Mayor Barrett submits a Loan Order for the Land and Water Conservation Fund
  Grant 5.2.1. Order - that the City Council on behalf of the City vote to appropriate, and authorize
  the Treasurer, with the approval of the Mayor to appropriate or borrow the sum of up to $1,110,756.00
  for the City of Haverhill, Clement Farm Fields, Land and Water Conservation Fund
</p>

<p><em>This requires a two-thirds majority vote.</em></p>

<p class="text-right"><em>Filed December 16, 2025</em></p>

<AddressMap address="Clement Farm, Haverhill, MA" lat={42.8131801} lon={-71.1085} />

<h2>Minutes</h2>

<p>
  Mayor Barrett addressed the council. She noted this was presented on December 16<sup>th</sup>. It
  did not have the 2/3<sup>rd</sup>s vote due to not being a full council. This is part of the
  improvements of the Clement Farm. President Jordan stated we are going to get reimbursed a large
  percentage. Mayor clarified yes, 2/3rds.
</p>

<p>
  Motion by Councilor Sullivan, Second by Councilor Toohey<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Document # 19-H, the Mayor&rsquo;s letter, the order and the papers filed with it<span
        class="sr-only">, PDF, 22 pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
