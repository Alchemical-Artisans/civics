<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import type { CalendarEvent } from "$lib/ics"
  import { Router } from "$lib/router"

  const MEETING = "bradford-elementary-school-site-council-2026-10-20"
  const ITEM = "district-site-council-training"

  // This agenda prints "6:00-7:15" with no am or pm against it. The Hunking
  // School Site Council's agenda of 6 October calls the same evening's training
  // "Wednesday October 21 6P.M. - 7:15P.M.", so the hours are the city's own
  // rather than a guess at which half of the day a school training falls in.
  const event: CalendarEvent = {
    uid: `${MEETING}-${ITEM}@haverhill.alchemicalartisans.com`,
    title: "District Site Council Training",
    start: "20261021T180000",
    end: "20261021T191500",
    allDay: false,
    location: "Consentino Middle School, Haverhill, MA",
    description: `District Site Council Training at Consentino Middle School.\nBradford Elementary School Site Council agenda item: ${Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`)}`,
    url: Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`),
  }
</script>

<ul>
  <li>Wednesday October 21, 2026 6:00-7:15</li>
  <li>Consentino Middle School</li>
</ul>

<div class="not-prose my-4">
  <AddToCalendar {event} filename="district-site-council-training-2026-10-21" />
</div>

<AddressMap address="Consentino Middle School, Haverhill, MA" lat={42.7701089} lon={-71.1027448} />
