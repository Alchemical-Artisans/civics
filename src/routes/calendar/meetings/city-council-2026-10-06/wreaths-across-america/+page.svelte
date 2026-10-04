<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-06"
  const ITEM = "wreaths-across-america"
</script>

<p>
  Mayor Barrett and Councilor Sullivan wish to introduce Tammy Dobrosielski from the
  <em>Hilldale Cemetery Association</em> to speak about this year&rsquo;s &ldquo;Wreaths Across
  America&rdquo; program at Hilldale Cemetery which will be held on Saturday, December 19<sup
    >th</sup
  >
</p>

<AddressMap address="Hilldale Cemetery, Haverhill, MA" lat={42.7893138} lon={-71.0955691} />

<p>
  Wreaths Across America is a national program; its own site is
  <a href="https://www.wreathsacrossamerica.org/" target="_blank" rel="external noopener noreferrer"
    >wreathsacrossamerica.org<span class="sr-only">, opens in a new tab</span></a
  >.
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 2, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
