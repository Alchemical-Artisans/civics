/**
 * The shapes and the pure date arithmetic behind the drought page's rainfall
 * chart, deliberately outside both the component and `$lib/server`, the same
 * arrangement `calendar.ts` has: these unit-test without rendering anything,
 * and a component may import them without pulling the several megabytes of
 * station record that `$lib/server/precipitation.ts` reads.
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

/** Which gauge a day's figure came from. */
export type DaySource = "city" | "neighbour" | "unread"

export interface PrecipitationDay {
  date: string
  /** Inches, or null where no gauge read the day. */
  inches: number | null
  source: DaySource
  /** How many gauges were averaged, where `source` is "neighbour". */
  gauges: number
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
  /** Days of this month whose figure came from a neighbour gauge. */
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
  /** Days of the year filled from a neighbour gauge. */
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
