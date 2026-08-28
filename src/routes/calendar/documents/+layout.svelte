<script lang="ts">
  import { page } from "$app/state"
  import Note from "$lib/Note.svelte"
  import { Router } from "$lib/router"
  import { formatLongDate } from "$lib/calendar"

  let { data, children } = $props()

  // When and where, set by the page underneath from what its document actually
  // printed. Absent on a document that states none of it.
  const details = $derived(page.data.details)

  // A page for a single agenda item titles itself after the item. The meeting
  // logistics stay on the document page: they describe the whole sitting, and
  // repeating them here would bury the one item the reader came for.
  const item = $derived(page.data.item)
  const heading = $derived(item?.title ?? data.title)

  const when = $derived(
    data.date && details?.time
      ? `${formatLongDate(data.date)} at ${details.time}`
      : data.date
        ? formatLongDate(data.date)
        : null,
  )

  const kindClass = (kind: string) =>
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
    content="{data.board} {data.kind}{data.date
      ? ` for ${formatLongDate(data.date)}`
      : ''}, from the City of Haverhill."
  />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
  <nav class="mb-6">
    {#if data.isItem}
      <a
        class="text-sm text-slate-600 underline hover:text-slate-900"
        href={Router.document(data.id)}
      >
        &larr; {data.title}
      </a>
    {:else if data.meetingId && data.date}
      <!-- Back to the sitting, not the calendar: an agenda and its minutes are
           two documents about one meeting, and the meeting page is where the
           reader came through. -->
      <a
        class="text-sm text-slate-600 underline hover:text-slate-900"
        href={Router.meeting(data.meetingId)}
      >
        &larr; {data.board}, {formatLongDate(data.date)}
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

    <p class="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
      <span class="font-medium text-slate-800">{data.board}</span>
      <span class="rounded px-1.5 py-0.5 text-[11px] {kindClass(data.kind)}">{data.kind}</span>
      {#if when}
        <span>{when}</span>
      {/if}
    </p>

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

    <!-- The source link sits at the top: this page is a written summary, and
		     the city's file is the record. Anyone checking what was actually
		     published should not have to hunt for it.

		     Only on the document itself. An item page is about one entry on the
		     agenda, and these point at the whole packet, which reads as though
		     they are that item's source when they are not -- an item links to
		     its own excerpt in its own text instead. -->
    {#if !data.isItem}
      <p class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <a
          class="text-slate-600 underline hover:text-slate-900"
          href={data.sourceUrl}
          target="_blank"
          rel="external noopener noreferrer"
        >
          Original Page<span class="sr-only">, opens in a new tab</span>
        </a>
        {#if data.fileUrl}
          <a
            class="font-medium text-sky-800 underline hover:text-sky-950"
            href={data.fileUrl}
            target="_blank"
            rel="external noopener noreferrer"
          >
            (PDF<span class="sr-only">, opens in a new tab</span>)
          </a>
        {/if}
      </p>
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
      Written up by hand from the city's document. It may summarise, condense or omit &mdash; the
      {#if data.isItem}city's own file, linked from the agenda above, is{:else}original linked above
        is{/if} the record.
    </p>
  </footer>
</div>
