#!/usr/bin/env node
/**
 * Add every agenda the city hangs off a meeting notice and publishes nowhere
 * else.
 *
 * The events calendar is where Haverhill files its Open Meeting Law postings,
 * and a notice can carry the agenda as an attachment. The law requires the
 * notice to list the topics, so that file *is* the agenda -- "Public Meeting
 * Notice / Board of Assessors / Anticipated Topics for Discussion", stamped by
 * the city clerk. For most of these bodies it is the only agenda the city
 * publishes anywhere: the document listing covers five boards, and the
 * Retirement Board, the Library Trustees, the Harbor Commission, the historic
 * commissions and the School Committee's subcommittees are not among them.
 *
 * Kept apart from `schedule:update`, which reads the same calendar, because the
 * two want different windows and answer different questions. Sittings are
 * forward-only -- for a day already past the documents are the better authority
 * -- while these *are* documents, and the document half of this site is
 * entirely retrospective. So this sweeps every month the calendar carries and
 * that one sweeps to the end of the year.
 *
 * **`source` is what keeps this from colliding with the other scrapes.** Every
 * record says which scrape produced it and each scrape replaces only its own,
 * exactly as `update-board-pages.mjs` does -- without it `calendar:update
 * --prune` would delete all of these on its next run, since none of them is in
 * the listing it prunes against.
 */
import { LISTING_URL } from "./lib/haverhill.mjs"
import { NOTICE_CALENDAR, fetchNoticeDocuments, writeUnrecognised } from "./lib/notices.mjs"
import { loadStore, saveStore, printSummary } from "./lib/store.mjs"
import { printAttention } from "./lib/attention.mjs"
import { assignIds, newMeetingIds, pagesWritten, printNewMeetings } from "./lib/documents.mjs"
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
const SOURCE = `${NOTICE_CALENDAR.origin}/`

// The city's day, not the machine's: from eight in the evening here the
// machine's own UTC date is already tomorrow, which would ask the calendar for
// a month that does not exist yet on 31 December.
const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" })

console.log("  reading the city's events calendar...")
const { documents, notices, fetched, unrecognised } = await fetchNoticeDocuments({ today })
console.log(`  ${notices} meeting notices, ${fetched} pages read, ${documents.length} files`)

// An empty sweep is a markup change rather than the city having taken every
// agenda down, and a file written from it would drop every record this script
// owns. Zero notices is the giveaway; zero *files* is conceivable.
if (!notices) {
  console.error("No notices found on the events calendar. Its markup has changed.")
  process.exit(1)
}

/**
 * The records, built rather than resolved.
 *
 * `resolveDocument` exists to work a date out of a title, a filename and a
 * media page, and here there is nothing to work out: the city posted this
 * notice for this day, which is better evidence than any string in a filename.
 * Only twelve of these files carry a readable date at all, and the five that
 * disagree are scans stamped a day or two before the sitting -- so the filename
 * is recorded in `description` and deliberately not treated as a contradiction.
 *
 * `classify` is not used either, and this is the one scrape that should not.
 * Everywhere else the board has to be recovered from strings the city wrote for
 * other purposes, which is why `update-board-pages.mjs` hands it its board as
 * `category` and lets `classify` read it back out the same way it reads a
 * listing row. Here `classifyNotice` has already decided, against a list a
 * person keeps -- and `classify` would take that answer apart, because it
 * splits a category on commas (the listing's own are comma-separated lists) and
 * two of these boards have a comma in the name the city gives them: "Public
 * Health, Safety & Works Committee" would arrive as "Public Health".
 *
 * The kind is `agenda` for all of them, and structurally rather than by
 * guessing: the law requires a meeting notice to carry the topics, so the file
 * on a notice is the agenda. Minutes are approved afterwards and are never
 * attached to the notice of the meeting they record. Nothing on the calendar
 * contradicts it -- no attached file's name and no notice title carrying one
 * contains the word "minutes".
 */
const scraped = documents.map(({ board, ...doc }) => ({
  ...doc,
  board,
  kind: "agenda",
  category: `${board} Agendas`,
  dateSource: "notice",
  rawMeetingDate: null,
  dateAdjusted: false,
  dateConflict: false,
  filenameDate: null,
  needsReview: false,
  source: SOURCE,
}))

const others = store.meetings.filter((m) => m.source !== SOURCE)
const before = store.meetings.length - others.length
const meetings = [...others, ...scraped]

const reviews = await loadReviews()
syncReviews(meetings, reviews)
applyReviews(meetings, reviews)
await saveReviews(reviews)

const newIds = newMeetingIds(store.meetings, meetings)

assignIds(meetings)
await saveStore(meetings, { source: LISTING_URL })

const boards = new Set(scraped.map((m) => m.board))
console.log(`\n  ${scraped.length} agendas across ${boards.size} boards`)
console.log(`  ${before} replaced, ${others.length} records from elsewhere untouched`)
printNewMeetings(newIds)
printSummary(meetings, await pagesWritten())
summarizeReviews(reviews)

// The same list `schedule:update` writes, from the same sweep -- a body nobody
// has filed in BODIES has its agendas passed over here as well as its sittings.
const file = writeUnrecognised(unrecognised)
if (unrecognised.length) {
  const total = unrecognised.reduce((n, u) => n + u.count, 0)
  console.log(`\n  ${total} notice(s) under ${unrecognised.length} title(s) matched no body.`)
  console.log(`  Any that is a city board wants a line in BODIES in scripts/lib/notices.mjs:`)
  console.log(`    ${file}`)
}

printAttention(meetings)
