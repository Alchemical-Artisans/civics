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
 *
 * The run ends by handing each newly-discovered sitting to `transcribe-meeting.mjs`,
 * which is the one part of this that wants a person: a scrape says the Planning
 * Board sat on the 9th, and writing that meeting up is what turns the row into a
 * page. Doing it here is only what a person did by hand anyway -- every scrape
 * already printed the ids and the command to paste them into. `--no-transcribe`
 * skips it, for a run that is only meant to refresh the data.
 */
import { spawnSync } from "node:child_process"
import path from "node:path"
import { loadStore } from "./lib/store.mjs"
import { meetingsToTranscribe, pagesWritten } from "./lib/documents.mjs"

const STEPS = [
  { name: "calendar", script: "update-calendar.mjs" },
  // After the calendar: it replaces these boards' records in the same file, and
  // running it second means a `--prune` pass has already settled the listing's.
  { name: "board pages", script: "update-board-pages.mjs" },
  // After the board pages, and before the schedule: it owns a `source` of its
  // own in the same file, and it is a document scrape rather than a schedule
  // one however much it shares a page with the next step.
  { name: "notice documents", script: "update-notice-documents.mjs" },
  // The School Committee's own page on the Haverhill Public Schools site --
  // another `source` of its own, another body nothing else in the pipeline
  // covers.
  { name: "school committee", script: "update-hps-documents.mjs" },
  // After every scrape that adds a city document, because it matches its
  // recordings against them and keeps only the ones that land on a sitting.
  { name: "recordings", script: "update-recordings.mjs" },
  // Right after recordings, so a sitting that gets both in the same run loses
  // its stale live-stream link and gains the real video together. No scrape
  // and no `source` of its own -- it only compares each write-up's own date
  // against today's -- so it could run anywhere in this list without changing
  // what it does.
  { name: "live streams", script: "prune-live-streams.mjs" },
  { name: "budget", script: "update-budget.mjs" },
  { name: "schedule", script: "update-schedule.mjs" },
  // Last, and after everything that can add a document: it checks every link
  // the calendar carries, and ends with the run's "needs your attention" block.
  { name: "links", script: "check-links.mjs" },
]

const args = process.argv.slice(2)
const failed = []
let attempted = 0

/** Run one script to completion with its output going straight to the terminal. */
function step(name, script, extra = []) {
  attempted++
  console.log(`${attempted > 1 ? "\n" : ""}${"=".repeat(60)}\n  ${name}\n${"=".repeat(60)}`)

  const { status, error } = spawnSync(
    process.execPath,
    [path.join(import.meta.dirname, script), ...extra, ...args],
    { stdio: "inherit" },
  )

  if (error) failed.push(`${name}: ${error.message}`)
  else if (status !== 0) failed.push(`${name}: exited ${status}`)
}

// What the calendar held before any of this ran, so the new sittings can be
// named at the end. Read here rather than diffed step by step because a sitting
// is board-and-date: the notices scrape and the recordings scrape can both land
// on the same new meeting, and each on its own would call it new.
const before = (await loadStore())?.meetings ?? []
const written = await pagesWritten()

for (const { name, script } of STEPS) step(name, script)

// After the attention report rather than before it: transcribing is the part
// that stops and waits for a person, and a block of counts printed above an
// hour of writing is a block nobody reads.
if (!args.includes("--no-transcribe")) {
  const after = (await loadStore())?.meetings ?? []
  const fresh = meetingsToTranscribe(before, after, written)
  if (fresh.length) {
    console.log(
      `\n${"=".repeat(60)}\n  ${fresh.length} new sitting(s) to write up\n${"=".repeat(60)}`,
    )
    for (const id of fresh) console.log(`    ${id}`)
    console.log("  Each opens a Claude Code session in turn; --no-transcribe skips them.")
    for (const id of fresh) step(`transcribe ${id}`, "transcribe-meeting.mjs", [id])
  }
}

console.log(`\n${"=".repeat(60)}`)
if (failed.length) {
  console.log(`  ${failed.length} of ${attempted} steps failed:`)
  for (const f of failed) console.log(`    - ${f}`)
  console.log("  Anything that did succeed has already been written.")
  process.exit(1)
}
console.log(`  all ${attempted} steps finished; review the diff before committing`)
