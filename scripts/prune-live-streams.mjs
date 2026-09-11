#!/usr/bin/env node
/**
 * Drop a meeting's live-stream link once its sitting is over.
 *
 * `remote.stream` names Haverhill Community Television's channel 8 -- the
 * address an agenda gestures at ("will be broadcast over HCTV and WHAV")
 * without printing, so the write-up links the channel itself. That is a live
 * stream, not a recording: useful the evening of the sitting, and pointing at
 * whatever channel 8 happens to be airing every day after. The video of the
 * sitting, when HC Media posts one, arrives separately through
 * `update-recordings.mjs` under its own `kind: "recording"`; this script's
 * only job is to stop pointing a reader at a live channel for a meeting that
 * already happened.
 *
 * Meeting write-ups are hand-written, not scraped, so this edits
 * `src/routes/calendar/meetings/<id>/+page.ts` files directly rather than
 * `meetings.json`. The id already carries the date -- board slug, then date,
 * `meetingId()`'s own rule -- so no store lookup is needed to know whether a
 * sitting is over.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { meetingDateOf, withoutStream } from "./lib/streams.mjs"

const MEETINGS_DIR = path.join(import.meta.dirname, "..", "src", "routes", "calendar", "meetings")

// The city's day, not the machine's -- from eight in the evening here the
// machine's own UTC date is already tomorrow, which would call tonight's
// sitting over before it has happened. See update-schedule.mjs.
const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" })

let changed = 0

for (const entry of readdirSync(MEETINGS_DIR, { withFileTypes: true })) {
  // `[meeting]` is the dynamic route, not a write-up.
  if (!entry.isDirectory() || entry.name.startsWith("[")) continue

  const date = meetingDateOf(entry.name)
  if (!date || date >= today) continue

  const file = path.join(MEETINGS_DIR, entry.name, "+page.ts")
  let before
  try {
    before = readFileSync(file, "utf8")
  } catch {
    continue // No +page.ts -- nothing states a stream link to drop.
  }

  const after = withoutStream(before)
  if (after === before) continue

  writeFileSync(file, after)
  changed++
  console.log(`  ${entry.name}: dropped the live-stream link (met ${date})`)
}

console.log(
  changed
    ? `\n  ${changed} live-stream link${changed === 1 ? "" : "s"} removed; review the diff before committing`
    : "  no stale live-stream links",
)
