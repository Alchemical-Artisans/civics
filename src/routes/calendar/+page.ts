import type { PageLoad } from "./$types"
import { calendar } from "$lib/meetings"

/**
 * Runs at build time (the site is fully prerendered), so the meeting list is
 * baked into the page rather than fetched by the browser. The work itself is
 * in `$lib/meetings`, which each meeting page uses too.
 */
export const load: PageLoad = () => calendar()
