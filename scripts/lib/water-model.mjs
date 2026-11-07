/**
 * Joins the water-balance model's own inputs -- real weather, and
 * production/lake-level, real once they exist and the placeholders until
 * then -- into rows a regression can train on, one row per day.
 *
 * The target is the day's own change in lake level, not the level itself:
 * ΔLevel(t) = Inflow(t) - Evaporation(t) - Production(t) is the actual
 * water-balance identity, and fitting the change
 * rather than the level lets the regression's coefficients stand in for the
 * physical constants that identity needs -- a runoff coefficient, an
 * evaporation rate, a production-to-drawdown factor -- without this site
 * having to go find Kenoza Lake's watershed area or fit an evaporation
 * formula by hand. `pcpn` is the day's own rainfall (inflow); `snowmeltProxy`
 * is snow depth already on the ground times how far above freezing the day
 * got, a simple degree-day melt model, since fresh snowfall itself doesn't
 * reach the lake until it melts; `avgt` stands in for evaporation, now that
 * production is its own feature to control for the demand side of
 * temperature's effect separately.
 */
import { readFile } from "node:fs/promises"
import path from "node:path"
import { parseInches } from "./weather.mjs"

const ROOT = path.join(import.meta.dirname, "..", "..")

export const WEATHER_FILE = path.join(ROOT, "data", "weather", "haverhill-daily-observed.json")

/**
 * Real path first, placeholder second -- exactly the swap each pillar's own
 * README describes under "Replacing the placeholder." This is the whole
 * point of building the pipeline now: dropping a real file at the first
 * path is all it takes for the next training run to stop training on
 * fabricated data, no script change required.
 */
export const PRODUCTION_SOURCES = {
  real: path.join(ROOT, "data", "consumption", "haverhill-daily-production.json"),
  placeholder: path.join(
    ROOT,
    "data",
    "consumption",
    "placeholder",
    "haverhill-daily-production.json",
  ),
}
export const LAKE_LEVEL_SOURCES = {
  real: path.join(ROOT, "data", "lake-level", "haverhill-daily-lake-level.json"),
  placeholder: path.join(
    ROOT,
    "data",
    "lake-level",
    "placeholder",
    "haverhill-daily-lake-level.json",
  ),
}

export const FEATURE_NAMES = ["pcpn", "snowmeltProxy", "avgt", "production"]

async function readJsonIfExists(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"))
  } catch (err) {
    if (err.code === "ENOENT") return null
    throw err
  }
}

/** Reads whichever of a pillar's two paths exists, real winning, and says which it used. */
export async function readSeries(sources) {
  const real = await readJsonIfExists(sources.real)
  if (real) return { rows: real.data, synthetic: false, path: sources.real }
  const placeholder = await readJsonIfExists(sources.placeholder)
  if (placeholder) return { rows: placeholder.data, synthetic: true, path: sources.placeholder }
  throw new Error(`no data at ${sources.real} or ${sources.placeholder}`)
}

/** A path relative to the repo root, for a committed artifact that shouldn't carry a machine's own home directory. */
const relative = (file) => path.relative(ROOT, file)

/** Loads all three inputs from disk, real-over-placeholder, for `buildTrainingRows`. */
export async function loadSeries() {
  const [weatherFile, production, lakeLevel] = await Promise.all([
    readJsonIfExists(WEATHER_FILE),
    readSeries(PRODUCTION_SOURCES),
    readSeries(LAKE_LEVEL_SOURCES),
  ])
  if (!weatherFile) throw new Error(`no data at ${WEATHER_FILE}`)
  return {
    weather: { rows: weatherFile.data, synthetic: false, path: relative(WEATHER_FILE) },
    production: { ...production, path: relative(production.path) },
    lakeLevel: { ...lakeLevel, path: relative(lakeLevel.path) },
  }
}

// weather.mjs's own ELEMENTS order: date, maxt, mint, avgt, obst, pcpn, snow, snwd.
const WEATHER_COLUMNS = { avgt: 3, pcpn: 5, snwd: 7 }

function weatherByDate(rows) {
  const byDate = new Map()
  for (const row of rows) {
    byDate.set(row[0], {
      avgt: parseInches(row[WEATHER_COLUMNS.avgt]),
      pcpn: parseInches(row[WEATHER_COLUMNS.pcpn]),
      snwd: parseInches(row[WEATHER_COLUMNS.snwd]),
    })
  }
  return byDate
}

const seriesByDate = (rows) => new Map(rows.map(([date, value]) => [date, value]))

/** The calendar day before a `YYYY-MM-DD` string, UTC, like every other date on this site. */
function dayBefore(date) {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

/**
 * Builds one training row per day that has everything it needs: that day's
 * rainfall and temperature, the previous *calendar* day's snow depth (for
 * the melt proxy) and lake level (to take the difference against), and
 * that day's own production figure. A day missing any of those -- a
 * flagged-missing weather reading, a gap at either pillar's own edge, or a
 * lake-level series that skips a day (a real gauge might not read daily,
 * even once this is real data) -- is skipped rather than guessed at or
 * silently spanning the gap, and the count of each is returned so a
 * training run can say how much of the calendar it actually used.
 */
export function buildTrainingRows({ weather, production, lakeLevel }) {
  const weatherRows = weatherByDate(weather.rows)
  const productionByDate = seriesByDate(production.rows)
  const levelByDate = seriesByDate(lakeLevel.rows)

  const dates = [...levelByDate.keys()].sort()

  const rows = []
  let skippedMissingWeather = 0
  let skippedMissingProduction = 0
  let skippedGap = 0

  for (const date of dates) {
    const previousDate = dayBefore(date)

    const level = levelByDate.get(date)
    const previousLevel = levelByDate.get(previousDate)
    if (previousLevel === undefined) {
      skippedGap++
      continue // no reading for the calendar day before this one
    }

    const today = weatherRows.get(date)
    const yesterday = weatherRows.get(previousDate)
    const productionToday = productionByDate.get(date)

    if (productionToday === undefined) {
      skippedMissingProduction++
      continue
    }
    if (
      !today ||
      !yesterday ||
      today.pcpn === null ||
      today.avgt === null ||
      yesterday.snwd === null
    ) {
      skippedMissingWeather++
      continue
    }

    const snowmeltProxy = yesterday.snwd * Math.max(0, today.avgt - 32)

    rows.push({
      date,
      features: [today.pcpn, snowmeltProxy, today.avgt, productionToday],
      target: level - previousLevel,
    })
  }

  return { rows, skippedMissingWeather, skippedMissingProduction, skippedGap }
}
