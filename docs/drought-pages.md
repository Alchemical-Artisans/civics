# The drought page

`/drought` (`src/routes/drought/+page.svelte`) gathers what the city's own
record says about the drought across the several places it is published. It is
being written by hand and is still taking shape -- the page currently carries
research notes in plain text alongside the finished parts, which is
deliberate while it is in progress.

This document covers the one finished piece: the rainfall chart.

## Rainfall, four years against a ten-year average

Five vertical bars on one zero-based axis: the current year and the three
before it, earliest on the left, then a gap and the ten-year average.
`src/lib/RainfallChart.svelte` draws it; `src/lib/server/precipitation.ts`
aggregates the years; `src/lib/precipitation.ts` holds the shapes, the date
arithmetic and `averageToDate`, outside both so they unit-test without
rendering -- the same arrangement `calendar.ts` has.

Today it reads 53.71 in for 2023, then 35.55, 31.96 and 30.52 -- three
declining years, each under the 37.49 in average of 2016-2025.

**Bars per year, because that is the question.** "How has the rainfall
changed year to year" is answered by one bar per year; a line per year across
the months answers "when in the year does it rain", which is a different
question and buries this one. The chart was that monthly line for a while --
two years overlaid, with a cumulative panel and a Kenoza Lake panel stacked
under them -- and the trend these five bars draw could not be read off it at
all.

**Every bar is read to the same day, and that is the whole integrity of it.**
The current year is ten months old. Drawn against four whole years and a
ten-whole-year average it would look like a catastrophe every time the page
was built, in June as much as in December. So each bar is `toDateInches` --
that year summed only through the current year's own last read day -- and the
average is the mean of ten such figures, never of ten whole years. The
`figcaption` prints the day, because a reader cannot infer it from bars.

This is the same trap the chart's legend fell into three times in its line-
chart form, and it is now pinned from both ends: `averageToDate` has a test
whose fixtures make a whole year exactly nine inches wetter than its to-date
figure, so averaging the wrong field is off by nine; and the component's own
tests assert every bar's accessible name carries the day.

**Eleven years in, five figures out, one call.** `+page.server.ts` asks
`precipitationByYear` for the eleven years at once rather than making two
calls. That function defines `toDateInches` against the newest year of the set
it is handed, so asking for the bars and the baseline separately would define
each against a different day and the average would stop being a figure the
bars could be compared with.

**The average is a bar and a rule.** A bar, set apart on the right by a gap
and a neutral slate rather than a colour off the year ramp, because it is a
fifth quantity on the same scale. A faint dashed rule at the same height
across the year bars, because which years fall under it is the point, and
tracking the eye from a bar at one end of a chart to a bar at the other is
exactly the comparison bars are worst at.

**Every bar prints its own figure**, so there is no tooltip and nothing is
visible only to a mouse. The bars are focusable for a keyboard reader, each
carrying its figure and how it stands against the average, and the `sr-only`
table under the chart repeats all five.

**Sized by its scale factor, not by its box.** The SVG is `w-full`, so the
browser scales the whole drawing -- text included -- by rendered width over
the `viewBox` width. A 700-wide box put 13.4px of label in the wide
two-column layout and 5.9px at the `sm` breakpoint, where the left column is
only 372px. The box is 460 wide instead and the figure is capped at
`max-w-xl`, which holds the effective label between about 9 and 14px from a
phone up; five bars never needed 850px of canvas.

**The section is a grid, not a float.** The chart has to sit beside the
supply map rather than below it, and a float cannot do that: it only shortens
the line boxes of following text, so a block-level element -- which the
chart's own `<figure>` is -- lays its box out at full width underneath and
the browser pushes the whole thing clear. Measured before the change, at
1440 the map ended at y=581 and the chart began at y=589 across the full
window. Two grid columns, `3fr 2fr`, place both at every size; below `md` it
is one column with the map above the text. `md` rather than `sm` because at a
640px window the two columns left the chart 372px and its labels at 8.9px.

**Four years, after two.** The chart drew four years against the 1991-2020
normal, then two years with the normal dropped, and is back to four now that
a year is one bar rather than twelve points -- four bars crowd nothing, where
four seasonal lines obscured each other. Nothing reads the normal curve:
`normalByMonth()` and `normalToDate()` were deleted rather than left as
unread exports, and `data/weather/haverhill-daily-normal.json` is still
scraped and documented if a reference line is ever wanted back. The ten-year
average here is computed from the station record itself, not from that file.

## The supply map

`/drought` opens with a map of Haverhill and the three bodies of water its
public system draws from, drawn by **`src/lib/PrecinctMap.svelte`** -- the
same component the election's precinct map uses. The water bodies are its
`areas`, the city boundary its one `outline`. It floats right at two fifths
of the column width beside the paragraph that explains it, inside a
`flow-root` wrapper so the next heading starts under it rather than wrapping
around it, and drops to full width above the text below `sm`.

**It is interactive, which is now what a map is unless told otherwise** --
pan, zoom, and finer tiles as a reader goes in. `PrecinctMap`'s own default
flipped to `true` for this: a reader who wants detail should be able to go and
get it, so the prop appears at a call site only where a map departs from that.
Exactly one does -- the landing page's `ElectionCard`, which is itself a
single link, where drag-to-pan would fight a link that wants to be clicked and
wheel-zoom would swallow the page's scroll. The float needs an explicit `h-80`
for interactivity: such a map fills the height its parent gives it and has a
20rem floor of its own, so without a height on the wrapper there is nothing to
fill.

**`hoverLabel` is new, and only this map passes it.** It names one area at a
time, on hover or focus, drawn on the map rather than left to the browser's
own `<title>` tooltip -- which every area has had all along and still has.
The reason is size: standing `label` text is sized as a fraction of the map's
width, so on a map a quarter the usual size it lands around six pixels, and
three names drawn at once on a map a few hundred pixels wide crowd each other
and the shapes they belong to. One name at a time, at a fixed readable size,
has neither problem. It is off by default, because a map with room for standing labels is
better off with them -- a reader should not have to hunt. It also puts a
plain area in the tab order, so the names are reachable by keyboard; an area
that is already a link or a button is focusable anyway.

`nameSize` follows `unit`'s own bargain: `live ? 15 / v.s : f.width / 22`, so
the name holds at fifteen screen pixels whatever the zoom rather than
swelling as a reader goes in. The paragraph beside the map still names all
three, largest first, for a reader who hovers nothing.

**The watersheds are a third layer and a different question.** Each source is
drawn twice: the shoreline solid, and around it the land that drains into it,
pale, in the same hue. MassDEP's `Surface_Water_Supply_Watersheds` service
supplies those, keyed on the same `SOURCE_ID` as the protection zones so the
join needs no guessing. A watershed is not a Zone A: the zone is the
regulated strip around a source, the watershed is where the water comes from,
and for Millvale they differ by a factor of three.

That layer settled two things besides. Its `TYPE` field separates an active
surface source (`SW`) from one held for emergencies (`ESW`), which is why the
city's seven registered sources have odd-numbered ids for the four it uses and
even for Johnsons Pond, Chadwick Pond and Hoveys Pond. And `MA_ACRES` against
`WSHEDACRES` gives the share of each watershed inside Massachusetts: 817 acres
of Millvale's and 362 of Crystal's are over the New Hampshire line, land
Haverhill drinks from and cannot zone.

**A hue per source, where the lakes alone took one fill.** With only the water
there was one question -- where is it -- and one colour answered it. With the
watersheds there is a second, which ground feeds which lake, and three shapes
in a single colour cannot answer it. Each source keeps its hue across both
shapes, the watershed at 0.34 opacity and the water at 0.85.

Both of those numbers were measured rather than chosen. At 0.18 the watersheds
washed out against the greyed street map entirely -- Crystal's was invisible.
And the map was `h-80`: the watersheds push the frame north until the bounds
are nearly square, and fitted into a box twice as wide as it is tall it zoomed
out to fit the height and spent about forty per cent of its width on Salem and
Methuen. `h-[26rem]` fixes that.

**Two sources, because neither answers the whole question.** MassDEP knows
which waters are a public supply and publishes nothing about their shape at
useful resolution; the USGS National Hydrography Dataset knows the shape of a
lake and nothing about who drinks it. `npm run water-bodies:update`
(`scripts/update-water-bodies.mjs`, pure parts in
`scripts/lib/water-bodies.mjs`) reads both and writes
`src/lib/data/water-bodies.json`. Not a step of `metadata:update`, for the
reason `precincts:update` is not: a reservoir does not move.

**Which waters count is the city's answer, and the state's list is longer.**
MassDEP's Surface Water Supply Protection Areas layer names four surface
sources against Haverhill Water Dept, PWSID 3128000: Kenoza Lake, Crystal
Lake, Millvale Reservoir and Round Pond. The Water Department's own Water
Supply page names the first three and nothing else -- the words "Round Pond",
"Pentucket" and "Winnekenni" are not on it -- so the map draws three.

Round Pond is not a judgement call made lightly, and it is reversible in one
line. The state registers it as `3128000-07S`, a numbered surface source, and
the city's Open Space & Recreation Plan listed it under "Round Pond (Active
Primary Source)" alongside the other three, noting that it "drains to Kenoza
Lake, via Winnekenni Basin, through a gravity pipe system". But that plan ran
July 2016 to July 2023 and has expired, and a map drawing a fourth source the
department does not currently name would be this site asserting something
about the water supply rather than republishing what the city says about it.
So `NOT_DRAWN` in `scripts/lib/water-bodies.mjs` holds the one exclusion,
keyed on `SOURCE_ID` because the name is the field the two agencies disagree
about; the generator skips it before spending an NHD query on it and records
it in the data file's `notDrawn`, so the omission is visible in the JSON and
not only in the script. **To put it back -- if the Water Department says the
pond is in the supply -- delete the entry.** Nothing else about it was ever
broken.

**The join is geometric, and it has to be.** A Zone A is a 400-foot buffer
around its source, so the body it protects lies inside it; the largest
intersecting body of NHD's reservoir type (`FTYPE` 436, as against 390 for a
lake or pond and 466 for a marsh) is the source. Matching on names would have
failed on exactly one of the four, and failed quietly: MassDEP's "ROUND POND"
sits over the body NHD calls **Lake Pentucket**, and the two ponds NHD does
call "Round Pond" are in other towns, twelve and twenty miles off. The data
file keeps both names and a `namesDiffer` flag. The page used to print a
caution naming the disagreement; with Round Pond off the map no remaining
source has one, so that paragraph could never render and is gone. The flag
and the geometric join stay, being what would catch the next one.

MassGIS's own `Hydro_Major` was the first choice for shapes and was dropped:
it is a major-waters subset carrying Crystal Lake and none of the other three,
and nothing finer is published on its REST server. The NHD's server will not
clip against Millvale's 1,541-acre Zone A unsimplified -- it answers 504 -- so
`coarsenZone` takes the buffer down to a fifty-metre tolerance before using it
as a spatial filter. That costs the answer nothing: the zone only ever decides
which bodies to consider, and the shapes drawn are always the NHD's own.

## Kenoza Lake's level

**The page shows the city's own chart, and does not redraw it.**
`static/excerpts/city-council-2026-09-15/drought-emergency-update/drought-chart.png`
is the Water Department's figure as published, committed beside the PDF of the
same chart that was already there, and rendered with `Router.excerptFile` --
`excerpt()` appends `.pdf`, so a non-PDF needed a door of its own.

**Floated left of the paragraph beside it**, which a float can do here where
it could not for the rainfall chart: a float shortens the _line boxes_ of the
text that follows it, and a paragraph is exactly that, where the chart's
block-level `<figure>` laid its box out underneath instead. Measured: every
line of the paragraph wraps to the right of it from `sm` up, and below `sm`
it is full width above the text.

**Both sit after the grid, not inside its left column.** That is where they
first went, and it left the paragraph with a floated figure on one side and
the map's column on the other, setting itself in about 400px of a 1440px
window. After the grid it has the page's width and the figure takes half of
that rather than half a column -- 320 to 672px against 224 to 426 -- and
nothing is squeezed between two figures. A `flow-root` wrapper contains the
float, the grid cell's own formatting context no longer being there to do it;
without one the float runs on into the heading below.

Even so the figure is well under its own 1650px and the fine axis labels
cannot be read at this size, which is why the image links to the full-size
copy, carries `cursor-zoom-in`, and says so in its caption.

**Committed rather than hotlinked**, for the reason everything else here is:
the build is offline and the reader's browser never talks to the city's
servers. The caption still links the original and names the date it was read,
so the citation is checkable; the page just does not depend on it resolving.

Redrawing it would have been the wrong call even setting that aside. The
level series exists only as this picture -- the city has never published it as
numbers -- so a chart of ours would be a reading of the image rather than the
measurement. The band shading is the Water Department's own definition of each
drought stage, which is not ours to restate. `width` and `height` carry the
file's own pixels so the box is reserved before it loads, and the image links
to the full-size copy because its axis labels stop being readable in a narrow
column.

**Transcribed in `src/lib/kenoza-levels.ts`, and drawn nowhere.** It was a
third panel stacked under the rainfall, on its own scale, sharing the x axis
-- rainfall is inches and belongs on an axis starting at zero, a reservoir
level is feet above a gauge datum and does not, so the two could not be
overlaid. The panel came off when the chart became bars per year, and the
module is now unread by anything. It is kept rather than deleted because the
reading itself was the expensive part and nothing about it has gone stale.

**There is also a reason not to put it back as it was.** Kenoza's level is
mostly a record of what the Water Department pumped, not of what fell:
Kenoza's own watershed is 697 acres against a 240-acre lake, Millvale's is
2,698, and the city's Open Space & Recreation Plan states that Millvale and
Crystal are pumped _into_ Kenoza while Round Pond drains into it. Monthly
rainfall against monthly level change over 2025-26 comes out at r = 0.53, and
every month the lake rose it rose by more than all the rain falling on its own
watershed could supply. A rainfall panel stacked above a lake panel invites a
causal reading the figures do not support.

**These figures are read off a picture, and are the weakest thing on the
site.** The city has never published this series as numbers; the only version
of it anywhere is a chart image, so each figure is where a line sat on that
image rather than a reading the Water Department wrote down. They are drawn
dotted for exactly that reason while they were drawn, and
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

## Water the city uses

`src/lib/WaterUsageChart.svelte` draws three summers of daily production --
2022, 2023 and 2026 -- from `src/lib/water-usage.ts`. Dotted, because like the
Kenoza levels these are read off pictures rather than published as numbers.

**Two slides, from Robert Ward's drought update to the Council of September
15, 2026**: "Have the outdoor water use restrictions helped?" (2022 against
2026, May 15th to September 13th) and "Wet Summer vs. Dry Summer" (2022
against 2023, April 15th to October 15th). The deck was presented rather than
filed, so it is on none of the city's document pages; the Kenoza chart already
committed under that meeting is a third slide from the same presentation.

**Three checks validate the reading, and the third measures its precision.**
Each slide states a total the calibration was not fitted to -- 150 million
gallons and 204 million gallons -- and summing the days reproduces them to
0.2% and 2%. Better still, **2022 is drawn on both slides**, so it was read
twice from different images at different scales: the two readings differ by a
median of 0.047 MGD, 0.25 at the 90th percentile. That is the honest error bar
on a day in this file, measured rather than asserted. `water-usage.spec.ts`
pins the first two checks, so a future re-reading that stops matching the
department's own totals fails rather than quietly replacing them.

**One source per year, to avoid a seam.** 2022 appears on both slides and the
first is sharper (3.85 px a day against 2.60), but splicing the sharper
reading into the middle of the coarser one would have put a step of up to 0.48
MGD at the join. The whole of 2022 comes from the second slide; the first is
used only to check it.

**The slide's own "(10%)" is not a share of the window it draws.** Over April
15th to October 15th the gap between 2022 and 2023 is about 21.8% of 2023, not
10%. A 10% share implies an annual total near 2,040 million gallons, so the
parenthetical is a fraction of the year. The page quotes the 204 against the
summer and says the percentage is annual; a test records it so nobody quotes
the two against the same period.

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
