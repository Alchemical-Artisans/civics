/**
 * Give every meeting document a stable id, and find the ones that have a page.
 *
 * Documents on this site are written by hand. The scrape's job is only to say
 * what the city has published and what each document's permanent URL would be;
 * whether a document actually has a page is decided by whether someone has
 * written `src/lib/data/documents/<id>.html`. Nothing here reads a PDF.
 *
 * This used to convert every PDF to HTML with poppler. That produced a page for
 * every document, but only about a third of the corpus has a text layer at all,
 * and the reflowed output lost tables and multi-column layouts even where it
 * worked. A written summary of the meetings that matter beats an automated
 * transcription of all of them, and a calendar entry with no page now links
 * straight to the city's PDF rather than to a page apologising for itself.
 */
import { createHash } from "node:crypto"
import { readdir } from "node:fs/promises"
import path from "node:path"

/** Where the hand-written document pages live, one HTML fragment per id. */
export const DOCUMENTS_DIR = path.join(
  import.meta.dirname,
  "..",
  "..",
  "src",
  "lib",
  "data",
  "documents",
)

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

const lastSegment = (url) => (url ?? "").replace(/\/+$/, "").split("/").pop() ?? ""

/**
 * What makes two listing rows the same document.
 *
 * Five PDFs in the listing are published under two media pages each. They are
 * one document and deserve one page, so the file is the identity -- matching how
 * src/routes/calendar/+page.ts de-duplicates before rendering.
 */
export const documentGroupKey = (record) => record.fileUrl ?? record.pageUrl

/**
 * A readable slug with a hash of the file URL appended.
 *
 * The hash is what makes the id permanent. Slugs alone collide -- the city has
 * two different documents under `agenda-and-minutes-5` today -- and resolving a
 * collision by suffixing whichever arrived second would silently change an
 * existing document's URL the day a new one lands. These pages are the kind of
 * thing people cite, so eight ugly characters buy something worth having.
 *
 * It is also the filename a page is written under, so an id has to be settled
 * before anyone starts writing rather than depending on what else happened to
 * be in the listing that day.
 */
export function documentId(record) {
  const base = slugify(lastSegment(record.pageUrl)) || "document"
  const hash = createHash("sha256").update(documentGroupKey(record)).digest("hex").slice(0, 8)
  return `${base}-${hash}`
}

/**
 * Give every record a `docId`, sharing one id between rows that are the same
 * document. Returns one entry per distinct document.
 */
export function assignIds(meetings) {
  const groups = new Map()
  for (const record of meetings) {
    if (!record.fileUrl) {
      // Nothing to write about, so no page: the calendar keeps linking this one
      // to the city's media page.
      record.docId = null
      continue
    }
    const key = documentGroupKey(record)
    if (groups.has(key)) groups.get(key).push(record)
    else groups.set(key, [record])
  }

  const documents = []
  for (const group of groups.values()) {
    // Sorted rather than "first unflagged wins" so the id does not depend on
    // the order the listing happened to arrive in.
    const primary = [...group].sort(
      (a, b) =>
        Number(Boolean(a.needsReview)) - Number(Boolean(b.needsReview)) ||
        a.pageUrl.localeCompare(b.pageUrl),
    )[0]
    const id = documentId(primary)
    for (const record of group) record.docId = id
    documents.push({ id, record: primary, group })
  }
  return documents
}

/**
 * The ids that have a page written for them.
 *
 * Read from disk rather than recorded in meetings.json, so writing a page is
 * the only step there is: add the file and the calendar links to it on the next
 * build. Nothing to keep in sync, and nothing a refresh can overwrite.
 */
export async function pagesWritten() {
  try {
    const files = await readdir(DOCUMENTS_DIR)
    return new Set(files.filter((f) => f.endsWith(".html")).map((f) => f.slice(0, -".html".length)))
  } catch {
    // No pages written yet.
    return new Set()
  }
}

/** How many documents have a page and how many do not, for the run summary. */
export function summarizeDocuments(meetings, written) {
  const seen = new Set()
  let withPage = 0
  for (const record of meetings) {
    if (!record.docId || seen.has(record.docId)) continue
    seen.add(record.docId)
    if (written.has(record.docId)) withPage++
  }
  return { documents: seen.size, withPage, withoutPage: seen.size - withPage }
}
