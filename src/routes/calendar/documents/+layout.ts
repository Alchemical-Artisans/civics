import { error } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"
import raw from "$lib/data/meetings.json"
import type { MeetingKind } from "$lib/calendar"
import { Router } from "$lib/router"
import { meetingId } from "$lib/calendar"

/**
 * Metadata for whichever document page is being rendered underneath.
 *
 * The pages themselves are static routes -- one directory per document id, each
 * holding a hand-written `+page.svelte` -- so there is no `[id]` param to read.
 * The id is the segment straight after `documents/`, which is also the
 * directory name and the `docId` in meetings.json. Deriving it here rather than
 * in each page keeps a new write-up down to a single file with nothing to
 * declare.
 *
 * Not the *last* segment, because a document can have pages beneath it for
 * individual agenda items; those want the same meeting and the same links to
 * the city out of this one lookup.
 */

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

export const load: LayoutLoad = ({ url }) => {
  const segments = url.pathname.replace(/\/+$/, "").split("/")
  // lastIndexOf, so a base path that happens to contain "documents" cannot
  // shadow the real one.
  const at = segments.lastIndexOf("documents")
  const id = segments[at + 1]
  const meeting = documents().get(id)

  // A directory named something that is not a document id. The site is fully
  // prerendered, so this fails the build rather than reaching a reader -- which
  // is the point: the only way to get here is a typo in a directory name.
  if (!meeting) error(404, `No document with id ${id}`)

  return {
    id,
    /** True on a page for one agenda item, rather than the document itself. */
    isItem: segments.length > at + 2,
    title: meeting.title,
    board: meeting.board,
    kind: meeting.kind as MeetingKind,
    date: meeting.date,
    fileUrl: meeting.fileUrl,
    sourceUrl: Router.cityPage(meeting.pageUrl),
    /**
     * The sitting this document belongs to, so a write-up can go back to it
     * rather than all the way out to the calendar. Null when the record has no
     * date, which is the one case that has no meeting page to return to.
     */
    meetingId: meeting.date ? meetingId(meeting.board, meeting.date) : null,
  }
}
