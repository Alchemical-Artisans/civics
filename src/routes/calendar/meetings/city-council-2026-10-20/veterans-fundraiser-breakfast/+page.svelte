<script lang="ts">
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import type { CalendarEvent } from "$lib/ics"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "veterans-fundraiser-breakfast"

  // The agenda states both ends of the hour, so this is a timed event.
  const event: CalendarEvent = {
    uid: `${MEETING}-${ITEM}@haverhill.alchemicalartisans.com`,
    title: "Veterans fundraiser breakfast, Amvets on Primrose Street",
    start: "20261101T090000",
    end: "20261101T110000",
    allDay: false,
    location: "Amvets, Primrose Street, Haverhill, MA",
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
