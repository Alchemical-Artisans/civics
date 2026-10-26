# Haverhill weather data

Committed, and kept current by `node scripts/update-weather.mjs`
(`scripts/lib/weather.mjs`), a step of `npm run metadata:update`. There is no
`npm run weather:update` shortcut at the moment: that `package.json` entry was
lost when this work was rebased onto main, and nothing has needed it since the
`metadata:update` step calls the script by filename.

**The precipitation column is cited on the site**, by `/drought`'s
year-against-year rainfall chart -- see `docs/drought-pages.md` and
`src/lib/server/precipitation.ts`, which reads all three files below. The rest
of what is here is still research data toward a water-balance model for
`/water`: one of four pillars (rainfall, snowfall, temperature, consumption)
toward a "gallons/day the city would need to stay at or under to start
regaining Kenoza Lake level" figure, discussed but not yet built.

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

- **`haverhill-neighbours-daily-precip.json`** -- daily precipitation, and
  nothing else, from the two CoCoRaHS gauges inside Haverhill that fill the
  COOP station's unread days: **HAVERHILL 0.7 N** (`US1MAES0020`, 2.8 miles,
  record from October 2015) and **HAVERHILL 0.8 SW** (`US1MAES0090`, 2.2
  miles, from April 2022). Keyed by station id under `data`, each value the
  same `[date, value]` rows ACIS returns, flags and all.

  **The gaps are why this file exists.** The COOP observer reads the gauge by
  hand, so the record misses days -- 35 of 2026's first 298, and 30 of those
  fall in January, February and March, where a missed reading is usually a
  multi-day stretch of winter precipitation rather than a dry day. Summed as
  they stand, 2026 comes to 26.58 inches by October 25th against 2025's
  30.64: four inches drier, and the driest of the last four years. Filled,
  it comes to 30.49 against 2025's 30.81 -- level with it, and the finding
  becomes two consecutive dry years about ten inches below normal rather
  than one collapsing year. That is a large enough difference to the story
  that leaving the gaps unfilled would have been the misleading choice.

  **Chosen on agreement, not distance.** Seven candidates within nine miles
  were measured against the city gauge on the days both read, 2023 through 2026. These two correlate at r=0.96 with a mean absolute difference around
  0.03 in. The nearest gauge of all, GROVELAND 0.5 WSW at 1.2 miles,
  manages only r=0.38 -- and GROVELAND (COOP, `USC00193276`) returns
  identical figures, so the two look like one physical gauge filed under two
  network ids. Lawrence Municipal Airport (`USW00094723`) never gaps, being
  automated, but correlates at r=0.16 and adds the least of any candidate
  over the gap days, which is what an ASOS gauge under-catching snow looks
  like -- and snow is precisely what these winter gaps are. LAWRENCE
  (`USC00194105`) covers only 25 of the 35 days and has 71 gaps of its own.

  Two gauges rather than one because neither is complete on its own: 0.8 SW
  has 11 unread days of its own in 2026. Where both read a day their mean is
  used, where one does its own figure is, and a day neither read is left
  unread and counted -- never filled from the long-term normal, which would
  be inventing rainfall. `src/lib/server/precipitation.ts` carries the merge
  and labels every day `city`, `neighbour` or `unread`.

## Not yet a pillar this covers

Consumption (the city's own production/billing figures) is not weather data
and won't come from this station or ACIS at all.
