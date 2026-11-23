<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-30"
  const ITEM = "school-building-lease-415-primrose-st"
</script>

<p>Mayor Barrett submits an order relating to the approval of school building lease</p>

<ul>
  <li>
    <strong>5.8.1.</strong> Order &ndash; authorize the Mayor to enter into a lease agreement between
    the City of Haverhill and the Roman Catholic Archbishop of Boston for property located at 415 Primrose
    St and further to approve the lease for an initial five-year term beginning July 1, 2026 with an option
    to extend the term for one additional five-year term
  </li>
</ul>

<AddressMap address="415 Primrose St, Haverhill, MA" lat={42.7885287} lon={-71.0868369} />

<h2>Minutes</h2>

<p>
  Mayor Barrett addressed the council. She noted this is now what we refer to as Gateway Academy.
</p>

<p>
  Councilor Ferreira asked at some point if there is a possibility of purchasing this building.
  Mayor Barrett stated she doesn&rsquo;t believe the archdiocese would sell.
</p>

<p>
  MOTION BY COUNCILOR MCGONAGLE, SECOND BY VICE PRESIDENT MICHITSON<br />
  PASSED YEAS 11, NAYS 0, ABSENT 0
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, the order, the request for proposals and the lease
      agreement<span class="sr-only">, PDF, forty-nine pages, opens in a new tab</span>
    </a>
  </li>
</ul>
