<!--
  The 2026 State Election as a card on the front page: the city's precincts,
  and the run of dates the election is made of, with today's place in it.

  The front page's rule for a card is that it *is* its subject rather than a
  description of one, and the project is two things -- where to vote and how
  the city is getting there -- so the card draws both, small: the map with
  every precinct a link to its own page, and the timeline with what has
  already happened greyed and today marked between the past and what is still
  ahead. A reader who knows their precinct is one click from their polling
  place without passing through the project at all.

  The whole card links to the project, by way of the heading's `::after`, as
  the other cards do. The map and the timeline's links sit above it with
  `relative`, the same way the week strip's chips stay clickable.

  No precinct numbers on this map. At a card's size the downtown labels pile
  on top of each other, and the names are on each shape for a reader who
  hovers or tabs to one; the project's own map has the room to print them.
-->
<script lang="ts">
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { boundsOf } from "$lib/map"
  import { entryDate, entryId, timeline } from "$lib/projects"
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

  let { today }: { today: string } = $props()

  const entries = timeline(PROJECT)
  const bounds = boundsOf(WARDS.map((w) => w.shape))
  const markers = buildings().map((places) => ({
    lon: places[0].lon,
    lat: places[0].lat,
    name: `${places[0].name}, ${places[0].address}: ${places.map((p) => p.label).join("; ")}`,
  }))

  // An entry is behind us once its last day is, so the fortnight of early
  // voting stays current until it closes.
  const lastDay = (entry: (typeof entries)[number]) =>
    entry.kind === "date" && entry.through ? entry.through : entryDate(entry)
  const past = (entry: (typeof entries)[number]) => lastDay(entry) < today

  // Where "today" falls: before the first entry still ahead. Drawn as a line
  // across the timeline rather than a ring on an entry, because today is
  // usually a day nothing on it happens.
  const firstAhead = $derived(entries.findIndex((entry) => !past(entry)))
</script>

<div
  class="relative flex flex-col rounded-xl border border-slate-200 p-5 transition-colors focus-within:border-slate-400 hover:border-slate-300 hover:bg-slate-50 sm:p-6"
>
  <div class="flex flex-wrap items-baseline justify-between gap-x-3">
    <h2 class="text-lg font-semibold text-slate-900">
      <a
        class="after:absolute after:inset-0 after:content-['']"
        href={Router.project(PROJECT.slug)}
      >
        {PROJECT.title}
      </a>
    </h2>
    <p class="m-0 text-xs text-slate-500">
      {formatLongDate(ELECTION.date)}, {ELECTION.hours}
    </p>
  </div>

  <div class="mt-2 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
    <div class="relative">
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
        caption="Ward and precinct lines: {PRECINCT_SOURCE.name}. Polling places: the warrant."
      />
    </div>

    <ol class="not-prose m-0 self-center border-l-2 border-slate-200 pl-4 text-sm">
      {#each entries as entry, at (entryId(entry))}
        {#if at === firstAhead}
          <li class="relative -ml-4 flex items-center gap-2 py-1 pl-4">
            <span
              aria-hidden="true"
              class="absolute -left-[0.4rem] h-2.5 w-2.5 rounded-full bg-amber-400"
            ></span>
            <span class="text-[10px] font-semibold tracking-wide text-amber-700 uppercase"
              >Today</span
            >
            <span class="h-px flex-1 bg-amber-300" aria-hidden="true"></span>
          </li>
        {/if}
        <li class="relative py-1.5 {past(entry) ? 'text-slate-400' : 'text-slate-800'}">
          <span
            aria-hidden="true"
            class="absolute top-3 -left-[1.4rem] h-2.5 w-2.5 rounded-full border-2 border-white {past(
              entry,
            )
              ? 'bg-slate-300'
              : 'bg-slate-500'}"
          ></span>
          <p class="m-0 text-xs {past(entry) ? 'text-slate-400' : 'text-slate-500'}">
            {formatLongDate(entryDate(entry))}{#if entry.kind === "date" && entry.through}
              &ndash; {formatLongDate(entry.through)}{/if}
          </p>
          {#if entry.kind === "item"}
            <a
              class="relative underline hover:text-sky-800"
              href={Router.meetingItem(entry.meeting, entry.item)}>{entry.title}</a
            >
          {:else}
            <p class="m-0">{entry.title}</p>
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</div>
