#!/usr/bin/env node
/**
 * Fits the water-balance model: rainfall + snowmelt + temperature +
 * production -> the day's own change in Kenoza Lake's level. See the doc
 * comment on scripts/lib/water-model.mjs for the equation this stands in
 * for and why the target is a *change* in level rather than the level
 * itself.
 *
 * This is infrastructure, not a result -- production and lake level are
 * both still fabricated placeholders (data/consumption/README.md,
 * data/lake-level/README.md), so today's fitted coefficients explain
 * nothing about Kenoza Lake. The point is that scripts/lib/water-model.mjs
 * reads a real file over a placeholder automatically, so the moment real
 * production and lake-level data land at the paths their own READMEs
 * describe, rerunning this script is the entire job: no code changes, no
 * rebuilt pipeline, just `npm run model:train` against real numbers.
 *
 * NEVER cited on the site, and never run as part of `metadata:update` --
 * for as long as any input is a placeholder, this writes a model built on
 * invented data, same as the placeholders themselves.
 */
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { fitRidgeRegression } from "./lib/regression.mjs"
import { buildTrainingRows, FEATURE_NAMES, loadSeries } from "./lib/water-model.mjs"

const OUT_FILE = path.join(import.meta.dirname, "..", "data", "lake-level", "model.json")

const RIDGE_LAMBDA = 1

console.log("  loading rainfall/snow/temperature, production, and lake-level series...")
const series = await loadSeries()

const { rows, skippedMissingWeather, skippedMissingProduction, skippedGap } =
  buildTrainingRows(series)

if (rows.length < 30) {
  throw new Error(
    `only ${rows.length} usable training rows (need at least 30) -- check that the placeholder ` +
      "or real data files actually overlap in date range",
  )
}

const X = rows.map((row) => row.features)
const y = rows.map((row) => row.target)
const model = fitRidgeRegression(X, y, RIDGE_LAMBDA)

const trainedOn = {
  weather: { synthetic: series.weather.synthetic, path: series.weather.path },
  production: { synthetic: series.production.synthetic, path: series.production.path },
  lakeLevel: { synthetic: series.lakeLevel.synthetic, path: series.lakeLevel.path },
}
const anySynthetic = Object.values(trainedOn).some((source) => source.synthetic)

await mkdir(path.dirname(OUT_FILE), { recursive: true })
await writeFile(
  OUT_FILE,
  JSON.stringify(
    {
      ...(anySynthetic && {
        synthetic: true,
        warning:
          "PLACEHOLDER MODEL. Trained on fabricated data -- see the 'trainedOn' field below for " +
          "which inputs. These coefficients explain nothing about the real Kenoza Lake yet. Do " +
          "not cite this or show it to a reader.",
      }),
      generatedAt: new Date().toISOString(),
      generatedBy: "scripts/train-lake-level-model.mjs",
      trainedOn,
      target: "change in lake level (feet) from the previous day to this one",
      featureNames: FEATURE_NAMES,
      lambda: RIDGE_LAMBDA,
      coefficients: model.coefficients,
      intercept: model.intercept,
      rSquared: model.rSquared,
      sampleCount: rows.length,
      dateRange: { start: rows[0].date, end: rows.at(-1).date },
      skipped: {
        missingWeather: skippedMissingWeather,
        missingProduction: skippedMissingProduction,
        gap: skippedGap,
      },
    },
    null,
    2,
  ) + "\n",
)

console.log(`  trained on ${rows.length} days (${rows[0].date} to ${rows.at(-1).date})`)
console.log(`  R^2 (in-sample): ${model.rSquared.toFixed(4)}`)
for (const [i, name] of FEATURE_NAMES.entries()) {
  console.log(`    ${name}: ${model.coefficients[i].toFixed(4)}`)
}
console.log(`    intercept: ${model.intercept.toFixed(4)}`)
if (anySynthetic) {
  console.log("  PLACEHOLDER MODEL -- at least one input is still fabricated, see trainedOn above")
}
console.log(`\n  wrote ${OUT_FILE}`)
