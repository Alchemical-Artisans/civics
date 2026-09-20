# Haverhill weather data

Committed, and kept current by `npm run weather:update`
(`scripts/update-weather.mjs`, `scripts/lib/weather.mjs`), a step of
`npm run metadata:update`. Research data toward a water-balance model for
`/water` -- one of four pillars (rainfall, snowfall, temperature,
consumption) toward a "gallons/day the city would need to stay at or under to
start regaining Kenoza Lake level" figure, discussed but not yet built.
**Nothing here is cited on the site yet** -- see `docs/water-pages.md` and
`src/lib/rainfall.ts` for the committed, cited half of the water section,
which this does not feed.

## Source

[RCC-ACIS](https://www.rcc-acis.org/) (Applied Climate Information System),
run by NOAA's Regional Climate Centers -- a station-level aggregator over NWS
Cooperative Observer Program, ASOS/AWOS, CoCoRaHS and other networks. Chosen
over NOAA's Climate at a Glance API (already used in `src/lib/rainfall.ts`)
because that one only gives a Massachusetts-wide monthly average, not
anything specific to Haverhill.

Station: **HAVERHILL** (COOP id `USC00193505`, WBAN `HAVM3`), 42.7594°N
71.0602°W, elevation 20 ft -- inside the city, not the regional airport
(Lawrence Municipal, five miles off). Currently active; period of record
starts 1899-11-01. Found via ACIS's `StnMeta` search, which also turned up a
station literally named "Kenoza Lake" -- discontinued in 1945, so no help.

## Files

Both are whole-file replaces on every run, the same choice `budget.json`
makes and for the same reason: cheap enough to refetch complete (one POST
each) that there is no reason to diff against the source, only to log what
changed against the previous commit.

- **`haverhill-daily-observed.json`** -- every daily reading the station has
  on record for seven elements, one request: max/min/average/observation-time
  temperature (`maxt`/`mint`/`avgt`/`obst`, °F), total precipitation
  (`pcpn`, liquid-water-equivalent inches -- melted snow counted as water,
  not as snow depth), snowfall (`snow`, inches) and snow depth on the ground
  (`snwd`, inches). Around 9% of `pcpn` days are flagged `M` (missing) or
  `S`/`A` (read as an accumulated total over more than one day) -- ordinary
  gaps for a human-read gauge, not a data error; other elements have their
  own, unchecked missing rates.

  Two elements this same station could plausibly report were checked and
  left out: water-equivalent-of-snow-depth and pan evaporation both came back
  "no data available" for the whole of 2025, so the station appears not to
  measure either (evaporation pans especially are uncommon at an ordinary
  COOP station) -- see the comment on `ELEMENTS` in `scripts/lib/weather.mjs`.

- **`haverhill-daily-normal.json`** -- NCEI's official 1991-2020 30-year
  climate normal for this station's own location, one value per calendar day,
  for the five elements ACIS will actually normal here (`maxt`, `mint`,
  `avgt`, `pcpn`, `snow` -- it refuses the request outright, "bad args", for
  `snwd` and `obst`). Confirmed against ACIS's own web-services docs
  (`normal: "1"` or `"91"` = "the 1991-2020 normal"; `"81"` would be the
  older 1981-2010 period). The date in each row is arbitrary -- only the
  month and day matter -- and a leap year is used as the reference so Feb 29
  gets its own value; the file's own `annual` field reduces each element's
  curve to one figure (summed for `pcpn`/`snow`, averaged for the
  temperatures). The implied annual precipitation normal, **49.58 in**, is
  noticeably wetter than the statewide Jan-Aug figure `rainfall.ts`
  currently charts, which is a different period and a statewide blend, not a
  discrepancy to reconcile.

## Not yet a pillar this covers

Consumption (the city's own production/billing figures) is not weather data
and won't come from this station or ACIS at all.
