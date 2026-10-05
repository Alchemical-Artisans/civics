# Transcribe a Haverhill meeting document

You are writing a meeting page for this site: the city's own agenda or minutes,
republished as HTML a reader can link into. `npm run transcribe` assembled this
prompt and appended the sitting's own details, the cached files and the page
images at the end — read that section before anything else, then work through
what follows.

Read `CLAUDE.md` and `docs/document-pages.md` first if they are not already in
your context. The rules below are the ones that actually bite; those two files
are the authority where they say more.

## 1. Read the document before writing anything

The material section names a cached PDF for each of the sitting's documents,
and for each one either extracted text or a run of page images.

- **Where there is text**, read the `.txt` — but check it against a rendered
  page or two before trusting it. `pdftotext` reflows columns and tables into a
  single stream, and a document with a text layer on page 1 and scans behind it
  extracts as one good page and nothing else.
- **Where there are images**, read every one with the Read tool. Roughly
  two-thirds of what the city publishes is scanned paper with no text layer at
  all, so this is the normal case, not the exception.
- **Where a passage is unclear**, do not guess and do not smooth it over. Cut a
  crop out at a higher resolution and read that:

  ```sh
  pdftoppm -r 350 -png -f 1 -l 1 -x 200 -y 1150 -W 2100 -H 700 <cached.pdf> crop
  ```

  `-f`/`-l` are the page, `-x`/`-y` the top-left corner and `-W`/`-H` the size,
  all in pixels at the `-r` resolution. If a passage still cannot be read after
  that, leave it out and say so in your report rather than inventing it.

An agenda packet is often a handful of outline pages followed by hundreds of
pages of supporting material. **Only the outline is transcribed.**

## 2. The meeting page

`src/routes/calendar/meetings/<meeting id>/+page.svelte`, where the meeting id
is in the material section and is the directory name. Creating the directory is
the whole act of writing a meeting up — there is no registry, and the calendar
starts linking to it on the next build.

The page is the write-up and nothing else: no title, no date, no board, nothing
restated from `meetings.json`, which the surrounding layout already renders. It
renders inside `<article class="prose">`, so plain semantic markup is enough:

- Headings start at `<h2>` — the `<h1>` is the layout's.
- The document's own numbering and wording are kept exactly as printed.
- Outbound links get `target="_blank" rel="external noopener noreferrer"`.
- Svelte reads `{` and `}` as expressions, so write them `&lbrace;` and
  `&rbrace;`.

Where the sitting has both an agenda and minutes, the agenda is the page's body.
Transcribe the minutes beneath it under a heading naming them, and say in your
report that you did — no page on the site carries both yet, so the arrangement
is worth the user's eye.

## 3. When and where

If the document states a time, a room, a link to join remotely or the standing
notice it opens with, those go in a sibling `+page.ts` rather than in the prose,
because the layout renders them into the header:

```ts
export const load: PageLoad = () => ({
  details: {
    time: "7:00 P.M.",
    location: {
      name: "Room 202, Haverhill City Hall",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "…",
      meetingId: "…",
      passcode: "…",
      how: ["…"],
    },
    notice: ["…"],
  },
})
```

Every field is optional and so is the file — skip it for a set of minutes that
states none of this. `name` is shown and is verbatim; `mapQuery` is what the map
is handed, so drop the room and add the city.

**Three slots, and what goes where is decided by what a reader does with it:**

- **`remote`** — how to take part or watch from elsewhere. `url` is a join
  link, shown in the header as "Remote Access"; `meetingId` and `passcode` sit
  beside it. Where the remote option is not a single link — a form to register
  on ahead of time, a link emailed afterward, several paragraphs of
  conditions — put those paragraphs in `how` (the city's words, one per
  paragraph) and the header shows them behind a disclosure a reader opens.
  Give `url` **only** where the document prints a working join link; a
  shortened or malformed URL stays as text inside `how`, not a link that
  404s. **The live stream is not a field here and is not yours to write:** the
  City Council, the School Committee and the License Commission are carried on
  Haverhill Community Television's channel 8, and the page derives the link
  from the board and the date (`liveStream` in `src/lib/calendar.ts`), showing
  it on any sitting that has not happened yet. So an agenda saying the meeting
  "will be broadcast over HCTV and WHAV" without printing an address is saying
  nothing the page does not already say — drop the sentence rather than
  quoting it.
- **`notice`** — standing Open Meeting Law boilerplate, one string per
  paragraph, behind an information icon. Keep this to what turns on a choice
  _this_ body made: that it meets in-person as its official location, say.
  Text that is identical on every board's agenda in the city — the remote-
  meeting act's sunset date, the wiretap statement the chair reads aloud — is
  not about this sitting and does not go on the page at all.

Do not restate in `notice` or `how` what the header already shows: the day, the
hour and the room are the date line and the location link, so an opening
paragraph that recites them is dropped, and any signature under it goes with it.

**The time has to come from the document.** `meetings.json` carries a clock time
and it is a mix of real times and placeholders, so nothing on the site displays
it. Do not copy it in here.

## 4. A page for each item

Every item with something under it gets its own page, so a reader can link or
bookmark straight to it:

- `src/routes/calendar/meetings/<meeting id>/<item slug>/+page.svelte` carries
  that item's text verbatim.
- Beside it, `+page.ts` returning `{ item: { title } }`. The layout titles the
  page after the item and points the back-link at the agenda.
- On the meeting page the item's full text is **replaced by a link** to it,
  built with `Router.meetingItem(MEETING, "<item slug>")` — never a path
  written out by hand, and never SvelteKit's `resolve()`.

The title is the document's own name for the item where the agenda gives it
one — the phrase an agenda underlines or numbers — as printed. Most agenda
lines do not: a communication or a road-opening request is a full sentence
("Mayor Barrett wishes to introduce Robert Ward, Director of Water/
Wastewater to provide an update on the Drought Emergency") with no shorter
name printed anywhere. There the title is a summary of a few words naming
what the item is about — "Drought Emergency Update" — not a copy of the
sentence. **The link text on the meeting page is always this title, never the
full sentence.** A reader scanning the outline wants to know what an item is
about, not to read the whole thing twice on the way to reading it once; the
sentence itself stays, verbatim, only on the item's own page. The slug is the
title slugged: lowercase, everything outside `a-z0-9` collapsed to a single
dash. Where the printed name says nothing about which land or which party
("Amend Chapter 255 Zoning Ordinance and Zoning Map" is what the Planning
Board calls every such petition), name the directory for the matter instead
and keep the printed title, and where the same matter is already written up
under another board use that board's slug so a reader following one to the
other gets the same word. Say why in the `+page.ts` comment.

**What does not get a page:** a bare heading with nothing under it, a ceremonial
line ("Opening Prayer", "Adjourn"), and a line that is only a date ("Approval of
minutes: August 12, 2026"). Those stay on the meeting page as they are printed.

**A sub-item moves to its parent's page entirely — it does not stay behind
on the outline too.** "8.3" on a City Council agenda is the request to open a
roadway; "8.3.1" underneath it is the order approving that same request. Once
8.3 has its own page, 8.3.1 is transcribed there, under it, and nowhere else —
delete it from the meeting page rather than leaving a copy standing next to
the link. The outline should read as a link and nothing under it, the way
every other linked item does; a sub-item left behind is the one thing on the
page still duplicating text the reader is about to click through to.

**A "Related communication" note belongs on the item's page, not the
outline, and where it states a new development the link text says so
instead of the item's plain title.** A City Council agenda often adds a line
under a hearing item naming an attached letter — "Related communication from
applicant requesting to continue hearing until October 6, 2026" — the same
duplication problem as a sub-item: it is prose about a document the item
page already links to and quotes, so it stays there and comes off the
outline entirely. Where the note reports something happening to the matter
at _this_ sitting — a continuance to a new date, a withdrawal — put that in
the outline's link text in place of the item's usual title, since that is
the news this agenda actually has for a reader scanning it: "Continue
Hearing for 27 Marshland St to October 6, 2026" links 10.1 of
`city-council-2026-09-15`, not "Special Permit, 27 Marshland St". The item's
own `+page.ts` title is unaffected — it names the matter, not this sitting's
turn of it, which is why the same matter keeps one title of its own across
every meeting it comes back to (see `battery-energy-storage-systems-ordinance`,
written up separately under both the 8/25 and 9/15 meetings with the same
title in each). Where the note names a sender but reports no new
development ("Related communication from Jacki Byerley, Planning Director",
who is already the item's own submitter), it has nothing to add over the
plain title — drop the note and leave the link text as the title.

**This is the general rule, not a special case for one kind of note: once an
item has its own page, everything under its outline entry belongs there
instead, not in both places.** A bold, right-aligned procedural stamp
("File 10 Days", "Continued from July 14, 2026", "Filed August 26, 2026")
is still the agenda's own words rather than the transcriber's, but it is
transcribed onto the item's page along with the rest of the item, and that
means it comes off the outline the same as a sub-item or a related-
communication note does — an ordinance's outline entry does not need
"File 10 Days" under it any more than it needs the parking-restriction
table repeated under it when that table is already on the page the link
goes to. The outline is a table of contents; the page it points to is where
an item's content — table, stamp, sub-item, or note — actually lives.

**Two agenda lines can be the same matter.** The License Commission's own
agenda puts one applicant's request under two headings — a Common Victualler
amendment and an Alcohol/ABCC application for the same change of hours — because
that is two different licenses even though it is one restaurant asking for one
thing. Write one page, not two that would say the same thing twice, and link
both list entries to it with the same slug. Keep each entry's own link text as
the agenda prints it over that entry, so a reader following "7.1" still reads
about the Common Victualler amendment and one following "9.1" about the alcohol
change, and say in the item's `+page.ts` comment which agenda items it stands
for.

**A bucket line's own sub-items share one page too, even when each is a
different matter.** "11.1 Confirming Appointments" is not itself a matter —
it is a category heading with two unrelated appointments listed under it,
"11.1.1" and "11.1.2", each naming a different person and commission. These
do not each get their own page: write one page for the bucket
(`confirming-appointments`, titled "Confirming Appointments" after the
heading, the same rule as an ordinary title), with both appointments'
paragraphs and every excerpt on it. Excerpts that were two separate people's
mayor's letters and resumes move under the one item slug too, told apart by
filename (`mary-grise-resume.pdf`, `wendy-sczechowicz-resume.pdf`) rather
than by directory. On the outline, each sub-item keeps its own numbered
entry and its own short link text — the §4 title rule applies here exactly
as it does to any other item, so "EVNT-26-23- Kathy McCormick for Rocks
Village Memorial Association, Inc request to hold an Art Show to coincide
with Essex Heritage Trails and Sails on September 12th & 13th..." is
"Art Show, Rocks Village Memorial Association" on the outline, never the
full sentence. A reader following "11.1.1" should still land on Mary
Grise's paragraph rather than Wendy Sczechowicz's — but both entries' links
point at the same slug. `tag-days` and `event-applications` on this same
meeting are the same pattern one level up: a whole bucket ("12.6 Tag Days",
"12.4 Amusement/Event Application") rather than a numbered sub-item,
several unrelated applicants listed under it, one page for all of them.

**But where a bucket's sub-items are mostly bare category headers with
nothing under them, the whole numbered list moves to the page, not just
the sub-items' content.** "12.8 Annual License Renewals" has eighteen
sub-items and only one, "12.8.6.1", names an actual applicant — the other
seventeen are category labels with no renewal filed against them this
sitting, exactly the "bare heading with nothing under it" this section
already says does not get a page of its own. A numbered list that is
seventeen empty categories and one real entry has no reader value split
across the outline; write the whole thing — every sub-item, numbered as
printed, the one with content included — on the bucket's own page, and
collapse the outline to a single "12.8" entry linking to it, the same as
any other single-page item. The test is not the bucket's size but whether
its sub-items are individually substantive (an applicant, an appointee) or
mostly placeholders: `confirming-appointments`, `tag-days`, and
`event-applications` are all of the first kind and keep their sub-items on
the outline; `annual-license-renewals` is the second kind and does not.

**Two agenda lines can be the same matter.** The License Commission's own
`src/routes/calendar/meetings/planning-board-2026-09-09/` (four items, no
packet), `city-council-2026-08-25/` (twenty items, each with pages cut out of
the packet behind it), and `license-commission-2026-09-14/99-restaurant-hours`
(one item page standing for two agenda lines).

## 5. An address named in the document

Where an item names a specific street address -- a parking ordinance, a
special permit, a road-opening request, a property the Council is voting to
take or dispose of -- add a map under the table or paragraph that states it:

```svelte
<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
</script>

<AddressMap address="12 Blaisdell St, Haverhill, MA" lat={42.7747118} lon={-71.0913454} />
```

`AddressMap` hands OpenStreetMap's own embeddable widget a point to centre
on, so look the address up once, by hand, before writing the page -- the
widget cannot take an address string the way `Router.map` (a meeting's own
"where this is held" link) can:

```sh
curl -A "civics-calendar/1.0 (github.com/alchemical-artisans/civics)" \
  "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=<street>%2C+Haverhill%2C+MA"
```

One request, not a loop over every address in the packet at once --
Nominatim's usage policy caps this at one request a second, and the user
agent above is required, not optional.

A **named place** counts as well as a street address: a cemetery, a park,
a school, a library, a memorial. An item that says "a ceremony at Hilldale
Cemetery" is naming where something happens even with no number printed, so
look the place up by name (`q=Hilldale+Cemetery%2C+Haverhill%2C+MA`) and map
it when the top result is that very feature -- `"name"` matches and the type
is the place's own (`cemetery`, `park`, `school`...). Do not wait for the
document to say "map"; the absence of a printed address is not a reason to
skip it.

Use the result only where it resolves to the actual address or named place
printed -- a building, a house number, a feature of the right name. Where the
document names a place with no street number of its own that the lookup
cannot find _by name_ (a pumping station, an unnamed lot) and it only turns
up the street or the neighbourhood it sits on, **leave the map off** rather than centring it on an approximation and calling it the
place -- the same rule as §10's "do not guess": a map is a stronger claim of
precision than a sentence naming the street, and this codebase does not make
claims the document does not support. Say in your report which addresses got
a map and which were left out, and why.

This is for a place the document is _about_ -- not the sitting's own
location, which is a different thing (§3's `mapQuery`) with its own Google
Maps search link.

### An event with a wider organisation behind it

When an item is a local instance of something national or otherwise run by an
organisation with its own site -- Wreaths Across America, a Relay for Life, a
Veterans Day observance, a charity drive, a state program or a federal grant
-- link that organisation's official site in a sentence of its own under the
item, with `target="_blank" rel="external noopener noreferrer"`. Name it
plainly ("Wreaths Across America is a national program; its own site is
...") rather than in the city's voice, since the document does not say it.
Use the organisation's own homepage, confirmed by search or fetch, never a
guess at a domain; where you cannot confirm one, leave it out and say so in
your report. This is the one place the page carries a sentence the document
did not print, so keep it to the link and one clause.

### An upcoming event the item announces

When an item announces something that happens on a stated future day -- a
ceremony, a drive, a hearing, a festival, a deadline to show up for, as
distinct from the sitting itself -- and the sitting is not yet past, give the
page the same "Add to calendar" control the meeting header has, built from
`AddToCalendar` and a `CalendarEvent`:

```svelte
<script lang="ts">
  import AddToCalendar from "$lib/AddToCalendar.svelte"
  import type { CalendarEvent } from "$lib/ics"
  import { Router } from "$lib/router"

  const event: CalendarEvent = {
    uid: `${MEETING}-${ITEM}@haverhill.alchemicalartisans.com`,
    title: "Wreaths Across America, Hilldale Cemetery",
    start: "20261219", // YYYYMMDD; add THHMMSS only if the document states an hour
    end: "20261220", // all-day: the day after. Timed: start plus the stated length, else two hours
    allDay: true,
    location: "Hilldale Cemetery, Haverhill, MA",
    description: "...",
    url: Router.absolute(`/calendar/meetings/${MEETING}/${ITEM}`),
  }
</script>

<div class="not-prose my-4">
  <AddToCalendar {event} filename="<item-slug>-<date>" />
</div>
```

Put it under the paragraph that states the date. Use the event's date and
hour only as the document prints them -- no hour printed means all-day, never
an invented time. `src/routes/calendar/meetings/city-council-2026-10-06/wreaths-across-america/`
is the worked example.

## 6. Cross-references to other meetings

A document sometimes names another sitting's business without printing it — a
council "Doc." number, "refer ... for further discussion", "continued from",
an applicant or address that turns up on more than one board's agenda. Before
finishing the page, search the rest of the site for it:

```sh
grep -ril "<name, doc number, or subject>" src/routes/calendar/meetings/
```

Where that turns up an item page for the thing being referred to, link the
reference to it with `Router.meetingItem(id, slug)` — wrap the printed words
themselves in the link, the way a shared matter's second agenda line is linked
in §4, rather than adding a sentence of your own explaining the connection.
Where nothing on the site answers it, leave the number or name as printed
rather than guessing at what it points to. See
`natural-resources-and-public-property-committee-2026-09-14/+page.svelte`,
whose "Doc. 41-a" links to the City Council item that referred the matter to
it.

## 7. Excerpts, where there is a packet

An item resting on a letter or a plan can link to just those pages rather than a
packet running to hundreds. Cut them out of the cached PDF and commit them:

```sh
pdfseparate -f 7 -l 7 <cached.pdf> static/excerpts/<meeting id>/<item slug>.pdf
```

Link with `Router.excerpt(id, slug)`. Where the pages behind one item are
several documents — a transmittal letter, the department's letter, the order —
cut along those seams into
`static/excerpts/<meeting id>/<item slug>/<document slug>.pdf` and reach them
with `Router.excerpt(id, "<item slug>/<document slug>")`; `pdfseparate` writes
one file per page, so stitch a multi-page document back with `pdfunite`. Keep
the link to the full document as well — the city's complete file stays the
record.

**Every excerpt is rendered and looked at before it is committed. Not the ones
that look like they might be sideways — every one.** This is a step of cutting
an excerpt, the same as `pdfseparate` is, and it is the step that gets skipped,
because a wide sheet scanned sideways is invisible in `pdfinfo` (the page is
still 612 x 792 with `Page rot: 0`; it is the scan inside it that is turned)
and invisible in `pdftotext` (a scan has no text layer to come out crooked).
The only thing that shows it is the image:

```sh
pdftoppm -r 100 -png static/excerpts/<meeting id>/<item slug>/<doc>.pdf /tmp/check
```

Read every `/tmp/check-*.png` with the Read tool. A chart, a plan, a budget
table — anything the city printed landscape — is likely to be lying on its
side, and cutting it out of the packet does not fix that; it just makes a
smaller sideways PDF. Do not commit one un-rotated on the assumption a reader
will tilt their head.

Poppler cannot turn a page and `qpdf` is not installed here;
`pip install --user pypdf` and set the rotation, which costs nothing in quality
because it only writes `/Rotate` into the page and leaves the scan alone:

```python
from pypdf import PdfReader, PdfWriter

reader, writer = PdfReader(path), PdfWriter()
for page in reader.pages:
    page.rotate(90)  # clockwise; 270 for a sheet lying the other way
    writer.add_page(page)
writer.write(open(path, "wb"))
```

Then render and read it again — 90 and 270 are easy to swap, and a page turned
the wrong way is no more readable than one left alone. Which way to turn is
read off the render: find the table's own first column or the letter's
signature, and ask where it would be if the sheet were upright. A heading
running up the left edge, with the letters' tops pointing left, has been turned
anticlockwise and wants `rotate(90)`; running down the right edge, `rotate(270)`.

## 8. A document that is a table

Some of what the city attaches is not prose with a table in it — it _is_ a
table: the Auditor's monthly revenue and expense reports, a fee schedule, a
list of bills. **Those tables are transcribed onto the item's page, in full,
the same as an ordinance's text is.** The excerpt link stays underneath, but a
link to a scanned PDF is not a transcription: a reader cannot search it, a
screen reader cannot read it, and no figure in it can be linked to or quoted.
The page is the write-up; a page whose whole write-up is three links to
scans has not been written up.

- **Every row, every column, in the document's own order.** Not the rows that
  seem interesting, not a summary of them, and not the totals alone. A hundred
  rows of department appropriations is a hundred `<tr>`s.
- **Semantic markup, and nothing more**: `<caption>`, `<thead>` with
  `<th scope="col">`, a `<tbody>` per group the document rules off, and
  `<th scope="row">` on a total row. Column widths and scrolling are handled
  site-wide in `src/routes/layout.css`; a page does not style its own table.
- **Return `wide: true`** from the item's `+page.ts` where the table runs to
  more than three or four columns — the same knob the ordinance comparison
  uses, and for the same reason.
- **What is a drawing is not transcribed.** These reports carry a "Trendline"
  column of sparklines and a column of Harvey balls beside each percentage;
  there is nothing in either to copy, and the figure beside them already says
  it. Leave the column out rather than inventing words for a picture.
- **Cells keep what the document prints**, including its accounting notation:
  a deficit in parentheses stays `$(110,390,272)`, a zero printed as a dash
  stays `$-`, and a cell the report leaves blank stays empty. The city's own
  slips stay too — "Motor Vehcile Excise" and "Fines & Forefits" are in the
  Auditor's report exactly so.
- **Where a caption has to be ours, keep it to a handle.** Use the document's
  own heading over a table where it prints one ("Year to Year Comparison",
  "Collections as a Percent of Budget"); where it prints none, name what the
  block is and stop.

`city-council-2026-09-22/revenue-and-expense-reports/` is the worked example:
five tables, the two reports' own headings as `<h2>`s, and the scans still
linked at the foot.

## 9. An order that replaces text already on the books

An order that amends, repeals or replaces something the city already has in
force -- an article of the Code, a policy, a fee schedule, a set of
regulations -- says almost nothing on the agenda line: "repeal and replace
Chapter 250, Article VI ... in its entirety, with the following revised
ordinance". The packet then attaches both, and a reader who wants to know what
the Council is actually voting on has to hold seven scanned pages against five
and find the changed words by eye. Nobody does that. **Transcribe both
versions and show them side by side with the differences marked.**

The pieces are already here:

- `$lib/word-diff.ts` marks the words that moved between two versions of one
  passage, as runs, both ways round -- struck on the side that loses a word,
  solid on the side that gains one.
- `$lib/OrdinanceComparison.svelte` draws a whole comparison: two columns on a
  wide screen, stacked and labelled in place on a narrow one.
- A `+page.ts` returning `wide: true` gives the item page the window's width
  instead of a reading column, the same knob a budget section has.

What the transcription has to carry beyond the words is the **pairing**: which
provision of the old text answers which of the new. That cannot be derived --
an order that replaces an article in its entirety renumbers most of what it
keeps, so § 250-25 becoming § 250-25.1 is invisible to any matching on
numbers -- so the data file gives every provision a `key` and the two sides
meet on it. A provision only one version has simply has one side. Each version
keeps its **own** number, title and lettering on its own side of the page:
printing one number over both columns would say the two agree when the whole
point is that they do not.

The one judgement to make by hand is `rewritten`: two different sentences
about the same subject rather than one sentence with words changed. A word
diff of a rewritten provision marks nearly every word, which tells a reader
nothing, so those are drawn plain and side by side with a "Rewritten" note
instead. Pin the judgement in a spec against `similarity()`, so a
transcription corrected later cannot quietly leave a rewrite drawn as an
amendment.

Labels down the comparison are the city's words or none. Where the two
versions letter a list differently and no shared label exists that either
document actually prints, leave the row unlabelled and let each side carry its
own numbering in its own text -- a handle invented to span them would be my
words sitting in the record's typeface, which §10 bars.

`city-council-2026-09-22/water-use-restriction-ordinance/` is the worked
example: `ordinances.ts` holds both transcriptions and the pairing,
`ordinances.spec.ts` pins the flags and the figures the order moves.

## 10. The rules that bite

- **Transcribe verbatim.** Do not paraphrase, summarise, correct, or tidy. The
  city's spelling, punctuation and slips stay as printed — "dover use" for Dover
  Amendment, a stray hyphen, a missing full stop. The words on the page are the
  city's; the arrangement is ours.
- **Write no prose of your own.** A heading the city prints with nothing under
  it stays empty. Do not write "None scheduled" unless the document says it.
- **Do not restate the dataset.** Title, board, date, kind and the links to the
  city come from `meetings.json` through the layout.
- **Read what you paste.** A PDF can be copied out of, and markup pasted without
  being read is somebody else's script tag in the build.
- **A table gets transcribed, not linked.** A page whose write-up is a list of
  links to scans is not a write-up; §8.
- **Render every excerpt and look at it before committing it.** A sideways scan
  cut out of a packet is still sideways, and nothing but the image will tell
  you; §7 has the render and the rotation snippet.

## 11. Check it

```sh
npx prettier --write src/routes/calendar/meetings/<meeting id>/
npm run check
npm run lint
npm run build
npm run test:unit -- --run --project=server
```

Prettier's config here is non-default and `npm run lint` enforces it: no
semicolons, double quotes, two-space indent, trailing commas, 100 columns.
`npm run lint` also runs the glossary check, which fails when a page uses a term
the budget book defines without linking it. The build is what proves the new
routes prerender — check `build/calendar/meetings/<meeting id>/` holds one file
per item page.

## 12. Commit, and report

Commit directly to `main`, in the repo's voice: what changed and **why**, not a
list of files. Do not push, and do not open a pull request.

Then tell the user, briefly: which pages you created, any judgement call you
made about slugs or about what did not get its own page, anything the document
states that you could not read, and the result of the checks.
