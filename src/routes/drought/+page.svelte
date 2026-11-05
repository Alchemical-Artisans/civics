<script lang="ts">
  // The rainfall chart's months are aggregated in `+page.server.ts`: the
  // three station files behind them run to megabytes, and a server load is
  // what keeps them out of this page's own bundle.
  import PopulationChart from "$lib/PopulationChart.svelte"
  import RainfallChart from "$lib/RainfallChart.svelte"
  import WaterUsageChart from "$lib/WaterUsageChart.svelte"
  import { CENSUS_COUNTS, POPULATION, POPULATION_SOURCE } from "$lib/population"
  import { WATER_USAGE } from "$lib/water-usage"
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import { Router } from "$lib/router"
  import { KENOZA_SOURCE } from "$lib/kenoza-levels"
  import { COLOURS } from "$lib/chart-colours"
  import waterBodies from "$lib/data/water-bodies.json"

  // The city's own Kenoza chart, committed rather than hotlinked -- see
  // `Router.excerptFile`. It is shown as the city drew it rather than redrawn
  // here: the level series exists only as this picture, so a chart of ours
  // would be a reading of it rather than the measurement, and the band
  // shading is the Water Department's own definition of each drought stage.
  const KENOZA_MEETING = "city-council-2026-09-15"
  const KENOZA_CHART = "drought-emergency-update/drought-chart.png"

  let { data } = $props()

  const current = $derived(data.rainfallYears.at(-1)!)
  const previous = $derived(data.rainfallYears.at(-2)!)
  const city = $derived(data.rainfallSource.cityStation)
  const gauges = $derived(data.rainfallSource.neighbourStations)

  // `toDateInches` is each year summed only to the same month and day the
  // current year reaches, which is the one figure of these comparable across
  // both -- see $lib/precipitation.ts. The sentence below must not put a
  // part-year beside a whole one.

  // The waters Haverhill's public system draws from, and the land that drains
  // to each. See scripts/lib/water-bodies.mjs for where the supply list, the
  // shorelines and the watersheds each come from, and for why the list is the
  // Water Department's own three rather than MassDEP's four.
  //
  // A hue per source rather than one fill for the whole system, which is what
  // this drew before the watersheds were on it. With only the lakes there was
  // one question -- where is the water -- and one colour answered it. With
  // the watersheds there is a second: which ground feeds which lake. That
  // cannot be read off three shapes in a single colour, so each source keeps a
  // hue across both of its shapes, the watershed pale and the water itself
  // solid.
  const SOURCE_HUES = [COLOURS[0], COLOURS[2], COLOURS[3], COLOURS[4]]
  const hueFor = (i: number) => SOURCE_HUES[i % SOURCE_HUES.length]

  // Spelled rather than numeric: "names 3 surface sources" reads as a count in
  // a table and this is a sentence. Derived rather than written into the prose
  // because the written version went stale the moment a source came off the
  // map -- the paragraph below said "four" while the map drew three.
  const COUNT_WORD = ["no", "one", "two", "three", "four", "five", "six"]

  // A protection area runs to four figures, and "1541 acres" reads as a year
  // rather than a quantity.
  const acres = (value: number | undefined) => value?.toLocaleString("en-US") ?? ""
  // Watersheds first so the water sits on top of the ground that feeds it;
  // `areas` draws in order.
  const supplyAreas = [
    ...waterBodies.bodies
      .filter((body) => body.watershed)
      .map((body, i) => ({
        id: `${body.sourceId}-watershed`,
        shape: body.watershed!.shape,
        name: `${titleCase(body.name)} watershed — ${body.watershed!.acres.toLocaleString("en-US")} acres`,
        fill: hueFor(i),
        // Against the greyed street map 0.18 washed out entirely -- Crystal's
        // watershed was invisible at the size this draws. The water itself
        // stays darker, so the pairing still reads as ground and the lake it
        // feeds.
        opacity: 0.34,
      })),
    ...waterBodies.bodies.map((body, i) => ({
      id: body.sourceId,
      shape: body.shape,
      name: `${titleCase(body.name)} — ${body.areaSqKm} square kilometres`,
      fill: hueFor(i),
      opacity: 0.85,
      // No standing label: this map is a two-fifths float a few hundred pixels
      // wide, and three names drawn on it at once crowd each other and the
      // shapes they belong to. `hoverLabel` names one at a time instead, on
      // hover or focus, which is legible at any size and cannot collide. The
      // paragraph beside the map also names all three, largest first, for a
      // reader who hovers nothing.
    })),
  ]

  /**
   * MassDEP writes a source's name in capitals and abbreviates one of them; a
   * map label should do neither. No `\b` after the full stop in `res\.` -- a
   * word boundary needs a word character on the far side, and that
   * abbreviation ends the string, so the anchored version silently never
   * matched and the map read "Millvale Res."
   */
  function titleCase(name: string): string {
    return name
      .toLowerCase()
      .replace(/\bres\./, "reservoir")
      .replace(/\b[a-z]/g, (c) => c.toUpperCase())
  }

  const bodyNamed = (prefix: string) => waterBodies.bodies.find((b) => b.name.startsWith(prefix))
  const millvale = bodyNamed("MILLVALE")
  const kenoza = bodyNamed("KENOZA")
  const crystal = bodyNamed("CRYSTAL")

  const throughLabel = $derived(
    new Date(`${current.throughDate}T00:00:00Z`).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }),
  )
</script>

<h1>Drought</h1>

<p>
  Our water supply is a complicated system, and so it's difficult to fully understand everything
  contributing to drought conditions. This page gathers information across several sources, to
  provide as complete a picture as is possible.
</p>

<p>
  This site is not affiliated with the city of Haverhill and nothing here should be regarded as an
  official statement by the city. Members of the city were consulted in the development of this
  page, but all information used is publicly available.
</p>

<h2>Sources</h2>

<!-- A grid rather than a float, because the chart has to sit *beside* the map
     rather than below it. A float only shortens the line boxes of the text
     that follows it: a block-level element -- which the chart's own <figure>
     is -- lays its box out at full width underneath, and the browser then
     pushes the whole thing clear of the float. Measured, before this was a
     grid: at 1440 the map ended at y=581 and the chart began at y=589, full
     window width. Two grid columns place both deterministically at every
     size, and a single column below `md`, where the map goes back above the
     text because a two-fifths map beside a two-fifths column is neither.
     `md` and not `sm`: at a 640px window the two columns leave the chart 372px
     to draw in, which rendered its labels at 8.9px -- stacked at that width it
     gets the full column and they come out near 13.

     `h-80` on the map's own cell because an interactive map fills the height
     its parent gives it and has a 20rem floor of its own; `items-start` so
     that height is its own rather than the taller column's. -->
<div class="grid items-start gap-x-5 gap-y-3 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
  <!-- Taller than the h-80 it was: the watersheds pushed the frame north, and
       the bounds are now nearly square. Fitted into a box twice as wide as it
       is tall the map had to zoom out to fit the height, which spent about
       forty per cent of the width on Salem and Methuen. -->
  <div class="h-[26rem] md:col-start-2 md:row-start-1">
    <PrecinctMap
      title="Haverhill, the {COUNT_WORD[
        waterBodies.bodies.length
      ]} bodies of water its public supply draws from, and the land draining to each"
      bounds={waterBodies.bounds as [number, number, number, number]}
      areas={supplyAreas}
      outlines={[{ shape: waterBodies.town.shape, name: "Haverhill" }]}
      width={400}
      height={320}
      hoverLabel
      caption="MassDEP, USGS and MassGIS"
    />
  </div>

  <div class="md:col-start-1 md:row-start-1">
    <p>
      Our water is primarily replenished through rainfall, which runs into Crystal Lake, Millvale
      Reservoir and Kenoza Lake. In the spring, snow melt also runs into these water supplies,
      making up another significant source.
    </p>

    <RainfallChart
      years={data.rainfallYears}
      baseline={data.rainfallBaseline}
      source={data.rainfallSource.portal}
    />
  </div>
</div>

<div class="flow-root">
  <!-- Floated left, with the paragraph wrapping to its right. A float can do
       this where it could not do it for the rainfall chart: it shortens the
       *line boxes* of the text that follows, which is exactly what a
       paragraph is, where a block-level <figure> would have laid its box out
       underneath instead.

       After the grid rather than inside its left column, which is where this
       first went: in there the paragraph had a floated figure on one side and
       the map's column on the other, and about 400px of the window to set
       itself in. Out here it has the page's full width, the figure takes half
       of that rather than half a column, and nothing is squeezed between two
       figures. `flow-root` contains the float now that the grid cell's own
       formatting context is gone -- without it the float runs on into the
       heading below.

       `width` and `height` are the file's own pixels, so the box is reserved
       before it loads and nothing jumps; `h-auto w-full` scales it from
       there. It links to the committed full-size copy because the axis
       labels stop being readable at this width, and a reader who wants to
       read a figure off it needs the original.

       Full width above the text below `sm`: half a narrow column is not a
       chart, it is a thumbnail. -->
  <figure class="not-prose mb-3 w-full sm:float-left sm:mt-1 sm:mr-6 sm:mb-2 sm:w-1/2 sm:max-w-2xl">
    <!-- Even at half the page the chart is well under its own 1650px, so the
         fine axis labels still cannot be read here and the full-size copy is
         not a nicety. `cursor-zoom-in` says the image opens; the caption says
         so in words for a reader who never hovers anything. -->
    <a class="block cursor-zoom-in" href={Router.excerptFile(KENOZA_MEETING, KENOZA_CHART)}>
      <img
        src={Router.excerptFile(KENOZA_MEETING, KENOZA_CHART)}
        width="1650"
        height="1275"
        class="h-auto w-full rounded-lg ring-1 ring-slate-200"
        alt="The Water Department's chart of Kenoza Lake's level through {KENOZA_SOURCE.asOf}. The vertical axis is feet above the gauge datum, 94 to 116, against the calendar year. Four coloured bands set the drought stage at each date, deepening downward from the 5 to 10 percent Watch zone through Warning and Emergency to the Critical zone beneath them. Three lines are drawn: the 36-year average, peaking near 113 feet in May; the 2025 trend, peaking near 112.6 feet at the start of July and falling to about 102 by the end of December; and the current level, which rises only to about 105.7 in June before falling to a labelled 99.8 feet in mid-September, below the foot of every band."
      />
    </a>
    <figcaption class="mt-2 text-xs text-slate-500">
      &ldquo;{KENOZA_SOURCE.title}&rdquo; &mdash; the City of Haverhill's own chart, as of
      {KENOZA_SOURCE.asOf}, shown as the city drew it &mdash; open it for the full-size copy, which
      is the only size its axis labels can be read at. Served from this site rather than the city's,
      so the page does not depend on a file the city can move;
      <a href={KENOZA_SOURCE.url} target="_blank" rel="external noopener noreferrer">
        the original is here</a
      >, read {KENOZA_SOURCE.accessed}.
    </figcaption>
  </figure>

  <p>
    Over the last three years, our rainfall has been consistently below average, and unfortunately
    this means the water supply has not kept pace with our consumption. As a result, each year we've
    had to draw on our reserves and these are diminishing.
  </p>

  <p>
    Not all rainfall is created equal, though, as the pumps connected to these bodies of water have
    limited capacity. Kenoza Lake has the capacity to receive everything given how low it is, but
    other bodies of water have the potential to overflow in heavy rainfall. This is particularly
    true of Millvale Reservoir, which is relatively small and has a large watershed.
  </p>
</div>

<div class="flow-root">
  <h2>Consumption</h2>

  <p>
    Haverhill consumes approximately 6 million gallons of water a day. In dry years, this goes up
    significantly during the summer, when we had all of that rainfall in 2023 we used 204 million
    gallons less than 2022 which was considerably more dry.
  </p>

  <WaterUsageChart days={WATER_USAGE} />

  TODO: Find commercial/residential split
</div>

<h3>Where the water comes from</h3>

<p>
  The Water Department names {COUNT_WORD[waterBodies.bodies.length]} surface sources for public water
  system {waterBodies.pwsid}:
  {waterBodies.bodies.map((body) => titleCase(body.name)).join(", ")} &mdash; largest first, which is
  also how to read them off the map, since each is drawn at its own size. Around each, in the same colour
  but paler, is its watershed: the land that drains into it.
</p>

<p>
  <strong>A reservoir is small and the ground feeding it is not.</strong> Millvale is the smallest
  of the {COUNT_WORD[waterBodies.bodies.length]} waters and has by far the largest watershed &mdash;
  {acres(millvale?.watershed?.acres)} acres draining into {acres(
    Math.round((millvale?.areaSqKm ?? 0) * 247.105),
  )} acres of reservoir, about a hundred to one. Kenoza's watershed is
  {acres(kenoza?.watershed?.acres)} acres and Crystal's {acres(crystal?.watershed?.acres)}.
</p>

<p>
  <strong>Some of that ground is not in Massachusetts.</strong> Of Millvale's watershed,
  {acres((millvale?.watershed?.acres ?? 0) - (millvale?.watershed?.massachusettsAcres ?? 0))} acres lie
  over the New Hampshire line, and {acres(
    (crystal?.watershed?.acres ?? 0) - (crystal?.watershed?.massachusettsAcres ?? 0),
  )} acres of Crystal's do &mdash; visible on the map where the violet and teal cross the city boundary
  northward. The city's own Open Space &amp; Recreation Plan names the towns: Plaistow and Newton drain
  to Millvale, Atkinson to Crystal. Kenoza's watershed is entirely in Haverhill.
</p>

<p>
  Which waters are the supply is the city's own list. The shorelines are the federal hydrography
  dataset's, and the watersheds and their acreages are MassDEP's Surface Water Supply Watersheds.
</p>

<h3>Slop: Rainfall and reservoir level, this year against last</h3>

<p>
  Inches of precipitation, averaged across Haverhill's rain gauges.
  {current.year} has had {current.toDateInches} inches through {throughLabel}, and {previous.year}
  had {previous.toDateInches} inches by the same day.
</p>

<p>
  Each day is the average of every rain gauge in Haverhill that read it: the National Weather
  Service Cooperative Observer station ({city.name}, <code>{city.sid}</code>) and two CoCoRaHS
  gauges &mdash; {gauges.map((gauge) => `${gauge.name}, ${gauge.miles} miles`).join("; ")}. All
  three count equally. That makes these figures the city-wide average rather than any one station's:
  the Cooperative Observer station alone reads
  {current.cityOnlyToDateInches} inches for {current.year} against the {current.toDateInches} above. It
  is also read by hand, so {current.filledDays} of {current.year}'s days carry no reading from it
  and stand on the volunteer gauges alone. Nothing is estimated or interpolated: every figure is
  some gauge's own reading, and no day is filled from the long-term normal. Station records come
  from
  <a href="https://www.rcc-acis.org/" target="_blank" rel="external noopener noreferrer">
    RCC-ACIS
  </a>, run by NOAA's Regional Climate Centers.
</p>

<h2>Notes</h2>

<!-- TEMPORARY, and to be deleted with the notes themselves.

     These are research notes in the author's own line breaks, not something
     a reader is meant to find. Prettier reflows bare text to 100 columns and
     silently rewrapped the whole block once, destroying its line structure,
     so `prettier-ignore` below holds the formatting while the page is being
     written. It has to sit immediately before the text it protects -- the
     directive applies to the next node and nothing further.

     When the page is finished, this comment, the directive and the notes all
     come out together. Nothing else depends on any of them. -->
<!-- prettier-ignore -->

Well water: https://www.usgs.gov/water-science-school/science/aquifers-and-groundwater Planning
committee 2026-03-30:
http://haverhillcommunitytv.org/video/haverhill-city-council-planning-development-meeting-march-30-2026
- Wells start around 18:30 - Millvale large watershed and small reservoir, overflows and diminishing
return by upgrading equipment - Marsh across from lake probably doesn't have as much water as you
think - Millvale drawn first and crystal held for later because of overflowing situation - Most
towns around us have groundwater wells or draw from Merrimack - Georgetown been in water ban for 10
years - Well graphic from https://www.mass.gov/conservemawater used - Mayor calls out golf courses
losing multi-million dollar green - Rogers complained about 9-5 a lot and doesn't really want to
fine, focus on education - Diodati doesn't like fine increases, wants to turn sprinkler on for
daughter at noon - Lewandowski in discussion with Bob about changing from cubic feet to gallons -
1:01 bill more often, $28k per billing cycle so more expensive, but bill after summer is over can be
surprising - Outreach for people who don't interact with bill directly (HOA members and renters),
bill stuffer, everbridge call (only about 50% of city), no social media - 1:12 water commission
proposed, mayor wants it in natural resources subcomittee, feels like experts are meeting all the
time anyway - 1:19 outside speaker about new development increasing water usage and wants
clarification to public - 1:25 Al Pereira - 1:30 Business water usage, Ward: significant portion of
bill and so they're already conserving as much as they can Michitson: any data we can look at? Ward:
meter readings Mayor: recruited food industries because we have good, cheap water Ward: commercial
usage fairly steady, biggest factor for increased usage is when it's not raining - May-Oct usage
2022 vs 2023 was 200M gallons Al: Independent audit Flume water index:
https://flumewater.com/water-index/ - Boston: 38.1 Gallons Per Capita Per Day Indoor Radio well
presentation at 6:10:
http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-june-2-2026 - Not the first
time it's been in front of the council, Feb 10th and Mar 10th presented and rejected taking 4.5-5
acres from property - 309 E Broadway - $900,000 for property - Imminent domain taking for the
purpose of water supply - Ranney (or maybe rain-e, not sure) collector well - Councilors expressed
concerns with eminent domain, prefer negotiation with property and willing to purchase entire parcel
- Entire property $1.8M - Now negotiated agreement with property owner for $1.8M - July 31st
transfer of ownership - Started well presentation at 13:00 - Studies have shown for a long time that
we need more water - Only large source left is the Merrimack, but not by a direct intake - A few
ways to do this, we're going with a radial collector well, which drills down vertically and then
extends screens well below the river to draw ground water from there - Picture at 15:02 of what it
would look like - Soundings of river bottom to find troughs beneath the river in the bedrock with
material we can draw water from - 16:42 picture of tracklines from sounding - Pump test each
promising candidate to identify material - 18:07 test well image of across river - Preliminary
testing shows 5-10M gallons a day Sullivan: When will we know more about how much we can draw? -
Construction bid later this year (now?) and then 9-12 months to complete Diodati: Water quality? -
Currently doing testing of quality, including PFAS. Will catch anything - Takes decades for river
water to migrate from river to where collection is happening Michitson: Total project cost? - $26M
around 25:00, loan order doesn't cover it Michitson: Permitting risks? - Always risks, but confident
we can jump through hoops - Already gone through extensive permitting Basiliere: How long have we
known? - Excess of 10 years McGonagle: I was against loan order for ~$19M back in 2012/2013 - Just
started tapping this loan order recently Michael Leon (attourney): - City outside council - 8 years
- Determined 5.5 acres was necessary, but council rejected eminent domain - Recording an order of
taking at the end of July - Agreement to acquire the entire property for $1.8M + moving costs
Sullivan: What are city's options for the house? - Preserve and protect, no other plans Basiliere:
Friendly eminent domain taking, 5th amendment, right? - Yes, and some legal details Basiliere:
Protects land owners? - Yes, it ensures compensation Diodati: Unfriendly taking slower? - Could take
1-3 years Lewandowski: Is this binding on both sides? - Yes, and this ensures supply for decades -
Radial well protects river itself fairly effectively McGonagle: If we had done it sooner it would
have been cheaper? - City could surplus the rest of the property later, but probably not something
to do yet - Appraisal process was for entire parcel, they did math to determine value of 5.5 acres
LePage: Notice that there's 2 oil tanks underneath property - Yes, it's the city's responsibility
because we're taking it as is - Tests don't show impact to property Basiliere: Does article 97
apply? - Open question if it does, disposing of it will have to be if city determines there is no
valid public purpose Toohey: We as the city did the right thing Jordan: This meeting is to obtain
additional money for rest of property? - Yes
http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-march-10-2026 34:36 Executive
session: Purchase of property originally discussed - This means it was not a discussion open to the
public - After session proposed to table for a week Diodati: Y Lewandowski: Y LePage: Y Rogers: Y
Not a 2/3rds so didn't pass - Voted to reconsider item Revoted to table
http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-march-17-2026 1:29:40 Loan
order for water main improvements 2:06:50 Revisit item - attorneys still discussing, continued to
give that more time Could not find minutes in 2013 discussing the project originally, looks like
2012 minutes are unavailable
http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-october-6-2026 41:51 Discussion
of new water ordinance

http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026 29:17 Drought
update (includes slideshow) Methuen providing water to get us through Announcement of entering the
critical zone Water restrictions saved 150M gallons of water Slide showing timeline - Nov 2024
Drought Watch - March 18, 2025 Declared Emergency Drought - May 14, 2025 Drought ended - September
16, 2025 Drought Watch - Feb 13 2026 Critical Drought - Mar-Aug 2026 Drought Emergency - Sep 15,
2026 Critical Drought (I added this based on mayor's announcement) 33:15 Water restriction savings
slide 34:21 Rainfall statistics slide 35:12 Water level chart - Kenoza: 99.8'/114.5' - Millvale:
39.1'/44.7' (offline) - Crystal Lake: 147.3'/151.1' (pumping 1M gallons per day) - Snow melt came
and left quickly (TODO: he said he talked about it in city council meeting, find that) - Lowest it's
been in Bob Ward's career (since 1995) 39:11 Methuen has to resolve water quality issue before we
can start pulling from them DEP will get back end of Oct 42:26 What are we doing slide 43:04 Radial
collector well fully permitted and online is 2 years 43:50 6-7M gallons per day projections
45:19 2022 vs 2023 water usage (dry vs wet year), 204M gallons more in dry years
0:51:32 Michitson: North Andover declared a water emergency today 
54:19 Basiliere: 
We're using less water today than 10 years ago
2022 permitted reworld to use an aquifer on the river that saved 250k GPD
Took Covanter offline
44:24 New multi-unit residential developments usage per unit per day:
- 2 Merrimack St: 11 units, 131
- 20-44 Merrimack St: 84 units, 134
- 160 Merrimack St: 49 units, 84
- 12-20 Granite Ave: 61 units, 141
- 40 Locke St: 258 units, 64
- 10 Duncan St: 60 units, 83
- This does not include all development, but this accounts for 0.82% of total water usage
58:59 Rough calculations for Methuen water, $1.5M for 3-5 months
1:02 Account of water usage leaks
Less than 10% very good, which we've been well below
1:17:40 Golf courses generally don't buy water from us
1:19:30 We have some heavy industry users, they've been asked to perform voluntary conservation but it hasn't had much of an effect
- Tiered rates would help with that
1:23:50 Lewandowski moves to investigate tiered rates
somewhere in these slides had the percentage of new development usage
1:32:53 Motion is to get them under contract in 4 weeks

Water usage spreadsheet:
/home/lackita/Downloads/rgpcd uaw 2025 web 9-1-26-a11y.xlsx
Source: https://www.mass.gov/info-details/public-water-supply-tools-resources-performance-standards

Ipswich well/stream connection study: https://pubs.usgs.gov/wri/wri004029/whole_report.pdf

<h2>Population</h2>

<p>
  Haverhill had {POPULATION.at(-1)!.people.toLocaleString("en-US")} residents in
  {POPULATION.at(-1)!.year}, against {POPULATION[0].people.toLocaleString("en-US")} in {POPULATION[0]
    .year}.
</p>

<PopulationChart years={POPULATION} />

<p>
  The bars start at 2020 because the estimates before that cannot be set beside them. The Census
  rebuilds its annual estimates on each decennial count: the 2010-based series had Haverhill near
  64,000 by 2019, and the 2020 Census then counted 67,776. Drawn end to end the two look like 3,762
  people arriving in one year, which is a change of anchor rather than of population, and the Bureau
  publishes no reconciled series spanning them. For the longer view the two counts themselves are
  comparable, being counts rather than projections: {CENSUS_COUNTS[2010].toLocaleString("en-US")} in 2010
  against {CENSUS_COUNTS[2020].toLocaleString("en-US")} in 2020, {(
    CENSUS_COUNTS[2020] - CENSUS_COUNTS[2010]
  ).toLocaleString("en-US")} more people, about 11% over the decade. Estimates are the
  {POPULATION_SOURCE.agency}'s {POPULATION_SOURCE.program},
  {POPULATION_SOURCE.vintage}, for {POPULATION_SOURCE.place}, read {POPULATION_SOURCE.read}.
</p>
