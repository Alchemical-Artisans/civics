import type { LayoutServerLoad } from "./$types"
import { easternDate } from "$lib/calendar"

/**
 * The day this build ran, in the city -- what decides which timeline entries
 * are behind the reader and so folded away.
 *
 * A server load for the reason `calendar/meetings/+layout.server.ts` gives: a
 * universal load runs again in the browser during hydration, so `easternDate()`
 * there would answer with the reader's date where the served HTML answered
 * with the build's, and the two renders would disagree about which entries are
 * folded. This runs only at build time and is served from the page's own
 * prerendered data; the layout then moves to the reader's own date on mount,
 * as an ordinary reactive change.
 */
export const load: LayoutServerLoad = () => ({ today: easternDate() })
