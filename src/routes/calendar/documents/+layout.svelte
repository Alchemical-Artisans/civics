<script lang="ts">
  import { page } from "$app/state"
  import Note from "$lib/Note.svelte"
  import { Router } from "$lib/router"
  import { formatLongDate } from "$lib/calendar"

  let { data, children } = $props()

  // When and where, set by the page underneath from what its document actually
  // printed. Absent on a document that states none of it.
  const meeting = $derived(page.data.meeting)

  const when = $derived(
    data.date && meeting?.time
      ? `${formatLongDate(data.date)} at ${meeting.time}`
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
  <title>{data.title} - Haverhill Meeting Calendar</title>
  <meta
    name="description"
    content="{data.board} {data.kind}{data.date
      ? ` for ${formatLongDate(data.date)}`
      : ''}, from the City of Haverhill."
  />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
  <nav class="mb-6">
    <a class="text-sm text-slate-600 underline hover:text-slate-900" href={Router.calendar()}>
      &larr; Back to the calendar
    </a>
  </nav>

  <header class="mb-6 border-b border-slate-200 pb-6">
    <!-- `relative` so the notice popover has something to position against,
	     and so it takes the width of the content column rather than the width
	     of the icon it hangs off. -->
    <div class="relative flex flex-wrap items-center gap-x-2">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">{data.title}</h1>
      {#if meeting?.notice?.length}
        <Note label="How this meeting is held, and how it is recorded">
          {#each meeting.notice as paragraph (paragraph)}
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
    {#if meeting?.location || meeting?.remote}
      <p class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
        {#if meeting.location}
          <a
            class="underline hover:text-slate-900"
            href={Router.map(meeting.location.mapQuery)}
            target="_blank"
            rel="external noopener noreferrer"
          >
            {meeting.location.name}<span class="sr-only">, opens a map in a new tab</span>
          </a>
        {/if}
        {#if meeting.remote}
          <a
            class="underline hover:text-slate-900"
            href={meeting.remote}
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
		     published should not have to hunt for it. -->
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
  </header>

  <!-- The write-up is the child route: an ordinary Svelte component, checked
	     and formatted like the rest of the source, rather than a string of
	     markup dropped in with {@html}. See docs/document-pages.md. -->
  <article class="prose max-w-none break-words prose-slate prose-headings:font-semibold">
    {@render children()}
  </article>

  <footer class="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <p>
      Written up by hand from the city's document. It may summarise, condense or omit &mdash; the
      original linked above is the record.
    </p>
  </footer>
</div>
