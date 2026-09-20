#!/usr/bin/env node
/**
 * Refresh Haverhill's station-level weather record from RCC-ACIS.
 *
 * Research data toward the water-balance model discussed for /water, not yet
 * cited on the site -- see data/weather/README.md for what these two files
 * are and why they exist. Like update-budget.mjs, there is no incremental
 * mode: both files are cheap to refetch whole (one POST each), so every run
 * just replaces them. That also means a corrected or reissued NCEI normal is
 * picked up automatically rather than needing a rebuild flag nobody
 * remembers to pass.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import {
  ACIS_URL,
  ELEMENTS,
  NORMAL_ELEMENTS,
  NORMAL_REFERENCE_YEAR,
  STATION,
  diffObserved,
  fetchDailyNormal,
  fetchDailyObserved,
  summarizeNormal,
} from "./lib/weather.mjs"
import { createLog } from "./lib/log.mjs"

const DATA_DIR = path.join(import.meta.dirname, "..", "data", "weather")
export const OBSERVED_FILE = path.join(DATA_DIR, "haverhill-daily-observed.json")
export const NORMAL_FILE = path.join(DATA_DIR, "haverhill-daily-normal.json")

const readData = (file) =>
  readFile(file, "utf8")
    .then((raw) => JSON.parse(raw).data)
    .catch((err) => {
      if (err.code === "ENOENT") return null
      throw err
    })

const log = createLog("weather")
console.log("  reading Haverhill's station-level weather record from RCC-ACIS...")

const [beforeObserved, observed, normal] = await Promise.all([
  readData(OBSERVED_FILE),
  fetchDailyObserved(),
  fetchDailyNormal(),
])

await mkdir(DATA_DIR, { recursive: true })

await writeFile(
  OBSERVED_FILE,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: ACIS_URL,
      station: STATION,
      elements: ELEMENTS.map((el) => `${el.name}: ${el.label}`),
      count: observed.length,
      data: observed,
    },
    null,
    2,
  ) + "\n",
)

const normalSummary = summarizeNormal(normal)

await writeFile(
  NORMAL_FILE,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: ACIS_URL,
      station: STATION,
      elements: NORMAL_ELEMENTS.map((el) => `${el.name}: NCEI 1991-2020 normal, ${el.label}`),
      referenceYear: NORMAL_REFERENCE_YEAR,
      note: "The year in each date is arbitrary -- only the month and day matter.",
      annual: Object.fromEntries(normalSummary.map((s) => [s.name, s.value])),
      count: normal.length,
      data: normal,
    },
    null,
    2,
  ) + "\n",
)

const diff = diffObserved(beforeObserved, observed)
if (!beforeObserved) {
  log.write(`  no previous file; wrote all ${diff.afterCount} days`)
} else if (diff.added === 0) {
  log.write(`  unchanged since the last run (${diff.afterCount} days, through ${diff.lastAfter})`)
} else {
  log.write(
    `  ${diff.added} new day(s): ${diff.lastBefore ?? "(none)"} -> ${diff.lastAfter}, ` +
      `${diff.beforeCount} -> ${diff.afterCount} days total`,
  )
}
log.write(`  normal curve: ${normal.length} days`)
for (const s of normalSummary) {
  log.write(`    ${s.name} (${s.reduce}): ${s.value}`)
}
log.write(`\n  wrote ${OBSERVED_FILE}`)
log.write(`  wrote ${NORMAL_FILE}`)
console.log(`  full run detail: ${log.file}`)
