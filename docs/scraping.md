# Scraping the city's document listing

All of this lives in [`scripts/lib/haverhill.mjs`](../scripts/lib/haverhill.mjs).

## The problem with the listing page

The city's [Agendas and Minutes
page](https://www.haverhillma.gov/government/agendas-and-minutes/) looks like a
searchable list of documents. It is not, in any form a scraper can read directly.
Fetching the HTML gives you filter controls and this:

```html
<div id="docListing-1352311367" class="docListing"></div>
```

An empty container. The document rows arrive afterwards, over AJAX. There is
exactly one PDF link in the whole page and it is an unrelated participation form.

## Replaying the request instead

Rather than drive a headless browser, the scraper replays the request the page's
own JavaScript makes. It is a `POST` to an Umbraco surface controller:

```
POST https://www.haverhillma.gov/umbraco/surface/DocumentManager/GetDocumentsByFilters
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
RequestVerificationToken: <token>
Cookie: <paired antiforgery cookie>
```

The body identifies which document-listing block on which page to query:

| Field                                     | Value                                  | Meaning                      |
| ----------------------------------------- | -------------------------------------- | ---------------------------- |
| `contentPageId`                           | `12437`                                | the Agendas and Minutes page |
| `blockContentKeyId`                       | `0a375e52-71a5-4b77-a81d-d140b10479fc` | the listing block            |
| `blockSettingsKeyId`                      | `db2f2ad8-3c61-42ad-985b-bd2b0d6dc284` | that block's settings        |
| `page` / `pageSize`                       | `1` / `2000`                           | pagination                   |
| `keyword`, `data`, `startDate`, `endDate` | empty                                  | filters, deliberately unset  |
| `culture`                                 | `en-US`                                | required by the controller   |

Those three keys are hardcoded constants. **If the city rebuilds that page, the
keys change and scraping breaks.** See
[operations.md](./operations.md#the-listing-returns-nothing) for how to recover
them.

### Antiforgery handshake

The endpoint rejects unauthenticated posts, so `openSession()` first `GET`s the
listing page and takes two things from it:

1. the `__RequestVerificationToken` hidden input value, sent as a header, and
2. the `Set-Cookie` values, sent back as a `Cookie` header.

They are a matched pair. Sending the token without its cookie fails.

### One request, everything

`pageSize` is set to 2000 — comfortably above the ~280 documents that exist — so
the entire listing comes back in a single response and pagination never has to be
walked. If the collection ever outgrows that, raise the number; the response is
only ~25KB per 5 documents of HTML, so even the full listing is small.

## Parsing rows

The response is an HTML table, not JSON. `parseListing()` pulls each
`<tr class="document-item">` apart into:

| Field         | Source                                           |
| ------------- | ------------------------------------------------ |
| `title`       | the anchor text in the first cell                |
| `pageUrl`     | that anchor's `href` — the document's media page |
| `fileUrl`     | the `https://media-…` "View" link (CDN-hosted)   |
| `category`    | the second cell, e.g. `City Council Minutes`     |
| `description` | the third cell, usually empty                    |

HTML entities are decoded here, so `Administration &amp; Finance` becomes
`Administration & Finance`.

Regex parsing is deliberate. The markup is simple and stable, and this avoids a
DOM-parser dependency for what is a handful of predictable shapes. The parser is
covered by unit tests in
[`scripts/lib/haverhill.spec.mjs`](../scripts/lib/haverhill.spec.mjs).

## Fetching the dates

The listing alone is not enough — see [dates.md](./dates.md) for why. Each
document's media page must also be fetched to read its authoritative `Meeting
Date` field, which is one request per document.

That asymmetry — one cheap request for the listing, ~280 expensive ones for the
dates — is the entire reason there are two scripts rather than one. See
[operations.md](./operations.md).

## Being a good citizen

- **Concurrency is capped at 6** (`mapLimit`), so a rebuild is a brief, modest
  burst rather than 280 simultaneous connections.
- **Failures are retried up to three attempts** with quadratic backoff, waiting
  400ms after the first failure and 1.6s after the second.
- **A browser `User-Agent` is sent.** The endpoint is inconsistent otherwise.
- A missing media page (404) yields `null` rather than aborting the run.

## Classification

`classify()` derives a board and a document kind from each record. The category
is the primary signal — `City Council Minutes` splits into board `City Council`
and kind `minutes`.

Some records have no category at all. Those are titled `Agenda and Minutes (N)`
and carry nothing useful in the title either, so classification falls back to the
PDF filename, which is often the only place the owning board is named:
`boa-mtg-min-4212026.pdf` identifies the Board of Assessors. Without that
fallback, seven records land in an `Other` bucket.
