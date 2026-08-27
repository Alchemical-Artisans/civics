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
 * Documents whose HTML is already built are left alone. Statuses are carried
 * over from the existing data file too, so a rebuild does not re-download the
 * scans it already knows it cannot convert. Pass --recheck to drop that memory
 * and try every document again, and --no-cache to re-download PDFs rather than
 * reuse the local copies.
 */
import { fetchListing, resolveDocument, mapLimit, LISTING_URL } from "./lib/haverhill.mjs"
import { loadStore, saveStore, printSummary, DATA_FILE } from "./lib/store.mjs"
import { DEFAULT_MAX_MB, convertMissing, ensurePoppler } from "./lib/documents.mjs"
import {
  applyReviews,
  loadReviews,
  saveReviews,
  summarizeReviews,
  syncReviews,
} from "./lib/reviews.mjs"

const CONCURRENCY = 6
const recheck = process.argv.includes("--recheck")
const noCache = process.argv.includes("--no-cache")
const maxMb = Number(
  process.argv.find((a) => a.startsWith("--max-mb="))?.split("=")[1] ?? DEFAULT_MAX_MB,
)

await ensurePoppler()

const previous = await loadStore()
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

const known = previous
  ? new Map(previous.meetings.filter((m) => m.docId).map((m) => [m.docId, m.docStatus]))
  : new Map()

const reviews = await loadReviews()
const addedReviews = syncReviews(meetings, reviews)
applyReviews(meetings, reviews)
await saveReviews(reviews)

console.log("\nConverting documents to HTML...")
const conversion = await convertMissing(meetings, {
  maxMb,
  known,
  noCache,
  recheck,
  onProgress: reportProgress,
  onDownload: reportDownload,
})
reportCache(conversion.cache)

await saveStore(meetings, { source: LISTING_URL })
printSummary(meetings)
reportReviews(reviews, addedReviews)
console.log(`\n  wrote ${DATA_FILE}`)

function reportProgress(n, total, document, status) {
  process.stdout.write(`  converted ${n}/${total} (${status.padEnd(11)})\r`)
}

function reportDownload(n, total, document, outcome) {
  process.stdout.write(`  fetched ${n}/${total} (${outcome.padEnd(9)})\r`)
}

function reportCache(cache) {
  const mb = cache.bytes / 1024 / 1024
  const size = mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`
  console.log(`  cache: ${cache.files} file(s), ${size} in .cache/documents (gitignored)`)
}

function reportReviews(reviews, added) {
  const s = summarizeReviews(reviews)
  if (added.length) console.log(`  ${added.length} new entry(ies) in reviews.json to look at`)
  console.log(
    `  reviews: ${s.outstanding} outstanding, ${s.total - s.outstanding} signed off, ` +
      `${s.corrected} carrying corrections`,
  )
}
