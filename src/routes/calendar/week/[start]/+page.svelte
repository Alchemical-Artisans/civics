<script lang="ts">
  import {
    WEEKDAYS,
    easternDate,
    formatWeek,
    groupByDate,
    weekOf,
    type Meeting,
  } from "$lib/calendar"
  import CalendarViews from "$lib/CalendarViews.svelte"
  import MeetingChip from "$lib/MeetingChip.svelte"
  import { Router } from "$lib/router"
  import { onMount } from "svelte"

  let { data } = $props()

  // Today in Haverhill: the build's in the served HTML, the reader's after
  // mount -- the same bargain the month page makes.
  let inTheBrowser = $state<string | null>(null)
  onMount(() => {
    inTheBrowser = easternDate()
  })
  const today = $derived(inTheBrowser ?? data.today)

  const days = $derived(weekOf(data.start))
  const byDate = $derived(groupByDate(data.meetings as Meeting[]))
  const count = $derived((data.meetings as Meeting[]).length)

  // Other views open on today when this week holds it, else on the week's first day.
  const anchor = $derived(days.includes(today) ? today : data.start)
</script>

<svelte:head>
  <title>{formatWeek(data.start)} - Haverhill Meeting Calendar</title>
  <meta
    name="description"
    content="Haverhill, MA public meetings for the week of {formatWeek(
      data.start,
    )}, linked to the source documents."
  />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
  <h1 class="sr-only">Haverhill Meeting Calendar</h1>

  <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <CalendarViews months={data.months} view="week" date={anchor} />

    <div class="flex items-center gap-2">
      {#if data.prev}
        <a
          href={Router.calendarWeek(data.prev)}
          class="rounded-md px-3 py-2 text-sm font-medium ring-1 ring-slate-300 transition hover:bg-slate-100"
        >
          &larr; <span class="sr-only">Previous week</span><span aria-hidden="true">Prev</span>
        </a>
      {:else}
        <span
          aria-disabled="true"
          class="rounded-md px-3 py-2 text-sm font-medium text-slate-400 opacity-40 ring-1 ring-slate-300"
          >&larr; Prev</span
        >
      {/if}
      {#if data.next}
        <a
          href={Router.calendarWeek(data.next)}
          class="rounded-md px-3 py-2 text-sm font-medium ring-1 ring-slate-300 transition hover:bg-slate-100"
        >
          <span aria-hidden="true">Next</span><span class="sr-only">Next week</span> &rarr;
        </a>
      {:else}
        <span
          aria-disabled="true"
          class="rounded-md px-3 py-2 text-sm font-medium text-slate-400 opacity-40 ring-1 ring-slate-300"
          >Next &rarr;</span
        >
      {/if}
    </div>
  </div>

  <div class="mb-4 text-center">
    <h2 class="text-xl font-semibold text-slate-900">{formatWeek(data.start)}</h2>
    <p class="text-sm text-slate-500">{count} {count === 1 ? "meeting" : "meetings"}</p>
  </div>

  <!-- A day to a row, as on the front page's card, whose week this is. The day
       is a link to its own page. -->
  <ul class="flex flex-col gap-1.5">
    {#each days as date, at (date)}
      <li
        class="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 {date < today
          ? 'bg-slate-50'
          : 'bg-white'} {date === today ? 'ring-2 ring-amber-400 ring-inset' : ''}"
      >
        <a
          href={Router.calendarDay(date)}
          class="flex w-20 shrink-0 items-baseline gap-1.5 hover:underline"
        >
          <span class="text-[11px] tracking-wide text-slate-500 uppercase">{WEEKDAYS[at]}</span>
          <span class="text-base font-medium text-slate-800">{Number(date.slice(8))}</span>
          <span class="sr-only">, {date}</span>
        </a>
        <ul class="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {#each byDate.get(date) ?? [] as meeting (meeting.id)}
            <li class="min-w-0"><MeetingChip {meeting} /></li>
          {/each}
        </ul>
      </li>
    {/each}
  </ul>
</div>
