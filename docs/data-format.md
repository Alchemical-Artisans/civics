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
| `pageUrl`     | string         | Path to the document's media page on haverhillma.gov.          |
| `fileUrl`     | string \| null | Direct CDN link to the PDF. Null for one current record.       |
| `category`    | string         | e.g. `City Council Minutes`. Sometimes empty.                  |
| `description` | string         | Usually empty in the listing.                                  |

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

### Fields from the document conversion

Written by the conversion pass in
[`scripts/lib/documents.mjs`](../scripts/lib/documents.mjs); see
[pdf-conversion.md](./pdf-conversion.md).

| Field       | Type           | Meaning                                                        |
| ----------- | -------------- | -------------------------------------------------------------- |
| `docId`     | string \| null | Address of the document's page, `/calendar/documents/<docId>`. |
| `docStatus` | status \| null | How far conversion got: see below.                             |
| `docError`  | string         | Only present while `docStatus` is `failed`: why it failed.     |

`docStatus` is one of `converted`, `scanned`, `unsupported`, `too-large` or
`failed`. Only `converted` has a file in `src/lib/data/documents/`; the rest fall
back to an embedded PDF viewer on the page.

Both are null for the one record with no `fileUrl` — there is nothing to convert,
so it has no page, and the calendar links it to the city's media page instead.

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

`docId` and `docStatus` are rewritten by the conversion pass on every run, so
there is no point editing those.
