<script lang="ts">
  import { page } from "$app/state"
  import { Router } from "$lib/router"
  import { bookName, headingOf } from "$lib/heading"

  let { data, children } = $props()

  const book = $derived(data.book)

  // A section is prose and keeps a reading column; the book's own front page is
  // not. That page is two pies and sixty-odd contents lines, all of which run
  // in columns beside each other, and squeezing them into a 48rem strip left
  // most of the screen as margin.
  //
  // The book page also ends in a footer fixed to the bottom of the window --
  // the budget calendar -- which is out of the flow and so cannot push anything
  // out from under itself. The padding is what keeps the last line of the page
  // clear of it, and is a little more than the tallest the footer gets.
  const column = $derived(data.isSection ? "max-w-3xl" : "max-w-none pb-40")
</script>

<svelte:head>
  <!-- The same name the bar at the top shows, from the same place. -->
  <title>{headingOf(page.data)} - City of Haverhill</title>
</svelte:head>

<div class="mx-auto px-4 py-8 {column}">
  <!-- Up only. The calendar used to hang off the right of this row, because
       the book page is where `/` lands everyone and the other half of the site
       had to be reachable from it; the header does that now, on every page. -->
  <nav class="mb-6">
    {#if data.isSection}
      <a
        class="text-sm text-slate-600 underline hover:text-slate-900"
        href={Router.budgetBook(book.id)}
      >
        &larr; {bookName(book.year)}
      </a>
    {:else}
      <a class="text-sm text-slate-600 underline hover:text-slate-900" href={Router.budget()}>
        &larr; Back to budget and audit reports
      </a>
    {/if}
  </nav>

  <!-- No header here at all. The bar at the top of the window names the page,
       says what the book covers and links the city's own file, so anything here
       would say it a second time in the space the page wants. -->

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
