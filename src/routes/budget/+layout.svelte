<script lang="ts">
  import { page } from "$app/state"
  import { Router } from "$lib/router"

  let { data, children } = $props()

  const book = $derived(data.book)

  // A section page names itself and says where in the book it came from, set
  // by its own `+page.ts`. Absent on the book's own table of contents.
  const section = $derived(page.data.section)
</script>

<svelte:head>
  <title>
    {section ? section.title : `FY${book.year} Mayor's Budget`} - City of Haverhill
  </title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
  <!--
    Up on the left, sideways on the right. The book page is where `/` now lands
    everyone, so the calendar has to be reachable from it or half the site is
    only findable by typing the URL. It rides along on the section pages too
    rather than being conditional: one rule is easier to keep than two, and a
    reader deep in a section is no less entitled to the other half.
  -->
  <nav class="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
    {#if data.isSection}
      <a
        class="text-sm text-slate-600 underline hover:text-slate-900"
        href={Router.budgetBook(book.id)}
      >
        &larr; FY{book.year} Mayor's Budget
      </a>
    {:else}
      <a class="text-sm text-slate-600 underline hover:text-slate-900" href={Router.budget()}>
        &larr; Back to budget and audit reports
      </a>
    {/if}

    <a class="text-sm text-slate-500 underline hover:text-slate-900" href={Router.calendar()}>
      Meeting calendar
    </a>
  </nav>

  <header class="mb-6 border-b border-slate-200 pb-6">
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">
      {section ? section.title : `FY${book.year} Mayor's Budget`}
    </h1>
    <p class="mt-2 text-sm text-slate-600">
      Budget Plan July 1, {book.year - 1} to June 30, {book.year}
    </p>

    <!-- The book itself, which is the record. A section knows where it sits in
	       it, so its link opens the reader at that page rather than at the front
	       of a PDF running to hundreds. -->
    {#if book.budget}
      <p class="mt-4 text-sm">
        <a
          class="text-slate-600 underline hover:text-slate-900"
          href={section ? Router.pdfPage(book.budget, section.page) : book.budget}
          target="_blank"
          rel="external noopener noreferrer"
        >
          {#if section}
            This section in the city's budget book, page {section.page}
          {:else}
            The city's budget book
          {/if}<span class="sr-only">, PDF, opens in a new tab</span>
        </a>
      </p>
    {/if}
  </header>

  <!-- The transcription is the child route: an ordinary Svelte component,
	     checked and formatted like the rest of the source. Same arrangement as a
	     meeting write-up; see docs/document-pages.md. -->
  <article
    class="budget-prose prose max-w-none break-words prose-slate prose-headings:font-semibold prose-h2:mt-6 prose-h2:mb-2 prose-h2:text-base"
  >
    {@render children()}
  </article>

  <footer class="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <p>
      Transcribed by hand from the city's budget book, which is published as page images with no
      text layer. The city's own file, linked above, is the record.
    </p>
  </footer>
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
