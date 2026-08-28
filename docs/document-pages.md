# Document pages

A meeting document gets a page on this site when somebody writes one. There is
no automated step: `src/lib/data/documents/<id>.html` is an HTML fragment
written by hand, and its existence is the only thing that decides whether the
calendar links to a page here or straight to the city's PDF.

## Why not convert the PDFs

This project used to run every document through poppler and publish the
extracted text. It was dropped:

- **Most of the corpus has no text to extract.** Roughly two-thirds of what the
  city publishes is scanned paper — nearly every City Council document,
  including agenda packets of 150+ pages. There is no text layer at all.
- **Where it worked, it lost the layout.** Tables and multi-column blocks
  reflowed into a single column. Reading order survived; alignment did not.
- **Every document got a page, and most of those pages had nothing on them.** A
  reader clicking through to be told "the city published this as a scan" would
  rather have been sent to the document.

A page written by a person, for a meeting that matters, is worth more than an
automated transcription of all of them. So the calendar is now honest about
which is which: a link either opens something written here, or it opens the
city's file.

## Writing a page

1. **Find the document's id.** It is in `meetings.json` as `docId`, and in the
   URL of any existing page. Ids are permanent — a readable slug with a hash of
   the file URL appended — so they can be settled before anything is written.
   See `documentId()` in [`scripts/lib/documents.mjs`](../scripts/lib/documents.mjs).

2. **Create `src/lib/data/documents/<id>.html`.** A fragment, not a whole
   document: no `<html>`, `<head>` or `<body>`. It is rendered inside
   `<article class="prose">`, so plain semantic HTML is enough and Tailwind's
   typography plugin styles it.

   The page's `<h1>` is the document title and is rendered above the fragment,
   so start headings at `<h2>`. Everything else is ordinary markup — `<p>`,
   `<ul>`, `<ol>`, `<table>`, `<blockquote>`, `<a href>`. Give outbound links
   `target="_blank" rel="external noopener noreferrer"`, matching the rest of
   the site.

3. **Build.** The calendar picks the page up on the next build and starts
   linking to it. Nothing needs recording anywhere else.

There is a stub to copy from at
[`city-council-agenda-august-25-2026-a5cd2463.html`](../src/lib/data/documents/city-council-agenda-august-25-2026-a5cd2463.html),
whose comment header lists the same conventions.

## What the reader gets either way

Every page carries the meeting's title, board, kind and date, a link to the
city's media page, and a link to the PDF itself — the last two rendered from
`meetings.json`, not from the fragment, so they are right without being typed
out each time. Underneath, a note that the page was written by hand and that the
city's file is the record.

A document with no page never shows a page. The calendar entry points at the
city's PDF and opens it in a new tab, and `/calendar/documents/<id>` returns a
404 for it, because nothing ever linked there.

## Safety

The fragment is rendered with `{@html}` and there is no sanitiser between it and
the browser. That is sound because the markup is this project's own — written
into the repository by hand and reviewed like any other change. It stops being
sound the moment something is pasted in from elsewhere without being read, which
is worth remembering when working from a PDF that can be copied out of.

## Where things live

```
src/lib/data/documents/<id>.html          the pages, written by hand
src/routes/calendar/documents/[id]/       the route that renders one
scripts/lib/documents.mjs                 ids, and which ids have a page
```

The route enumerates its prerender entries from the files that exist, and
`src/routes/calendar/+page.ts` reads the same directory to decide where a
calendar entry links. Both use `import.meta.glob`, so a new file is picked up by
the build with no registry to update.
