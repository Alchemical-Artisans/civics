<script lang="ts">
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import type { CalendarEvent } from "$lib/ics"
  import { boundsAround } from "$lib/map"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "big-dog-show"

  const VENUE = { name: "Bradford Common, Haverhill, MA", lat: 42.7673688, lon: -71.0761317 }

  // One stated day with both ends of its hours printed, so it makes an event.
  const bigDogShow: CalendarEvent = {
    uid: `${MEETING}-${ITEM}-big-dog-show@haverhill.alchemicalartisans.com`,
    title: "Big Dog Show, Bradford Common",
    start: "20261031T083000",
    end: "20261031T140000",
    allDay: false,
    location: VENUE.name,
    description: `Big Dog Show, a public art exhibit, at Bradford Common.\nCity Council agenda item: ${Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`)}`,
    url: Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`),
  }
</script>

<p><strong>Amusement/Event Application:</strong> <em>with Police approval</em></p>

<ul>
  <li>
    <strong>12.3.2</strong> <strong>EVNT-26-31</strong> &ndash; Jimmy Carbone for
    <em
      ><a
        href="https://www.whittierbirthplace.org/"
        target="_blank"
        rel="external noopener noreferrer"
        >Whittier Birthplace<span class="sr-only">, opens in a new tab</span></a
      ></em
    >
    requests to hold Big Dog Show, public art exhibit, on Saturday October 31<sup>st</sup> from 8:30 AM
    to 2 PM at Bradford Common
  </li>
</ul>

<div class="not-prose my-4">
  <AddToCalendar event={bigDogShow} filename="big-dog-show-2026-10-31" />
</div>

<!-- See the market's own page for why the map is drawn here rather than
     embedded. -->
<div class="not-prose my-4 h-80 max-w-xl">
  <PrecinctMap
    interactive
    title="Where the Big Dog Show would be held: Bradford Common"
    bounds={boundsAround([[VENUE.lon, VENUE.lat]])}
    areas={[]}
    markers={[
      {
        lon: VENUE.lon,
        lat: VENUE.lat,
        name: `${VENUE.name}, on OpenStreetMap`,
        label: "Bradford Common",
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
      Event permit application, EVNT-26-31, Whittier Birthplace<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/venue-permission`)} target="_blank" rel="noopener">
      Letter from Steven R. Esty, President, Board of Trustees, The First Church of Christ,
      Bradford, April 7, 2026<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/nonprofit-filings`)} target="_blank" rel="noopener">
      Form 990-PF and Form PC, Trustees of the John Greenleaf Whittier Homestead<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/insurance`)} target="_blank" rel="noopener">
      Certificate of liability insurance<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/indemnity`)} target="_blank" rel="noopener">
      General Release &amp; Indemnity Agreement, Big Dog Art Exhibit<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
