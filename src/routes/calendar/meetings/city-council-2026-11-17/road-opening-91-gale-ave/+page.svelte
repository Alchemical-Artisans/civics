<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "road-opening-91-gale-ave"
</script>

<p>
  <u><strong>EROM-26-24</strong></u>- Lisa DeMeo, City Engineer, requests to open the roadway to
  allow the installation of a new gas service as the oil tank is leaking, at 91 Gale Ave, which
  requires National Grid to excavate in the right of away
</p>

<ul>
  <li><strong>8.1.1</strong> Order &ndash; Approve request to excavate at 91 Gale Ave</li>
</ul>

<AddressMap address="91 Gale Avenue, Haverhill, MA" lat={42.7972884} lon={-71.0739875} />

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
      Order, Approve request to excavate at 91 Gale Avenue<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
