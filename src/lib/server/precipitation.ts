/**
 * Haverhill's own rainfall record, by week, for the drought page's
 * year-against-year chart.
 *
 * Under `$lib/server` for the same reason `water-series.ts` is: the station
 * files behind this are some 46,000 days and several megabytes, to draw four
 * lines of fifty-odd points each. Importing it from anything the client
 * bundles is a build error rather than a quiet multi-megabyte page.
 *
 * **Three gauges, one series, and the page has to say which day came from
 * where.** The city's COOP station (`USC00193505`) is read by hand, so its
 * record has gaps -- 35 of 2026's first 298 days, 30 of them in January
 * through March, where a missed reading is usually a multi-day stretch of
 * winter precipitation. Left unfilled they understate 2026 by about four
 * inches, which is the difference between drawing it as the driest of four
 * years and drawing it level with 2025, where it actually sits. So a day the
 * city gauge did not read is filled from the two CoCoRaHS gauges inside
 * Haverhill -- their mean where both read it, the one figure where only one
 * did. See the comment on `NEIGHBOUR_STATIONS` in `scripts/lib/weather.mjs`
 * for why those two gauges and not the five other candidates nearby.
 *
 * Nothing here is estimated, interpolated or modelled: every figure is some
 * gauge's own reading of that day, and `filledDays` says how many of a
 * week's came from a neighbour rather than the city's own. A day no gauge
 * read contributes nothing and is counted in `unreadDays`, rather than
 * being filled from the normal curve -- which would be this site inventing
 * rainfall, the thing it never does.
 */
import {
  type PrecipitationDay,
  type PrecipitationWeek,
  type PrecipitationYear,
  weekOfYear,
  weekStartMonthDay,
} from "$lib/precipitation"
import observedWeather from "../../../data/weather/haverhill-daily-observed.json"
import normalWeather from "../../../data/weather/haverhill-daily-normal.json"
import neighbourPrecipitation from "../../../data/weather/haverhill-neighbours-daily-precip.json"

/** weather.mjs's own ELEMENTS order: date, maxt, mint, avgt, obst, pcpn, snow, snwd. */
const PCPN = 5

const WEATHER_ROWS = observedWeather.data as string[][]
const NORMAL_ROWS = normalWeather.data as string[][]
const NEIGHBOUR_ROWS = neighbourPrecipitation.data as unknown as Record<string, [string, string][]>

/** The normal file's own element order, so `pcpn` is found rather than assumed. */
const NORMAL_PCPN =
  normalWeather.elements.findIndex((label: string) => label.startsWith("pcpn")) + 1

/**
 * A day's precipitation in inches, or `null` where the gauge recorded none.
 *
 * ACIS flags the value rather than the field, and the flags are not all the
 * same kind of thing: `M` is missing and is the only one that means "no
 * reading at all" -- `T` is a trace, an amount too small to measure, which
 * is 0 rather than unknown; a bare `S` is a day rolled into a later
 * accumulated total, so it is 0 here to keep from counting its water twice;
 * and `0.42A` is that accumulated total itself, a real figure covering
 * several days, which lands on whichever day carries it.
 *
 * Deliberately the same reading of the flags as `water-series.ts`'s own
 * `parsePrecipitation`, which predates this and belongs to the `/water`
 * production chart. Not shared between them while that page's future is
 * unsettled -- see docs/water-pages.md.
 */
export function parsePrecipitation(value: string): number | null {
  if (value.startsWith("M")) return null
  if (value.startsWith("T")) return 0
  const match = /^(-?\d+\.?\d*)/.exec(value)
  return match ? Number(match[1]) : 0
}

/**
 * Every day the city gauge covers, with a neighbour's reading standing in
 * where the city's observer missed one. Oldest first.
 */
export function dailyPrecipitation(): PrecipitationDay[] {
  const neighbours = Object.values(NEIGHBOUR_ROWS).map(
    (rows) => new Map(rows.map(([date, value]) => [date, parsePrecipitation(value)])),
  )

  return WEATHER_ROWS.map((row) => {
    const date = row[0]
    const own = parsePrecipitation(row[PCPN])
    if (own !== null) return { date, inches: own, source: "city" as const, gauges: 1 }

    const readings = neighbours
      .map((gauge) => gauge.get(date))
      .filter((value): value is number => value !== undefined && value !== null)

    if (readings.length === 0) {
      return { date, inches: null, source: "unread" as const, gauges: 0 }
    }
    const mean = readings.reduce((sum, value) => sum + value, 0) / readings.length
    return { date, inches: mean, source: "neighbour" as const, gauges: readings.length }
  })
}

/**
 * One entry per year in `years`, each carrying its weeks of accumulating
 * rainfall. A year still in progress simply stops at its last read day --
 * the chart's own x axis is the date, so a line ending in October reads as
 * a year not finished rather than as a dry one.
 */
export function precipitationByYear(years: number[]): PrecipitationYear[] {
  const days = dailyPrecipitation()
  const wanted = new Set(years)
  const byYear = new Map<number, PrecipitationDay[]>(years.map((year) => [year, []]))

  for (const day of days) {
    const year = Number(day.date.slice(0, 4))
    if (wanted.has(year)) byYear.get(year)!.push(day)
  }

  return years.map((year) => {
    const rows = byYear.get(year) ?? []
    const buckets = new Map<number, PrecipitationWeek>()

    for (const day of rows) {
      const week = weekOfYear(day.date.slice(5), year)
      let bucket = buckets.get(week)
      if (!bucket) {
        bucket = {
          week,
          startMonthDay: weekStartMonthDay(week),
          inches: 0,
          cumulativeInches: 0,
          filledDays: 0,
          unreadDays: 0,
        }
        buckets.set(week, bucket)
      }
      if (day.inches === null) bucket.unreadDays++
      else bucket.inches += day.inches
      if (day.source === "neighbour") bucket.filledDays++
    }

    const weeks = [...buckets.values()].sort((a, b) => a.week - b.week)
    let running = 0
    for (const bucket of weeks) {
      running += bucket.inches
      bucket.inches = round(bucket.inches)
      bucket.cumulativeInches = round(running)
    }

    const read = rows.filter((day) => day.inches !== null)
    return {
      year,
      weeks,
      totalInches: round(running),
      throughDate: read.at(-1)?.date ?? `${year}-01-01`,
      filledDays: rows.filter((day) => day.source === "neighbour").length,
      unreadDays: rows.filter((day) => day.source === "unread").length,
    }
  })
}

/**
 * NCEI's 1991-2020 normal, accumulated the same way, as the line the four
 * years are read against. The date in each row of the normal file is
 * arbitrary -- only the month and day matter -- so this is bucketed on a
 * non-leap year to match the labels.
 */
export function normalByWeek(): PrecipitationWeek[] {
  const buckets = new Map<number, PrecipitationWeek>()
  for (const row of NORMAL_ROWS) {
    const monthDay = row[0].slice(5)
    if (monthDay === "02-29") continue
    const week = weekOfYear(monthDay, 2023)
    let bucket = buckets.get(week)
    if (!bucket) {
      bucket = {
        week,
        startMonthDay: weekStartMonthDay(week),
        inches: 0,
        cumulativeInches: 0,
        filledDays: 0,
        unreadDays: 0,
      }
      buckets.set(week, bucket)
    }
    bucket.inches += parsePrecipitation(row[NORMAL_PCPN]) ?? 0
  }

  const weeks = [...buckets.values()].sort((a, b) => a.week - b.week)
  let running = 0
  for (const bucket of weeks) {
    running += bucket.inches
    bucket.inches = round(bucket.inches)
    bucket.cumulativeInches = round(running)
  }
  return weeks
}

/** Where the three gauges behind all of this came from, for the page's Sources. */
export const PRECIPITATION_SOURCE = {
  cityStation: observedWeather.station,
  neighbourStations: neighbourPrecipitation.stations as {
    sid: string
    name: string
    network: string
    miles: number
    count: number
  }[],
  acisUrl: observedWeather.source as string,
  updated: observedWeather.generatedAt as string,
}

const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
