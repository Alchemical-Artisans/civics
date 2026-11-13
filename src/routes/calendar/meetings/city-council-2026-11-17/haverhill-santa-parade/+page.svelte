<script lang="ts">
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import type { CalendarEvent } from "$lib/ics"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-11-17"
  const ITEM = "haverhill-santa-parade"

  // The agenda states the day and "from 12 to 5 PM", so the event is timed.
  const event: CalendarEvent = {
    uid: `${MEETING}-${ITEM}@haverhill.alchemicalartisans.com`,
    title: "Haverhill Santa Parade",
    start: "20261122T120000",
    end: "20261122T170000",
    allDay: false,
    location: "South Main St, Merrimack St, and Emerson St, Haverhill, MA",
    description: `Haverhill Santa Parade, South Main St, Merrimack St, and Emerson St.\nCity Council agenda item: ${Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`)}`,
    url: Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`),
  }
</script>

<ul>
  <li>
    <strong>13.1.1</strong>
    <u><strong>EVNT-26-32-</strong></u> Daniel Plourde Sr., <em>Parade Chairman</em>, requests to
    hold the Haverhill Santa Parade, November 22, 2026, from 12 to 5 PM; on South Main St, Merrimack
    St, and Emerson St
  </li>
</ul>

<div class="not-prose my-4">
  <AddToCalendar {event} filename="haverhill-santa-parade-2026-11-22" />
</div>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Event Permit EVNT-26-32, application and General Release &amp; Indemnity Agreement<span
        class="sr-only"
      >
        , PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/request-letter`)} target="_blank" rel="noopener">
      Letter from Daniel Plourde Sr., Chairman, 62nd Annual VFW Santa Parade<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/insurance-certificate`)}
      target="_blank"
      rel="noopener"
    >
      Certificate of Liability Insurance<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/irs-ein-letter`)} target="_blank" rel="noopener">
      Letter from the Internal Revenue Service, Employer Identification Number<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
