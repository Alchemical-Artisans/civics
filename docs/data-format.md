# The `meetings.json` format

Location: [`src/lib/data/meetings.json`](../src/lib/data/meetings.json). It is
committed to the repository and is the only thing connecting the scrapers to the
website.

## Envelope

```json
{
  "generatedAt": "2026-08-24T15:30:45.527Z",
  "source": "https://www.haverhillma.gov/government/agendas-and-minutes/",
  "count": 280,
  "meetings": [ … ]
}
```

| Field         | Meaning                                                     |
| ------------- | ----------------------------------------------------------- |
| `generatedAt` | ISO timestamp of the run that wrote the file                |
| `source`      | the listing the data came from, shown as a link on the page |
| `count`       | number of records, for a quick sanity check                 |
| `meetings`    | the records                                                 |

Records are sorted newest date first, then by title. That ordering is applied on
every write so refreshes produce readable diffs rather than reshuffled files.

## A record

```json
{
  "title": "2026-08-27 Conservation Commission Agenda",
  "pageUrl": "/document-manager/media-pages/agenda-and-minutes/2026-08-27-conservation-commission-agenda/",
  "fileUrl": "https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/verck2ga/20260827_hccagenda.pdf",
  "category": "Conservation Commission Agendas",
  "description": "",
  "board": "Conservation Commission",
  "kind": "agenda",
  "date": "2026-08-27",
  "dateSource": "meeting-date",
  "rawMeetingDate": "08/27/2026 07:15 PM",
  "dateAdjusted": false,
  "dateConflict": false,
  "filenameDate": null,
  "needsReview": false
}
```

### Fields as scraped

| Field         | Type           | Notes                                                          |
| ------------- | -------------- | -------------------------------------------------------------- |
| `title`       | string         | As published. Wildly inconsistent; see [dates.md](./dates.md). |
| `source`      | string         | Which scrape produced the record. See below.                   |
| `pageUrl`     | string         | Path to the document's media page on haverhillma.gov.          |
| `fileUrl`     | string \| null | Direct CDN link to the PDF. Null for one current record.       |
| `category`    | string         | e.g. `City Council Minutes`. Sometimes empty.                  |
| `description` | string         | Usually empty in the listing.                                  |

### Where a record came from

`source` names the page a record was scraped from, and **each scraper only ever
replaces its own**:

| `source`                                                       | Written by                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| `…/government/agendas-and-minutes/`                            | [`update-calendar.mjs`](../scripts/update-calendar.mjs)       |
| `…/boards-committees-and-commissions/planning-board/`          | [`update-board-pages.mjs`](../scripts/update-board-pages.mjs) |
| `…/boards-committees-and-commissions/zoning-board-of-appeals/` | the same                                                      |

This is not bookkeeping. The Planning Board and the Zoning Board of Appeals keep
their agendas and minutes on their own pages rather than in the city's listing —
163 back to November 2017 and 174 back to February 2018, of which the listing
holds one and none — so `calendar:update --prune`, which drops stored records no
longer in the listing, would delete every one of them. It prunes only records
whose `source` is the listing.

A record written before the field existed is backfilled with the listing on the
next run of either script, since until the board's page was scraped the listing
was the only source there was.

### Fields derived

| Field            | Type                                              | Notes                                                       |
| ---------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| `board`          | string                                            | From `category`, else title, else filename. Never empty.    |
| `kind`           | `agenda` \| `minutes` \| `other`                  | Derived from the same text.                                 |
| `date`           | `YYYY-MM-DD` \| null                              | The resolved meeting date. **This drives the calendar.**    |
| `dateSource`     | `meeting-date` \| `title` \| `filename` \| `none` | Which step of the chain produced `date`.                    |
| `rawMeetingDate` | string \| null                                    | Unmodified `Meeting Date` cell, e.g. `01/08/2025 12:00 AM`. |
| `dateAdjusted`   | boolean                                           | True if rolled back a day for the UTC rollover.             |
| `dateConflict`   | boolean                                           | True if the filename date contradicts `date`.               |
| `filenameDate`   | `YYYY-MM-DD` \| null                              | Unambiguous date read from the filename, if any.            |
| `needsReview`    | boolean                                           | No date, a conflict, or an ambiguous filename split.        |

### The document's identity

Assigned by [`scripts/lib/documents.mjs`](../scripts/lib/documents.mjs).

| Field   | Type           | Meaning                                                                |
| ------- | -------------- | ---------------------------------------------------------------------- |
| `docId` | string \| null | The document's permanent id, and the filename a page is written under. |

`docId` is null for the one record with no `fileUrl`: there is no document, so
there is nothing to write about and nothing to link to but the city's media
page.

**A `docId` does not mean a page exists.** Pages are written by hand, and
whether a document has one is decided by whether
`src/routes/calendar/meetings/<meeting id>/+page.svelte` is there — not by anything
recorded here.
A document with no page is linked straight to the city's PDF from the calendar.
See [document-pages.md](./document-pages.md).

**Records that share a `fileUrl` share a `docId`.** Five PDFs are published under
two media pages each; they are one document and get one page. The id is the media
page's slug plus a hash of the file URL, which keeps it stable: resolving a slug
collision by suffixing whichever document arrived second would change an existing
page's URL the day a new document landed.

`rawMeetingDate` is retained deliberately: every automatic correction stays
auditable, and the original is always recoverable without re-scraping.

## Record identity

Neither `pageUrl` nor `fileUrl` is unique on its own:

- Two different documents share the media page `agenda-and-minutes-5`.
- Five PDFs appear under two media pages each.

The **pair** is unique across all 280 records, so `documentKey()` joins them:

```js
;`${doc.pageUrl}::${doc.fileUrl ?? ""}`
```

This is what `calendar:update` diffs on. Using either field alone would silently
drop or duplicate records.

## What the page consumes

The page does not use this file verbatim. At build time
[`src/routes/calendar/+page.ts`](../src/routes/calendar/+page.ts):

1. drops records with no `date`,
2. collapses duplicate PDFs, preferring a record not flagged `needsReview`, and
3. keeps only `title`, `date`, `board`, `kind`, `fileUrl`, `pageUrl`, `docId`.

`docId` is what a calendar entry links to.

Scraper bookkeeping fields never reach the browser. See
[calendar-page.md](./calendar-page.md).

## Corrections: `reviews.json`

`src/lib/data/reviews.json` holds the decisions people make about records the
scraper could not settle. It is committed, and it is the file to edit by hand.

```json
{
  "citycouncil_92325_minutes::citycouncil_92325_minutes.pdf": {
    "needsReview": false,
    "date": "2025-09-23"
  },
  "agenda-and-minutes-4::mtg-boa-11182025.pdf": {
    "needsReview": true
  }
}
```

**The key** is the media page's slug and the PDF's filename. Neither is unique
alone — the city has two documents under `agenda-and-minutes-5` — but the pair
is, for the same reason [record identity](#record-identity) uses both. It is
deliberately not `docId`: that identifies a _document_, and two records sharing
one can carry different dates. Those shared-page records are among the likeliest
to need review, so a correction to one must not reach the other.

**`needsReview`** is what the summary counts. An entry appears set to `true` the
first time a record is flagged; set it to `false` once you have looked, and it
stops being reported.

**Every other field overlays the record**, replacing whatever was scraped, so a
corrected date is:

```json
{ "needsReview": false, "date": "2025-09-23" }
```

There is no separate marker for "this was set by hand" — an entry here carrying a
`date` _is_ that marker.

The overlay is applied after scraping and before anything is written, so
`meetings.json` and the calendar both show the corrected value. The scraper's own
evidence stays on the record: `rawMeetingDate`, `filenameDate` and `dateConflict`
are left alone, so why it was flagged is still visible after you settle it.

### Why it is a separate file

`calendar:update` never rewrites a stored record, so corrections made directly in
`meetings.json` do survive a refresh. `calendar:rebuild` re-derives every field
and would throw them away. Keeping decisions in their own file means both scripts
re-apply them, and a rebuild stops being destructive.

Entries are never removed automatically. A correction has to outlive the conflict
that prompted it — otherwise fixing a date would delete the fix.

## Editing by hand

Hand-editing is supported and sometimes the right answer, particularly for the
contradictory records described in [dates.md](./dates.md).

**Prefer [reviews.json](#corrections-reviewsjson) to editing `meetings.json`
directly.** Both survive `calendar:update`, which never rewrites a stored record.
Only `reviews.json` survives `calendar:rebuild`, which re-derives every field
from the city and would otherwise discard the decision.

Setting `needsReview` to `false` after checking a document removes it from the
run summary and from the warning count in the page footer.

`docId` is re-derived on every run from the file URL, so there is no point
editing it. To give a document a page, add the HTML file rather than changing
anything here.

## `schedule.json`, what the city says about when boards sit

Location: [`src/lib/data/schedule.json`](../src/lib/data/schedule.json), written
by [`update-schedule.mjs`](../scripts/update-schedule.mjs).

No board's schedule is a document in the listing. All are ordinary HTML on a
page — which is why the calendar could not see any of them while it read only
the listing; the scraper fetched one of those very pages for its antiforgery
token and threw the rest away. Rules and calendars are kept apart in this file
because they are different kinds of thing: one has to be read, the other is
already dates.

```json
{
  "generatedAt": "2026-09-08T14:33:02.118Z",
  "rules": [
    {
      "board": "City Council",
      "source": "https://www.haverhillma.gov/government/agendas-and-minutes/",
      "intro": "Regular meetings of the City Council shall be held every Tuesday at 7:00 o'clock P.M. except in:",
      "exceptions": ["June there shall be …", "From July until …", "In September, starting with …"]
    }
  ],
  "calendars": [
    {
      "board": "Conservation Commission",
      "source": "https://www.haverhillma.gov/…/conservation-commission/meeting-schedule/",
      "year": 2026,
      "heading": "2026 Meeting Schedule",
      "sittings": [
        {
          "date": "2026-01-08",
          "related": [
            { "label": "Submittal Date", "date": "2025-12-18" },
            { "label": "Postponement Date", "date": "2026-01-15" }
          ]
        }
      ],
      "time": "7:15 PM"
    },
    {
      "board": "License Commission",
      "source": "https://www.haverhillma.gov/government/boards-committees-and-commissions/license-commission/",
      "year": 2026,
      "heading": "CALENDAR OF MEETINGS FOR 2026",
      "sittings": [{ "date": "2026-01-08" }, { "date": "2026-02-05" }]
    }
  ]
}
```

### `rules` — a standing statement, which has to be read

| Field        | Meaning                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `board`      | The `<h2>` over the rule. Matched against `meetings.json`'s `board`.        |
| `source`     | The page it is printed on.                                                  |
| `intro`      | The sentence before the list, verbatim.                                     |
| `exceptions` | One string per `<li>`, verbatim, entities decoded and whitespace collapsed. |

**Only the words are stored.** Turning "the second Tuesday after Labor Day" into
a date is [`schedule.ts`](../src/lib/schedule.ts) on the site side, and the two
are kept honest by `RULE_AS_READ` — a copy of the exact wording the date logic
was written against, which `schedule.spec.ts` compares this file to. A reworded
rule fails the build instead of being silently reinterpreted.

### `calendars` — the dates themselves

| Field      | Meaning                                                                                                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `board`    | Named beside the URL in the scraper: the page is the board, and its heading names only the year. Must match `meetings.json`'s `board`.                                                                            |
| `source`   | The board's own page.                                                                                                                                                                                             |
| `year`     | From the heading.                                                                                                                                                                                                 |
| `heading`  | As printed, e.g. `CALENDAR OF MEETINGS FOR 2026` or `2026 Meeting Schedule`. A meeting page cites it.                                                                                                             |
| `sittings` | `{ date, related? }`, ascending by date. Sorted rather than read in document order, since one table runs in two columns. May run past `year` — a schedule's last row often carries the first sitting of the next. |
| `time`     | The hour the page states, e.g. `7:15 PM`, where it states one. Optional.                                                                                                                                          |

Nothing is interpreted, so nothing can be misread. `parseCalendarDate` handles
both forms the boards write — `January 8, 2026` and `1/8/2026`, the latter often
with the year left off — and refuses a day that does not exist in its month
rather than letting `new Date` roll it over into a plausible-looking wrong date.
An explicit year always beats the heading's.

To add a board that prints its dates, add it to `CALENDAR_PAGES` in
[`scripts/lib/schedule.mjs`](../scripts/lib/schedule.mjs): the URL, a `heading`
pattern whose capture group is the year, and — where the table holds more than
sittings — the `column` naming the one that does. See
[calendar-page.md](./calendar-page.md#adding-a-board). A board that prints a rule
instead needs its wording read into dates by hand in `schedule.ts`; there is no
guessing at one.

Every run replaces the file; there is no incremental mode. An empty parse of
either half is treated as a failure rather than written, because it means a
page's markup has changed shape — and a file written from it would empty the
calendar of every upcoming sitting.

See
[calendar-page.md](./calendar-page.md#sittings-the-city-has-said-it-will-hold)
for what the calendar does with it, and in particular why both are projected
forward only.
