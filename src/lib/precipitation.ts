/**
 * The shapes and the pure date arithmetic behind the drought page's rainfall
 * chart, deliberately outside both the component and `$lib/server`, the same
 * arrangement `calendar.ts` has: these unit-test without rendering anything,
 * and a component may import them without pulling the several megabytes of
 * station record that `$lib/server/precipitation.ts` reads.
 *
 * **A day is the mean of every gauge that read it.** Not the city station's
 * record with the others patched into its gaps, which is what this was first:
 * every gauge reporting that day counts once, the city's COOP station
 * included. That makes the series a Haverhill-area average rather than one
 * station's own figures, so it will not match a level the city quotes off its
 * own gauge -- which is why `cityInches` and `cityOnlyToDateInches` are kept
 * beside it.
 *
 * **A month is the bucket.** Weekly buckets were tried first and were too
 * noisy to read four years of at once -- a week swings between 0.00 and 4.37
 * inches, and four such lines over one axis obscure each other. Months also
 * take two awkward problems off the table that weeks had: seven-day runs
 * counted from January 1st drift against the calendar, so February 29th had
 * to be folded into a neighbouring bucket to keep four years aligned on one
 * axis, and an ISO week starts on a Monday and so covers different dates
 * each year. A month is the same month in every year, leap or not.
 *
 * All dates here are `YYYY-MM-DD` strings and every computation goes through
 * `Date.UTC` -- the local-time constructor would shift a day west of UTC,
 * which is the same trap `calendar.ts` documents.
 */

export interface PrecipitationDay {
  date: string
  /**
   * Inches: the mean of every Haverhill gauge that read the day, or null
   * where none did. Equally weighted -- the city's own COOP station counts
   * once, the same as each volunteer gauge beside it.
   */
  inches: number | null
  /** How many gauges that mean was taken over. 0 where the day is unread. */
  gauges: number
  /** Whether the city's own COOP station was one of them. */
  cityRead: boolean
  /**
   * What the city's own gauge alone recorded, kept beside the mean rather
   * than thrown away: it is the figure any statement the city makes about
   * its own station has to be reconciled against, and the series the chart
   * draws is no longer that figure. Null where the city gauge did not read.
   */
  cityInches: number | null
}

export interface PrecipitationMonth {
  /** 1-12. */
  month: number
  /** "Jan" -- what the axis is labelled with. */
  label: string
  /** Inches that fell in this month -- what the chart plots. */
  inches: number
  /** Inches since January 1st, this month included. */
  cumulativeInches: number
  /** Days of the month a gauge read. */
  days: number
  /**
   * True where the month is not over, or not covered to its end by the
   * record. A partial month's total is not comparable with a whole one --
   * October read to the 25th is six days short of the Octobers it is drawn
   * against -- so the chart marks it rather than letting it read as dry.
   */
  partial: boolean
  /** Days of this month the city's own COOP station read. */
  cityDays: number
  /** Days of this month with no city reading, standing on neighbours alone. */
  filledDays: number
  /** Days of this month no gauge read at all. */
  unreadDays: number
}

export interface PrecipitationYear {
  year: number
  months: PrecipitationMonth[]
  /** Inches since January 1st through `throughDate`. */
  totalInches: number
  /**
   * Inches since January 1st, summed only to the same month and day the
   * newest year of the set reaches -- the one figure of these that is
   * comparable across all four years, and so the one the legend and the
   * page's prose quote.
   *
   * Summing whole months instead would reintroduce the problem the `partial`
   * flag exists for, one level up: 2025's October is 31 days against 2026's
   * 25, and the two totals are not the same measurement.
   */
  toDateInches: number
  /** The last day of this year any gauge read. */
  throughDate: string
  /**
   * The same year summed from the city's own COOP station alone, to the same
   * day as `toDateInches`. The chart draws the all-gauge mean; this is what
   * the city's own gauge says on its own, and the two differ on every day
   * more than one gauge reported, not only on the filled ones.
   */
  cityOnlyToDateInches: number
  /** Days of the year the city's own COOP station read. */
  cityDays: number
  /** Days of the year with no city reading, standing on neighbours alone. */
  filledDays: number
  /** Days of the year no gauge read at all. */
  unreadDays: number
}

export const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/** How many days month `m` (1-12) has in `year` -- February being the point. */
export function daysInMonth(month: number, year: number): number {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
}

/** "Oct 26" -- a stored `YYYY-MM-DD` said the way a sentence wants it. */
export function longDate(date: string): string {
  const [, month, day] = date.split("-")
  return `${MONTH_NAMES[Number(month) - 1]} ${Number(day)}`
}

/**
 * The mean of several years' `toDateInches`, as a baseline a single year can
 * be read against.
 *
 * **Every figure averaged here is already read to the same day**, because
 * `precipitationByYear` defines `toDateInches` against the newest year in the
 * set it was given -- so the average answers the same question each bar does
 * ("how much rain by this date"), and a part-year can sit beside it without
 * the comparison lying. Averaging `totalInches` instead would put ten whole
 * years against the current year's ten months, which is the mistake this
 * chart exists to avoid making.
 *
 * Rounded to hundredths like every other figure here, so the baseline prints
 * at the same precision as the bars it stands behind.
 */
export function averageToDate(years: PrecipitationYear[]): number {
  if (!years.length) return 0
  const total = years.reduce((sum, year) => sum + year.toDateInches, 0)
  return Math.round((total / years.length) * 100) / 100
}

/**
 * The mean of several years' whole-year totals.
 *
 * The companion to `averageToDate`, and the right baseline only when the
 * bars beside it are whole years too. Mixing the two -- a to-date average
 * under full-year bars, or the reverse -- understates or overstates every
 * comparison on the chart by the same several inches.
 */
export function averageFullYear(years: PrecipitationYear[]): number {
  if (!years.length) return 0
  const total = years.reduce((sum, year) => sum + year.totalInches, 0)
  return Math.round((total / years.length) * 100) / 100
}

/**
 * How much rain those years got *after* the day the newest of them stops --
 * the part of the calendar the current year has not reached yet.
 *
 * **This is the one estimated figure the rainfall chart carries.** A year
 * still running is drawn as what has actually fallen plus a ghost of this on
 * top, so a reader can see roughly where the year is heading without the
 * short bar reading as a dry year. It is an average of ten measured
 * remainders, not a forecast, and the spread behind it is wide -- for a
 * late-October cutoff the ten years range from about 6.6 to 14.5 inches. The
 * chart draws it in a register that says estimate and the caption says so in
 * words; nothing else on the page may quote it as rainfall that fell.
 */
export function averageRemainder(years: PrecipitationYear[]): number {
  if (!years.length) return 0
  const total = years.reduce((sum, year) => sum + (year.totalInches - year.toDateInches), 0)
  return Math.round((total / years.length) * 100) / 100
}
