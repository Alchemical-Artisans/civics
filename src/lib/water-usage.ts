/**
 * Daily water production in million gallons a day, April 15th to October
 * 15th, for 2022, 2023 and 2026.
 *
 * **Read off two charts the Water Department showed the City Council, not
 * published by it as numbers.** The department has these figures; what is
 * public is a pair of slides. So this is the same act as
 * `$lib/kenoza-levels.ts` -- transcribing a published measurement by pixel
 * rather than generating a series. Unlike that one, the precision here is
 * measured rather than estimated: see "What validates it".
 *
 * ## Source
 *
 * Two slides from Robert Ward, Director of Water/Wastewater, in his update on
 * the Drought Emergency to the City Council of September 15, 2026 -- the
 * sitting whose agenda reads "Mayor Barrett wishes to introduce Robert Ward,
 * Director of Water/ Wastewater to provide an update on the Drought
 * Emergency". The deck was presented rather than filed, so it is on none of
 * the city's document pages; the Kenoza Lake chart already committed under
 * that meeting is a third slide from the same presentation.
 *
 *   - "Water Usage 2022 and 2026", headed "Have the outdoor water use
 *     restrictions helped?", May 15th to September 13th. 2026 comes from here.
 *   - "Water Usage 2022 and 2023", headed "Wet Summer vs. Dry Summer", April
 *     15th to October 15th. 2022 and 2023 come from here.
 *
 * **One source per year, deliberately.** 2022 is drawn on both slides, and
 * the first is the higher-resolution of the two (3.85 px a day against 2.60).
 * Taking 2022 from the sharper slide where it exists and the other elsewhere
 * would have put a seam of up to 0.48 MGD at the join, so the whole of 2022
 * is read from the second slide and the first is used only to check it.
 *
 * ## How it was read
 *
 * By pixel, from screenshots of the slides. Both axes of each chart were
 * calibrated from its own furniture and nothing else:
 *
 *   - "2022 and 2026": gridlines at 25.04 px per million gallons with 0.00 at
 *     y=478.3; month labels at 3.847 px a day from 15-May at x=182.0, their
 *     three intervals agreeing to 0.6%.
 *   - "2022 and 2023": gridlines at 25.70 px per million gallons with 0.00 at
 *     y=440.0 -- all seven found land on a whole gridline -- and month labels
 *     at 2.598 px a day from 15-Apr at x=172.5, their six intervals agreeing
 *     to 0.1%.
 *
 * The series separate cleanly by hue and a day is the intensity-weighted
 * centroid of its colour in that column.
 *
 * ## What validates it
 *
 * Three checks, none of them fitted to.
 *
 * **Each slide states a total.** "May 15 through September 13 - 150 million
 * gallons less than 2022" against 150.3 summed day by day here, 0.2% out.
 * "204 Million Gallons (10%) more in 2022" against 208, 2% out.
 *
 * **2022 is on both slides**, read independently from different images at
 * different scales. The two readings differ by a median of 0.047 MGD, 0.25 at
 * the 90th percentile and 0.48 at worst, with a mean bias of +0.036. That is
 * the honest precision of a day in this file: good to about a twentieth of a
 * million gallons typically, a quarter at the swings.
 *
 * ## One caution on the slide's own arithmetic
 *
 * "204 Million Gallons (10%)" mixes two periods. The 204 is the charted
 * window, April 15th to October 15th, which this reading reproduces. The 10%
 * is not: over that window the gap is 21.8% of 2023. A 10% share implies an
 * annual total near 2,040 million gallons, so the parenthetical is a fraction
 * of the year rather than of the months drawn. Quote the 204 against the
 * summer and the 10% against the year, never both against the same period.
 *
 * ## The gaps
 *
 * 2022 is null on five days, where the 2023 line crosses over and hides it;
 * nothing is interpolated into them. 2026 is null outside May 15th to
 * September 13th because its slide draws no more than that.
 */

export interface WaterUsageDay {
  /** "MM-DD" -- the same calendar day in each year. */
  date: string
  /** Million gallons a day in 2022, or null where the 2023 line hides it. */
  mgd2022: number | null
  /** Million gallons a day in 2023. */
  mgd2023: number | null
  /** Million gallons a day in 2026, null outside the window its slide draws. */
  mgd2026: number | null
}

const ROWS: [string, number | null, number | null, number | null][] = [
  ["04-15", 5.22, 4.73, null],
  ["04-16", 5.12, 4.65, null],
  ["04-17", 5.2, 4.78, null],
  ["04-18", 5.25, 4.89, null],
  ["04-19", 5.29, 4.94, null],
  ["04-20", 5.33, 4.9, null],
  ["04-21", 5.3, 4.78, null],
  ["04-22", 5.18, 4.47, null],
  ["04-23", 5.2, 4.52, null],
  ["04-24", 5.34, 4.81, null],
  ["04-25", 5.47, 4.86, null],
  ["04-26", 5.54, 4.81, null],
  ["04-27", 5.55, 4.76, null],
  ["04-28", 5.56, 4.81, null],
  ["04-29", 5.47, 4.61, null],
  ["04-30", 5.41, 4.5, null],
  ["05-01", 5.42, 4.63, null],
  ["05-02", 5.47, 4.69, null],
  ["05-03", 5.47, 4.73, null],
  ["05-04", 5.58, 4.69, null],
  ["05-05", 5.6, 4.69, null],
  ["05-06", 5.52, 4.77, null],
  ["05-07", 5.54, 5.1, null],
  ["05-08", 5.7, 5.23, null],
  ["05-09", 5.89, 5.32, null],
  ["05-10", 5.96, 5.4, null],
  ["05-11", 6.06, 5.49, null],
  ["05-12", 6.14, 5.61, null],
  ["05-13", 6.38, 5.54, null],
  ["05-14", 6.45, 5.63, null],
  ["05-15", 6.32, 5.79, 5.32],
  ["05-16", 5.47, 5.82, 5.4],
  ["05-17", null, 5.8, 5.44],
  ["05-18", null, 5.81, 5.77],
  ["05-19", 6.11, 5.49, 5.71],
  ["05-20", 6.18, 5.36, 5.61],
  ["05-21", 6.46, 5.29, 5.59],
  ["05-22", 6.48, 5.49, 5.39],
  ["05-23", 6.42, 5.53, 4.82],
  ["05-24", 6.51, 5.55, 4.51],
  ["05-25", 6.67, 5.68, 4.84],
  ["05-26", 6.71, 6.06, 5.35],
  ["05-27", 5.85, 6.22, 5.55],
  ["05-28", 5.82, 6.61, 5.45],
  ["05-29", 5.87, 6.95, 5.21],
  ["05-30", 6.4, 6.93, 4.71],
  ["05-31", 6.3, 6.95, 4.5],
  ["06-01", 6.14, 6.75, 5.05],
  ["06-02", 6.08, 6.53, 5.67],
  ["06-03", null, 5.72, 5.79],
  ["06-04", 6.48, 5.54, 5.85],
  ["06-05", 6.44, 5.55, 5.74],
  ["06-06", 6.62, 5.53, 5.34],
  ["06-07", 6.65, 5.49, 5.44],
  ["06-08", 6.39, 5.41, 6.07],
  ["06-09", 6.25, 5.16, 6.38],
  ["06-10", 6.24, 5.17, 6.07],
  ["06-11", 6.24, 5.58, 6.24],
  ["06-12", 6.45, 5.68, 6.08],
  ["06-13", 6.81, 5.48, 5.85],
  ["06-14", 7.02, 5.32, 6.09],
  ["06-15", 7.08, 5.38, 6.23],
  ["06-16", 7.08, 5.22, 6.44],
  ["06-17", 7.02, 4.9, 6.35],
  ["06-18", 6.43, 4.98, 5.84],
  ["06-19", 6.36, 5.23, 5.59],
  ["06-20", 6.64, 5.55, 5.55],
  ["06-21", 7.17, 5.73, 5.55],
  ["06-22", 7.18, 5.72, 5.8],
  ["06-23", 7.18, 5.52, 5.57],
  ["06-24", 7.27, 5.34, 5.7],
  ["06-25", 7.3, 5.28, 5.84],
  ["06-26", 7.04, 5.29, 5.81],
  ["06-27", 6.94, 5.26, 5.58],
  ["06-28", 7.17, 5.43, 5.45],
  ["06-29", 7.16, 5.5, 5.92],
  ["06-30", 7.1, 5.37, 6.21],
  ["07-01", 7.03, 4.95, 6.65],
  ["07-02", 6.86, 4.84, 6.62],
  ["07-03", 6.78, 4.81, 5.89],
  ["07-04", 6.8, 4.97, 5.53],
  ["07-05", 6.66, 5.52, 5.64],
  ["07-06", 6.68, 5.97, 5.66],
  ["07-07", 6.87, 5.94, 5.47],
  ["07-08", 7.12, 5.59, 5.83],
  ["07-09", 7.26, 5.37, 6.16],
  ["07-10", 7.35, 5.46, 5.88],
  ["07-11", 7.54, 5.8, 5.41],
  ["07-12", 7.61, 5.92, 5.49],
  ["07-13", 7.3, 5.71, 6.38],
  ["07-14", 7.2, 5.48, 6.58],
  ["07-15", 7.31, 5.08, 6.08],
  ["07-16", 7.6, 5.15, 5.8],
  ["07-17", 7.54, 5.39, 5.74],
  ["07-18", 7.28, 5.64, 5.3],
  ["07-19", 7.38, 5.8, 5.5],
  ["07-20", 7.77, 5.72, 5.61],
  ["07-21", 8.32, 5.28, 5.75],
  ["07-22", 8.62, 5.19, 5.74],
  ["07-23", 8.83, 5.54, 5.81],
  ["07-24", 8.5, 5.76, 5.82],
  ["07-25", 8.15, 5.89, 5.19],
  ["07-26", 8.08, 5.95, 5.49],
  ["07-27", 7.7, 6.33, 5.93],
  ["07-28", 7.42, 6.12, 5.7],
  ["07-29", 7.3, 5.65, 5.64],
  ["07-30", 7.29, 5.57, 5.76],
  ["07-31", 7.51, 5.73, 5.66],
  ["08-01", 7.78, 5.74, 5.19],
  ["08-02", 8.01, 5.81, 5.3],
  ["08-03", 8.0, 5.76, 5.6],
  ["08-04", 8.0, 5.61, 5.68],
  ["08-05", 7.83, 5.55, 5.76],
  ["08-06", 7.64, 5.51, 5.7],
  ["08-07", 7.57, 5.41, 5.75],
  ["08-08", 7.59, 5.42, 5.4],
  ["08-09", 7.8, 5.36, 5.51],
  ["08-10", 7.87, 5.39, 6.13],
  ["08-11", 7.79, 5.3, 6.09],
  ["08-12", 7.36, 5.23, 6.06],
  ["08-13", 7.17, 5.35, 6.12],
  ["08-14", 7.13, 5.39, 6.01],
  ["08-15", 7.18, 5.28, 5.57],
  ["08-16", 7.01, 5.22, 5.64],
  ["08-17", 6.82, 5.18, 5.76],
  ["08-18", 6.9, 5.17, 6.49],
  ["08-19", 7.28, 5.06, 6.97],
  ["08-20", 7.37, 5.17, 6.65],
  ["08-21", 7.31, 5.39, 5.78],
  ["08-22", 7.18, 5.53, 5.11],
  ["08-23", 7.0, 5.56, 5.12],
  ["08-24", 6.63, 5.37, 5.46],
  ["08-25", 6.61, 5.09, 5.77],
  ["08-26", 6.44, 4.9, 5.57],
  ["08-27", 6.33, 5.07, 5.79],
  ["08-28", 6.63, 5.21, 5.91],
  ["08-29", 6.88, 5.21, 5.43],
  ["08-30", 6.93, 5.16, 5.97],
  ["08-31", 6.94, 5.3, 6.47],
  ["09-01", 6.74, 5.24, 6.15],
  ["09-02", 6.55, 5.05, 6.07],
  ["09-03", 6.29, 5.08, 5.82],
  ["09-04", 6.31, 5.27, 5.47],
  ["09-05", 6.52, 5.8, 5.05],
  ["09-06", 5.6, 6.18, 5.2],
  ["09-07", 5.58, 6.17, 5.57],
  ["09-08", null, 5.59, 5.62],
  ["09-09", 6.25, 5.28, 5.81],
  ["09-10", 6.22, 5.06, 5.68],
  ["09-11", 6.24, 4.99, 5.2],
  ["09-12", 6.28, 4.98, 5.09],
  ["09-13", 6.19, 5.09, 5.3],
  ["09-14", 6.07, 5.18, null],
  ["09-15", 6.01, 5.05, null],
  ["09-16", 5.9, 4.89, null],
  ["09-17", 5.79, 4.93, null],
  ["09-18", 5.84, 5.0, null],
  ["09-19", 5.76, 5.08, null],
  ["09-20", 5.6, 5.19, null],
  ["09-21", 5.58, 5.14, null],
  ["09-22", 5.5, 4.95, null],
  ["09-23", 5.32, 4.78, null],
  ["09-24", 5.37, 4.88, null],
  ["09-25", 5.65, 5.07, null],
  ["09-26", 5.69, 5.11, null],
  ["09-27", 5.66, 5.17, null],
  ["09-28", 5.78, 5.05, null],
  ["09-29", 5.79, 4.92, null],
  ["09-30", 5.5, 4.79, null],
  ["10-01", 5.43, 4.93, null],
  ["10-02", 5.56, 5.14, null],
  ["10-03", 5.6, 5.29, null],
  ["10-04", 5.53, 5.25, null],
  ["10-05", 5.49, 5.18, null],
  ["10-06", 5.49, 4.73, null],
  ["10-07", 5.42, 4.56, null],
  ["10-08", 5.35, 4.81, null],
  ["10-09", 5.46, 5.05, null],
  ["10-10", 5.45, 5.13, null],
  ["10-11", 5.39, 4.99, null],
  ["10-12", 5.36, 4.92, null],
  ["10-13", 5.21, 4.71, null],
  ["10-14", 5.06, 4.67, null],
  ["10-15", null, 4.73, null],
]

export const WATER_USAGE: WaterUsageDay[] = ROWS.map(([date, mgd2022, mgd2023, mgd2026]) => ({
  date,
  mgd2022,
  mgd2023,
  mgd2026,
}))

/**
 * The figures the department states in words rather than draws, quoted from
 * the slides. These are the city's own numbers; everything else here is a
 * reading of its pictures.
 */
export const WATER_USAGE_STATED = {
  restrictions: {
    stated: "May 15 through September 13 \u2013 150 million gallons less than 2022",
    millionGallons: 150,
    from: "May 15",
    to: "September 13",
  },
  wetAgainstDry: {
    stated: "204 Million Gallons (10%) more in 2022",
    millionGallons: 204,
    from: "April 15",
    to: "October 15",
    /** See the caution above: the percentage is of the year, not of the window. */
    percentIsAnnual: true,
  },
}

export const WATER_USAGE_SOURCE = {
  presenter: "Robert Ward, Director of Water/Wastewater",
  meeting: "City Council, September 15, 2026",
  meetingId: "city-council-2026-09-15",
  item: "drought-emergency-update",
  slides: ["Have the outdoor water use restrictions helped?", "Wet Summer vs. Dry Summer"],
  read: "October 29, 2026",
  /**
   * HC Media's video of the sitting, and the minute the slide behind these
   * lines is on screen. The timestamp is in the text rather than the URL:
   * HC Media's player takes no time fragment, so the only way to hand a
   * reader a minute is to print it and let them seek.
   *
   * `/drought`'s own prose links the same recording at the same minute. Both
   * are the citation for the same claim -- the chart draws the slide, the
   * sentence quotes the figure off it -- so they point at one place.
   */
  recording: {
    url: "http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026",
    timestamp: "44:19",
  },
}
