<script lang="ts">
  import { page } from "$app/state"
  import Note from "$lib/Note.svelte"
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import { Router } from "$lib/router"
  import { formatLongDate, type MeetingDetails, type MeetingDocument } from "$lib/calendar"

  let { data, children } = $props()

  const meeting = $derived(data.meeting)

  // When and where, set by the write-up below from what its document actually
  // printed. Absent on a meeting nobody has written up, and on one whose
  // document states none of it.
  //
  // A sitting the Council's rule expects has no document to read any of this
  // from, but the rule states the hour it sits at -- which is what lets a
  // reader put a sitting on their own calendar before there is an agenda for
  // it. No room: the rule names none, and the last agenda's room is not
  // evidence about a Tuesday that has not happened. A write-up always wins,
  // having been read off the notice for that particular sitting.
  const expected = $derived(meeting.scheduled)
  const details = $derived<MeetingDetails | undefined>(
    page.data.details ?? (expected ? { time: expected.time } : undefined),
  )

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
    content="{meeting.board}, {formatLongDate(meeting.date)}: {expected
      ? `a sitting the board itself has said it will hold; no agenda published yet.`
      : `the documents the City of Haverhill published for the meeting.`}"
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

    <!-- The date, and beside it the way to put it on the reader's own
	     calendar -- an item page is one entry on the agenda, not the sitting a
	     calendar event stands for, so it carries the date without the button.
	     The two-hour length the event assumes when the agenda states a time is
	     explained in $lib/ics. -->
    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
      <p class="text-sm text-slate-600">{when}</p>
      {#if !data.isItem}
        <AddToCalendar {meeting} {details} />
      {/if}
    </div>

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
          <span class="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            <a
              class="underline hover:text-slate-900"
              href={details.remote.url}
              target="_blank"
              rel="external noopener noreferrer"
            >
              Remote Access<span class="sr-only">, joins the meeting in a new tab</span>
            </a>
            {#if details.remote.meetingId}
              <span class="text-slate-500">Meeting ID: {details.remote.meetingId}</span>
            {/if}
            {#if details.remote.passcode}
              <span class="text-slate-500">Passcode: {details.remote.passcode}</span>
            {/if}
          </span>
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
        <!-- What the city published saying this sitting would be held takes the
             place of the documents when there are none: it is the only thing
             bearing on the day at all, so it belongs in the row the agenda
             would occupy, linked to the page it is printed on. The city's own
             notice where it has posted one, named as the city titled it; else
             the board's own heading for its list of dates; else the rule,
             named for what it is. -->
        {#if expected}
          <li class="flex flex-wrap items-center gap-2">
            <span
              class="rounded border border-dashed border-slate-400 px-1.5 py-0.5 text-[11px] text-slate-600"
            >
              Expected
            </span>
            <a
              class="text-slate-600 underline hover:text-slate-900"
              href={expected.source.url}
              target="_blank"
              rel="external noopener noreferrer"
            >
              {expected.source.kind === "notice"
                ? expected.source.title
                : expected.source.kind === "calendar"
                  ? expected.source.heading
                  : `The ${meeting.board}'s meeting rule`}<span class="sr-only">
                , opens the city's page in a new tab</span
              >
            </a>
          </li>
        {/if}
      </ul>
    {/if}
  </header>

  <!-- The write-up is the child route: an ordinary Svelte component, checked
	     and formatted like the rest of the source, rather than a string of
	     markup dropped in with {@html}. See docs/document-pages.md. -->
  <!-- The heading scale is in layout.css, one rule for every `prose` container
       on the site; see there for why h2 and h3 are both shrunk. -->
  <article class="prose max-w-none break-words prose-slate">
    {@render children()}
  </article>

  <footer class="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <p>
      {#if meeting.written}
        Written up by hand from the city's documents. It may summarise, condense or omit &mdash; the
        city's own files, linked above, are the record.
      {:else if expected}
        Nothing has been published for this sitting. What the {meeting.board} itself published about the
        days it sits, linked above, is why it is on the calendar.
      {:else}
        The city's own files, linked above, are the record.
      {/if}
    </p>
  </footer>
</div>
