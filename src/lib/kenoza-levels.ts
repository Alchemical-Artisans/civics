/**
 * Kenoza Lake's level through 2025 and 2026, in feet, read off the city's own
 * published drought-status chart.
 *
 * **These are read from a picture, and that is a weaker kind of figure than
 * anything else on this site.** Everything in `meetings.json` and
 * `budget.json` traces to a document the city published as text or as a
 * number. The city has never published this series as numbers: the only
 * version of it anywhere is a chart image, so each figure below is where a
 * line sat on that image, not a reading the Water Department wrote down.
 *
 * It is still the city's own measurement rather than an estimate of one --
 * the same act as transcribing a scanned agenda by eye, which is how two
 * thirds of the write-ups on this site were made -- but the precision is the
 * picture's, not the gauge's. Treat a figure here as good to about a fifth of
 * a foot and no better, and never quote one as the city's stated level. The
 * one level the city has actually printed as a number is the 99.8 ft low,
 * which is on the chart as a data label and which this reading reproduces
 * exactly.
 *
 * This reverses a rule the deleted `/water` page's own documentation used to
 * state -- that the curve would never be re-plotted off the image, because
 * doing so would be
 * inventing data points. The distinction that changed the answer: reading a
 * published measurement is transcription, where the fabricated series under
 * `data/lake-level/placeholder/` was invention. The placeholder is still
 * fabricated and still must never be cited.
 *
 * ## Source
 *
 * "Kenoza Lake Drought Stages with Current, 2025, and Average Levels",
 * City of Haverhill, as of September 15, 2026.
 * https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/ceboffkx/drought-status-9-15-2026.png
 * The same chart was shown to the City Council on September 15, 2026 and is
 * committed as a PDF excerpt at
 * `static/excerpts/city-council-2026-09-15/drought-emergency-update/`.
 * Accessed October 26, 2026.
 *
 * ## How it was read
 *
 * By pixel, not by eye, so that it is reproducible and its error is bounded:
 * the three curves separate cleanly by colour (2026 a blue `rgb(69,120,171)`,
 * 2025 a teal `rgb(118,183,178)`, the 36-year average a green
 * `rgb(133,186,126)`, against warm-toned zone bands that share no hue with
 * any of them), and each figure below is the median row of that colour in the
 * five pixel columns centred on the month's own date.
 *
 * Both axes were calibrated from the chart's own furniture: vertically from
 * the three gridlines standing above the bands, which come out at exactly
 * 45.5 px per 2 ft; horizontally by fitting pixel column against day of year
 * across eleven month labels, at 1.664 px/day with January 1st at x=99.3.
 * Two facts the calibration was not fitted to then check out against it --
 * the 2026 curve bottoms out at 99.80 ft, which is the figure the chart
 * prints as a label, and its last pixel falls on day 258, which is
 * September 15th, the date in the chart's own filename.
 *
 * The 36-year average line was read too and is deliberately not kept: the
 * rainfall chart beside this one dropped its own thirty-year normal as a
 * distraction, and a long-run average here would be the same distraction
 * twice.
 */
import { MONTH_NAMES } from "./precipitation"

export interface LakeLevelMonth {
  /** 1-12. */
  month: number
  /** "Jan" -- the shared x axis's own label. */
  label: string
  /** Feet above the gauge datum, as the chart draws it on the 1st of the month. */
  feet: number
}

export interface LakeLevelYear {
  year: number
  months: LakeLevelMonth[]
  /**
   * The last date the chart draws this year to. 2026 stops when the chart was
   * made; 2025 runs to the end of December.
   */
  throughDate: string
  /** The lowest level the chart shows for the year, and the day it fell on. */
  low: { feet: number; note: string }
}

const year = (
  y: number,
  feet: number[],
  throughDate: string,
  low: { feet: number; note: string },
): LakeLevelYear => ({
  year: y,
  months: feet.map((value, i) => ({ month: i + 1, label: MONTH_NAMES[i], feet: value })),
  throughDate,
  low,
})

/**
 * Oldest first, matching the rainfall chart's own order. 2026 has nine
 * months: the chart was drawn on September 15th and the line stops there, so
 * there is nothing to read for October onward.
 */
export const KENOZA_LEVELS: LakeLevelYear[] = [
  year(
    2025,
    [105.4, 103.4, 103.3, 105.8, 108.0, 111.6, 112.0, 109.9, 108.4, 106.5, 104.7, 103.3],
    "2025-12-31",
    { feet: 101.7, note: "late December" },
  ),
  year(2026, [101.7, 101.0, 100.0, 103.2, 105.3, 105.4, 105.0, 103.3, 100.8], "2026-09-15", {
    feet: 99.8,
    note: "mid-September, the one level the city prints as a number",
  }),
]

/** Where these came from, for the page to say so under the chart. */
export const KENOZA_SOURCE = {
  title: "Kenoza Lake Drought Stages with Current, 2025, and Average Levels",
  /**
   * The city's own page on the drought, which is where it publishes a chart
   * of the lake's level -- and so what the picture on `/drought` links to.
   * `url` below is the image file itself, which is a file rather than a page:
   * it says nothing about when the city put it there or what it said at the
   * time, and a reader sent to a `.png` has nowhere to go next.
   */
  page: "https://www.haverhillma.gov/living-here/waterwastewater-services/water-supplydrought-information/",
  url: "https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/ceboffkx/drought-status-9-15-2026.png",
  asOf: "September 15, 2026",
  accessed: "October 26, 2026",
}
