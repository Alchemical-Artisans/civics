<!--
  A project's timeline: every agenda item and date on it, in order, with what
  is behind the reader folded away and what is ahead in view.

  It was the election's own, inside that project's layout, until a second
  project needed the same list; every project page draws it, so it is one
  component rather than a copy per project.

  What is left here is the fold, the project registry and today's date: the
  rail itself is `Timeline`, which a continued public hearing's own record
  draws too. An agenda item that belongs to a project links back with its own
  entry's id as the fragment, and `:target` rings that entry -- so a reader
  arriving from the warrant lands on the warrant, with what came before and
  after it in view. No script: the highlight is CSS, and it is there in the
  served HTML.
-->
<script lang="ts">
  import { onMount, tick } from "svelte"
  import { slide } from "svelte/transition"
  import Timeline from "$lib/Timeline.svelte"
  import { easternDate } from "$lib/calendar"
  import {
    entryDate,
    entryId,
    splitAtToday,
    timeline,
    type Entry,
    type Project,
  } from "$lib/projects"
  import type { TimelineEntry } from "$lib/timeline"
  import { Router } from "$lib/router"

  let {
    project,
    /** The build's date, from the page's server load. */
    today: builtOn,
    /**
     * Whether what is behind the reader is folded away. A project only a
     * step or two old has no record long enough to be in the way of what is
     * ahead, and folding its first step leaves its timeline looking emptier
     * than it is, so such a project turns this off and lists every step.
     */
    fold = true,
    class: className = "",
  }: { project: Project; today: string; fold?: boolean; class?: string } = $props()

  const entries = $derived(timeline(project))

  /**
   * A project's entries as rail entries. An agenda item names its board and
   * the agenda's own number above its title and links to its write-up; a date
   * the documents set is a line of text, since nobody met.
   */
  const rows = (list: Entry[]): TimelineEntry[] =>
    list.map((entry) => ({
      id: entryId(entry),
      date: entryDate(entry),
      through: entry.kind === "date" ? entry.through : undefined,
      eyebrow:
        entry.kind === "item"
          ? entry.number
            ? `${entry.board}, item ${entry.number}`
            : entry.board
          : undefined,
      title: entry.title,
      href: entry.kind === "item" ? Router.meetingItem(entry.meeting, entry.item) : undefined,
    }))

  /**
   * Today in the city: the build's date in the HTML that is served, the
   * reader's own once this mounts. `inTheBrowser` is unset in the server render
   * and in the client's first, so filling it in is an ordinary reactive change
   * rather than a hydration mismatch -- the same bargain `BudgetTimeline` and
   * the meeting layout make for their own today.
   */
  let inTheBrowser = $state<string | null>(null)
  const today = $derived(inTheBrowser ?? builtOn)

  /**
   * What is behind the reader is folded away; what is ahead is the timeline.
   * The fold is a `<details>`, closed in the served HTML, so with no script it
   * is still a control that works and nothing is hidden for good.
   */
  const { past, upcoming } = $derived(
    fold ? splitAtToday(entries, today) : { past: [], upcoming: entries },
  )

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
  const showPast = $derived(expanded || !live)

  /**
   * The slide is for the reader's own open and close, and for nothing else.
   *
   * Taking the fold over on mount closes it too -- `live` turning true is what
   * drops `showPast` -- and animating that plays a slide nobody asked for on
   * every load. Worse, the leaving entries sit in the page for as long as it
   * runs, and the entries are the ones the arriving list is drawing: for that
   * quarter-second the same agenda item is in the document twice under the
   * same `id`, which is what `:target` and the fragment scroll both address.
   * So the hand-over takes no time at all and `motion` is held back until the
   * reader actually works the control.
   */
  let motion = $state(250)
  let duration = $state(0)

  function toggle(event: MouseEvent) {
    // Only once live: before that the browser's own toggle is the control.
    if (!live) return
    event.preventDefault()
    duration = motion
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
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) motion = 0
    void tick().then(openForFragment)
    window.addEventListener("hashchange", openForFragment)
    return () => window.removeEventListener("hashchange", openForFragment)
  })
</script>

<section aria-labelledby="timeline" class={className}>
  <h2 id="timeline" class="text-lg font-semibold text-slate-900">Timeline</h2>
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
            <Timeline entries={rows(past)} class="space-y-3 border-l-2 border-slate-300 pl-4" />
          </div>
        </div>
      {/if}
    </details>
  {/if}

  <Timeline entries={rows(upcoming)} />
</section>
