<script lang="ts">
  import { formatLongDate, type MeetingDocument } from "$lib/calendar"
  import { Router } from "$lib/router"

  let { data } = $props()

  const meeting = $derived(data.meeting)

  /**
   * Where a document goes: its write-up here when somebody has made one,
   * otherwise the city's own PDF, which is what the reader wanted anyway. The
   * one listing row with no file at all falls back to the city's media page.
   */
  const linkFor = (d: MeetingDocument) =>
    d.docId ? Router.document(d.docId) : (d.fileUrl ?? Router.cityPage(d.pageUrl))

  const leavesSite = (d: MeetingDocument) => !d.docId

  const kindLabel = (kind: MeetingDocument["kind"]) =>
    kind === "agenda" ? "Agenda" : kind === "minutes" ? "Minutes" : "Document"

  const kindClass = (kind: MeetingDocument["kind"]) =>
    kind === "agenda"
      ? "bg-sky-100 text-sky-900"
      : kind === "minutes"
        ? "bg-emerald-100 text-emerald-900"
        : "bg-slate-100 text-slate-900"
</script>

<svelte:head>
  <title>{meeting.board}, {formatLongDate(meeting.date)} - Haverhill Meeting Calendar</title>
  <meta
    name="description"
    content="Documents published by the City of Haverhill for the {meeting.board} meeting of {formatLongDate(
      meeting.date,
    )}."
  />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
  <nav class="mb-6">
    <a class="text-sm text-slate-600 underline hover:text-slate-900" href={Router.calendar()}>
      &larr; Back to the calendar
    </a>
  </nav>

  <header class="mb-6 border-b border-slate-200 pb-6">
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{meeting.board}</h1>
    <p class="mt-2 text-sm text-slate-600">{formatLongDate(meeting.date)}</p>
  </header>

  <ul class="space-y-3">
    {#each meeting.documents as doc (doc.pageUrl + doc.fileUrl)}
      <li class="rounded-lg border border-slate-200 p-4">
        <a
          class="font-medium text-sky-800 underline hover:text-sky-950"
          href={linkFor(doc)}
          target={leavesSite(doc) ? "_blank" : undefined}
          rel={leavesSite(doc) ? "external noopener noreferrer" : undefined}
        >
          {doc.title}<span class="sr-only">
            {leavesSite(doc) ? ", opens the city's document in a new tab" : ""}</span
          >
        </a>
        <p class="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span class="rounded px-1.5 py-0.5 {kindClass(doc.kind)}">{kindLabel(doc.kind)}</span>
          {#if doc.docId}
            <span>written up on this site</span>
          {:else}
            <span>the city's file</span>
          {/if}
        </p>
      </li>
    {/each}
  </ul>

  <footer class="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <p>
      An agenda and its minutes are published separately by the city. They are shown together here
      because they are two documents about one meeting, matched on the board and the date &mdash;
      which is all the city's listing gives to match them on.
    </p>
  </footer>
</div>
