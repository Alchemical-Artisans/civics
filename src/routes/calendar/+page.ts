import type { PageLoad } from "./$types"
import raw from "$lib/data/meetings.json"
import type { Meeting, MeetingKind } from "$lib/calendar"

/**
 * The documents somebody has written a page for.
 *
 * Only the keys matter here, so the modules are never called -- the glob is
 * being used as a directory listing that Vite can resolve at build time. A
 * relative path rather than `$lib`, because the glob has to be static.
 *
 * Presence of the file is the whole signal: a document with a page is linked to
 * its page, one without is linked straight to the city's PDF. Nothing in
 * meetings.json records which is which, so writing a page is one step -- add the
 * file -- and a data refresh cannot contradict it.
 */
const written = new Set(
  Object.keys(import.meta.glob("../../lib/data/documents/*.html")).map((path) =>
    path
      .split("/")
      .pop()!
      .replace(/\.html$/, ""),
  ),
)

/**
 * Runs at build time (the site is fully prerendered), so the trimmed meeting
 * list is baked into the page rather than fetched by the browser. Fields only
 * the scraper cares about -- rawMeetingDate, category, dateSource -- are dropped
 * here to keep the serialized payload small. `docId` stays: it is how a
 * calendar entry addresses its document page.
 */
export const load: PageLoad = () => {
  const dated = raw.meetings.filter((m) => m.date)

  // A handful of PDFs are published under two media pages, which would
  // otherwise render the same document twice. Keep one copy, preferring the
  // record whose date the scraper did not flag.
  const best = new Map<string, (typeof dated)[number]>()
  for (const m of dated) {
    const key = m.fileUrl ?? m.pageUrl
    const kept = best.get(key)
    if (!kept || (kept.needsReview && !m.needsReview)) best.set(key, m)
  }

  const kept = [...best.values()]
  const meetings: Meeting[] = kept.map((m) => ({
    title: m.title,
    date: m.date,
    board: m.board,
    kind: m.kind as MeetingKind,
    fileUrl: m.fileUrl,
    pageUrl: m.pageUrl,
    docId: m.docId && written.has(m.docId) ? m.docId : null,
  }))

  return {
    meetings,
    generatedAt: raw.generatedAt,
    source: raw.source,
    undated: raw.meetings.length - dated.length,
    duplicates: dated.length - meetings.length,
    flagged: kept.filter((m) => m.needsReview).length,
    written: meetings.filter((m) => m.docId).length,
  }
}
