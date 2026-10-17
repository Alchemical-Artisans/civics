<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import type { CalendarEvent } from "$lib/ics"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "veterans-fundraiser-breakfast"

  // The agenda states both ends of the hour, so this is a timed event.
  //
  // `location` carries the street number the item itself does not, from the
  // same two city records as the map below. A calendar entry is the one place
  // here whose address has to be navigable -- it ends up in a reader's phone,
  // away from the page and its map -- and "Primrose Street" alone routes to
  // most of a mile of it.
  const event: CalendarEvent = {
    uid: `${MEETING}-${ITEM}@haverhill.alchemicalartisans.com`,
    title: "Veterans fundraiser breakfast, Amvets on Primrose Street",
    start: "20261101T090000",
    end: "20261101T110000",
    allDay: false,
    location: "AMVETS, 576 Primrose St, Haverhill, MA",
    description: `Pre-election Veterans fundraiser breakfast at the Amvets on Primrose Street.\nCity Council agenda item: ${Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`)}`,
    url: Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`),
  }
</script>

<p>
  Councilor Lewandowski requests to introduce Patrick Menzie invite the public to the November 1,
  2026, pre-election Veterans fundraiser breakfast, from 9AM to 11AM at the Amvets on Primrose
  Street
</p>

<div class="not-prose my-4">
  <AddToCalendar {event} filename="veterans-fundraiser-breakfast-2026-11-01" />
</div>

<!--
  The item names the venue and the street but no number, and "Amvets" is in
  neither Nominatim nor OpenStreetMap, so the number is not this document's.
  It is the city's: the License Commission's sitting of 1 October 2026 gives
  the licensee as "American Veterans of Haverhill Massachusetts, Inc. d/b/a
  AMVETS, 576 Primrose Street", and the Council's own FIXD-26-10 of 11 August
  2026 puts "AmVets at 576 Primrose St". OSM has one building at that number,
  which is the point below -- so this is the city's own record resolving its
  own shorthand, not a business directory, and not the street centroid the
  rule in docs/document-pages.md bars.
-->
<AddressMap address="AMVETS, 576 Primrose St, Haverhill, MA" lat={42.7929613} lon={-71.0882645} />

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Letter from Councilor Melissa J. Lewandowski, October 15, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
