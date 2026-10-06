<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-07-14"
  const ITEM = "special-permit-16-margin-st"
</script>

<p>
  <strong>CCSP-26-5</strong> &ndash; Francis Bevilacqua of Bevi Builds II requests approval to replace
  existing single-family dwelling and construct a three-family residential dwelling at 16 Margin St in
  the Residential Urban (RU) zoning district
</p>

<p class="text-right">
  <strong>
    <em>
      Hearing for
      <a href={Router.meetingItem("city-council-2026-08-11", "special-permit-16-margin-st")}
        >August 11, 2026</a
      >
    </em>
  </strong>
</p>

<AddressMap address="16 Margin St, Haverhill, MA" lat={42.7659842} lon={-71.0947883} />

<h2>Minutes</h2>

<p>
  Motion by Vice President Michitson, Second by Councilor Sullivan<br />
  PASSED &ndash; Yeas 9, Nays 0, Absent 2 (Toohey and Diodati)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Special permit application, CCSP-26-5<span class="sr-only"
        >, PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
