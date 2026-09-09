# The calendar page

Route: `/calendar`. Files:
[`+page.ts`](../src/routes/calendar/+page.ts) (build-time data),
[`+page.svelte`](../src/routes/calendar/+page.svelte) (UI),
[`src/lib/meetings.ts`](../src/lib/meetings.ts) (turning `meetings.json` into
what the site shows), [`src/lib/schedule.ts`](../src/lib/schedule.ts) (the
sittings a published schedule lists), and
[`src/lib/calendar.ts`](../src/lib/calendar.ts) (pure helpers).

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

## Sittings the city has said it will hold

**Neither board's schedule is a document.** Both are ordinary HTML on a page,
which is why the calendar could not see either while it read only the listing —
and the two say it in quite different ways.

**Two boards print their dates**, and each prints them differently.

The **License Commission**'s
[page](https://www.haverhillma.gov/government/boards-committees-and-commissions/license-commission/)
carries a table headed `CALENDAR OF MEETINGS FOR 2026` with all twelve in it,
two columns wide — January beside July — and nothing but dates in it.

The **Conservation Commission**'s
[meeting schedule](https://www.haverhillma.gov/government/boards-committees-and-commissions/conservation-commission/meeting-schedule/)
carries eighteen, every three weeks on a Thursday, in the **middle column** of a
table whose other two are the filing deadline for permit applications and the
date a postponed meeting moves to. Both of those are real dates and neither is a
sitting; taking the whole table would treble the board's calendar. But they are
what the board published about the day, so a sitting keeps its own row's other
columns as `related`, labelled by the board's own headers, and the meeting page
states them. The paragraph above the table gives the hour, 7:15 PM.

Nothing needs interpreting for either and nothing can be misread: the dates are
the dates. This is by far the better evidence. Every past date on both carries
documents, and the handful of sittings in the data that are _not_ on them are
special meetings and postponements — the Commission's own 20 May and 18 June,
the Conservation Commission's 21 May and 11 June, the last two of which appear
in its postponement column and whose agendas say "Postponed from" in their
titles. Exactly what one would expect.

**The City Council prints a rule.** The listing page carries it in the section
directly above the document table:

> Regular meetings of the City Council shall be held every Tuesday at 7:00
> o'clock P.M. except in:
>
> - June there shall be a meeting on the first, third and fourth Tuesday ---
>   except when June has five Tuesdays then it will be first, third and fifth.
> - From July until the second Tuesday after Labor Day, the Council shall meet
>   every other week beginning with the second Tuesday of July.
> - In September, starting with the second Tuesday after Labor Day, the Council
>   shall return to its regular weekly schedule.

Either way, these show sittings the documents cannot: **a sitting that has not
happened yet has no agenda**, so a calendar built only from what the city has
published is blank from today forward — which is precisely the part a reader
wanting to attend one needs. It is the only part of this data that is not
retrospective.

`scripts/update-schedule.mjs` scrapes all three pages into
[`schedule.json`](../src/lib/data/schedule.json) — `rules` and `calendars`, kept
apart because they are different kinds of thing;
[`schedule.ts`](../src/lib/schedule.ts) turns both into dates; `withScheduled()`
in `calendar.ts` adds a `Meeting` with `documents: []` for every one no document
covers. Board and date are the identity, exactly as for a document, so a date
the city has since published an agenda for is an ordinary meeting and is left
alone — and a document for a date no calendar or rule named, like those special
meetings and postponements, is unaffected.

A `ScheduledSitting` carries its evidence as a discriminated `source`, `calendar`
or `rule`, and the meeting page shows the two differently: a board that prints
its dates has stated _this_ one, where a rule states a pattern the day falls
under. Flattening that into one sentence would overstate the Council or
understate the Commission.

### Forward only, and why

This applies to both sources, though it is the rule that needs it.

**The rule is not the schedule the Council actually adopts.** Checked against the
Council's own published 2025 schedule, the rule yields 45 sittings where the
adopted schedule has 35. It says "every Tuesday", but the Council skips roughly
one Tuesday a month — 21 January, 18 February, 22 April, 27 May, 14 October, 11
and 25 November, 23 and 30 December 2025 are all rule-Tuesdays the Council did
not schedule and published nothing for. It errs the other way in June: the rule
excludes 10 June 2025, and the Council met that day. (The one other divergence,
9 September 2025, is not the rule's fault — the Council scheduled it and then
amended it away for the municipal preliminary election.)

So sittings are projected **from the build date to the end of that year, and
never into the past**. For a day already past, the documents are the better
authority, and a rule-Tuesday with no agenda and no minutes is far more likely
to be a Tuesday the Council never sat than a hole in the record. Ahead of today
there are no documents to be the authority at all, and a projection understood
as one beats an empty calendar.

That is also why these entries are called **expected** rather than scheduled.
The city has announced nothing about a particular Tuesday. The Council has said
which Tuesdays it means to sit on, and this is that statement applied to a date.

### Adding a board

A board that prints its dates is one entry in `CALENDAR_PAGES` in
[`scripts/lib/schedule.mjs`](../scripts/lib/schedule.mjs): its URL, a `heading`
pattern whose one capture group is the year, and — where the table holds more
than sittings — the `column` naming the one that does. The first table after the
heading is the schedule; every **other** dated column of a sitting's row comes
back with it as `related`, labelled by its own header; and the prose between
heading and table is searched for an hour,
anchored on "at" so that the Conservation Commission's own "Filing deadlines are
11:00AM two weeks prior" cannot be read as a meeting time.

Naming a column that is not there yields nothing rather than a guess. Three date
columns and no way to tell which is the meeting is precisely the case where
guessing would put filing deadlines on the calendar as sittings.

A board that prints a **rule** instead needs its wording read into dates by hand
in `schedule.ts`, as the Council's was. There is no guessing at one.

### Two clauses of the rule have to be read against the evidence

The rule is prose, and twice it does not mean quite what it says. The Council's
own published 2025 schedule is what settles both.

**"The second Tuesday after Labor Day" counts the Labor Day week's own
Tuesday as the first.** Labor Day fell on 1 September 2025, so this gives 9
September — and the published sheet is headed _"Amended - removal of 9/9/25 due
to municipal preliminary election"_, which only makes sense if 9 September had
been scheduled to begin with. What the amended sheet prints for September,
16/23/30, is exactly what is left.

**The summer's every-other-week run stops at the end of August**, not at the day
weekly resumes. Read literally, "from July until the second Tuesday after Labor
Day … every other week" would add one more fortnightly sitting in early
September — 2 September 2025, 8 September 2026. The adopted 2025 schedule has no
such sitting: its run ends on 19 August and September begins at the return to
weekly. The third clause is why. It governs September and says the month's
meetings _start_ with the second Tuesday after Labor Day, so nothing in
September precedes them.

### The wording is pinned

Reading prose into dates is a judgement, and it is only valid for the sentences
it was made about. `RULE_AS_READ` in `schedule.ts` holds the exact wording the
date logic was written against, and `schedule.spec.ts` fails when the scrape no
longer matches it. `schedule:update` prints a warning to the same effect. A
reworded rule therefore stops the build rather than being quietly misread into
meetings the Council never meant to hold.

### What the reader sees

On the grid, an expected sitting is drawn as a **dashed outline** rather than a
filled chip, and carries none of the `A`/`M` letters — the city has published
nothing for it, and an entry that looked like one carrying an agenda would claim
more than the rule says. Its accessible name reads `, expected; no agenda
published yet`.

It has its own filter beside Agendas and Minutes rather than joining them: the
kind toggles hide documents, and a sitting with no documents has no kind to
filter on.

On the meeting page the evidence takes the row the agenda would occupy, linked
to the page it is printed on and named for what it is — the board's own heading
for its list of dates, or "the ⟨board⟩'s meeting rule". The page below shows it:
a rule is quoted in full, clause by clause, since it is the city's own wording
and quoting beats paraphrasing; a printed calendar is cited by its heading, and
where the board's table gives other dates against the sitting they follow as a
`<dl>` under its own labels — `Submittal Date`, `Postponement Date`.

An hour the source states becomes the header's `MeetingDetails`, which is what
lets a reader add the sitting to their own calendar before an agenda exists. The
Council's rule gives one and so does the Conservation Commission's page; the
License Commission's table gives only dates, so those get an all-day event
rather than an invented time. No source gives a room — the Conservation
Commission's page names one, City Hall Room 301, but a room needs a geocodable
address beside it to be worth linking and that would be ours rather than the
city's — and the room on a board's last agenda is not evidence about a sitting
that has not happened.

The footer says how many are shown and what the number does and does not mean.

### The month it opens on

**The calendar opens on the month we are in.** It used to open on the newest
month it covered, on the reasoning that a prerendered page cannot know the
reader's date without a hydration mismatch. Two things changed that: the rule
now projects sittings to the end of the year, so the newest month covered is
December and opening there would land every reader in a month of empty
Tuesdays; and the mismatch is avoidable.

`calendar()` returns the build's own date as `today`, so the served HTML already
carries the right month and its today mark — a reader running no script gets the
current month, not the oldest one. The component holds the reader's date in
`inTheBrowser`, unset in both the server render and the client's first render,
so the two agree; `onMount` fills it in, which is an ordinary reactive change
rather than a mismatch. This is the same bargain
[`BudgetTimeline`](../src/lib/BudgetTimeline.svelte) makes for its today mark.
A build older than the month it ran in serves a stale month for one frame and
corrects itself.

The month is clamped into the months the calendar covers, because `step()` and
the Prev/Next buttons work off `months.indexOf(month)` and need a real index.

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
`withScheduled()` then adds the sittings the Council's rule expects and no
document covers — see above.

The result: 282 records become 276 documents in 166 meetings, with `undated`,
`duplicates`, and `flagged` counts passed alongside for the footer.

The work is in `src/lib/meetings.ts` rather than in the route, because each
meeting page needs the same list built the same way.

## Payload

The dataset ships as a route-level JS chunk, loaded only when someone visits
`/calendar`. It grew a great deal when the city's two archives and the two
boards that keep their own pages were added: from ~276 documents to ~2,200, and
from ~16KB gzipped to **~81KB** (1.2MB raw). The prerendered HTML is ~42KB,
containing the current month's markup.

That is still small enough to keep every month client-side, which is what makes
month navigation and filtering instant with no further requests — but it is no
longer negligible, and it is the number to watch. If it doubles again the answer
is to split the payload by year rather than to drop months: the archive is the
point of having it.

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
| `showExpected`                | whether sittings the Council's rule expects are shown        |
| `inTheBrowser`                | the reader's own date, filled in after mount                 |

Two details are deliberate:

**The kind toggles hide documents, not meetings.** A sitting with both an
agenda and minutes stays on the calendar when only one kind is showing, with the
hidden one dropped from its chip; a meeting left with nothing visible disappears
entirely. Hiding the whole meeting because one of its documents was filtered out
would be the wrong answer to "show me the minutes".

**The default month is the month we are in**, and the today mark is in the
served HTML. See [the month it opens on](#the-month-it-opens-on) for how that
avoids a hydration mismatch, and why the newest month covered is the wrong
answer now that the calendar projects forward.

**Every "today" on this site is a date in Haverhill, not in UTC.**
`easternDate()` in `calendar.ts` is the only way one is computed —
`new Date().toISOString()` names tomorrow from eight in the evening here, which
would ring the wrong cell and, now that the calendar opens on the current month,
jump a month at dinnertime on the last day of one. `TIMEZONE` lives beside it
and is the one copy of `America/New_York` on the site;
[`ics.ts`](../src/lib/ics.ts) and [`router.ts`](../src/lib/router.ts) take it
from there rather than keeping their own.

Note the distinction from the rule above: stored dates are `YYYY-MM-DD` strings
parsed with `Date.UTC(...)`, and that stays — it is what stops a stored date
sliding a day. The zone only ever decides which day _now_ is.

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

**The meeting page is the write-up.** A meeting somebody has transcribed has a
static route directory named for its id, which SvelteKit prefers over
`[meeting]`; everything else falls through to the generated one. Same URL either
way, so a calendar entry never has to know which it is, and clicking a meeting
lands on the agenda rather than on a list with one link on it.

The layout above both renders the header and, under it, every document the city
published for the sitting — each linking to the city's own file in a new tab
with `rel="external noopener noreferrer"` and visually-hidden text announcing the
new window. The one listing row with no `fileUrl` falls back to the city's media
page, `Router.cityPage(pageUrl)`. Minutes appearing in a later scrape show up
there without anyone touching a page; transcribing them means adding a section
to the meeting's write-up, not a second page beside it.

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
<a href={Router.meetingItem(m.id, item)}>…</a>
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

`/` is a landing page:
[`src/routes/+page.svelte`](../src/routes/+page.svelte) names the site, carries
a slogan, and gives a card for each half — the meeting calendar and the current
budget book. It prerenders to static HTML like the rest of the site.

**A card is its half rather than a description of one.** Both cards used to
carry a paragraph saying what was behind them, under a paragraph saying what the
site was for; all three were the site talking about itself to a reader who had
not been shown anything yet. What is there instead is a drawing:

- The **calendar card** shows the week the build ran in, a day to a row, with
  today's row ringed, the days behind it greyed the way the calendar greys a day
  outside the month it is showing, and each sitting drawn as the chip the
  calendar draws it as — filled where the city has published a document, a
  dashed outline where a board has only said it will sit. `weekOf` in
  [`src/lib/calendar.ts`](../src/lib/calendar.ts) gives the seven days;
  [`src/routes/+page.ts`](../src/routes/+page.ts) trims the calendar to them, so
  the page carries seven days of meetings rather than the whole record. Rows and
  not a Sunday-to-Saturday rail, which is how the calendar itself is laid out
  and was this card's first shape: a day cell in a rail is a seventh of half a
  page, and "Planning Board" arrives in one as "P…".
- The **budget card** shows the chart the book itself opens with — `BudgetColumns`,
  the two sides of the year on one scale — reduced to what a card can say. Each
  book carries its own `summary.ts` (see
  [`src/routes/budget/fy2027/summary.ts`](../src/routes/budget/fy2027/summary.ts)),
  which reads the same `SPENDING` and `REVENUE_DETAIL` the book's own front page
  draws in full and rolls each down to its largest three parts plus everything
  else, so the card and the book cannot state different figures. The front page
  globs `./budget/*/summary.ts` and takes the newest written book's, the same
  directory-listing trick everything else here follows. A legend names the
  segments, which the charts inside the book do without: there a segment names
  itself on hover, and this is the first thing on the site, read as often on a
  phone where there is no hover to give.

Both cards are one big link by way of the heading's own `::after` covering the
card, which is what lets the things inside them be links too — a card wrapped in
an `<a>` could hold no meeting link at all, and a week whose sittings cannot be
opened is a picture of a calendar rather than a way into one.

**A mostly empty week is the ordinary case and is drawn as one.** Haverhill's
boards sit once or twice a week and the projection of expected sittings runs
forward only, so the days behind today carry documents and nothing else. The
point of showing the week is that a reader can see which days those are.

It forwarded straight to the budget book for a while, on the reasoning that an
index costs every visitor a hop — the same objection that turned the meeting
page into the write-up rather than a stop on the way to it. That held while the
budget was the whole point and the calendar a side door; it stopped holding once
the two grew into separate things a reader arrives wanting one or the other of,
and being dropped into the wrong one is worse than the hop. The old forward was
a meta refresh (never a 301, which browsers cache indefinitely, and never
SvelteKit's `redirect()`, which pushes a history entry the back button falls
back into) — gone now, along with the e2e tests that pinned its behaviour.

The budget card's destination is resolved, not written out.
[`src/routes/+layout.ts`](../src/routes/+layout.ts) takes the first fiscal year
`fiscalYears()` reports as written, newest first, with `written` derived from
the route directory existing — so creating `src/routes/budget/fy2028/` is the
whole act of moving it. If no book is written up at all the card is dropped
entirely; the header's menu of years, which links the city's own PDFs, is then
the only way into the budget.

### Getting between the two halves

[`src/lib/SiteHeader.svelte`](../src/lib/SiteHeader.svelte) sits above every
page: the mark, which goes to `/`, the page's own name where the page does not
head itself (see [budget-pages.md](budget-pages.md)), and each half of the site
at the right. The calendar is a link. So is the budget — it goes to this year's
book, the same place the front page's budget card points — with a menu of every
fiscal year the city publishes under it, because that list used to be a page,
`/budget`, and reaching a book through it cost a hop. The menu is also why no
budget page carries a way back up any more.

**The word and the caret beside it are two controls.** A word that navigates
cannot also be the thing you press to see a list, so the word is the link and
the caret is a `<button>` with `aria-expanded`. On a pointer the menu opens on
hover and the caret is barely needed; on a touch screen there is no hover to
give and the caret is the whole control, which is why it is padded out to a
thumb rather than drawn on the link.

**The hover is written twice, and only one of them is ever in force.** In CSS,
so a page that has not hydrated — or a reader running no script at all — still
gets every year the city publishes; and in the component, so the caret's
`aria-expanded` says what is actually on screen. `.budget-item:not(.live)`
hands the job from the first to the second the moment the component mounts,
which is also what lets Escape and a second press close a menu the pointer is
still sitting on: CSS `:hover`, left in play, would hold it open. The e2e suite
runs the no-script case in a context with `javaScriptEnabled: false` and the
touch case in one with `isMobile`, which is what makes `(hover: hover)` false.

The rest of the script is the habits a browser gives no menu for free: closing
on a press past it, on Escape, and once the reader has gone somewhere, since
SvelteKit navigates without replacing the bar.

The pages used to carry these links themselves — a line above the calendar's
heading pointing at the budget, another under the budget's table pointing back,
a third on the right of every budget book and section nav, and a "back" line at
the top of each book and section. That works until a reader is three levels down
a book. The header replaced all of them.

**The current section is matched on `page.route.id`, not on the URL.** The
obvious spelling — `page.url.pathname.startsWith(Router.budgetBook(id))` — is wrong
in a way that hides itself. With `paths.relative` on, `base` is a relative
prefix that differs per page during prerendering, so a Router-built href is
`./budget/fy2027` on one page and `../budget/fy2027` on another while the pathname stays
absolute: the comparison never matches and no prerendered page gets
`aria-current`. It then starts matching once the client takes over and `base`
goes back to `""`. A browser test notices nothing, because it waits for
hydration; the e2e suite asserts on the served bytes for exactly that reason.

## The document page

[`meetings/+layout.svelte`](../src/routes/calendar/meetings/+layout.svelte)
wraps every document page: a back link, the title, then a header, then the page
itself in a `prose` container. The header runs the title, with an information
icon beside it where the document carries standing boilerplate; then board, kind
and date, with an **Add to calendar** control beside the date; then where the
meeting is held, linked to a map, and `Remote Access`, linked to the join URL —
with the meeting ID and passcode beside it where the document prints them; then
the links to the city's own copy.

[`AddToCalendar.svelte`](../src/lib/AddToCalendar.svelte) offers the sitting two
ways, because no one format reaches every reader: a Google Calendar link, which
is a plain `<a>` and needs no script, and a `.ics` download for Apple Calendar
and Outlook, built in the browser on click. Both describe the one
`CalendarEvent` that [`ics.ts`](../src/lib/ics.ts) derives from the meeting and
its `MeetingDetails`, so they cannot drift apart. When the agenda states a start
time the event is pinned to it in `America/New_York` (the `.ics` carries the
matching `VTIMEZONE`) and runs two hours — a default, not a figure from the
document; when it states none, the event is all-day on the meeting date.

[`Note.svelte`](../src/lib/Note.svelte) is that icon. It pops the text over the
page rather than expanding, so opening it never moves the agenda underneath, and
it positions against its parent rather than the icon so the panel stays inside
the content column on a narrow screen. The icon is Material Symbols
`info-outline-rounded`, pulled in through Iconify's **offline** component: the
default one takes an icon name and fetches the artwork from `api.iconify.design`
at runtime, which would put a CDN round-trip in front of a page that is
otherwise entirely self-contained.

That header draws on two sources.
[`+layout.ts`](../src/routes/calendar/meetings/+layout.ts) supplies the sitting,
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
PDF, and `/calendar/meetings/<id>` renders the generated page for them —
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
results, unchecking agendas drops the document count without dropping the
meetings that still have minutes, the calendar opens on the current month (with
a case running `javaScriptEnabled: false`, so the served bytes are what is
checked) and rings today's cell by Haverhill's date rather than UTC's, and an
expected sitting is drawn as an outline and hidden by its own toggle. Which sitting that is comes from
`expectedSittings()` against `meetings.json` — the same derivation the site
makes — so the test follows the data rather than pinning a date the city may
publish an agenda for tomorrow.

[`meetings/page.svelte.e2e.ts`](../src/routes/calendar/meetings/page.svelte.e2e.ts)
covers the meeting pages, enumerating the written ones from the route
directories that exist: a written meeting is what the calendar lands on and has
a transcription on it, the board and date render with the city's files beside
them, a meeting nobody wrote up still lists its files, an item page sits beneath
its meeting and returns to it, the back link reaches the calendar, an unknown id
returns a 404, and an expected sitting quotes the rule it rests on in place of
files, states the hour the rule gives, and can be added to a reader's own
calendar.

[`src/routes/page.svelte.e2e.ts`](../src/routes/page.svelte.e2e.ts) covers the
root and the header: `/` is a landing page the reader stays on, with a card to
each half, and the mark leads back to it from anywhere.

The calendar suites assert on link attributes rather than following outbound
links, so the suite never fetches anything from the city's CDN.
