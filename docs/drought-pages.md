# The drought page

`/drought` (`src/routes/drought/+page.svelte`) gathers what the city's own
record says about the drought across the several places it is published. It is
being written by hand and is still taking shape -- the page currently carries
research notes in plain text alongside the finished parts, which is
deliberate while it is in progress.

This document covers the one finished piece: the rainfall chart.

## Rainfall, this year against the last three

A line per year of precipitation **accumulating** since January 1st, across one
calendar-year x axis, against NCEI's 1991-2020 normal as a dashed reference.
`src/lib/RainfallYearsChart.svelte` draws it; `src/lib/server/precipitation.ts`
aggregates the weeks; `src/lib/precipitation.ts` holds the shapes and the date
arithmetic, outside both so they unit-test without rendering -- the same
arrangement `calendar.ts` has.

**Cumulative rather than each week's own amount.** Four jagged weekly-total
lines laid over one axis read as noise; four accumulating curves show the one
thing the page is asking, which is where in the year a dry year falls behind
and by how much. A week's own inches are still on the hover readout, so
nothing the aggregation did is hidden.

**Weeks are seven-day runs counted from January 1st, not ISO weeks.** An ISO
week starts on a Monday and so covers different dates each year, which is
exactly what a chart laying four years over one axis cannot have. February 29th
falls into week 9 with the 23rd to the 28th, making that bucket eight days long
in a leap year -- a day's misalignment out of 365, taken in preference to
discarding a day of real rain to keep the buckets even.

**The current year's line simply stops at the last day a gauge read it**, and
needs no caveat for it: the x axis is the date, so a line ending in October
reads as a year not finished rather than a year that stopped raining.

**Every figure lifted out of a line carries the week it was lifted at.** This
is the one comparison the chart must not invite. The legend and each line's
accessible name report what that year had accumulated by the week the current
year has reached -- not each year's own final total. Drawn the other way, in
late October 2026 the legend read `2026 30.49"` beside `2025 37.72"` and said
the current year was seven inches drier when at the same week it was level with
it. The lines themselves still run to each year's own end.

## Where the figures come from, and the gaps in them

Readings are the National Weather Service Cooperative Observer station inside
the city -- HAVERHILL, `USC00193505`, the same station `data/weather/` already
held for the water-balance research. It is read by hand, so its record has
gaps, and those gaps are not evenly spread: 35 of 2026's first 298 days carry
no reading, and 30 of them fall in January through March, where a missed
reading is usually a multi-day stretch of winter precipitation rather than a dry
day.

That matters to what the chart says. Summed as they stand, 2026 reaches 26.58
inches by October 25th against 2025's 30.64 -- four inches drier, and the driest
of the four years drawn. Filled, 2026 reaches 30.49 against 2025's 30.81, level
with it, and the finding becomes two consecutive dry years around ten inches
below normal rather than one collapsing year.

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
`neighbour` or `unread`, and a year carries its own `filledDays` and
`unreadDays` -- which is what lets the page state the gap count in its own prose
rather than leaving a reader to trust the line.

The page says all of this in two sentences under the chart, with the station ids
and the gauge distances, because a figure read off a live gauge rather than a
committed document has to name where it came from. That is the same rule
`src/lib/water.ts` follows -- see [water-pages.md](water-pages.md).

## Why a server load

`src/routes/drought/+page.server.ts`, not `+page.ts`. A universal load ships to
the browser, so the several megabytes of daily station readings behind four
lines of fifty-odd points would be bundled into the page just to be aggregated
again on arrival. A server load runs at build time only and the page carries
the weeks it returns -- the same reason the calendar's own route and `/water`'s
load this way. `src/lib/server/precipitation.ts` lives under `$lib/server` so
importing it from anything the client bundles is a build error rather than a
quiet multi-megabyte page.

The four years are worked out from the last date the station record covers
rather than from the build clock: the scrape and the build are separate acts,
and a build run in January against a December scrape would otherwise ask for a
year with no days in it.

## Refreshing it

`node scripts/update-weather.mjs`, a step of `npm run metadata:update`. One
POST per file: the station's whole record, the normal curve, and one per
neighbour gauge. Every file is a whole-file replace, so a corrected or reissued
reading is picked up without a rebuild flag. See
[`data/weather/README.md`](../data/weather/README.md).
