/**
 * Haverhill's resident population since the 2020 Census, from the US Census
 * Bureau's annual estimates.
 *
 * **It starts at 2020 because the series before it is not comparable with
 * it.** The Bureau builds its annual estimates forward from the last
 * decennial count. The 2010-based series had Haverhill at about 64,000 by
 * 2019; the 2020 Census then counted 67,776. Drawn end to end the two look
 * like 3,762 people arriving in a single year, and nobody did -- it is one
 * series being replaced by a better-anchored one. The Bureau publishes no
 * reconciled sub-county series spanning the two bases, so there is no way to
 * show both that is not either misleading or a chart about Census
 * methodology rather than about Haverhill.
 *
 * **The decade is still answerable, from the counts rather than the
 * estimates.** `CENSUS_COUNTS` holds the two decennial figures, which are
 * counts of people rather than projections and so can be compared directly:
 * 60,879 in 2010 against 67,776 in 2020, 6,897 more people, about 11%. That
 * is the growth figure to quote.
 *
 * ## Source
 *
 * US Census Bureau, Population Estimates Program, "Annual Estimates of the
 * Resident Population for Incorporated Places", Vintage 2024, summary level
 * 162, place 2529405, Haverhill city, Massachusetts.
 *
 * https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/cities/totals/sub-est2024.csv
 *
 * Read October 30, 2026 -- the flat file rather than the Census API, which
 * now requires a key.
 */

export interface PopulationYear {
  year: number
  people: number
}

export const POPULATION: PopulationYear[] = [
  { year: 2020, people: 67636 },
  { year: 2021, people: 67368 },
  { year: 2022, people: 67420 },
  { year: 2023, people: 67843 },
  { year: 2024, people: 68291 },
]

/**
 * The decennial counts the estimates hang off. Counts, not estimates, so the
 * two may be compared with each other however the series between them was
 * built.
 */
export const CENSUS_COUNTS = { 2010: 60879, 2020: 67776 } as const

export const POPULATION_SOURCE = {
  agency: "US Census Bureau",
  program: "Population Estimates Program",
  place: "Haverhill city, Massachusetts (place 2529405)",
  vintage: "Vintage 2024",
  builtFrom: 2020,
  /**
   * The Bureau's own page for this series, and where the file below was
   * obtained -- what the chart links, because a reader following a citation
   * wants the page that publishes the data and documents it, not a 7 MB CSV
   * of every place in the country that their browser will simply download.
   *
   * **It will not always offer the vintage below.** The page carries the
   * current one -- Vintage 2025 as of this writing, where these figures are
   * Vintage 2024 -- because the Bureau rebuilds the series every year and
   * the page follows it. The file itself stays where it is, which is why
   * `url` is still recorded: that is the thing these five numbers came out
   * of, and the way to check them against what is drawn.
   */
  page: "https://www.census.gov/data/tables/time-series/demo/popest/2020s-total-cities-and-towns.html",
  url: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/cities/totals/sub-est2024.csv",
  read: "October 30, 2026",
}
