/**
 * The shapes and the pure date arithmetic behind the drought page's rainfall
 * chart, deliberately outside both the component and `$lib/server`, the same
 * arrangement `calendar.ts` has: these unit-test without rendering anything,
 * and a component may import them without pulling the several megabytes of
 * station record that `$lib/server/precipitation.ts` reads.
 *
 * All dates here are `MM-DD` or `YYYY-MM-DD` strings and every computation
 * goes through `Date.UTC` -- the local-time constructor would shift a day
 * west of UTC, which is the same trap `calendar.ts` documents.
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

export interface PrecipitationWeek {
  /** 1-53. Week 1 is January 1st to 7th, so a week means the same days in every year. */
  week: number
  /** The `MM-DD` the week opens on -- what the axis is labelled from. */
  startMonthDay: string
  /** Inches that fell in this week alone. */
  inches: number
  /** Inches since January 1st, this week included -- what the chart plots. */
  cumulativeInches: number
  /** Days of this week whose figure came from a neighbour gauge, not the city's. */
  filledDays: number
  /** Days of this week no gauge read at all. */
  unreadDays: number
}

export interface PrecipitationYear {
  year: number
  weeks: PrecipitationWeek[]
  /** Inches since January 1st through `throughDate`. */
  totalInches: number
  /** The last day of this year any gauge read. */
  throughDate: string
  /** Days of the year filled from a neighbour gauge. */
  filledDays: number
  /** Days of the year no gauge read at all. */
  unreadDays: number
}

export const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

/**
 * Which of the 53 week-buckets a date falls in. Buckets are seven-day runs
 * counted from January 1st rather than ISO weeks, because an ISO week starts
 * on a Monday and so covers different dates each year -- which is exactly
 * what a chart laying four years over one axis cannot have. February 29th
 * lands in week 9 along with the 23rd to the 28th, making that one bucket
 * eight days long in a leap year: a day's misalignment out of 365, taken in
 * preference to discarding a day of real rain to keep the buckets even.
 */
export function weekOfYear(monthDay: string, year: number): number {
  const start = Date.UTC(year, 0, 1)
  const day = Date.UTC(year, Number(monthDay.slice(0, 2)) - 1, Number(monthDay.slice(3, 5)))
  const index = Math.round((day - start) / 86_400_000)
  const leapAdjusted = isLeapYear(year) && monthDay > "02-29" ? index - 1 : index
  return Math.min(53, Math.floor(leapAdjusted / 7) + 1)
}

/** The `MM-DD` week `n` opens on, in a non-leap year -- the axis's own labels. */
export function weekStartMonthDay(week: number): string {
  return new Date(Date.UTC(2023, 0, 1 + (week - 1) * 7)).toISOString().slice(5, 10)
}

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

/**
 * Where each month opens on a 1-53 week axis, for the ticks. Fractional on
 * purpose: March opens partway through week 9, and rounding it to a week
 * boundary would drift the later months visibly by December.
 */
export function monthTicks(): { label: string; week: number }[] {
  return MONTH_NAMES.map((label, month) => {
    const dayOfYear = Math.round((Date.UTC(2023, month, 1) - Date.UTC(2023, 0, 1)) / 86_400_000)
    return { label, week: dayOfYear / 7 + 1 }
  })
}

/** "October 26" -- a stored `YYYY-MM-DD` said the way a sentence wants it. */
export function longDate(date: string): string {
  const [, month, day] = date.split("-")
  return `${MONTH_NAMES[Number(month) - 1]} ${Number(day)}`
}
