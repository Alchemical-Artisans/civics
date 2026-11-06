# Haverhill consumption data -- PLACEHOLDER, not real

**Nothing under `placeholder/` is real.** It's fabricated by
`scripts/generate-placeholder-consumption.mjs`, a synthetic seasonal curve
anchored only to `AVERAGE_PRODUCTION_MGD` in `src/lib/water.ts` (the one real,
cited figure), so the /water water-balance model's chart and calculator can be
built and reviewed against a plausible shape before real consumption data
exists anywhere in this repository. It is the one deliberate exception to
this codebase's rule that nothing is invented -- see `CLAUDE.md` and
`docs/water-pages.md` -- and every file it writes says so in the payload
itself (`synthetic: true`, a `warning` field), not only here.

**Never cite this. Never run it as part of `npm run metadata:update`.** It
has no entry in `scripts/update-metadata.mjs` on purpose.

Consumption is the fourth pillar toward a "gallons/day the city would need to
stay at or under to start regaining Kenoza Lake level" figure, alongside
rainfall and temperature (both real, `data/weather/`) and snowfall (the same
weather station, not yet pulled). Unlike those, it isn't weather -- it has to
come from the city or the state, and no public, granular source has been
found yet. The most likely candidate is the Water Management Act Annual
Statistical Report every permitted withdrawer files with MassDEP; not yet
requested or located.

## Replacing the placeholder

A real source should write `data/consumption/haverhill-daily-production.json`
directly -- same shape as the placeholder file below, minus the
`synthetic`/`warning` fields -- at whatever granularity it actually comes in
(daily, if the city's billing system tracks that; more likely monthly, which
still drops into the same `[date, value]` row shape one row per month
instead of one per day). Once that file exists, delete
`scripts/generate-placeholder-consumption.mjs` and the whole `placeholder/`
directory rather than leaving fabricated data sitting next to the real thing.

## Placeholder file shape

`placeholder/haverhill-daily-production.json`: one row per day,
`[date, productionMgd]`, 1986-01-01 through today -- forty years, matching
the lake-level placeholder. A cosine seasonal curve
(summer peak, winter trough, ±22% of the 6.0 MGD average) plus ±5% day-to-day
noise from a seeded PRNG, so regenerating it is reproducible rather than a
fresh set of random numbers every run. No drought response, no trend, no
event of any kind is encoded -- deliberately generic, since a shape that
_looked_ like it captured something real about this drought would be worse
than one that obviously doesn't.

Regenerate (e.g., to extend the range to a later "today"):

```sh
node scripts/generate-placeholder-consumption.mjs
```
