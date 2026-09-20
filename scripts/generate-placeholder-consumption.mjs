#!/usr/bin/env node
/**
 * Fabricates daily water-production figures as a development placeholder for
 * the consumption pillar of the /water water-balance model. Rainfall and
 * temperature are real, station-sourced data (data/weather/); the city has
 * no granular consumption data public anywhere found so far, so this stands
 * in for it until a real source turns up -- the state's Water Management Act
 * Annual Statistical Report, which every permitted withdrawer files, is the
 * likeliest candidate, not yet requested or located.
 *
 * NEVER cited on the site, and never run as part of `metadata:update` --
 * every value this writes is invented, which this codebase otherwise never
 * does (see CLAUDE.md, docs/water-pages.md, and every other file under
 * data/). This is the one deliberate exception, marked as loudly as the
 * output format allows, because a chart and a calculator can't be built or
 * reviewed against a number that doesn't exist yet.
 *
 * Deterministic (seeded), so re-running it to extend the date range to a
 * later "today" does not also reshuffle every day already generated.
 *
 * Replacing it: a real source, once found, should write
 * data/consumption/haverhill-daily-production.json directly (same shape as
 * this file, sans the synthetic/warning fields) -- at which point this
 * script and its whole placeholder/ directory should be deleted, not kept
 * alongside the real thing.
 */
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

const DATA_DIR = path.join(import.meta.dirname, "..", "data", "consumption", "placeholder")
const OUT_FILE = path.join(DATA_DIR, "haverhill-daily-production.json")

// Matches AVERAGE_PRODUCTION_MGD in src/lib/water.ts as of 2026-09-18 -- the
// one real, cited figure this placeholder is anchored to. If that figure is
// ever corrected, update this by hand to match; nothing imports it directly,
// since scripts/ is plain JS and src/lib is TypeScript.
const AVERAGE_MGD = 6.0

// A generic New England utility's seasonal shape (summer irrigation peak,
// winter trough) and day-to-day scatter -- not read off any Haverhill
// source. Deliberately uneventful: no drought, no restriction response, no
// trend, since inventing a shape that looks like it encodes something real
// about this drought would be worse than a flat, obviously generic curve.
const SEASONAL_AMPLITUDE = 0.22
const NOISE_AMPLITUDE = 0.05

// Forty years back, which the real weather record easily covers (the
// station has reported since 1899), so the model has a span worth fitting
// against rather than the three years this started at. 1986 in particular
// buys a long clean stretch: the station's precipitation record has no
// missing days at all from 1986 to 2004, and its one bad patch (2005-2011,
// 2006 more than half unrecorded) reads as the anomaly it is only against
// that much complete record either side of it.
//
// A fixed literal rather than "forty years before today": the PRNG is
// drawn in date order from here forward, so a floating start would
// reshuffle every day already generated on every run, and the determinism
// this script promises depends on it staying put.
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

const random = mulberry32(0x77a7e12) // arbitrary, fixed

function fractionOfYear(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1)
  return (date.getTime() - start) / (1000 * 60 * 60 * 24 * 365.25)
}

function* everyDay(start, end) {
  let d = new Date(`${start}T00:00:00Z`)
  const last = new Date(`${end}T00:00:00Z`)
  while (d <= last) {
    yield d
    d = new Date(d.getTime() + 86_400_000)
  }
}

const data = []
for (const date of everyDay(START_DATE, END_DATE)) {
  // Peak around day-of-year fraction 0.55 (late July), trough six months
  // opposite -- an ordinary cosine, nothing fitted to any real record.
  const seasonal = Math.cos((fractionOfYear(date) - 0.55) * 2 * Math.PI)
  const noise = (random() * 2 - 1) * NOISE_AMPLITUDE
  const mgd = AVERAGE_MGD * (1 + SEASONAL_AMPLITUDE * seasonal + noise)
  data.push([date.toISOString().slice(0, 10), Math.round(mgd * 1000) / 1000])
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
        "see data/consumption/README.md.",
      generatedAt: new Date().toISOString(),
      generatedBy: "scripts/generate-placeholder-consumption.mjs",
      basis: {
        averageProductionMgd: AVERAGE_MGD,
        note:
          "Matches AVERAGE_PRODUCTION_MGD in src/lib/water.ts as of 2026-09-18, the only " +
          "real figure this placeholder is anchored to. The seasonal shape and day-to-day " +
          "noise are invented, not drawn from any Haverhill source.",
      },
      element: "productionMgd: total treated water produced, million gallons/day (FABRICATED)",
      count: data.length,
      data,
    },
    null,
    2,
  ) + "\n",
)

console.log(`  wrote ${data.length} FABRICATED days of placeholder consumption to ${OUT_FILE}`)
console.log("  never cite this; see data/consumption/README.md")
