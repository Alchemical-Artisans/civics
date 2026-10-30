/**
 * Haverhill's resident population, 2015 to 2024, from the US Census Bureau.
 *
 * **These are two series, not one, and the join between them is the whole
 * reason this file has a comment.** The Census publishes annual estimates
 * built forward from the last decennial count. The 2015-2019 figures were
 * built forward from the 2010 Census; the 2020-2024 figures are built forward
 * from the 2020 Census, which found 67,776 people where the 2010-based
 * estimates had projected about 64,000.
 *
 * So the step from 64,014 in 2019 to 67,636 in 2020 is **+3,762 in one year,
 * and almost none of it is people arriving**. It is the older series being
 * replaced by a better-anchored one. The Bureau publishes no reconciled
 * sub-county series spanning the two, so the discontinuity cannot be
 * smoothed away -- it can only be drawn honestly, which is why the chart
 * separates the series rather than running ten bars together.
 *
 * Read against the 2010 Census count of 60,879, the decade to 2020 added
 * 6,897 people, about 11%. That is the growth figure to quote; the one-year
 * jump is not.
 *
 * ## Source
 *
 * US Census Bureau, Population Estimates Program, "Annual Estimates of the
 * Resident Population for Incorporated Places", summary level 162, place
 * 2529405, Haverhill city, Massachusetts.
 *
 *   - 2015-2019: Vintage 2019,
 *     https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/cities/totals/sub-est2019_25.csv
 *   - 2020-2024: Vintage 2024,
 *     https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/cities/totals/sub-est2024.csv
 *
 * Both read October 30, 2026 -- the flat files rather than the Census API,
 * which now requires a key.
 */

export interface PopulationYear {
  year: number
  people: number
  /**
   * Which decennial count the estimate was built forward from. Two years
   * from different bases are not two points on one line.
   */
  base: 2010 | 2020
}

export const POPULATION: PopulationYear[] = [
  { year: 2015, people: 62861, base: 2010 },
  { year: 2016, people: 63200, base: 2010 },
  { year: 2017, people: 63664, base: 2010 },
  { year: 2018, people: 63926, base: 2010 },
  { year: 2019, people: 64014, base: 2010 },
  { year: 2020, people: 67636, base: 2020 },
  { year: 2021, people: 67368, base: 2020 },
  { year: 2022, people: 67420, base: 2020 },
  { year: 2023, people: 67843, base: 2020 },
  { year: 2024, people: 68291, base: 2020 },
]

/** The decennial counts themselves, which the estimates hang off. */
export const CENSUS_COUNTS = { 2010: 60879, 2020: 67776 } as const

export const POPULATION_SOURCE = {
  agency: "US Census Bureau",
  program: "Population Estimates Program",
  place: "Haverhill city, Massachusetts (place 2529405)",
  read: "October 30, 2026",
  vintages: [
    {
      years: "2015–2019",
      vintage: "Vintage 2019",
      url: "https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/cities/totals/sub-est2019_25.csv",
    },
    {
      years: "2020–2024",
      vintage: "Vintage 2024",
      url: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/cities/totals/sub-est2024.csv",
    },
  ],
}
