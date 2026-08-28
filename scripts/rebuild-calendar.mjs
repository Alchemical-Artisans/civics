#!/usr/bin/env node
/**
 * Rebuild the calendar data from scratch.
 *
 * Fetches the full document listing and then every document's media page to read
 * its authoritative Meeting Date. That is one request per document (~280 today),
 * so prefer `npm run calendar:update` for routine refreshes.
 *
 * Corrections in reviews.json are re-applied afterwards, so a rebuild no longer
 * discards them.
 *
 * Nothing here touches the document pages. Those are written by hand and live
 * in src/lib/data/documents/; a rebuild only re-derives what the city has
 * published and which ids those documents answer to.
 */
import { fetchListing, resolveDocument, mapLimit, LISTING_URL } from "./lib/haverhill.mjs"
import { saveStore, printSummary, DATA_FILE } from "./lib/store.mjs"
import { assignIds, pagesWritten } from "./lib/documents.mjs"
import {
  applyReviews,
  loadReviews,
  saveReviews,
  summarizeReviews,
  syncReviews,
} from "./lib/reviews.mjs"

const CONCURRENCY = 6

const docs = await fetchListing()
console.log(`Listing returned ${docs.length} documents. Resolving dates...`)

let done = 0
const meetings = await mapLimit(docs, CONCURRENCY, async (doc) => {
  const rec = await resolveDocument(doc)
  if (++done % 25 === 0 || done === docs.length) {
    process.stdout.write(`  resolved ${done}/${docs.length}\r`)
  }
  return rec
})

const reviews = await loadReviews()
const addedReviews = syncReviews(meetings, reviews)
applyReviews(meetings, reviews)
await saveReviews(reviews)

assignIds(meetings)

await saveStore(meetings, { source: LISTING_URL })
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
