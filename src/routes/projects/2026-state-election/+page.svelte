<!--
  The 2026 State Election, as a project: where every precinct votes, on a map
  and in a table, and the agenda items that set it up, in order.

  An agenda item that belongs here links back with its own entry's id as the
  fragment, and `:target` rings that entry -- so a reader arriving from the
  warrant lands on the warrant, with what came before and after it in view.
  No script: the highlight is CSS, and it is there in the served HTML.
-->
<script lang="ts">
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import { COLOURS } from "$lib/chart-colours"
  import { formatLongDate } from "$lib/calendar"
  import { boundsOf } from "$lib/map"
  import { entryDate, entryId, timeline } from "$lib/projects"
  import { Router } from "$lib/router"
  import {
    ELECTION,
    POLLING_PLACES,
    PRECINCTS,
    PRECINCT_SOURCE,
    PROJECT,
    WARDS,
    buildings,
    electionEvent,
    precinctName,
  } from "./election"

  const entries = timeline(PROJECT)
  const bounds = boundsOf(WARDS.map((w) => w.shape))

  // A colour per ward, so the precincts read as seven groups before a reader
  // has found a single number on the map. The chart sequence, since it is the
  // one set of colours on the site already checked for telling apart.
  //
  // Not simply the first seven: the seventh is a second blue, and Ward 7 shares
  // a long border with Ward 1's. Ochre is the sequence's furthest from all six
  // of its neighbours' colours.
  const WARD_COLOURS = [0, 1, 2, 3, 4, 5, 11].map((i) => COLOURS[i])
  const wardColour = (ward: number) => WARD_COLOURS[ward - 1]

  // One pin per building, named for every precinct voting there.
  const markers = buildings().map((places) => ({
    lon: places[0].lon,
    lat: places[0].lat,
    name: `${places[0].name}, ${places[0].address}: ${places.map((p) => p.label).join("; ")}`,
  }))

  /** The precinct page a warrant row links to: the row's first precinct, less any `A`. */
  const pageOf = (serves: string[]) => serves[0].replace(/A$/, "")
</script>

<svelte:head>
  <title>{PROJECT.title} - Haverhill</title>
  <meta
    name="description"
    content="Haverhill's {PROJECT.title} on {formatLongDate(
      ELECTION.date,
    )}: every ward, precinct and polling place on a map, and the City Council agenda items that set it up."
  />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
  <header class="mb-6 border-b border-slate-200 pb-6">
    <p class="text-sm text-slate-500">Project</p>
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{PROJECT.title}</h1>
    <!-- No polling place on this one: that depends on the precinct, and each
         precinct's own page offers the event with its building in it. -->
    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
      <p class="text-sm text-slate-600">{formatLongDate(ELECTION.date)}, {ELECTION.hours}</p>
      <AddToCalendar event={electionEvent()} filename={PROJECT.slug} />
    </div>
  </header>

  <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <section aria-labelledby="where">
      <h2 id="where" class="text-lg font-semibold text-slate-900">Where to vote</h2>
      <p class="mt-1 text-sm text-slate-600">
        Choose a precinct on the map or in the table for its polling place and its ballot.
      </p>

      <PrecinctMap
        title="Haverhill's seven wards and twenty-one precincts, with each polling place"
        {bounds}
        areas={PRECINCTS.map((p) => ({
          id: p.id,
          shape: p.shape,
          name: precinctName(p.id),
          href: Router.precinct(PROJECT.slug, p.id),
          fill: wardColour(p.ward),
          opacity: 0.4,
          label: p.id,
        }))}
        outlines={WARDS.map((w) => ({ shape: w.shape, name: `Ward ${w.ward}` }))}
        {markers}
        width={1200}
        height={900}
        caption="Ward and precinct lines: {PRECINCT_SOURCE.name}. Polling places: the warrant."
      />

      <!-- The map's own content in words, and the way in for anyone who
           would rather read a list than find a shape. In the warrant's order
           and spelling. -->
      <table class="mt-4 w-full text-left text-sm">
        <caption class="sr-only">Polling places by ward and precinct</caption>
        <thead class="border-b border-slate-300 text-slate-500">
          <tr>
            <th scope="col" class="py-1 pr-3 font-medium">Ward and Precinct</th>
            <th scope="col" class="py-1 pr-3 font-medium">Polling place</th>
            <th scope="col" class="py-1 font-medium">Address</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#each POLLING_PLACES as place (place.label)}
            <tr>
              <th scope="row" class="py-1.5 pr-3 font-normal">
                <a
                  class="text-sky-800 underline hover:text-slate-900"
                  href={Router.precinct(PROJECT.slug, pageOf(place.serves))}>{place.label}</a
                >
              </th>
              <td class="py-1.5 pr-3 text-slate-700">{place.name}</td>
              <td class="py-1.5 text-slate-700">{place.address}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </section>

    <section aria-labelledby="timeline">
      <h2 id="timeline" class="text-lg font-semibold text-slate-900">Timeline</h2>
      <ol class="mt-3 space-y-3 border-l-2 border-slate-200 pl-4 text-sm">
        {#each entries as entry (entryId(entry))}
          <!-- `target:` is the entry an agenda item linked back to. -->
          <li
            id={entryId(entry)}
            class="relative scroll-mt-24 rounded-md px-2 py-1.5 target:bg-amber-50 target:ring-2 target:ring-amber-400"
          >
            <span
              aria-hidden="true"
              class="absolute top-3 -left-[1.4rem] h-2.5 w-2.5 rounded-full border-2 border-white {entry.kind ===
              'item'
                ? 'bg-sky-700'
                : 'bg-slate-400'}"
            ></span>
            <p class="text-xs text-slate-500">
              {formatLongDate(entryDate(entry))}{#if entry.kind === "date" && entry.through}
                &ndash; {formatLongDate(entry.through)}{/if}
            </p>
            {#if entry.kind === "item"}
              <p class="text-slate-500">{entry.board}, item {entry.number}</p>
              <a
                class="font-medium text-slate-900 underline hover:text-sky-800"
                href={Router.meetingItem(entry.meeting, entry.item)}>{entry.title}</a
              >
            {:else}
              <p class="text-slate-800">{entry.title}</p>
            {/if}
          </li>
        {/each}
      </ol>
      <p class="mt-3 text-xs text-slate-500">
        Agenda items carry a blue mark; dates without one are set by those items' documents.
      </p>
    </section>
  </div>
</div>
