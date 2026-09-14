<script lang="ts">
  import { onMount } from "svelte"
  import { page } from "$app/state"
  import { headingOf } from "$lib/heading"
  import SiteFooter from "$lib/SiteFooter.svelte"

  let { data, children } = $props()

  // A section is prose and keeps a reading column; the book's own front page is
  // not. That page is two pies and sixty-odd contents lines, all of which run
  // in columns beside each other, and squeezing them into a 48rem strip left
  // most of the screen as margin.
  //
  // Every page of a book ends in two footers fixed to the bottom of the window
  // -- the budget calendar, and the site's attribution line under it -- which
  // are out of the flow and so cannot push anything out from under themselves.
  // `pb-38` is the padding that keeps the last line of the page clear of both,
  // a fallback for a reader running no script; `clearance` below measures the
  // two footers themselves once mounted, since a hand-tuned constant is only
  // ever right for the one text size and zoom it was tuned against -- larger
  // text wraps a budget-calendar box onto an extra line and grows both footers
  // past a fixed guess.
  //
  // The attribution used to sit in that clearance instead, at the end of the
  // flow, which put it *above* the calendar: the one line of the site's own
  // words, wedged between the reading and the city's own process. It is the
  // bottom of the window it belongs at, under everything, which on this half
  // means fixed too -- rendered below the article here, the calendar half
  // still gets it from the root layout at the foot of an ordinary flow.
  //
  // Fixed here rather than beside the calendar in `fy2027/+layout.svelte`,
  // where it would sit visually: the calendar is one book's, and the
  // attribution is every page's. A book with no calendar drawn still carries
  // its line.
  //
  // A section can ask for the book page's treatment instead, by returning
  // `wide` from its own load: `reserves` is two charts and a column of prose
  // laid out as one screen, and a 48rem strip has nowhere to put the charts.
  // It keeps a reading measure on the prose itself rather than on the page.
  const wide = $derived(!data.isSection || page.data.wide === true)
  const column = $derived(wide ? "max-w-none pb-38" : "max-w-3xl pb-38")

  let clearance = $state<number | null>(null)

  onMount(() => {
    const footers = () => Array.from(document.querySelectorAll<HTMLElement>("[data-budget-footer]"))
    const measure = () => {
      clearance = footers().reduce((sum, el) => sum + el.offsetHeight, 0)
    }
    measure()
    const observer = new ResizeObserver(measure)
    footers().forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  })
</script>

<svelte:head>
  <!-- The same name the bar at the top shows, from the same place. -->
  <title>{headingOf(page.data)} - City of Haverhill</title>
</svelte:head>

<div
  class="mx-auto px-4 pt-4 pb-8 {column}"
  style={clearance !== null ? `padding-bottom: ${clearance}px` : undefined}
>
  <!-- Little padding at the top and more at the bottom, because there is
       nothing above the page any more: with the heading and the "back" line
       gone, an even `py-8` left the first pie hanging under a band of empty
       white that read as a mistake rather than as breathing room.

       Nothing above the page but the page. The bar at the top of the window
       names it, says what the book covers and links the city's own file, and
       its menu of years is the way to any other book -- shorter than the "back"
       line a book and a section each used to carry here, which is what that
       line was for. -->

  <!-- The transcription is the child route: an ordinary Svelte component,
	     checked and formatted like the rest of the source. Same arrangement as a
	     meeting write-up; see docs/document-pages.md. -->
  <!-- The heading scale is in layout.css, one rule for every `prose` container
       on the site; see there for why h2 and h3 are both shrunk. -->
  <article class="budget-prose prose max-w-none break-words prose-slate">
    {@render children()}
  </article>
</div>

<!-- The site's attribution line, at the bottom of the window with the budget
     calendar directly above it. `bottom-10` on that calendar is this element's
     own 40px, which is why `SiteFooter` fixes its height rather than letting
     its one line size it. Opaque, because the page scrolls underneath. -->
<div class="fixed inset-x-0 bottom-0 z-40 bg-white" data-budget-footer>
  <SiteFooter />
</div>

<style>
  /*
    A budget book is mostly tables, and the widest of them run to eleven
    columns of dollar figures -- far wider than the reading column, and wider
    than a phone whatever is done to them. Rather than let one force the whole
    page sideways, each table scrolls within itself.

    `display: block` is what makes a table scrollable at all: an element with
    `display: table` sizes to its content and ignores the overflow. The cost is
    that the table no longer stretches to fill the column, which is why the
    narrow ones sit left rather than justified -- a fair trade for the wide ones
    staying readable.

    `:global` because these tables are written in the child routes, so the
    compiler cannot see them from here.
  */
  .budget-prose :global(table) {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    font-size: 0.8125rem;
    white-space: nowrap;
  }

  /* Long row headings -- a capital request's name, a revenue line -- are the
     one thing worth letting wrap, or the scroll runs for a screen and a half
     before the first figure. */
  .budget-prose :global(th[scope="row"]) {
    white-space: normal;
    min-width: 12rem;
  }
</style>
