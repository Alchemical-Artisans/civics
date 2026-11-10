<!--
  A timeline with what is behind the reader folded away and what is ahead in
  view, headed and ready to stand in a column of its own.

  **This was `ProjectTimeline`'s whole body**, and came out of it when a page
  that is not a project wanted the same thing: `/issues/drought` is an authored
  topic page, not an undertaking in `PROJECTS`, and putting it there to get a
  timeline would have put "Drought" in the bar's Projects menu alongside the
  elections and the budgets. So the fold, the heading, today's date and the
  fragment handling are here, over a plain `TimelineEntry[]`, and
  `ProjectTimeline` is what maps a `Project` onto that list.

  Three components now, each with one job: `Timeline` is the rail and the
  dots, this is the fold and the heading, `ProjectTimeline` is the registry.

  An entry links in by its own `id` as the fragment, and `:target` rings it.
  The fold opens itself when the address names an entry inside -- the link
  would otherwise land on nothing -- and scrolls to it once it has slid into
  place, which the browser could not do while it was hidden.
-->
<script lang="ts">
  import { onMount, tick } from "svelte"
  import { slide } from "svelte/transition"
  import Timeline from "$lib/Timeline.svelte"
  import { easternDate } from "$lib/calendar"
  import { splitTimelineAtToday, type TimelineEntry } from "$lib/timeline"

  let {
    entries,
    /** The build's date, from the page's own server load. */
    today: builtOn,
    /**
     * Whether what is behind the reader is folded away. A record a step or
     * two old is not in the way of what is ahead, and folding its first step
     * leaves the timeline looking emptier than it is, so such a page turns
     * this off and lists everything.
     */
    fold = true,
    /** The section's own heading. */
    heading = "Timeline",
    class: className = "",
  }: {
    entries: TimelineEntry[]
    today: string
    fold?: boolean
    heading?: string
    class?: string
  } = $props()

  /**
   * Today in the city: the build's date in the HTML that is served, the
   * reader's own once this mounts. `inTheBrowser` is unset in the server
   * render and in the client's first, so filling it in is an ordinary
   * reactive change rather than a hydration mismatch -- the same bargain
   * `BudgetTimeline` and the meeting layout make for their own today.
   */
  let inTheBrowser = $state<string | null>(null)
  const today = $derived(inTheBrowser ?? builtOn)

  /**
   * What is behind the reader is folded away; what is ahead is the timeline.
   * The fold is a `<details>`, closed in the served HTML, so with no script
   * it is still a control that works and nothing is hidden for good.
   *
   * **Unless there is nothing ahead, in which case nothing folds.** A fold
   * holds back the record so it is not in the way of what a reader can still
   * act on -- and once every entry is behind the reader there is no what-next
   * for it to be in the way of, so folding leaves a heading, a disclosure
   * arrow reading "14 earlier steps", and an empty rail under it. That is how
   * the 2026 State Election's own page had been drawing since the election
   * was held: a timeline of fourteen sittings, none of them visible. A
   * finished record is still the thing the page is about, so it is shown.
   */
  const { past, upcoming } = $derived.by(() => {
    if (!fold) return { past: [], upcoming: entries }
    const split = splitTimelineAtToday(entries, today)
    return split.upcoming.length ? split : { past: [], upcoming: entries }
  })

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
   * quarter-second the same entry is in the document twice under the same
   * `id`, which is what `:target` and the fragment scroll both address. So the
   * hand-over takes no time at all and `motion` is held back until the reader
   * actually works the control.
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
   * Anything linking to one entry does it with that entry's `id` as the
   * fragment, and most entries are behind the reader. A fold left shut would
   * leave the link landing on nothing, so open it when the address names an
   * entry inside, and take the reader there once it has finished sliding into
   * place.
   */
  async function openForFragment() {
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id || !past.some((entry) => entry.id === id)) return
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
  <h2 id="timeline">{heading}</h2>
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
            <Timeline entries={past} class="space-y-3 border-l-2 border-slate-300 pl-4" />
          </div>
        </div>
      {/if}
    </details>
  {/if}

  <Timeline entries={upcoming} />
</section>
