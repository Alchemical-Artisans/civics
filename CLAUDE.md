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
  carries no link to a document at all: the budget calendar in the footer does
  that, on every page of a book, hanging each file off the step of the year that
  produced it. On the budget half it
  carries what the page used to head itself with — the name (its only `<h1>`)
  and the fiscal year the book covers, from `src/lib/heading.ts`, which
  reads `page.data`. A section names the book before itself, as a link:
  `Haverhill Public Documents / 2027 Budget / Reserves`, which is `barOf`'s
  `trail` -- a section used to take the bar over, which named the page and lost
  the year it belonged to. Plain links rather than a second `<nav>`, since the
  bar already has one. a budget book is called `2027 Budget`, never "FY2027
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
- **`src/lib/BudgetBands.svelte`** is the reserves page's own chart, and the
  answer to what `BudgetStack` leaves out: each fund as a bullet column -- a
  pale rail the height of the largest ceiling, the band the policy allows drawn
  inside it, and the balance as a narrower bar rising from the foot. It runs
  down the left of that page, which is laid out as the book's front page is:
  charts left and along the top, the reading under them in the only box that
  scrolls. A section is normally a reading column, so `reserves` returns
  `wide: true` and `budget/+layout.svelte` gives it the book page's width. The three sit on one scale
  because they are measured against one thing: every policy is a percentage of
  general fund revenue less debt exclusion and Chapter 70, and each floor and
  ceiling the book prints implies that same $178,261,600 back to within $20,
  which `reserves/reserves.spec.ts` pins. Rows are named by their own dial
  table's first column, printed under the column; the book's cells for it --
  "Actual", "Anticipated", "Actual Balance" are three different words for the
  city's position and the book chose each one -- moved into a tooltip on hover
  or focus, the way a pie wedge names itself, once the columns sat beside the
  page's reading rather than under the window's full width and the cells cost
  more of it than three narrow columns had to give up; the column's accessible
  name still carries all three for a reader who never hovers anything. Free
  cash draws no bar at all this year, which is the page's story; stabilization's
  band has no closing edge, because its policy sets no ceiling.
- **`src/lib/BudgetLines.svelte`** follows a table's rows across the years it
  gives them for, and draws `history`: what the city took in and what it spent,
  from the top of page 18. That page is `/budget/fy2027/history`, titled
  `History/Forecasts`, and it holds the ten-year appropriation projection too,
  which was on `spending`: what decides whether a section belongs there is not
  its side of the budget -- everything is spending or revenue -- but whether it
  is about 2027 or about the years either side. It is not a section of the book,
  so it has no contents line and is reached from under the two columns on the
  front page; `spending` lists it at the foot and `reserves` no longer does. The years belong to the chart, not the
  series: each series gives one value per year and `null` where the book prints
  none, so a row the book is silent about for a year draws nothing there rather
  than shifting everything along. The expenditure line is drawn at what was
  spent, since the book's parentheses are its sum's minus sign, and the row
  labels stay the book's, "Plus" and "Less" included. It does not start at zero
  -- a line is read for its shape -- and prints the figures at the ends of the
  axis.
- **`src/lib/BudgetBars.svelte`** draws the other half of that table, on
  `reserves`, where it belongs -- the flows are the city's, the balance they
  left is the reserves page's subject. Each year is a row run off a vertical
  zero line, the undesignated fund balance to the right of it and that year's
  encumbrances to the left. Rows rather than columns because the chart sits
  beside its own reading now, in a column that is wide and short, and four
  years stacked as rows fit that shape where four side by side would not. Bars
  because these are four closes of business rather than a trend, and they
  start at zero because a bar's meaning is its length. 2022 is one of the
  four: the book gives it no "Ending Fund Balance" of its own, only the
  "Beginning Fund Balance" it lends 2023, and that used to read as a year with
  something missing -- an empty gap in a column, three full ones either side.
  A row does not: it is a whole line with one bar on it rather than half a
  column, which is what let 2022 back in once the chart turned on its side.
  Only the book's closing row is charted for 2023 through 2025: the opening
  row is the same figure a year earlier, so charting both would be one row
  drawn twice. Nothing is stacked either -- page 18 only reconciles with the
  encumbrance term in it, so the balance is already net of the bar beside it
  and a stack would draw the same money twice and put the end of a row at a
  total the book never states. The bars overlap instead: the first series is
  the thickness of the row, each one after it thinner and drawn in front, and
  every bar hangs off the zero line so the edge a reader measures from is
  exact. The book never says what the encumbrance reserve itself stands at,
  only what it moved by. A non-zero figure is never drawn thinner than two
  units, since the mark is a focus target too. It keeps its own viewBox and
  band geometry now rather than sharing **`src/lib/chart-frame.ts`** with
  `BudgetLines` -- that sharing was for when the two sat on one page and a
  reader looked straight down from a year in one to the same year in the
  other, which stopped being true once the flows chart moved to `history` and
  this one turned sideways.
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
  sides are the same size is the first thing to know about a budget.
  `spending` reuses the same component twice over: its own left-column bar
  is one row rather than two, and its capital-requests chart is five columns,
  one per year, each divided into that year's categories -- see `spending`'s
  own entry for `order` and `minHeight`, the two props that chart added.
  The component draws whatever `rows` it gets, so neither is a special case
  of it. A category
  page ends with **`src/lib/BookReferences.svelte`**, headed `References`: the
  pages of the book it was built out of, and then the parts it belongs with and
  does not carry, each linking to our page where one exists and to the city's
  PDF where it does not. It was "Elsewhere in the book", which named only the
  second half; `reserves` is the page with a full set, listing the four pages it
  transcribes one heading at a time rather than the single contents number that
  covers them. A segment names
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
  reserve dials (`reserves/tables.ts`) and the debt tables (`debt/tables.ts`);
  the dials and the debt-by-purpose list and the three debt policies are
  `unheaded`, meaning the book prints nothing over their columns and neither
  does the page, so their column names are handles for `column()` rather than
  transcription -- the two five- and eleven-year debt tables are not, since
  the book heads those with real years and names. The figures come from the
  book's page-78 tables, not its own revenue pie on page 65, which is $3,458,864
  short of the total it prints.
- **`debt`** (`/budget/<year>/debt`, `debt/tables.ts`) is `reserves` for what
  the city owes rather than what it holds: page 21 to 25, `wide: true`, a
  narrow left column and the reading in the only box that scrolls. It was
  `outstanding-debt` before it had a layout to share with `reserves` -- the
  route matches the one-word names the rest of the bar's sections carry, and
  the front page's own "Debt" bar already used the word. Its three policies
  never share one base the way the three reserve dials share general fund
  revenue -- a percentage of equalized valuation, of general fund revenue, of
  the debt itself -- so there is no dial chart here the way `BudgetBands`
  draws one; the left column instead draws page 21's list as one bar standing
  on end -- `BudgetStack`'s rail-and-segments idea turned vertical, written
  out in the page's own script since `BudgetStack` only lies flat, largest
  segment at the foot and named on hover or focus the way every chart on the
  site is. Two `BudgetLines` charts join it side by side across the top of
  the reading column instead of stacked, since neither is shaped like a
  bullet column: annual payments, on their own scale, and the per-capita
  comparison to the state average, which does share one scale because that
  is the book's own point in drawing it. Leftmost of the three, a card
  stands in for page 23, "Bond Rating": the rating itself, "AA", and the
  book's own attribution line, both bare facts rather than the two S&P
  quotes the page used to carry in full -- the card opens straight to page
  23 of the city's PDF, so a reader who wants S&P's own words gets them from
  S&P rather than a second copy of them here, and "Bond Rating" drops out of
  the References list below for the same reason a chart-linked section never
  keeps a contents line. The three policies are still three
  collapsed `<details>`, numbered "Policy #1" through "Policy #3" in the same
  voice `reserves`' four use and for the same reason: the book numbers them
  "#1", "#2a", "#2b" once and not at all a second time, so the summary's own
  count is what a reader compares four -- now three -- sections by, and the
  book's own label stays out of the quoted paragraph beneath. `debt.spec.ts`
  pins the three policies' figures and the arithmetic the payments chart
  depends on, the way `reserves.spec.ts` does for the dials.
- **`spending`** is `wide: true` too, for its left-column chart rather than a
  policy to keep or fail -- there is no accordion here the way `reserves` and
  `debt` each open with one. The reading itself is seven routes now, not
  five tabs a script switched: Goals & Recommendations, Capital Planning,
  Requests, Challenges, Budget in Brief, Council Orders, References, the
  book's own topics (References excepted -- it is ours) kept apart on
  screen, each its own directory under a `(tabs)` route group so a reader
  can link or bookmark straight into "Council Orders" the way every other
  write-up on the site is linked -- the reason for the change, and the reason
  it is a group rather than plain directories: `spending/(tabs)/+layout.ts`
  and `+layout.svelte` carry the title, width and the chart and nav that are
  common to all seven, and a route group is what lets `spending` itself sit
  outside that layout, since a bare visit there is not an eighth topic.
  Requests and Challenges were one tab, "Requests & Challenges", until pages
  72 and 73 -- two different accounts, not two halves of one -- were split
  the same way References was pulled out of the shared layout into its own
  tab: `BookReferences` used to render unconditionally after
  `{@render children()}`, under whichever of the (then five) topics was
  open, so six topics' worth of references arrived whether asked for or
  not; its own tab now answers only when opened, `spending/references`,
  `<BookReferences items={data.references} book={data.book} />` and nothing
  else on the page, `data` read off `+layout.ts`'s load the same as any
  other route beneath it. There is no bare `/spending` page any
  more, not even a forward: the one link to it, the front page's own chart
  heading, now goes straight to `spending/goals-recommendations`,
  `Router.spendingTab(id, slug)`, and nothing else pointed at the old bare
  URL. The nav between the seven is a plain `<nav>` of links,
  `aria-current="page"` marking the open one -- matched on whether
  `page.route.id` carries the slug as one of its own segments, never on the
  URL against a `Router`-built href, and never a plain substring either,
  since a route group's name sits in `route.id`
  (`/budget/fy2027/spending/(tabs)/goals-recommendations`) without ever
  reaching the URL. A segment match rather than only the last one is what
  lets Capital Planning's own item pages, a level deeper still, keep it
  marked current too. No script manages any of this: an ordinary navigation
  is what
  used to need a `live` flag and a hidden-markup fallback for a reader who
  had not hydrated, and Left/Right/Home/End is gone with it -- a plain link
  needs no keydown handler of its own, only Tab and Enter, which every
  browser already gives it. The left column is not a chart of its own: it is
  `BudgetColumns` handed one row instead of two, the same "Spending" column
  the front page draws, reading the same `SPENDING` and `SPENDING_TOTAL` from
  `spending/tables.ts` rather than building the composition a second time --
  one copy, so the front page's column and this page's bar cannot disagree --
  and carrying no `href`, since a bar linking to the page it is already on is
  that page offered twice; it sits in the shared layout, the same on every
  one of the five routes, and answers to none of them. "Capital Planning" is
  where a second `BudgetColumns` replaces page 29's own table, "5-Year
  Capital Requests by Category" -- at the top of that route, ahead of the
  book's own prose, so a reader lands on the shape of the five years first:
  five columns, one per year, each divided into that year's categories,
  "Grand Total" excluded as a category and read as each bar's own stated
  total rather than summed. A category keeps one colour and one band across
  every bar -- `order`, largest five-year total first, which is the prop
  that lets a column stack and colour by a fixed sequence instead of its own
  rank, since a reader tracking one category across five years wants it in
  the same place in every bar, not the front page's two-column case of
  picking each column's own largest first. `minHeight` is the other prop,
  overriding the `min-h-64` this component used to fix unconditionally --
  right for a full-height column, too tall for a chart sitting above a page
  of reading. The chart also leaves out two 2028 projects, $90,000,000 for
  JGW/Tilton and $30,000,000 for a new Fire Station -- 90% of that year's
  request and the reason every other year used to draw as a flat line
  against it -- subtracted from the Buildings segment and the bar's own
  total before either reaches `BudgetColumns`, and left untouched in
  `CAPITAL_REQUESTS` and the table below, which still carry both at their
  own rows. A second `BudgetColumns` sits beside the first, no `order` --
  one column, the two excluded projects themselves stacked to their own
  $120,000,000, which is what discloses them now: a bar a reader can hover
  or focus, not a note written out in prose beside the chart -- the note
  said exactly what the second bar draws, so once the bar existed the note
  was the same fact twice. `spending.spec.ts` pins `SPENDING_TOTAL`, checks
  the capital table against
  its own row and column totals, and pins the two excluded projects' figures
  against the book's own 2028 totals. Pages 30 to 35's own line-item tables,
  one per category below the chart, are tabbed in place -- the
  `live`/hidden-markup mechanism `spending`'s own topics used before they
  became routes, one level deeper: eight tables of one shape are facets of a
  single dataset rather than eight topics worth a route and a bookmark each.
  The book's own "Grand Total" row sits at the foot of the last table (a
  page-layout accident, not Vehicles' own total) and stays there rather than
  being pulled into a ninth table, since the chart above already reads the
  same figures off `CAPITAL_REQUESTS` directly. Pages 36 to 45 -- the same
  requests again, but only the ones the city actually asked for in 2027, each
  with the department's own case for it and the urgency it was given -- used
  to run as one long "2027 Capital Requests" section under the eight tables;
  each write-up is its own route now, `capital-planning/<item>`, and the row
  it belongs to in the table above links straight to it, which the section
  never let a reader do. Not every row links: only the ~40 with a 2027 ask
  have a write-up at all, and a row with none stays plain text. `<slug>` is
  built from the table row's own label, `sectionSlug`'s rule, rather than the
  write-up's -- the two occasionally spell a project differently ("Highway
  Administration Roof Replacement" in the table, "Admin. Roof Replacement -
  Highway" on its own page), and the table row is what a reader actually
  clicks. Both spellings stay exactly as the book prints them, on the page
  each belongs to; nothing here reconciles them. An item page carries none of
  its own chrome -- no heading override, no back link -- it is the write-up's
  `<h2>` (promoted from the book's own `<h4>`, since it is this page's own
  top heading now) and its two paragraphs, verbatim, sitting inside the same
  `(tabs)` layout every other spending route uses, which is what keeps
  "Capital Planning" marked current in the nav three levels up.
  `Router.capitalRequestItem(id, slug)` builds the link. "2027 Capital
  Funding Recommendation" and "Plan for Funding Major Capital Projects" sit
  above the eight tables now rather than below them -- the reading a reader
  wants before the detail, not after it -- and "What is OPEB?" is gone
  entirely: the paragraph beside it already names OPEB without needing the
  term defined, and the definition itself carried nothing the rest of the
  page depends on. "Preliminary Budget Goals for Fiscal 2027" and "Final
  Recommendations" moved onto `goals-recommendations` despite being page
  73's own text and not page 15's -- they are the book's lead-in to and
  close of "Other Budget Reductions to Create a Balanced Budget", necessary
  there only because the book is a straight run of pages with nowhere else
  to put either, but they are goals and their resolution, not a challenge,
  wherever the book happened to print them. That is also why the tab itself
  is renamed **Goals & Recommendations** (`goals-recommendations`, from
  `Goals`): "goals" alone no longer says what its last two sections are.
- **`src/lib/BudgetTimeline.svelte`** draws page 13, the budget calendar, as the
  footer of _every_ page of a book, fixed to the bottom of the window: a row of
  twelve boxes
  with a mark showing where today falls in the process. `budget/+layout.svelte` pads
  every book page by more than the footer is tall, since a fixed footer cannot
  push anything out from under itself. It is a drawing rather than a section of its own,
  and its entries are `budget-calendar.ts`, loaded by `fy2027/+layout.ts` so the
  footer sits under the sections as well as the front page — which is what lets
  the bar at the top carry no source link on any page. A box
  holds a date and a summary — the only text on these pages that is not the
  book's — and the book's own sentence comes up as a tooltip over the box on
  hover or focus, drawn outside the scrolling strip because `overflow-x` clips
  vertically too, and sits hidden in the box for a screen reader. Nothing else
  is in the footer: no label, no today's date, only the boxes and the mark. Two
  boxes carry a `PDF` link: a step that produced a document the city published
  hangs it there, so the budget book comes off "Final review" and the Council's
  appropriation orders off "Public hearings", the run of hearings the agenda of
  2 June sits inside. The book's box opens it at whatever page the reader is on
  — a section's own page, the front of the file on the book page — which is the
  deep link the bar used to carry as "Original Source". The stage the process has
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
