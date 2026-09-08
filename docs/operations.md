# Operations

## The one command

```sh
npm run metadata:update    # refresh everything the site takes from the city
```

That is the command to run. It drives the four scrapers in sequence and prints
each one's summary under a heading, then says whether anything failed.

A failing step does not stop the ones after it, and the exit status is non-zero
if any failed. The calendar scrape is the fragile half — it replays an Umbraco
request with three hardcoded content keys, which will stop working eventually —
and there is no reason for that to block a budget refresh that would have
succeeded. Whatever did succeed has already been written; the failures are
repeated at the end so they cannot scroll past.

Arguments are forwarded to every step, so `npm run metadata:update -- --prune`
reaches the calendar. The budget and schedule scripts take no flags and ignore
them.

## The scripts underneath

```sh
npm run calendar:update    # add documents published since the last run
npm run calendar:rebuild   # re-scrape everything from scratch
npm run boards:update      # re-scrape the board pages and the city's two archives
npm run cache -- --review  # download the flagged documents so a date can be checked
npm run links:check        # HEAD every linked file; find the ones the city has broken
npm run budget:update      # re-scrape the budget and audit listing
npm run schedule:update    # re-read the boards' meeting rules and calendars
```

Worth running alone while working on one of them, or when only one half needs
refreshing.

**Use `calendar:update` for routine refreshes.** Reach for `calendar:rebuild`
only when the scraping or date logic itself has changed.

There is no `budget:rebuild` or `schedule:rebuild`. The whole budget listing is
one request and twenty-two rows, and the schedule is three sentences of prose on
one page and a table of dates on each of two others, so the distinction between
a cheap refresh and an expensive full rebuild has no meaning for either — every
run replaces the file.

**`boards:update` runs after the calendar, and replaces only its own records.**
Most of the city's record is not in the listing: it reaches back only to 2025,
and the Agenda and Minutes archives beneath it hold ~1,620 more documents to
2012, while the Planning Board and the Zoning Board of Appeals keep theirs on
their own pages. All of it sits in `meetings.json` beside the listing's records
but is scraped from somewhere else. Each record carries a `source` saying which
scrape owns it, and `calendar:update --prune` skips the ones it does not —
without that it would delete all 1,958 on its next run. See
[data-format.md](./data-format.md#where-a-record-came-from).

**`schedule:update` shouts when the Council's wording changes.** That rule is
prose, and `src/lib/schedule.ts` reads it into dates — a reading only valid for
the sentences it was made about. So the script prints a warning when the words
move, and `schedule.spec.ts` fails outright. Re-read the rule and check the date
logic against it before committing; a silently misread rule puts meetings on the
calendar the Council never meant to hold. The two boards that print their own
dates need no such care — the dates are the dates. See
[calendar-page.md](./calendar-page.md#sittings-the-city-has-said-it-will-hold).

Any half coming back empty is a hard failure rather than a written file: it
means a page's markup moved, and a file written from it would empty the calendar
of every upcoming sitting. `planning-board:update` fails the same way and for
the same reason.

**Reading a schedule PDF needs poppler.** The Planning Board's dates are inside
a PDF rather than on its page, so `schedule:update` shells out to `pdftotext`.
It says so plainly if the binary is missing rather than reporting an empty
parse, which would look like the city having moved the schedule.

None of them touches the hand-written pages. Those live in
`src/routes/calendar/meetings/` and `src/routes/budget/<year>/`; the scripts
only re-derive what the city has published. See
[document-pages.md](./document-pages.md) and
[budget-pages.md](./budget-pages.md).

### Why the calendar has two

The cost is lopsided. Fetching the listing is a single HTTP request that returns
every document. Determining a _date_ costs one request per document, because that
lives on each document's own media page (see [dates.md](./dates.md)).

So a full rebuild is ~281 requests, while a typical refresh has only a handful of
genuinely new documents. `update` fetches the listing, diffs it against what is
already stored, and resolves only what it has not seen:

```
Listing returned 280 documents; 277 already stored.
Resolving 3 new document(s)...

  added 3:
    + 2026-08-27  2026-08-27 Conservation Commission Agenda
    + 2026-08-25  City Council Agenda - August 25, 2026
    + 2026-08-12  2026-8-12-Abatement Agenda
```

When nothing is new there is no date resolving to do, and the run finishes
almost immediately.

### What a run reports

```
Listing returned 281 documents; 281 already stored.
No new documents in the listing.

  280 meetings, 279 with a resolved date
  documents: 275, 1 with a page written, 274 linking straight to the city's PDF
```

Most documents have no page here and are not meant to — the calendar links those
straight to the city's PDF. The count moves when somebody writes one, not when a
script runs. See [document-pages.md](./document-pages.md).

### Manual corrections survive both scripts

`update` only ever appends, so existing records are left untouched. `rebuild`
re-derives everything — but both re-apply `reviews.json` afterwards, so a
correction recorded there survives either. That was not true of edits made
directly in `meetings.json`, which a rebuild still discards.

### `--prune`

```sh
npm run calendar:update -- --prune
```

Also removes stored records that have disappeared from the listing. Off by
default, because a transient upstream glitch would otherwise delete history from
the dataset.

## Reading the summary

Both scripts print the same summary:

```
  280 meetings, 279 with a resolved date
  range: 2025-01-07 -> 2026-08-27
  date sources: meeting-date=265, title=13, filename=1, none=1
  documents: 275, 1 with a page written, 274 linking straight to the city's PDF

  13 need review (no date, or an ambiguous filename date):
    - 2025-10-23  CityCouncil_9.23.25_minutes  [meeting-date]  citycouncil_92325_minutes.pdf
    - 2025-03-18  February 18, 2025 Administration & Finance Minutes  [meeting-date]  adminfin_21825_minutes.pdf
    …
  reviews: 10 outstanding, 3 signed off, 1 carrying corrections
```

Each flagged line is `date  title  [dateSource]  filename`. `dateSource` says
which step of the chain in [dates.md](./dates.md) produced the date that was
kept; the filename is there because it is usually the thing that disagrees, and
is what you search for to pull up the document and settle it.

In the first line above, the media page puts the meeting on 23 October while
both the title and the PDF's own name say 23 September — so the calendar is
probably a month out. In the second, the title and filename agree on 18 February
against a stored 18 March. Not every flag is an error: an agenda revised on the
18th for a meeting on the 20th trips the same check and is perfectly correct.

To settle one, open the city's PDF from the calendar entry and see what date
it carries. Then edit its entry in `src/lib/data/reviews.json`:

```json
"citycouncil_92325_minutes::citycouncil_92325_minutes.pdf": {
	"needsReview": false,
	"date": "2025-09-23"
}
```

Set `needsReview` to `false` to sign it off, and add a `date` if the stored one
is wrong — any field you put there overlays the scraped record. Entries are
created for you the first time a record is flagged, so you are editing a list
that already exists rather than writing one.

Corrections live in their own file so `calendar:rebuild` re-applies them instead
of discarding them. See
[data-format.md](./data-format.md#corrections-reviewsjson).

What to watch for:

| Signal                             | Meaning                                                       |
| ---------------------------------- | ------------------------------------------------------------- |
| `meeting-date` count drops sharply | media pages changed shape — check the `Meeting Date` selector |
| `none` count climbs                | new title formats the parsers do not handle                   |
| total count collapses              | scraping is broken; see below                                 |
| review list grows                  | new upstream contradictions worth eyeballing                  |
| `failed` appears at all            | a conversion error — those are retried on the next run        |

A handful of flagged records is normal and expected — the city's data genuinely
contradicts itself in about 4% of cases.

## After refreshing

The data file is a build input, so the site needs rebuilding to pick it up:

```sh
npm run build
npm test
```

Then commit `src/lib/data/meetings.json`. The diff is readable because records
are written sorted and pretty-printed.

## Troubleshooting

### The listing returns nothing

Almost certainly the hardcoded block identifiers in
[`scripts/lib/haverhill.mjs`](../scripts/lib/haverhill.mjs) went stale, which
happens if the city rebuilds the Agendas and Minutes page.

Recover them from the live page:

```sh
curl -s https://www.haverhillma.gov/government/agendas-and-minutes/ \
  | grep -oE '<input type="hidden" id="(pagekey|contentkey|settingskey)[^>]*>'
```

That prints the current `pagekey`, `contentkey`, and `settingskey`. Update
`PAGE_KEY`, `CONTENT_KEY`, and `SETTINGS_KEY` to match.

If the endpoint path itself moved, find the new one in the page's inline
JavaScript:

```sh
curl -s https://www.haverhillma.gov/government/agendas-and-minutes/ \
  | grep -oE "url: '[^']*'"
```

### Requests fail with 400 or 403

The antiforgery handshake is failing. The endpoint needs the
`__RequestVerificationToken` **and** the cookie set alongside it, as a matched
pair. Confirm `openSession()` is still finding both — a redesign could rename the
hidden input.

### Dates land on the wrong day

Check whether `Meeting Date` values still render as raw UTC. The one-day
rollback applies only to records showing `12:00 AM`; if the city fixes its
timezone handling, that correction becomes wrong and should be removed from
`parseMeetingDate()`. The tests in
[`haverhill.spec.mjs`](../scripts/lib/haverhill.spec.mjs) pin the current
behaviour, so they will need updating together.

A quick check — City Council should sit overwhelmingly on Tuesdays:

```sh
node -e "
const ms=require('./src/lib/data/meetings.json').meetings;
const c={};
for (const m of ms.filter(m=>m.board==='City Council'&&m.date)) {
  const [y,mo,d]=m.date.split('-').map(Number);
  const wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(Date.UTC(y,mo-1,d)).getUTCDay()];
  c[wd]=(c[wd]||0)+1;
}
console.log(c);"
```

Expect Tuesday to dominate. A pile of Wednesdays means the rollover correction
has stopped working.

### A document links to the city instead of to a page here

That is the default and not a fault: a page exists only where somebody has
written one. See [document-pages.md](./document-pages.md) for how to add one.

If a page you have written is not being linked to, check that its directory is
named exactly `<docId>` — the id from `meetings.json`, including the hash — that
the page inside it is called `+page.svelte`, and rebuild.

### A whole board disappears

Board names come from the listing's category column, which is sometimes empty; in
those cases `classify()` falls back to the title and PDF filename. A new board
whose filenames use an unfamiliar abbreviation may land in `Other`. Add the
abbreviation to the lookup table in `guessBoard()`.

## Adding a new source

The scraper is written against one specific listing. Pointing it at another —
the city's agenda or minutes _archives_, for instance, which cover earlier years
— means supplying that page's own three block identifiers. The parsing, date
resolution, and classification are all reusable as-is, since the archive pages
use the same Umbraco document-listing component.

## Testing

```sh
npm run test:unit -- --run   # 75 unit tests
npm run test:e2e             # 11 end-to-end tests
npm test                     # both
npm run check                # svelte-check
npm run lint                 # prettier + eslint
```

Unit tests cover the parsers, date helpers and PDF-to-HTML conversion with no
network access — the conversion heuristics are tested against inline fixtures
rather than real PDFs, so no binary is needed either. The end-to-end tests run
against a real production build. Neither touches the city's servers, so the
whole suite works offline.

## What needs your attention

Every run ends with the same block, and it is the last thing printed:

```
──────────────────────────────────────────────────────────────────────────
  NEEDS YOUR ATTENTION -- 159 record(s)

        1  No date could be resolved at all
       75  The document's own filename contradicts its date
       84  The city's own link is broken

  Every one of them, with the file to open:
    .cache/needs-attention.txt
```

The counts are complete and the full list is written to a file rather than
truncated into the console — the summary used to print fifteen records and "and
62 more", which named the problem without giving anyone a way to work through
it. The file groups records by what is wrong with them, says what to do about
each kind, and gives the city's own filename and URL for every one.

Then `npm run cache -- --review` fetches those documents, and the answer goes in
[`reviews.json`](./data-format.md#corrections-reviewsjson).

**Broken links are only counted once `links:check` has run.** Whether a URL
resolves is a fact about the city's site today rather than about the record, so
it is not stored in `meetings.json`; it lives in `.cache/link-status.json` and is
reused between runs, so only newly-added documents are fetched. The block says
so when it has never run.
