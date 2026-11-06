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
 * Resident Population for Incorporated Places", Vintage 2025, summary level
 * 162, place 2529405, Haverhill city, Massachusetts.
 *
 * https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/cities/totals/sub-est2025.csv
 *
 * Read November 5, 2026 -- the flat file rather than the Census API, which
 * now requires a key. The file states the same six figures at three summary
 * levels (162, 157 and 071) and they agree, which is the check that the
 * right place was read.
 *
 * **A vintage is one series, and moving to a new one moves every year.**
 * These were Vintage 2024 until 2025 was wanted, and taking the new year
 * alone would have put a Vintage 2025 bar beside five Vintage 2024 ones --
 * a smaller version of the 2010-vs-2020 problem above, and the reason this
 * chart exists in the shape it does. So the whole series was re-read.
 * Vintage 2025 moved all five of the old years: 2020 by 1, 2021 by 8, 2022
 * by 19, 2023 by 118 and 2024 by 125, each upward. Nothing about Haverhill
 * changed; the Bureau rebuilt its estimates.
 */

export interface PopulationYear {
  year: number
  people: number
}

export const POPULATION: PopulationYear[] = [
  { year: 2020, people: 67637 },
  { year: 2021, people: 67376 },
  { year: 2022, people: 67439 },
  { year: 2023, people: 67961 },
  { year: 2024, people: 68416 },
  /** The first year of the series to fall: 55 fewer people than 2024. */
  { year: 2025, people: 68361 },
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
  vintage: "Vintage 2025",
  builtFrom: 2020,
  /**
   * The Bureau's own page for this series, and where the file below was
   * obtained -- what the chart links, because a reader following a citation
   * wants the page that publishes the data and documents it, not a 7 MB CSV
   * of every place in the country that their browser will simply download.
   *
   * **It will not always offer the vintage below.** The page carries
   * whichever is current -- the same one as these figures today, Vintage
   * 2025, but the Bureau rebuilds the series every year and the page follows
   * it. The file itself stays where it is, which is why `url` is still
   * recorded: that is the thing these six numbers came out of, and the way
   * to check them against what is drawn.
   */
  page: "https://www.census.gov/data/tables/time-series/demo/popest/2020s-total-cities-and-towns.html",
  url: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/cities/totals/sub-est2025.csv",
  read: "November 5, 2026",
}
