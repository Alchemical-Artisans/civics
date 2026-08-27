/** Load/save helpers for the committed calendar data file. */
import { readFile, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

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

export async function saveStore(meetings, { source }) {
  // Sort newest first, then by title so the diff is stable between runs.
  const sorted = [...meetings].sort(
    (a, b) => (b.date ?? "").localeCompare(a.date ?? "") || a.title.localeCompare(b.title),
  )
  const payload = {
    generatedAt: new Date().toISOString(),
    source,
    count: sorted.length,
    meetings: sorted,
  }
  await mkdir(path.dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(payload, null, "\t") + "\n")
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

export function printSummary(meetings) {
  const s = summarize(meetings)
  console.log(`\n  ${s.total} meetings, ${s.dated} with a resolved date`)
  if (s.range) console.log(`  range: ${s.range[0]} -> ${s.range[1]}`)
  console.log(
    `  date sources: ${Object.entries(s.bySource)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ")}`,
  )
  if (s.review.length) {
    console.log(`\n  ${s.review.length} need review (no date, or an ambiguous filename date):`)
    for (const m of s.review.slice(0, 15)) {
      console.log(`    - ${m.date ?? "????-??-??"}  ${m.title}  [${m.dateSource}]`)
    }
    if (s.review.length > 15) console.log(`    ... and ${s.review.length - 15} more`)
  }
}
