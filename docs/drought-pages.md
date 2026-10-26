# The drought page

`/drought` (`src/routes/drought/+page.svelte`) gathers what the city's own
record says about the drought across the several places it is published. It is
being written by hand and is still taking shape -- the page currently carries
research notes in plain text alongside the finished parts, which is
deliberate while it is in progress.

This document covers the one finished piece: the rainfall chart.

## Rainfall, this year against the last three

A line per year of monthly precipitation across one calendar-year x axis, for
the current year and the two before it. `src/lib/RainfallYearsChart.svelte`
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

**Three years, and no reference curve.** It drew four years against the
1991-2020 normal first, and both the fourth year and the normal came off as
distractions. Five lines is more than a reader compares at once; 2023 was wet
enough -- 11.23 in in one August -- to set a vertical scale the other three
then sat low against, so dropping it let them use most of the height; and a
dashed thirty-year mean invited a second comparison beside the one being
asked for. The route asks `precipitationByYear` for three years and the
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

## Where the figures come from, and the gaps in them

Readings are the National Weather Service Cooperative Observer station inside
the city -- HAVERHILL, `USC00193505`, the same station `data/weather/` already
held for the water-balance research. It is read by hand, so its record has
gaps, and those gaps are not evenly spread: 36 of 2026's days carry no reading,
and 30 of them fall in January through March, where a missed reading is usually
a multi-day stretch of winter precipitation rather than a dry day.

That matters to what the chart says. Summed as they stand, 2026 reaches 26.58
inches by late October against 2025's 30.64 -- four inches drier, and the
driest of the four years drawn. Filled, 2026 reaches 30.48 against 2025's
30.81, level with it, and the finding becomes two consecutive dry years around
ten inches below the 1991-2020 normal for the same span, rather than one
collapsing year.

So a day the city gauge did not read is filled from the two CoCoRaHS gauges also
inside Haverhill, averaged where both read it. Which two, and why those rather
than the five other candidates within nine miles -- the nearest gauge of all
being among the worst-agreeing -- is in
[`data/weather/README.md`](../data/weather/README.md) and in the comment on
`NEIGHBOUR_STATIONS` in `scripts/lib/weather.mjs`.

**Nothing is estimated, interpolated or modelled.** Every figure on the chart is
some gauge's own reading of that day. A day no gauge read contributes nothing
and is counted as unread rather than filled from the normal curve, which would
be this site inventing rainfall. `dailyPrecipitation()` labels every day `city`,
`neighbour` or `unread`, and both a month and a year carry their own
`filledDays` and `unreadDays` -- which is what lets the page state the gap
count in its own prose rather than leaving a reader to trust the line.

The page says all of this in two sentences under the chart, with the station ids
and the gauge distances, because a figure read off a live gauge rather than a
committed document has to name where it came from. That is the same rule
`src/lib/water.ts` follows -- see [water-pages.md](water-pages.md).

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
