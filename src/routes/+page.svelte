<script lang="ts">
  // The front page. It names the site and points at its two halves -- the
  // meeting calendar and the budget -- which have nothing to do with each other
  // beyond both being the City of Haverhill publishing about itself.
  //
  // `/` forwarded straight to the budget book for a while, on the reasoning that
  // an index costs every visitor a hop. That held while the budget was the
  // whole point and the calendar a side door; it stopped holding once the two
  // grew into separate things a reader arrives wanting one or the other of. A
  // reader who lands here now gets to choose rather than being dropped into
  // half they may not have come for.
  import { Router } from "$lib/router"
  import { bookName } from "$lib/heading"

  let { data } = $props()

  // The budget half opens on whichever book is written up here. With none, the
  // menu in the header is the only way in and there is no page to link.
  const book = $derived(data.budgetBook)
</script>

<svelte:head>
  <title>Meetinghouse</title>
  <meta
    name="description"
    content="The City of Haverhill's meeting documents and budget, rearranged so a reader can follow what the city is doing."
  />
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-12 sm:py-16">
  <h1 class="text-3xl font-bold tracking-tight text-slate-900">Meetinghouse</h1>
  <p class="mt-3 text-slate-600">
    What the City of Haverhill, Massachusetts publishes about its own government, rearranged so a
    reader can follow it. The words are the city's; the arrangement is editorial.
  </p>

  <nav class="mt-10 flex flex-col gap-4" aria-label="The two halves">
    <a
      href={Router.calendar()}
      class="block rounded-lg border border-slate-200 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50"
    >
      <h2 class="text-lg font-semibold text-slate-900">Meeting calendar</h2>
      <p class="mt-1 text-sm text-slate-600">
        Every agenda and set of minutes the city posts, on a month calendar. One entry per meeting,
        opening to a transcription here or the city's own PDF.
      </p>
    </a>

    {#if book}
      <a
        href={Router.budgetBook(book.id)}
        class="block rounded-lg border border-slate-200 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        <h2 class="text-lg font-semibold text-slate-900">{bookName(book.year)}</h2>
        <p class="mt-1 text-sm text-slate-600">
          The city's budget book, read a section at a time instead of as one PDF of several hundred
          pages, and reached from charts rather than a table of contents.
        </p>
      </a>
    {/if}
  </nav>
</div>
