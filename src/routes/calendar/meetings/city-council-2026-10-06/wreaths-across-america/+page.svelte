<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import type { CalendarEvent } from "$lib/ics"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-06"
  const ITEM = "wreaths-across-america"

  // The letter gives a day and no hour, so this is an all-day event; the end
  // of an all-day event is the day after (iCalendar's exclusive DTEND).
  const event: CalendarEvent = {
    uid: `${MEETING}-${ITEM}@haverhill.alchemicalartisans.com`,
    title: "Wreaths Across America, Hilldale Cemetery",
    start: "20261219",
    end: "20261220",
    allDay: true,
    location: "Hilldale Cemetery, Haverhill, MA",
    description: `Wreaths Across America at Hilldale Cemetery.\nCity Council agenda item: ${Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`)}`,
    url: Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`),
  }
</script>

<p>
  Mayor Barrett and Councilor Sullivan wish to introduce Tammy Dobrosielski from the
  <em>Hilldale Cemetery Association</em> to speak about this year&rsquo;s &ldquo;Wreaths Across
  America&rdquo; program at Hilldale Cemetery which will be held on Saturday, December 19<sup
    >th</sup
  >
</p>

<div class="not-prose my-4">
  <AddToCalendar {event} filename="wreaths-across-america-2026-12-19" />
</div>

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
