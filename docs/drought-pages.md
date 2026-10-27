# The drought page

`/drought` (`src/routes/drought/+page.svelte`) gathers what the city's own
record says about the drought across the several places it is published. It is
being written by hand and is still taking shape -- the page currently carries
research notes in plain text alongside the finished parts, which is
deliberate while it is in progress.

This document covers the one finished piece: the rainfall chart.

## Rainfall, this year against the last three

Three panels stacked on one calendar-year x axis, a line per year in each:
monthly rainfall, the same rainfall accumulating since January 1st, and
Kenoza Lake's own level, for the current year and the one before it. `src/lib/RainfallYearsChart.svelte`
draws it; `src/lib/server/precipitation.ts` aggregates the months;
`src/lib/precipitation.ts` holds the shapes and the date arithmetic, outside
both so they unit-test without rendering -- the same arrangement `calendar.ts`
has.

**Two rainfall panels, because they answer different questions.** A month's
own inches says when it rained: a month at 8.90 in and one at 1.25 are visible
there and vanish into a running total. The accumulation says how far behind a
year is by now, which is the question the lake is answering to -- which is why
it sits directly above the lake panel rather than beside its own monthly
chart. A cumulative line can only rise, so it says nothing about any single
month; the two together say both things without either compromising. The
accumulation was the chart's first and only shape, replaced by monthly amounts,
and is now drawn alongside them rather than instead of them.

`cumulativeInches` has been on every `PrecipitationMonth` since the first
version, so the panel needed no change to the module -- only the component,
which was restructured to be panel-driven rather than drawing each panel's
lines, grid and axis by hand. A panel declares its range, step, unit and how
to get a year's points; everything else is shared.

**Two years, and no reference curve.** It drew four years against the
1991-2020 normal first, and both the fourth year and the normal came off as
distractions. Five lines is more than a reader compares at once; 2023 was wet
enough -- 11.23 in in one August -- to set a vertical scale the other three
then sat low against, so dropping it let them use most of the height; and a
dashed thirty-year mean invited a second comparison beside the one being
asked for, and the lake panel added beneath has only 2025 and 2026 to draw
anyway. The route asks `precipitationByYear` for two years and the
component takes no normal at all. Nothing on the site reads the normal curve
now, so `normalByMonth()` and `normalToDate()` were deleted rather than left
as unread exports -- `data/weather/haverhill-daily-normal.json` is still
scraped and still documented, and bucketing it the same way is a short
function away if a reference line is ever wanted back.

**Months, after two other shapes.** This drew cumulative weeks first, then
weekly amounts. A week here swings between 0.00 and 4.37 in, and four such
lines over one axis obscure each other rather than comparing; twelve points a
line is legible. Months also dispose of two calendar problems weeks had:
seven-day runs counted from January 1st drift against the calendar, so
February 29th had to be folded into a neighbouring bucket to keep four years
aligned on one axis, and an ISO week starts on a Monday and so covers
different dates each year. A month is the same month in every year, leap or
not.

**An incomplete month is drawn dashed, with a hollow point, and the readout
says what it stands on.** The current year's last month is almost always
short -- October read to the 25th is six days fewer than the Octobers beside
it -- and an unmarked point there would show the current month as unusually
dry on every build. `partial` on a `PrecipitationMonth` is set by comparing
the days a gauge read against the month's own length, so it catches a month
with unread days in the middle as well as one that has not finished. It is the
only dashed thing on the chart now that the normal is gone, which is what the
component's own test asserts.

**Every total quoted anywhere is read to the same day.** This is the one
comparison the chart must not get wrong, and it got it wrong twice while being
built. `toDateInches` sums each year only to the month and day the current
year reaches; the legend and the prose both use it, and the legend says so
above itself. Drawn with each year's own final total instead, the legend read
`2026 30.48"` beside `2025 37.72"` and said the current year was seven inches
drier when at the same point it was level. Summing whole months is not good
enough either -- 2025's October is 31 days against 2026's 25.

**The current year's colour is picked by name, not by position.** It is
`COLOURS[1]`, the orange `drought-colours.ts` builds its stage ramp on -- the
drought year drawn in the drought hue -- and the years behind it take the rest
of the palette in order. Indexing one palette by position worked only while
exactly four years were drawn, and silently handed 2026 a violet the moment
the span became three.

## The supply map

`/drought` opens with a map of Haverhill and the four bodies of water its
public system draws from, drawn by **`src/lib/PrecinctMap.svelte`** -- the
same component the election's precinct map uses, which already took shapes,
outlines, names, fills and labels as props and needed no change at all. The
water bodies are its `areas`, the city boundary its one `outline`.

**Two sources, because neither answers the whole question.** MassDEP knows
which waters are a public supply and publishes nothing about their shape at
useful resolution; the USGS National Hydrography Dataset knows the shape of a
lake and nothing about who drinks it. `npm run water-bodies:update`
(`scripts/update-water-bodies.mjs`, pure parts in
`scripts/lib/water-bodies.mjs`) reads both and writes
`src/lib/data/water-bodies.json`. Not a step of `metadata:update`, for the
reason `precincts:update` is not: a reservoir does not move.

**Which waters count is MassDEP's answer, not ours.** Its Surface Water Supply
Protection Areas layer names four surface sources against Haverhill Water
Dept, PWSID 3128000: Kenoza Lake, Crystal Lake, Millvale Reservoir and Round
Pond. The city's own drought page names three of them -- Round Pond is the one
it leaves out.

**The join is geometric, and it has to be.** A Zone A is a 400-foot buffer
around its source, so the body it protects lies inside it; the largest
intersecting body of NHD's reservoir type (`FTYPE` 436, as against 390 for a
lake or pond and 466 for a marsh) is the source. Matching on names would have
failed on exactly one of the four, and failed quietly: MassDEP's "ROUND POND"
sits over the body NHD calls **Lake Pentucket**, and the two ponds NHD does
call "Round Pond" are in other towns, twelve and twenty miles off. The data
file keeps both names and a `namesDiffer` flag, and the page prints a caution
naming the disagreement -- a reader asking the city about that pond needs to
name the location, not just the pond.

MassGIS's own `Hydro_Major` was the first choice for shapes and was dropped:
it is a major-waters subset carrying Crystal Lake and none of the other three,
and nothing finer is published on its REST server. The NHD's server will not
clip against Millvale's 1,541-acre Zone A unsimplified -- it answers 504 -- so
`coarsenZone` takes the buffer down to a fifty-metre tolerance before using it
as a spatial filter. That costs the answer nothing: the zone only ever decides
which bodies to consider, and the shapes drawn are always the NHD's own.

## Kenoza Lake's level

The lower panel, from `src/lib/kenoza-levels.ts`. **Stacked rather than drawn
over the rainfall, because the two do not share a scale**: rainfall is inches
falling in a month and belongs on an axis starting at zero, a reservoir level
is feet above a gauge datum and does not. Together they would need two y axes
and a reader would be left working out which line answered to which. Stacked,
each panel keeps its own scale and the shared x axis does the comparing — a
dry month above sits directly over what the lake did next. The months are
drawn once, under the lower panel, and one hover guide runs through both,
since the point of stacking is reading down a column.

**These figures are read off a picture, and are the weakest thing on the
site.** The city has never published this series as numbers; the only version
of it anywhere is a chart image, so each figure is where a line sat on that
image rather than a reading the Water Department wrote down. They are drawn
dotted for exactly that reason, the page says so in its own prose, and
`kenoza-levels.ts` carries the full provenance. Treat one as good to about a
fifth of a foot and never quote it as the city's stated level.

**Read by pixel, not by eye**, so it is reproducible and its error is
bounded. The three curves separate by colour against warm-toned zone bands
that share no hue with any of them; each figure is the median row of that
colour in the five pixel columns centred on the month's date. Both axes were
calibrated from the chart's own furniture — vertically from the gridlines
standing above the bands, at exactly 45.5 px per 2 ft, horizontally by
fitting pixel column against day of year across eleven month labels, at
1.664 px/day. Two facts the calibration was not fitted to then confirm it:
the 2026 curve bottoms out at 99.80 ft, which is the one figure the chart
prints as a label, and its last pixel lands on day 258 — September 15th, the
date in the chart's own filename.

2026's line stops in September for that reason, and the 36-year average line
on the city's chart was read but deliberately not kept: the rainfall panel
dropped its own thirty-year normal as a distraction, and a long-run average
here would be the same distraction twice.

This reverses a rule [water-pages.md](water-pages.md) used to state, and that
document now records the reversal and the reasoning rather than contradicting
this one.

## Where the figures come from

**Every day is the average of each rain gauge in Haverhill that read it**,
all three counting equally: the National Weather Service Cooperative Observer
station inside the city (HAVERHILL, `USC00193505`) and the two CoCoRaHS
gauges beside it. Which two, and why those rather than the five other
candidates within nine miles -- the nearest gauge of all being among the
worst-agreeing -- is in
[`data/weather/README.md`](../data/weather/README.md) and in the comment on
`NEIGHBOUR_STATIONS` in `scripts/lib/weather.mjs`.

So these figures are a city-wide average and not any one station's record.
That is a deliberate change from how this started, and it moves the numbers:
for 2026 the average reads 30.52 inches through October 26 where the
Cooperative Observer station alone reads 26.58, and for 2025 31.96 against
30.64. Both are kept -- `cityInches` on a day and `cityOnlyToDateInches` on a
year -- because the two differ on every day more than one gauge reported, not
only on the days the city gauge missed, and the page says as much in its own
prose.

**The city station is read by hand, and has gaps.** 36 of 2026's 299 days
carry no reading from it, 30 of them in January through March, where a missed
reading is usually a multi-day stretch of winter precipitation rather than a
dry day. Those days stand on the volunteer gauges alone. Before the series
was averaged this mattered much more: the city gauge's own total was the
series, and unfilled those gaps made 2026 read as the driest of the four
years drawn when it was in fact level with 2025.

The span is the city station's own, reaching back to 1899 where the volunteer
gauges begin in 2015 and 2022 -- so for most of the record the "average" is
of one reading and equals that station's figure exactly.

**Nothing is estimated, interpolated or modelled.** Every figure is some
gauge's own reading of that day. A day no gauge read contributes nothing and
is counted as unread rather than filled from the normal curve, which would be
this site inventing rainfall. Each day carries the number of gauges behind it
and whether the city's own was among them; each month and year carry
`cityDays`, `filledDays` and `unreadDays`, which is what lets the page state
the composition in its own prose rather than leaving a reader to trust the
line.

## Why a server load

`src/routes/drought/+page.server.ts`, not `+page.ts`. A universal load ships to
the browser, so the several megabytes of daily station readings behind four
lines of twelve points would be bundled into the page just to be aggregated
again on arrival. A server load runs at build time only and the page carries
the weeks it returns -- the same reason the calendar's own route and `/water`'s
load this way. `src/lib/server/precipitation.ts` lives under `$lib/server` so
importing it from anything the client bundles is a build error rather than a
quiet multi-megabyte page. Verified on a build: no client chunk carries the
station id.

The three years are worked out from the last date the station record covers
rather than from the build clock: the scrape and the build are separate acts,
and a build run in January against a December scrape would otherwise ask for a
year with no days in it.

## Refreshing it

`node scripts/update-weather.mjs`, a step of `npm run metadata:update`. One
POST per file: the station's whole record, the normal curve, and one per
neighbour gauge. Every file is a whole-file replace, so a corrected or reissued
reading is picked up without a rebuild flag. See
[`data/weather/README.md`](../data/weather/README.md).
