# Operations

## The two scripts

```sh
npm run calendar:update    # add documents published since the last run
npm run calendar:rebuild   # re-scrape everything from scratch
```

**Use `update` for routine refreshes.** Reach for `rebuild` only when the
scraping or date logic itself has changed.

Both need [poppler](https://poppler.freedesktop.org/) on the PATH
(`sudo apt install poppler-utils`), which they check for before doing any work.
See [pdf-conversion.md](./pdf-conversion.md).

### Why there are two

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

When nothing is new there is no date resolving to do, but the run continues: it
still builds the HTML for any document that does not have it yet.

### Both scripts also convert documents

After the dates are resolved, every document without HTML on disk is fetched and
converted. The run reports what happened:

```
Building HTML for documents that do not have it yet...
  274 document(s) known, 0 fetched, 0 converted.
  cache: 275 file(s), 2.1 GB in .cache/documents (gitignored)

  280 meetings, 279 with a resolved date
  documents: scanned=186, converted=85, unsupported=4
```

`scanned` is the normal outcome for a City Council document, not a fault — see
[pdf-conversion.md](./pdf-conversion.md). A document is only fetched when it has
no HTML and no previously recorded reason it cannot have any, so a repeat run
costs one `stat` per document and no network at all.

**The first full run is slow**: it downloads the whole corpus, about 2.2 GB.
Every run after that is incremental — a document is fetched only if it is not
already in the cache.

### `--max-mb`

```sh
npm run calendar:update -- --max-mb=25
```

There is no size cap by default: every document is fetched, up to the 112 MB
Council packets. This opts into one, recording anything over the limit as
`too-large` and not downloading it. A stalled transfer is bounded by a
five-minute per-download timeout rather than by size.

`too-large` is not carried forward between runs the way `scanned` is, because it
depends on the cap rather than on the document — so changing `--max-mb` takes
effect on the next run without `--recheck`.

### `--recheck`

```sh
npm run calendar:update -- --recheck
```

Converts every document again, ignoring both the HTML already on disk and any
previously recorded reason a document could not be converted. This is what to
run after changing the conversion logic. With the PDF cache warm it does no
network I/O, so it is cheap despite touching everything.

Documents whose last attempt `failed` are always retried, without this flag.

### The document cache, and `--no-cache`

Every document is downloaded into `.cache/documents/`, which is gitignored —
roughly 2.2 GB. Everything is fetched, including the scans and `.docx` files that
will never convert, so that `--recheck` costs no network and so any document
flagged for review can be opened locally.

Canonical copies are named by document id, but every document is also symlinked
under the city's own filename in `.cache/by-name/`, which is the name the review
list prints:

```sh
find .cache -name full-agenda-73026.pdf
# .cache/by-name/full-agenda-73026.pdf
```

See [pdf-conversion.md](./pdf-conversion.md#two-ways-in).

```sh
rm -rf .cache/documents                 # reclaim the space; next run refetches
npm run calendar:update -- --no-cache   # ignore cached copies, download afresh
```

Reach for `--no-cache` only if you think the city has replaced a file at a URL it
had already published. A changed document normally gets a new URL, and therefore
a new cache entry, but that is a convention of their CMS rather than a guarantee.

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
  documents: scanned=186, converted=85, unsupported=4

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

To settle one, open the file — `find .cache -name <filename>` — and see what date
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
| `converted` count drops            | conversion is failing, or the city is publishing more scans   |
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

### `pdftohtml not found`

The conversion step needs poppler:

```sh
sudo apt install poppler-utils   # Debian/Ubuntu
brew install poppler             # macOS
```

Both scripts check for it before scraping, so this fails fast rather than part
way through a run.

### Documents show "published as a scan" that should have text

Expected for most City Council output; see
[pdf-conversion.md](./pdf-conversion.md). If a document genuinely does have a
text layer, check it is under the `--max-mb` cap, then re-run with `--recheck` —
a document recorded as unconvertible is skipped on later runs.

### The converted text reads oddly

Tables and multi-column layouts reflow into one column. Reading order is right,
alignment is not. The document page keeps the original PDF linked at the top for
exactly this reason. If the reflow is wrong in a way that changes the _meaning_,
that is a bug in `scripts/lib/pdf-html.mjs` — its heuristics are unit-tested in
`pdf-html.spec.mjs`, so add the failing layout there as a fixture.

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
