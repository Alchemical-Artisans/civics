/** Load/save helpers for the committed calendar data file. */
import { readFile, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { summarizeDocuments } from "./documents.mjs"

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
  await writeFile(DATA_FILE, JSON.stringify(payload, null, 2) + "\n")
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
