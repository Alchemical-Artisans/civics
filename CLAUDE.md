# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A SvelteKit site that republishes the City of Haverhill's public meeting
documents — agendas and minutes — as a browsable month calendar at
<https://haverhill.alchemicalartisans.com>. Scraping happens ahead of time on a
developer's machine and the results are committed, so the build is offline and
the reader's browser never talks to the city's servers.

It also republishes the city's budget and audit reports, where the current
budget book is readable a section at a time rather than as one PDF running to
hundreds of pages.

**The point is not a faithful copy of the book in web form.** It is to
rearrange what the city publishes so a reader can see what the government is
doing, so the structure here is deliberately not the book's: sections are
grouped into pages the book has no equivalent of, named things the book never
calls them, and reached from charts rather than from a contents. The words on a
page are still the city's, exactly as printed -- the text is quotation, the
arrangement is editorial. There is no page listing the fiscal years: the list is the
menu behind **Budget** in the bar at the top of every page.

`docs/` is the authoritative reference and is unusually complete. Start at
[docs/README.md](docs/README.md), which maps the rest:
`scraping.md`, `dates.md`, `data-format.md`, `document-pages.md`,
`budget-pages.md`, `calendar-page.md`, `operations.md`, `deployment.md`.

## Commands

```sh
npm run dev                 # vite dev server
npm run build               # prerender the whole site into build/
npm run check               # svelte-check against tsconfig
npm run lint                # prettier --check . && eslint .
npm run format              # prettier --write .

npm run glossary:check      # every defined term is defined where first used
npm run test                # unit (once) then e2e
npm run test:unit           # vitest, watch mode
npm run test:e2e            # playwright; builds and previews on :4173 first

npm run metadata:update     # refresh everything the site takes from the city
npm run calendar:update     # scrape only documents new since the last run
npm run calendar:rebuild    # re-scrape everything (only when scrape/date logic changed)
npm run budget:update       # re-scrape the budget and audit listing (always full)
npm run storybook           # storybook on :6006
```

Vitest runs three projects — `client` (browser, `*.svelte.{test,spec}.ts`),
`server` (node, other `*.spec.ts` plus `scripts/**/*.spec.mjs`), and
`storybook`. To narrow a run:

```sh
npm run test:unit -- --run --project=server src/lib/calendar.spec.ts
npm run test:unit -- --run --project=server -t "name of the test"
npx playwright test src/routes/calendar/page.svelte.e2e.ts
```

`test.expect.requireAssertions` is on, so a test with no assertion fails.

## Architecture

Two halves joined by one committed data file and nothing else.

**Scrapers (`scripts/`)** run by hand, never in CI. `lib/haverhill.mjs` replays
the AJAX POST the city's listing page makes to an Umbraco surface controller
(three hardcoded content keys plus an antiforgery token/cookie handshake), parses
the returned HTML table by regex, and resolves each document's date from its own
media page. `lib/documents.mjs` assigns `docId`; `lib/store.mjs` reads/writes
`meetings.json`; `lib/reviews.mjs` overlays `src/lib/data/reviews.json`.

**Data (`src/lib/data/`).** `meetings.json` and `budget.json` are committed and
are the only link between the halves. Hand corrections go in `reviews.json`, keyed by
`<pageUrl slug>::<pdf filename>` — not `docId` — and are re-applied by both
scripts, so they survive a full rebuild. Editing `meetings.json` directly does
not survive `calendar:rebuild`.

**Site (`src/routes/`).** Fully prerendered — `src/routes/+layout.ts` sets
`prerender = true` for `@sveltejs/adapter-static`, so every `+page.ts` is a
build-time load. `src/lib/meetings.ts` turns `meetings.json` into what the site
shows: it drops undated records, collapses PDFs published under two media pages,
trims to the fields the UI needs, and groups the documents into meetings.

**A calendar entry is a meeting, not a document.** The city publishes an agenda
and its minutes separately; they are two documents about one sitting, matched on
board and date, which is all the listing gives to match on. An entry opens
`/calendar/meetings/<board-slug>-<date>`, which lists that sitting's documents —
each linking to a write-up here when one exists and to the city's PDF when not.
That route is the **only** one with a parameter, and it prerenders because
`+page.ts` exports `entries()`; everything else, hand-written pages included, is
a static route.

**Write-ups are hand-written, one static route each**, at
`src/routes/calendar/meetings/<meeting id>/+page.svelte`, with an agenda item
optionally getting `<meeting id>/<item-slug>/+page.svelte` beneath it. There is
no registry: SvelteKit prefers the static directory over `[meeting]`, so adding
the directory is the whole act of writing a meeting up. `src/lib/meetings.ts`
globs the same directories only to keep `[meeting]` from prerendering an id a
written page already covers, and `meetings/+layout.ts` derives the id from the
URL segment after `meetings` and looks the sitting up in `meetings.json`. A data
refresh cannot contradict any of it.

`docs/document-pages.md` calls these document pages; they are meeting pages now,
and an agenda's transcription is what a meeting page shows.

**`/` forwards to the most recent budget book and is not a page to read.** The
budget is the front door; an index would cost every visitor a hop to reach it.
The destination comes from `fiscalYears().find((y) => y.written)`, so creating
`src/routes/budget/fy2028/` moves it. The forward is a meta refresh, never a 301
or SvelteKit's `redirect()` — see
[docs/calendar-page.md](docs/calendar-page.md#the-site-root) for why both would
break, in ways the e2e suite now pins. The header carries the link to
each half, so no page needs its own sideways link.

**The two columns are the whole city's budget, not the book's.** Page 78's two
tables are the general fund; the front page draws both entire, state assessments
and overlay included -- the Council never votes those, because the Commonwealth
bills the city and the assessors raise the overlay, but they are spent. What the
book leaves out is water and wastewater, enterprise funds appropriated in their
own Council orders: $14,805,633 and $15,967,043 on the spending side, and on the
other what those departments are billed, $15,040,417 and $16,666,024.

Free cash is left out of the revenue column -- it is last year's surplus, not
this year's income -- and so is the book's line for the enterprise
reimbursement, since that money is inside the water and sewer bills already
charted. So the columns stand $5,151,539 apart: the free cash, and the $1,539 by
which the orders' reimbursement differs from the book's May projection of it.
That gap is why they are columns on one scale rather than two pies -- spending
$316,044,835 against revenue $310,893,296.
`fy2027/council-orders.ts` transcribes the orders from the agenda of 2 June 2026
-- a document the calendar half already carries -- and `spending` quotes them,
which is where the explanation lives; the front page just draws the budget.

**The budget is the same idea one level deeper, and shares nothing with the
calendar.** The bar's menu lists every fiscal year the city publishes — a book
here where one is written, the city's own PDF where it is not, and each year's
audit report beside it, which is the only place those are linked. `/budget`
itself is not a page: it was one, and reaching a book through it cost a hop.
`/budget/<year>` is a budget book's own table of contents -- two unheaded
lists, the year's own account in the book's order and a priced column of
everything the city funds, from the book's run of City Council to Library plus
anything `ALSO_A_BUDGET` names, each line carrying what the book recommends
spending on it and the list running largest first -- and
`/budget/<year>/<section>` is one section of it transcribed. None of it is
scraped: the city's page is 22 rows that change twice a year, so the list lives
in `src/lib/data/budget.json`, scraped by `budget:update`. Every route is static and each contents line links to a
section here when the directory exists and into the city's PDF at that page when
it does not, so writing a section up is creating one directory. The page numbers
are what those PDF links are built from; the contents shows titles only. The FY2027 book
has no text layer at all — it is a Canva export flattened to page images — so
its sections were read off rendered pages by hand. See
[docs/budget-pages.md](docs/budget-pages.md).

Notable pieces:

- **`src/lib/SiteHeader.svelte`** is the bar on every page: the mark, the page's
  own name, the budget with its menu of fiscal years, and the calendar. It
  carries a page's sources too -- the book, and anything else a page says it was
  built from, such as the Council's appropriation orders on the spending page. On the budget half it
  carries what the page used to head itself with — the name (its only `<h1>`),
  the fiscal year the book covers, and an "Original Source" link to the city's
  file, opened at a section's own page. Only on a section: a book's own front
  page hangs the book off the calendar step that produced it instead, where the
  bar could only say that the book came from somewhere. All from `src/lib/heading.ts`, which
  reads `page.data`; a budget book is called `2027 Budget`, never "FY2027
  Mayor's Budget". The bar runs the width of the window, because a bar narrower
  than the page under it reads as a mistake. Its budget entry is a link to this
  year's book with a menu of every fiscal year under it — the list `/budget`
  used to be, and the reason no budget page carries a back link any more. The
  word navigates, so the caret beside it is a separate `<button>`: that is the
  whole control on a touch screen, where there is no hover. The hover itself is
  written both in CSS (so a page that has not hydrated still opens the menu) and
  in the component, which takes over on mount via `:not(.live)` — otherwise
  `:hover` would hold open a menu Escape had just closed. The current section is
  matched on `page.route.id`, never on `page.url.pathname` against a
  `Router`-built href -- with `paths.relative` on, that comparison cannot match
  during prerendering and starts matching after hydration, so the served markup
  and the hydrated markup silently disagree.

- **`src/lib/budget.ts`** reads `budget.json` and holds `sectionSlug` and
  `contents`. `sectionSlug` is `meetingId`'s rule except that apostrophes are
  dropped rather than collapsed — half this book's titles carry one, and
  `mayor-s-budget-message` reads as a typo.
- **`src/lib/BudgetStack.svelte`** is the other chart a book opens with: what
  the city holds and what it owes, as two full-width bars on one scale above the
  table of contents, each divided into its parts. The pies beside them are the
  year; this is the position it sits on, and one scale is what makes $22M of
  reserves read as the eighth of $176M of debt that it is. It shows what the
  city has, not what its policies allow it to have -- the bands are those
  sections' subject, not this page's, and each bar's name is the link to its
  section, which is why neither has a line in the contents below. The reserves total is ours, not the
  book's: free cash is certified out of the fund balance, so `overview.spec.ts`
  pins this year's free cash at $0 and will fail the year adding the three would
  double-count. A segment names and prices itself on hover or focus, as a pie
  wedge does, reporting its share of its own bar; hovering fades only that bar,
  since the two are there to be compared. A part worth $0 draws no segment and
  keeps an `sr-only` line instead. Colour for every chart here comes from
  **`src/lib/chart-colours.ts`**, one validated sequence, restarted per pie and
  per bar.
- **`src/lib/GlossaryTerm.svelte`** links a word in the city's prose to the
  book's definition of it: a plain link to that term's entry on
  `/budget/fy2027/glossary`, nothing more. It briefly carried the definition
  itself, as `aria-describedby` plus a CSS tooltip, which made a screen reader
  recite the definition of "levy" at all twenty-nine of its uses -- worth
  revisiting, but not in that shape. The 62 terms are
  `src/lib/data/glossary.json`, transcribed from pages 232 to 245 (the one file
  in `data/` no scraper writes), rendered by the glossary page and read by
  **`scripts/check-glossary.mjs`**, which `npm run lint` runs: it fails when a
  page uses a defined term without linking it, or names a term the book does not
  define, and `--fix` wraps them. Every use is linked, not just the first, except
  where the match is part of a name ("Water Department").
- **`src/lib/BudgetColumns.svelte`** is what a book opens with: spending and
  revenue as two full-height columns on one scale, each divided into its parts and headed
  with a link to the side of the book it is about -- `spending` and `revenue`,
  which gather that side's sections and so have no contents lines of their own.
  `reserves` is the third bucket, opened from the reserves bar. Columns rather
  than pies because two circles cannot be compared by eye, and whether the two
  sides are the same size is the first thing to know about a budget. A category
  page ends with **`src/lib/BookElsewhere.svelte`**, the site's only "see also":
  the parts of the book it belongs with and does not carry, each linking to our
  page where one exists and to the city's PDF where it does not. A segment names
  itself and prints its dollars and share on hover or focus; every segment is
  focusable, which is the only way to reach one worth $250,000 of $316 million,
  and each carries its figures as its accessible name, so nothing is only
  visible to a mouse. **`src/lib/budget-table.ts`** is how it
  gets its figures: a
  transcribed table is data (cells as the strings the book prints), `BudgetTable`
  renders it, and `column()` reads a year out of it for the chart. Page 78 is
  split between `spending/tables.ts` and `revenue/tables.ts`, each beside
  the page that renders it and the chart that reads it. One copy, so
  the chart cannot contradict the table it links to. Same arrangement for the
  reserve dials (`reserves/tables.ts`) and the debt list
  (`outstanding-debt/tables.ts`); both are `unheaded`, meaning the book prints
  nothing over their columns and neither does the page, so their column names
  are handles for `column()` rather than transcription. The figures come from the
  book's page-78 tables, not its own revenue pie on page 65, which is $3,458,864
  short of the total it prints.
- **`src/lib/BudgetTimeline.svelte`** draws page 13, the budget calendar, as the
  book page's footer, fixed to the bottom of the window: a row of twelve boxes
  with a mark showing where today falls in the process. `+layout.svelte` pads
  the book page by more than the footer is tall, since a fixed footer cannot
  push anything out from under itself. It is a drawing rather than a section of its own,
  and its entries are `budget-calendar.ts` beside the book's `+page.ts`. A box
  holds a date and a summary — the only text on these pages that is not the
  book's — and the book's own sentence comes up as a tooltip over the box on
  hover or focus, drawn outside the scrolling strip because `overflow-x` clips
  vertically too, and sits hidden in the box for a screen reader. Nothing else
  is in the footer: no label, no today's date, only the boxes and the mark. Two
  boxes carry a `PDF` link: a step that produced a document the city published
  hangs it there, so the budget book comes off "Final review" and the Council's
  appropriation orders off "Public hearings", the run of hearings the agenda of
  2 June sits inside. The stage the process has
  reached, meaning the last entry that has begun, is the one box in pale green,
  against the pale blue of the entries behind it and the white of those ahead. Boxes
  are evenly spaced because two entries are a day apart; only the mark is placed
  by date. Today comes from
  `+page.ts` at build time so the mark is in the served HTML, and the component
  replaces it on mount with the reader's own date.
- **`src/lib/router.ts`** builds _every_ internal URL. Never write a path inline
  and never use SvelteKit's `resolve()` — `Router` applies `base` (the
  `BASE_PATH` env knob for a non-root deploy) exactly once, and
  `svelte/no-navigation-without-resolve` is disabled because of it.
- **`src/lib/calendar.ts`** holds the pure date/grouping helpers, deliberately
  outside the component so they unit-test without rendering. All dates are
  `YYYY-MM-DD` strings and `Date.UTC(...)`; the local-time constructor shifts
  meetings into the wrong cell west of UTC.
- **SvelteKit is configured inside `vite.config.ts`**, not `svelte.config.js` —
  there is no such file. Runes mode is forced for everything outside
  `node_modules`.
- `src/lib/paraglide/` is generated (gitignored); `src/stories/`,
  `src/lib/vitest-examples/` and `src/routes/demo/` are `sv create` scaffolding
  the e2e suite still drives.

## Writing a document page

See [docs/document-pages.md](docs/document-pages.md) for the full procedure. The
rules that bite:

- The page is the write-up and nothing else — no `<script>`, no title, nothing
  restated from `meetings.json`. It renders inside `<article class="prose">`,
  so plain semantic markup is enough and headings start at `<h2>`.
- Transcribe the document verbatim. Do not paraphrase or write prose of your
  own; the city's numbering and wording are kept as printed. Only the agenda
  outline is transcribed, not the packet behind it.
- Outbound links get `target="_blank" rel="external noopener noreferrer"`.
  Literal `{`/`}` must be written `&lbrace;`/`&rbrace;`.
- Time, room, remote link and standing notices go in a sibling `+page.ts`
  returning `{ details: … }` (`MeetingDetails` in `src/lib/calendar.ts`) — never
  in the prose, and only when the document states them. It is `details` and not
  `meeting` because a `Meeting` is a sitting, with documents under it. Clock
  times from `meetings.json` are unreliable and are never displayed.
- An item page's `+page.ts` returns `{ item: { title } }`.
- PDF pages cut out for one item are committed under `static/excerpts/<id>/`
  and linked with `Router.excerpt(...)`; `.cache/` is gitignored, so re-cutting
  means re-fetching the original.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci` and
`npm run build` and publishes `build/` to GitHub Pages. No tests run there and
nothing is scraped. `static/CNAME` and `static/.nojekyll` are part of the build
on purpose — see [docs/deployment.md](docs/deployment.md).

## Style

Prettier config is non-default and enforced by `npm run lint`: no semicolons,
double quotes, 2-space indent, trailing commas, 100-column width. Comments in
this codebase explain _why_ a thing is the way it is, often at length; match
that when touching them.
