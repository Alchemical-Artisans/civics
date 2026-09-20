import type { PageServerLoad } from "./$types"
import { PRODUCTION_WARNING, waterWindows } from "$lib/server/water-series"

/**
 * A server load rather than a universal one, for the same reason the
 * calendar's is: a `+page.ts` ships to the browser, so the megabytes of
 * daily weather and production rows behind these twenty windows would be
 * bundled into the page just to be aggregated again on arrival. This runs
 * at build time only, and the page carries the twenty rows it returns.
 */
export const load: PageServerLoad = () => ({
  windows: waterWindows(),
  productionWarning: PRODUCTION_WARNING,
})
