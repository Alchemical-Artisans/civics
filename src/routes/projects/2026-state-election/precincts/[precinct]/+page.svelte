<!--
  One precinct: where it votes, where it sits inside its ward, and what is on
  its ballot.

  A precinct with an `A` half is two ballots under one name -- the half exists
  because a district line runs through the precinct -- so the ballot is a
  table with a column for each half, and the row where they differ is the
  reason the half exists. Where the halves also vote in different buildings
  (Ward 7's Precinct 2 and 2A), each names its own.
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
    QUESTIONS,
    WARDS,
    ballotFor,
    buildings,
    pollingPlaceFor,
    precinctName,
  } from "../../election"

  let { data } = $props()

  const precinct = $derived(data.precinct)
  const ward = $derived(WARDS.find((w) => w.ward === precinct.ward)!)

  /** The precinct proper and each `A` half, as the parts the ballot is laid out by. */
  const parts = $derived([
    { id: precinct.id, districts: precinct.districts, shape: precinct.shape },
    ...precinct.subprecincts,
  ])
  const places = $derived(parts.map((part) => ({ part, place: pollingPlaceFor(part.id) })))

  // One building for the whole precinct, the ordinary case, is said once; two
  // are said per half.
  const oneBuilding = $derived(new Set(places.map((p) => p.place?.address)).size === 1)

  const ballots = $derived(parts.map((part) => ballotFor(part.districts)))
  const sameBallot = $derived(
    ballots.every((b) => JSON.stringify(b) === JSON.stringify(ballots[0])),
  )
  const columns = $derived(sameBallot ? [parts[0]] : parts)
  const offWarrant = $derived(ballots.flat().some((line) => !line.onWarrant))

  // Framed on the ward, which is what the precinct is drawn inside, and
  // stretched to take in the polling place: Ward 7's Precinct 2 votes at
  // Hunking Middle School, which is in Ward 2.
  const bounds = $derived(
    boundsOf(
      [ward.shape],
      places.flatMap(({ place }) => (place ? [[place.lon, place.lat] as [number, number]] : [])),
    ),
  )

  const areas = $derived([
    ...PRECINCTS.map((p) => ({
      id: p.id,
      shape: p.shape,
      name: precinctName(p.id),
      href: p.id === precinct.id ? undefined : Router.precinct(PROJECT.slug, p.id),
      fill: p.id === precinct.id ? "#0369a1" : p.ward === precinct.ward ? "#7dd3fc" : "#cbd5e1",
      opacity: p.id === precinct.id ? 0.55 : 0.35,
      label: p.id === precinct.id ? undefined : p.id,
    })),
    // The `A` half over its parent, in its own colour, so the line the ballot
    // table turns on is the line a reader can see.
    ...precinct.subprecincts.map((s) => ({
      id: s.id,
      shape: s.shape,
      name: `Precinct ${s.id}`,
      fill: "#ea580c",
      opacity: 0.55,
      label: s.id,
    })),
  ])

  // One pin per building: a precinct and its `A` half usually vote in the
  // same one, and two pins on one spot is a duplicate rather than a second
  // place to go.
  const markers = $derived(
    buildings(places.flatMap(({ place }) => (place ? [place] : []))).map(([place]) => ({
      lon: place.lon,
      lat: place.lat,
      name: `${place.name}, ${place.address}`,
    })),
  )

  const title = $derived(precinctName(precinct.id))
</script>

<svelte:head>
  <title>{title} - {PROJECT.title} - Haverhill</title>
  <meta
    name="description"
    content="Haverhill {title} in the {PROJECT.title}: its polling place, its place in Ward {precinct.ward}, and every office and question on its ballot."
  />
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8">
  <nav class="mb-6">
    <a
      class="text-sm text-slate-600 underline hover:text-slate-900"
      href={Router.project(PROJECT.slug)}
    >
      &larr; {PROJECT.title}
    </a>
  </nav>

  <header class="mb-6 border-b border-slate-200 pb-6">
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
    <p class="mt-2 text-sm text-slate-600">
      {formatLongDate(ELECTION.date)}, {ELECTION.hours}
    </p>

    <!-- Where to go, first: it is what most readers came for. -->
    <dl class="mt-4 space-y-2 text-sm">
      {#each oneBuilding ? places.slice(0, 1) : places as { part, place } (part.id)}
        <div>
          <dt class="text-slate-500">
            {oneBuilding ? "Polling place" : `Precinct ${part.id} votes at`}
          </dt>
          <dd class="text-slate-900">
            {#if place}
              <span class="font-medium">{place.name}</span>,
              <a
                class="underline hover:text-slate-700"
                href={Router.map(`${place.address}, Haverhill, MA`)}
                target="_blank"
                rel="external noopener noreferrer"
                >{place.address}<span class="sr-only">, opens a map in a new tab</span></a
              >
            {:else}
              <!-- 3-2A: MassGIS draws it, the warrant names no polling place
                     for it. Said rather than guessed: it is most likely part of
                     Precinct 2's room, but the warrant does not say so. -->
              The warrant names no polling place for Precinct {part.id}.
            {/if}
          </dd>
        </div>
      {/each}
    </dl>
  </header>

  <PrecinctMap
    title="{title}, outlined within Ward {precinct.ward}, with its polling place"
    {bounds}
    {areas}
    outlines={[{ shape: ward.shape, name: `Ward ${precinct.ward}` }]}
    {markers}
    height={480}
    caption="Ward {precinct.ward} is outlined; {title} is shaded{precinct.subprecincts.length
      ? `, its ${precinct.subprecincts.map((s) => s.id).join(' and ')} half in orange`
      : ''}. Ward and precinct lines: {PRECINCT_SOURCE.name}."
  />
  <p class="text-xs text-slate-500">
    {precinct.population.toLocaleString("en-US")} residents at the 2020 census.
  </p>

  <section aria-labelledby="ballot" class="mt-8">
    <h2 id="ballot" class="text-lg font-semibold text-slate-900">On the ballot</h2>
    {#if !sameBallot}
      <p class="mt-1 max-w-prose text-sm text-slate-600">
        {title} votes on two ballots: a district line runs through it, and the side a voter lives on decides
        which of the columns below is theirs.
      </p>
    {/if}

    <table class="mt-3 w-full text-left text-sm">
      <thead class="border-b border-slate-300 text-slate-500">
        <tr>
          <th scope="col" class="py-1 pr-3 font-medium">Office</th>
          {#each columns as part (part.id)}
            <th scope="col" class="py-1 pr-3 font-medium">
              {sameBallot ? "District" : `Precinct ${part.id}`}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        {#each ballots[0] as line, row (row)}
          {@const differs = !sameBallot && ballots.some((b) => b[row].district !== line.district)}
          <tr class={differs ? "bg-orange-50" : ""}>
            <th scope="row" class="py-1.5 pr-3 font-normal text-slate-900">{line.office}</th>
            {#each columns as part, i (part.id)}
              {@const cell = ballots[i][row]}
              <td class="py-1.5 pr-3 text-slate-700">
                {cell.district}{#if !cell.onWarrant}<sup>*</sup>{/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>

    {#if offWarrant}
      <!-- The warrant names the Third Essex House district and no other. See
           `ballotFor` for why this is said rather than left off. -->
      <p class="mt-2 max-w-prose text-xs text-slate-500">
        <sup>*</sup> Not on the warrant. The warrant names a Representative in General Court race only
        for the Third Essex District; MassGIS's 2021 district lines put this part of the precinct in the
        Fifteenth Essex District, which also elects a representative this year.
      </p>
    {/if}

    <h3 class="mt-8 font-semibold text-slate-900">Questions</h3>
    <p class="mt-1 max-w-prose text-sm text-slate-600">
      The same ten on every ballot in the city. Each opens to the summary the warrant prints.
    </p>
    <ol class="mt-3 space-y-2">
      {#each QUESTIONS as q (q.number)}
        <li>
          <details class="group rounded-lg border border-slate-200 text-sm">
            <summary
              class="flex cursor-pointer gap-2 rounded-lg px-3 py-2 select-none [&::-webkit-details-marker]:hidden"
            >
              <span
                aria-hidden="true"
                class="text-slate-400 transition-transform duration-150 group-open:rotate-90"
                >&#9656;</span
              >
              <span>
                <span class="font-medium text-slate-900">Question {q.number}</span>{#if q.kind}<span
                    class="text-slate-500">: {q.kind}</span
                  >{/if}
                <span class="mt-0.5 block text-slate-700">
                  {#if q.yes}<em><strong>A YES VOTE</strong></em> {q.yes}{:else}{q.question}{/if}
                </span>
              </span>
            </summary>
            <div class="prose prose-sm max-w-none border-t border-slate-100 px-3 pt-2 prose-slate">
              {#if q.yes}<p>{q.question}</p>{/if}
              <h4>SUMMARY</h4>
              {#each q.summary as paragraph (paragraph)}
                <p>{paragraph}</p>
              {/each}
              {#if q.yes}<p><em><strong>A YES VOTE</strong></em> {q.yes}</p>{/if}
              {#if q.no}<p><em><strong>A NO VOTE</strong></em> {q.no}</p>{/if}
            </div>
          </details>
        </li>
      {/each}
    </ol>

    <p class="mt-6 text-sm text-slate-600">
      All of it is the
      <a
        class="underline hover:text-slate-900"
        href={Router.meetingItem("city-council-2026-10-06", "election-warrant")}
        >warrant the City Clerk submitted to the Council</a
      >, but for which district a precinct is in, which is MassGIS's.
    </p>
  </section>
</div>
