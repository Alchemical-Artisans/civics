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
the page's name and the fiscal year the book covers. A book page was spending
four lines on a heading, a date line and a link above the two charts anyone came
for, and the bar was already there saying where the reader was.

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

| Chart             | What it draws                                         | From                                                                 |
| ----------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| Spending, Revenue | two columns on one scale, each divided into its parts | page 78 and pages 63, plus the orders of 2 June 2026                 |
| Reserves and Debt | two bars on one scale, each divided into its parts    | page 17, `reserves/tables.ts`; page 21, `outstanding-debt/tables.ts` |

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
drawn as a hairline — Overlay is 1/589th of Education, about a third of a
degree, and no mouse will land on it.

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
"10-Year Appropriation Forecast" (69), "2027 Budget Requests" (72) and "2027
Budget Challenges" (73), in the book's order. It is called **Spending** rather
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
and what is driving it up (the challenges), where it is going (the forecast),
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
Budget in Brief" is three tables and no prose, so its two spending tables are at
the foot of this page and its revenue table at the foot of `revenue`, each
beside the chart that reads it. The book prints the two sides facing each other
to show that they balance; the front page makes that point instead, with two
pies carrying the same total.

**The pies are the whole city's budget, not the book's.** The book's page-78
tables are the general fund, and the front page draws both of them entire —
including the state assessments ($10,271,435) and the overlay ($250,000), which
the Council never votes because nobody gets a choice about them: the
Commonwealth bills the city for charter school tuition, school choice, the MBTA
and the rest, and the assessors raise the overlay to cover the property tax
abatements the year will grant. Charged rather than chosen, but spent, which is
what a chart headed "Spending" is about.

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

The spending total is **stated rather than summed**: the book's appropriations
column adds to $285,272,160, a dollar over the total printed under it, so the
pie's slices come to a dollar more than its heading. The book prints both and
the site shows the one it states. `overview.spec.ts` holds all of this down.

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

### The two charts on `reserves`

The front page draws the reserves as one bar, deliberately ignoring what the
city is _allowed_ to hold: the bands are this section's subject, not the front
page's. This is where they are drawn.

| Chart              | What it draws                                                                     | From                               |
| ------------------ | --------------------------------------------------------------------------------- | ---------------------------------- |
| The three policies | a bullet bar per fund on one scale: the band it may hold in, the balance it holds | the three dial tables, pages 17-20 |
| What came and went | two lines: a year's revenue against its expenditure                               | page 18                            |
| What they left     | columns on a zero line: the undesignated balance above, encumbrances below        | page 18                            |

**One scale for the three policies, and it is not an assumption.**
[`BudgetBands.svelte`](../src/lib/BudgetBands.svelte) draws a pale rail the full
width of the largest ceiling, the policy's band inside it, and the balance as a
thinner bar from zero — a bullet chart, which is what the book's dial is trying
to be. Three dials cannot be compared with each other at all: a needle halfway
round a small arc and a needle halfway round a large one look the same, and
there is no reading money off either. These three can be, because every one of
the policies is a percentage of the same figure — general fund revenue less debt
exclusion and Chapter 70 — and each floor and ceiling the book prints implies
that same $178,261,600 back to within $20. `reserves.spec.ts` checks all five
against each other; if they ever stop agreeing, one scale is the wrong picture
and the chart has to become three.

**No table on this page is printed any more.** The chart draws
every cell of them and prints every one beside its bar, and a table saying again
what the picture above it just said is a page asking to be read twice. The four
tables are still the transcription, still in `reserves/tables.ts`, still what
both charts and the front page's reserves bar are drawn from, and every figure
in them is the accessible name of the mark that draws it.

Nothing on the chart is written here. Each row is named as its own dial table
heads it ("Undesignated Fund Balance", "Free Cash", "Stabilization Reserve"),
and the three figures beside it are the book's cells printed as the book prints
them, shares and all — including the row label, which is not the same word
twice: "Actual" on the fund balance, "Anticipated" on free cash, which is a year
not closed yet, and "Actual Balance" on stabilization.

**The year's story is a bar that isn't there.** Free cash is anticipated at $0
against a floor of $3,565,232, so the middle row draws no bar at all beneath a
band it never reaches. The page says why in the city's own words — a winter of
$4.6 million in snow removal — and the chart says nothing the prose does not; it
just says it first, and next to the two funds that are inside their bands.

**Stabilization's band has no closing edge**, because policy #4 sets a floor and
no ceiling. The band runs to the end of the rail and the row prints no maximum:
the only honest thing to draw at a limit that does not exist is nothing.

**The rest of the page is page 18's table, drawn.** That table is three years of
the fund balance and what moved it — a beginning balance, the year's whole
revenue and expenditure, the encumbrances carried forward, and the balance left
at the end — and it is now two line charts and no table, by
[`BudgetLines.svelte`](../src/lib/BudgetLines.svelte).

**Two charts, because the table holds figures of two sizes.** A year's revenue
is a quarter of a billion dollars; the balance it leaves is fourteen million. On
one scale the balance is a flat line on the floor, and a second y-axis would let
the drawing say whatever suited — two scales can be slid past each other until
the lines cross wherever you like. So the flows are one chart and what they left
is the other, and the years belong to the charts rather than to the rows: both
are given the same four columns, so a reader can look straight down from one to
the next. Both components take `years` and a value per year per
series, `null` where the book prints none; the line chart breaks across a gap
rather than drawing through it, and the bar chart draws no bar. What puts a year
in the same place in both is
[`chart-frame.ts`](../src/lib/chart-frame.ts), the viewBox and the band
positions, shared so the alignment is structural rather than a coincidence two
files have to keep agreeing on. Years sit in the middle of their own band and
not at the edges of the plot: a bar at the edge would hang over the axis
figures, and a year has to be in one place for both charts.

**What they left is bars, not a line.** Those four figures are not a trend but
where the city stood at four closes of business, and a line drawn between two
balances invites the eye to read its slope as though something happened along
the way, which the book claims nothing about.
[`BudgetBars.svelte`](../src/lib/BudgetBars.svelte) draws each year as a column
standing on a zero line: the undesignated balance above it, that year's
encumbrances below, so a column's span is the distance between what the city
could spend and what it had already promised. Bars start at zero and the zero
line is drawn, because a bar's meaning is its length — unlike a line, which is
read for its shape and may begin where it likes.

**It is charted as the _undesignated_ fund balance**, which is what that figure
is: money nobody has spoken for, and the only part of a fund balance a Council
can appropriate. The table's own row says "Ending Fund Balance", but the dial on
page 17 heads its column "Undesignated Fund Balance" and the prose gives the
same $13,985,452 for the same date, so the book calls this figure undesignated
everywhere except in this one table.

**The encumbrances hang below the line because of their sign, not because they
are taken off the bar above.** The book's row is the _change_ over the year in
what is set aside for open purchase orders, and the balance beside it is already
net of that change: adding the two together gives nothing, since one is a stock
and the other a flow. The book gives no figure at all for what the encumbrance
reserve stands at, only what it moved by, so no chart here can show the reserve
itself. Each bar runs from zero in the direction of its own sign, so 2023 — the year the
reserve released money rather than taking it — draws its $97,098 above the line
rather than below.

**Nothing is stacked, and the arithmetic is why.** Page 18 only reconciles with
the encumbrance term in it: 2023 comes to $10,209,394 with it and $10,112,296
without. So the balance is already net of the movement beside it, and a stack —
which claims its parts add up to the column — would draw the same money twice
and put the top of the column at a total the book never states. Instead the bars
overlap: the first row is the width of the band, and each row after it is
narrower and drawn in front, centred, so a smaller figure is read against the
one behind it. Where a sign puts a bar the other side of the line there is
nothing to be in front of and it simply hangs below.

**A figure too small to draw is still drawn.** $97,098 against a scale of twenty
million is a third of a pixel, and the mark is a focus target as well as a
picture, so nothing non-zero is thinner than two units. The rounding that costs
is spent at the far end: every bar is hung off the zero line, so the edge a
reader measures from is exact whatever the clamp does to the other one. $0 draws
nothing at all, having no honest height.

**The beginning and ending balances are one row.** They are one figure read
twice — every year opens where the last one closed, which `reserves.spec.ts`
checks against the book's own cells — so the balance runs as a single row from
the close of 2022 to the close of 2025. That is why it starts a year before the
flows: the balance the city carried into 2023 is the balance it closed 2022
with, and the book names that year nowhere else.

**The expenditure line is drawn at what was spent.** The book prints these rows
inside a sum — "Plus Fiscal Year Revenue", "Less Fiscal Year Expenditures" — and
sets the expenditure in parentheses, which is the sum's minus sign rather than a
negative amount of spending. The labels stay the book's, sum and all, because
renaming a row to suit a chart is inventing text. What the picture then shows is
the year the two lines cross: 2023, when the city spent $233,787,846 against
$231,470,272 of revenue, which is the dip in the balance below it.

**Neither chart starts at zero, and both say so.** A line chart is read for its
shape, and revenue moving from $231 million to $263 million against an axis that
begins at nothing never leaves the top of the plot. The figures at the two ends
of the axis are drawn whatever else is. Zero itself is drawn only on a chart
that contains it — the encumbrances change sign, which no shape on its own
says.

**"Fund Accounting" is listed twice, on `reserves` and on `outstanding-debt`.**
It is the section that says these funds are separate things, which is what the
reserves page is about and what the debt page needs a reader to know: $92,212,944
of the $175,745,444 it draws was borrowed for water and wastewater, and is
serviced out of what households are billed rather than by the general fund,
whose own debt service for 2027 is $8,834,819. A see-also may appear on more than
one page where more than one page depends on it.

**The reserve projections stay where the book put them.** They are two rows of
the ten-year appropriation forecast — "19. Budget Reserve" and "Estimated Excess
Levy" — and the row that gives them meaning is a third, Budget Surplus /
(Deficit): the budget balances exactly in 2027 and runs deficits from 2028 that
consume the excess levy, $1,781,111 against $1,849,847 of headroom, which is the
sentence `revenue` prints in prose ("this reserve may be nearly exhausted by
2028"). Rows cannot be lifted out of a table without breaking it, and retyping
them would be a second copy, so the two pages point at each other instead.

**"Elsewhere in the book"** is the device for that, shared by `education`,
`spending` and `reserves` as
[`BookElsewhere`](../src/lib/BookElsewhere.svelte). Its items follow the rule
the contents page follows — a section written up here opens on this site, one
that is not opens the city's file at its own page — so one list carries both.
The heading is ours, and so is the choice of what to list: this is the site's
only "see also", and the book has none, which is reason to keep it short.

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
   — "Elsewhere in the book", the one line on any of these pages that is not the
   book's (see [`BookElsewhere`](../src/lib/BookElsewhere.svelte)). That is the same thing a contents line does for a section nobody has
   written up, so covering them loses nothing; when either is transcribed it
   becomes an `<h2>` and drops off the list. Its `+page.ts` builds those links
   from the book URL on the layout above it, which is why that one takes
   `parent()`.

## A section whose tables are charted

A transcription is ordinarily plain markup. The exception is a section whose
figures something else on the site also shows — `spending` and `revenue`,
whose halves of page 78 are the two pies; `reserves`, whose three dials are the
reserve bar; and `outstanding-debt`, whose page-21 list is the debt bar. Those
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
src/lib/BudgetLines.svelte                 a table's rows followed across its years
src/lib/BudgetBars.svelte                  a year's figures either side of zero
src/lib/chart-frame.ts                     the viewBox and bands those two share
src/lib/BookElsewhere.svelte               a category page's "see also" list
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
