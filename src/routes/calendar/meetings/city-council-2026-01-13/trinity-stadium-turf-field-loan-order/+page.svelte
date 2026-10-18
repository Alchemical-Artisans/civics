<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "trinity-stadium-turf-field-loan-order"
</script>

<p>
  <strong>Doc 19-F-</strong> Mayor Barrett submits the following Loan Order: 5.8.1. Loan Order to authorize
  borrowing of $1,200,000.00 for all costs associated with the installation of a turf field at Trinity
  Stadium
</p>

<p><em>This requires a two-thirds majority vote.</em></p>

<p class="text-right">Continued from December 16, 2025</p>

<AddressMap address="Trinity Stadium, Haverhill, MA" lat={42.7617576} lon={-71.0450566} />

<h2>Minutes</h2>

<p>
  Mayor Barrett addressed the council. She noted this was on December 16<sup>th</sup> meeting, but
  it did not have the 2/3<sup>rd</sup>s vote due to not a full council. She stated the turf is well
  beyond its years. It is almost now become a safety hazard.
</p>

<p>
  Motion by Councilor Sullivan, Second by Councilor LePage<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Document # 19-F, the Mayor&rsquo;s letter and the loan order<span class="sr-only"
        >, PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
