# Haverhill lake-level data -- PLACEHOLDER, not real

**Nothing under `placeholder/` is real.** It's fabricated by
`scripts/generate-placeholder-lake-level.mjs`. Unlike the consumption
placeholder, the shape isn't arbitrary: the city's own September 15, 2026
Council packet includes a chart --
`static/excerpts/city-council-2026-09-15/drought-emergency-update/drought-chart.pdf`
-- plotting Kenoza Lake's "36-Year Average Level" across the calendar year.
That curve is real and published, but only as an image; the city has never
printed its coordinates as numbers, so the generating script's own
`AVERAGE_LEVEL_BY_MONTH_START` is a by-eye reading of it (nearest half foot,
at each month start), not a transcription. Every file this writes says so in
the payload itself (`synthetic: true`, a `warning` field, a `basis` object
naming the chart), not only here -- see CLAUDE.md and `docs/water-pages.md`
for this codebase's wider rule that nothing on the site is invented, and
`data/consumption/README.md` for the same exception applied there first.

**The chart's other two lines are deliberately not used.** Alongside the
36-year average, it also plots "Current Level" (the real 2026 drought
decline, down to 100.3 ft by mid-September) and "2025 Level Trend" -- both
real, both already the actual evidence for the drought. Reproducing either
shape into a FABRICATED series would read as invented proof of the drought
this site otherwise only ever cites, never simulates. So the placeholder
uses only the average curve's seasonal shape and magnitude, and every
year's copy of it wobbles by a random, capped, non-trending offset -- flat
across years by construction, matching the consumption placeholder's own
"no drought response, no trend" rule.

**Never cite this. Never run it as part of `npm run metadata:update`.** It
has no entry in `scripts/update-metadata.mjs` on purpose.

Lake level is the water-balance model's own target: the equation this
model is working toward is rainfall + snowfall + temperature + consumption
-> lake level, and this file stands in for the "lake level" side of it
until the city publishes a real daily series (nothing found yet). Rainfall,
snowfall, and temperature are already real (`data/weather/`); consumption
is the other fabricated placeholder (`data/consumption/`).

## Replacing the placeholder

A real source should write `data/lake-level/haverhill-daily-lake-level.json`
directly -- same shape as the placeholder file below, minus the
`synthetic`/`warning`/`basis` fields -- at whatever granularity it actually
comes in. Once that file exists, delete
`scripts/generate-placeholder-lake-level.mjs` and the whole `placeholder/`
directory rather than leaving fabricated data sitting next to the real
thing.

## Placeholder file shape

`placeholder/haverhill-daily-lake-level.json`: one row per day,
`[date, lakeLevelFeet]`, 1986-01-01 through today -- forty years, which the
real weather record covers easily and the chart on `/water` draws a bar of
each trailing twelve months of. A seasonal curve
interpolated from the real 36-Year Average Level chart (see above), plus a
per-year random offset (±1.5 ft, one draw per calendar year) and ±0.15 ft of
day-to-day noise, both from a seeded PRNG, so regenerating it is
reproducible rather than a fresh set of random numbers every run.

Regenerate (e.g., to extend the range to a later "today"):

```sh
node scripts/generate-placeholder-lake-level.mjs
```

## `model.json`

Also fabricated, one level further removed: `scripts/train-lake-level-model.mjs`
(`npm run model:train`) fits a ridge regression -- rainfall, a snowmelt
proxy, temperature, and production predicting the day's own change in lake
level -- and writes the fit here. `scripts/lib/water-model.mjs`, which joins
the inputs for it, reads a real file over a placeholder automatically at
each pillar's own path, so this is the one piece of the model meant to be
rerun rather than replaced: once real production and lake-level data land
at the paths their READMEs describe, `npm run model:train` is the entire
job. Until then `model.json` carries its own `synthetic`/`warning` fields
whenever any input it trained on still does, and its in-sample R² is
expected to sit near zero -- the placeholder production and lake-level
series are generated independently of each other, so there's no real
relationship between them for a regression to find. That's a sign the
pipeline is honest, not a bug to fix.
