/**
 * Human corrections and sign-off, kept separately from the scraped data.
 *
 * The city's dates contradict themselves in a few percent of cases (see
 * dates.md), so some records need a person to look at the document and decide.
 * That judgement has to outlive the scrape: `calendar:update` preserves existing
 * records, but `calendar:rebuild` re-derives every field from scratch and would
 * otherwise throw the decisions away.
 *
 * So they live in their own committed file. Each entry is keyed by the record it
 * applies to and overlays that record after scraping: `needsReview` says whether
 * anyone has looked yet, and any other field replaces the scraped value. There is
 * no separate marker for "this date was set by hand" -- an entry in this file
 * carrying a `date` *is* that marker.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

export const REVIEWS_FILE = path.join(
  import.meta.dirname,
  "..",
  "..",
  "src",
  "lib",
  "data",
  "reviews.json",
)

/**
 * Which record an entry belongs to.
 *
 * The media page's slug and the PDF's filename. Neither is unique on its own --
 * the city has two documents under `agenda-and-minutes-5`, and five PDFs
 * published under two pages each -- but the pair is unique across the listing,
 * for the same reason `documentKey` uses both.
 *
 * Deliberately *not* `docId`: that identifies a document, and two records can
 * share one while carrying different dates. Those shared-page records are
 * precisely the ones most likely to need review, so a correction to one must not
 * reach the other.
 */
export function reviewKey(record) {
  const page = (record.pageUrl ?? "").replace(/\/+$/, "").split("/").pop() || "unknown"
  const file = decodeURIComponent((record.fileUrl ?? "").split("/").pop() || "none")
  return `${page}::${file}`
}

export async function loadReviews() {
  try {
    return JSON.parse(await readFile(REVIEWS_FILE, "utf8"))
  } catch (err) {
    if (err.code === "ENOENT") return {}
    throw err
  }
}

export async function saveReviews(reviews) {
  // Key-sorted so the diff reads the same however the listing was ordered.
  const sorted = {}
  for (const key of Object.keys(reviews).sort()) sorted[key] = reviews[key]
  await mkdir(path.dirname(REVIEWS_FILE), { recursive: true })
  await writeFile(REVIEWS_FILE, JSON.stringify(sorted, null, 2) + "\n")
  return sorted
}

/**
 * Does this record's own evidence say a person should look at it?
 *
 * Reads the stored fields rather than `needsReview` alone, which is what lets an
 * existing hand-edit be picked up: `calendar:update` never rewrites a stored
 * record, so a record whose `needsReview` is false while it still carries a
 * `dateConflict` has already been reviewed by someone, and that decision needs
 * an entry here before the next rebuild discards it.
 */
const wantsReview = (record) =>
  record.needsReview === true || !record.date || record.dateConflict === true

/**
 * Give every record that wants review an entry, without disturbing entries that
 * already exist. Returns the keys it added.
 */
export function syncReviews(meetings, reviews) {
  const added = []
  for (const record of meetings) {
    if (!wantsReview(record)) continue
    const key = reviewKey(record)
    if (key in reviews) continue
    reviews[key] = { needsReview: record.needsReview === true }
    added.push(key)
  }
  return added
}

/**
 * Overlay each entry onto its record. Whatever the file says wins, which is the
 * whole point: these are decisions a person made with the document in front of
 * them, against a scraper working from a filename.
 */
export function applyReviews(meetings, reviews) {
  let applied = 0
  for (const record of meetings) {
    const entry = reviews[reviewKey(record)]
    if (!entry) continue
    Object.assign(record, entry)
    applied++
  }
  return applied
}

/** Counts for the run summary. */
export function summarizeReviews(reviews) {
  const entries = Object.values(reviews)
  const outstanding = entries.filter((e) => e.needsReview === true).length
  const corrected = entries.filter((e) => Object.keys(e).some((k) => k !== "needsReview")).length
  return { total: entries.length, outstanding, corrected }
}
