<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-25"
  const ITEM = "joint-pole-location-emerson-st"
</script>

<p>
  Petition from National Grid and Verizon, requesting a joint pole location for Emerson St
  WR#31224561
</p>

<p class="text-right"><strong><em>Hearing for September 15, 2026</em></strong></p>

<hr />

<ul>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/national-grid-letter`)}
      target="_blank"
      rel="noopener"
    >
      Letter from National Grid, July 27, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/petition`)} target="_blank" rel="noopener">
      Petition for Joint or Identical Pole Locations<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/plan`)} target="_blank" rel="noopener">
      Exhibit &lsquo;A&rsquo; plan<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order for Joint or Identical Pole Locations, July 28, 2026<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/abutters`)} target="_blank" rel="noopener">
      Abutting property owners<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/hearing-notice`)} target="_blank" rel="noopener">
      Notice to abutters from the City Clerk, August 26, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
