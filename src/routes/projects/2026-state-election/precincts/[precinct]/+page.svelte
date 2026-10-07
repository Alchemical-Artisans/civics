<!--
  One precinct: where it votes, where it sits inside its ward, and what is on
  its ballot.

  A precinct with an `A` half is two ballots under one name -- the half exists
  because a district line runs through the precinct -- so the ballot is a
  table with a column for each half, and the row where they differ is the
  reason the half exists.

  Where the precinct votes is not said here: the City Clerk asked that this
  site link her page of polling locations rather than state one of its own.
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
    WARDS,
    ballotFor,
    electionEvent,
    precinctName,
    voterGuideUrl,
  } from "../../election"
  import { CANDIDATES_SOURCE } from "../../candidates"

  let { data } = $props()

  const precinct = $derived(data.precinct)
  const ward = $derived(WARDS.find((w) => w.ward === precinct.ward)!)

  /** The precinct proper and each `A` half, as the parts the ballot is laid out by. */
  const parts = $derived([
    { id: precinct.id, districts: precinct.districts, shape: precinct.shape },
    ...precinct.subprecincts,
  ])
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

  // Framed on the ward, which is what the precinct is drawn inside.
  const bounds = $derived(boundsOf([ward.shape]))

  // Where the precinct has two ballots, its own shape and its half's are the
  // way to pick one from the map as well as from the tabs.
  const select = (id: string) => (panels.length > 1 ? () => (activeBallot = id) : undefined)

  const areas = $derived([
    ...PRECINCTS.map((p) => ({
      id: p.id,
      shape: p.shape,
      name: precinctName(p.id),
      href: p.id === precinct.id ? undefined : Router.precinct(PROJECT.slug, p.id),
      fill: p.id === precinct.id ? "#0369a1" : p.ward === precinct.ward ? "#7dd3fc" : "#cbd5e1",
      opacity: p.id === precinct.id ? 0.55 : 0.35,
      label: p.id === precinct.id ? undefined : p.id,
      onselect: p.id === precinct.id ? select(p.id) : undefined,
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
      onselect: select(s.id),
    })),
  ])

  const title = $derived(precinctName(precinct.id))
</script>

<svelte:head>
  <title>{title} - {PROJECT.title} - Haverhill</title>
  <meta
    name="description"
    content="Haverhill {title} in the {PROJECT.title}: a link to its polling location, its place in Ward {precinct.ward}, and every office and question on its ballot."
  />
</svelte:head>

<!-- On a wide window the page is one screen: the header, then the map and the
     ballot side by side, with the ballot the one thing that scrolls. 6rem is
     the site's bar above and its footer below. -->
<div
  class="mx-auto flex max-w-6xl flex-col px-4 py-8 lg:h-[calc(100dvh-6rem)] lg:overflow-hidden lg:py-4"
>
  <nav class="mb-6 lg:mb-2">
    <a
      class="text-sm text-slate-600 underline hover:text-slate-900"
      href={Router.project(PROJECT.slug)}
    >
      &larr; {PROJECT.title}
    </a>
  </nav>

  <header class="mb-6 border-b border-slate-200 pb-6 lg:mb-3 lg:pb-3">
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
      <p class="text-sm text-slate-600">{formatLongDate(ELECTION.date)}, {ELECTION.hours}</p>
      <AddToCalendar event={electionEvent(precinct.id)} filename="{PROJECT.slug}-{precinct.id}" />
    </div>

    <!-- Where to go, first: it is what most readers came for, and it is the
         Clerk's to say. -->
    <p class="mt-4 text-sm">
      <a
        class="underline hover:text-slate-700"
        href={Router.pollingLocations()}
        target="_blank"
        rel="external noopener noreferrer"
        >Find {title}'s polling location on the City Clerk's website<span class="sr-only"
          >, opens in a new tab</span
        ></a
      >
    </p>
  </header>

  <!-- The same split as the project's own page: the map on the left, what is
       to be read about it on the right. -->
  <div
    class="grid gap-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]"
  >
    <!-- The map takes whatever height the header leaves. -->
    <div class="h-[70dvh] lg:h-full lg:min-h-0">
      <PrecinctMap
        interactive
        title="{title}, outlined within Ward {precinct.ward}"
        {bounds}
        {areas}
        outlines={[{ shape: ward.shape, name: `Ward ${precinct.ward}` }]}
        height={480}
        caption="Ward {precinct.ward} is outlined; {title} is shaded{precinct.subprecincts.length
          ? `, its ${precinct.subprecincts.map((s) => s.id).join(' and ')} half in orange`
          : ''}. Ward and precinct lines: {PRECINCT_SOURCE.name}."
      />
    </div>

    <section aria-labelledby="ballot" class="lg:relative lg:min-h-0 lg:overflow-y-auto lg:pr-2">
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
            {#each ballots[i] as cell, row (row)}
              <!-- The district is in the tooltip only: a voter has one, and it is
                   not what they came to read. -->
              <section title={cell.district} class="mt-4">
                <h4 class="text-sm font-semibold text-slate-900">{cell.office}</h4>
                <ul class="mt-1 space-y-0.5 text-sm text-slate-700">
                  {#each cell.candidates as candidate (candidate.name)}
                    <li>
                      {#if candidate.url}
                        <a
                          class="underline hover:text-slate-900"
                          href={candidate.url}
                          target="_blank"
                          rel="external noopener noreferrer"
                          >{candidate.name}<span class="sr-only">, opens in a new tab</span></a
                        >
                      {:else}
                        {candidate.name}
                      {/if}
                      <span class="text-slate-500">({candidate.party})</span>
                    </li>
                  {/each}
                </ul>
              </section>
            {/each}
          </div>
        {/each}
      </div>

      <p class="mt-2 text-xs text-slate-500">
        Candidates:
        <a
          class="underline hover:text-slate-700"
          href={CANDIDATES_SOURCE.url}
          target="_blank"
          rel="external noopener noreferrer"
          >{CANDIDATES_SOURCE.name}<span class="sr-only">, opens in a new tab</span></a
        >.
      </p>

      <h3 class="mt-8 font-semibold text-slate-900">Questions</h3>
      <!-- Each statewide question goes to its entry in the state's voter guide;
         the city's own is in no state publication, so it has a page here. -->
      <ul class="mt-1 text-sm text-slate-700">
        {#each QUESTIONS as q (q.number)}
          <li>
            {#if q.local}
              <a
                class="underline hover:text-slate-900"
                href={Router.projectPage(PROJECT.slug, `questions/${q.number}`)}
                >Question {q.number}: {q.title}</a
              >
            {:else}
              <a
                class="underline hover:text-slate-900"
                href={voterGuideUrl(q.number)}
                target="_blank"
                rel="external noopener noreferrer"
                >Question {q.number}: {q.title}<span class="sr-only">, opens in a new tab</span></a
              >
            {/if}
          </li>
        {/each}
      </ul>
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
