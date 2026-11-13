<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "road-opening-40-south-warren"
</script>

<p>
  <u><strong>EROM- 26-25-</strong></u> Lisa DeMeo, City Engineer, requests to open the roadway to allow
  for National Grid to relay the gas service as the exiting one is plugged, at 40 South Warren, which
  requires National Grid to excavate in the right of away
</p>

<ul>
  <li><strong>8.2.1</strong> Order &ndash; Approve request to excavate at 40 South Warren</li>
</ul>

<AddressMap address="40 South Warren Street, Haverhill, MA" lat={42.7692772} lon={-71.0735597} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/city-engineers-memo`)} target="_blank" rel="noopener">
      Memo from Lisa E. DeMeo, P.E., City Engineer, November 4, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order, Approve request to excavate at 40 South Warren Street<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
