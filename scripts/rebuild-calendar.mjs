#!/usr/bin/env node
/**
 * Rebuild the calendar data from scratch.
 *
 * Fetches the full document listing and then every document's media page to read
 * its authoritative Meeting Date. That is one request per document (~280 today),
 * so prefer `npm run calendar:update` for routine refreshes.
 */
import { fetchListing, resolveDocument, mapLimit, LISTING_URL } from "./lib/haverhill.mjs"
import { saveStore, printSummary, DATA_FILE } from "./lib/store.mjs"

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

await saveStore(meetings, { source: LISTING_URL })
printSummary(meetings)
console.log(`\n  wrote ${DATA_FILE}`)
