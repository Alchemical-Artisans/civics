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
the page's name, the fiscal year the book covers, and an **Original Source**
link to the city's own file — on a section, that file opened at the section's
page. A book page was spending four lines on a heading, a date line and a link
above the two charts anyone came for, and the bar was already there saying where
the reader was.

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

| Chart                   | What it draws                                                | From                                      |
| ----------------------- | ------------------------------------------------------------ | ----------------------------------------- |
| Appropriations, Revenue | two pies, one circle divided two ways                        | page 78, `2027-budget-in-brief/tables.ts` |
| Reserves                | one bar: what the city holds, in the proportions it holds it | page 17, `fiscal-reserves/tables.ts`      |
| Debt                    | one pie of what the city owes, by what it was borrowed for   | page 21, `outstanding-debt/tables.ts`     |

The two pies are the year — everything expected in, everything planned out — and
sit in the narrow left column. Reserves and debt are the standing position
underneath it, which is a different question, so they sit together above the
table of contents rather than beside the pies. Every one of them reads its
figures out of the section's own transcription; see "A section whose tables are
charted" below.

**A pie, and the figures inside it.** The question a budget's front page
answers is what share of one pot each category takes, and a pie says "half of it
is schools" without the reader doing arithmetic. Hover a wedge, or tab to it,
and it names itself and prints its dollars and its share. Printing all fourteen
figures beside the drawing instead — which the page did briefly — spent the
width the book's own table of contents wants, and restated a table the contents
already links: the figures are page 78, transcribed at 2027 Budget in Brief.

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

**Reserves are one bar, and it ignores the policy bands.**
[`src/lib/BudgetStack.svelte`](../src/lib/BudgetStack.svelte) draws the three
balances as segments of a single bar with the total on the heading line. What
the city is _allowed_ to hold — a floor for each fund and a ceiling for two of
them — is the section's own subject, and drawing all of it here took more of
this page than the answer is worth; the front page's question is how much there
is. The three tracks-with-bands this started as are in the history if a later
year wants them back.

**The total is arithmetic of ours.** The book never adds these three, and free
cash is certified out of the undesignated fund balance, so a year holding both
would count some of the money twice. This year's free cash is $0, which is what
makes the sum sound, and `overview.spec.ts` asserts exactly that — so the year
free cash comes back, the test fails and the sum gets looked at again rather
than quietly double-counting.

It is the one chart here with no script behind it at all. Everything it draws is
printed under it, one line per fund with the share the book gives, so nothing is
a hover away and nothing is carried by colour: the bar itself is `aria-hidden`
decoration over a list that already says it. A fund worth nothing keeps its line
and draws no segment.

**Two contents lines are left out: "Mayor's Budget Message" (page 2) and
"Budget Calendar" (page 13).** Neither has a page here — the message was
dropped, the calendar is the footer — and a line for a part of the book the site
does not carry is a line that sends the reader into the city's PDF instead, so
both are gone from `fy2027/+page.ts`. **Dropping a page means dropping its
contents line with it.** Every other line the book's contents carries is listed,
whether or not it has a page here.

**The contents lists titles and nothing else.** The book prints a page number
beside each of its own contents lines because paper is the only way through it;
here the line itself is the way through, opening the section on this site or the
city's PDF at that page, so which page it is stays the link's business. The
numbers are still in the data — they are what `Router.pdfPage` builds an unwritten
section's link from — they are just not printed.

**The book page is not a reading column.** `+layout.svelte` keeps `max-w-3xl`
for a section, which is prose, and gives the book page `max-w-none`: from `lg`
the two pies sit in a narrow left column with the table of contents beside them,
which is what most readers came for and would otherwise start below the fold.
Below `lg` it stacks, charts first.

## The calendar at the foot of a book page

Page 13 is the budget calendar, and it is drawn rather than transcribed into a
section of its own: the book front page's footer, fixed to the bottom of the
window, so the process stays in view while the contents scrolls past it. It is
drawn by
[`src/lib/BudgetTimeline.svelte`](../src/lib/BudgetTimeline.svelte) from
[`fy2027/budget-calendar.ts`](../src/routes/budget/fy2027/budget-calendar.ts).
The process the two charts above it are the outcome of ends up on the same
screen as the outcome.

**A box per step, holding a few words.** A step of a process has a beginning and
an end, twelve boxes fill the width evenly, and a box is somewhere for words to
live. The book's own sentence for a step runs to twenty-odd words — a paragraph
in a box that wide — so the box carries a summary and the sentence appears
underneath the row on mouseover or focus, unshortened. The summaries are the one
thing on these pages that is not the book's: each is built from its own entry's
nouns, and the sentence is in the box as well, hidden, so a screen reader gets
the book's wording whether or not anything can be hovered.

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

## A section whose tables are charted

A transcription is ordinarily plain markup. The exception is a section whose
figures something else on the site also shows — `2027-budget-in-brief`, whose
page-78 tables are the two pies; `fiscal-reserves`, whose three dials are the
reserve bars; and `outstanding-debt`, whose page-21 list is the debt pie. Those
tables live in a `tables.ts` beside the page:

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
src/lib/BudgetPie.svelte                   the pie charts on a book page
src/lib/BudgetStack.svelte                 the reserves, as one bar in parts
src/lib/BudgetTimeline.svelte              the budget calendar, drawn as boxes
src/routes/budget/<year>/budget-calendar.ts   that calendar, transcribed
src/lib/BudgetTable.svelte                 a transcribed table, rendered from data
src/lib/budget-table.ts                    that data's shape, and `amount`/`column`
src/routes/budget/<year>/<section>/tables.ts  a shared section's tables
src/routes/budget/<year>/overview.spec.ts  the arithmetic page 78 claims about itself
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
