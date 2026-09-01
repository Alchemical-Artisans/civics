<!--
  The budget calendar as a timeline lying on its side, with a mark showing where
  in that calendar today falls.

  The book draws this page as a timeline down a vertical axis, entries
  alternating either side of it. Turned on its side it is the same drawing and
  it fits where a budget book's front page has room for it -- across the foot,
  under two charts and a table of contents -- so the process the rest of the
  page is the outcome of is on the same screen as the outcome.

  Entries are evenly spaced rather than placed by date. Two of them are a day
  apart (2/6 and 2/5) and the last is eight weeks after the one before it, so by
  date the middle of the calendar is an unreadable pile and the end is empty.
  Even spacing puts the reading first; the today mark is still placed by date,
  interpolated between the entries either side of it, so where the budget has
  got to is honest even where the spacing is not.

  Every entry's date and wording is the book's. Nothing here summarises them
  into a label -- a step of a public process is what it says it is.
-->
<script module lang="ts">
  export interface Step {
    /** The date, exactly as the book prints it: "4/9/26", "2/23-3/13". */
    date: string
    /** That date as `YYYY-MM-DD`, or the first day where the book gives a range. */
    on: string
    /** The last day, for the entries the book gives as a range. */
    through?: string
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

  /** Where an entry sits along the axis, as a percentage of it. */
  const at = (i: number) => ((i + 0.5) / steps.length) * 100

  /**
   * Where today sits: on an entry while it is happening, and between two of
   * them in proportion to the days either side otherwise. Before the first
   * entry the mark is at the start of the axis and after the last it is at the
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
</script>

<!--
  Twelve entries with their own wording under them need room a phone does not
  have, so the drawing keeps its width and scrolls inside itself, the way the
  wide tables in a budget section do.
-->
<div class="budget-timeline not-prose -mx-1 overflow-x-auto px-1 pt-2 pb-4">
  <div class="min-w-[76rem]">
    <!-- The margin is where the first and last labels hang: they are centred on
         their own entry, and the axis starts half a label in from the edge. The
         width above is what keeps two labels on the same side of the axis from
         touching -- twelve entries, alternating, so a label has two slots of the
         axis to itself.

         Two boxes, because the today mark needs a lane of its own: the top
         padding is where its label sits, and the entries are laid out in the box
         below it, so a label and the mark cannot land on each other. Both boxes
         are the same width, so a percentage means the same thing in either. -->
    <div class="relative mx-20 pt-8">
      <div class="relative h-64">
        <!-- The axis, and the part of it that has happened. Decorative: the
             entries say what they are, and the mark says the date. -->
        <div
          class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200"
          aria-hidden="true"
        >
          <div class="h-px bg-sky-700" style="width: {now}%"></div>
        </div>

        <ol class="m-0 list-none p-0">
          {#each steps as step, i (step.date)}
            {@const status = standing(step)}
            {@const above = i % 2 === 0}
            <li class="absolute inset-y-0" style="left: {at(i)}%">
              <!-- The stem from the axis to the label it belongs to. -->
              <span
                class="absolute left-0 h-6 w-px -translate-x-1/2 bg-slate-200 {above
                  ? 'bottom-1/2'
                  : 'top-1/2'}"
                aria-hidden="true"
              ></span>

              <span
                class="absolute top-1/2 left-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full {status ===
                'ahead'
                  ? 'bg-white ring-1 ring-slate-300'
                  : 'bg-sky-700'} {status === 'current' ? 'ring-4 ring-sky-200' : ''}"
                aria-hidden="true"
              ></span>

              <span
                class="absolute left-0 block w-40 -translate-x-1/2 text-center {above
                  ? 'bottom-1/2 mb-6'
                  : 'top-1/2 mt-6'}"
              >
                <span
                  class="block text-xs font-medium {status === 'ahead'
                    ? 'text-slate-400'
                    : 'text-slate-900'}"
                >
                  {step.date}
                </span>
                <span
                  class="mt-0.5 block text-xs leading-snug {status === 'ahead'
                    ? 'text-slate-400'
                    : 'text-slate-600'}"
                >
                  {step.step}
                </span>
                <!-- Where the budget has got to, for a reader who cannot see
                     which side of the mark this entry is on. -->
                <span class="sr-only">
                  {status === "done" ? "Done." : status === "current" ? "Happening now." : "Ahead."}
                </span>
              </span>
            </li>
          {/each}
        </ol>
      </div>

      <!-- Today. Drawn over the entries, because it is the one thing on this
           drawing that is not the book. -->
      <div class="budget-today absolute inset-y-0" style="left: {now}%">
        <!-- Dashed and pale: it runs the height of the drawing, so where an
             entry is happening it crosses that entry's own words, and a solid
             rule through them is harder to read than a dashed one behind. -->
        <span
          class="absolute inset-y-0 left-0 -translate-x-1/2 border-l border-dashed border-slate-400"
        ></span>
        <span
          class="absolute top-0 left-0 -translate-x-1/2 rounded-full bg-slate-900 px-2 py-0.5 text-[11px] whitespace-nowrap text-white"
        >
          Today, {longDate(today)}
        </span>
      </div>
    </div>
  </div>
</div>
