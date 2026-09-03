<script lang="ts">
  import { page } from "$app/state"
  import { headingOf } from "$lib/heading"

  let { data, children } = $props()

  // A section is prose and keeps a reading column; the book's own front page is
  // not. That page is two pies and sixty-odd contents lines, all of which run
  // in columns beside each other, and squeezing them into a 48rem strip left
  // most of the screen as margin.
  //
  // Every page of a book ends in a footer fixed to the bottom of the window --
  // the budget calendar -- which is out of the flow and so cannot push anything
  // out from under itself. The padding is what keeps the last line of the page
  // clear of it: 7rem against a footer that is 84px at its shortest and 101 at
  // its tallest, which is clearance rather than a margin. It was 8rem, and that
  // extra half-inch read as a gap between the chart's figures and the calendar.
  // Both kinds of page carry it, now that both carry the calendar.
  // A section can ask for the book page's treatment instead, by returning
  // `wide` from its own load: `reserves` is two charts and a column of prose
  // laid out as one screen, and a 48rem strip has nowhere to put the charts.
  // It keeps a reading measure on the prose itself rather than on the page.
  const wide = $derived(!data.isSection || page.data.wide === true)
  const column = $derived(wide ? "max-w-none pb-28" : "max-w-3xl pb-28")
</script>

<svelte:head>
  <!-- The same name the bar at the top shows, from the same place. -->
  <title>{headingOf(page.data)} - City of Haverhill</title>
</svelte:head>

<div class="mx-auto px-4 pt-4 pb-8 {column}">
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
  <article
    class="budget-prose prose max-w-none break-words prose-slate prose-headings:font-semibold prose-h2:mt-6 prose-h2:mb-2 prose-h2:text-base"
  >
    {@render children()}
  </article>
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
