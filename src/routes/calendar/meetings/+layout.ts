import { error } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"
import { calendar } from "$lib/meetings"

/**
 * The meeting whichever page below is rendering.
 *
 * A meeting somebody has written up is a static route directory named for its
 * id; every other meeting is served by `[meeting]`. Either way the id is the
 * segment straight after `meetings/`, so reading it off the URL covers both and
 * a hand-written meeting has nothing to declare.
 *
 * Not the *last* segment, because a meeting can have pages beneath it for
 * individual agenda items; those want the same meeting out of this one lookup.
 */
export const load: LayoutLoad = ({ url }) => {
  const segments = url.pathname.replace(/\/+$/, "").split("/")
  // lastIndexOf, so a base path that happens to contain "meetings" cannot
  // shadow the real one.
  const at = segments.lastIndexOf("meetings")
  const id = segments[at + 1]
  const meeting = calendar().meetings.find((m) => m.id === id)

  // A directory named something that is not a meeting id. The site is fully
  // prerendered, so this fails the build rather than reaching a reader -- which
  // is the point: the only way here is a typo in a directory name.
  if (!meeting) error(404, `No meeting with id ${id}`)

  return {
    meeting,
    /** True on a page for one agenda item, rather than the meeting itself. */
    isItem: segments.length > at + 2,
  }
}
