import { error } from "@sveltejs/kit"
import type { EntryGenerator, PageLoad } from "./$types"
import { calendar } from "$lib/meetings"

/**
 * Which meeting pages to prerender.
 *
 * The site is fully prerendered, so a route with a parameter has to say up
 * front what its parameter can be. SvelteKit would also find these by crawling
 * the calendar, but naming them here means the build fails loudly if the data
 * and the links ever disagree, rather than quietly emitting fewer pages.
 */
export const entries: EntryGenerator = () => calendar().meetings.map((m) => ({ meeting: m.id }))

export const load: PageLoad = ({ params }) => {
  const meeting = calendar().meetings.find((m) => m.id === params.meeting)
  // Prerendering turns this into a build failure rather than something a
  // reader can reach, which is the point: the only way here is a stale link.
  if (!meeting) error(404, `No meeting with id ${params.meeting}`)
  return { meeting }
}
