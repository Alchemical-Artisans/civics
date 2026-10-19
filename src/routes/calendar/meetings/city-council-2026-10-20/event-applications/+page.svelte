<script lang="ts">
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import PlacesMap from "$lib/PlacesMap.svelte"
  import type { CalendarEvent } from "$lib/ics"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "event-applications"

  // The Big Dog Show is one stated day with both ends of its hours printed.
  // The Winter Haverhill Farmers Market is four separate Saturdays, so it gets
  // no single event here.
  const bigDogShow: CalendarEvent = {
    uid: `${MEETING}-${ITEM}-big-dog-show@haverhill.alchemicalartisans.com`,
    title: "Big Dog Show, Bradford Common",
    start: "20261031T083000",
    end: "20261031T140000",
    allDay: false,
    location: "Bradford Common, Haverhill, MA",
    description: `Big Dog Show, a public art exhibit, at Bradford Common.\nCity Council agenda item: ${Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`)}`,
    url: Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`),
  }
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

<!-- Both events on one map. They were a map each, which showed each place
     and hid the thing two places have to say: these are a mile apart on
     opposite sides of the Merrimack, one downtown and one on the Bradford
     common. -->
<PlacesMap
  title="Where the two events are: Historic New England on Essex Street, and Bradford Common"
  places={[
    {
      name: "143 Essex St, Haverhill, MA",
      label: "143 Essex St",
      lat: 42.775684,
      lon: -71.0859945,
    },
    {
      name: "Bradford Common, Haverhill, MA",
      label: "Bradford Common",
      lat: 42.7673688,
      lon: -71.0761317,
    },
  ]}
/>

<hr />

<ul>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/winter-farmers-market-application`)}
      target="_blank"
      rel="noopener"
    >
      Event permit application, EVNT-26-28, Creative Haverhill<span class="sr-only">
        , PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/winter-farmers-market-permit-record`)}
      target="_blank"
      rel="noopener"
    >
      The permit record: the departments&rsquo; approvals and the clerk&rsquo;s messages<span
        class="sr-only"
      >
        , PDF, ten pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/winter-farmers-market-venue-permission`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Historic New England offering Team Haverhill the use of the Historic New England
      Center, August 28, 2026<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/big-dog-show-application`)}
      target="_blank"
      rel="noopener"
    >
      Event permit application, EVNT-26-31, Whittier Birthplace<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/big-dog-show-venue-permission`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Steven R. Esty, President, Board of Trustees, The First Church of Christ,
      Bradford, April 7, 2026<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/big-dog-show-nonprofit-filings`)}
      target="_blank"
      rel="noopener"
    >
      Form 990-PF and Form PC, Trustees of the John Greenleaf Whittier Homestead<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/big-dog-show-insurance`)}
      target="_blank"
      rel="noopener"
    >
      Certificate of liability insurance<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/big-dog-show-indemnity`)}
      target="_blank"
      rel="noopener"
    >
      General Release &amp; Indemnity Agreement, Big Dog Art Exhibit<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
