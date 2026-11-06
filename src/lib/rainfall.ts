/**
 * Massachusetts statewide precipitation, January through August, from
 * NOAA's Climate at a Glance system -- the same underlying NOAA data the
 * state's own Drought Management Task Force draws its regional figures
 * from, at the coarser statewide grain this site can verify directly
 * rather than the Task Force's own reports, which block automated
 * fetches.
 *
 * https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/statewide/time-series/19/pcp/8/8/1895-2026.json
 * (19 = Massachusetts; the two numbers after "pcp" are the window length and
 * the month it ends on -- 8 months ending in August, i.e. January-August).
 * Accessed September 17, 2026.
 *
 * This is what the water department's own claim -- that reduced rainfall,
 * not just demand, is why the reservoirs are low -- can be checked against:
 * a number NOAA has published every year since 1895, not a figure the city
 * states itself.
 */
export interface YearlyRainfall {
  year: number
  /** January-August total, in inches. */
  inches: number
}

/** How many years of January-August totals NOAA has, 1895 through the current year. */
export const RAINFALL_RECORD_YEARS = 132

/**
 * The 1901-2000 average January-August total NOAA measures a year's
 * departure against -- computed directly from the same series NOAA
 * returns (its own 100 years of it), not a second figure typed in from
 * somewhere else.
 */
export const RAINFALL_NORMAL_INCHES = 29.51

/** The last 15 years of it, for the chart -- the full record runs back to 1895. */
export const RAINFALL_JAN_AUG: YearlyRainfall[] = [
  { year: 2012, inches: 25.19 },
  { year: 2013, inches: 33.7 },
  { year: 2014, inches: 32.14 },
  { year: 2015, inches: 26.04 },
  { year: 2016, inches: 23.35 },
  { year: 2017, inches: 32.02 },
  { year: 2018, inches: 35.81 },
  { year: 2019, inches: 34.22 },
  { year: 2020, inches: 24.88 },
  { year: 2021, inches: 35.22 },
  { year: 2022, inches: 24.61 },
  { year: 2023, inches: 38.63 },
  { year: 2024, inches: 37.5 },
  { year: 2025, inches: 28.85 },
  { year: 2026, inches: 25.75 },
]

export const CURRENT_RAINFALL_YEAR = 2026

/**
 * Where 2026's January-August total ranks against the full 132-year
 * record, 1 being driest -- not derivable from `RAINFALL_JAN_AUG` alone,
 * which holds only the last 15 years shown on the chart, so this is
 * carried as its own cited figure rather than computed from a partial list.
 */
export const CURRENT_RAINFALL_RANK = 25

/** A year's total against the 1901-2000 average, positive meaning wetter than normal. */
export function rainfallDeparture(inches: number): number {
  return Math.round((inches - RAINFALL_NORMAL_INCHES + Number.EPSILON) * 100) / 100
}

/** "25th" -- for `CURRENT_RAINFALL_RANK` in a sentence. */
export function ordinal(n: number): string {
  const hundredth = n % 100
  if (hundredth >= 11 && hundredth <= 13) return `${n}th`
  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}

/** Where this data comes from, for the page's own Sources list. */
export const NOAA_SOURCE = {
  label: "NOAA Climate at a Glance — Massachusetts statewide precipitation",
  url: "https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/statewide/time-series/19/pcp/8/8/1895-2026",
  accessed: "September 17, 2026",
}
