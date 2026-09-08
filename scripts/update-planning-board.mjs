#!/usr/bin/env node
/**
 * Add the Planning Board's own agendas and minutes to the calendar.
 *
 * They are not in the city's "Agendas and Minutes" listing -- the board keeps
 * them on its own page instead, as plain links to the CDN, back to November
 * 2017. The listing holds one of them, so without this the calendar shows a
 * board that meets every month as having met once.
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
import { PLANNING_BOARD_URL, fetchPlanningBoardDocuments } from "./lib/planning-board.mjs"
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

const links = await fetchPlanningBoardDocuments()
if (!links.length) {
  console.error("No Planning Board documents found. The page's markup has changed.")
  process.exit(1)
}

// No media page to fetch: the date is in the link's own label and nowhere else.
const scraped = await Promise.all(links.map((doc) => resolveDocument(doc, { fetchPage: false })))
for (const record of scraped) record.source = PLANNING_BOARD_URL

// Everything this script does not own, with its provenance filled in where a
// record predates the field. Records were all from the listing until now.
const others = store.meetings
  .filter((m) => m.source !== PLANNING_BOARD_URL)
  .map((m) => ({ ...m, source: m.source ?? LISTING_URL }))

const before = store.meetings.length - others.length
const meetings = [...others, ...scraped]

const reviews = await loadReviews()
syncReviews(meetings, reviews)
applyReviews(meetings, reviews)
await saveReviews(reviews)

assignIds(meetings)
await saveStore(meetings, { source: LISTING_URL })

console.log(`\n  ${scraped.length} Planning Board documents from its own page`)
console.log(`  ${before} replaced, ${others.length} records from the listing untouched`)
printSummary(meetings, await pagesWritten())
summarizeReviews(reviews)
