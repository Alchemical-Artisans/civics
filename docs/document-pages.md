# Document pages

A meeting document gets a page on this site when somebody writes one. There is
no automated step: `src/routes/calendar/documents/<id>/+page.svelte` is a Svelte
component written by hand, and its existence is the only thing that decides
whether the calendar links to a page here or straight to the city's PDF.

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

2. **Create `src/routes/calendar/documents/<id>/+page.svelte`.** The directory
   name is the id and becomes the URL. The page is the write-up and nothing
   else: no `<script>`, no title, nothing restated from `meetings.json`. It
   renders inside `<article class="prose">` in the surrounding layout, so plain
   semantic markup is enough and Tailwind's typography plugin styles it.

   The page's `<h1>` is the document title and is rendered above by the layout,
   so start headings at `<h2>`. Everything else is ordinary markup — `<p>`,
   `<ul>`, `<ol>`, `<table>`, `<blockquote>`, `<a href>`. Give outbound links
   `target="_blank" rel="external noopener noreferrer"`, matching the rest of
   the site. Svelte treats `{` and `}` as expressions, so write them `&lbrace;`
   and `&rbrace;` on the rare occasion a document contains one.

3. **If the document says when and where, add a `+page.ts` beside it.** An
   agenda usually opens with a time, a room and a link to join remotely. Those
   belong in the header rather than in the prose, so return them as `meeting`
   and let the layout render them:

   ```ts
   export const load: PageLoad = () => ({
     meeting: {
       time: "7:00 PM",
       location: { name: "…, 4 Summer St, Room 202", mapQuery: "4 Summer Street, Haverhill, MA" },
       remote: "https://meet.google.com/…",
       notice: ["The meeting is held in person as its official location under…"],
     },
   })
   ```

   Every field is optional, and the file itself is optional — skip it for a set
   of minutes that states none of this. `name` is shown and should be verbatim;
   `mapQuery` is what gets handed to the map, so drop the room number and add
   the city. `notice` is the standing boilerplate an agenda opens with — Open
   Meeting Law status, recording notices — one string per paragraph; it goes
   behind an information icon next to the title rather than into the write-up,
   where it would push the agenda below the fold. See `MeetingDetails` in
   [`src/lib/calendar.ts`](../src/lib/calendar.ts).

   The time has to come from the document. `meetings.json` has a clock time in
   `rawMeetingDate`, but it is a mix of real times and placeholders rendered
   without timezone conversion, so nothing displays it — see
   [dates.md](./dates.md#scraped-clock-times-are-not-displayed).

4. **Build.** The route is static, so the fully-prerendered build picks it up
   with no entry list to extend, and the calendar starts linking to it. Nothing
   needs recording anywhere else.

There is a worked example at
[`city-council-agenda-august-25-2026-a5cd2463/+page.svelte`](../src/routes/calendar/documents/city-council-agenda-august-25-2026-a5cd2463/+page.svelte):
an agenda outline as `<h2>` per numbered item, nested `<ul>` for sub-items with
the city's numbering kept verbatim, and `<table>` for the genuinely tabular
parts. Its comment header records where the content came from and what was left
out, which is worth doing on every page — a City Council agenda PDF is usually a
handful of outline pages followed by a packet running to hundreds.

## Why a route rather than a data file

These pages used to be HTML fragments under `src/lib/data/documents/`, loaded by
a `[id]` route and dropped into the page with `{@html}`. Making each one a route
of its own is less machinery for the same result:

- **The pages are checked like the rest of the source.** Prettier formats them
  and `svelte-check` parses them, so unbalanced markup is a build error rather
  than something a reader finds. As opaque strings they were exempt from both.
- **Nothing has to enumerate them.** A static route is prerendered because it
  exists. The old `[id]` route needed an `entries` generator to tell the build
  which ids were real.
- **`{@html}` is gone.** There is no longer a string of markup to trust; the
  write-up is a component the compiler reads.

## What the reader gets either way

Every page carries the meeting's title, board, kind and date, a link to the
city's media page, and a link to the PDF itself — the last two rendered from
`meetings.json`, not from the page, so they are right without being typed out
each time. Underneath, a note that the page was written by hand and that the
city's file is the record.

A document with no page never shows a page. The calendar entry points at the
city's PDF and opens it in a new tab, and `/calendar/documents/<id>` returns a
404 for it — there is no such route — because nothing ever linked there.

## Safety

A page is a component, compiled like any other, so there is no `{@html}` and
nothing to sanitise. What is still worth remembering is that a PDF can be copied
out of: paste markup from somewhere else without reading it and you have put
someone else's script tag into the build. Read what you paste.

## Where things live

```
src/routes/calendar/documents/<id>/+page.svelte  the pages, written by hand
src/routes/calendar/documents/<id>/+page.ts      when and where, where stated
src/routes/calendar/documents/+layout.svelte     the header around both
src/routes/calendar/documents/+layout.ts         looks a document up by its id
scripts/lib/documents.mjs                        ids, and which ids have a page
```

The layout reads the id off the end of the URL — which is the directory name,
which is the `docId` — and pulls the title, board, kind, date and links to the
city out of `meetings.json`, so a page never restates any of it. What is only
on the document rather than in the dataset comes up from the page's `+page.ts`
through `page.data`. `src/routes/calendar/+page.ts` globs the same directories
to decide where a calendar entry links, so a new page is picked up by the build
with no registry to update.
