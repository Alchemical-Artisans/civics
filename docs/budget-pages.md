# Budget pages

`/budget` republishes the City of Haverhill's
[Budget and Audit Reports](https://www.haverhillma.gov/government/budget-and-finance/financial-reports/budget-and-audit-reports/)
page: every Mayor's budget and audited financial statement back to FY2006. The
city's page is a flat list of 44 PDF links with no way in but downloading a
whole book, so this one turns the newest book into pages a section at a time.

The shape mirrors the calendar exactly one level deeper:

```
/calendar                          /budget
/calendar/meetings/<id>            /budget/<year id>
/calendar/meetings/<id>/<item>     /budget/<year id>/<section>
```

## Why the list is not scraped

`meetings.json` exists because the city publishes hundreds of meeting documents
behind a search endpoint, with dates that have to be resolved from each
document's own page. The budget page is 22 rows that change twice a year: a
budget book each spring, an audit each winter. So the list is transcribed into
`YEARS` in [`src/lib/budget.ts`](../src/lib/budget.ts) instead, which makes it
typed, keeps `meetings.json` the only file the scripts own, and means adding a
year is editing one array.

The URLs are the city's own CDN and are opaque — a media key and whatever
filename the uploader used — so each one has to be recorded; there is no pattern
to build them from. Two years, FY2022 and FY2023, print "Mayor's Budget" with
nothing behind it, and are recorded as `null` rather than quietly dropped.

## Why FY2027 is transcribed rather than extracted

Most of the corpus has a text layer. The FY2027 book does not: it is a Canva
export flattened to page images for "electronic distribution", so `pdffonts`
reports no fonts and `pdftotext` yields 245 blank pages. Every section under
`fy2027/` was read off the rendered pages by hand. FY2025 and FY2026, and all
the audit reports, do have text layers if they are ever written up.

## Writing a section

1. **Find the section's page number** in the book's own table of contents,
   transcribed into
   [`fy2027/+page.ts`](../src/routes/budget/fy2027/+page.ts). Those numbers were
   checked against the PDF's own link annotations — the contents page says
   "click the page number below to skip directly to the section" — so they are
   where the book itself jumps to. In this book the printed page numbers happen
   to equal the PDF's.

2. **Create `src/routes/budget/<year id>/<slug>/+page.svelte`**, where `<slug>`
   is `sectionSlug(title)` of the contents entry. Nothing registers it: the
   contents page globs for the directory, so creating it is the whole act of
   writing a section up, and the line that linked into the city's PDF starts
   linking here instead.

3. **Add `+page.ts` beside it** returning `{ section: { title, page } }`. The
   title is the contents entry's, so the heading matches the link the reader
   followed; the page number puts a link to that page of the city's PDF in the
   header. This file is not optional the way a meeting's is — the layout titles
   the page from it.

4. The page is the transcription and nothing else: no title, no `<script>`.
   It renders inside `<article class="prose">`, so headings start at `<h2>`.
   Where the page's own printed heading differs from the contents entry —
   "2027 Budget Goals" is printed "Mayor's 2027 Budgetary Goals" — the printed
   one is the first `<h2>`.

## What a section covers

A contents entry runs to the page before the next one, and everything in that
run belongs to the section, each page's printed heading becoming an `<h2>`.
Two things complicate that in this book:

- **The book's contents skip pages.** Its front matter and process pages —
  Council Members, City Hall of Haverhill, Mayor's Budget Team, Budget Phases —
  carry headings but no contents entry, and fall inside the run for "Mayor's
  Budget Message". They are listed separately on the book page, under
  "Not in the book's contents", from a second `contents()` call. That list runs
  only as far as the book has been transcribed.
- **A table is often split across pages for room, not for meaning.** The
  five-year capital requests run pages 30–35 under page titles like "Building
  Improvements Continued & Computer Equipment", which name whatever finishes on
  that page. Transcribe such a table by the category headings it carries
  itself, so each category stays whole, and say so in a comment.

Where the book prints something that looks wrong — a heading reading
"Skid Steer - Highway2", a sentence its cell cuts off mid-clause, a total that
disagrees with the summary page's — it is kept as printed with a comment saying
what happened. The city's file is the record; a page here that silently tidies
it is worse than useless.

## Charts

Much of a budget book is charts. Where a chart carries data labels, those become
a small table — that is the content, and it is the only form in which it can be
read here at all. Where it carries none beyond its axes, a comment says what the
chart shows and there is nothing to transcribe.

## Where things live

```
src/lib/budget.ts                          the city's listing, slugs, contents
src/lib/budget.spec.ts                     unit tests for them
src/routes/budget/+page@.svelte            /budget, the overview of every year
src/routes/budget/+page.ts                 build-time load for it
src/routes/budget/+layout.ts               looks a book up by its id
src/routes/budget/+layout.svelte           the header around a book and its sections
src/routes/budget/<year>/+page.ts          the book's contents, transcribed
src/routes/budget/<year>/+page.svelte      renders it as links
src/routes/budget/<year>/<slug>/           one section, by hand
src/routes/budget/page.svelte.e2e.ts       end-to-end tests
```

`/budget` uses `+page@.svelte` to break out of `budget/+layout.svelte`: it is
the overview, not a book, so it has no book to put in a header — and breaking
out is what lets everything under the layout treat the book as present rather
than checking for null on every page.
