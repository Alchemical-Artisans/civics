/**
 * Daily water production, May 15th to September 13th, 2022 against 2026, in
 * million gallons a day.
 *
 * **Read off a chart the Water Department showed the City Council, not
 * published by it as numbers.** The department has these figures; what is
 * public is a slide. So this is the same act as `$lib/kenoza-levels.ts` --
 * transcribing a published measurement by pixel rather than generating a
 * series -- and it carries the same warning: treat a single day here as good
 * to about a fifth of a million gallons and no better, and never quote one as
 * the department's own stated figure. What the department states is the
 * period total, and that is quoted exactly, below.
 *
 * ## Source
 *
 * "Water Usage 2022 and 2026", on a slide headed "Have the outdoor water use
 * restrictions helped?", shown by Robert Ward, Director of Water/Wastewater,
 * in his update on the Drought Emergency to the City Council.
 *
 * **Which sitting is inferred, not stated on the slide.** The Council's
 * agenda of September 15, 2026 carries "Mayor Barrett wishes to introduce
 * Robert Ward, Director of Water/ Wastewater to provide an update on the
 * Drought Emergency", the packet for that item already holds another slide
 * from the same presentation (the Kenoza chart), and the chart stops on
 * September 13th -- two days before. The deck itself was presented rather
 * than filed, so it is in none of the city's document pages. Confirm against
 * HC Media's video before treating the date as established.
 *
 * ## How it was read
 *
 * By pixel, from a screenshot of the slide, so that it is reproducible and
 * its error is bounded. Both axes were calibrated from the chart's own
 * furniture and nothing else:
 *
 *   - vertically from the gridlines, which sit at 25.04 px per million
 *     gallons with 0.00 at y=478.3;
 *   - horizontally from the four month labels, which give 3.847 px per day
 *     from 15-May at x=182.0. The three intervals between them (119.5px/31d,
 *     115.0px/30d, 119.5px/31d) agree to within 0.6%.
 *
 * The two series separate cleanly by hue, and each day's value is the
 * intensity-weighted centroid of its colour in that column.
 *
 * ## What validates it
 *
 * **The slide states a period total the reading was not fitted to**: "May 15
 * through September 13 - 150 million gallons less than 2022". Summing the
 * day-by-day gap below gives 150.3, which is that figure to within
 * 0.2%. The calibration came only from the axes, so
 * reproducing the department's own total is evidence the curve was read
 * faithfully rather than fitted.
 *
 * A second check, also not fitted to: the x calibration predicts the series
 * ending at x=647.5 and it ends at 646 -- the span really is May 15th to
 * September 13th, as the caption says.
 *
 * ## The gaps
 *
 * 2022 is null on nine days. Those are where the 2026 line crosses over and
 * hides it; nothing is interpolated into them, the same rule the rainfall
 * series follows. 2026 is complete.
 */

export interface WaterUsageDay {
  /** "MM-DD" -- the same calendar day in both years. */
  date: string
  /** Million gallons a day in 2022, or null where the 2026 line hides it. */
  mgd2022: number | null
  /** Million gallons a day in 2026. */
  mgd2026: number
}

const ROWS: [string, number | null, number][] = [
  ["05-15", 5.87, 5.32],
  ["05-16", 5.7, 5.4],
  ["05-17", null, 5.44],
  ["05-18", null, 5.77],
  ["05-19", 5.96, 5.71],
  ["05-20", 6.19, 5.61],
  ["05-21", 6.42, 5.59],
  ["05-22", 6.52, 5.39],
  ["05-23", 6.4, 4.82],
  ["05-24", 6.47, 4.51],
  ["05-25", 6.69, 4.84],
  ["05-26", 6.79, 5.35],
  ["05-27", 6.33, 5.55],
  ["05-28", 5.92, 5.45],
  ["05-29", 6.24, 5.21],
  ["05-30", 6.6, 4.71],
  ["05-31", 6.5, 4.5],
  ["06-01", 6.27, 5.05],
  ["06-02", 6.1, 5.67],
  ["06-03", 6.07, 5.79],
  ["06-04", 6.3, 5.85],
  ["06-05", 6.44, 5.74],
  ["06-06", 6.59, 5.34],
  ["06-07", 6.7, 5.44],
  ["06-08", 6.76, 6.07],
  ["06-09", null, 6.38],
  ["06-10", null, 6.07],
  ["06-11", null, 6.24],
  ["06-12", 6.72, 6.08],
  ["06-13", 6.83, 5.85],
  ["06-14", 7.04, 6.09],
  ["06-15", 7.11, 6.23],
  ["06-16", 7.1, 6.44],
  ["06-17", 7.09, 6.35],
  ["06-18", 6.88, 5.84],
  ["06-19", 6.31, 5.59],
  ["06-20", 6.56, 5.55],
  ["06-21", 7.16, 5.55],
  ["06-22", 7.19, 5.8],
  ["06-23", 7.18, 5.57],
  ["06-24", 7.3, 5.7],
  ["06-25", 7.35, 5.84],
  ["06-26", 7.08, 5.81],
  ["06-27", 6.92, 5.58],
  ["06-28", 7.05, 5.45],
  ["06-29", 7.24, 5.92],
  ["06-30", 7.1, 6.21],
  ["07-01", 7.29, 6.65],
  ["07-02", null, 6.62],
  ["07-03", 6.85, 5.89],
  ["07-04", 6.8, 5.53],
  ["07-05", 6.69, 5.64],
  ["07-06", 6.67, 5.66],
  ["07-07", 6.85, 5.47],
  ["07-08", 7.19, 5.83],
  ["07-09", 7.27, 6.16],
  ["07-10", 7.33, 5.88],
  ["07-11", 7.55, 5.41],
  ["07-12", 7.66, 5.49],
  ["07-13", 7.39, 6.38],
  ["07-14", 7.13, 6.58],
  ["07-15", 7.34, 6.08],
  ["07-16", 7.65, 5.8],
  ["07-17", 7.71, 5.74],
  ["07-18", 7.23, 5.3],
  ["07-19", 7.3, 5.5],
  ["07-20", 7.82, 5.61],
  ["07-21", 8.27, 5.75],
  ["07-22", 8.81, 5.74],
  ["07-23", 8.93, 5.81],
  ["07-24", 8.54, 5.82],
  ["07-25", 8.12, 5.19],
  ["07-26", 8.14, 5.49],
  ["07-27", 7.67, 5.93],
  ["07-28", 7.17, 5.7],
  ["07-29", 7.14, 5.64],
  ["07-30", 7.27, 5.76],
  ["07-31", 7.49, 5.66],
  ["08-01", 7.9, 5.19],
  ["08-02", 8.03, 5.3],
  ["08-03", 8.02, 5.6],
  ["08-04", 8.04, 5.68],
  ["08-05", 7.92, 5.76],
  ["08-06", 7.63, 5.7],
  ["08-07", 7.6, 5.75],
  ["08-08", 7.57, 5.4],
  ["08-09", 7.78, 5.51],
  ["08-10", 7.99, 6.13],
  ["08-11", 7.77, 6.09],
  ["08-12", 7.47, 6.06],
  ["08-13", 7.09, 6.12],
  ["08-14", 7.14, 6.01],
  ["08-15", 7.17, 5.57],
  ["08-16", 6.88, 5.64],
  ["08-17", 6.82, 5.76],
  ["08-18", null, 6.49],
  ["08-19", 7.46, 6.97],
  ["08-20", 7.44, 6.65],
  ["08-21", 7.34, 5.78],
  ["08-22", 7.22, 5.11],
  ["08-23", 6.69, 5.12],
  ["08-24", 6.62, 5.46],
  ["08-25", 6.67, 5.77],
  ["08-26", 6.35, 5.57],
  ["08-27", 6.37, 5.79],
  ["08-28", 6.74, 5.91],
  ["08-29", 6.99, 5.43],
  ["08-30", null, 5.97],
  ["08-31", null, 6.47],
  ["09-01", 6.99, 6.15],
  ["09-02", 6.49, 6.07],
  ["09-03", 6.38, 5.82],
  ["09-04", 6.34, 5.47],
  ["09-05", 6.13, 5.05],
  ["09-06", 6.0, 5.2],
  ["09-07", 6.0, 5.57],
  ["09-08", 6.09, 5.62],
  ["09-09", 6.22, 5.81],
  ["09-10", 6.24, 5.68],
  ["09-11", 6.27, 5.2],
  ["09-12", 6.32, 5.09],
  ["09-13", 6.16, 5.3],
]

export const WATER_USAGE: WaterUsageDay[] = ROWS.map(([date, mgd2022, mgd2026]) => ({
  date,
  mgd2022,
  mgd2026,
}))

/**
 * The one figure the department states in words rather than draws, quoted
 * from the slide: the saving over the whole period.
 */
export const WATER_USAGE_SAVING = {
  millionGallons: 150,
  from: "May 15",
  to: "September 13",
  /** The slide's own sentence, verbatim. */
  stated: "May 15 through September 13 \u2013 150 million gallons less than 2022",
}

export const WATER_USAGE_SOURCE = {
  title: "Water Usage 2022 and 2026",
  slide: "Have the outdoor water use restrictions helped?",
  presenter: "Robert Ward, Director of Water/Wastewater",
  meeting: "City Council, September 15, 2026",
  meetingIsInferred: true,
  read: "October 29, 2026",
}
