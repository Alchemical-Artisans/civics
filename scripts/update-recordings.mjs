#!/usr/bin/env node
/**
 * Add the video of a sitting, where Haverhill Community Television has one.
 *
 * HC Media records the City Council, the School Committee and the License
 * Commission and posts each meeting to its own site. That recording is the best
 * account there is of what a meeting was actually like, and it is on none of
 * the city's pages -- so without this the calendar links an agenda and its
 * minutes and never the thing itself.
 *
 * **A recording is attached to a sitting the calendar already has, never left
 * to create one on its own say-so.** The day and body are read off a title a
 * volunteer typed, which is weaker evidence than a city document; a recording
 * is worth carrying beside an agenda and not, by default, worth standing on
 * its own. So this matches each one against the rest of `meetings.json` on
 * board and date, keeps the matches, and writes the rest with `orphan: true`
 * -- off the site, and in the run's attention report for a person to place,
 * wave off, or -- `"orphan": false` in reviews.json -- promote by hand once
 * they judge the title names a real, if undocumented, sitting. It runs after
 * the scrapes that add city documents, so the thing it matches against is
 * current.
 *
 * `source` keeps it from colliding with those scrapes: like the board pages and
 * the notice documents, every record here names this scrape and each run
 * replaces only its own.
 */
import { LISTING_URL } from "./lib/haverhill.mjs"
import { RECORDINGS_ORIGIN, RECORDING_BODIES, fetchRecordings } from "./lib/recordings.mjs"
import { loadStore, saveStore, printSummary } from "./lib/store.mjs"
import { printAttention } from "./lib/attention.mjs"
import { createLog } from "./lib/log.mjs"
import { assignIds, pagesWritten } from "./lib/documents.mjs"
import {
  applyReviews,
  loadReviews,
  saveReviews,
  summarizeReviews,
  syncReviews,
} from "./lib/reviews.mjs"
import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"

const store = await loadStore()
if (!store) {
  console.error("No existing calendar data. Run `npm run calendar:rebuild` first.")
  process.exit(1)
}

/** The one `source` this script owns. */
const SOURCE = `${RECORDINGS_ORIGIN}/`

const log = createLog("recordings")
console.log("  reading Haverhill Community Television...")
const { records, unrecognised, pagesRead } = await fetchRecordings()
log.write(`  ${pagesRead} listing pages read, ${records.length} recordings placed to a body`)

// An empty sweep is a markup change at HC Media, not every recording vanishing.
// Writing the file from it would drop every record this scrape owns.
if (!records.length) {
  console.error("No recordings found. HC Media's category markup has changed.")
  process.exit(1)
}

// The sittings the calendar already knows about: any dated, still-live record
// from another scrape. A recording that matches one of these is kept beside its
// documents; one that matches nothing is an orphan -- the title's day or body
// is wrong, or the city has published nothing for a meeting HC Media filmed.
const others = store.meetings.filter((m) => m.source !== SOURCE)
const sittings = new Set(others.filter((m) => m.date && !m.gone).map((m) => `${m.board}|${m.date}`))

const scraped = records.map((rec) => ({
  title: rec.title,
  description: "",
  pageUrl: rec.url,
  fileUrl: null,
  date: rec.date,
  board: rec.board,
  kind: "recording",
  category: `${rec.board} Recordings`,
  dateSource: "recording",
  rawMeetingDate: null,
  dateAdjusted: false,
  dateConflict: false,
  filenameDate: null,
  needsReview: false,
  orphan: !sittings.has(`${rec.board}|${rec.date}`),
  source: SOURCE,
}))

const before = store.meetings.length - others.length
const meetings = [...others, ...scraped]

const reviews = await loadReviews()
syncReviews(meetings, reviews)
applyReviews(meetings, reviews)
await saveReviews(reviews)

assignIds(meetings)
await saveStore(meetings, { source: LISTING_URL })

const orphans = scraped.filter((m) => m.orphan)
const boards = new Set(scraped.map((m) => m.board))
log.write(`\n  ${scraped.length} recordings across ${boards.size} bodies`)
log.write(`  ${scraped.length - orphans.length} matched a sitting, ${orphans.length} did not`)
log.write(`  ${before} replaced, ${others.length} records from elsewhere untouched`)
printSummary(meetings, await pagesWritten(), log.write)
summarizeReviews(reviews)
console.log(`  full run detail: ${log.file}`)

// The titles that named no body at all. Opt-in the way the notices' own
// unrecognised list is: a recording reaches the calendar only once someone has
// taught `RECORDING_BODIES` to place its title. Rewritten every run, empty
// included, so a stale list never outlives the pattern that answered it.
const CACHE = path.join(import.meta.dirname, "..", ".cache")
const unrecognisedFile = path.join(CACHE, "unrecognised-recordings.txt")
mkdirSync(CACHE, { recursive: true })
writeFileSync(
  unrecognisedFile,
  `Recording titles no body in scripts/lib/recordings.mjs recognises, ` +
    `as of ${new Date().toISOString()}\n\n` +
    (unrecognised.length
      ? unrecognised
          .map((u) => `  ${String(u.count).padStart(3)}x  ${u.title}\n${" ".repeat(9)}${u.url}\n`)
          .join("\n") +
        `\nWhere one is a body this site carries, add it to RECORDING_BODIES ` +
        `(there are ${RECORDING_BODIES.length} now) and run \`npm run recordings:update\` again.\n`
      : "None -- every recording title placed to a body.\n"),
)
if (unrecognised.length) {
  const total = unrecognised.reduce((n, u) => n + u.count, 0)
  console.log(`\n  ${total} recording(s) under ${unrecognised.length} title(s) matched no body:`)
  console.log(`    ${unrecognisedFile}`)
}

printAttention(meetings)
