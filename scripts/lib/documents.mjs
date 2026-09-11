/**
 * Give every meeting document a stable id, and find the sittings that have a page.
 *
 * Pages on this site are written by hand. The scrape's job is only to say what
 * the city has published and what each document's permanent URL would be;
 * whether a sitting actually has a page is decided by whether someone has
 * written `src/routes/calendar/meetings/<meeting id>/+page.svelte`. Nothing
 * here reads a PDF.
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

/**
 * Where the hand-written meeting pages live, one route directory per meeting id.
 *
 * This said `calendar/documents` until well after that directory was renamed,
 * and `pagesWritten` swallows a missing directory as "nothing written yet", so
 * every run quietly reported nought pages against a repo that had them. The
 * summary is the only thing that reads this, which is exactly why nobody
 * noticed -- so if this moves again, check the count afterwards.
 */
export const MEETINGS_DIR = path.join(
  import.meta.dirname,
  "..",
  "..",
  "src",
  "routes",
  "calendar",
  "meetings",
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
 * It is also the directory a page is written under, so an id has to be settled
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
 * The meeting ids that have a page written for them.
 *
 * Read from disk rather than recorded in meetings.json, so writing a page is
 * the only step there is: add the directory and the calendar links to it on
 * the next build. Nothing to keep in sync, and nothing a refresh can overwrite.
 *
 * `[meeting]` is the generated route that serves every sitting nobody has
 * written up, not a page somebody wrote, so it is dropped -- the same rule
 * `$lib/meetings` applies to the same directory.
 */
export async function pagesWritten() {
  try {
    const entries = await readdir(MEETINGS_DIR, { withFileTypes: true })
    // A directory named for the meeting id, holding the page. The route
    // group's own files -- the layout, the e2e suite -- are not directories,
    // so they sort themselves out.
    return new Set(
      entries
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith("["))
        .map((entry) => entry.name),
    )
  } catch {
    // No pages written yet.
    return new Set()
  }
}

/**
 * The route segment for a sitting: the board slugged, then the date.
 *
 * The same rule as `meetingId` in `src/lib/calendar.ts`, and it has to stay
 * that way or the summary counts pages the site does not serve. Duplicated
 * rather than imported because the scripts are plain .mjs run by node and that
 * module is TypeScript compiled by Vite; `documents.spec.mjs` pins the two
 * together by asserting the shape this produces.
 *
 * Exported because `lib/transcribe.mjs` names a page's directory with it, and a
 * third copy of the rule is one too many.
 */
export const meetingIdOf = (record) =>
  `${record.board
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${record.date}`

/**
 * Meeting ids reaching the calendar after this run that were not there before
 * it -- a board sitting on a date nothing else already covered, ready to pass
 * straight to `npm run transcribe --`.
 *
 * Compares ids rather than counting new records, which is what makes this "a
 * meeting" and not "a document": a second document landing on a sitting that
 * already had one is not new. A record counts once it has a date and is not
 * `gone` -- and, the one field only a recording carries, not `orphan` -- the
 * same three tests the site itself applies before grouping records into
 * meetings, so this does not announce a sitting the calendar will not show.
 */
export function newMeetingIds(before, after) {
  const onCalendar = (r) => Boolean(r.date) && !r.gone && !r.orphan
  const had = new Set(before.filter(onCalendar).map(meetingIdOf))
  const now = new Set(after.filter(onCalendar).map(meetingIdOf))
  return [...now].filter((id) => !had.has(id)).sort()
}

/** Print `newMeetingIds`' result, if there is any, for the run summary. */
export function printNewMeetings(ids) {
  if (!ids.length) return
  console.log(`\n  ${ids.length} new meeting(s) on the calendar:`)
  for (const id of ids) console.log(`    ${id}`)
  console.log(`  npm run transcribe -- <id>`)
}

/**
 * How many documents there are, and how many sittings have a page, for the run
 * summary.
 *
 * Documents and sittings are counted separately because they are no longer the
 * same thing: a page is written for a meeting, and a meeting usually has two
 * documents under it. Counting pages per document made every written meeting
 * look half-written.
 */
export function summarizeDocuments(meetings, written) {
  const documents = new Set()
  const sittings = new Set()
  for (const record of meetings) {
    if (record.docId) documents.add(record.docId)
    // Undated records cannot be placed on a calendar, so they are not sittings
    // the site will ever show a page for.
    if (record.date) sittings.add(meetingIdOf(record))
  }
  const withPage = [...sittings].filter((id) => written.has(id)).length
  return {
    documents: documents.size,
    meetings: sittings.size,
    withPage,
    withoutPage: sittings.size - withPage,
  }
}
