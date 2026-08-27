#!/usr/bin/env node
/**
 * Incrementally add documents published since the last build.
 *
 * The listing is a single cheap request; the expensive part is the per-document
 * media page. So we diff the listing against what we already have (keyed on the
 * document's page URL) and only resolve genuinely new entries. Records already
 * stored are left untouched, including any manual date corrections.
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

if (!fresh.length && !prune) {
  console.log("Nothing new. Calendar is up to date.")
  process.exit(0)
}

let added = []
if (fresh.length) {
  console.log(`Resolving ${fresh.length} new document(s)...`)
  added = await mapLimit(fresh, CONCURRENCY, (doc) => resolveDocument(doc))
}

let meetings = [...store.meetings, ...added]

let removed = 0
if (prune) {
  const live = new Set(docs.map(documentKey))
  const before = meetings.length
  meetings = meetings.filter((m) => live.has(documentKey(m)))
  removed = before - meetings.length
}

await saveStore(meetings, { source: LISTING_URL })

if (added.length) {
  console.log(`\n  added ${added.length}:`)
  for (const m of added.slice(0, 20)) console.log(`    + ${m.date ?? "????-??-??"}  ${m.title}`)
  if (added.length > 20) console.log(`    ... and ${added.length - 20} more`)
}
if (prune) console.log(`  pruned ${removed} entry(ies) no longer in the listing`)
printSummary(meetings)
console.log(`\n  wrote ${DATA_FILE}`)
