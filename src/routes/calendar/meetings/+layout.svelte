<script lang="ts">
  import { page } from "$app/state"
  import Note from "$lib/Note.svelte"
  import { Router } from "$lib/router"
  import { formatLongDate, type MeetingDocument } from "$lib/calendar"

  let { data, children } = $props()

  const meeting = $derived(data.meeting)

  // When and where, set by the write-up below from what its document actually
  // printed. Absent on a meeting nobody has written up, and on one whose
  // document states none of it.
  const details = $derived(page.data.details)

  // A page for a single agenda item titles itself after the item. The meeting
  // logistics stay on the meeting page: they describe the whole sitting, and
  // repeating them here would bury the one item the reader came for.
  const item = $derived(page.data.item)
  const heading = $derived(item?.title ?? meeting.board)

  const when = $derived(
    details?.time
      ? `${formatLongDate(meeting.date)} at ${details.time}`
      : formatLongDate(meeting.date),
  )

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
  <title>{heading} - Haverhill Meeting Calendar</title>
  <meta
    name="description"
    content="{meeting.board}, {formatLongDate(meeting.date)}: the documents the City of Haverhill
    published for the meeting."
  />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
  <nav class="mb-6">
    {#if data.isItem}
      <a
        class="text-sm text-slate-600 underline hover:text-slate-900"
        href={Router.meeting(meeting.id)}
      >
        &larr; {meeting.board}, {formatLongDate(meeting.date)}
      </a>
    {:else}
      <a class="text-sm text-slate-600 underline hover:text-slate-900" href={Router.calendar()}>
        &larr; Back to the calendar
      </a>
    {/if}
  </nav>

  <header class="mb-6 border-b border-slate-200 pb-6">
    <!-- `relative` so the notice popover has something to position against,
	     and so it takes the width of the content column rather than the width
	     of the icon it hangs off. -->
    <div class="relative flex flex-wrap items-center gap-x-2">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">{heading}</h1>
      {#if !data.isItem && details?.notice?.length}
        <Note label="How this meeting is held, and how it is recorded">
          {#each details.notice as paragraph (paragraph)}
            <p>{paragraph}</p>
          {/each}
        </Note>
      {/if}
    </div>

    <p class="mt-2 text-sm text-slate-600">{when}</p>

    <!-- How to attend, rather than how to read the document -- so it sits
	     above the source links, not among them. -->
    {#if !data.isItem && (details?.location || details?.remote)}
      <p class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
        {#if details.location}
          <a
            class="underline hover:text-slate-900"
            href={Router.map(details.location.mapQuery)}
            target="_blank"
            rel="external noopener noreferrer"
          >
            {details.location.name}<span class="sr-only">, opens a map in a new tab</span>
          </a>
        {/if}
        {#if details.remote}
          <a
            class="underline hover:text-slate-900"
            href={details.remote}
            target="_blank"
            rel="external noopener noreferrer"
          >
            Remote Access<span class="sr-only">, joins the meeting in a new tab</span>
          </a>
        {/if}
      </p>
    {/if}

    <!-- What the city actually published for this sitting, whether or not any
		     of it has been transcribed. This is the record, so it sits at the top
		     rather than being something to hunt for, and minutes appearing in a
		     later scrape show up here without anyone touching the page.

		     Only on the meeting itself. An item page is about one entry on the
		     agenda, and these point at whole documents, which reads as though they
		     are that item's source when they are not -- an item links to its own
		     excerpt in its own text instead. -->
    {#if !data.isItem}
      <ul class="mt-4 space-y-1 text-sm">
        {#each meeting.documents as doc (doc.pageUrl + doc.fileUrl)}
          <li class="flex flex-wrap items-center gap-2">
            <span class="rounded px-1.5 py-0.5 text-[11px] {kindClass(doc.kind)}">
              {kindLabel(doc.kind)}
            </span>
            <a
              class="text-slate-600 underline hover:text-slate-900"
              href={doc.fileUrl ?? Router.cityPage(doc.pageUrl)}
              target="_blank"
              rel="external noopener noreferrer"
            >
              {doc.title}<span class="sr-only">, opens the city's file in a new tab</span>
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </header>

  <!-- The write-up is the child route: an ordinary Svelte component, checked
	     and formatted like the rest of the source, rather than a string of
	     markup dropped in with {@html}. See docs/document-pages.md. -->
  <article
    class="prose max-w-none break-words prose-slate prose-headings:font-semibold prose-h2:mt-6 prose-h2:mb-2 prose-h2:text-base"
  >
    {@render children()}
  </article>

  <footer class="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <p>
      {#if meeting.written}
        Written up by hand from the city's documents. It may summarise, condense or omit &mdash; the
        city's own files, linked above, are the record.
      {:else}
        The city's own files, linked above, are the record.
      {/if}
    </p>
  </footer>
</div>
