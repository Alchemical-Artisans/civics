<script lang="ts">
  import { Router } from "$lib/router"
  import { formatLongDate } from "$lib/calendar"

  let { data } = $props()

  /**
   * Why a document has no readable text. Each says plainly that the limitation
   * is in the file the city published, so the page does not read as broken.
   */
  const EXPLANATION = {
    scanned:
      "The city published this document as a scan — page images with no text " +
      "layer — so there is nothing to convert. The original is below.",
    unsupported:
      "This document was published as a word-processor file rather than a PDF, " +
      "which this site does not convert. Use the link above to open it.",
    "too-large":
      "This document is too large to convert — these are usually scanned " +
      "agenda packets running to hundreds of pages. The original is below.",
    failed:
      "This document could not be converted. That is a fault on this site, not " +
      "with the city; the original is below and is unaffected.",
  } as const

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

    <!-- The source link sits at the top: this page is a convenience, and the
		     city's file is the record. It stays prominent because the conversion
		     is imperfect on tables and multi-column layouts. -->
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

  {#if data.html}
    <!-- Built ahead of time by scripts/lib/pdf-html.mjs, which assembles the
		     markup from a whitelist of tags rather than sanitising afterwards, and
		     escapes every character of text it takes from the PDF. Nothing here is
		     user input: it comes from a committed file built by the scrape. -->
    <article class="prose max-w-none break-words prose-slate prose-headings:font-semibold">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html data.html}
    </article>
  {:else}
    <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p>{EXPLANATION[data.status as keyof typeof EXPLANATION] ?? EXPLANATION.failed}</p>
    </div>

    {#if data.fileUrl}
      <object
        class="mt-4 h-[80vh] w-full rounded-lg border border-slate-200"
        data={data.fileUrl}
        type="application/pdf"
        title={data.title}
      >
        <p class="p-4 text-sm text-slate-600">
          Your browser cannot display PDFs inline.
          <a
            class="underline"
            href={data.fileUrl}
            target="_blank"
            rel="external noopener noreferrer"
          >
            Open the original document
          </a>.
        </p>
      </object>
    {/if}
  {/if}

  <footer class="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <p>
      Converted from the city's PDF for readability. Where the layout was complex the conversion may
      reorder or reflow content &mdash; the original above is the record.
    </p>
  </footer>
</div>
