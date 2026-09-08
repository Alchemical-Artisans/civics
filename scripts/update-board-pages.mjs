#!/usr/bin/env node
/**
 * Add every agenda and minutes the city publishes outside its main listing.
 *
 * Two kinds. The Planning Board and the Zoning Board of Appeals keep theirs on
 * their own pages, as plain links to the CDN, back to 2017 and 2018 -- the
 * listing holds one of the first and none of the second. And the listing itself
 * only reaches back to 2025: under it sit an Agenda Archive and a Minutes
 * Archive holding some 1,600 more, back to 2012, which are the bulk of the
 * city's published record.
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
import { ARCHIVE_PAGES, fetchArchives } from "./lib/archives.mjs"
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

const ORIGIN = "https://www.haverhillma.gov"
const OWNED = new Set([
  ...BOARD_PAGES.map((p) => p.url),
  ...ARCHIVE_PAGES.map((p) => ORIGIN + p.path),
])

const links = await fetchBoardDocuments()
const archived = await fetchArchives()
if (links.length < BOARD_PAGES.length || archived.documents.length < ARCHIVE_PAGES.length) {
  console.error("A page returned no documents. Its markup has changed.")
  process.exit(1)
}

// No media page to fetch: the date is in the link's own label and nowhere else.
const scraped = await Promise.all(
  [...links, ...archived.documents].map((doc) => resolveDocument(doc, { fetchPage: false })),
)
for (const record of scraped) {
  record.source ??= BOARD_PAGES.find((p) => new URL(p.url).pathname === record.pageUrl).url
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

console.log(
  `\n  ${scraped.length} documents: ${links.length} from ${BOARD_PAGES.length} board pages, ` +
    `${archived.documents.length} from ${ARCHIVE_PAGES.length} archives`,
)
console.log(
  `  ${archived.reattributed.length} archived documents filed under the board their own ` +
    `title names rather than the heading above them`,
)
if (archived.skipped.length) {
  console.log(`  ${archived.skipped.length} archived links skipped, no readable date:`)
  for (const s of archived.skipped.slice(0, 5)) console.log(`    - ${s.title.slice(0, 60)}`)
}
console.log(`  ${before} replaced, ${others.length} records from elsewhere untouched`)
printSummary(meetings, await pagesWritten())
summarizeReviews(reviews)
