#!/usr/bin/env node
/**
 * Add the agendas and minutes some boards keep on their own pages.
 *
 * They are not in the city's "Agendas and Minutes" listing -- the Planning
 * Board and the Zoning Board of Appeals keep theirs on their own pages instead,
 * as plain links to the CDN, back to 2017 and 2018. The listing holds one of
 * the Planning Board's and none of the Zoning Board's, so without this the
 * calendar shows two boards that meet every month as having met once and never.
 *
 * One request and no media pages to resolve, so there is no incremental mode:
 * every run replaces this board's records, the way `budget:update` replaces the
 * budget listing. Records from the listing are left exactly as they are.
 *
 * **`source` is what keeps the two apart.** Each record now says which scrape
 * produced it, and each scrape only ever replaces its own. Without that,
 * `calendar:update --prune` would delete every record here on its next run --
 * they are not in the listing it prunes against, which is the whole point of
 * this script.
 */
import { LISTING_URL, resolveDocument } from "./lib/haverhill.mjs"
import { BOARD_PAGES, fetchBoardDocuments } from "./lib/board-pages.mjs"
import { loadStore, saveStore, printSummary } from "./lib/store.mjs"
import { assignIds, pagesWritten } from "./lib/documents.mjs"
import {
  applyReviews,
  loadReviews,
  saveReviews,
  summarizeReviews,
  syncReviews,
} from "./lib/reviews.mjs"

const store = await loadStore()
if (!store) {
  console.error("No existing calendar data. Run `npm run calendar:rebuild` first.")
  process.exit(1)
}

const OWNED = new Set(BOARD_PAGES.map((p) => p.url))

const links = await fetchBoardDocuments()
if (links.length < BOARD_PAGES.length) {
  console.error("A board page returned no documents. Its markup has changed.")
  process.exit(1)
}

// No media page to fetch: the date is in the link's own label and nowhere else.
const scraped = await Promise.all(links.map((doc) => resolveDocument(doc, { fetchPage: false })))
for (const record of scraped) {
  record.source = BOARD_PAGES.find((p) => new URL(p.url).pathname === record.pageUrl).url
}

// Everything this script does not own, with its provenance filled in where a
// record predates the field. Records were all from the listing until now.
const others = store.meetings
  .filter((m) => !OWNED.has(m.source))
  .map((m) => ({ ...m, source: m.source ?? LISTING_URL }))

const before = store.meetings.length - others.length
const meetings = [...others, ...scraped]

const reviews = await loadReviews()
syncReviews(meetings, reviews)
applyReviews(meetings, reviews)
await saveReviews(reviews)

assignIds(meetings)
await saveStore(meetings, { source: LISTING_URL })

console.log(`\n  ${scraped.length} documents from ${BOARD_PAGES.length} board pages`)
console.log(`  ${before} replaced, ${others.length} records from elsewhere untouched`)
printSummary(meetings, await pagesWritten())
summarizeReviews(reviews)
