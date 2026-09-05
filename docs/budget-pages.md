# Budget pages

The budget half republishes the City of Haverhill's
[Budget and Audit Reports](https://www.haverhillma.gov/government/budget-and-finance/financial-reports/budget-and-audit-reports/)
page: every Mayor's budget and audited financial statement back to FY2006. The
city's page is a flat list of 44 PDF links with no way in but downloading a
whole book, so this one turns the newest book into pages a section at a time.

The shape mirrors the calendar one level deeper, except that the budget has no
page at its root:

```
/calendar                          the menu of years in the bar
/calendar/meetings/<id>            /budget/<year id>
/calendar/meetings/<id>/<item>     /budget/<year id>/<section>
```

**There is no `/budget`.** The list of fiscal years was a page once, and every
reader who wanted a book paid a hop through it to get there; the same
twenty-two years are now the menu under **Budget** in the bar at the top of
every page — the word itself links to this year's book, and the caret beside it
is what opens the menu where there is no pointer to hover with — `src/lib/SiteHeader.svelte`, from `budgetYears` on the root
layout's load. A year written up here links to its book, a year that is still
just a PDF links to the city's file, and each year's audit report hangs off the
end of its row, which makes the menu the only place on the site those are
linked at all. Because the menu reaches any book from anywhere, no budget page
carries a way back up: a book and a section each used to open with a "back"
line, and both are gone.

## Where the list comes from

`src/lib/data/budget.json` is committed and written by `npm run budget:update`
(or `metadata:update`, which runs it alongside the calendar). The same
arrangement `meetings.json` has: scraped ahead of time on a developer's machine,
reviewable as a diff, and baked into the build.

The scrape is [`scripts/lib/budget.mjs`](../scripts/lib/budget.mjs), and it is
much simpler than the meeting listing next door — one ordinary HTML page, no
Umbraco endpoint, no per-document page to resolve. What makes it fiddly is that
the markup carries no structure: the years are not rows or list items, the city
pastes them into a handful of `<p>` blocks, and eleven consecutive years share
one of those. So the parse flattens the page to a run of text and links and
segments it on `FY####` markers, which is the only thing that reliably separates
one year from the next. A link can carry its own marker — FY2027's whole label
sits inside the anchor, unlike every other row.

Two guards matter:

- **A parse returning fewer than twenty years throws.** The city adds a year at
  a time and has never removed one, so a short parse means the markup changed
  shape. Without the guard a redesign would quietly replace the data file with
  an empty list and the site would build fine with nothing on it.
- **A link that is neither budget nor audit is reported, not dropped.** If the
  city starts publishing a third kind of report, the run says so instead of
  silently ignoring it.

This list was typed out by hand at first, on the grounds that twenty-two rows
changing twice a year were not worth a scraper. That was true right up until the
point where somebody had to remember to do it: a hand-kept list is only correct
while someone is checking the city's page against it, and nobody was. When the
scraper was written it reproduced the hand-typed array exactly — all
twenty-two years, every URL — which is the only reason to trust it against a
list that had never been verified either.

A year with no link behind one of its two reports gets `null`, which is a real
state rather than an omission: the city prints "Mayor's Budget" as plain text
for FY2022 and FY2023, and lists no audit for a year it has not finished
auditing.

## Why FY2027 is transcribed rather than extracted

Most of the corpus has a text layer. The FY2027 book does not: it is a Canva
export flattened to page images for "electronic distribution", so `pdffonts`
reports no fonts and `pdftotext` yields 245 blank pages. Every section under
`fy2027/` was read off the rendered pages by hand. FY2025 and FY2026, and all
the audit reports, do have text layers if they are ever written up.

## What names a budget page

Nothing on a budget page heads it. The bar across the top of the window does:
what the page sits inside, the page's name, and the fiscal year the book covers.
A book page was spending four lines on a heading, a date line and a link above
the two charts anyone came for, and the bar was already there saying where the
reader was.

**A section names the book before it names itself.** The bar reads "Haverhill
Public Documents / 2027 Budget / Reserves", and the middle of it is a link to
the book. A section used to take the bar over entirely — "Haverhill Public
Documents / Reserves" — which named the page and lost the thing it was part of:
nothing said which year's reserves those were, and the only way back to the book
was the bar's own menu of years. `barOf` returns that as `trail`, outermost
first; a book's own page has none, being the thing. They are plain links rather
than a `<nav>` and a list — the bar already carries one navigation landmark, for
the two halves of the site, and a second holding a single link is more for a
screen reader to walk past than it is worth.

**The bar links no document, on any page.** It carried an "Original Source" to
the city's file, and anything else a page named in its own `sources`; both are
gone. A link in the bar could say only that the page came from somewhere. The
budget calendar in the footer says which step of the year produced each
document, it is under every page of a book, and the book's own box opens the
file at whatever page the reader is on — so every document is reachable from
anywhere in the book, presented the one way. `barOf` returns a name and a date
line and nothing else; see the calendar below.

[`src/lib/heading.ts`](../src/lib/heading.ts) is where all three come from.
`page.data` is a merge of every load above the route, and which key holds what
depends on how far down the route is — a section names itself and gives its page
in its own `+page.ts`, the book is named by the layout that looked it up — so
the bar asks `barOf(page.data)` and this answers. Off the budget half it answers
nothing, because the calendar still heads its own pages.

**A book is called "2027 Budget".** Not "FY2027 Mayor's Budget", which is how
the city files it: "Mayor's" distinguishes the book from nothing, since the city
publishes one budget for a year, and a reader who has never heard of the others
is left wondering which budget this is not. The fiscal year is the line beside
the name, which says the July-to-June the year means. Everything naming a book —
the bar, the tab, the way back up from a section, the fallback text on `/` —
says it through `bookName`.

## The charts on a book's front page

`/budget/<year>` opens on the budget at a glance: the year, and what the year
sits on.

| Chart             | What it draws                                         | From                                                     |
| ----------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| Spending, Revenue | two columns on one scale, each divided into its parts | page 78 and page 63, plus the orders of 2 June 2026      |
| Reserves and Debt | two bars on one scale, each divided into its parts    | page 17, `reserves/tables.ts`; page 21, `debt/tables.ts` |

The two columns are the year — everything the city spends, and everything that
pays for it — and sit in the narrow left column of the page.

**They are columns rather than pies because the first question about a budget is
whether the two sides are the same size**, and two circles cannot be compared by
eye. Side by side against one scale, the gap between the tops is the answer:
$316,044,835 spent against $310,893,296 that comes from somewhere. Reserves and debt are the standing position
underneath it, which is a different question, so they sit above the table of
contents rather than beside the pies. Both read their figures out of the
sections' own transcriptions; see "A section whose tables are charted" below.

**A pie, and the figures inside it.** The question a budget's front page
answers is what share of one pot each category takes, and a pie says "half of it
is schools" without the reader doing arithmetic. Hover a wedge, or tab to it,
and it names itself and prints its dollars and its share. Printing all fourteen
figures beside the drawing instead — which the page did briefly — spent the
width the book's own table of contents wants, and restated a table the contents
this chart's own heading opens: the figures are page 78, transcribed at the foot
of the appropriations and revenue pages.

**The heading carries the total, and nothing says where it came from.** It is
the same figure over both charts, so a line under each said it twice, and the
provenance is a contents line away rather than restated under every heading.

**This is the one page on the site with a script behind it,** because hover is
the whole feature. Nothing is lost without it: every wedge carries its label,
its dollars and its share as its accessible name, so a screen reader gets all
fourteen by walking them, and the transcription the contents links has every
figure as text. Every wedge is focusable, which is also the only way to reach the ones
drawn as a hairline — Senior Center's $14,500 is a fraction of a percent of
School Department's $136,998,618, too short a segment for a mouse to land
on.

**Colour is the category**, from a fixed order in the component, assigned
largest first. The order was checked with a palette validator rather than by
eye: every step clears the lightness band, the chroma floor, and 3:1 against the
page, and the closest adjacent pair under simulated deuteranopia is ΔE 6.3 —
inside the band that is allowed only where something other than colour
identifies the mark, which here is the label on hover and the white gap between
wedges.

The two pies are the same circle divided two ways — both tables come to the same
total — so they can be read against each other without any shared scale. The
debt pie is the same idea for a different pot: six purposes adding to the
$175,745,444 the section states in its own sentence, which `overview.spec.ts`
checks the six lines against.

**Reserves and debt are one chart on one scale, and it ignores the policy
bands.** [`src/lib/BudgetStack.svelte`](../src/lib/BudgetStack.svelte) draws a
bar per row, full width, each divided into what it is made of and each measured
against the longest — so $22 million of reserves is drawn as the eighth of $176
million of debt that it is, which is the only useful thing to do with the two
figures and needs no arithmetic from the reader. What the city is _allowed_ to
hold — a floor for each fund, a ceiling for two of them, a debt limit set in
statute — is what those sections are about, each bar's own name opens the
section it is drawn from, and drawing all of it here took more of the page than
the answer is worth. The three tracks-with-bands this started
as are in the history if a later year wants them back.

Colour restarts on each bar, as it does on each of the two pies: a bar is its
own whole, and running one sequence through both would hand the largest thing
the city owes a hue picked by what came before it. Hovering a segment fades the
others **in its own bar only** — the two bars are there to be compared, and
fading one of them defeats the chart.

**The total is arithmetic of ours.** The book never adds these three, and free
cash is certified out of the undesignated fund balance, so a year holding both
would count some of the money twice. This year's free cash is $0, which is what
makes the sum sound, and `overview.spec.ts` asserts exactly that — so the year
free cash comes back, the test fails and the sum gets looked at again rather
than quietly double-counting.

**The figures are in the segments**, the way the pies beside it work: hover a
segment or tab to it and it names itself and prints its dollars and its share.
Lines of legend under bars this small were more chrome than chart. A segment's
width is its share of the _scale_, which is what makes the bars comparable, and
the share it reports is of its _own bar_, which is the whole it is a part of.
Neither is the share of city revenue the book prints beside each reserve balance
— in a bar divided into parts a percentage reads as a part of the bar, and the
numbers are nothing alike; that one stays on the section's page beside the
policy it answers to.

A part worth nothing draws no segment, because there is no honest width for $0.
It keeps an `sr-only` line of its own, so walking the chart still reaches every
fund the book lists — every other figure is the segment's own accessible name,
so nothing here is only visible to a mouse.

**The totals are the chart's own arithmetic.** Each bar adds its parts up rather
than being handed a total beside them, so there is no second copy of a figure to
fall out of step; `overview.spec.ts` is where those sums are checked against what
the book states.

**Some contents lines are left out.** "Mayor's Budget Message" (page 2) and
"Budget Calendar" (page 13) have no page here — the message was dropped, the
calendar is the footer — and a line for a part of the book the site does not
carry is a line that sends the reader into the city's PDF instead. **Dropping a
page means dropping its contents line with it.**

"General Fund Budgets" (80) is left out for the opposite reason: it is the
divider the book prints before the department pages, carrying nothing but its
own title, and the right-hand list is what it announces.

"Organizational Chart" (216) and "Position Summary" (217) are left out on their
merits. The chart is worth reading and says nothing about the money; the
position summary counts the department pages' own staffing a second time.
Neither earns a line on a page about the budget, and both are still in the
city's file. **A contents line is a judgement about what belongs, not an index
of the book** — see the note on what this site is for at the top of
[CLAUDE.md](../CLAUDE.md).

"Fiscal Reserves" (17), "Outstanding Debt" (21) and "2027 Revenue Estimates"
(48) do have pages, and a chart is where each of them opens from: the two bars
carry their own names as links, and the revenue pie's heading carries the third.
A line in the contents as well would offer the same page twice on one screen.
The revenue section is routed at `revenue` and titled **Revenue** rather than by
the book's own name for it — a chart headed "Revenue" that opens
"2027 Revenue Estimates" reads as two different things, and the year is in the
bar above every page of the book anyway. It carries "2027 Revenue Summary"
(64), "10-Year Revenue Forecast" (67), page 78's revenue table and "2027
Estimated Tax Bill Impact" (79) as well — where the money comes from, rolled up,
carried out to 2036, and what it comes to for one household. The book prints the three across twenty
pages with other things between them, and a reader who wants to know about
revenue wants all three. Its page number is 48, the first of them, so the bar's
source link opens where the run begins.

**`spending` is the same idea on the other side**, opened from the other pie's
heading, and holds the two sets of goals (15 and 16), "Capital Planning" (28),
"2027 Budget Requests" (72) and "2027 Budget Challenges" (73), in the book's
order. The ten-year appropriation projection (69) used to sit here too, on its
own page, `history-forecasts` -- cut entirely along with the rest of the
site's history and forecasts, since it is about the years either side of
2027 rather than 2027 itself, which the rest of the book is about. It is
called **Spending** rather
than "Appropriations", which is the book's word and the exact one but which a
reader would have to look up before the page could tell them anything; the
prose on it still says it, and the glossary defines it.

Appropriation is the precise word for what is on that page, even where the page
is not called it:
an appropriation is the City Council's authorisation to spend a stated amount,
for a stated purpose, from a stated source, in one fiscal year, and nothing is
spent without one — which is why the appropriations table comes to the same
total as revenue. The sections are that authorisation from every side the book takes it
from: what departments asked to add to it (the requests are increments to
existing budgets, not money of their own), what had to come out of it to balance
and what is driving it up (the challenges),
and what the city wants to build or buy. The last of those is mostly **not** in this year's
appropriation at all: capital over $250,000 is borrowed, the page-78 table's
"Capital – Pay as you go" line is empty for 2027, and the funding decision was
postponed — capital reaches the operating budget years later as debt service.
Three lines of the appropriation itself are on that page too — Debt Service
(200), State Assessments (209) and Employee Benefits (211) — as links into the
city's file, because none is transcribed. "Budget Policies" (221) is listed with
them: it is the rules the year's spending is made under, and it pairs with the
reserve policies on `reserves`. They are a different kind of thing
from the four sections above them: those are accounts _of_ the year's spending,
and these are parts _of_ it, each a line in the page-78 table the pie is drawn
from. Page 78, which both pies are drawn from, is split the same way: "2027
Budget in Brief" is three tables and no prose, so its two spending tables are
two stacked-bar charts now, on `spending`'s own "Budget in Brief" tab (more
on those below, in the `spending` section), and its revenue table stays a
table, at the foot of `revenue`. The book prints the two sides facing each
other to show that they balance; the front page makes that point instead,
with two pies carrying the same total.

**The pies are the whole city's budget, not the book's.** The book's page-78
tables are the general fund, and the front page draws all of it — including
the state assessments ($10,271,435) and the overlay ($250,000), which
the Council never votes because nobody gets a choice about them: the
Commonwealth bills the city for charter school tuition, school choice, the MBTA
and the rest, and the assessors raise the overlay to cover the property tax
abatements the year will grant. Charged rather than chosen, but spent, which is
what a chart headed "Spending" is about. The spending pie draws it at
department granularity now, off pages 76-77 rather than page 78's own
category rollup, so the overlay is not a segment called "Overlay" at all —
it is "Other", the department table's own name for the same $250,000.

What the book leaves out is water and wastewater, and those come from the
Council's orders: **$14,805,633** and **$15,967,043** on the spending side,
their own revenue on the other.

**Free cash is not drawn as revenue.** The book's revenue table has one line
that is not this year's income — "OTHER AVAILABLE REVENUE SOURCES", which page
63 breaks into free cash ($5,150,000), an administrative overhead reimbursement
from the enterprise funds ($935,304), and Hospital Trust money that subsidises
Public Health ($125,000) — about half that department's own budget of $261,291. Free cash is last year's surplus, and counting it
would make the chart balance by hiding the thing worth seeing: the year does not
pay for itself. The Mayor's own third goal is to stop relying on it, and the
reserves bar shows the balance it leaves at $0.

The enterprise reimbursement is left out too, for a different reason: the two
departments are charted at what they are actually billed — $15,040,417 and
$16,666,024, the orders' own figures — and that money is inside those, on its
way to the general fund. A slice reading "Transfer From Enterprise" says less
than the water bill it is part of, and charting both would count it twice.

The trust money stays, as the one thing in that line that is outside income
arriving in the general fund. It is charted as **Hospital Trust**, which is the
name the book's prose gives it — "funding from the Hospital Trust fund, which
subsidizes the Public Health department" — rather than the "Transfer from Trust
& Agency" its table heads the row with. Both are the book's words; the chart
takes the one that names the money now that the bucket holds nothing else, and
the transcription keeps the table exactly as printed.

So the columns come to **$316,044,835** and **$310,893,296**, $5,151,539 apart:
the free cash, and the $1,539 by which the orders' reimbursement differs from
the book's May projection of it. `overview.spec.ts` holds both halves of that
down.

On the revenue side the two departments are net of what the same orders transfer
into the general fund — $234,784 and $698,981 — because those are already inside
the book's "OTHER AVAILABLE REVENUE SOURCES", the line the Council's own four
small sources add up to. Counting them twice is the one way these two circles
stop balancing.

The spending total is **stated rather than summed, and not read off the same
table the segments are**. `APPROPRIATIONS` and the revenue table both state
$285,272,159 for the general fund; the department table states $285,272,160
for the same money, a dollar over the figure the other two agree on. The
site takes the segments from the department table, for the granularity, and
the total from `APPROPRIATIONS`, for the agreement, so the pie's slices come
to a dollar more than its own heading — the same dollar the book's own
department table is over the rest of it. `overview.spec.ts` holds all of
this down.

None of that is on the front page. A pie is a shape for one question, and the
explanation belongs where a reader who wants it goes: the orders are quoted on
`spending`, in the agenda's own words, with what they leave out and why.

**The book is not the whole city, and the orders are how we know.** Water and wastewater
are enterprise funds — self-supporting, paid for out of what households are
billed rather than out of the tax levy — so they are appropriated in orders of
their own and appear nowhere in the book's $285,272,159. The Council's agenda of
2 June 2026 carries all three orders, and
[`council-orders.ts`](../src/routes/budget/fy2027/council-orders.ts)
transcribes them:

- **13.1** $14,805,633 to operate the Water Department
- **13.2** $15, 967,043 to operate the Wastewater Department (the space is the
  agenda's own)
- **13.3** $274,750,725 raised and appropriated for the general fund, funded
  from taxation and other receipts, free cash, water and wastewater receipts,
  and a transfer

Two things fall out of that. The enterprise departments are **$30,772,676**, a
tenth again of the general fund, which the book is silent about; and what the
Council votes is **$274,750,725** against the book's $285,272,159.
`overview.spec.ts` pins both, including the dollar of rounding the book carries
— which, as it happens, is inside the two lines that are dropped, so the eleven
that remain come to the order exactly.

Each order also appropriates an amount _inside_ the general fund funded from
that department's receipts — $234,784 and $698,981 — and those are rows of order
13.3, so the two bars count them once.

**The agenda is on the budget calendar in the footer**, on the run of public
hearings its meeting of 2 June falls inside, the same way the book hangs off the
step that produced it. The meeting is also on the calendar half of this site.

**`reserves` is the third bucket**, opened from the reserves bar, and holds
"Fiscal Reserves" (17) with "Liability, Overlay & Reserves" (213), "Fund
Accounting" (218) and "Financial Reserve Policies" (227) listed after it.

**One paragraph on `reserves` is not from the section it transcribes.** The
book's "Fiscal Reserves" runs City Reserve Policy #1, #3 and #4 and skips #2,
which reads on a page as a policy that went missing. It did not: #2 is the only
one of the four with no dial to draw, because it is not a band to sit inside but
what has to happen if the fund balance falls out of the bottom of #1's — "a plan
for specific expenditure reductions and/or revenue increases shall be submitted
to the City Council during the next budget cycle". The book states it in
"Financial Reserve Policies" on page 228, and that is where the page quotes it
from. That page numbers it "Reserve Policy 2"; the section it is missing from
would have called it "City Reserve Policy #2:" — two labels for one policy, and
neither is quoted below any more (see the next paragraph). It is the second of
the four sections because it is #1's consequence — the floor it names is #1's
own.

**The four policies are four `<details>`, closed until asked for.** The
reading used to run straight down the column when it was the only thing on the
page; it no longer is, and a fund's standing is the first thing a reader wants
from a column that now sits beside two charts rather than under them. A native
disclosure costs nothing to get that: closed by default, so the column opens
on four one-line summaries rather than four paragraphs to scroll past, and
open on request for a reader who wants the policy's own words.
`page.svelte.e2e.ts` opens one to check the words are still there and closed
to check the rest start that way.

**Each summary carries its own "Policy #", 1 through 4 — ours, not the book's.**
The book numbers these two ways across its two sections, as the paragraph above
says, so neither of its labels reads as one running count across all four. The
quoted paragraph beneath each summary drops the book's own label along with it
and opens on the policy's first word instead, since the number the reader wants
while comparing four sections is the summary's now rather than a label chosen
twice.

**Each summary carries a compliance mark**, computed from the same `bands`
`BudgetBands` charts — `standing` reads a policy's actual figure against its
floor and, where it has one, its ceiling, so the word in the summary and the
bar's own length can not disagree. Policy #2 sets no band of its own to read:
its mark is `trigger`, which is #1's standing turned into the question the
policy is actually about — whether the plan it names is currently owed. The
labels are kept to bare facts rather than a sentence, the way an accessible
name built from the book's own cells is elsewhere on this page: "Within
policy", "Below floor", "Above ceiling", "Triggered", "Not triggered". The
icons are Iconify's offline component, the same one [`Note`](../src/lib/Note.svelte)
uses for its own icon, so a reader's browser never has to reach
api.iconify.design to see a checkmark.

### The two charts on `reserves`

The front page draws the reserves as one bar, deliberately ignoring what the
city is _allowed_ to hold: the bands are this section's subject, not the front
page's. This is where they are drawn.

| Chart              | What it draws                                                                        | Where          | From                               |
| ------------------ | ------------------------------------------------------------------------------------ | -------------- | ---------------------------------- |
| The three policies | a bullet column per fund on one scale: the band it may hold in, the balance it holds | down the left  | the three dial tables, pages 17-20 |
| What they left     | rows on a zero line: the undesignated balance to the right, encumbrances to the left | across the top | page 18's bottom rows              |

**`reserves` is laid out as the book's front page is.** Charts down the left and
across the top, and the reading under them in the only box that scrolls: the
three policies are the page's answer — is each fund where it is supposed to be —
and a reader working down four sections of the city's prose is the reader who
wants that answer still in view. A section is normally a 48rem reading column,
so this one returns `wide: true` from its load and
[`budget/+layout.svelte`](../src/routes/budget/+layout.svelte) gives it the book
page's width instead; the prose keeps its own measure inside the scroll box,
which is `relative` for the same reason the front page's is — an `sr-only` note
with no positioned ancestor lays out against the page, which a scroller cannot
clip.

**One scale for the three policies, and it is not an assumption.**
[`BudgetBands.svelte`](../src/lib/BudgetBands.svelte) draws a pale rail the full
height of the largest ceiling, the policy's band inside it, and the balance as a
narrower bar rising from the foot — a bullet chart stood on end, which is what
the book's dial is trying to be. Three dials cannot be compared with each other at all: a needle halfway
round a small arc and a needle halfway round a large one look the same, and
there is no reading money off either. These three can be, because every one of
the policies is a percentage of the same figure — general fund revenue less debt
exclusion and Chapter 70 — and each floor and ceiling the book prints implies
that same $178,261,600 back to within $20. `reserves.spec.ts` checks all five
against each other; if they ever stop agreeing, one scale is the wrong picture
and the chart has to become three.

**No table on this page is printed any more.** The chart draws every cell of
them, and prints one beside its bar only once a reader asks — hovering or
focusing a column names it and gives up its actual, minimum and maximum the way
a pie wedge gives up its figures, which is what let the three columns narrow
once they sat beside the page's own reading instead of the full window. The
figures are still there for a reader who never hovers anything: each column's
accessible name carries all three. The four tables are still the transcription,
still in `reserves/tables.ts`, still what both charts and the front page's
reserves bar are drawn from, and every figure on the page is the accessible
name of the mark that draws it.

Nothing on the chart is written here. Each column is named as its own dial
table heads it ("Undesignated Fund Balance", "Free Cash", "Stabilization Reserve"),
and the three figures beside it are the book's cells printed as the book prints
them, shares and all — including the row label, which is not the same word
twice: "Actual" on the fund balance, "Anticipated" on free cash, which is a year
not closed yet, and "Actual Balance" on stabilization.

**The year's story is a bar that isn't there.** Free cash is anticipated at $0
against a floor of $3,565,232, so the middle column draws no bar at all under a
band it never reaches. The page says why in the city's own words — a winter of
$4.6 million in snow removal — and the chart says nothing the prose does not; it
just says it first, and next to the two funds that are inside their bands.

**Stabilization's band has no closing edge**, because policy #4 sets a floor and
no ceiling. The band runs to the top of the rail and the column prints no maximum:
the only honest thing to draw at a limit that does not exist is nothing.

**The bottom of page 18's table is cut, not charted.** It used to be drawn two
ways, split by subject across two pages: what three years left the fund
balance was here, as rows of bars off a zero line
([`BudgetBars.svelte`](../src/lib/BudgetBars.svelte)), and what came in and
went out each year was on `history`, as two lines
([`BudgetLines.svelte`](../src/lib/BudgetLines.svelte)). Both are three years'
movement rather than this year's own standing, so both are cut along with
`history` itself and the rest of the site's forecasts. `FUND_BALANCE_HISTORY`
went out of `reserves/tables.ts` with them, and `BudgetBars.svelte` and
`BudgetLines.svelte` are both deleted -- nothing reads either any more, and
neither did `chart-frame.ts`, which only `BudgetLines` used.

### The one chart on `debt`

`debt` (pages 21-24) is laid out as `reserves` is -- `wide: true`, a narrow
left column and the reading in the only box that scrolls -- and its three
numbered policies are three collapsed `<details>` for the same reasons
`reserves`' four are. It was `outstanding-debt` before it had a layout worth
sharing: the route matches the one-word names the rest of the bar's sections
carry, and the front page's own "Debt" bar already used the word for it.

**There is no dial chart here, because there is no one base to draw one on.**
`reserves`' three policies are each a percentage of the same figure, general
fund revenue less debt exclusion and Chapter 70, which is what lets
`BudgetBands` put all three on one scale. Debt's three policies are each a
percentage of a different base -- equalized valuation, general fund revenue,
the debt itself -- and the book gives none of those bases in dollars on these
pages, only the percentage each policy sets and the percentage the city
stands at. Giving `BudgetBands` a dollar floor or ceiling it would have to
invent was the alternative, and inventing a figure the book never states is
not a chart, so `debt/tables.ts`'s `DEBT_POLICIES` keeps the policies as bare
percentages instead, and the page reads them with its own `percent` rather
than `amount`, which is built to read a dollar figure out of a cell.

**The narrow left column draws what the debt is made of, standing on end.**
Page 21's list is one bar, the same rail-and-segments idea `BudgetStack`
draws for the front page's "Reserves and Debt", but turned vertical to sit in
the column `BudgetBands` occupies on `reserves` rather than lying flat the
way the front page's bars do -- so it is written out in the page's own
script rather than reusing `BudgetStack`, which only knows how to lie flat.
Largest first and drawn from the foot up: the same segment-hover pattern
every chart on the site uses, named and priced on hover or focus and nothing
printed until then, with "Long Term Debt" the one thing always on the page,
the way a `BudgetBands` column keeps its fund's name under the rail.

**Page 22's five years of annual payments and page 25's eleven years of
per-capita comparison to the state average were two line charts here,
side by side across the top of the reading column.** Both are trends across
several years rather than this year's own standing, so both are cut along
with `history` and the rest of the site's forecasts -- `ANNUAL_DEBT_PAYMENTS`
and `DEBT_PER_CAPITA` went out of `debt/tables.ts` with them, and out of
`debt.spec.ts` too, since nothing reads either any more.

**Page 23, "Bond Rating", is a card rather than a transcription -- the one
figure of the page, "AA", and the book's own attribution line, "S&P Global
Ratings April 1, 2026", both bare facts rather than sentences.** The two
paragraphs of S&P's own words the page used to carry are gone: the card
opens straight to page 23 of the city's PDF, `#page=23` and all, so a reader
who wants S&P's words gets them from S&P rather than from a second copy of
them here that could drift from the first. It used to lead a row of three;
with the two line charts cut it is the whole of the row, the one thing
above the reading besides the composition bar in the narrow column beside
it. "Bond Rating" is not in the page's own References list any more either
-- the same page offered twice on one screen, once as a card and once as a
line, is the same rule that keeps a chart-linked section off a contents
list.

**The three policies are still numbered "Policy #1" through "Policy #3", in
the same voice `reserves`' four use and for the same reason.** The book
numbers these "#1", "#2a" and "#2b" across two sections and never as a plain
run, so the summary's own count is what a reader compares three sections by,
and the book's own label -- "City Debt Policy #1:", "#2a:", "#2b:" -- stays
out of the quoted paragraph beneath, opening each on its own first word
instead. The compliance mark uses the same two words `reserves` settled on:
"Within policy" where the city is, "Below floor" or "Above ceiling" where it
is not -- `ceiling` and `floor` are two narrower functions than `reserves`'
one `standing`, since none of debt's three policies sets both bounds the way
a reserve can. Retiring debt is the one of the three currently below its
floor, 59% against a policy of 65%, which is the book's own "not currently on
track to achieve this financial benchmark" read as a mark rather than a
sentence.

`debt.spec.ts` pins the three policies' figures and the composition chart's
total against the section's own sentence -- the same role `reserves.spec.ts`
plays for the dials.

**"Fund Accounting" is listed twice, on `reserves` and on `debt`.**
It is the section that says these funds are separate things, which is what the
reserves page is about and what the debt page needs a reader to know: $92,212,944
of the $175,745,444 it draws was borrowed for water and wastewater, and is
serviced out of what households are billed rather than by the general fund,
whose own debt service for 2027 is $8,834,819. A see-also may appear on more than
one page where more than one page depends on it.

### Five routes on `spending`, and its two charts

`spending` has no policy to keep or fail, so it has no accordion the way
`reserves` and `debt` each open with one -- it is `wide: true` for the same
reason theirs are, a chart fixed in the left column, but the reading beside
it is five routes now rather than one long scroll or a script-driven set of
tabs: **Goals & Recommendations**, **Capital Planning**, **Requests &
Challenges**, **Budget in Brief** and **Council Orders**, the book's own
topics (pages 15-16, 28-45, 72-73, 76-78, and the Council's agenda, which is
ours rather than the book's) kept apart on screen the way they are apart in
the book, and now apart in the URL too -- `spending/goals-recommendations`,
`spending/council-orders`, each linkable and bookmarkable on its own, which
tabs a script switched never were. Every heading and table this page ever
carried is still exactly the prose and the tables it always was -- nothing
here paraphrases or retypes a word of it -- just moved into its own route
directory instead of sitting behind a panel a script showed and hid.

**Two exceptions to grouping by page range, both on Goals & Recommendations
rather than Requests or Challenges, even though both are page 73's own
text.** "Preliminary Budget Goals for Fiscal 2027" opens "Other Budget
Reductions to Create a Balanced Budget" and "Final Recommendations" closes
it -- a short recap of what the Mayor set out to do bracketing the section
that explains what had to be cut to afford it, and the resolution once the
cutting was done. Both were necessary where the book put them only because
the book is a straight run of pages with nowhere else to put them; page 73
has no way to reach back to page 15's goals, or to end anywhere but where
its own text runs out. The tabs read differently, and for a plainer reason
than page adjacency (Capital Planning sits between Goals & Recommendations
and Challenges in the nav, so the two are not even next to each other):
both passages are goals or their resolution, not a challenge, whatever page
the book happened to print them on. A reader after what the year set out to
do and what it landed on wants both in one place, and Requests and
Challenges no longer open or close with a goals recap or a resolution in
front of the cuts they explain. Nothing in the words changed, only which
tab holds them and what the tab is called -- "Goals" alone stopped saying
what its last two sections are once they landed on it.

**Requests and Challenges were one tab, "Requests & Challenges", until they
split into two.** Pages 72 and 73 are two different accounts -- what
departments asked to add to their budgets, and what had to come out of the
budget instead to balance it -- not two halves of one story, and a label
naming both was already a hint they wanted reading separately. Splitting
cost nothing structural: each keeps its own route under the same `(tabs)`
group, `spending/requests` and `spending/challenges`. Neither keeps the
book's own top heading any more, or two of Challenges' own three
subsections ("Summary Department Budget Requests" on Requests; "Other
Budget Reductions to Create a Balanced Budget" and "Budgetary Challenges" /
"Budgetary Challenges Continued" on Challenges) -- each is now exactly what
its tab already says, and repeating "requests" or "challenges" in a heading
under a tab of that name said nothing a reader did not already know. Only
"Major Budget Driver - Group Health Insurance" survives on Challenges,
since it names a specific topic the tab label does not.

**Budget in Brief holds two stacked-bar charts now, not two tables.** Pages
76 and 77 ("Summary of All Municipal Departments", split across two pages
purely for room, one table here) list forty-four departments; page 78 rolls
the same budget up by fourteen categories. Both used to run as
[`BudgetTable`s](../src/lib/BudgetTable.svelte); both are
[`BudgetColumns`](../src/lib/BudgetColumns.svelte) now, a single 2027 bar
apiece rather than the six years (2022 through 2027) each table used to give
-- cut along with the rest of the site's history, so there is no longer a
category to keep one colour across several bars for, and neither chart
passes `order`. Both totals are the book's own stated "Grand Total" row, not
summed, the same reason `SPENDING_TOTAL` is. The book gives each department
five columns beyond 2027 -- five other years, two average/annual percent
changes, the 2027 department request kept apart from what was actually
recommended, and that request's and the recommendation's own percent and
dollar change -- all dropped, since only the department's name and its 2027
dollars remain on the chart's one segment for it. Forty-four departments
cycles through the fourteen-colour palette more than three times over --
accepted rather than folded into an invented "Other" bucket the book never
states, on the same reasoning the front page's own Spending column now
rests on too: a segment's name is never colour alone, since every one
carries it as its own accessible name on hover or focus, focusable whatever
its width. The two charts stack nearly the same number of departments now
-- forty-four here against forty-two there, the front page's own two
missing only the four with no 2027 figure at all.

**References is the seventh tab and the one topic that is not the book's own:
what every other topic here was built out of, and the parts of the book they
sit beside.** It used to render unconditionally in the shared layout, after
`{@render children()}`, so it sat under whichever of the topics was open --
reachable without a click, but also arriving under six topics' worth of
content whether a reader had a question yet or not. Its own route now,
`spending/references`, holding nothing but
[`BookReferences.svelte`](../src/lib/BookReferences.svelte) itself
(`items={data.references}` and `book={data.book}`, read off the shared
`+layout.ts` load the same as any other route beneath it) -- exactly as
reachable, one click from any of the other six, and present only when
asked for.

**The seven sit in a `(tabs)` route group,
[`spending/(tabs)/+layout.ts`](<../src/routes/budget/fy2027/spending/(tabs)/+layout.ts>)
and
[`+layout.svelte`](<../src/routes/budget/fy2027/spending/(tabs)/+layout.svelte>),
because they share a title, a width, a chart and a nav that a bare visit to
`spending` itself is not one more of.** A route group's name is invisible in
the URL -- `spending/(tabs)/goals-recommendations` is still
`/spending/goals-recommendations` -- so the seven keep their plain,
linkable paths while the layout stays out of any page that is not one of
them. There is no bare `/spending` page any more, not even a forward: the
one link to it, the front page's own "Spending" chart heading, goes
straight to `spending/goals-recommendations` now
(`Router.spendingTab(id, "goals-recommendations")`), and nothing else on
the site ever pointed at the bare URL, so there was nothing left for a
forward to catch.

**The left column is not a chart of its own -- it is the front page's,
handed one row instead of two.**
[`BudgetColumns.svelte`](../src/lib/BudgetColumns.svelte) already draws
however many columns its `rows` prop gives it, so the layout passes the
single "Spending" column read out of `spending/tables.ts`'s `SPENDING` and
`SPENDING_TOTAL` -- the same two exports the front page's own column now
reads, rather than building the composition a second time from
`APPROPRIATIONS` and `council-orders.ts`'s `ENTERPRISE`. One copy, so the
front page's column and this page's bar cannot print totals that disagree.
It carries no `href`: the front page's column links here because it is
somewhere else, and a bar linking to the page it is already on is the same
page offered twice. It sits in the shared layout and answers to none of the
five routes beneath it -- always on screen, whichever one is open.

**The nav between the five is a plain `<nav>` of links, not an ARIA
tablist.** `aria-current="page"` marks the open one, matched on
`page.route.id`'s own last path segment -- never on the URL against a
`Router`-built href, the same reason `SiteHeader`'s own menu avoids that
comparison: with `paths.relative` on it cannot match during prerendering
and starts matching only after hydration, so the served markup and the
hydrated markup would silently disagree. Not a suffix match on the whole
id either, the way a page with no route group could get away with: a group's
own name sits in `route.id` exactly as it sits on disk
(`/budget/fy2027/spending/(tabs)/goals`) without ever reaching the URL, so
comparing the last segment alone is what survives the group being there at
all. Nothing here runs a script to work: an ordinary link needs no `live`
flag and no hidden-markup fallback for a reader who has not hydrated, the
way the old script-switched tabs did, and Left/Right/Home/End is gone with
them -- Tab and Enter are what a browser already gives a list of links, and
a custom keydown handler would only be reimplementing that.

**"Capital Planning" used to chart page 29, "5-Year Capital Requests by
Category", as one stacked bar per year -- five columns, one per year, each
divided into that year's categories -- plus a second bar beside it for two
projects the first left out of 2028, $90,000,000 for the JGW/Tilton School
core project and $30,000,000 for a new Fire Station, $120,000,000 of the
$125,002,000 the Buildings category totalled that year and 90% of everything
the city requested in 2028.** Both are trends across several years rather
than 2027's own request, so both are cut along with `history` and the rest
of the site's forecasts and planning. `CAPITAL_REQUESTS`, the page-29 table
both charts read, is cut with them, out of `spending/tables.ts` and
`spending.spec.ts` both -- nothing on the page reads it any more. The
paragraphs that followed the table in the book are untouched; they are the
book's own lead-in to the section as a whole; they say nothing about a
five-year shape that only the chart drew.

**Pages 30 to 35's own line-item tables, one per category, are tabbed in
place below the prose -- the mechanism the topics above used before they
became routes, brought back a level deeper.** Seven tables now, not eight:
each keeps only its 2027 column and the rows with a figure in it, the
book's other four years and the rows that belong to them alone dropped with
the rest of the site's history, and "Planning & Design" -- two line items,
both 2029 requests, nothing for 2027 at all, not even a total the book
prints as $0 -- is left out of the tab set entirely rather than kept as an
empty one. The `live`/hidden-markup handoff is identical to the one
`spending`'s own topics carried and `SiteHeader`'s menu still does:
`tablesLive`, `false` until the component mounts, is what a CSS rule hiding
six of seven panels is keyed on, so a reader who never hydrates gets all
seven tables stacked, exactly as this page rendered before tabs existed at
either level. Left/Right/Home/End move the same way the route-level tabs'
keyboard handling did, since a script switch still wants that pattern even
where a route doesn't need one at all. The book's own "Grand Total" row --
the categories summed for 2027, not a total _of_ "Vehicles" -- sits at the
foot of the last table because that is where the book's own page run
happens to end, not because it belongs to Vehicles specifically; it is left
there rather than pulled into its own table.

**Pages 36 to 45 -- the same requests again, but only the roughly forty the
city actually asked for in 2027, each with the department's own case and the
urgency it was given -- used to run as one long "2027 Capital Requests"
section under the eight tables. Each write-up is its own route now, linked
straight from the table row it belongs to.** `spending/capital-planning/<item>/+page.svelte`,
one directory per project, sitting inside the `(tabs)` layout like every
other spending route -- no route group of its own, since these are leaves,
not five more topics needing a nav entry -- so they keep the shared spending
bar, the five-topic nav (with "Capital Planning" still marked current, since
`current()` matches any segment of `route.id`, not only the last one) and
`References`. Every row across the seven tables now links to one of these:
trimming each table to its 2027 column dropped exactly the rows with no
2027 figure, and those were exactly the rows with no write-up either, so the
tables carry nothing plain-text any more except the category `Total` rows,
which are sums rather than projects and were never linked. `<item>`
is `sectionSlug` run on the table row's own label, not the write-up's: the
book spells a handful of these two ways on its two different pages --
"Highway Administration Roof Replacement" in the summary table (30-35),
"Admin. Roof Replacement - Highway" on its own page (36-45); "Highway Garage
Roof Repairs" against "Garage Roof Repairs - Highway"; "Skid Steer -
Highway" against "Skid Steer - Highway2", already noted as the book's own
stray digit; "...adjacent property on Downing" against the same phrase with
"Ave" on the end -- and the table row is what a reader actually clicks, so
that is the spelling the URL is built from. Both spellings are kept exactly
as the book prints them, each on the page it belongs to; nothing here
reconciles the two. An item page's own content is the write-up's `<h4>`,
promoted to `<h2>` since it is this page's own top heading now, and its
paragraphs -- verbatim, unedited, moved rather than duplicated, so the
"2027 Capital Requests" heading, its three collected `<h3>` category
headings, and the run of `<h4>`s beneath them are gone from `capital-planning`
entirely. Extracting forty write-ups by hand risked exactly the kind of
transcription slip this project treats as a defect, so the move was
scripted: every line-range boundary read off the source file, every
extracted block diffed byte-for-byte back against the pre-move commit, and
every table-row match required to succeed exactly once before it was allowed
to touch the file. `Router.capitalRequestItem(id, slug)` builds the link.

**"2027 Capital Funding Recommendation" and "Plan for Funding Major Capital
Projects" sit above the seven tables now, not below them.** Both are the
book's own closing word on the whole capital section -- what the Mayor and
CFO recommend and why, and how the two big projects actually get paid for --
and a reader wants that context before the detail, not after scrolling past
it. "What is OPEB?" -- a `<h3>` under "Plan for
Funding", one sentence defining the acronym -- is gone entirely rather than
moved: "Plan for Funding" itself already uses the term in a sentence that
names it in full ("Other Post-Employment Benefits (OPEB)"), so the
definition beside it was answering a question the page had already
answered, and nothing else on this page or `debt` depends on it.

**"References"** is the device for that, shared by `education`, `spending`,
`debt` and `reserves` as
[`BookReferences`](../src/lib/BookReferences.svelte). Its items follow the rule
the contents page follows — a section written up here opens on this site, one
that is not opens the city's file at its own page — so one list carries both.
The heading is ours, and so is the choice of what to list.

It was headed "Elsewhere in the book", which named half of what it holds. A list
of what a page sits next to is a see-also; a list of what a page was built out
of is a reference, and a reader who wants to check a figure against the city's
own file wants the second one. Both go in it now, because what a reader does
with either is the same thing: open the book there.

**`reserves` is the one that carries a full set.** Its first three entries are
the run the page transcribes — "Fiscal Reserves" (17), the page Policy #1 and #2
are quoted from, and "Free Cash" (19) and "Stabilization Reserve" (20), each
still headed on this page too, inside the fund's own collapsed section, so a
reader checking the free cash figure lands on the free cash page rather than
three pages before it. Page 18, "Fund Balance", is not in the list any more: it
defined the term rather than stating a policy, so it carried no compliance mark
to close beside the four sections' and no section of its own to be a reference
for. Then "Financial Reserve Policies", at 228 rather than the 227 its contents
line gives: 227 is a title page with nothing on it but the words, and Reserve
Policy 2 — the one the reserves section leaves out and this page carries — is on 228. A reference is worth pointing at the sentence. The last two, "Liability,
Overlay & Reserves" and "Fund Accounting", are neither transcribed nor drawn
from; they
were the whole of the list when it was a see-also.

A chart title that is a link says so with a 2px underline rather than the
hairline the contents lines carry, and the pie's heading needs `font-semibold`
put back on the anchor — `prose` gives a link a weight of its own, 500, which is
lighter than the heading it sits in. Appropriations has no such link: page
78's table is what it is drawn from, and that table is at the foot of the page
its heading opens. **A section the page
already links some other way does not get a contents line either** — the e2e
suite keeps a `charted` list of them, beside the `unlinked` one, so the check
that every contents link resolves still knows what to expect.

Every other line the book's contents carries is listed, whether or not it has a
page here.

**The contents is two lists, and neither carries a heading.** The left one is
the book's account of the year, in the book's order. The right one is the
stretch of the book from City Council to Library, where each page is something
the city funds — and it carries what each of those costs, largest first.

It read alphabetically while it was only names, on the grounds that a reader who
wants one department knows its name and not the book's grouping. With a figure
beside each name the list answers a better question than "where is the library":
the schools are $147,158,454 of it, the police $17,501,996, and the senior
center $14,500, and in alphabetical order those three sit apart and read alike.
Ordering by what the money does is the whole editorial idea of the site applied
to a list.

The figures are pages 76 and 77, the book's own department table, read out of
`spending/tables.ts` — the same copy the spending page renders, so no figure
here is typed twice. The book's contents and that table name the same
departments differently ("Legal" against "Legal Department", "Inspectional
Services" against "Health & Inspections"), so `BUDGET_LINE` in `fy2027/+page.ts`
pairs them by hand. It is a pairing rather than a guess: set aside the twelve
rows that are not a department — debt, benefits, assessments, the two school
lines, and the two the city no longer funds — and thirty-two rows stand against
thirty-two lines with one candidate each. `costOf` throws when a line finds no
row, so renaming a department in one place and not the other fails the build
rather than printing a blank.

**Education is the one line with no row of its own.** The book budgets the
schools in two pieces, "School Department" and "Regional Schools", and the page
here carries both, so the line is priced at the two added together —
$147,158,454, which is exactly what page 78's own "Education" category prints.
`overview.spec.ts` holds those two against each other.

**"Finance Division" is not in the list.** Page 91 is a divider: the names of
the three offices under it and the division's staff, and no budget of its own.
Its three offices are each in the list with their own figure, so the line had
nothing to cost, and a line with no figure in a list of figures reads as one
that went missing.

That list has no title because no short one is true of it: "Departments" would
be wrong about Education, Outdoor Lighting, Refuse and Snow & Ice Removal, which
are things the city funds rather than offices it staffs. `ALSO_A_BUDGET` in
`fy2027/+page.ts` is how a page printed elsewhere in the book joins that list
anyway — Education is page 26, and a reader looking for what the schools cost
looks where the fire department is. It stops at Library
rather than at the end of "General Fund Budgets", because Debt Service, State
Assessments, Employee Benefits and Liability, Overlay & Reserves are money the
city owes rather than departments that spend it. Sixty lines under one heading
is a list nobody reads to the end of; two headed lists are two questions, and a
reader arrives with one of them. `fy2027/+page.ts` splits the transcribed
contents on those two named entries, and throws if it cannot find them.

**The contents lists titles and nothing else.** The book prints a page number
beside each of its own contents lines because paper is the only way through it;
here the line itself is the way through, opening the section on this site or the
city's PDF at that page, so which page it is stays the link's business. The
numbers are still in the data — they are what `Router.pdfPage` builds an unwritten
section's link from — they are just not printed.

**The book page is one screen, and only the list scrolls.** From `lg`, the grid
takes `100vh` less 197px — the bar at the top (53), the padding the layout puts
above the page (16), and the padding it puts below to clear the fixed footer
(128) — and the department list is the only thing inside it with
`overflow-y-auto`. The charts are the answer the page exists to give, and a
reader working down thirty-four names is the reader who most wants them still in
view; a chart that scrolls away is a chart consulted once. Below `lg` all of it
is off and the page scrolls as a page.

That scroll box is `relative`, which is load-bearing: the `sr-only` note on a
contents line that opens the city's PDF is absolutely positioned, and without a
positioned ancestor it resolves against the page rather than the box. A scroller
does not clip what is not laid out inside it, so the page grew by the height of
the list hanging out of the bottom of it — 83px of phantom scrolling that took a
while to find.

**The book page is not a reading column.** `+layout.svelte` keeps `max-w-3xl`
for a section, which is prose, and gives the book page `max-w-none`: from `lg`
the two pies sit in a narrow left column with the table of contents beside them,
which is what most readers came for and would otherwise start below the fold.
Below `lg` it stacks, charts first.

## The calendar at the foot of a book page

Page 13 is the budget calendar, and it is drawn rather than transcribed into a
section of its own: the footer of every page of the book, fixed to the bottom of
the window, so the process stays in view while the page scrolls past it. It is
drawn by
[`src/lib/BudgetTimeline.svelte`](../src/lib/BudgetTimeline.svelte) from
[`fy2027/budget-calendar.ts`](../src/routes/budget/fy2027/budget-calendar.ts),
loaded in [`fy2027/+layout.ts`](../src/routes/budget/fy2027/+layout.ts) so it is
under the sections and not only the front page. The process the two charts above
it are the outcome of ends up on the same screen as the outcome.

It is the _book's_ footer and not the site's: page 13 belongs to FY2027, and a
year written up later brings its own. Nothing outside `/budget/fy2027` draws
it.

**A box per step, holding a few words.** A step of a process has a beginning and
an end, twelve boxes fill the width evenly, and a box is somewhere for words to
live. The book's own sentence for a step runs to twenty-odd words — a paragraph
in a box that wide — so the box carries a summary and the sentence appears
underneath the row on mouseover or focus, unshortened. The summaries are the one
thing on these pages that is not the book's: each is built from its own entry's
nouns, and the sentence is in the box as well, hidden, so a screen reader gets
the book's wording whether or not anything can be hovered.

**A step that produced a document links it.** Two of them did: the book itself
came out of the final review, and the Council's appropriation orders were on the
agenda of 2 June, inside the run of public budget hearings. Each box carries a
`PDF` link to the city's file, with an `sr-only` clause naming which document it
is, since two boxes reading "PDF" say nothing apart. The book's box opens it at
the page the reader is on — the section's own page from a section, the front of
the file from the book page — which is the deep link the bar carried as
"Original Source" until this took it over. A step's `document` key is
ours; everything else in `budget-calendar.ts` is the book's, and the files
themselves come from the page's `+page.ts` — the book from `budget.json`, the
agenda from the same `council-orders.ts` the spending page quotes.

**One box is highlighted: the stage the process has reached.** That is the last
entry that has begun — the entry itself while it is happening, and the one
behind it in the weeks between two entries, which is the stage the budget is at
until the next one begins. It is the one box in green — pale green, the weight
of a highlighter and not of a warning, since the box sits below two charts and a
table of contents and is not what the page is about. Boxes behind it are filled
pale blue, boxes ahead of it are white and grey — a fill apart rather than an
outline apart, because an outline heavy enough to see across twelve boxes reads
as a box drawn twice. FY2027's calendar ended at
adoption, so its highlight now rests on the last box for good. All three states
are spelled out for a screen reader, which cannot see which box is lit.

**Boxes are evenly spaced; the today mark is not.** Two entries are a day apart
and the last is eight weeks after the one before it, so spacing by date would
pile the middle up and leave the end empty. The mark is still placed by date,
interpolated between the entries either side of it, so where the budget has got
to is honest even where the spacing is not — in a gap between two entries it
sits between them while the highlight stays on the one behind.

**Today comes from the browser, over a build-time default.** `+page.ts` puts the
build date in the page so the mark is in the HTML that is served, and the
component replaces it on mount with the reader's own date. FY2027's calendar
ended when the council adopted the budget on 6/16/26, so its mark now sits at
the end of the axis and stays there; a book being written while its calendar is
running is the case this is built for.

**It is a footer, so it is built to be short:** the boxes and the mark, and
nothing else. There was a line above them naming the calendar and printing
today's date, and it went — the date is what the mark already says, and a strip
of chrome is a poor trade for the bottom of every window. The row itself carries
the name, as the `<ol>`'s `aria-label`, which costs no height.

**The book's sentence is a tooltip.** It comes up over the box under the pointer
(or holding focus), and it is drawn outside the scrolling strip: `overflow-x`
clips vertically as well, so a tooltip drawn inside the strip would be cut in
half by it. That means its horizontal place is measured — the box's own
rectangle against the component's — rather than worked out from the index, which
is both shorter than "position in the row less the scroll" and right while the
row is being scrolled. It is pulled back from either edge so the first and last
boxes get a tooltip and not a scrollbar, and it is `aria-hidden`, because the
box already carries the same sentence for a screen reader.

Twelve boxes need more width than a phone has, so the row keeps its width and
scrolls inside itself, the way a wide table in a section does. On a narrow window
it is scrolled on load to put the highlighted box in the middle, which is
otherwise six boxes off screen. Nothing pushes a fixed footer out from under
itself, so `+layout.svelte` pads the book page by more than the footer's
tallest.

**The book's contents still lists "Budget Calendar"**, and that line opens the
city's PDF at page 13 like any section with no page here — the drawing is on the
front page, and the record is still the book.

**The figures come from page 78, not from the pie on page 65.** The pie is the
book's own high-level view of revenue, and it does not add up: its five slices
total $281,813,295 against the $285,272,159 printed above them. The gap is
"Other Available Revenue Sources" ($6,210,304), which no slice accounts for,
less "All Other Excise" ($2,751,440), which "All Other Local Receipts" already
includes and which is then drawn again as a slice of its own. The page-78 tables
balance. Note also that the appropriations column there sums to $285,272,160, a
dollar over the total printed under it; the book prints both, and the site shows
the stated total.

**There is one copy of those figures.** The chart reads the transcription's own
data, so the two cannot drift apart. See "A section whose tables are charted"
below.

## The glossary, and the words in the prose

The book ends with a "Glossary of Terms", pages 232 to 245: 62 terms of art the
city's own prose is full of — levy limit, free cash, cherry sheets, overlay —
answered 200 pages away from where a reader meets them. Two things are made of
it.

It has no contents line: every term is a link to its own entry from wherever
the city's prose uses the word, so a reader meets the glossary where the word
stopped them rather than by going looking for it.

**`/budget/<year>/glossary` is the glossary itself**, rendered from
[`src/lib/data/glossary.json`](../src/lib/data/glossary.json). That file is the
one thing in `data/` no scraper writes: the book has no text layer, so the
glossary was read off rendered pages like every other section. It lives in
`$lib` rather than beside the route because three things need it — the page, the
component, and the script.

**[`GlossaryTerm`](../src/lib/GlossaryTerm.svelte) is a link to the term's own
entry on that page, and nothing else.** It works with no script, in a reader
mode and for a crawler; it is announced as a link and reached by the keyboard
like any other; and a touch reader gets somewhere to go rather than something to
dismiss.

It was briefly more than that — the definition sat on the page under the word
and described the link with `aria-describedby`, with a CSS tooltip on hover —
and that is worth coming back to, but not in that shape: it read the definition
of "levy" at every one of its twenty-nine uses on the revenue page, so a screen
reader got a worse page than a sighted reader, in the name of accessibility. One
page holding every definition, linked from every use, is the simple version to
build the next attempt on.

The word on the page is whatever the city wrote — "free cash" mid-sentence,
"levies" for "Levy" — and `term` is what the glossary heads it, which is what
the link is built from. The component looks nothing up, so the script below is
also what checks that the term named is one the book defines; otherwise it would
be a dead anchor.

**[`scripts/check-glossary.mjs`](../scripts/check-glossary.mjs) is what keeps
that true.** `npm run glossary:check` — which `npm run lint` calls — scans every
transcription for the terms the book defines and fails on a use that carries no
definition. `--fix` wraps them and adds the import; it wrapped 98 uses across
six pages when it was first run. It also fails on a `term=` that names something
the glossary does not define.

Two rules, both in the script:

- **Every use, not the first.** A reader who arrives halfway down a page, from a
  link or a search, has not passed the paragraph where the word came up first.
  This is affordable precisely because the wrapper is a link and carries no text
  of its own: 71 links in a long document is ordinary, where 71 buttons that do
  nothing, or 71 copies of a definition, is not.
- **A match that is part of a name is not a use.** The book defines "Department"
  and also writes "Water Department", "School Department", "Department of
  Revenue", none of which is the glossary's "principal, functional and
  administrative entity created by the manager". A capitalised word on either
  side, or "of" and a capitalised word after, is what tells them apart. This
  replaced a list of words to ignore, which was blunter than it needed to be:
  half the words on it — Revenues, Expenditures, Deficit, Valuation — turned out
  never to appear beside a capital at all.

Prose only, in both cases: scripts, comments, tables and headings are blanked
before matching, since a cell is a figure rather than a sentence.

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

4. The page is the transcription and nothing else: no title, and no `<script>`
   unless its tables are charted, for which see below.
   It renders inside `<article class="prose">`, so headings start at `<h2>`.
   Where the page's own printed heading differs from the contents entry —
   "2027 Budget Goals" is printed "Mayor's 2027 Budgetary Goals" — the printed
   one is the first `<h2>`.

   A page may cover more than one of the book's sections, in which case the
   contents here carries one line for them and each keeps its own printed
   heading: `goals` is the book's "2027 Budget Goals" (page 15) and "Long-Term
   Strategic Goals" (page 16), four bullets and five on one subject, which a
   contents offering them separately makes a reader choose between. The line's
   page number is the first of the two, so the header's source link opens where
   the pair begins.

   A page may also be a **category**, named for what belongs on it rather than
   for the sections it happens to hold — `revenue` and `spending` are the
   two halves of the budget, and each gathers the book's sections on its side as
   they are transcribed. The contents line is the category's name, where it has
   one at all; those two are opened from their charts instead.

   The sections it covers need not all be transcribed. `education` is "Net
   School Spending" (26), "Regional Schools" (150) and "School Department"
   (152); only the first has been read off the page, and the other two are links
   into the city's file at the page the book gives them, under a heading of ours
   — "References", the one line on any of these pages that is not the
   book's (see [`BookReferences`](../src/lib/BookReferences.svelte)). That is the same thing a contents line does for a section nobody has
   written up, so covering them loses nothing; when either is transcribed it
   becomes an `<h2>` and drops off the list. Its `+page.ts` builds those links
   from the book URL on the layout above it, which is why that one takes
   `parent()`.

## A section whose tables are charted

A transcription is ordinarily plain markup. The exception is a section whose
figures something else on the site also shows — `spending` and `revenue`,
whose halves of page 78 are the two pies; `reserves`, whose three dials are the
reserve bar; and `debt`, whose page-21 list is the debt bar. Those
tables live in a `tables.ts` beside the page that renders them:

```ts
export const APPROPRIATIONS: BudgetTableData = {
  columns: ["Appropriations", "2022 Actual", …, "2027 Proposed"],
  rows: [{ label: "Education", cells: ["$107,945,786", …, "$147,158,454"] }, …],
}
```

The page renders them with [`BudgetTable`](../src/lib/BudgetTable.svelte), and
the chart reads the column it wants with `column()` from
[`$lib/budget-table`](../src/lib/budget-table.ts). One copy, two renderings,
nothing to keep in sync.

**Cells are the strings the book prints, not numbers.** "$988,666", "–",
"$(0)", "4.2%". A transcription has to reproduce what is on the page, and a
figure held as a number and formatted back out is a figure that can come back
different — the book writes a parenthesised zero, an en dash for a year with no
entry, and percentages in the same row as dollars. `amount()` reads numbers back
out for the chart: parentheses are the book's negative sign, and anything
holding no money comes back null rather than as a wrong number.

**A table the book prints with no header row sets `unheaded: true`,** and one it
sets a caption over carries that as `caption`. The reserve dials and the debt
list are a label and a figure per line with nothing over the columns, so the
column names in the data are handles for `column()` and `cell()` to find a
column by — never anything a reader sees.

`amount()` reads the _dollar figure_ out of a cell, not every digit in it: the
dials print the share beside the money in one cell, "$13,985,452 (7.85%)", and
taking the digits off the whole string made that thirteen billion and, because
of the parentheses around the share, negative.

Do this only where a table is genuinely shared. A table nothing else reads is
clearer written out as markup, next to the prose it belongs to.

## What a section covers

A contents entry runs to the page before the next one, and everything in that
run belongs to the section, each page's printed heading becoming an `<h2>`.
Two things complicate that in this book:

- **The book's contents skip pages.** Its front matter and process pages —
  Council Members, City Hall of Haverhill, Mayor's Budget Team, Budget Phases —
  carry headings but no contents entry, and fall inside the run for "Mayor's
  Budget Message", which the book page does not list at all. The book page
  listed them under "Not in the book's contents" for a while and does not any
  more: the contents is the book's contents, and a page it leaves out is a page
  a section covers when someone writes that section.
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
src/lib/data/budget.json                   the committed listing, scraped
src/lib/budget.ts                          reads it; slugs and contents helpers
src/lib/budget.spec.ts                     unit tests for them
src/lib/BudgetColumns.svelte               spending and revenue, two columns
src/lib/BudgetStack.svelte                 reserves and debt, two bars on one scale
src/lib/BudgetBands.svelte                 a fund against the band its policy allows
src/lib/BookReferences.svelte              where a page came from, and what it sits by
src/lib/data/glossary.json                 the book's glossary, transcribed
src/lib/glossary.ts                        reads it; the definition lookup
src/lib/GlossaryTerm.svelte                a defined word, with its definition
scripts/check-glossary.mjs                 checks every term is defined in use
src/lib/chart-colours.ts                   the one colour order every chart uses
src/lib/BudgetTimeline.svelte              the budget calendar, drawn as boxes
src/routes/budget/<year>/budget-calendar.ts   that calendar, transcribed
src/lib/BudgetTable.svelte                 a transcribed table, rendered from data
src/lib/budget-table.ts                    that data's shape, and `amount`/`column`
src/routes/budget/<year>/<section>/tables.ts  a shared section's tables
src/routes/budget/<year>/overview.spec.ts  the arithmetic page 78 claims about itself
src/routes/budget/<year>/reserves/reserves.spec.ts  the one scale the policy bands share
scripts/lib/budget.mjs                     the scrape: fetch, parse, diff
scripts/lib/budget.spec.mjs                unit tests for the parser
scripts/update-budget.mjs                  writes budget.json
scripts/update-metadata.mjs                runs every scraper in sequence
src/routes/+layout.ts                      loads every year, for the bar's menu
src/lib/SiteHeader.svelte                  that menu, and the rest of the bar
src/routes/budget/+layout.ts               looks a book up by its id
src/routes/budget/+layout.svelte           the column a book and its sections sit in
src/routes/budget/<year>/+page.ts          the book's contents, transcribed
src/routes/budget/<year>/+page.svelte      renders it as links
src/routes/budget/<year>/<slug>/           one section, by hand
src/routes/budget/page.svelte.e2e.ts       end-to-end tests
```

Nothing routes to `/budget` itself, which is what lets `budget/+layout.ts`
error on an unknown id and everything under it treat the book as present rather
than checking for null on every page. A visitor with a bookmark from when the
overview existed gets the site's 404, which is the SPA fallback the adapter
writes (`fallback: "404.html"`) and so carries the bar once it has hydrated.
