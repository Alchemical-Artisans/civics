# Operations

## The two scripts

```sh
npm run calendar:update    # add documents published since the last run
npm run calendar:rebuild   # re-scrape everything from scratch
```

**Use `update` for routine refreshes.** Reach for `rebuild` only when the
scraping or date logic itself has changed.

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

When nothing is new it exits immediately without touching the file.

### `update` preserves manual edits

`update` only ever appends. Existing records are left untouched, so hand-made
date corrections survive indefinitely. `rebuild` re-derives everything and
discards them.

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

  13 need review (no date, or an ambiguous filename date):
    - 2025-10-23  CityCouncil_9.23.25_minutes  [meeting-date]
    …
```

What to watch for:

| Signal                             | Meaning                                                       |
| ---------------------------------- | ------------------------------------------------------------- |
| `meeting-date` count drops sharply | media pages changed shape — check the `Meeting Date` selector |
| `none` count climbs                | new title formats the parsers do not handle                   |
| total count collapses              | scraping is broken; see below                                 |
| review list grows                  | new upstream contradictions worth eyeballing                  |

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
npm run test:unit -- --run   # 50 unit tests
npm run test:e2e             # 7 end-to-end tests
npm test                     # both
npm run check                # svelte-check
npm run lint                 # prettier + eslint
```

Unit tests cover the parsers and date helpers with no network access; the
end-to-end tests run against a real production build. Neither touches the city's
servers, so the whole suite works offline.
