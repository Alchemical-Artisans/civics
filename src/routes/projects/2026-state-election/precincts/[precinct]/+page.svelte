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
  import { onMount } from "svelte"
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { boundsOf } from "$lib/map"
  import { Router } from "$lib/router"
  import {
    ELECTION,
    PRECINCTS,
    PRECINCT_SOURCE,
    PROJECT,
    QUESTIONS,
    VOTER_INFORMATION,
    WARDS,
    ballotFor,
    electionEvent,
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
  // One ballot is one panel; two are a tab each.
  const panels = $derived(sameBallot ? [parts[0]] : parts)

  let activeBallot = $state("")
  const current = $derived(panels.some((p) => p.id === activeBallot) ? activeBallot : panels[0].id)
  let ballotsLive = $state(false)
  onMount(() => (ballotsLive = true))

  const moveBallot = (event: KeyboardEvent) => {
    const at = panels.findIndex((p) => p.id === current)
    if (event.key === "ArrowRight") activeBallot = panels[(at + 1) % panels.length].id
    else if (event.key === "ArrowLeft")
      activeBallot = panels[(at - 1 + panels.length) % panels.length].id
    else if (event.key === "Home") activeBallot = panels[0].id
    else if (event.key === "End") activeBallot = panels[panels.length - 1].id
    else return
    event.preventDefault()
    document.getElementById(`ballot-tab-${activeBallot}`)?.focus()
  }
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

  const statewide = QUESTIONS.filter((q) => !q.local)
  const local = QUESTIONS.filter((q) => q.local)
</script>

<svelte:head>
  <title>{title} - {PROJECT.title} - Haverhill</title>
  <meta
    name="description"
    content="Haverhill {title} in the {PROJECT.title}: its polling place, its place in Ward {precinct.ward}, and every office and question on its ballot."
  />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
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
    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
      <p class="text-sm text-slate-600">{formatLongDate(ELECTION.date)}, {ELECTION.hours}</p>
      <AddToCalendar event={electionEvent(precinct.id)} filename="{PROJECT.slug}-{precinct.id}" />
    </div>

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

  <!-- The same split as the project's own page: the map on the left, what is
       to be read about it on the right. -->
  <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <div>
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
    </div>

    <section aria-labelledby="ballot">
      <h2 id="ballot" class="text-lg font-semibold text-slate-900">Ballot</h2>

      <!-- An `A` half is a second ballot, so it is a tab of its own rather than
         a column squeezed in beside the first. Hidden markup, not absent: until
         this mounts the tab bar is `display: none` and every ballot sits in the
         flow under its own heading, so a reader who never hydrates gets them
         stacked. -->
      <div class="ballots" class:live={ballotsLive}>
        {#if panels.length > 1}
          <div
            role="tablist"
            aria-label="Ballots"
            class="ballot-tab-bar mt-3 flex flex-wrap gap-x-4 gap-y-1 border-b border-slate-200"
          >
            {#each panels as part (part.id)}
              <button
                type="button"
                role="tab"
                id="ballot-tab-{part.id}"
                aria-controls="ballot-panel-{part.id}"
                aria-selected={current === part.id}
                tabindex={current === part.id ? 0 : -1}
                class="-mb-px cursor-pointer border-b-2 px-1 py-2 text-sm font-medium {current ===
                part.id
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'}"
                onclick={() => (activeBallot = part.id)}
                onkeydown={moveBallot}
              >
                Precinct {part.id}
              </button>
            {/each}
          </div>
        {/if}

        {#each panels as part, i (part.id)}
          <div
            id="ballot-panel-{part.id}"
            role="tabpanel"
            aria-labelledby={panels.length > 1 ? `ballot-tab-${part.id}` : "ballot"}
            class="ballot-panel"
            class:active={current === part.id}
          >
            {#if panels.length > 1}
              <h3 class="ballot-panel-heading mt-4 font-medium text-slate-900">
                Precinct {part.id}
              </h3>
            {/if}
            <table class="mt-3 w-full text-left text-sm">
              <thead class="border-b border-slate-300 text-slate-500">
                <tr>
                  <th scope="col" class="py-1 pr-3 font-medium">Office</th>
                  <th scope="col" class="py-1 pr-3 font-medium">District</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                {#each ballots[i] as cell, row (row)}
                  {@const differs =
                    panels.length > 1 && ballots.some((b) => b[row].district !== cell.district)}
                  <tr class={differs ? "bg-orange-50" : ""}>
                    <th scope="row" class="py-1.5 pr-3 font-normal text-slate-900">{cell.office}</th
                    >
                    <td class="py-1.5 pr-3 text-slate-700">
                      {cell.district}{#if !cell.onWarrant}<sup>*</sup>{/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/each}
      </div>

      {#if offWarrant}
        <!-- The warrant names the Third Essex House district and no other. See
           `ballotFor` for why this is said rather than left off. -->
        <p class="mt-2 max-w-prose text-xs text-slate-500">
          <sup>*</sup> Not on the warrant. The warrant names a Representative in General Court race only
          for the Third Essex District; MassGIS's 2021 district lines put this part of the precinct in
          the Fifteenth Essex District, which also elects a representative this year.
        </p>
      {/if}

      <h3 class="mt-8 font-semibold text-slate-900">Questions</h3>
      <!-- Statewide questions are linked out, not quoted; the city's own is
         in no state publication, so it is quoted from the warrant. -->
      <p class="mt-1 text-sm">
        <a
          class="underline hover:text-slate-900"
          href={VOTER_INFORMATION}
          target="_blank"
          rel="external noopener noreferrer"
          >Questions 1 to {statewide.length}: Information for Voters<span class="sr-only"
            >, opens in a new tab</span
          ></a
        >
      </p>
      {#each local as q (q.number)}
        <div class="mt-4 max-w-prose text-sm">
          <h4 class="font-medium text-slate-900">Question {q.number}</h4>
          <div class="prose prose-sm mt-2 max-w-none prose-slate">
            <p>{q.question}</p>
            <h5>SUMMARY</h5>
            {#each q.summary as paragraph (paragraph)}
              <p>{paragraph}</p>
            {/each}
          </div>
        </div>
      {/each}
    </section>
  </div>
</div>

<style>
  .ballot-tab-bar {
    display: none;
  }

  .ballots.live .ballot-tab-bar {
    display: flex;
  }

  .ballots.live .ballot-panel {
    display: none;
  }

  .ballots.live .ballot-panel.active {
    display: block;
  }

  /* The tab already names the ballot; the heading is for the stacked, un-hydrated view. */
  .ballots.live .ballot-panel-heading {
    display: none;
  }
</style>
