#!/usr/bin/env node
/**
 * Incrementally add documents published since the last build.
 *
 * The listing is a single cheap request; the expensive part is the per-document
 * media page. So we diff the listing against what we already have (keyed on the
 * document's page URL) and only resolve genuinely new entries. Records already
 * stored are left untouched, including any manual date corrections.
 *
 * Every run also builds the HTML copy of any document that does not have one
 * yet, so a page missing its converted text is picked up on the next refresh
 * even when the listing itself has not changed.
 *
 * Pass --prune to also drop stored entries no longer present in the listing,
 * --recheck to retry documents previously found to be unconvertible, and
 * --no-cache to re-download PDFs rather than reuse the local copies.
 */
import {
  fetchListing,
  resolveDocument,
  mapLimit,
  documentKey,
  LISTING_URL,
} from "./lib/haverhill.mjs"
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
const prune = process.argv.includes("--prune")
const recheck = process.argv.includes("--recheck")
const noCache = process.argv.includes("--no-cache")
const maxMb = Number(
  process.argv.find((a) => a.startsWith("--max-mb="))?.split("=")[1] ?? DEFAULT_MAX_MB,
)

await ensurePoppler()

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
  // Not an early exit: documents added before conversion existed, or whose
  // last attempt failed, still need their HTML built.
  console.log("No new documents in the listing.")
}

let meetings = [...store.meetings, ...added]

let removed = 0
if (prune) {
  const live = new Set(docs.map(documentKey))
  const before = meetings.length
  meetings = meetings.filter((m) => live.has(documentKey(m)))
  removed = before - meetings.length
}

const reviews = await loadReviews()
const addedReviews = syncReviews(meetings, reviews)
applyReviews(meetings, reviews)
await saveReviews(reviews)

console.log("Building HTML for documents that do not have it yet...")
const conversion = await convertMissing(meetings, {
  maxMb,
  noCache,
  recheck,
  onProgress: reportProgress,
  onDownload: reportDownload,
})
console.log(
  `  ${conversion.documents} document(s) known, ${conversion.fetched} fetched, ` +
    `${conversion.converted} converted.`,
)
reportCache(conversion.cache)

await saveStore(meetings, { source: LISTING_URL })

if (added.length) {
  console.log(`\n  added ${added.length}:`)
  for (const m of added.slice(0, 20)) console.log(`    + ${m.date ?? "????-??-??"}  ${m.title}`)
  if (added.length > 20) console.log(`    ... and ${added.length - 20} more`)
}
if (prune) console.log(`  pruned ${removed} entry(ies) no longer in the listing`)
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
