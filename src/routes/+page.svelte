<script lang="ts">
  import { Router } from "$lib/router"

  let { data } = $props()

  const cal = $derived(data.calendar)
  const budget = $derived(data.budget)

  // "FY2027", or "FY2026 and FY2027" if a second book is ever written up. Only
  // ever a handful, so a list rather than a count -- the reader wants to know
  // whether the year they care about is one of them.
  const books = $derived(
    budget.books.length < 2
      ? `FY${budget.books[0]}`
      : `${budget.books
          .slice(0, -1)
          .map((y) => `FY${y}`)
          .join(", ")} and FY${budget.books.at(-1)}`,
  )
</script>

<svelte:head>
  <title>Haverhill Public Documents</title>
  <meta
    name="description"
    content="An unofficial republication of the documents the City of Haverhill puts online: a
    calendar of meeting agendas and minutes, and its budget and audit reports."
  />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12">
  <header class="mb-10">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Haverhill Public Documents</h1>
    <p class="mt-3 text-slate-600">
      An unofficial republication of what the
      <a class="underline hover:text-slate-900" rel="external" href={Router.city()}>
        City of Haverhill
      </a>
      puts online, arranged so it can be browsed rather than searched. Every page here links to the city's
      own file, which is the record.
    </p>
  </header>

  <!--
    The two ways in. A list rather than a row of divs: it is two links and
    nothing else, and saying so lets a screen reader announce how many there
    are before reading either.
  -->
  <ul class="grid gap-4 sm:grid-cols-2">
    <li>
      <a
        class="block h-full rounded-lg border border-slate-200 p-5 transition hover:border-slate-400 hover:bg-slate-50"
        href={Router.calendar()}
      >
        <h2 class="text-lg font-semibold text-slate-900">Meeting Calendar</h2>
        <p class="mt-2 text-sm text-slate-600">
          Agendas and minutes from {cal.boards} boards on a month calendar, {cal.from} to {cal.to}.
        </p>
        <p class="mt-2 text-sm text-slate-500">
          {cal.meetings} meetings, {cal.documents} documents. {cal.written} meeting{cal.written ===
          1
            ? ""
            : "s"} written up here; the rest open the city's PDF.
        </p>
      </a>
    </li>

    <li>
      <a
        class="block h-full rounded-lg border border-slate-200 p-5 transition hover:border-slate-400 hover:bg-slate-50"
        href={Router.budget()}
      >
        <h2 class="text-lg font-semibold text-slate-900">Budget and Audit Reports</h2>
        <p class="mt-2 text-sm text-slate-600">
          Every Mayor's budget and audited financial statement the city publishes, FY{budget.oldest}
          to FY{budget.newest}.
        </p>
        <p class="mt-2 text-sm text-slate-500">
          {budget.years} fiscal years. {books} is readable a section at a time, rather than as one PDF
          running to hundreds of pages.
        </p>
      </a>
    </li>
  </ul>

  <footer class="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <p>
      Nothing here is scraped while you read it. The documents were fetched ahead of time and the
      pages built from them, so this site works whether or not the city's does &mdash; but its
      copies, not these, are the record.
    </p>
    <p class="mt-1">
      Meeting data scraped {new Date(cal.generatedAt).toISOString().slice(0, 10)}.
    </p>
  </footer>
</div>
