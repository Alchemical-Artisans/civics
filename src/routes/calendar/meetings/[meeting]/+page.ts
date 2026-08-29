import type { EntryGenerator } from "./$types"
import { calendar } from "$lib/meetings"

/**
 * Which meetings this route has to prerender.
 *
 * The site is fully prerendered, so a route with a parameter has to say up
 * front what its parameter can be. SvelteKit would also find these by crawling
 * the calendar, but naming them here means the build fails loudly if the data
 * and the links ever disagree, rather than quietly emitting fewer pages.
 *
 * Meetings somebody has written up are left out: they have a static route
 * directory of their own, which serves them instead of this one.
 */
export const entries: EntryGenerator = () =>
  calendar()
    .meetings.filter((m) => !m.written)
    .map((m) => ({ meeting: m.id }))
