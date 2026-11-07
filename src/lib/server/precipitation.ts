/**
 * Haverhill's own rainfall record, by month, for the drought page's
 * year-against-year chart.
 *
 * Under `$lib/server` because the station files behind this are some 46,000
 * days and several megabytes, to draw four lines of fifty-odd points each. Importing it from anything the client
 * bundles is a build error rather than a quiet multi-megabyte page.
 *
 * **Three gauges, and a day is the mean of whichever of them read it.** The
 * city's COOP station (`USC00193505`) plus the two CoCoRaHS gauges inside
 * Haverhill, equally weighted -- see the comment on `NEIGHBOUR_STATIONS` in
 * `scripts/lib/weather.mjs` for why those two and not the five other
 * candidates nearby.
 *
 * This was first the city station's own record with the neighbours patched
 * into its gaps, which mattered because that record is read by hand and has
 * them: 36 of 2026's 299 days, 30 in January through March, where a missed
 * reading is usually a multi-day stretch of winter precipitation. Unfilled
 * they understate 2026 by about four inches -- the difference between
 * drawing it as the driest of four years and drawing it level with 2025,
 * where it sits.
 *
 * **Averaging all three instead makes this a Haverhill-area figure rather
 * than one station's**, and the two differ on every day more than one gauge
 * reported, not only on the 36. So each day keeps `cityInches` and each year
 * keeps `cityOnlyToDateInches`: the city's own gauge standing alone is what
 * any statement the city makes about its own station has to be reconciled
 * against, and it is no longer what the chart draws.
 *
 * Nothing here is estimated, interpolated or modelled: every figure is some
 * gauge's own reading of that day. A day no gauge read contributes nothing
 * and is counted in `unreadDays`, rather than being filled from the normal
 * curve -- which would be this site inventing rainfall, the thing it never
 * does.
 *
 * Buckets are calendar months. Weekly ones were tried first and read as
 * noise at four years on one axis -- see the comment in
 * `$lib/precipitation.ts` for that and for the two calendar problems months
 * also dispose of.
 *
 * `haverhill-daily-normal.json` is deliberately not read here. The chart drew
 * the 1991-2020 normal as a dashed reference and it was dropped as a
 * distraction, so nothing on the site reads the normal curve today -- the
 * scrape still refreshes it (see `data/weather/README.md`) and bucketing it
 * the same way these years are bucketed is a short function away if it is
 * ever wanted back.
 */
import {
  type PrecipitationDay,
  type PrecipitationMonth,
  type PrecipitationYear,
  MONTH_NAMES,
  daysInMonth,
} from "$lib/precipitation"
import observedWeather from "../../../data/weather/haverhill-daily-observed.json"
import neighbourPrecipitation from "../../../data/weather/haverhill-neighbours-daily-precip.json"

/** weather.mjs's own ELEMENTS order: date, maxt, mint, avgt, obst, pcpn, snow, snwd. */
const PCPN = 5

const WEATHER_ROWS = observedWeather.data as string[][]
const NEIGHBOUR_ROWS = neighbourPrecipitation.data as unknown as Record<string, [string, string][]>

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
 * This reading of the flags was written twice, here and in `/water`'s own
 * production chart, which predates it and was deliberately not shared with
 * while that page's future was unsettled. It was settled by deleting it, so
 * this is the only copy now.
 */
export function parsePrecipitation(value: string): number | null {
  if (value.startsWith("M")) return null
  if (value.startsWith("T")) return 0
  const match = /^(-?\d+\.?\d*)/.exec(value)
  return match ? Number(match[1]) : 0
}

/**
 * Every day the city gauge's record spans, each the mean of whichever of the
 * three Haverhill gauges read it. Oldest first.
 *
 * The span is the city station's: it reaches back to 1899 where the two
 * volunteer gauges begin in 2015 and 2022, so for most of the record the
 * mean is of one reading and equals that station's own figure. Where all
 * three read a day it is a mean of three.
 */
export function dailyPrecipitation(): PrecipitationDay[] {
  const neighbours = Object.values(NEIGHBOUR_ROWS).map(
    (rows) => new Map(rows.map(([date, value]) => [date, parsePrecipitation(value)])),
  )

  return WEATHER_ROWS.map((row) => {
    const date = row[0]
    const own = parsePrecipitation(row[PCPN])

    const readings = neighbours
      .map((gauge) => gauge.get(date))
      .filter((value): value is number => value !== undefined && value !== null)
    if (own !== null) readings.push(own)

    if (readings.length === 0) {
      return { date, inches: null, gauges: 0, cityRead: false, cityInches: null }
    }
    return {
      date,
      inches: readings.reduce((sum, value) => sum + value, 0) / readings.length,
      gauges: readings.length,
      cityRead: own !== null,
      cityInches: own,
    }
  })
}

/**
 * One entry per year in `years`, each carrying its months of rainfall.
 *
 * A year still in progress stops at its last read month, and that month is
 * marked `partial` -- a total read to October 25th is six days short of the
 * Octobers it is drawn against, and a chart that did not say so would show
 * the current month as unusually dry every time it was built.
 */
export function precipitationByYear(years: number[]): PrecipitationYear[] {
  const days = dailyPrecipitation()
  const wanted = new Set(years)
  const byYear = new Map<number, PrecipitationDay[]>(years.map((year) => [year, []]))

  for (const day of days) {
    const year = Number(day.date.slice(0, 4))
    if (wanted.has(year)) byYear.get(year)!.push(day)
  }

  const built = years.map((year) => {
    const rows = byYear.get(year) ?? []
    const buckets = new Map<number, PrecipitationMonth>()

    for (const day of rows) {
      const month = Number(day.date.slice(5, 7))
      let bucket = buckets.get(month)
      if (!bucket) {
        bucket = {
          month,
          label: MONTH_NAMES[month - 1],
          inches: 0,
          cumulativeInches: 0,
          days: 0,
          partial: false,
          cityDays: 0,
          filledDays: 0,
          unreadDays: 0,
        }
        buckets.set(month, bucket)
      }
      bucket.days++
      if (day.inches === null) bucket.unreadDays++
      else bucket.inches += day.inches
      if (day.cityRead) bucket.cityDays++
      else if (day.gauges > 0) bucket.filledDays++
    }

    const months = [...buckets.values()].sort((a, b) => a.month - b.month)
    let running = 0
    for (const bucket of months) {
      running += bucket.inches
      bucket.inches = round(bucket.inches)
      bucket.cumulativeInches = round(running)
      // Short of its own length, or carrying days nothing read: either way the
      // total is not one a whole month can be compared with.
      bucket.partial = bucket.days < daysInMonth(bucket.month, year)
    }

    const read = rows.filter((day) => day.inches !== null)
    return {
      year,
      months,
      totalInches: round(running),
      // Filled in below, once the whole set is known: it is defined against
      // the newest year's own last day, which one year alone cannot see.
      toDateInches: 0,
      cityOnlyToDateInches: 0,
      throughDate: read.at(-1)?.date ?? `${year}-01-01`,
      cityDays: rows.filter((day) => day.cityRead).length,
      filledDays: rows.filter((day) => !day.cityRead && day.gauges > 0).length,
      unreadDays: rows.filter((day) => day.gauges === 0).length,
    }
  })

  const through = built.at(-1)?.throughDate.slice(5) ?? "12-31"
  for (const year of built) {
    const toDate = (byYear.get(year.year) ?? []).filter((day) => day.date.slice(5) <= through)
    year.cityOnlyToDateInches = round(toDate.reduce((sum, day) => sum + (day.cityInches ?? 0), 0))
    year.toDateInches = round(toDate.reduce((sum, day) => sum + (day.inches ?? 0), 0))
  }
  return built
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
  /**
   * Where a person goes to pull the same records by hand, as against
   * `acisUrl`, which is the endpoint this site queries: that one answers a
   * POST and nothing else, so it is no destination for a reader. xmACIS2 is
   * the public interface to the same ACIS daily data, station by station --
   * the same service, asked the same question, by hand. It is what the
   * rainfall chart links to, which is why it carries a short `name` as well:
   * the chart prints it in a legend row with no room for a sentence.
   */
  portal: { href: "https://xmacis.rcc-acis.org/", name: "xmACIS2" },
  updated: observedWeather.generatedAt as string,
}

const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
