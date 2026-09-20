/**
 * Haverhill-specific daily weather, from RCC-ACIS rather than NOAA's
 * statewide Climate at a Glance API (already used by src/lib/rainfall.ts) --
 * that one has no finer grain than Massachusetts as a whole. ACIS
 * (https://www.rcc-acis.org/), run by NOAA's Regional Climate Centers,
 * aggregates individual station records, and Haverhill has its own: a
 * National Weather Service Cooperative Observer station inside the city,
 * reporting since 1899 and still active -- confirmed via ACIS's StnMeta
 * search as the only station actually inside city limits with a
 * long-running, currently-active record (the closer-sounding "Kenoza Lake"
 * station stopped reporting in 1945, and the regional airport, Lawrence
 * Municipal, is a different town five miles off).
 *
 * This is research data toward the water-balance model discussed for
 * /water -- rainfall, snowfall, temperature and consumption, none of it
 * cited on the site yet. See data/weather/README.md for what the two files
 * this writes actually contain. One request already gets precipitation,
 * snow, and temperature together, since they're the same station and ACIS
 * charges nothing extra for a wider `elems` list -- there is no separate
 * "rainfall" fetch and "temperature" fetch to keep in sync.
 */
import { USER_AGENT, retrying } from "./haverhill.mjs"

export const ACIS_URL = "https://data.rcc-acis.org/StnData"

export const STATION = {
  sid: "USC00193505",
  name: "HAVERHILL",
  network: "COOP",
  lat: 42.7594,
  lon: -71.0602,
}

/**
 * Every element requested, in the exact order ACIS returns them (the date is
 * always its own column ahead of these). This is not the full Table 3 list
 * of everything a COOP station can report -- it's what this station was
 * confirmed to actually report. Two plausible elements were checked and
 * dropped: water-equivalent-of-snow-depth (var major 13) and pan evaporation
 * (var major 7) both came back "no data available" for the whole of 2025,
 * so this station plausibly never measures either, and pulling them would
 * mean two always-empty columns rather than two real ones.
 *
 * `normal` says whether NCEI publishes a 30-year normal for this element at
 * this station, and how a run of days combines into one figure when the
 * normal curve gets summarized for the log: "sum" for an accumulating
 * quantity (rain, snow), "mean" for a snapshot one (temperature). ACIS
 * refuses `normal: "1"` for `snwd` and `obst` outright ("bad args") --
 * confirmed by asking for each element's normal alone -- which is why those
 * two carry `normal: null` and are missing from the normal file entirely.
 */
export const ELEMENTS = [
  { name: "maxt", label: "Maximum temperature (°F)", normal: "mean" },
  { name: "mint", label: "Minimum temperature (°F)", normal: "mean" },
  { name: "avgt", label: "Average temperature (°F)", normal: "mean" },
  { name: "obst", label: "Observation-time temperature (°F)", normal: null },
  { name: "pcpn", label: "Total precipitation, liquid-water-equivalent (inches)", normal: "sum" },
  { name: "snow", label: "Snowfall (inches)", normal: "sum" },
  { name: "snwd", label: "Snow depth on the ground (inches)", normal: null },
]

export const NORMAL_ELEMENTS = ELEMENTS.filter((e) => e.normal)

/**
 * A leap year to hang the 366-day normal curve on. NCEI's daily normal is a
 * calendar-day curve, not tied to any one year -- 2024 is picked only
 * because it is a leap year, which is what gets Feb 29 its own value
 * instead of silently dropping a day the city's own lake can still see
 * rain or snow fall on.
 */
export const NORMAL_REFERENCE_YEAR = 2024

/**
 * The fewest days a parse can plausibly return. The station's period of
 * record starts 1899-11-01; a response this much shorter than that means
 * ACIS's request shape or response shape has changed, not that the station
 * has less history than it did yesterday.
 */
const MIN_OBSERVED_DAYS = 40000

const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

/** Today, as the YYYY-MM-DD ACIS expects -- UTC, same as every other date in this codebase. */
export function todayISO(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

/**
 * Pulls the leading number out of an ACIS value and drops any trailing flag
 * letter (M missing, S/A accumulated over more than one day, T trace).
 * Returns null for a value that is only a flag, with nothing to parse.
 */
export function parseInches(value) {
  const match = /^(-?\d+\.?\d*)/.exec(value)
  return match ? Number(match[1]) : null
}

/**
 * Reduces a normal curve's rows into one figure per element -- summed for an
 * accumulating quantity, averaged for a snapshot one, per each element's own
 * `normal` field. `data` rows are `[date, ...values]` in `elements` order.
 */
export function summarizeNormal(data, elements = NORMAL_ELEMENTS) {
  return elements.map((el, i) => {
    const values = data.map((row) => parseInches(row[i + 1])).filter((v) => v !== null)
    const value =
      el.normal === "sum"
        ? values.reduce((sum, v) => sum + v, 0)
        : values.reduce((sum, v) => sum + v, 0) / values.length
    return {
      name: el.name,
      label: el.label,
      reduce: el.normal,
      value: Math.round(value * 100) / 100,
    }
  })
}

/**
 * Validates an ACIS response and returns its `data` rows. Separated from the
 * fetch itself so a parse this short is caught the same way whether it came
 * from a live pull or a fixture in a test.
 */
export function parseObserved(json) {
  if (!Array.isArray(json?.data)) throw new Error("ACIS response carried no data array")
  if (json.data.length < MIN_OBSERVED_DAYS) {
    throw new Error(
      `ACIS returned only ${json.data.length} days of Haverhill weather, expected at least ` +
        `${MIN_OBSERVED_DAYS}. The query or the API's response shape has probably changed -- ` +
        `check ${ACIS_URL} before trusting this.`,
    )
  }
  return json.data
}

/** Same validation for the normal curve, against the one reference year's own day count. */
export function parseNormal(json, { year = NORMAL_REFERENCE_YEAR } = {}) {
  const expected = isLeapYear(year) ? 366 : 365
  if (!Array.isArray(json?.data)) throw new Error("ACIS response carried no data array")
  if (json.data.length !== expected) {
    throw new Error(
      `ACIS returned ${json.data.length} days of normal weather for ${year}, expected ` +
        `${expected}.`,
    )
  }
  return json.data
}

async function postAcis(label, body) {
  return retrying(label, async () => {
    const res = await fetch(ACIS_URL, {
      method: "POST",
      headers: { "User-Agent": USER_AGENT, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  })
}

/** Every daily reading for every element in `ELEMENTS`, start of record through today. */
export async function fetchDailyObserved({ sdate = "1899-11-01", edate = todayISO() } = {}) {
  const json = await postAcis("ACIS daily observed weather", {
    sid: STATION.sid,
    sdate,
    edate,
    elems: ELEMENTS.map((el) => ({ name: el.name, interval: "dly" })),
  })
  return parseObserved(json)
}

/**
 * NCEI's 1991-2020 climate normal, one value per calendar day per element in
 * `NORMAL_ELEMENTS`, at this station's own location -- not gridded to the
 * state or interpolated from a neighboring station. `normal: "1"` is
 * documented on ACIS's web-services page (rcc-acis.org/ACISWSdoc.html) as
 * "1 or 91 for the 1991-2020 normal".
 */
export async function fetchDailyNormal({ year = NORMAL_REFERENCE_YEAR } = {}) {
  const json = await postAcis("ACIS daily normal weather", {
    sid: STATION.sid,
    sdate: `${year}-01-01`,
    edate: `${year}-12-31`,
    elems: NORMAL_ELEMENTS.map((el) => ({ name: el.name, interval: "dly", normal: "1" })),
  })
  return parseNormal(json, { year })
}

/** What changed in the observed record between two runs, for the log. */
export function diffObserved(before, after) {
  return {
    beforeCount: before?.length ?? 0,
    afterCount: after.length,
    added: after.length - (before?.length ?? 0),
    lastBefore: before?.at(-1)?.[0] ?? null,
    lastAfter: after.at(-1)?.[0] ?? null,
  }
}
