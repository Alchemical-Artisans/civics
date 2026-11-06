/**
 * The `/water` production chart's own rows, aggregated here rather than in
 * the component, because the files behind them are far too big to ship to a
 * browser: the station's daily weather record alone is some 46,000 days and
 * several megabytes, to draw a line of twenty points. Under `$lib/server`,
 * so importing it from anything the client bundles is a build error rather
 * than a quiet several-megabyte page -- the same reason the calendar's own
 * route loads through `+page.server.ts` (see CLAUDE.md).
 *
 * A window is the trailing twelve months, tiled backward from the last day
 * the production series covers, never the calendar year -- the data almost
 * never ends on December 31st, and a calendar-year grouping would leave a
 * partial bar needing its own caveat. A window short of a full year at the
 * far end is dropped rather than drawn.
 *
 * **The two series are not the same kind of thing, and the page has to say
 * so.** `producedMg` is fabricated outright (see data/consumption/README.md);
 * `rainfallInches` is the real Haverhill COOP station's own record. They are
 * charted together, so nothing here lets a caller forget which is which.
 */
import placeholderProduction from "../../../data/consumption/placeholder/haverhill-daily-production.json"
import observedWeather from "../../../data/weather/haverhill-daily-observed.json"

/** The placeholder file's own warning, carried through rather than restated by hand. */
export const PRODUCTION_WARNING: string = placeholderProduction.warning

const PRODUCTION_ROWS = placeholderProduction.data as [string, number][]

/** weather.mjs's own ELEMENTS order: date, maxt, mint, avgt, obst, pcpn, snow, snwd. */
const AVGT = 3
const PCPN = 5
const WEATHER_ROWS = observedWeather.data as string[][]

function addDays(date: string, delta: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

function oneYearBefore(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCFullYear(d.getUTCFullYear() - 1)
  return d.toISOString().slice(0, 10)
}

/**
 * A day's precipitation in inches, or `null` where the station recorded
 * none. ACIS flags the value rather than the field: `M` is missing and is
 * the only one that means "no reading" -- `T` is a trace, an amount too
 * small to measure, which is 0 rather than unknown; a bare `S` is a day
 * rolled into a later accumulated total, so it is 0 here to keep from
 * counting it twice; and `0.42A` is that accumulated total itself, a real
 * figure covering several days, which lands in whichever window its own
 * day falls in.
 */
function parsePrecipitation(value: string): number | null {
  if (value.startsWith("M")) return null
  if (value.startsWith("T")) return 0
  const match = /^(-?\d+\.?\d*)/.exec(value)
  return match ? Number(match[1]) : 0
}

/**
 * A day's mean temperature in °F, or `null` where the station recorded
 * none. No trace or accumulation cases here -- a temperature is either
 * read or it isn't -- so anything without a leading number is missing.
 */
function parseTemperature(value: string): number | null {
  const match = /^(-?\d+\.?\d*)/.exec(value)
  return match ? Number(match[1]) : null
}

export interface WaterWindow {
  /** The first date this twelve-month window covers. */
  startDate: string
  /** The last date it covers -- what the chart labels the bar with. */
  endDate: string
  /** Million gallons produced across the window. FABRICATED -- see the module comment. */
  producedMg: number
  /** Inches of precipitation across the window, from the station's real record. */
  rainfallInches: number
  /** Days in the window the station recorded no precipitation reading at all. */
  rainfallMissingDays: number
  /**
   * Mean daily temperature across the window in °F, from the station's real
   * record -- the mean of the days it actually read, not of the calendar,
   * so a window with gaps is an average of what was measured.
   */
  avgTempF: number
  /** Days in the window the station recorded no temperature at all. */
  tempMissingDays: number
}

/**
 * Complete, non-overlapping twelve-month windows, oldest first, with each
 * series summed across each one.
 */
export function waterWindows(): WaterWindow[] {
  const producedByDate = new Map(PRODUCTION_ROWS)
  const rainByDate = new Map(WEATHER_ROWS.map((row) => [row[0], parsePrecipitation(row[PCPN])]))
  const tempByDate = new Map(WEATHER_ROWS.map((row) => [row[0], parseTemperature(row[AVGT])]))

  const dates = [...producedByDate.keys()].sort()
  const earliest = dates[0]
  const windows: WaterWindow[] = []

  let end = dates.at(-1)
  while (end) {
    const start = addDays(oneYearBefore(end), 1)
    if (start < earliest) break

    let producedMg = 0
    let rainfallInches = 0
    let rainfallMissingDays = 0
    let tempSum = 0
    let tempDays = 0
    let tempMissingDays = 0
    for (let date = start; date <= end; date = addDays(date, 1)) {
      producedMg += producedByDate.get(date) ?? 0

      const rain = rainByDate.get(date)
      if (rain === null || rain === undefined) rainfallMissingDays++
      else rainfallInches += rain

      const temp = tempByDate.get(date)
      if (temp === null || temp === undefined) tempMissingDays++
      else {
        tempSum += temp
        tempDays++
      }
    }

    windows.push({
      startDate: start,
      endDate: end,
      producedMg,
      rainfallInches,
      rainfallMissingDays,
      avgTempF: tempDays ? tempSum / tempDays : 0,
      tempMissingDays,
    })
    end = addDays(start, -1)
  }

  return windows.reverse()
}
