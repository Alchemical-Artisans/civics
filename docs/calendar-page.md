# The calendar page

Route: `/calendar`. Files:
[`+page.ts`](../src/routes/calendar/+page.ts) (build-time data),
[`+page.svelte`](../src/routes/calendar/+page.svelte) (UI), and
[`src/lib/calendar.ts`](../src/lib/calendar.ts) (pure helpers).

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
`docId`, which is how an entry addresses its document page. Scraper bookkeeping
(`rawMeetingDate`, `dateSource`, `category`, …) is dropped so it never ships to
the browser.

The result: 280 records become 274 rendered entries, with `undated`,
`duplicates`, and `flagged` counts passed alongside for the footer.

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

Each entry links to that document's page on this site,
`/calendar/documents/<docId>`, built with `Router.document(docId)`. The one
listing row with no `fileUrl` has nothing to convert and so no page; it falls
back to the document's page on the city site, `Router.cityPage(pageUrl)`.

These used to be outbound links to the city's CDN, opening in a new tab with
`rel="external noopener noreferrer"` and visually-hidden text announcing the new
window. **All of that is gone**: the links are internal now, so a new tab would
be wrong, and there is no unannounced window to warn about. The grid's hidden
text is down to `, agenda`, and still begins with a comma because Svelte trims
leading whitespace inside an element, which otherwise ran the board name into the
following word for screen readers.

The e2e suite asserts on _every_ link that it is internal and carries no
`target`, so a leftover would not slip through.

## Internal links

Every internal URL on the site is built by `Router` in
[`src/lib/router.ts`](../src/lib/router.ts) — one static method per route:

```svelte
<a href={Router.calendar()}>…</a>
<a href={Router.document(m.docId)}>…</a>
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

[`documents/[id]/+page.svelte`](../src/routes/calendar/documents/%5Bid%5D/+page.svelte)
renders one document: a back link, the title, board, kind and date, then the
source links, then the converted text in a `prose` container.

**The source link sits at the top, not the footer.** This page is a convenience
and the city's file is the record — and since the conversion reflows complex
layouts imperfectly, the way back to the original has to be obvious.

The converted HTML is injected with `{@html}`. That is safe here because the
markup is not sanitised after the fact but _assembled from a whitelist_ by
`scripts/lib/pdf-html.mjs` at scrape time, with every character of text escaped
on the way out. Nothing about it is user input: it comes from a committed file.
See [pdf-conversion.md](./pdf-conversion.md).

Documents with no text layer — over half of them — get a plain explanation and an
`<object>` PDF viewer instead, so the page is still useful. The wording names the
scan as the city's, so the limitation does not read as a fault here.

`+page.ts` exports `entries()` listing every `docId`, because a fully prerendered
site cannot discover a dynamic route by crawling.

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

The footer states how many documents are indexed, how many were dropped for
having no date, how many duplicates were collapsed, and how many carry a date
that contradicts their own title or filename.

This is intentional. The underlying data has real quality problems (see
[dates.md](./dates.md)); a civic information site should say so plainly rather
than present uncertain data as authoritative.

## Tests

[`page.svelte.e2e.ts`](../src/routes/calendar/page.svelte.e2e.ts) runs against
the production build and covers: the month heading renders, entries link to
document pages, every link is internal and same-tab, month navigation works,
board filtering narrows results, and unchecking agendas hides them.

[`documents/page.svelte.e2e.ts`](../src/routes/calendar/documents/page.svelte.e2e.ts)
covers the document page: reaching one from the calendar and finding converted
text, the original PDF offered at the top, the back link, and the embedded
viewer appearing for a scanned document.

[`src/routes/page.svelte.e2e.ts`](../src/routes/page.svelte.e2e.ts) covers the
root: `/` lands on the calendar, and going back from there leaves the site
rather than bouncing forward again.

The two calendar suites assert on link attributes rather than following outbound
links, so the suite never fetches anything from the city's CDN.
