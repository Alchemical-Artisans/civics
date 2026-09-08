#!/usr/bin/env node
/**
 * Re-scrape the meeting rules printed on the "Agendas and Minutes" page.
 *
 * One request and a handful of sentences, so there is no incremental mode and
 * no rebuild to go with it -- every run replaces the file, the way
 * `budget:update` does.
 *
 * Nothing here turns a rule into dates. That is `src/lib/schedule.ts`, which is
 * written against a particular wording and pins it in a test; if this scrape
 * changes the words, that test fails and a person re-reads the rule before the
 * calendar projects anything from it. A silently misread rule would put
 * meetings on the calendar that the Council never intended to hold.
 */
import { writeFile, mkdir, readFile } from "node:fs/promises"
import path from "node:path"
import { LISTING_URL, fetchMeetingRules } from "./lib/schedule.mjs"

export const DATA_FILE = path.join(import.meta.dirname, "..", "src", "lib", "data", "schedule.json")

const before = await readFile(DATA_FILE, "utf8")
  .then((raw) => JSON.parse(raw).rules)
  .catch((err) => {
    if (err.code === "ENOENT") return null
    throw err
  })

const rules = await fetchMeetingRules()
if (!rules.length) {
  console.error("No meeting rules found on the listing page. The page's markup has changed.")
  process.exit(1)
}

await mkdir(path.dirname(DATA_FILE), { recursive: true })
await writeFile(
  DATA_FILE,
  JSON.stringify({ generatedAt: new Date().toISOString(), source: LISTING_URL, rules }, null, 2) +
    "\n",
)

console.log(`\n  ${rules.length} board rule(s) from ${LISTING_URL}`)
for (const rule of rules) console.log(`    ${rule.board}: ${rule.exceptions.length} exception(s)`)

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
