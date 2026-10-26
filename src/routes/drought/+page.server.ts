import type { PageServerLoad } from "./$types"
import { PRECIPITATION_SOURCE, precipitationByYear } from "$lib/server/precipitation"

/**
 * The current year and the two before it, worked out from the last day the
 * station record actually covers rather than from the build clock -- the
 * scrape and the build are separate acts, and a build run in January against
 * a December scrape would otherwise ask for a year with no days in it.
 *
 * Three years, not four: a fourth line and a thirty-year normal beside it
 * were more than the chart could say at once -- see the comment at the top of
 * `$lib/RainfallYearsChart.svelte`.
 *
 * A server load rather than a universal one, the same reason `/water`'s and
 * the calendar's are: a `+page.ts` ships to the browser, so the several
 * megabytes of daily station readings behind these three lines would be
 * bundled into the page just to be aggregated again on arrival. This runs at
 * build time only, and the page carries the months it returns.
 */
export const load: PageServerLoad = () => {
  const latest = Number(PRECIPITATION_SOURCE.updated.slice(0, 4))

  return {
    rainfallYears: precipitationByYear([latest - 2, latest - 1, latest]),
    rainfallSource: PRECIPITATION_SOURCE,
  }
}
