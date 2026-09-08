#!/usr/bin/env node
/**
 * Incrementally add documents published since the last build.
 *
 * The listing is a single cheap request; the expensive part is the per-document
 * media page. So we diff the listing against what we already have (keyed on the
 * document's page URL) and only resolve genuinely new entries. Records already
 * stored are left untouched, including any manual date corrections.
 *
 * Nothing here touches the document pages. Those are written by hand and live
 * in src/routes/calendar/documents/; a refresh only re-derives what the city has
 * published and which ids those documents answer to.
 *
 * Pass --prune to also drop stored entries no longer present in the listing.
 */
import {
  fetchListing,
  resolveDocument,
  mapLimit,
  documentKey,
  LISTING_URL,
} from "./lib/haverhill.mjs"
import { loadStore, saveStore, printSummary, DATA_FILE } from "./lib/store.mjs"
import { assignIds, pagesWritten } from "./lib/documents.mjs"
import {
  applyReviews,
  loadReviews,
  saveReviews,
  summarizeReviews,
  syncReviews,
} from "./lib/reviews.mjs"

const CONCURRENCY = 6
const prune = process.argv.includes("--prune")

const store = await loadStore()
if (!store) {
  console.error("No existing calendar data. Run `npm run calendar:rebuild` first.")
  process.exit(1)
}

const existing = new Map(store.meetings.map((m) => [documentKey(m), m]))
const docs = await fetchListing()
const fresh = docs.filter((d) => !existing.has(documentKey(d)))

console.log(`Listing returned ${docs.length} documents; ${existing.size} already stored.`)

let added = []
if (fresh.length) {
  console.log(`Resolving ${fresh.length} new document(s)...`)
  added = await mapLimit(fresh, CONCURRENCY, (doc) => resolveDocument(doc))
} else {
  console.log("No new documents in the listing.")
}

// Everything stored, with its provenance filled in where a record predates the
// field: until the Planning Board's own page was scraped, the listing was the
// only source there was.
let meetings = [
  ...store.meetings.map((m) => ({ ...m, source: m.source ?? LISTING_URL })),
  ...added.map((m) => ({ ...m, source: LISTING_URL })),
]

let removed = 0
if (prune) {
  const live = new Set(docs.map(documentKey))
  const before = meetings.length
  // Only records this scrape owns. The Planning Board publishes its agendas
  // and minutes on its own page rather than in this listing, so every one of
  // them is absent from `live` -- pruning against it blindly would delete the
  // lot. See scripts/update-planning-board.mjs.
  meetings = meetings.filter((m) => m.source !== LISTING_URL || live.has(documentKey(m)))
  removed = before - meetings.length
}

const reviews = await loadReviews()
const addedReviews = syncReviews(meetings, reviews)
applyReviews(meetings, reviews)
await saveReviews(reviews)

assignIds(meetings)

await saveStore(meetings, { source: LISTING_URL })

if (added.length) {
  console.log(`\n  added ${added.length}:`)
  for (const m of added.slice(0, 20)) console.log(`    + ${m.date ?? "????-??-??"}  ${m.title}`)
  if (added.length > 20) console.log(`    ... and ${added.length - 20} more`)
}
if (prune) console.log(`  pruned ${removed} entry(ies) no longer in the listing`)
printSummary(meetings, await pagesWritten())
reportReviews(reviews, addedReviews)
console.log(`\n  wrote ${DATA_FILE}`)

function reportReviews(reviews, added) {
  const s = summarizeReviews(reviews)
  if (added.length) console.log(`  ${added.length} new entry(ies) in reviews.json to look at`)
  console.log(
    `  reviews: ${s.outstanding} outstanding, ${s.total - s.outstanding} signed off, ` +
      `${s.corrected} carrying corrections`,
  )
}
