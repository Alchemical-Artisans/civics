import type { PageServerLoad } from "./$types"
import { averageFullYear, averageRemainder } from "$lib/precipitation"
import { PRECIPITATION_SOURCE, precipitationByYear } from "$lib/server/precipitation"

/** Bars on the chart: the current year and the nine before it. */
const SPAN = 10
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
 * The baseline was an average of `toDateInches` while the bars were read to
 * the same day; the bars are whole years now, so it is `averageFullYear` and
 * the unfinished year carries a ghost instead -- see `RainfallChart`.
 *
 * The current year is worked out from the last day the station record covers
 * rather than from the build clock -- the scrape and the build are separate
 * acts, and a build run in January against a December scrape would otherwise
 * ask for a year with no days in it.
 *
 * A server load rather than a universal one, the same reason the calendar's
 * is: a `+page.ts` ships to the browser, so the several
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
      /** The dashed rule, now that the bars are whole years. */
      fullYearInches: averageFullYear(baselineYears),
      /**
       * What a typical year still adds after the day the current one stops --
       * the ghost on the unfinished bar. Estimated; see `averageRemainder`.
       */
      remainderInches: averageRemainder(baselineYears),
      from: baselineYears[0].year,
      to: baselineYears.at(-1)!.year,
      years: baselineYears.length,
    },
    rainfallSource: PRECIPITATION_SOURCE,
  }
}
