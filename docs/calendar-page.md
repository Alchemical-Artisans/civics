# The calendar page

Route: `/calendar`. Files:
[`+page.ts`](../src/routes/calendar/+page.ts) (build-time data),
[`+page.svelte`](../src/routes/calendar/+page.svelte) (UI),
[`src/lib/meetings.ts`](../src/lib/meetings.ts) (turning `meetings.json` into
what the site shows), and [`src/lib/calendar.ts`](../src/lib/calendar.ts) (pure
helpers).

## One entry per meeting, not per document

The city publishes an agenda and its minutes as two separate records. They are
two documents about the same sitting, so the calendar shows **one entry per
meeting**, and the entry opens a page listing that meeting's documents:
[`/calendar/meetings/<id>`](../src/routes/calendar/meetings/).

Board and date are the identity, because they are all the scrape gives to match
on — nothing in the listing ties a document to a sitting. `meetingId()` slugs
the board and appends the date, so `City Council` on `2026-08-25` becomes
`city-council-2026-08-25`.

A meeting is not limited to two documents. Of 166 meetings, 74 hold one, 76
hold two, and 16 hold three or four — a revised agenda beside the original,
executive-session minutes kept apart from the ordinary ones, or a special
permit decision recorded as minutes of its own. Whether such a decision was
taken at that sitting or at a separate one the same day is not something the
records say; grouping them assumes the former.

**The meeting route is the one route with a parameter.** Everything else here is
a static route, including the hand-written document pages. Meeting pages are
generated from data rather than written, so there is nothing to hand-write, and
`+page.ts` exports `entries()` naming every id. That makes the build fail loudly
if the data and the links ever disagree, where relying on SvelteKit's crawler
would quietly emit fewer pages.

## Prerendering

The whole site is prerendered. `src/routes/+layout.ts` contains:

```ts
export const prerender = true
```

That is required by `@sveltejs/adapter-static`, which refuses to build if any
route is dynamic. The practical consequence for this page: **`+page.ts` runs at
build time, not on request**, so the meeting data is baked into the output.

## Loading and trimming

`+page.ts` imports `meetings.json` directly. Vite inlines it, so there is no
runtime fetch. It then does three things.

**Drops undated records.** A record with no `date` cannot be placed on a
calendar. The count is passed through as `undated` and disclosed in the footer
rather than silently hidden.

**Collapses duplicate PDFs.** Five PDFs are published under two media pages
each, which would otherwise render the same document twice on the same day.
Records are grouped by `fileUrl`, keeping one — and preferring the copy _not_
flagged `needsReview`, since where the two disagree the unflagged one is the
better-evidenced date.

**Trims fields.** Only the seven fields the UI needs are kept — including
`docId`, which is how a document addresses its write-up. Scraper bookkeeping
(`rawMeetingDate`, `dateSource`, `category`, …) is dropped so it never ships to
the browser.

**Groups into meetings.** `groupIntoMeetings()` collapses the documents by board
and date. Undated documents are dropped here rather than later, so a `Meeting`
always has a date and `groupByDate()` never has to check for one.

The result: 282 records become 276 documents in 166 meetings, with `undated`,
`duplicates`, and `flagged` counts passed alongside for the footer.

The work is in `src/lib/meetings.ts` rather than in the route, because each
meeting page needs the same list built the same way.

## Payload

The dataset ships as a route-level JS chunk of roughly 150KB — about 16KB
gzipped — loaded only when someone visits `/calendar`. The prerendered HTML
itself is ~28KB, containing the current month's markup.

That is comfortably small enough to keep all months client-side, which is what
makes month navigation and filtering instant with no further requests.

## Date handling

All date logic is in `src/lib/calendar.ts`, kept separate from the component so
it can be unit-tested without rendering anything. 13 tests cover it in
[`calendar.spec.ts`](../src/lib/calendar.spec.ts).

**Everything is UTC.** Dates are `YYYY-MM-DD` strings, and `Date` objects are
built with `Date.UTC(...)`. Using the local-time constructor would shift days for
readers west of UTC and put meetings in the wrong cell — a real bug for a site
whose entire purpose is telling people which day something happened.

`buildMonthGrid()` returns Sunday-aligned weeks padded with neighbouring days,
trimming any trailing week that falls entirely outside the month.

## State

Svelte 5 runes, in a small amount of state:

| State                         | Purpose                                                      |
| ----------------------------- | ------------------------------------------------------------ |
| `chosen`                      | the month the reader navigated to, or `null` for the default |
| `activeBoards`                | a `SvelteSet` of board filters; empty means all              |
| `showAgendas` / `showMinutes` | document-kind toggles                                        |
| `today`                       | today's date, filled in after mount                          |

Two details are deliberate:

**The kind toggles hide documents, not meetings.** A sitting with both an
agenda and minutes stays on the calendar when only one kind is showing, with the
hidden one dropped from its chip; a meeting left with nothing visible disappears
entirely. Hiding the whole meeting because one of its documents was filtered out
would be the wrong answer to "show me the minutes".

**The default month is the newest month containing meetings, not today.**
Because the page is prerendered, "today" at build time and "today" in the
reader's browser are different dates. Deriving the default from the data keeps
the server and client render identical.

**`today` is set in `onMount`.** It starts empty, so the prerendered HTML has no
"today" highlight, and it fills in on the client. Computing it during render
would produce a hydration mismatch.

Everything downstream — `visible`, `byDate`, `weeks`, `monthCount` — is
`$derived`, so filtering and navigation need no manual invalidation.

## Layout

Two presentations of the same data, switched on viewport width:

- **Wide (`md` and up):** a real `<table>` month grid. A table is used rather
  than a CSS grid because the content genuinely is tabular — weekday column
  headers carry meaning — which gives screen readers useful structure for free.
- **Narrow:** the grid is hidden and a date-grouped agenda list is shown, since
  seven columns of cells are unusable on a phone.

Agendas are blue, minutes green, in both views.

## Where entries link

Every entry links to its meeting, `/calendar/meetings/<id>`, built with
`Router.meeting(id)`. Nothing in the grid leaves the site any more: the choice
between a write-up here and the city's own file has moved down to the meeting
page, which is the only place that knows which documents there are.

On a meeting page, a document links to `/calendar/documents/<docId>` when
somebody has written it up, and otherwise straight to the city's PDF — opening
in a new tab with `rel="external noopener noreferrer"` and visually-hidden text
announcing the new window. The one listing row with no `fileUrl` has nothing to
convert; it falls back to the city's media page, `Router.cityPage(pageUrl)`.

A chip carries one letter per document, `A` for an agenda and `M` for minutes,
coloured by kind. It is `aria-hidden`; the accessible name gets a plain count
instead, because "A M" read aloud is noise. The count still begins with a comma,
because Svelte trims leading whitespace inside an element and the board name
otherwise ran into the following word for screen readers.

The e2e suite asserts on _every_ grid link that it points at a meeting and
carries no `target`, so a leftover would not slip through.

A write-up's back link goes to its meeting rather than to the calendar, so the
path in and the path out match: calendar → meeting → document → item.

## Internal links

Every internal URL on the site is built by `Router` in
[`src/lib/router.ts`](../src/lib/router.ts) — one static method per route:

```svelte
<a href={Router.calendar()}>…</a>
<a href={Router.meeting(m.id)}>…</a>
<a href={Router.document(doc.docId)}>…</a>
```

This replaces SvelteKit's `resolve()` from `$app/paths`, which the site used
until it was set up for deployment. Two reasons:

- **One place knows how a URL is spelled.** A route that changes shape is a
  compile error at every call site rather than a string to hunt for, and the
  base path is applied exactly once, in `Router`.
- **`resolve()` proved unreliable.** Under a non-empty base path, mixing it with
  a value that already carried the base produced `/civics/civics/…` and failed
  the build outright. Whether the base is already applied is the kind of thing a
  route table can answer and a call site cannot.

The rule `svelte/no-navigation-without-resolve` is off in
[`eslint.config.js`](../eslint.config.js) for this reason: it looks for
`resolve()` by name and cannot be taught about `Router`, which does the job the
rule is guarding.

There is one link `Router` does not build — the hidden locale link in
[`+layout.svelte`](../src/routes/+layout.svelte), which points at whatever page
is being rendered. `page.url.pathname` already carries the base path, so it is
used as-is. Adding the base a second time there is precisely what broke the
first subdirectory build.

See [deployment.md](./deployment.md#base-path).

## The site root

`/` has nothing on it worth landing on yet, so
[`src/routes/+page.svelte`](../src/routes/+page.svelte) forwards to `/calendar`
with a meta refresh:

```svelte
<svelte:head>
  <meta http-equiv="refresh" content="0;url={Router.calendar()}" />
</svelte:head>
```

Two things about that are deliberate.

**It is not a 301.** GitHub Pages serves static files and cannot send a redirect
status anyway, but a permanent one would be the wrong choice even where it could:
browsers cache 301s, sometimes for as long as the profile lives, and would keep
sending people to `/calendar` long after a real landing page replaced this file.
Nothing about a meta refresh is cached that way.

**It is not SvelteKit's `redirect()`.** Thrown from a `+page.ts`, that prerenders
to the same meta refresh preceded by `location.href = ...`, which pushes a
history entry — the back button would land on `/` and be thrown forward again,
trapping the visitor on the site. A meta refresh that fires while the page is
still loading replaces its history entry instead.

The markup under it is a plain link to the calendar, which is what a crawler
that reads the page without following the refresh will see.

## The document page

[`documents/+layout.svelte`](../src/routes/calendar/documents/+layout.svelte)
wraps every document page: a back link, the title, then a header, then the page
itself in a `prose` container. The header runs the title, with an information
icon beside it where the document carries standing boilerplate; then board, kind
and date; then where the meeting is held, linked to a map, and `Remote Access`,
linked to the join URL; then the links to the city's own copy.

[`Note.svelte`](../src/lib/Note.svelte) is that icon. It pops the text over the
page rather than expanding, so opening it never moves the agenda underneath, and
it positions against its parent rather than the icon so the panel stays inside
the content column on a narrow screen. The icon is Material Symbols
`info-outline-rounded`, pulled in through Iconify's **offline** component: the
default one takes an icon name and fetches the artwork from `api.iconify.design`
at runtime, which would put a CDN round-trip in front of a page that is
otherwise entirely self-contained.

That header draws on two sources.
[`+layout.ts`](../src/routes/calendar/documents/+layout.ts) supplies the title,
board, kind and date, reading the id off the end of the URL and looking it up in
`meetings.json`. The time, room and remote option are not in `meetings.json` at
all — they are printed on the document and nowhere else — so the page underneath
supplies them from its own `+page.ts` and the layout reads them off `page.data`.
See [`MeetingDetails`](../src/lib/calendar.ts), and
[dates.md](./dates.md#scraped-clock-times-are-not-displayed) for why the clock
time in the dataset cannot be used.

**The source link sits at the top, not the footer.** The page is a written
summary and the city's file is the record, so the way to the original has to be
obvious rather than tucked underneath.

Underneath the layout, each write-up is its own static route — one directory per
document id, holding a hand-written `+page.svelte`. Being components rather than
strings of markup, they are formatted by Prettier and parsed by `svelte-check`
like the rest of the source, and there is no `{@html}` anywhere. See
[document-pages.md](./document-pages.md).

Most documents have no page. The calendar links those straight to the city's
PDF, and `/calendar/documents/<id>` 404s for them — there is no such route —
because nothing linked there in the first place, which beats a page whose only
content is an apology.

Nothing enumerates the pages for the build: a static route is prerendered
because it exists. The calendar's loader finds them with `import.meta.glob` to
decide where an entry links, so writing a page is still one step: add the file.

## The site mark

[`src/lib/assets/favicon.svg`](../src/lib/assets/favicon.svg) is a civic portico:
a pediment over four columns, on a plinth and steps. It replaced the default
SvelteKit logo.

The colonnade is the whole idea. The building is drawn **open** — the gaps
between the columns let the page background read straight through the mark
rather than it being a solid mass — so the symbol for government and the symbol
for seeing into it are the same shape.

Constraints that shaped it:

- **Legibility at 16px.** Favicons are mostly seen tiny. Four columns is the
  fewest that still reads as a portico; finer detail turns to mud at tab size.
  It was checked rendered at 16, 24, 32, 64, and 128px.
- **Works on light and dark.** Browser tab strips are either. The single fill,
  `#0369a1`, holds contrast on both, so no theme variants are needed.
- **No comments in the file.** Vite inlines assets under 4KB as a data URI, so
  anything in the SVG ships in the `<link rel="icon">` of every page. Explanatory
  comments were moved here; the file keeps only a `<title>`, which is small and
  gives the mark an accessible name if it is ever used inline in the page.

## Honesty in the footer

The footer states how many meetings and documents are indexed, how many were
dropped for having no date, how many duplicates were collapsed, and how many
carry a date
that contradicts their own title or filename.

This is intentional. The underlying data has real quality problems (see
[dates.md](./dates.md)); a civic information site should say so plainly rather
than present uncertain data as authoritative.

## Tests

[`page.svelte.e2e.ts`](../src/routes/calendar/page.svelte.e2e.ts) runs against
the production build and covers: the month heading renders, every entry links to
a meeting and is same-tab, month navigation works, board filtering narrows
results, and unchecking agendas drops the document count without dropping the
meetings that still have minutes.

[`meetings/page.svelte.e2e.ts`](../src/routes/calendar/meetings/page.svelte.e2e.ts)
covers the meeting pages, reached through the calendar rather than by a
hardcoded id: the board and date render, at least one document is listed, a
document with no write-up goes to the city in a new tab, the back link returns
to the calendar, and an unknown id returns a 404.

[`documents/page.svelte.e2e.ts`](../src/routes/calendar/documents/page.svelte.e2e.ts)
covers the document pages, enumerated from the route directories that exist:
reaching one from the calendar by way of its meeting, the original PDF offered
at the top, the back link returning to that meeting, and an unknown id returning
a 404. It looks the meeting up in `meetings.json` with the same `meetingId()`
the site uses, rather than walking the grid until a write-up turns up.

[`src/routes/page.svelte.e2e.ts`](../src/routes/page.svelte.e2e.ts) covers the
root: `/` lands on the calendar, and going back from there leaves the site
rather than bouncing forward again.

The calendar suites assert on link attributes rather than following outbound
links, so the suite never fetches anything from the city's CDN.
