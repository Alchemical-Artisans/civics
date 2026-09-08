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
not survive `calendar:rebuild`. `schedule.json` and `glossary.json` are the two
files here no scraper writes.

**Site (`src/routes/`).** Fully prerendered — `src/routes/+layout.ts` sets
`prerender = true` for `@sveltejs/adapter-static`, so every `+page.ts` is a
build-time load. `src/lib/meetings.ts` turns `meetings.json` into what the site
shows: it drops undated records, collapses PDFs published under two media pages,
trims to the fields the UI needs, and groups the documents into meetings.

**No board's meeting schedule is a document.** Both are ordinary HTML on a page,
which is why the calendar could not see either while it read only the listing --
the scraper already fetched one of those very pages for its antiforgery token
and threw the rest away. The two differ in kind, and `schedule.json` keeps them
apart as `rules` and `calendars`. **Two boards print their dates**: the License
Commission's page carries a table headed `CALENDAR OF MEETINGS FOR 2026` with
all twelve in it, two columns, January beside July; the Conservation
Commission's meeting-schedule page carries eighteen, every three weeks on a
Thursday, in the _middle column_ of a table whose other two are the filing
deadline and the date a postponed meeting moves to -- taking the whole table
would treble that board's calendar, but a sitting keeps its row's other columns
as `related`, labelled by the board's own headers, and its meeting page states
them -- with the hour, 7:15 PM, in the paragraph above it. Nothing is interpreted and nothing can be misread; this is by far the
better evidence, every past date on both carrying documents, and the sittings in
the data that are not on them are special meetings and postponements. **The City Council prints a rule** above the document table:
every Tuesday at 7:00 PM, with exceptions for June, the summer, and the return
to weekly meetings in September -- which has to be read into dates.
`scripts/update-schedule.mjs` (`npm run schedule:update`, and a step of
`metadata:update`) scrapes both; `src/lib/schedule.ts` turns both into dates;
`withScheduled()` in `calendar.ts` adds a `Meeting` with `documents: []` for
each one no document covers, on the same board-and-date identity, so a date the
city has since published an agenda for is an ordinary meeting. This is what
shows a sitting **before** an agenda exists -- the only part of the site's data
that is not retrospective. A `ScheduledSitting` carries its evidence as a
discriminated `source`, `calendar` or `rule`, and the meeting page shows the two
differently: a board that prints its dates has stated _this_ one, where a rule
states a pattern the day falls under. An hour the source states pins the "add to
calendar" event; the Commission prints only dates, so those are all-day rather
than given an invented time. To add another board that prints its dates, add it
to `CALENDAR_PAGES` in `scripts/lib/schedule.mjs` -- URL, a `heading` pattern
capturing the year, and a `column` where the table holds more than sittings;
naming a column that is not there yields nothing rather than a guess. One that
prints a rule needs its wording read by hand in `schedule.ts`, never guessed at.
Only the rule's dates are capped at year end, being a projection; a published
date stands however far ahead it is, which is why the Conservation Commission's
last row puts 7 January 2027 on the calendar.

**Two clauses do not mean quite what they say, and the Council's published 2025
schedule settles both.** "The second Tuesday after Labor Day" counts the Labor
Day week's own Tuesday as the first -- Labor Day 2025 was 1 September, giving 9
September, and that sheet is headed "Amended - removal of 9/9/25 due to
municipal preliminary election", which only makes sense if 9 September had been
scheduled. And the summer's every-other-week run stops at the end of August, not
at the day weekly resumes: read literally it would add a sitting on 2 September
2025 and 8 September 2026, and the adopted schedule has neither -- the third
clause governs September and says the month's meetings _start_ with the second
Tuesday after Labor Day, so nothing precedes them.

**Forward only, and the entries are called expected, not scheduled.** The rule
is not the schedule the Council adopts: against the Council's own published 2025
schedule it yields 45 sittings to that schedule's 35 (it says "every Tuesday",
but the Council skips roughly one a month), and it wrongly drops 10 June 2025,
which the Council held. The printed calendars need none of this defence and
get the forward-only treatment for consistency. So sittings are projected from the build date to the end
of that year and never backwards -- for a day already past the documents are the
better authority, and a rule-Tuesday with nothing on it is far more likely to be
a Tuesday the Council never sat. Ahead of today there are no documents at all,
and a projection understood as one beats an empty calendar. Reading prose into
dates is a judgement, so `RULE_AS_READ` pins the exact wording it was made about
and `schedule.spec.ts` fails when the scrape drifts from it -- a reworded rule
stops the build rather than quietly putting meetings on the calendar the Council
never meant to hold. An expected sitting is a dashed outline with no `A`/`M`
letters and its own filter; the meeting page quotes the rule in full where the
agenda would be, and the hour it states lets a reader add the sitting to their
own calendar. See
[docs/calendar-page.md](docs/calendar-page.md#sittings-the-city-has-said-it-will-hold).

**The calendar opens on the month we are in, and every "today" is a date in
Haverhill.** `easternDate()` in `calendar.ts` is the only way one is computed:
`new Date().toISOString()` names tomorrow from eight in the evening here, which
rings the wrong cell and jumps a month at dinnertime on the last day of one.
`TIMEZONE` beside it is the site's one copy of `America/New_York`; `ics.ts` and
`router.ts` take it from there. Stored dates stay UTC-parsed `YYYY-MM-DD`
strings -- that is what stops one sliding a day; the zone only decides which day
_now_ is. The default month used to be the newest month covered, which the
forward projection turned into December; `calendar()` now returns the build's
date as `today` so the served HTML carries the right month and its mark, and the
component's `inTheBrowser` -- unset in both the server render and the client's
first -- fills in on mount as an ordinary reactive change rather than a
mismatch, the same bargain `BudgetTimeline` makes.

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

**`/` is the landing page** (`src/routes/+page.svelte`): the site's name and a
card for each half — the meeting calendar and the current budget book. It
forwarded straight to the budget for a while (an index costs a hop), which
stopped making sense once the two halves became separate things a reader arrives
wanting one or the other of; the old meta refresh and its e2e tests are gone.
The budget card's year comes from `fiscalYears().find((y) => y.written)`, so
creating `src/routes/budget/fy2028/` moves it; with no book written the card is
dropped. The header carries a link to each half from every page, so no page
needs its own sideways link. See
[docs/calendar-page.md](docs/calendar-page.md#the-site-root).

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
-- a document the calendar half already carries. None of its four orders are
quoted on `spending` any more: the enterprise orders' own totals are segments
of the spending bar and rows on the Departments tab instead of quoted text,
the general fund's own order -- the explanation for the gap against the
book's total -- is quoted on `revenue`, since it is that figure's revenue
side, and the snow-and-ice transfer is quoted on `reserves`, beside the free
cash policy it answers to. The front page just draws the budget.

**The budget is the same idea one level deeper, and shares nothing with the
calendar.** The bar's menu lists every fiscal year the city publishes — a book
here where one is written, the city's own PDF where it is not, and each year's
audit report beside it, which is the only place those are linked. `/budget`
itself is not a page: it was one, and reaching a book through it cost a hop.
`/budget/<year>` is a budget book's own table of contents -- two unheaded
lists, the year's own account in the book's order and a priced column of
everything the city funds, from the book's run of City Council to Library,
each line carrying what the book recommends spending on it and the list
running largest first -- and
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
  `Meetinghouse / 2027 Budget / Reserves`, which is `barOf`'s
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
  `spending` reuses the same component for its own left-column bar, one row
  rather than two. The component draws whatever `rows` it gets, so neither
  is a special case of it. Two props neither current chart passes any more:
  `order`, a fixed category sequence for stacking and colouring several
  same-shaped bars alike, for a chart that reads one category across
  several years -- nothing on the site charts more than a single year any
  more -- and `minHeight`, which overrides the height a full-height column
  fixes unconditionally, for a chart sitting above a page of reading rather
  than filling its own column -- "Budget in Brief" was the one page that
  needed it, until its own two charts were cut once the spending bar itself
  started drawing the department table they read from. A category
  page ends with **`src/lib/BookReferences.svelte`**, headed `References`
  (a `heading` prop turns that off, for the one page where the tab above it
  already says so -- see `spending`'s own entry): the
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
  the city owes rather than what it holds: page 21 to 24, `wide: true`, a
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
  site is. Page 22's five years of annual payments and page 25's eleven years
  of debt per capita against the state average were two `BudgetLines` charts
  here, cut along with the rest of the site's history and forecasts since
  this page describes 2027's own debt rather than the years either side of
  it -- `ANNUAL_DEBT_PAYMENTS` and `DEBT_PER_CAPITA` went with them, out of
  `tables.ts` and `debt.spec.ts` both, since nothing on the page read them any
  more. What is left of the top row is one card rather than three: the bond
  rating, page 23's "Bond Rating": the rating itself, "AA", and the
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
  `debt` each open with one. The reading itself is six routes now, not
  five tabs a script switched: Goals & Recommendations, Departments,
  Capital Planning, Requests, Challenges, References, the
  book's own topics (Departments and References excepted -- both are ours)
  kept apart on
  screen, each its own directory under a `(tabs)` route group so a reader
  can link or bookmark straight into "Challenges" the way every other
  write-up on the site is linked -- the reason for the change, and the reason
  it is a group rather than plain directories: `spending/(tabs)/+layout.ts`
  and `+layout.svelte` carry the title, width and the chart and nav that are
  common to all six, and a route group is what lets `spending` itself sit
  outside that layout, since a bare visit there is not a seventh topic.
  "Council Orders" was a seventh topic too, ours, quoting the four orders
  of the Council's agenda of 2 June 2026 -- retired once all four had moved
  to the figure each belongs beside: the enterprise pair to the spending
  bar and Departments tab, the general fund's own order to `revenue`, and
  the free-cash transfer to `reserves`. `council-orders.ts` itself is
  untouched; only the tab that once quoted all four directly is gone.
  Requests and Challenges were one tab, "Requests & Challenges", until pages
  72 and 73 -- two different accounts, not two halves of one -- were split.
  Neither keeps the book's own top heading now, or Challenges' "Budgetary
  Challenges" / "Budgetary Challenges Continued": each tab already says what
  its page is, and repeating that in a heading under it said nothing new.
  "Major Budget Driver - Group Health Insurance" stays, since it names a
  topic the tab label does not. "Budget in Brief" used to be a seventh
  topic, Budget-in-Brief's own two `BudgetTable`s (pages 76-77's forty-four
  departments, page 78's fourteen categories) as two `BudgetColumns`
  bars -- cut once the shared spending bar itself moved from page 78's
  fourteen categories to the same forty-four-department table, and drew
  the identical breakdown one route over. `DEPARTMENTS` and `APPROPRIATIONS`
  stay in `spending/tables.ts`, still read for `SPENDING` and
  `SPENDING_TOTAL`; neither is rendered as its own table or chart any more.
  "Departments" took its slot back once the bar itself turned out to have
  a readability problem of its own: forty-two segments on one scale puts
  Senior Center's $14,500 at a fraction of a pixel, too short to read or
  land a mouse on. `departments/+page.svelte` draws `SPENDING` again, as a
  plain table rather than a chart -- one column of figures, largest first,
  same rows and same order as the bar -- so every department the bar
  carries is also somewhere a reader can just read it. One table now, not
  two charts, since there is only the one bar left to explain, and it sits
  second, right after the goals, rather than back in Budget in Brief's old
  slot next to Challenges -- it is a figure the bar already draws on every
  route, not a topic with a page range of its own to sit in order by.
  Neither Capital Planning nor Departments carries a heading any more,
  for the same reason Requests does not: each is already this tab's own
  name in the nav above it, so a heading repeating it said nothing new.
  References was pulled out of the shared
  layout into its own tab the same way: `BookReferences` used to render
  unconditionally after
  `{@render children()}`, under whichever of the (then five) topics was
  open, so six topics' worth of references arrived whether asked for or
  not; its own tab now answers only when opened, `spending/references`,
  `<BookReferences items={data.references} book={data.book} heading={false} />`
  and nothing
  else on the page, `data` read off `+layout.ts`'s load the same as any
  other route beneath it. `heading` is new on `BookReferences` itself,
  defaulting to shown -- `debt` and `reserves` each title the whole page
  something other than "References", so the heading there is not the
  redundant one -- and false only on this one tab, the same
  no-repeated-heading rule reaching one component deeper. There is no bare
  `/spending` page any
  more, not even a forward: the one link to it, the front page's own chart
  heading, now goes straight to `spending/goals-recommendations`,
  `Router.spendingTab(id, slug)`, and nothing else pointed at the old bare
  URL. The nav between the six is a plain `<nav>` of links,
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
  one of the six routes, and answers to none of them. "Capital Planning"
  used to open with a second `BudgetColumns` in place of page 29's own table,
  "5-Year Capital Requests by Category" -- five columns, one per year, plus a
  second bar for two 2028 projects ($90,000,000 for JGW/Tilton and
  $30,000,000 for a new Fire Station) the first left out because they set the
  scale every other category and year was read against. Both charts are gone
  along with the rest of the site's forecasts and planning, and
  `CAPITAL_REQUESTS`, the page-29 table they read, went with them, out of
  `spending/tables.ts` and `spending.spec.ts` both, since nothing on the page
  reads it any more. Pages 30 to 35's own line-item tables, one per category,
  are tabbed in place below the prose -- the `live`/hidden-markup mechanism
  `spending`'s own topics used before they became routes, one level deeper:
  seven tables of one shape are facets of a single dataset rather than seven
  topics worth a route and a bookmark each. Each panel's own heading repeats
  its tab's label exactly ("Vehicles" over a tab already reading
  "Vehicles"), so it is hidden once `tablesLive`, the same no-repeated-
  heading rule the route-level nav follows, reached a level deeper --
  `display: none` rather than deleting the element, since the un-hydrated
  view this same markup renders has no tab bar at all, and the heading is
  what tells a reader stacked past six other tables which one they are on.
  Each keeps only its 2027 column
  now, and only the rows with a figure in it -- the book's other four years
  and the rows that belong to them alone, dropped with the rest of the site's
  history. The book gives eight of these tables, not seven: "Planning &
  Design" carries two line items, both 2029 requests, so trimmed to 2027 it
  has nothing to show -- not even a total the book prints as $0, since it
  prints none at all -- and it is left out of the tab set entirely rather
  than kept as an empty one. The book's own "Grand Total" row sits at the
  foot of the last table (a page-layout accident, not Vehicles' own total)
  and stays there rather than being pulled into its own table. Pages 36 to
  45 -- the same requests again, but only the ones the city actually asked
  for in 2027, each with the department's own case for it and the urgency it
  was given -- used to run as one long "2027 Capital Requests" section under
  the eight tables; each write-up is its own route now, `capital-planning/<item>`,
  and the row it belongs to in the table above links straight to it, which
  the section never let a reader do. Not every row links: only the ~40 with
  a 2027 ask have a write-up at all, and the trim to a 2027-only column left
  exactly those rows standing -- a row with no 2027 figure had no write-up
  either, so nothing here dropped a link the trim did not already drop the
  row for. `<slug>` is
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
  above the seven tables now rather than below them -- the reading a reader
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
- **`revenue`** is `wide: true` and eight routes under its own `(tabs)` group,
  the same split `spending` got first and for the same reason: a reader wants
  to link or bookmark straight into "Tax Levy" the way every other write-up on
  the site is linked, and the shared layout's chart and nav are common to all
  eight rather than particular to one. "2027 Revenue Projection" (the book's
  own first heading on page 48) opens it and carries no heading of its own,
  the same no-repeated-heading rule `spending` established; "State Aid", "Tax
  Levy" and "Local Receipts" are that same page-48 document split into its own
  sub-topics. "State Aid" and "Local Receipts" keep their own book headings,
  since neither repeats its tab label; "Tax Levy" is cut down to its one
  table, "Illustration of Levy Limit Calculation and Usage" -- the book's own
  lead-in (what a levy is, what Prop 2 1/2 limits, inflation's strain on it)
  read as generic DOR/MMA background on a first read, true of any city's book
  in any year, while the table is Haverhill's own math: its 2027 column is
  where $146,107,374 -- the same figure page 78 prints as this book's own Tax
  Levy, charted on the front page, the revenue bar, and the Summary tab --
  comes from, and 5a even names a specific local borrowing, "Consentino". The
  table's own caption went with the prose, for the same reason: "Illustration
  of..." was the phrase reading as a stock example rather than the city's own
  figures. "Local Receipts" tabs its own seven category tables (Local Excise
  Taxes, Other Local Receipts, Fees, Department Revenue, License & Permits,
  Fines & Investments, Other Available Revenue) in place below the shared
  intro, the same `live`/hidden-markup mechanism `spending`'s own Capital
  Planning tab uses for its own seven category tables -- each keeps its own
  book heading and prose, unlike Capital Planning's bare tables, but the
  reason is the same: seven facets of one page's worth of receipts, not
  seven topics worth a route and a bookmark each. Each panel's own heading
  repeats its tab's label exactly, so it is hidden once `tablesLive` --
  `display: none`, not deleted, so the un-hydrated view still has it and a
  reader stacked past six other categories can tell which one they are
  reading -- the same no-repeated-heading rule the route-level nav follows,
  reached a level deeper, and the same fix Capital Planning's own seven
  tables got on `spending` for the identical redundancy. "Summary" is page
  64 with
  the 10-year forecast of page 67
  behind it; "Budget in Brief" is page 78's revenue table, page 79's tax bill,
  and order 13.3 ("What the Council Raised"), which sits here rather than
  anywhere else on the page because it reconciles against the same
  $285,272,159 this tab's own table states. "Revenue Sources" is ours, the
  same reason "Departments" is on `spending`: the revenue bar has fifty-four
  segments once every source table the book gives (state aid's six Cherry
  Sheet lines, excise, fees, department revenue, license & permits, fines &
  investments, each opened out of the finer table pages 48 to 63 give it
  rather than left at page 78's fourteen coarse rows) is charted, and
  Constable License Fee has nothing to chart at all this year while Farm
  Animal Excise's $1,500 is a sliver of Tax Levy's $146,107,374 -- too short a
  segment to read or land a mouse on. `sources/+page.svelte` draws
  `REVENUE_DETAIL` again as a plain table, largest first, the same rows and
  order as the bar, and sits second, right after the opening narrative, the
  same slot "Departments" took on `spending`. `REVENUE_DETAIL` and
  `REVENUE_TOTAL` live in `revenue/tables.ts` next to the seven new source
  tables (`STATE_AID`, `EXCISE`, `OTHER_LOCAL_RECEIPTS`, `FEES`,
  `DEPARTMENT_REVENUE`, `LICENSE_PERMITS`, `FINES_INVESTMENTS`) it is built
  from, read by this page's own bar, the front page's revenue column, and the
  "Revenue Sources" table alike -- one copy, the same reason `SPENDING` and
  `SPENDING_TOTAL` sit in `spending/tables.ts` rather than being assembled
  separately by each of their own three consumers. "Fire" names a row in both
  `FEES` and `LICENSE_PERMITS` -- a fee for a detail and a fee for a license --
  so `REVENUE_DETAIL` renames each to "Fire Fee" and "Fire License" for the
  chart; the tables `<BudgetTable>` still renders on the page keep the book's
  own unrenamed "Fire" in both. `revenue.spec.ts` proves every source table's
  Grand Total against the coarse page-78 row or rows it replaces, the same
  check `spending.spec.ts` runs for `DEPARTMENTS` against `APPROPRIATIONS`.
  References is last, the same tab-of-its-own `spending` uses, listing
  "Spending" and "Fiscal Reserves" -- the other two buckets this page's own
  prose discusses (the free-cash paragraphs under "2027 Revenue Projection",
  the general-fund reconciliation under "Budget in Brief") without being this
  page's own subject.
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
