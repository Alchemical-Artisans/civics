<script lang="ts">
  import {
    WEEKDAYS,
    addMonths,
    boardsOf,
    buildMonthGrid,
    formatLongDate,
    formatMonth,
    groupByDate,
    monthsCovered,
    type Meeting,
  } from "$lib/calendar"
  import { Router } from "$lib/router"
  import { onMount } from "svelte"
  import { SvelteSet } from "svelte/reactivity"

  let { data } = $props()

  const meetings = $derived(data.meetings as Meeting[])
  const months = $derived(monthsCovered(meetings))
  const boards = $derived(boardsOf(meetings))

  // Until the reader picks a month, show the most recent one that actually has
  // meetings. Deliberately not "today" -- that would differ between the
  // prerender and the browser and cause a hydration mismatch.
  let chosen = $state<string | null>(null)
  const month = $derived(chosen ?? months.at(-1) ?? "2026-01")

  const activeBoards = new SvelteSet<string>()
  let showAgendas = $state(true)
  let showMinutes = $state(true)

  // `today` stays empty during prerender and fills in after mount, so the
  // highlight never causes a hydration mismatch.
  let today = $state("")
  onMount(() => {
    today = new Date().toISOString().slice(0, 10)
  })

  const visible = $derived(
    meetings.filter((m) => {
      if (activeBoards.size && !activeBoards.has(m.board)) return false
      if (m.kind === "agenda") return showAgendas
      if (m.kind === "minutes") return showMinutes
      return showAgendas || showMinutes
    }),
  )

  const byDate = $derived(groupByDate(visible))
  const weeks = $derived(buildMonthGrid(month, today))
  const monthDays = $derived(
    weeks
      .flat()
      .filter((c) => c.inMonth && byDate.has(c.date))
      .map((c) => ({ ...c, items: byDate.get(c.date)! })),
  )
  const monthCount = $derived(monthDays.reduce((n, d) => n + d.items.length, 0))

  const index = $derived(months.indexOf(month))
  const canPrev = $derived(index > 0)
  const canNext = $derived(index >= 0 && index < months.length - 1)

  function step(delta: number) {
    const next = addMonths(month, delta)
    if (months.includes(next)) chosen = next
  }

  function toggleBoard(board: string) {
    if (activeBoards.has(board)) activeBoards.delete(board)
    else activeBoards.add(board)
  }

  const kindClass = (kind: Meeting["kind"]) =>
    kind === "agenda"
      ? "bg-sky-100 text-sky-900 hover:bg-sky-200"
      : kind === "minutes"
        ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
</script>

<svelte:head>
  <title>Haverhill Meeting Calendar</title>
  <meta
    name="description"
    content="Calendar of Haverhill, MA public meeting agendas and minutes, linked to the source documents."
  />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
  <header class="mb-6">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Haverhill Meeting Calendar</h1>
    <p class="mt-2 text-slate-600">
      Agendas and minutes from
      <a class="underline hover:text-slate-900" rel="external" href={data.source}>
        the City of Haverhill
      </a>. Every entry opens as a readable page, with a link to the original.
    </p>
  </header>

  <!-- Filters -->
  <section aria-label="Filters" class="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
    <div class="mb-3 flex flex-wrap items-center gap-4">
      <span class="text-sm font-semibold text-slate-700">Show</span>
      <label class="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" bind:checked={showAgendas} class="rounded border-slate-300" />
        <span class="inline-flex items-center gap-1">
          <span class="h-2.5 w-2.5 rounded-full bg-sky-500" aria-hidden="true"></span> Agendas
        </span>
      </label>
      <label class="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" bind:checked={showMinutes} class="rounded border-slate-300" />
        <span class="inline-flex items-center gap-1">
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true"></span> Minutes
        </span>
      </label>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <span class="mr-1 text-sm font-semibold text-slate-700">Boards</span>
      <button
        type="button"
        onclick={() => activeBoards.clear()}
        class="rounded-full px-3 py-1 text-sm font-medium transition {activeBoards.size === 0
          ? 'bg-slate-900 text-white'
          : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'}"
      >
        All
      </button>
      {#each boards as board (board)}
        <button
          type="button"
          aria-pressed={activeBoards.has(board)}
          onclick={() => toggleBoard(board)}
          class="rounded-full px-3 py-1 text-sm font-medium transition {activeBoards.has(board)
            ? 'bg-slate-900 text-white'
            : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'}"
        >
          {board}
        </button>
      {/each}
    </div>
  </section>

  <!-- Month navigation -->
  <div class="mb-4 flex items-center justify-between gap-4">
    <button
      type="button"
      onclick={() => step(-1)}
      disabled={!canPrev}
      class="rounded-md px-3 py-2 text-sm font-medium ring-1 ring-slate-300 transition enabled:hover:bg-slate-100 disabled:opacity-40"
    >
      &larr; <span class="sr-only">Previous month</span>
      <span aria-hidden="true">Prev</span>
    </button>

    <div class="text-center">
      <h2 class="text-xl font-semibold text-slate-900">{formatMonth(month)}</h2>
      <p class="text-sm text-slate-500">
        {monthCount}
        {monthCount === 1 ? "document" : "documents"}
      </p>
    </div>

    <button
      type="button"
      onclick={() => step(1)}
      disabled={!canNext}
      class="rounded-md px-3 py-2 text-sm font-medium ring-1 ring-slate-300 transition enabled:hover:bg-slate-100 disabled:opacity-40"
    >
      <span aria-hidden="true">Next</span>
      <span class="sr-only">Next month</span> &rarr;
    </button>
  </div>

  <!-- Calendar grid (wide screens) -->
  <table class="hidden w-full table-fixed border-collapse md:table">
    <caption class="sr-only">Meetings in {formatMonth(month)}</caption>
    <thead>
      <tr>
        {#each WEEKDAYS as day (day)}
          <th
            scope="col"
            class="border border-slate-200 bg-slate-100 p-2 text-xs font-semibold tracking-wide text-slate-600 uppercase"
          >
            {day}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each weeks as week, w (w)}
        <tr>
          {#each week as cell (cell.date)}
            <td
              class="h-28 border border-slate-200 p-1 align-top {cell.inMonth
                ? 'bg-white'
                : 'bg-slate-50'} {cell.isToday ? 'ring-2 ring-amber-400 ring-inset' : ''}"
            >
              <div
                class="mb-1 text-right text-xs font-medium {cell.inMonth
                  ? 'text-slate-700'
                  : 'text-slate-400'}"
              >
                {cell.day}
              </div>
              {#if cell.inMonth}
                <ul class="space-y-0.5">
                  {#each byDate.get(cell.date) ?? [] as m (m.pageUrl + m.fileUrl)}
                    <li>
                      <a
                        href={m.docId ? Router.document(m.docId) : Router.cityPage(m.pageUrl)}
                        title="{m.title} ({m.kind})"
                        class="block truncate rounded px-1 py-0.5 text-[11px] leading-tight transition {kindClass(
                          m.kind,
                        )}"
                      >
                        {m.board}<span class="sr-only">, {m.kind}</span>
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- Agenda list (narrow screens, and a text alternative to the grid) -->
  <div class="md:hidden">
    {#if monthDays.length === 0}
      <p class="rounded-lg border border-slate-200 p-6 text-center text-slate-500">
        No documents in {formatMonth(month)} for the selected filters.
      </p>
    {:else}
      <ul class="space-y-4">
        {#each monthDays as day (day.date)}
          <li class="rounded-lg border border-slate-200">
            <h3
              class="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              {formatLongDate(day.date)}
            </h3>
            <ul class="divide-y divide-slate-100">
              {#each day.items as m (m.pageUrl + m.fileUrl)}
                <li class="px-3 py-2">
                  <a
                    href={m.docId ? Router.document(m.docId) : Router.cityPage(m.pageUrl)}
                    class="block hover:underline"
                  >
                    <span class="text-sm font-medium text-slate-900">{m.board}</span>
                    <span class="ml-2 rounded px-1.5 py-0.5 text-[11px] {kindClass(m.kind)}"
                      >{m.kind}</span
                    >
                    <span class="mt-0.5 block text-xs text-slate-500">{m.title}</span>
                  </a>
                </li>
              {/each}
            </ul>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  {#if monthDays.length === 0}
    <p
      class="mt-4 hidden rounded-lg border border-slate-200 p-6 text-center text-slate-500 md:block"
    >
      No documents in {formatMonth(month)} for the selected filters.
    </p>
  {/if}

  <footer class="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <p>
      {meetings.length} documents indexed, {months.length} months covered.
      {#if data.undated > 0}
        {data.undated} document{data.undated === 1 ? "" : "s"} had no resolvable date and {data.undated ===
        1
          ? "is"
          : "are"} not shown.
      {/if}
      {#if data.duplicates > 0}
        {data.duplicates} duplicate listing{data.duplicates === 1 ? "" : "s"} collapsed.
      {/if}
    </p>
    {#if data.flagged > 0}
      <p class="mt-1">
        {data.flagged} document{data.flagged === 1 ? "" : "s"} carry a meeting date that disagrees with
        the date in their own title or filename; those dates may be off. Check the linked document.
      </p>
    {/if}
    <p class="mt-1">Data scraped {new Date(data.generatedAt).toISOString().slice(0, 10)}.</p>
  </footer>
</div>
