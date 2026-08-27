import { error } from "@sveltejs/kit"
import type { EntryGenerator, PageLoad } from "./$types"
import raw from "$lib/data/meetings.json"
import type { DocumentStatus, MeetingKind } from "$lib/calendar"
import { Router } from "$lib/router"

/**
 * The converted HTML, keyed by document id.
 *
 * A relative path rather than `$lib`, because Vite has to resolve the glob
 * statically. Each file is its own chunk and only the matching one is pulled in
 * when a page is prerendered.
 */
const pages = import.meta.glob("../../../../lib/data/documents/*.html", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>

/** One record per document, preferring the row the scraper did not flag. */
function documents() {
  const best = new Map<string, (typeof raw.meetings)[number]>()
  for (const meeting of raw.meetings) {
    if (!meeting.docId) continue
    const kept = best.get(meeting.docId)
    if (!kept || (kept.needsReview && !meeting.needsReview)) best.set(meeting.docId, meeting)
  }
  return best
}

// The site is fully prerendered, so every document page has to be enumerated
// here rather than discovered by crawling the calendar.
export const entries: EntryGenerator = () => [...documents().keys()].map((id) => ({ id }))

export const load: PageLoad = async ({ params }) => {
  const meeting = documents().get(params.id)
  if (!meeting) error(404, "No such document")

  const status = (meeting.docStatus ?? "failed") as DocumentStatus
  const key = `../../../../lib/data/documents/${params.id}.html`
  // A `converted` record whose file is missing would be a build-time bug, but
  // falling back to the embed keeps the page useful rather than breaking it.
  const html = status === "converted" && pages[key] ? await pages[key]() : null

  return {
    id: params.id,
    title: meeting.title,
    board: meeting.board,
    kind: meeting.kind as MeetingKind,
    date: meeting.date,
    fileUrl: meeting.fileUrl,
    sourceUrl: Router.cityPage(meeting.pageUrl),
    status: html ? status : status === "converted" ? "failed" : status,
    html,
  }
}
