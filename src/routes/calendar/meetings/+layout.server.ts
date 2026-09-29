import type { LayoutServerLoad } from "./$types"
import { easternDate } from "$lib/calendar"

/**
 * The day this build ran, in the city -- what decides whether a sitting is
 * still ahead, and so whether the page offers the live stream (see
 * `liveStream` in $lib/calendar).
 *
 * A server load rather than the universal one beside it, for the same reason
 * the calendar's own month page uses `+page.server.ts`: a universal load runs
 * again in the browser during hydration, so `easternDate()` there would answer
 * with the reader's date where the served HTML answered with the build's, and
 * the two renders would disagree about whether the stream link is on the page
 * at all. This runs only at build time and is served from the page's own
 * prerendered data, so both renders read the same day; the layout then moves to
 * the reader's own date on mount, as an ordinary reactive change.
 */
export const load: LayoutServerLoad = () => ({ today: easternDate() })
