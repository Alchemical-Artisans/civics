# The drought page

`/drought` (`src/routes/drought/+page.svelte`) gathers what the city's own
record says about the drought across the several places it is published. It is
being written by hand and is still taking shape -- the page currently carries
research notes in plain text alongside the finished parts, which is
deliberate while it is in progress.

This document covers the one finished piece: the rainfall chart.

## Rainfall, this year against the last three

Two panels stacked on one calendar-year x axis, a line per year in each:
monthly rainfall above, Kenoza Lake's own level below, for the current year
and the one before it. `src/lib/RainfallYearsChart.svelte`
draws it; `src/lib/server/precipitation.ts` aggregates the months;
`src/lib/precipitation.ts` holds the shapes and the date arithmetic, outside
both so they unit-test without rendering -- the same arrangement `calendar.ts`
has.

**Each month's own inches, not a running total.** The question is when it
rained, not how far behind the year is by now: March 2024 at 8.90 in and August
2026 at 1.25 are the thing being looked at, and accumulating them hides both
inside a curve that can only rise. The year's total is still reported, in the
legend and in the page's own prose, so the magnitude comparison a monthly line
cannot make is not lost -- it is just not what the lines are for.

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
