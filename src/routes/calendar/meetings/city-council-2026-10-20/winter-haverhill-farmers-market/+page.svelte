<script lang="ts">
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import { boundsAround } from "$lib/map"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "winter-haverhill-farmers-market"

  const VENUE = { name: "143 Essex St, Haverhill, MA", lat: 42.775684, lon: -71.0859945 }
</script>

<p><strong>Amusement/Event Application:</strong> <em>with Police approval</em></p>

<ul>
  <li>
    <strong>12.3.1</strong> <strong>EVNT-26-28</strong> - Jeff Grassie for
    <a href="https://www.creativehaverhill.org/" target="_blank" rel="external noopener noreferrer"
      >Creative Haverhill<span class="sr-only">, opens in a new tab</span></a
    >
    requests to hold Winter Haverhill Farmers Market on every third Saturday &ndash; November 21, December
    19, January 16, and February 20, from 10 AM to 1 PM at Historic New England 143 Essex St
  </li>
</ul>

<!-- Where it is, drawn here rather than embedded: the same map the election's
     precincts are drawn on, which puts the pin in our own document, so it
     carries the address as a label and opens the place on OpenStreetMap. -->
<div class="not-prose my-4 h-80 max-w-xl">
  <PrecinctMap
    interactive
    title="Where the Winter Haverhill Farmers Market would be held: 143 Essex St"
    bounds={boundsAround([[VENUE.lon, VENUE.lat]])}
    areas={[]}
    markers={[
      {
        lon: VENUE.lon,
        lat: VENUE.lat,
        name: `${VENUE.name}, on OpenStreetMap`,
        label: "143 Essex St",
        href: Router.osmView(VENUE.lat, VENUE.lon),
        external: true,
      },
    ]}
    width={576}
    height={320}
  />
</div>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Event permit application, EVNT-26-28, Creative Haverhill<span class="sr-only">
        , PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/permit-record`)} target="_blank" rel="noopener">
      The permit record: the departments&rsquo; approvals and the clerk&rsquo;s messages<span
        class="sr-only"
      >
        , PDF, ten pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/venue-permission`)} target="_blank" rel="noopener">
      Letter from Historic New England offering Team Haverhill the use of the Historic New England
      Center, August 28, 2026<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
</ul>
