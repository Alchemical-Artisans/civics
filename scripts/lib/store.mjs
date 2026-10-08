/** Load/save helpers for the committed calendar data file. */
import { readFile } from "node:fs/promises"
import path from "node:path"
import { summarizeDocuments } from "./documents.mjs"
import { writeDataFile } from "./data-file.mjs"

export const DATA_FILE = path.join(
  import.meta.dirname,
  "..",
  "..",
  "src",
  "lib",
  "data",
  "meetings.json",
)

export async function loadStore() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"))
  } catch (err) {
    if (err.code === "ENOENT") return null
    throw err
  }
}

/** Today in Haverhill, as `YYYY-MM-DD` -- `toISOString` names tomorrow from eight in the evening. */
const easternToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date())

/**
 * Minutes record a sitting that has already happened, so a file dated today or
 * later cannot be them. What the School Committee's page files under an
 * upcoming sitting is the previous sitting's minutes, posted for the Committee
 * to approve -- information about the minutes, not the minutes of that day --
 * and every scrape writes through here, so none of them can tag one as such.
 * The check is on the sitting's date, not the file's, and runs at write time:
 * `kind` is a fact about the record, and deciding it at build time would hand
 * the file to the sitting the day that sitting passed.
 */
export function withoutFutureMinutes(meetings, today = easternToday()) {
  return meetings.map((m) =>
    m.kind === "minutes" && m.date && m.date >= today ? { ...m, kind: "other" } : m,
  )
}

export async function saveStore(meetings, { source }) {
  // Sort newest first, then by title so the diff is stable between runs.
  const sorted = [...withoutFutureMinutes(meetings)].sort(
    (a, b) => (b.date ?? "").localeCompare(a.date ?? "") || a.title.localeCompare(b.title),
  )
  const payload = {
    generatedAt: new Date().toISOString(),
    source,
    count: sorted.length,
    meetings: sorted,
  }
  await writeDataFile(DATA_FILE, payload)
  return payload
}

export function summarize(meetings) {
  const dated = meetings.filter((m) => m.date)
  const review = meetings.filter((m) => m.needsReview)
  const bySource = {}
  for (const m of meetings) bySource[m.dateSource] = (bySource[m.dateSource] ?? 0) + 1
  const dates = dated.map((m) => m.date).sort()
  return {
    total: meetings.length,
    dated: dated.length,
    review,
    bySource,
    range: dates.length ? [dates[0], dates.at(-1)] : null,
  }
}

export function printSummary(meetings, written = new Set(), write = console.log) {
  const s = summarize(meetings)
  write(`\n  ${s.total} meetings, ${s.dated} with a resolved date`)
  if (s.range) write(`  range: ${s.range[0]} -> ${s.range[1]}`)
  write(
    `  date sources: ${Object.entries(s.bySource)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ")}`,
  )
  const docs = summarizeDocuments(meetings, written)
  if (docs.documents) {
    write(
      `  documents: ${docs.documents} across ${docs.meetings} sittings, ` +
        `${docs.withPage} written up here, ${docs.withoutPage} linking straight to the city's PDF`,
    )
  }
  // What needs a person is printed by `printAttention`, last and in full --
  // this used to end with fifteen flagged records and "and 62 more", which
  // named the problem without giving anyone a way to work through it.
}
