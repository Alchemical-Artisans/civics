<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2023-06-13"
  const ITEM = "first-nations-park-name"
</script>

<p>
  Andrew K Herlihy, Division Director, Community Development submits recommendation of <em
    >Haverhill Historic Commission</em
  >
  to create a park as park of Beck development by Procopio Companies at the intersection of Railroad av,
  South Elm st and the Comeau Bridge in Bradford and Dan Speers Task Force Chair will be addressing the
  Council on this decision
</p>

<blockquote>
  <p>
    <strong>8.6.1.</strong> Order &ndash; that the new public park to be created at 236 South Elm st
    &ndash; Map 711, Block 4, Lot 1 be hereby named <em>First Nations Park</em>
  </p>
</blockquote>

<AddressMap address="236 South Elm St, Haverhill, MA" lat={42.7689663} lon={-71.0864766} />

<hr />

<ul>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/community-development-letter`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Andrew K. Herlihy, Community Development, June 9, 2023<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/shared-history-project`)}
      target="_blank"
      rel="noopener"
    >
      The Shared History Project, Haverhill Native American Commemorative Task Force<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor James J. Fiorentini, June 9, 2023<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
