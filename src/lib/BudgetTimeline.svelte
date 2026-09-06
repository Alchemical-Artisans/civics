<!--
  The budget calendar as a row of boxes, in the footer fixed to the bottom of a
  book's front page, with a mark showing where in that calendar today falls.

  The book draws this page as a timeline down a vertical axis, entries
  alternating either side of it. Turned on its side it is the same drawing and
  it fits where a budget book's front page has room for it -- across the foot,
  under two charts and a table of contents -- so the process the rest of the
  page is the outcome of is on the same screen as the outcome.

  A box per entry rather than a rule with points on it: a step of a process is a
  thing with a beginning and an end, twelve of them fill the width evenly, and a
  box is somewhere for words to live.

  Each box is an arrow rather than a rectangle -- a point nesting into the
  notch of the one after it, tessellated edge to edge with no gap between
  them, the way a process reads as a sequence of steps rather than a row of
  cards. The point and the notch are the same 10px depth wherever a box sits,
  so the two edges meet exactly regardless of how wide the boxes themselves
  are; the first box has no notch (nothing comes before it) and the last has
  no point (nothing after it to nest into). `clip-path` draws the shape and
  a negative `margin-left` pulls each box left by that same 10px so the
  notch lands on the point behind it; `z-index` climbs left to right so each
  box paints over the tip of the one before it, and what shows through its
  own notch is exactly that tip -- the two shapes share one diagonal edge
  rather than drawing two.

  The stage the budget has reached is the one box in another colour: a pale
  green, against the pale blue of the entries behind it and the white of the
  ones ahead. Pale because the box sits under two charts and a table of
  contents and is not what the page is about, so it wants the weight of a
  highlighter and not of a warning. A run of boxes in the same state
  tessellating into one unbroken shape is the correct reading of a run of
  steps not yet reached, or already behind, but it also read as one box:
  a reader could no longer tell where one ended and the next began. So each
  `<li>` is now two layers rather than one -- the list item itself is the
  seam colour, cut to the box's own full arrow, and the fill sits on a
  second, smaller arrow inset a couple of pixels inside it, `shape(i)`
  walked out again at the smaller size. What shows in the gap between the
  two is a thin line of the seam colour, following the point and the notch
  the same way it follows the flat top and bottom, since it is the same
  shape at both sizes -- a `box-shadow` ring or a plain border would not:
  the one is a rectangle around a shape `clip-path` has already cut into an
  arrow, and the other runs straight through the point and notch rather
  than following them. No state is left to colour alone either way, since
  each box says which of the three it is in its own screen-reader text.

  It is a footer, so it is built to be short: the boxes and the mark, and
  nothing else. There was a line above them naming the calendar and printing
  today's date, and it went -- the date is what the mark already says, and a
  strip of chrome is a poor trade for the bottom of every window.

  Each box holds a few words. The book's own sentence runs to twenty-odd, which
  is a paragraph in a box this wide, so it comes up as a tooltip over the box
  instead -- unshortened, and in the box for a screen reader either way. The
  summaries are ours; everything else here is the book's.

  The tooltip is drawn outside the scrolling strip and placed from the box's
  measured position, because the strip scrolls horizontally: `overflow-x: auto`
  clips what leaves the box vertically as well, so a tooltip drawn inside it
  above the row would be cut in half.

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
    /**
     * A document this step produced, linked from its box: the budget book came
     * out of the final review, and the Council's appropriation orders were on
     * an agenda inside the run of public hearings. `documents` on the component
     * is where the addresses come from.
     */
    document?: "book" | "order"
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
    /**
     * The city's own files, by the name a step calls for.
     *
     * The book was in the bar at the top of every page as "Original Source",
     * which is a true label and an unhelpful one on the page that *is* the
     * book. Here each file sits on the step of the process that produced it,
     * which is worth knowing about a document and is something no link in a
     * header can say.
     */
    documents = {},
  }: {
    steps: Step[]
    asOf: string
    documents?: Partial<Record<"book" | "order", string | null>>
  } = $props()

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

  /**
   * The entry the process has reached: the last one that has begun. While an
   * entry is happening that is the entry itself, and in the weeks between two
   * of them it is the one behind -- which is the stage the budget is at, and
   * stays at, until the next one begins. Before the first entry nothing has
   * been reached, so nothing is highlighted.
   */
  const reached = $derived.by(() => {
    let last = -1
    for (let i = 0; i < steps.length; i++) if (today >= steps[i].on) last = i
    return last
  })

  /** Where an entry stands against that: behind it, it, or ahead of it. */
  const standing = (i: number) => (i === reached ? "current" : i < reached ? "done" : "ahead")

  /** How deep the point and the notch cut, in pixels either side of a box --
      fixed rather than a share of the box's own width, so a point always
      meets the notch after it exactly regardless of how wide either box is. */
  const DEPTH = 10

  /**
   * The polygon a box is clipped to: a point on the right for every box but
   * the last, a matching notch on the left for every box but the first.
   * Walked clockwise from the top-left corner -- the point (or the plain
   * top-right and bottom-right corners, lacking one) reached before the
   * notch (or the plain top-left corner, lacking one) closes the shape.
   */
  const shape = (i: number) => {
    const point = i < steps.length - 1
    const notch = i > 0
    const points = [
      "0% 0%",
      ...(point
        ? [`calc(100% - ${DEPTH}px) 0%`, "100% 50%", `calc(100% - ${DEPTH}px) 100%`]
        : ["100% 0%", "100% 100%"]),
      "0% 100%",
      ...(notch ? [`${DEPTH}px 50%`] : []),
    ]
    return `polygon(${points.join(", ")})`
  }

  /**
   * The seam between two boxes: each box's own fill sits inset from its own
   * outline by this much, on a `<li>` whose own background is the seam
   * colour showing through the gap that leaves. Two same-coloured arrows in
   * a row were reading as one undivided shape -- correct tessellation, but a
   * reader could no longer tell one box from the next -- so this draws the
   * line tessellation itself does not.
   *
   * The inset shape reuses `shape(i)`, unwidened: it is walked out relative
   * to the smaller, inset box, and a 10px point or notch stays a 10px point
   * or notch on a box a few pixels narrower, close enough not to read as a
   * different depth.
   */
  const SEAM = 2

  /** True while an entry's own day, or its own run of days, is today. */
  const underWay = (step: Step) => today >= step.on && today <= ends(step)

  /**
   * Where the reader looks first, brought into view.
   *
   * The row is wider than a narrow window, and it scrolls from its start --
   * which on a phone is January, six boxes away from the stage the budget is
   * actually at. So the strip is scrolled to put that box in the middle,
   * whenever it is off screen. Only in the browser, and only after `today` has
   * been settled by `onMount`, which is what `reached` here waits for.
   */
  let strip = $state<HTMLElement | null>(null)
  $effect(() => {
    const box = reached < 0 ? null : strip?.querySelectorAll<HTMLElement>("li")[reached]
    if (!strip || !box) return

    const over = strip.scrollWidth - strip.clientWidth
    if (over <= 0) return

    const middle = box.offsetLeft + box.offsetWidth / 2 - strip.clientWidth / 2
    strip.scrollLeft = Math.min(Math.max(middle, 0), over)
  })

  /** The box under the pointer, or the one holding focus. */
  let active = $state<number | null>(null)
  const shown = $derived(active === null ? null : steps[active])

  /**
   * Where the tooltip points: the middle of that box, in pixels across this
   * component, measured when the box is entered rather than worked out from the
   * index. The row scrolls, so a box's place on screen is its place in the row
   * less however far the strip has been scrolled -- and measuring is both
   * shorter than that sum and right while it is being scrolled.
   *
   * Then pulled back from either edge, so a tooltip on January or on June is a
   * tooltip and not a horizontal scrollbar.
   */
  let root = $state<HTMLElement | null>(null)
  let spot = $state(0)

  const TOOLTIP = 256

  const show = (i: number, box: HTMLElement) => {
    active = i
    if (!root) return

    const edge = root.getBoundingClientRect()
    const middle = box.getBoundingClientRect()
    const half = Math.min(TOOLTIP, edge.width) / 2
    spot = Math.min(
      Math.max(middle.left + middle.width / 2 - edge.left, half),
      Math.max(edge.width - half, half),
    )
  }
</script>

<div class="budget-timeline not-prose relative isolate" bind:this={root}>
  <!--
    `isolate` because the boxes below now each carry their own `z-index`, one
    per box, to make the tessellation work -- a stacking context of its own
    keeps that comparison local to this component, rather than putting a
    twelve-box row into the same stack as the rest of the page (the header's
    own year menu, say) by numeric accident.

    The book's own sentence for the box under the pointer, over the page rather
    than in a lane of its own: a footer costs the window whatever it is tall,
    and this is wanted about a second in every hundred.

    Hidden from assistive technology, since the box carries the same sentence
    and announcing it twice is worse than once. `pointer-events-none` so it
    cannot come between the pointer and the box that summoned it.
  -->
  {#if shown}
    <p
      class="budget-detail pointer-events-none absolute bottom-full m-0 mb-2 w-64 max-w-[80vw] -translate-x-1/2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs leading-snug text-slate-700 shadow-lg"
      style="left: {spot}px; z-index: {steps.length + 1}"
      aria-hidden="true"
    >
      <span class="font-medium text-slate-900">{shown.date}</span>
      {shown.step}
    </p>
  {/if}

  <!--
    Twelve boxes need room a phone does not have, so the row keeps its width and
    scrolls inside itself, the way the wide tables in a budget section do. Only
    the row: the line above it is the width of the window and stays put, or
    scrolling to the far end of the calendar would carry off the sentence the
    reader is scrolling to read.
  -->
  <div class="overflow-x-auto" bind:this={strip}>
    <div class="min-w-[72rem]">
      <div class="relative pb-1">
        <!-- Named here rather than in a line above the boxes: the row is what
             the name belonged to, and this way it costs no height. -->
        <ol class="m-0 flex list-none p-0" aria-label="Budget calendar">
          {#each steps as step, i (step.date)}
            {@const status = standing(i)}
            <!-- The box is the list item itself: a `<div>` inside it taking the
               pointer would be a static element with a handler, and the entry is
               one thing either way. `z-index` climbs with `i` and `clip-path`
               is inline rather than a class -- both are per-box numbers, not
               a fixed set Tailwind has a utility for.

               The `<li>` itself is the seam colour, cut to the full arrow;
               the fill sits on a second, inset layer inside it, cut to the
               same arrow a few pixels smaller, so a ring of the seam colour
               shows all the way around every box, point and notch included. -->
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <li
              class="relative m-0 flex-1 bg-slate-300 outline-none"
              style="clip-path: {shape(i)}; z-index: {i}; margin-left: {i === 0
                ? '0'
                : `-${DEPTH}px`}"
              tabindex="0"
              onpointerenter={(event) => show(i, event.currentTarget)}
              onpointerleave={() => (active = null)}
              onfocus={(event) => show(i, event.currentTarget)}
              onblur={() => (active = null)}
            >
              <div
                class="px-3 py-1.5 text-center transition-[filter] {status === 'ahead'
                  ? 'bg-white'
                  : status === 'current'
                    ? 'bg-green-200'
                    : 'bg-sky-50'} {active === i ? 'drop-shadow-md' : ''}"
                style="clip-path: {shape(i)}; margin: {SEAM}px"
              >
                <span
                  class="block text-xs font-medium {status === 'ahead'
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
                    ? 'text-slate-800'
                    : status === 'ahead'
                      ? 'text-slate-400'
                      : 'text-slate-600'}"
                >
                  {step.summary}
                </span>

                {#if step.document && documents[step.document]}
                  <!-- The file this step produced. Named for what it is rather
                       than for what it contains: the box around it says which
                       step, which is the more useful half. -->
                  <a
                    class="mt-1 block text-[11px] text-slate-600 underline decoration-slate-400 hover:text-slate-900"
                    href={documents[step.document]}
                    target="_blank"
                    rel="external noopener noreferrer"
                  >
                    PDF<span class="sr-only">
                      {step.document === "book"
                        ? ", the budget book"
                        : ", the City Council agenda"}, opens the city's file in a new tab</span
                    >
                  </a>
                {/if}

                <!-- The book's own sentence, and where the budget has got to: both
                   are in the box for a reader who cannot hover it or see which
                   side of the mark it is on. -->
                <span class="sr-only">
                  {step.step}
                  {status === "ahead"
                    ? "Ahead."
                    : status === "done"
                      ? "Done."
                      : underWay(step)
                        ? "Happening now."
                        : "Done. This is where the budget is."}
                </span>
              </div>
            </li>
          {/each}
        </ol>

        <!-- Today, over the boxes. Dashed and pale: where an entry is happening it
           crosses that entry's own box, and a solid rule through it is harder to
           read than a dashed one behind. It is the only thing here that says
           what day it is, which is all the date was ever for.

           Its own `z-index` because the boxes now climb their own stack, one
           per box, to make the tessellation work -- `steps.length` is above
           the highest of those (0 through `steps.length - 1`) whatever that
           count is. -->
        <div
          class="budget-today absolute top-0 bottom-1 -translate-x-1/2 border-l border-dashed border-slate-400"
          style="left: {now}%; z-index: {steps.length}"
        ></div>
      </div>
    </div>
  </div>
</div>
