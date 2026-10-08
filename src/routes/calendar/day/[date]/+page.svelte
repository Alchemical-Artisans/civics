<script lang="ts">
  import { easternDate, formatLongDate, statedTime, type Meeting } from "$lib/calendar"
  import CalendarViews from "$lib/CalendarViews.svelte"
  import MeetingChip from "$lib/MeetingChip.svelte"
  import { Router } from "$lib/router"
  import { onMount } from "svelte"

  let { data } = $props()

  let inTheBrowser = $state<string | null>(null)
  onMount(() => {
    inTheBrowser = easternDate()
  })
  const today = $derived(inTheBrowser ?? data.today)

  const meetings = $derived(data.meetings as Meeting[])
</script>

<svelte:head>
  <title>{formatLongDate(data.start)} - Haverhill Meeting Calendar</title>
  <meta
    name="description"
    content="Haverhill, MA public meetings on {formatLongDate(
      data.start,
    )}, linked to the source documents."
  />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
  <h1 class="sr-only">Haverhill Meeting Calendar</h1>

  <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <CalendarViews months={data.months} view="day" date={data.start} />

    <div class="flex items-center gap-2">
      {#if data.prev}
        <a
          href={Router.calendarDay(data.prev)}
          class="rounded-md px-3 py-2 text-sm font-medium ring-1 ring-slate-300 transition hover:bg-slate-100"
        >
          &larr; <span class="sr-only">Previous day</span><span aria-hidden="true">Prev</span>
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
          href={Router.calendarDay(data.next)}
          class="rounded-md px-3 py-2 text-sm font-medium ring-1 ring-slate-300 transition hover:bg-slate-100"
        >
          <span aria-hidden="true">Next</span><span class="sr-only">Next day</span> &rarr;
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
    <h2 class="text-xl font-semibold text-slate-900">
      {formatLongDate(data.start)}{#if data.start === today}<span
          class="ml-2 rounded bg-amber-100 px-1.5 py-0.5 align-middle text-xs font-medium text-amber-900"
          >Today</span
        >{/if}
    </h2>
    <p class="text-sm text-slate-500">
      <a class="underline hover:text-slate-900" href={Router.calendarWeek(data.start)}
        >See the week</a
      >
    </p>
  </div>

  {#if meetings.length === 0}
    <p class="rounded-lg border border-slate-200 p-6 text-center text-slate-500">
      No meetings on this day.
    </p>
  {:else}
    <ul class="space-y-3">
      {#each meetings as meeting (meeting.id)}
        <li class="rounded-lg border border-slate-200 p-3">
          <MeetingChip {meeting} />
          {#if meeting.documents.length}
            <ul class="mt-2 space-y-1 pl-2 text-sm">
              {#each meeting.documents as doc, i (i)}
                <li class="flex items-baseline gap-2">
                  <span class="w-16 shrink-0 text-[11px] tracking-wide text-slate-500 uppercase"
                    >{doc.kind}</span
                  >
                  <span class="min-w-0 text-slate-700">{doc.title}</span>
                </li>
              {/each}
            </ul>
          {:else if meeting.scheduled}
            <p class="m-0 mt-2 pl-2 text-sm text-slate-500">
              Expected{statedTime(meeting) ? ` at ${statedTime(meeting)}` : ""}; no agenda published
              yet.
            </p>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
