<!--
  The 2026 State Election as a card on the front page: the city's precincts,
  and nothing else.

  The front page's rule for a card is that it *is* its subject rather than a
  description of one, and where to vote is what a reader comes to an election
  for -- so the card is the map, each precinct a link to its own page with its
  polling place and ballot. A reader who knows their precinct is one click
  from where they vote without passing through the project at all.

  The whole card links to the project, by way of the heading's `::after`, as
  the calendar's card does. The map sits above that with `relative`, the same
  way the week strip's chips stay clickable.

  No precinct numbers on this map. At a card's size the downtown labels pile
  on top of each other, and the names are on each shape for a reader who
  hovers or tabs to one; the project's own map has the room to print them.
-->
<script lang="ts">
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { boundsOf } from "$lib/map"
  import { Router } from "$lib/router"
  import {
    ELECTION,
    PRECINCTS,
    PRECINCT_SOURCE,
    PROJECT,
    WARDS,
    buildings,
    precinctName,
    wardColour,
  } from "./election"

  const bounds = boundsOf(WARDS.map((w) => w.shape))
  const markers = buildings().map((places) => ({
    lon: places[0].lon,
    lat: places[0].lat,
    name: `${places[0].name}, ${places[0].address}: ${places.map((p) => p.label).join("; ")}`,
  }))
  const [month, day] = [ELECTION.date.slice(5, 7), Number(ELECTION.date.slice(8))]
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
</script>

<div
  class="relative flex min-h-[30rem] flex-col rounded-xl border border-slate-200 p-5 transition-colors focus-within:border-slate-400 hover:border-slate-300 hover:bg-slate-50 sm:p-6"
>
  <div class="flex items-baseline justify-between gap-3">
    <h2 class="text-lg font-semibold text-slate-900">
      <a
        class="after:absolute after:inset-0 after:content-['']"
        href={Router.project(PROJECT.slug)}
      >
        {PROJECT.title}
      </a>
    </h2>
    <!-- The day, short, the way the calendar card prints its week. -->
    <p class="m-0 text-xs whitespace-nowrap text-slate-500" title={formatLongDate(ELECTION.date)}>
      {MONTHS[Number(month) - 1]}
      {day}
    </p>
  </div>

  <div class="relative mt-2 flex flex-1 items-center">
    <PrecinctMap
      title="Haverhill's twenty-one precincts, each a link to its polling place and ballot"
      {bounds}
      areas={PRECINCTS.map((p) => ({
        id: p.id,
        shape: p.shape,
        name: precinctName(p.id),
        href: Router.precinct(PROJECT.slug, p.id),
        fill: wardColour(p.ward),
        opacity: 0.4,
      }))}
      outlines={WARDS.map((w) => ({ shape: w.shape, name: `Ward ${w.ward}` }))}
      {markers}
      width={640}
      height={520}
      caption="Ward and precinct lines: {PRECINCT_SOURCE.name}."
    />
  </div>
</div>
