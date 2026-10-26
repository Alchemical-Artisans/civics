import type { PageServerLoad } from "./$types"
import {
  PRECIPITATION_SOURCE,
  normalByMonth,
  normalToDate,
  precipitationByYear,
} from "$lib/server/precipitation"

/**
 * The current year and the three before it, worked out from the last day the
 * station record actually covers rather than from the build clock -- the
 * scrape and the build are separate acts, and a build run in January against
 * a December scrape would otherwise ask for a year with no days in it.
 *
 * A server load rather than a universal one, the same reason `/water`'s and
 * the calendar's are: a `+page.ts` ships to the browser, so the several
 * megabytes of daily station readings behind these four lines would be
 * bundled into the page just to be aggregated again on arrival. This runs at
 * build time only, and the page carries the weeks it returns.
 */
export const load: PageServerLoad = () => {
  const latest = Number(PRECIPITATION_SOURCE.updated.slice(0, 4))
  const years = [latest - 3, latest - 2, latest - 1, latest]

  const rainfallYears = precipitationByYear(years)

  return {
    rainfallYears,
    rainfallNormal: normalByMonth(),
    // The normal read to the same day, so the legend compares like with like.
    rainfallNormalToDate: normalToDate(rainfallYears.at(-1)!.throughDate.slice(5)),
    rainfallSource: PRECIPITATION_SOURCE,
  }
}
