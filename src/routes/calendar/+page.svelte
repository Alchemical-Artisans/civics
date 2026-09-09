<script lang="ts">
  import {
    WEEKDAYS,
    addMonths,
    boardsOf,
    buildMonthGrid,
    formatLongDate,
    formatMonth,
    groupByDate,
    easternDate,
    monthKey,
    monthsCovered,
    type Meeting,
    type MeetingKind,
  } from "$lib/calendar"
  import { Router } from "$lib/router"
  import { onMount } from "svelte"
  import { SvelteSet } from "svelte/reactivity"

  let { data } = $props()

  /**
   * A calendar entry is one meeting, and opens that meeting's page, which lists
   * the documents the city published for it. Before this, an entry was a single
   * document and linked straight to it; an agenda and its minutes then sat as
   * two unrelated chips on the same day.
   */
  const linkFor = (m: Meeting) => Router.meeting(m.id)

  /**
   * The two groups of source links, labelled for the reader.
   *
   * The labels are the only words here that are not the city's own page names:
   * the split is between what the city published *about* a sitting and what it
   * published saying the sitting would be held, and those are different kinds
   * of evidence -- see the meeting page, which shows them differently for the
   * same reason.
   */
  const sources = $derived([
    { label: "Documents", items: data.sources.documents },
    { label: "Meeting schedules", items: data.sources.schedules },
  ])

  const all = $derived(data.meetings as Meeting[])
  const months = $derived(monthsCovered(all))
  const boards = $derived(boardsOf(all))

  /**
   * Today in Haverhill -- the build's date in the served HTML, the reader's own
   * once the browser has it.
   *
   * Falls back to the load's date rather than to nothing, because the calendar
   * now opens on the current month and a reader running no script should still
   * get one. Both renders agree at hydration, since the client's first render
   * has `inTheBrowser` unset too; `onMount` then fills it in as an ordinary
   * reactive change rather than a mismatch. A build older than the month it ran
   * in therefore serves a stale month for one frame and corrects itself -- the
   * same bargain `BudgetTimeline` makes for its today mark.
   */
  let inTheBrowser = $state<string | null>(null)
  onMount(() => {
    inTheBrowser = easternDate()
  })
  const today = $derived(inTheBrowser ?? data.today)

  /**
   * Until the reader picks a month, show the one we are in.
   *
   * Clamped into the months the calendar actually covers, so `step()` and the
   * Prev/Next buttons -- which work off `months.indexOf(month)` -- always have
   * a real index to move from. In practice the current month is always covered:
   * the Council's rule projects sittings to the end of the year.
   */
  let chosen = $state<string | null>(null)
  const month = $derived(chosen ?? clamp(monthKey(today)))

  function clamp(key: string): string {
    if (!months.length) return key
    if (key < months[0]) return months[0]
    if (key > months.at(-1)!) return months.at(-1)!
    return key
  }

  const activeBoards = new SvelteSet<string>()
  let showAgendas = $state(true)
  let showMinutes = $state(true)
  // Expected sittings are a third thing on the grid rather than a third kind of
  // document, so they get their own toggle rather than joining `wanted` below:
  // a sitting the city has published nothing for has no document kind to filter
  // on.
  let showExpected = $state(true)

  /**
   * The kind toggles still hide documents, not meetings, so a meeting with an
   * agenda and minutes stays on the calendar when only one kind is showing --
   * with the hidden one dropped from its chip. A meeting left with nothing
   * visible disappears entirely.
   */
  const wanted = (kind: MeetingKind) =>
    kind === "agenda" ? showAgendas : kind === "minutes" ? showMinutes : showAgendas || showMinutes

  const meetings = $derived(
    all
      .filter((m) => !activeBoards.size || activeBoards.has(m.board))
      .map((m) => ({ ...m, documents: m.documents.filter((d) => wanted(d.kind)) }))
      // An expected sitting has no documents at all, so the kind toggles have
      // nothing to say about it and its own toggle decides on its own.
      .filter((m) => (m.scheduled ? showExpected : m.documents.length > 0)),
  )

  const byDate = $derived(groupByDate(meetings))
  const weeks = $derived(buildMonthGrid(month, today))
  const monthDays = $derived(
    weeks
      .flat()
      .filter((c) => c.inMonth && byDate.has(c.date))
      .map((c) => ({ ...c, items: byDate.get(c.date)! })),
  )
  const monthCount = $derived(monthDays.reduce((n, d) => n + d.items.length, 0))
  const monthDocuments = $derived(
    monthDays.reduce((n, d) => n + d.items.reduce((k, m) => k + m.documents.length, 0), 0),
  )

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

  const kindClass = (kind: MeetingKind) =>
    kind === "agenda"
      ? "bg-sky-100 text-sky-900 hover:bg-sky-200"
      : kind === "minutes"
        ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
        : "bg-slate-100 text-slate-900 hover:bg-slate-200"

  /**
   * An expected sitting is drawn as an outline rather than a filled chip: the
   * city has published nothing for it, and an entry that looks exactly like one
   * carrying an agenda would claim more than the rule says. Dashed, because the
   * same shape with a solid edge reads as a different colour of the same thing
   * rather than as an absence.
   */
  const entryClass = (m: Meeting) =>
    m.scheduled
      ? "border border-dashed border-slate-400 text-slate-600 hover:bg-slate-100"
      : "bg-slate-100 text-slate-900 hover:bg-slate-200"

  const entryTitle = (m: Meeting) =>
    m.scheduled
      ? `${m.board} — expected; no agenda published yet`
      : `${m.board} — ${m.documents.length} document${m.documents.length === 1 ? "" : "s"}`
</script>

<svelte:head>
  <title>Haverhill Meeting Calendar</title>
  <meta
    name="description"
    content="Calendar of Haverhill, MA public meeting agendas and minutes, linked to the source documents."
  />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
  <!--
      Not shown, because everything it said is already on the screen. The bar
      above marks "Calendar" as the section the reader is in, the tab says
      "Haverhill Meeting Calendar", and under this is a month grid with the
      month's name over it -- a 3xl heading repeating all three was the largest
      thing on the page and the least informative. The heading itself stays for
      a reader moving by headings, and so the page has one.

      The sentence under it is gone outright. It explained that an entry is a
      meeting rather than a document, which the grid demonstrates in less time
      than it takes to read, and it named the city's listing as the source --
      true once, and not the whole truth for a while now. What replaces it is
      every page the calendar is actually read off.
    -->
  <h1 class="sr-only">Haverhill Meeting Calendar</h1>

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
      <label class="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" bind:checked={showExpected} class="rounded border-slate-300" />
        <span class="inline-flex items-center gap-1">
          <span
            class="h-2.5 w-2.5 rounded-full border border-dashed border-slate-500"
            aria-hidden="true"
          ></span> Expected
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
        {monthCount === 1 ? "meeting" : "meetings"},
        {monthDocuments}
        {monthDocuments === 1 ? "document" : "documents"}
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
                  {#each byDate.get(cell.date) ?? [] as m (m.id)}
                    <li>
                      <a
                        href={linkFor(m)}
                        title={entryTitle(m)}
                        class="flex items-center gap-1 rounded px-1 py-0.5 text-[11px] leading-tight transition {entryClass(
                          m,
                        )}"
                      >
                        <span class="min-w-0 flex-1 truncate">{m.board}</span>
                        <!-- One letter per document, coloured by kind: the
                             reader can see at a glance whether a meeting has
                             minutes yet without opening it. An expected sitting
                             has none, and its outline says so. -->
                        <span class="flex shrink-0 gap-0.5" aria-hidden="true">
                          {#each m.documents as doc, i (i)}
                            <span
                              class="rounded-sm px-1 text-[10px] font-semibold {kindClass(
                                doc.kind,
                              )}"
                            >
                              {doc.kind === "agenda" ? "A" : doc.kind === "minutes" ? "M" : "·"}
                            </span>
                          {/each}
                        </span>
                        {#if m.scheduled}
                          <span class="sr-only">, expected; no agenda published yet</span>
                        {:else}
                          <span class="sr-only">
                            , {m.documents.length} document{m.documents.length === 1
                              ? ""
                              : "s"}</span
                          >
                        {/if}
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
        No meetings in {formatMonth(month)} for the selected filters.
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
              {#each day.items as m (m.id)}
                <li class="px-3 py-2">
                  <a href={linkFor(m)} class="block hover:underline">
                    <span class="text-sm font-medium text-slate-900">{m.board}</span>
                    {#each m.documents as doc, i (i)}
                      <span class="ml-2 rounded px-1.5 py-0.5 text-[11px] {kindClass(doc.kind)}">
                        {doc.kind}
                      </span>
                    {/each}
                    {#if m.scheduled}
                      <span
                        class="ml-2 rounded border border-dashed border-slate-400 px-1.5 py-0.5 text-[11px] text-slate-600"
                      >
                        expected
                      </span>
                    {/if}
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
    <!--
      Where all of this comes from, in full.

      One link used to stand for the lot, to the listing the scrape started
      with. That listing reaches back only to 2025 -- two archives hold the
      ~1,620 documents before it -- the Planning Board and the Zoning Board of
      Appeals keep theirs on their own pages, and none of the four boards that
      publish a meeting schedule publishes it on any of those. A reader checking
      this calendar against what the city posted was being pointed at a fraction
      of it.

      Built from the data rather than written out here, so a scrape that starts
      reading a new page lists it without anyone remembering to: see `Sources`
      in `$lib/meetings`.

      The four paragraphs of counts that used to sit under this are gone --
      documents indexed, records with no date, duplicates collapsed, dates the
      scraper flagged, documents the city has taken down, sittings projected.
      They kept the site honest about data it knows to be imperfect and they
      are all still true; what they were not was anything a reader came for,
      and they made the foot of the page a wall of small type around the one
      thing here worth reading. `scripts/` still counts every one of them, and
      says so to whoever can act on them.
    -->
    <section aria-label="Sources" class="space-y-1 text-xs text-slate-500">
      {#each sources as group (group.label)}
        <p class="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span class="font-semibold text-slate-700">{group.label}</span>
          {#each group.items as item, at (item.url)}
            {#if at}<span class="text-slate-300" aria-hidden="true">&middot;</span>{/if}
            <a
              class="underline decoration-slate-300 hover:text-slate-900 hover:decoration-slate-900"
              href={item.url}
              target="_blank"
              rel="external noopener noreferrer"
            >
              {item.name}{#if item.pdf}<span class="ml-1 text-slate-400" aria-hidden="true"
                  >PDF</span
                ><span class="sr-only">, PDF</span>{/if}<span class="sr-only">
                , on the city's site, opens in a new tab</span
              >
            </a>
          {/each}
        </p>
      {/each}
    </section>

    <!--
      How old the page is, which is the one thing under the links worth
      saying: everything here is scraped ahead of time and committed, so a
      reader looking at a calendar of public meetings has every reason to ask
      when it was last brought up to date.

      The scraper's stamp is an instant, and the day it names is the day in
      Haverhill -- `easternDate` off that timestamp, not `toISOString`, which
      names tomorrow for any scrape run after eight in the evening here.
    -->
    <p class="m-0 mt-1 flex flex-wrap items-baseline gap-x-2">
      <span class="font-semibold text-slate-700">Last updated</span>
      <span>{easternDate(new Date(data.generatedAt))}</span>
    </p>
  </footer>
</div>
