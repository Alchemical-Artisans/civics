#!/usr/bin/env node
/**
 * Add the School Committee's agendas, minutes and meeting materials from the
 * one page the city keeps them on -- the Haverhill Public Schools site.
 *
 * The School Committee is the one major Haverhill body nothing else in the
 * pipeline covers: the "Agendas and Minutes" listing and its archives are five
 * other boards, the events-calendar notices carry a School Committee agenda
 * only from June 2026 and never the packet, HC Media has the video alone. See
 * `scripts/lib/hps.mjs`.
 *
 * Same terms as `update-notice-documents.mjs` and `update-board-pages.mjs`: one
 * `source` of its own, and each run replaces only its own records, so
 * `calendar:update --prune` -- which drops stored records missing from the
 * listing -- leaves these alone.
 */
import { LISTING_URL } from "./lib/haverhill.mjs"
import { HPS_PAGE, fetchSchoolCommitteeDocuments } from "./lib/hps.mjs"
import { loadStore, saveStore, printSummary } from "./lib/store.mjs"
import { printAttention } from "./lib/attention.mjs"
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

/** The one `source` this script owns. Everything else is left exactly as it is. */
const SOURCE = HPS_PAGE

console.log("  reading the School Committee's meeting page...")
const { documents, sections, skippedHeadings, carriedHeadings, droppedAgendas } =
  await fetchSchoolCommitteeDocuments()
console.log(
  `  ${sections} sections, ${skippedHeadings.length} with no readable date, ` +
    `${documents.length} documents (${droppedAgendas} superseded agenda copies dropped)`,
)
for (const c of carriedHeadings) {
  console.log(`  "${c.heading}" -> ${c.date} (continuation of the block above, ${c.files} file(s))`)
}

const others = store.meetings.filter((m) => m.source !== SOURCE)
const before = store.meetings.length - others.length
const meetings = [...others, ...documents]

const reviews = await loadReviews()
syncReviews(meetings, reviews)
applyReviews(meetings, reviews)
await saveReviews(reviews)

assignIds(meetings)
await saveStore(meetings, { source: LISTING_URL })

const dates = new Set(documents.map((m) => m.date))
console.log(`\n  ${documents.length} documents across ${dates.size} sittings`)
console.log(`  ${before} replaced, ${others.length} records from elsewhere untouched`)
if (skippedHeadings.length) {
  console.log(`\n  headings that name no single sitting, skipped:`)
  for (const s of skippedHeadings) console.log(`    - ${s.heading}  (${s.files} file(s))`)
}
printSummary(meetings, await pagesWritten())
summarizeReviews(reviews)

printAttention(meetings)
