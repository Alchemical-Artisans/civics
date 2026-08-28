# How the meeting calendar works

This project publishes a browsable calendar of public meeting documents —
agendas and minutes — for the City of Haverhill, Massachusetts. The city
publishes those documents through a searchable file listing that is awkward to
browse and impossible to see chronologically. This site turns that listing into a
month calendar where every entry opens either as a page written here, with a
link to the original at the top, or as the city's own PDF.

## Documentation map

| Document                                 | What it covers                                                      |
| ---------------------------------------- | ------------------------------------------------------------------- |
| [scraping.md](./scraping.md)             | How documents are pulled off the city's site                        |
| [dates.md](./dates.md)                   | How a meeting date is determined, and why that is hard              |
| [data-format.md](./data-format.md)       | The `meetings.json` schema, field by field                          |
| [document-pages.md](./document-pages.md) | Writing a page for a meeting document, and why they are hand-made   |
| [calendar-page.md](./calendar-page.md)   | How the page renders, filters, and prerenders                       |
| [operations.md](./operations.md)         | Running the scripts, refreshing data, and what to do when it breaks |
| [deployment.md](./deployment.md)         | How the site is published to GitHub Pages                           |

## The shape of the system

There are two halves, joined by a committed data file and nothing else.

```mermaid
flowchart LR
    subgraph city["haverhillma.gov"]
        L["Agendas & Minutes<br/>listing"]
        E["Umbraco filter<br/>endpoint"]
        M["per-document<br/>media pages"]
        P["PDFs on CDN"]
    end

    subgraph build["Build time (a developer's machine)"]
        S["scripts/<br/>rebuild &amp; update"]
        J["src/lib/data/<br/>meetings.json"]
        V["vite build"]
    end

    subgraph hand["Written by hand"]
        D["src/routes/calendar/documents/<br/>&lt;id&gt;/+page.svelte"]
    end

    subgraph runtime["Runtime (the reader's browser)"]
        H["prerendered<br/>/calendar"]
        O["prerendered<br/>/calendar/documents/&lt;id&gt;"]
    end

    L --> E --> S
    M --> S
    D --> V
    S --> J --> V --> H --> O
    H -. "links out to" .-> P
    O -. "links out to" .-> P
```

The important property: **the reader's browser never talks to the city's
servers**, except to follow a link to a PDF — which, for a document with no page
written here, is where the calendar entry goes. All scraping happens ahead of
time, the results are committed to the repository, and the page is prerendered
to static HTML. Nothing about the site depends on the city's site being up, fast, or
CORS-friendly.

## Why the data is committed

The site uses `@sveltejs/adapter-static`, so every route is prerendered at build
time and served as plain files. That rules out fetching at request time, and
fetching from the browser would fail on CORS anyway. Committing the scraped data
also means:

- The data is reviewable. A refresh shows up as a readable diff.
- Builds are reproducible and offline. CI never depends on the city's uptime.
- Manual corrections survive, in `reviews.json`, across a full rebuild. See
  [dates.md](./dates.md) for why that matters.

## Files at a glance

```
scripts/
  lib/haverhill.mjs        scraping and parsing: the endpoint, dates, classification
  lib/haverhill.spec.mjs   unit tests for the parsers
  lib/documents.mjs        document ids, and which ids have a page written
  lib/documents.spec.mjs   unit tests for ids and de-duplication
  lib/store.mjs            reading and writing meetings.json, run summaries
  lib/reviews.mjs          the corrections overlay
  lib/reviews.spec.mjs     unit tests for it
  rebuild-calendar.mjs     full re-scrape
  update-calendar.mjs      incremental refresh

src/lib/
  calendar.ts              pure date/grouping helpers used by the page
  calendar.spec.ts         unit tests for those helpers
  router.ts                every internal URL the site builds, in one place
  router.spec.ts           unit tests for it
  data/meetings.json       the committed dataset
  data/reviews.json        human corrections, overlaid onto it

src/routes/
  +page.svelte             `/`, which forwards to /calendar
  page.svelte.e2e.ts       end-to-end tests for that forward

src/routes/calendar/
  +page.ts                 build-time load: trims and de-duplicates records
  +page.svelte             the calendar UI
  page.svelte.e2e.ts       end-to-end tests
  documents/+layout.ts         looks a document's metadata up by id
  documents/+layout.svelte     title, date and links to the city's own copy
  documents/<id>/+page.svelte  a hand-written document page, one directory each
  documents/page.svelte.e2e.ts end-to-end tests for them

static/
  CNAME                    the custom domain, published with the build
  .nojekyll                stops GitHub Pages discarding _app/

.github/workflows/
  deploy.yml               build and publish to GitHub Pages on push to main
```

## Current dataset

As of the last refresh: **281 documents** spanning **2025-01-07 to 2026-08-27**,
across 10 boards. 280 resolve to a date; the one that does not is a schedule
document rather than a meeting. Those become **275 document pages** — a few PDFs
are published under two media pages each, and one listing row has no file at all.
A page is written for a document when somebody writes one; the rest link
straight to the city's PDF, which [document-pages.md](./document-pages.md)
explains.

| Board                              | Documents |
| ---------------------------------- | --------: |
| City Council                       |       138 |
| Conservation Commission            |        50 |
| License Commission                 |        43 |
| Administration & Finance Committee |        30 |
| Board of Assessors                 |         7 |
| Board of Registrars                |         5 |
| Health Department                  |         2 |
| Water Department                   |         2 |
| Cultural Council                   |         2 |
| Planning Board                     |         1 |

These numbers move every time the data is refreshed; the scripts print an updated
summary on each run.
