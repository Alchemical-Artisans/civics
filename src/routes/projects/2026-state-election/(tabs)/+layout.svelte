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
  import { onMount, tick } from "svelte"
  import { slide } from "svelte/transition"
  import { page } from "$app/state"
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import { easternDate, formatLongDate } from "$lib/calendar"
  import { entryDate, entryId, splitAtToday, timeline } from "$lib/projects"
  import { Router } from "$lib/router"
  import { ELECTION, PROJECT, electionEvent } from "../election"

  let { data, children } = $props()

  const entries = timeline(PROJECT)

  /**
   * Today in the city: the build's date in the HTML that is served, the
   * reader's own once this mounts. `inTheBrowser` is unset in the server render
   * and in the client's first, so filling it in is an ordinary reactive change
   * rather than a hydration mismatch -- the same bargain `BudgetTimeline` and
   * the meeting layout make for their own today.
   */
  let inTheBrowser = $state<string | null>(null)
  const today = $derived(inTheBrowser ?? data.today)

  /**
   * What is behind the reader is folded away; what is ahead is the timeline.
   * The fold is a `<details>`, closed in the served HTML, so with no script it
   * is still a control that works and nothing is hidden for good.
   */
  const { past, upcoming } = $derived(splitAtToday(entries, today))

  /**
   * The fold is a `<details>` so that it is a working control with no script,
   * but a `<details>` cannot animate: the browser hides its content the moment
   * `open` goes, so there is nothing left to slide away. So once the page is
   * live the component owns `open` itself -- `expanded` is what the reader has
   * asked for, and `closing` keeps the attribute on for as long as the content
   * takes to leave -- and the entries sit in an `{#if}` that `slide` can play.
   * Before that, the served markup carries the entries inside the closed
   * `<details>`, which is all a reader with no script needs to open it.
   */
  let expanded = $state(false)
  let closing = $state(false)
  let live = $state(false)
  let duration = $state(250)
  const showPast = $derived(expanded || !live)

  function toggle(event: MouseEvent) {
    // Only once live: before that the browser's own toggle is the control.
    if (!live) return
    event.preventDefault()
    expanded = !expanded
    if (!expanded) closing = true
  }

  /**
   * An agenda item links back here with its own entry's id as the fragment,
   * and most of those entries are now behind the reader. A fold left shut would
   * leave the link landing on nothing, so open it when the address names an
   * entry inside, and take the reader to that entry once it has finished
   * sliding into place, which the browser could not scroll to while it was
   * hidden.
   */
  async function openForFragment() {
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id || !past.some((entry) => entryId(entry) === id)) return
    expanded = true
    await tick()
    await new Promise((resolve) => setTimeout(resolve, duration))
    document.getElementById(id)?.scrollIntoView()
  }
  onMount(() => {
    inTheBrowser = easternDate()
    live = true
    // A reader who has asked their system for less motion gets none.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) duration = 0
    void tick().then(openForFragment)
    window.addEventListener("hashchange", openForFragment)
    return () => window.removeEventListener("hashchange", openForFragment)
  })

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

    <section aria-labelledby="timeline" class="lg:relative lg:min-h-0 lg:overflow-y-auto lg:pr-2">
      <h2 id="timeline" class="text-lg font-semibold text-slate-900">Timeline</h2>
      {#snippet row(entry: (typeof entries)[number])}
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
      {/snippet}

      {#if past.length}
        <!-- Past entries: the record, folded. The summary is a plain line that
             never moves; opening it slides out a tinted, bordered panel under
             it holding the steps it controls, so it is plain which entries the
             arrow belongs to and where they stop. The panel is not wrapped
             round the summary as well, which put a border and padding round
             the line the moment it was clicked and made it jump. -->
        <details open={expanded || closing} class="mt-3 text-sm">
          <summary onclick={toggle} class="cursor-pointer text-slate-600 hover:text-slate-900">
            {past.length} earlier {past.length === 1 ? "step" : "steps"}
          </summary>
          {#if showPast}
            <div transition:slide={{ duration }} onoutroend={() => (closing = false)}>
              <div class="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <ol class="space-y-3 border-l-2 border-slate-300 pl-4">
                  {#each past as entry (entryId(entry))}
                    {@render row(entry)}
                  {/each}
                </ol>
              </div>
            </div>
          {/if}
        </details>
      {/if}

      <ol class="mt-3 space-y-3 border-l-2 border-slate-200 pl-4 text-sm">
        {#each upcoming as entry (entryId(entry))}
          {@render row(entry)}
        {/each}
      </ol>
    </section>
  </div>
</div>
