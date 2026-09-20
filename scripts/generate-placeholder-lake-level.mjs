#!/usr/bin/env node
/**
 * Fabricates a daily Kenoza Lake level as a development placeholder for the
 * water-balance model's own target variable -- the one the equation
 * (rainfall + snowfall + temperature + consumption -> lake level) is meant
 * to explain. Rainfall, snowfall, and temperature are real, station-sourced
 * data (data/weather/); consumption is already a fabricated placeholder
 * (data/consumption/placeholder/); the city has never published a daily
 * lake-level series anywhere found so far, so this stands in until one
 * does.
 *
 * Unlike the consumption placeholder, this one isn't shaped from nothing:
 * the city's own September 15, 2026 Council packet includes a chart --
 * static/excerpts/city-council-2026-09-15/drought-emergency-update/drought-chart.pdf
 * -- plotting Kenoza Lake's "36-Year Average Level" across the calendar
 * year. That curve is real and published, but only as an image; the city
 * has never printed its coordinates as numbers, so AVERAGE_LEVEL_BY_MONTH_START
 * below is this script's own by-eye reading of it (nearest half foot, at
 * each month's first day), not a transcription. Using it shapes the
 * placeholder's seasonal swing and magnitude realistically -- rises through
 * spring, peaks in late May/early June, falls through the rest of the year
 * -- without reproducing the chart's other lines: the "Current Level" and
 * "2025 Level Trend" lines on that same chart show the actual drought
 * decline, and copying that shape into a FABRICATED series would read as
 * invented evidence for the drought this site is otherwise careful to only
 * ever cite, never simulate. So every year here wobbles by a random, capped
 * offset around the one real curve instead of trending anywhere -- flat
 * across years by construction, the same "no drought response, no trend"
 * rule the consumption placeholder follows.
 *
 * NEVER cited on the site, and never run as part of `metadata:update` --
 * every value this writes is invented, which this codebase otherwise never
 * does (see CLAUDE.md, docs/water-pages.md, and every other file under
 * data/). This is the second deliberate exception, marked as loudly as the
 * output format allows.
 *
 * Deterministic (seeded), so re-running it to extend the date range to a
 * later "today" does not also reshuffle every day already generated.
 */
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

const DATA_DIR = path.join(import.meta.dirname, "..", "data", "lake-level", "placeholder")
const OUT_FILE = path.join(DATA_DIR, "haverhill-daily-lake-level.json")

// By eye, to the nearest half foot, off the "36-Year Average Level" line in
// static/excerpts/city-council-2026-09-15/drought-emergency-update/drought-chart.pdf
// -- the city's own real chart, never published as numbers. Index 0 is
// January 1st, index 11 is December 1st; the curve wraps from index 11 back
// to index 0 for the following January 1st.
const AVERAGE_LEVEL_BY_MONTH_START = [
  108.5, // Jan 1
  109.5, // Feb 1
  110.7, // Mar 1
  112.0, // Apr 1
  113.0, // May 1
  113.3, // Jun 1 -- the curve's own peak sits here, not exactly on a month start
  113.0, // Jul 1
  112.2, // Aug 1
  110.6, // Sep 1
  109.3, // Oct 1
  108.5, // Nov 1
  108.2, // Dec 1
]

// How far a whole year's curve is allowed to sit above or below the average
// line, and how much a single day wobbles against its own year's curve --
// both arbitrary, chosen only to look like a real gauge's noise rather than
// a smooth invented line; neither is read off anything.
const YEAR_OFFSET_FEET = 1.5
const DAILY_NOISE_FEET = 0.15

// Forty years back, matching the consumption placeholder, and well inside
// what the real weather record covers. A fixed literal rather than "forty
// years before today": the per-year offsets and daily noise are drawn in
// date order from here forward, so a floating start would reshuffle every
// day already generated on every run.
const START_DATE = "1986-01-01"
const END_DATE = new Date().toISOString().slice(0, 10)

/** A small seeded PRNG (mulberry32), so the output is reproducible run to run. */
function mulberry32(seed) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), a | 1)
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const random = mulberry32(0x4b656e6f) // "Keno" in hex, arbitrary, fixed

/** Linear interpolation between this date's surrounding month-start readings. */
function seasonalLevel(date) {
  const month = date.getUTCMonth()
  const day = date.getUTCDate()
  const daysInMonth = new Date(Date.UTC(date.getUTCFullYear(), month + 1, 0)).getUTCDate()
  const fraction = (day - 1) / daysInMonth
  const start = AVERAGE_LEVEL_BY_MONTH_START[month]
  const end = AVERAGE_LEVEL_BY_MONTH_START[(month + 1) % 12]
  return start + (end - start) * fraction
}

function* everyDay(start, end) {
  let d = new Date(`${start}T00:00:00Z`)
  const last = new Date(`${end}T00:00:00Z`)
  while (d <= last) {
    yield d
    d = new Date(d.getTime() + 86_400_000)
  }
}

// One offset per calendar year, drawn in chronological order so the output
// stays the same however the day loop below happens to run.
const years = []
for (let y = new Date(START_DATE).getUTCFullYear(); y <= new Date(END_DATE).getUTCFullYear(); y++) {
  years.push(y)
}
const yearOffset = new Map(years.map((y) => [y, (random() * 2 - 1) * YEAR_OFFSET_FEET]))

const data = []
for (const date of everyDay(START_DATE, END_DATE)) {
  const feet =
    seasonalLevel(date) +
    yearOffset.get(date.getUTCFullYear()) +
    (random() * 2 - 1) * DAILY_NOISE_FEET
  data.push([date.toISOString().slice(0, 10), Math.round(feet * 100) / 100])
}

await mkdir(DATA_DIR, { recursive: true })
await writeFile(
  OUT_FILE,
  JSON.stringify(
    {
      synthetic: true,
      warning:
        "PLACEHOLDER DATA. Every value in this file is fabricated for development. " +
        "Do not cite it, chart it as fact, or feed it to anything a reader will see -- " +
        "see data/lake-level/README.md.",
      generatedAt: new Date().toISOString(),
      generatedBy: "scripts/generate-placeholder-lake-level.mjs",
      basis: {
        seasonalShape:
          "static/excerpts/city-council-2026-09-15/drought-emergency-update/drought-chart.pdf, " +
          "the city's own real 36-Year Average Level curve -- read by eye to the nearest half " +
          "foot at each month start (AVERAGE_LEVEL_BY_MONTH_START in the generating script), " +
          "since the chart never printed its coordinates as numbers.",
        note:
          "The seasonal shape and magnitude are real-informed; the specific daily values, the " +
          "year-to-year offsets, and the day-to-day noise are all invented. This file does not " +
          "reproduce the chart's 'Current Level' or '2025 Level Trend' lines -- those show the " +
          "actual drought decline, and no year here trends toward or away from it.",
      },
      element: "lakeLevelFeet: Kenoza Lake water level, feet (FABRICATED)",
      count: data.length,
      data,
    },
    null,
    2,
  ) + "\n",
)

console.log(`  wrote ${data.length} FABRICATED days of placeholder lake level to ${OUT_FILE}`)
console.log("  never cite this; see data/lake-level/README.md")
