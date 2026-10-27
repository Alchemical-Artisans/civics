import type { PageServerLoad } from "./$types"
import { averageToDate } from "$lib/precipitation"
import { PRECIPITATION_SOURCE, precipitationByYear } from "$lib/server/precipitation"

/** Bars on the chart: the current year and the three before it. */
const SPAN = 4
/** Years behind the baseline bar, the current year excluded. */
const BASELINE = 10

/**
 * Four years of rainfall and a ten-year baseline to read them against.
 *
 * **Eleven years are aggregated and five figures come out.** All of them go
 * through one `precipitationByYear` call on purpose rather than two: that
 * function defines `toDateInches` against the newest year of the set it is
 * given, so asking for the bars and the baseline separately would define each
 * against a different day and the baseline would stop being a figure the bars
 * could be compared with. Asked together, every one of the eleven is summed
 * to the current year's own last read day.
 *
 * That is also why the baseline is an average of `toDateInches` and not of
 * whole-year totals -- see `averageToDate`. The current year is ten months
 * old; ten whole years behind it would make any October look like a drought.
 *
 * The current year is worked out from the last day the station record covers
 * rather than from the build clock -- the scrape and the build are separate
 * acts, and a build run in January against a December scrape would otherwise
 * ask for a year with no days in it.
 *
 * A server load rather than a universal one, the same reason `/water`'s and
 * the calendar's are: a `+page.ts` ships to the browser, so the several
 * megabytes of daily station readings behind these five figures would be
 * bundled into the page just to be aggregated again on arrival. This runs at
 * build time only, and the page carries the result.
 */
export const load: PageServerLoad = () => {
  const latest = Number(PRECIPITATION_SOURCE.updated.slice(0, 4))
  const first = latest - BASELINE

  const all = precipitationByYear(Array.from({ length: BASELINE + 1 }, (_, i) => first + i))
  const baselineYears = all.slice(0, BASELINE)

  return {
    rainfallYears: all.slice(-SPAN),
    rainfallBaseline: {
      inches: averageToDate(baselineYears),
      from: baselineYears[0].year,
      to: baselineYears.at(-1)!.year,
      years: baselineYears.length,
    },
    rainfallSource: PRECIPITATION_SOURCE,
  }
}
