<script lang="ts">
  import { Router } from "$lib/router"

  let { data } = $props()

  const years = $derived(data.years)
  const written = $derived(years.filter((y) => y.written))
</script>

<svelte:head>
  <title>Haverhill Budget and Audit Reports</title>
  <meta
    name="description"
    content="The City of Haverhill's Mayor's budgets and audited financial statements, one row per
    fiscal year, with the current budget book readable a section at a time."
  />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
  <nav class="mb-6">
    <a class="text-sm text-slate-600 underline hover:text-slate-900" href={Router.home()}>
      &larr; Haverhill Public Documents
    </a>
  </nav>

  <header class="mb-6">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Budget and Audit Reports</h1>
    <p class="mt-2 text-slate-600">
      Every Mayor's budget and audited financial statement the
      <a class="underline hover:text-slate-900" rel="external" href={data.source}>
        City of Haverhill
      </a>
      publishes, back to FY2006. A fiscal year runs July 1 to June 30 and is named for the year it ends
      in, so FY{years[0].year} is the budget for July {years[0].year - 1} to June {years[0].year}.
    </p>
    {#if written.length}
      <p class="mt-2 text-slate-600">
        {#each written as book, i (book.id)}
          {i > 0 ? ", " : ""}<a
            class="font-medium underline hover:text-slate-900"
            href={Router.budgetBook(book.id)}>FY{book.year}</a
          >
        {/each}
        {written.length === 1 ? "is" : "are"} readable here a section at a time, rather than as one PDF
        running to hundreds of pages. Everything else opens the city's own file.
      </p>
    {/if}
  </header>

  <table class="w-full border-collapse text-left text-sm">
    <thead>
      <tr class="border-b border-slate-300 text-slate-700">
        <th scope="col" class="py-2 pr-4 font-semibold">Fiscal year</th>
        <th scope="col" class="py-2 pr-4 font-semibold">Mayor's Budget</th>
        <th scope="col" class="py-2 font-semibold">City Audit Report</th>
      </tr>
    </thead>
    <tbody>
      {#each years as year (year.id)}
        <tr class="border-b border-slate-100">
          <th scope="row" class="py-2 pr-4 font-medium whitespace-nowrap text-slate-900">
            FY{year.year}
          </th>
          <td class="py-2 pr-4">
            {#if year.written}
              <a class="font-medium text-slate-900 underline" href={Router.budgetBook(year.id)}>
                Read the budget book
              </a>
            {:else if year.budget}
              <a
                class="text-slate-600 underline hover:text-slate-900"
                href={year.budget}
                target="_blank"
                rel="external noopener noreferrer"
              >
                Budget<span class="sr-only">, PDF, opens the city's file in a new tab</span>
              </a>
            {:else}
              <!-- The city's page prints the year with nothing behind it. Saying
					     so beats an empty cell the reader has to interpret. -->
              <span class="text-slate-400">The city lists no file</span>
            {/if}
          </td>
          <td class="py-2">
            {#if year.audit}
              <a
                class="text-slate-600 underline hover:text-slate-900"
                href={year.audit}
                target="_blank"
                rel="external noopener noreferrer"
              >
                Audit Report<span class="sr-only">, PDF, opens the city's file in a new tab</span>
              </a>
            {:else}
              <span class="text-slate-400">Not yet audited</span>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <footer class="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <p>
      {years.length} fiscal years listed. The city's own files are the record; anything read here was
      transcribed by hand and may condense or omit.
    </p>
  </footer>
</div>
