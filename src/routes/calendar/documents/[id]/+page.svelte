<script lang="ts">
  import { Router } from "$lib/router"
  import { formatLongDate } from "$lib/calendar"

  let { data } = $props()

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
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{data.title}</h1>

    <p class="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
      <span class="font-medium text-slate-800">{data.board}</span>
      <span class="rounded px-1.5 py-0.5 text-[11px] {kindClass(data.kind)}">{data.kind}</span>
      {#if data.date}
        <span>{formatLongDate(data.date)}</span>
      {/if}
    </p>

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

  <!-- Written by hand and committed as an HTML fragment. Nothing here comes
	     from a PDF, a scrape, or a reader, so `{@html}` is rendering this
	     project's own markup -- see docs/document-pages.md. -->
  <article class="prose max-w-none break-words prose-slate prose-headings:font-semibold">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.html}
  </article>

  <footer class="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <p>
      Written up by hand from the city's document. It may summarise, condense or omit &mdash; the
      original linked above is the record.
    </p>
  </footer>
</div>
