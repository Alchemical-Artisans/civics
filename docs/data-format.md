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

`rawMeetingDate` is retained deliberately: every automatic correction stays
auditable, and the original is always recoverable without re-scraping.

## Record identity

Neither `pageUrl` nor `fileUrl` is unique on its own:

- Two different documents share the media page `agenda-and-minutes-5`.
- Five PDFs appear under two media pages each.

The **pair** is unique across all 280 records, so `documentKey()` joins them:

```js
`${doc.pageUrl}::${doc.fileUrl ?? ''}`;
```

This is what `calendar:update` diffs on. Using either field alone would silently
drop or duplicate records.

## What the page consumes

The page does not use this file verbatim. At build time
[`src/routes/calendar/+page.ts`](../src/routes/calendar/+page.ts):

1. drops records with no `date`,
2. collapses duplicate PDFs, preferring a record not flagged `needsReview`, and
3. keeps only `title`, `date`, `board`, `kind`, `fileUrl`, `pageUrl`.

Scraper bookkeeping fields never reach the browser. See
[calendar-page.md](./calendar-page.md).

## Editing by hand

Hand-editing is supported and sometimes the right answer, particularly for the
contradictory records described in [dates.md](./dates.md).

`calendar:update` **never rewrites an existing record** — it only appends ones it
has not seen — so manual corrections survive routine refreshes. Setting
`needsReview` to `false` after checking a document also removes it from the
warning count in the page footer.

The exception is `calendar:rebuild`, which discards the file and re-derives
everything. Any manual edits are lost. Prefer `update` unless you specifically
want a clean slate.
