<!--
  The 2026 State Election, as a project: where every precinct votes, and the
  agenda items that set it up, in order.

  The where is two views of one thing -- a map and the warrant's table of
  polling places -- and each is a page of its own under this layout rather
  than a panel a script switches, the same reason `spending`'s topics are
  routes: a plain link works before anything hydrates, can be bookmarked, and
  needs no keyboard handling of its own. The map is the project's own URL, so
  it is the view a reader lands on, from an agenda included; the timeline
  sits beside both, drawn by `ProjectTimeline` as every project's is.
-->
<script lang="ts">
  import { page } from "$app/state"
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import ProjectTimeline from "$lib/ProjectTimeline.svelte"
  import ShareButton from "$lib/ShareButton.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { Router } from "$lib/router"
  import { ELECTION, PROJECT, electionEvent } from "../election"

  let { data, children } = $props()

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
  // The open tab's own address, so a shared link lands where the sharer was,
  // the way an agenda item's does rather than its sitting's.
  const sharedUrl = $derived(Router.sharedProject(PROJECT.slug, current.slice(1) || undefined))
</script>

<!-- On a wide window the page is one screen: the header, then the map (or the
     page of polling places) and the timeline side by side, each of the two
     columns scrolling for itself. 6rem is the site's bar above and its footer
     below. -->
<div
  class="mx-auto flex max-w-6xl flex-col px-4 py-8 lg:h-[calc(100dvh-6rem)] lg:overflow-hidden lg:py-4"
>
  <header class="mb-6 border-b border-slate-200 pb-6 lg:mb-3 lg:pb-3">
    <p class="text-sm text-slate-500">Project</p>
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{PROJECT.title}</h1>
    <!-- No polling place anywhere: the Clerk states those, and each
         precinct page links her list. -->
    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
      <p class="text-sm text-slate-600">{formatLongDate(ELECTION.date)}, {ELECTION.hours}</p>
      <AddToCalendar event={electionEvent()} filename={PROJECT.slug} />
      <ShareButton url={sharedUrl} text={PROJECT.title} />
    </div>
  </header>

  <div
    class="grid gap-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]"
  >
    <div class="flex flex-col lg:min-h-0">
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
      <div class="lg:relative lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {@render children()}
      </div>
    </div>

    <ProjectTimeline
      project={PROJECT}
      today={data.today}
      class="lg:relative lg:min-h-0 lg:overflow-y-auto lg:pr-2"
    />
  </div>
</div>
