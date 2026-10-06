<!--
  The 2026 State Election, as a project: where every precinct votes, and the
  agenda items that set it up, in order.

  The where is two views of one thing -- a map and the warrant's table of
  polling places -- and each is a page of its own under this layout rather
  than a panel a script switches, the same reason `spending`'s topics are
  routes: a plain link works before anything hydrates, can be bookmarked, and
  needs no keyboard handling of its own. The map is the project's own URL, so
  it is the view a reader lands on, from an agenda included; the timeline
  sits beside both.

  An agenda item that belongs here links back with its own entry's id as the
  fragment, and `:target` rings that entry -- so a reader arriving from the
  warrant lands on the warrant, with what came before and after it in view.
  No script: the highlight is CSS, and it is there in the served HTML.
-->
<script lang="ts">
  import { page } from "$app/state"
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { entryDate, entryId, timeline } from "$lib/projects"
  import { Router } from "$lib/router"
  import { ELECTION, PROJECT, electionEvent } from "../election"

  let { children } = $props()

  const entries = timeline(PROJECT)

  // Matched on the route, never on the URL against a Router-built href: with
  // `paths.relative` on the two disagree during prerendering. See SiteHeader.
  const TABS = [
    { label: "Map", href: Router.project(PROJECT.slug), route: "" },
    {
      label: "Polling places",
      href: Router.projectPage(PROJECT.slug, "polling-places"),
      route: "/polling-places",
    },
  ]
  const current = $derived((page.route.id ?? "").replace(/^.*\/\(tabs\)/, ""))
</script>

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
    <div>
      <nav
        aria-label="Where to vote"
        class="mb-4 flex flex-wrap gap-x-4 gap-y-1 border-b border-slate-200 text-sm"
      >
        {#each TABS as tab (tab.route)}
          <a
            href={tab.href}
            aria-current={current === tab.route ? "page" : undefined}
            class="-mb-px border-b-2 px-1 py-2 font-medium {current === tab.route
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'}">{tab.label}</a
          >
        {/each}
      </nav>
      {@render children()}
    </div>

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
              class="absolute top-3 -left-[1.4rem] h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-400"
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
    </section>
  </div>
</div>
