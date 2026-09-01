<!--
  The budget calendar as a row of boxes, with a mark showing where in that
  calendar today falls.

  The book draws this page as a timeline down a vertical axis, entries
  alternating either side of it. Turned on its side it is the same drawing and
  it fits where a budget book's front page has room for it -- across the foot,
  under two charts and a table of contents -- so the process the rest of the
  page is the outcome of is on the same screen as the outcome.

  A box per entry rather than a rule with points on it: a step of a process is a
  thing with a beginning and an end, twelve of them fill the width evenly, and a
  box is somewhere for words to live.

  Each box holds a few words. The book's own sentence runs to twenty-odd, which
  is a paragraph in a box this wide, so it is a mouseover away instead --
  unshortened, and in the box for a screen reader either way. The summaries are
  ours; everything else here is the book's.

  Boxes are evenly spaced rather than placed by date. Two entries are a day
  apart (2/6 and 2/5) and the last is eight weeks after the one before it, so by
  date the middle of the calendar is an unreadable pile and the end is empty.
  Even spacing puts the reading first; the today mark is still placed by date,
  interpolated between the entries either side of it, so where the budget has
  got to is honest even where the spacing is not.
-->
<script module lang="ts">
  export interface Step {
    /** The date, exactly as the book prints it: "4/9/26", "2/23-3/13". */
    date: string
    /** That date as `YYYY-MM-DD`, or the first day where the book gives a range. */
    on: string
    /** The last day, for the entries the book gives as a range. */
    through?: string
    /** A few words for the box, built from the step's own nouns. Not the book's. */
    summary: string
    /** The step, exactly as the book prints it. */
    step: string
  }
</script>

<script lang="ts">
  import { onMount } from "svelte"

  let {
    steps,
    /**
     * The day the page was built, so the mark is in the prerendered HTML rather
     * than appearing when a script runs. `onMount` replaces it with the
     * reader's own date, which is the one that matters and which only the
     * browser knows.
     */
    asOf,
  }: { steps: Step[]; asOf: string } = $props()

  let inTheBrowser = $state<string | null>(null)
  onMount(() => {
    inTheBrowser = new Date().toISOString().slice(0, 10)
  })

  const today = $derived(inTheBrowser ?? asOf)

  const day = (date: string) => Date.parse(date) / 86_400_000
  const ends = (step: Step) => step.through ?? step.on

  /** Where a box's middle sits along the row, as a percentage of it. */
  const at = (i: number) => ((i + 0.5) / steps.length) * 100

  /**
   * Where today sits: on an entry while it is happening, and between two of
   * them in proportion to the days either side otherwise. Before the first
   * entry the mark is at the start of the row and after the last it is at the
   * end -- which is where it will stay, because a budget calendar is done when
   * the council adopts the budget.
   */
  const now = $derived.by(() => {
    if (!steps.length || today < steps[0].on) return 0

    for (let i = steps.length - 1; i >= 0; i--) {
      if (today < steps[i].on) continue
      if (today <= ends(steps[i])) return at(i)
      if (i === steps.length - 1) return 100

      const gap = day(steps[i + 1].on) - day(ends(steps[i]))
      const gone = day(today) - day(ends(steps[i]))
      return at(i) + (at(i + 1) - at(i)) * (gap > 0 ? Math.min(1, gone / gap) : 1)
    }

    return 0
  })

  /** Where an entry stands against today: behind the mark, under it, ahead. */
  const standing = (step: Step) =>
    today > ends(step) ? "done" : today >= step.on ? "current" : "ahead"

  const longDate = (date: string) => {
    const [y, m, d] = date.split("-").map(Number)
    // UTC, like every other date on this site: the local constructor moves a
    // date west of UTC onto the day before.
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, d)))
  }

  /** The box under the pointer, or the one holding focus. */
  let active = $state<number | null>(null)
  const shown = $derived(active === null ? null : steps[active])

  /**
   * The sentence sits under the row, and it is wider than a box, so it is
   * pulled towards the middle at either end rather than hanging off the side of
   * a drawing that scrolls.
   */
  const detailAt = $derived(active === null ? 50 : Math.min(Math.max(at(active), 14), 86))

  /**
   * The today label hangs off its own mark, and at the ends of the calendar --
   * where this book's mark sits, past the last box -- half of it would be
   * outside the drawing, which scrolls and so clips it. At the ends it hangs
   * inwards instead.
   */
  const labelShift = $derived(now > 90 ? "-100%" : now < 10 ? "0%" : "-50%")
</script>

<!--
  Twelve boxes need room a phone does not have, so the drawing keeps its width
  and scrolls inside itself, the way the wide tables in a budget section do.
-->
<div class="budget-timeline not-prose -mx-1 overflow-x-auto px-1 pt-2 pb-4">
  <div class="min-w-[72rem]">
    <!-- Three lanes: the today mark's label, the boxes, and the room the book's
         own sentence appears in. The last is held open whether or not anything
         is hovered, so the page does not jump under the pointer. -->
    <div class="relative pt-8 pb-20">
      <ol class="m-0 grid list-none grid-cols-12 gap-1.5 p-0">
        {#each steps as step, i (step.date)}
          {@const status = standing(step)}
          <!-- The box is the list item itself: a `<div>` inside it taking the
               pointer would be a static element with a handler, and the entry is
               one thing either way. -->
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <li
            class="m-0 rounded-md px-2 py-2 text-center transition-shadow outline-none {status ===
            'ahead'
              ? 'bg-white ring-1 ring-slate-200'
              : status === 'current'
                ? 'bg-sky-700 ring-2 ring-sky-700'
                : 'bg-sky-50 ring-1 ring-sky-200'} {active === i ? 'shadow-md' : ''}"
            tabindex="0"
            onpointerenter={() => (active = i)}
            onpointerleave={() => (active = null)}
            onfocus={() => (active = i)}
            onblur={() => (active = null)}
          >
            <span
              class="block text-xs font-medium {status === 'current'
                ? 'text-white'
                : status === 'ahead'
                  ? 'text-slate-400'
                  : 'text-slate-900'}"
            >
              {step.date}
            </span>
            <!-- `break-normal` because the page's prose wrapper breaks long
                 words, and a box this narrow would hyphenate a summary rather
                 than wrap it. -->
            <span
              class="mt-0.5 block text-xs leading-snug break-normal {status === 'current'
                ? 'text-sky-50'
                : status === 'ahead'
                  ? 'text-slate-400'
                  : 'text-slate-600'}"
            >
              {step.summary}
            </span>

            <!-- The book's own sentence, and where the budget has got to: both
                 are in the box for a reader who cannot hover it or see which
                 side of the mark it is on. -->
            <span class="sr-only">
              {step.step}
              {status === "done" ? "Done." : status === "current" ? "Happening now." : "Ahead."}
            </span>
          </li>
        {/each}
      </ol>

      <!--
        The hovered box's own sentence, in the book's words. Hidden from
        assistive technology because the box already carries it.
      -->
      {#if shown}
        <div
          class="budget-detail absolute bottom-4 w-80 -translate-x-1/2 rounded-md bg-white px-3 py-2 text-xs leading-snug text-slate-700 shadow-md ring-1 ring-slate-200"
          style="left: {detailAt}%"
          aria-hidden="true"
        >
          <span class="font-medium text-slate-900">{shown.date}</span>
          {shown.step}
        </div>
      {/if}

      <!-- Today. Drawn over the boxes, because it is the one thing on this
           drawing that is not the book. -->
      <div class="budget-today absolute top-0 bottom-20" style="left: {now}%">
        <!-- Dashed and pale: it runs the height of the boxes, so where an entry
             is happening it crosses that entry's own box, and a solid rule
             through it is harder to read than a dashed one behind. -->
        <span
          class="absolute inset-y-0 left-0 -translate-x-1/2 border-l border-dashed border-slate-400"
        ></span>
        <span
          class="absolute top-0 left-0 rounded-full bg-slate-900 px-2 py-0.5 text-[11px] whitespace-nowrap text-white"
          style="transform: translateX({labelShift})"
        >
          Today, {longDate(today)}
        </span>
      </div>
    </div>
  </div>
</div>
