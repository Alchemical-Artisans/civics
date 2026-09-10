#!/usr/bin/env node
/**
 * Refresh everything this site derives from the City of Haverhill.
 *
 * Two halves, five steps, one command. They stay separate scripts because
 * they are genuinely different jobs -- the calendar diffs a listing and then
 * resolves a media page per new document, the budget replaces twenty-two rows
 * in a single request, the schedule re-reads three sentences of prose off the
 * calendar's own listing page -- and any of them is worth running alone while
 * working on it. This is the one to run when you just want the site current.
 *
 * Steps run in sequence rather than in parallel: they hit the same host, and
 * interleaved progress output from two scrapers is unreadable.
 *
 * A failing step does not stop the ones after it. The calendar scrape is the
 * fragile one -- it replays an Umbraco request with three hardcoded content
 * keys, which will eventually stop working -- and there is no reason for that
 * to also block a budget refresh that would have succeeded. Every failure is
 * repeated at the end, where it cannot scroll past unnoticed, and the exit
 * status is non-zero if any step failed.
 *
 * Arguments are forwarded to every step, so `npm run metadata:update -- --prune`
 * reaches the calendar. The others take no flags and ignore them.
 */
import { spawnSync } from "node:child_process"
import path from "node:path"

const STEPS = [
  { name: "calendar", script: "update-calendar.mjs" },
  // After the calendar: it replaces these boards' records in the same file, and
  // running it second means a `--prune` pass has already settled the listing's.
  { name: "board pages", script: "update-board-pages.mjs" },
  // After the board pages, and before the schedule: it owns a `source` of its
  // own in the same file, and it is a document scrape rather than a schedule
  // one however much it shares a page with the next step.
  { name: "notice documents", script: "update-notice-documents.mjs" },
  // After every scrape that adds a city document, because it matches its
  // recordings against them and keeps only the ones that land on a sitting.
  { name: "recordings", script: "update-recordings.mjs" },
  { name: "budget", script: "update-budget.mjs" },
  { name: "schedule", script: "update-schedule.mjs" },
  // Last, and after everything that can add a document: it checks every link
  // the calendar carries, and ends with the run's "needs your attention" block.
  { name: "links", script: "check-links.mjs" },
]

const args = process.argv.slice(2)
const failed = []

for (const [i, step] of STEPS.entries()) {
  console.log(`${i ? "\n" : ""}${"=".repeat(60)}\n  ${step.name}\n${"=".repeat(60)}`)

  const { status, error } = spawnSync(
    process.execPath,
    [path.join(import.meta.dirname, step.script), ...args],
    { stdio: "inherit" },
  )

  if (error) failed.push(`${step.name}: ${error.message}`)
  else if (status !== 0) failed.push(`${step.name}: exited ${status}`)
}

console.log(`\n${"=".repeat(60)}`)
if (failed.length) {
  console.log(`  ${failed.length} of ${STEPS.length} steps failed:`)
  for (const f of failed) console.log(`    - ${f}`)
  console.log("  Anything that did succeed has already been written.")
  process.exit(1)
}
console.log(`  all ${STEPS.length} steps finished; review the diff before committing`)
