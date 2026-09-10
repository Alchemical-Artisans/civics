#!/usr/bin/env node
/**
 * Re-scrape what the city publishes about when its boards sit.
 *
 * Three kinds of page: the Council's standing rule, printed above the document
 * listing; the four boards that print their own dates; and the city's events
 * calendar, where every board files the notice the Open Meeting Law requires.
 * A request each -- a dozen for the calendar, one per month to the end of the
 * year -- so there is no incremental mode and no rebuild to go with it: every
 * run replaces the file, the way `budget:update` does.
 *
 * Nothing here turns a rule into dates. That is `src/lib/schedule.ts`, which is
 * written against a particular wording and pins it in a test; if this scrape
 * changes the words, that test fails and a person re-reads the rule before the
 * calendar projects anything from it. A silently misread rule would put
 * meetings on the calendar that the Council never intended to hold. The
 * Commission's dates need no such care -- they are already dates.
 */
import { writeFile, mkdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fetchMeetingCalendars, fetchMeetingRules } from "./lib/schedule.mjs"
import { NOTICE_CALENDAR, fetchNotices, writeUnrecognised } from "./lib/notices.mjs"

// The city's day, not the machine's. `en-CA` is the locale that formats a date
// as `YYYY-MM-DD`, which is the form everything here keeps dates in; the zone
// is what decides which day *now* is, and from eight in the evening here the
// machine's own UTC date is already tomorrow. It matters once a year: on 31
// December that would ask the calendar for a month that no longer exists.
const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" })

export const DATA_FILE = path.join(import.meta.dirname, "..", "src", "lib", "data", "schedule.json")

const before = await readFile(DATA_FILE, "utf8")
  .then((raw) => JSON.parse(raw).rules)
  .catch((err) => {
    if (err.code === "ENOENT") return null
    throw err
  })

const rules = await fetchMeetingRules()
const calendars = await fetchMeetingCalendars()
console.log("  reading the city's events calendar...")
const { notices, cancelled, unrecognised } = await fetchNotices({ today })

// An empty parse means a page's markup moved, not that the city stopped saying
// when its boards meet -- so it fails rather than quietly writing a file that
// would empty the calendar of every upcoming sitting.
if (!rules.length) {
  console.error("No meeting rules found on the listing page. The page's markup has changed.")
  process.exit(1)
}
if (!calendars.length) {
  console.error("No meeting calendars found. A board page's markup has changed.")
  process.exit(1)
}
// Zero notices is ordinary in a quiet December; zero notices *and* nothing
// unrecognised means the parse found no entries at all, which is the events
// calendar's markup having moved rather than the city having stopped posting.
if (!notices.length && !unrecognised.length) {
  console.error("No notices found on the events calendar. Its markup has changed.")
  process.exit(1)
}

await mkdir(path.dirname(DATA_FILE), { recursive: true })
await writeFile(
  DATA_FILE,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      rules,
      calendars,
      // The page the notices were read off, recorded here rather than rebuilt
      // from a notice's own URL: the footer lists it once however many boards
      // it accounts for, and what the city calls it is not in a URL.
      noticeCalendar: { name: NOTICE_CALENDAR.name, url: `${NOTICE_CALENDAR.origin}/` },
      notices,
      cancelled,
    },
    null,
    2,
  ) + "\n",
)

console.log()
for (const rule of rules)
  console.log(`  ${rule.board}: a rule, ${rule.exceptions.length} exceptions`)
for (const c of calendars) console.log(`  ${c.board}: ${c.sittings.length} dates for ${c.year}`)

const boards = new Set(notices.map((n) => n.board))
console.log(`\n  Events calendar: ${notices.length} notices across ${boards.size} boards`)
if (cancelled.length) {
  console.log(`  ${cancelled.length} of them say the sitting is off, and are not carried:`)
  for (const c of cancelled) console.log(`    ${c.date}  ${c.title}`)
}

// The same bargain the calendar scrape's own "needs your attention" block
// makes: a count and a path here, the full list where it can be read beside
// the work. Deliberately the last thing this run says.
const file = writeUnrecognised(unrecognised)
console.log(`\n${"\u2500".repeat(74)}`)
if (!unrecognised.length) {
  console.log("  Every notice on the events calendar matched a body.")
} else {
  const total = unrecognised.reduce((n, u) => n + u.count, 0)
  console.log(`  ${total} notice(s) under ${unrecognised.length} title(s) matched no body.`)
  console.log("  Most will be utility hearings, regional authorities and legal notices,")
  console.log("  which belong nowhere on this site. Any that is a city board wants a line")
  console.log("  in BODIES in scripts/lib/notices.mjs, or its sittings never reach the")
  console.log("  calendar at all.\n")
  for (const u of unrecognised.slice(0, 5)) {
    console.log(`    ${String(u.count).padStart(3)}x  ${u.title.slice(0, 62)}`)
  }
  if (unrecognised.length > 5) console.log(`\n  Every one of them:`)
  console.log(`    ${file}`)
}
console.log(`${"\u2500".repeat(74)}`)

// The wording is what the date logic is written against, so a change to it is
// the one thing worth shouting about on an otherwise silent run.
const changed =
  before &&
  JSON.stringify(before.map((r) => [r.board, r.intro, r.exceptions])) !==
    JSON.stringify(rules.map((r) => [r.board, r.intro, r.exceptions]))
if (changed) {
  console.log("\n  The wording changed. Re-read the rule and check src/lib/schedule.ts against it;")
  console.log("  schedule.spec.ts pins the text the current date logic assumes and will fail.")
}
