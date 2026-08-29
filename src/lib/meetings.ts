/**
 * `meetings.json` turned into the meetings the site shows.
 *
 * Both the calendar and each meeting page need the same list, built the same
 * way, so the work lives here rather than in either route. It runs at build
 * time -- the site is fully prerendered -- so nothing here ships to the
 * browser except the data it returns.
 */
import raw from "./data/meetings.json"
import { groupIntoMeetings, type Meeting, type MeetingDocument, type MeetingKind } from "./calendar"

/**
 * The meetings somebody has written up by hand.
 *
 * Only the keys matter, so the modules are never called -- the glob is being
 * used as a directory listing that Vite can resolve at build time. The path is
 * relative and literal because a glob has to be static.
 *
 * Existence of the route directory is the whole signal, and the router honours
 * it without being told: a static `<meeting id>/` beats `[meeting]/`. Nothing
 * in meetings.json records which meetings are written up, so writing one is a
 * single step -- add the directory -- and a data refresh cannot contradict it.
 *
 * `[meeting]` itself matches the glob, and is dropped.
 */
const written = new Set(
  Object.keys(import.meta.glob("../routes/calendar/meetings/*/+page.svelte"))
    .map((path) => path.split("/").at(-2)!)
    .filter((name) => !name.startsWith("[")),
)

export interface Calendar {
  meetings: Meeting[]
  generatedAt: string
  source: string
  /** Records with no date, which cannot be placed on a calendar. */
  undated: number
  /** Records dropped as duplicate publications of one PDF. */
  duplicates: number
  /** Kept records whose date the scraper was unsure of. */
  flagged: number
  /** Meetings with a write-up on this site. */
  written: number
  /** Documents shown, across every meeting. */
  documents: number
}

/**
 * Every meeting the calendar knows about, with the counts the footer discloses.
 *
 * Fields only the scraper cares about -- rawMeetingDate, category, dateSource --
 * are dropped here so they never reach the browser.
 */
export function calendar(): Calendar {
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
  const documents: MeetingDocument[] = kept.map((m) => ({
    title: m.title,
    date: m.date,
    board: m.board,
    kind: m.kind as MeetingKind,
    fileUrl: m.fileUrl,
    pageUrl: m.pageUrl,
    docId: m.docId,
  }))

  const meetings = groupIntoMeetings(documents, (id) => written.has(id))

  return {
    meetings,
    generatedAt: raw.generatedAt,
    source: raw.source,
    undated: raw.meetings.length - dated.length,
    duplicates: dated.length - documents.length,
    flagged: kept.filter((m) => m.needsReview).length,
    written: meetings.filter((m) => m.written).length,
    documents: documents.length,
  }
}
