# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A SvelteKit site that republishes the City of Haverhill's public meeting
documents — agendas and minutes — as a browsable month calendar at
<https://haverhill.alchemicalartisans.com>. Scraping happens ahead of time on a
developer's machine and the results are committed, so the build is offline and
the reader's browser never talks to the city's servers.

`docs/` is the authoritative reference and is unusually complete. Start at
[docs/README.md](docs/README.md), which maps the rest:
`scraping.md`, `dates.md`, `data-format.md`, `document-pages.md`,
`calendar-page.md`, `operations.md`, `deployment.md`.

## Commands

```sh
npm run dev                 # vite dev server
npm run build               # prerender the whole site into build/
npm run check               # svelte-check against tsconfig
npm run lint                # prettier --check . && eslint .
npm run format              # prettier --write .

npm run test                # unit (once) then e2e
npm run test:unit           # vitest, watch mode
npm run test:e2e            # playwright; builds and previews on :4173 first

npm run calendar:update     # scrape only documents new since the last run
npm run calendar:rebuild    # re-scrape everything (only when scrape/date logic changed)
npm run storybook           # storybook on :6006
```

Vitest runs three projects — `client` (browser, `*.svelte.{test,spec}.ts`),
`server` (node, other `*.spec.ts` plus `scripts/**/*.spec.mjs`), and
`storybook`. To narrow a run:

```sh
npm run test:unit -- --run --project=server src/lib/calendar.spec.ts
npm run test:unit -- --run --project=server -t "name of the test"
npx playwright test src/routes/calendar/page.svelte.e2e.ts
```

`test.expect.requireAssertions` is on, so a test with no assertion fails.

## Architecture

Two halves joined by one committed data file and nothing else.

**Scrapers (`scripts/`)** run by hand, never in CI. `lib/haverhill.mjs` replays
the AJAX POST the city's listing page makes to an Umbraco surface controller
(three hardcoded content keys plus an antiforgery token/cookie handshake), parses
the returned HTML table by regex, and resolves each document's date from its own
media page. `lib/documents.mjs` assigns `docId`; `lib/store.mjs` reads/writes
`meetings.json`; `lib/reviews.mjs` overlays `src/lib/data/reviews.json`.

**Data (`src/lib/data/`).** `meetings.json` is committed and is the only link
between the halves. Hand corrections go in `reviews.json`, keyed by
`<pageUrl slug>::<pdf filename>` — not `docId` — and are re-applied by both
scripts, so they survive a full rebuild. Editing `meetings.json` directly does
not survive `calendar:rebuild`.

**Site (`src/routes/`).** Fully prerendered — `src/routes/+layout.ts` sets
`prerender = true` for `@sveltejs/adapter-static`, so every `+page.ts` is a
build-time load. `src/lib/meetings.ts` turns `meetings.json` into what the site
shows: it drops undated records, collapses PDFs published under two media pages,
trims to the fields the UI needs, and groups the documents into meetings.

**A calendar entry is a meeting, not a document.** The city publishes an agenda
and its minutes separately; they are two documents about one sitting, matched on
board and date, which is all the listing gives to match on. An entry opens
`/calendar/meetings/<board-slug>-<date>`, which lists that sitting's documents —
each linking to a write-up here when one exists and to the city's PDF when not.
That route is the **only** one with a parameter, and it prerenders because
`+page.ts` exports `entries()`; everything else, hand-written pages included, is
a static route.

**Document pages are hand-written, one static route each**, at
`src/routes/calendar/documents/<docId>/+page.svelte`, with an agenda item
optionally getting `<docId>/<item-slug>/+page.svelte` beneath it. There is no
registry: `src/lib/meetings.ts` globs `../routes/calendar/documents/*/+page.svelte`
to decide whether a document links to a page here or straight to the city's PDF,
and `documents/+layout.ts` derives the id from the URL segment after `documents`
and looks the record up in `meetings.json`. Adding a page is one file; a data
refresh cannot contradict it.

Notable pieces:

- **`src/lib/router.ts`** builds _every_ internal URL. Never write a path inline
  and never use SvelteKit's `resolve()` — `Router` applies `base` (the
  `BASE_PATH` env knob for a non-root deploy) exactly once, and
  `svelte/no-navigation-without-resolve` is disabled because of it.
- **`src/lib/calendar.ts`** holds the pure date/grouping helpers, deliberately
  outside the component so they unit-test without rendering. All dates are
  `YYYY-MM-DD` strings and `Date.UTC(...)`; the local-time constructor shifts
  meetings into the wrong cell west of UTC.
- **SvelteKit is configured inside `vite.config.ts`**, not `svelte.config.js` —
  there is no such file. Runes mode is forced for everything outside
  `node_modules`.
- `src/lib/paraglide/` is generated (gitignored); `src/stories/`,
  `src/lib/vitest-examples/` and `src/routes/demo/` are `sv create` scaffolding
  the e2e suite still drives.

## Writing a document page

See [docs/document-pages.md](docs/document-pages.md) for the full procedure. The
rules that bite:

- The page is the write-up and nothing else — no `<script>`, no title, nothing
  restated from `meetings.json`. It renders inside `<article class="prose">`,
  so plain semantic markup is enough and headings start at `<h2>`.
- Transcribe the document verbatim. Do not paraphrase or write prose of your
  own; the city's numbering and wording are kept as printed. Only the agenda
  outline is transcribed, not the packet behind it.
- Outbound links get `target="_blank" rel="external noopener noreferrer"`.
  Literal `{`/`}` must be written `&lbrace;`/`&rbrace;`.
- Time, room, remote link and standing notices go in a sibling `+page.ts`
  returning `{ details: … }` (`MeetingDetails` in `src/lib/calendar.ts`) — never
  in the prose, and only when the document states them. It is `details` and not
  `meeting` because a `Meeting` is a sitting, with documents under it. Clock
  times from `meetings.json` are unreliable and are never displayed.
- An item page's `+page.ts` returns `{ item: { title } }`.
- PDF pages cut out for one item are committed under `static/excerpts/<id>/`
  and linked with `Router.excerpt(...)`; `.cache/` is gitignored, so re-cutting
  means re-fetching the original.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci` and
`npm run build` and publishes `build/` to GitHub Pages. No tests run there and
nothing is scraped. `static/CNAME` and `static/.nojekyll` are part of the build
on purpose — see [docs/deployment.md](docs/deployment.md).

## Style

Prettier config is non-default and enforced by `npm run lint`: no semicolons,
double quotes, 2-space indent, trailing commas, 100-column width. Comments in
this codebase explain _why_ a thing is the way it is, often at length; match
that when touching them.
