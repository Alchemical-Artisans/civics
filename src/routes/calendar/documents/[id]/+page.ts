import { error } from "@sveltejs/kit"
import type { EntryGenerator, PageLoad } from "./$types"
import raw from "$lib/data/meetings.json"
import type { MeetingKind } from "$lib/calendar"
import { Router } from "$lib/router"

/**
 * The hand-written document pages, keyed by document id.
 *
 * A relative path rather than `$lib`, because Vite has to resolve the glob
 * statically. Each file is its own chunk and only the matching one is pulled in
 * when a page is prerendered.
 *
 * These are written by hand, one per document worth writing up; most documents
 * have none and are linked straight to the city's PDF from the calendar. See
 * docs/document-pages.md.
 */
const pages = import.meta.glob("../../../../lib/data/documents/*.html", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>

const keyFor = (id: string) => `../../../../lib/data/documents/${id}.html`

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
// here rather than discovered by crawling the calendar. Only documents with a
// page written for them get one -- the rest have nothing to render, and the
// calendar links them to the city's PDF instead.
export const entries: EntryGenerator = () =>
  [...documents().keys()].filter((id) => keyFor(id) in pages).map((id) => ({ id }))

export const load: PageLoad = async ({ params }) => {
  const meeting = documents().get(params.id)
  const page = pages[keyFor(params.id)]
  // Either an id that was never a document, or one nobody has written up. Both
  // are a 404: there is no page here, and the calendar never linked to one.
  if (!meeting || !page) error(404, "No such document")

  return {
    id: params.id,
    title: meeting.title,
    board: meeting.board,
    kind: meeting.kind as MeetingKind,
    date: meeting.date,
    fileUrl: meeting.fileUrl,
    sourceUrl: Router.cityPage(meeting.pageUrl),
    html: await page(),
  }
}
