<script lang="ts">
  // The rainfall chart's months are aggregated in `+page.server.ts`: the
  // three station files behind them run to megabytes, and a server load is
  // what keeps them out of this page's own bundle.
  import KenozaLevelChart from "$lib/KenozaLevelChart.svelte"
  import PopulationChart from "$lib/PopulationChart.svelte"
  import RainfallChart from "$lib/RainfallChart.svelte"
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import WaterUsageChart from "$lib/WaterUsageChart.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { POPULATION } from "$lib/population"
  import { WATER_USAGE } from "$lib/water-usage"
  import { Router } from "$lib/router"
  import ShapeMap from "$lib/ShapeMap.svelte"
  import { COLOURS } from "$lib/chart-colours"
  import waterBodies from "$lib/data/water-bodies.json"

  let { data } = $props()

  // The page's public address and the words a share goes with. Shared the
  // way a project page is: the card a link unfurls as is `ShareMeta`'s, and
  // the posted link is the same address. The title is the one `<svelte:head>`
  // sets below, so a card and a tab cannot name the page differently.
  const TITLE = "Haverhill Drought Guide"
  const sharedUrl = Router.absolute("/issues/drought")
  const description = "An in depth guide to Haverhill's drought."

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

  // Watersheds first so the water sits on top of the ground that feeds it;
  // `areas` draws in order.
  const supplyAreas = [
    ...waterBodies.bodies
      .filter((body) => body.watershed)
      .map((body, i) => ({
        id: `${body.sourceId}-watershed`,
        shape: body.watershed!.shape,
        name: `${titleCase(body.name)} watershed`,
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
      name: titleCase(body.name),
      fill: hueFor(i),
      opacity: 0.85,
      // No standing label: this map is a two-fifths float a few hundred pixels
      // wide, and three names drawn on it at once crowd each other and the
      // shapes they belong to. `hoverLabel` names one at a time instead, on
      // hover or focus, which is legible at any size and cannot collide.
      //
      // The name and nothing else. Each label used to carry the shape's size
      // too -- "Kenoza Lake — 1.9 square kilometres", "Kenoza Lake watershed
      // — 3,210 acres" -- which made the one thing a reader hovers to learn
      // the shorter half of what they got, in a box sized to the longer half.
      // A hover is how this map answers "which lake is that": a figure is a
      // different question and wants a sentence, not a tooltip.
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
</script>

<!-- The page had none, so the tab, the bookmark and the first thing a screen
     reader says on load were all the bare URL. "Drought" alone is the
     heading's word and says nothing about whose drought; the title is the
     one piece of this page that is read with no page around it. -->
<ShareMeta url={sharedUrl} title={TITLE} {description} />

<svelte:head>
  <title>{TITLE}</title>
</svelte:head>

<h1>Drought</h1>

<!-- The day this build ran, in the city. The layout's server load gives it,
     so the served page and a reader's own clock cannot disagree about it. -->
<p class="m-0 mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-slate-600">
  <span class="font-semibold text-slate-700">Published</span>
  <span>{formatLongDate("2026-11-09")}</span>
</p>

<div class="mt-2">
  <ShareButton url={sharedUrl} text={TITLE} />
</div>

<p>
  Recently, Haverhill's water supply <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer">entered the status Critical Drought (timestamp 29:17)</a
  >. It's difficult to understand what this means and why it's happening, and much of the
  information is only available through recorded meetings that are time consuming to review. This
  page provides a summary of information that's been shared and an analysis of concerns that have
  been raised to make it easier for people to understand what's going on.
</p>

<p>
  This site is not affiliated with the city of Haverhill and nothing here should be regarded as an
  official statement by the city. Members of the city were consulted in the development of this
  page, any information they provide which isn't publicly available has been made available where it
  is relevant.
</p>

<p>
  Haverhill defines a drought based on the <a
    href="https://ecode360.com/31349794"
    target="_blank"
    rel="external noopener noreferrer">level of Kenoza Lake</a
  >, but it's important to understand that this is a proxy which combines the demand of our city
  with water sources available to us. Steps taken to artificially increase this level which do not
  either reduce demand or increase supply therefore solve the symptom rather than the problem.
</p>

<h2>Water Sources</h2>

<!-- Taller than the h-80 it was: the watersheds pushed the frame north, and
     the bounds are now nearly square. Fitted into a box twice as wide as it
     is tall the map had to zoom out to fit the height, which spent about
     forty per cent of the width on Salem and Methuen. -->
<div class="h-[26rem] md:col-start-2 md:row-start-1">
  <ShapeMap
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

<p>
  Our water is <a
    href="https://www.haverhillma.gov/living-here/waterwastewater-services/water-supplydrought-information/"
    target="_blank"
    rel="external noopener noreferrer">primarily replenished through rainfall</a
  >, which runs into Crystal Lake, Millvale Reservoir and Kenoza Lake. In the spring, snow melt also
  runs into these water supplies, making up another significant source.
</p>

<h3>Precipitation</h3>

<p>
  Over the last several years, our rainfall has mostly been <a
    href="https://xmacis.rcc-acis.org/"
    target="_blank"
    rel="external noopener noreferrer">below average</a
  >, and unfortunately this means the water supply has not kept pace with our consumption. As a
  result, each year we've had to draw on our reserves and these are diminishing.
  <a
    href="https://www.c2es.org/content/extreme-precipitation-and-climate-change/"
    target="_blank"
    rel="external noopener noreferrer">Climate change strongly affects precipitation</a
  >, which means this problem is unlikely to go away any time soon.
</p>

<RainfallChart
  years={data.rainfallYears}
  baseline={data.rainfallBaseline}
  source={data.rainfallSource.portal}
/>

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

     Full width above the text below `sm`: half a narrow column is not a
     chart, it is a thumbnail.

     Passed in rather than built into the component: the chart is the city's
     picture of the lake, and whether it floats beside this paragraph is a
     fact about this page. -->
<KenozaLevelChart class="mb-3 w-full sm:float-left sm:mt-1 sm:mr-6 sm:mb-2 sm:w-1/2 sm:max-w-2xl" />

<p>
  The pumps connected to these bodies of water have limited capacity, and with too much rainfall
  they have the potential to overflow. This is particularly true of Millvale Reservoir, which is <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-planning-development-meeting-march-30-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >relatively small and has a large watershed (timestamp 22:43)</a
  >.
</p>

<p>
  When snow melts in the Spring, this runs into our water supply as much as possible. This helps
  replenish Kenoza in the Spring, but if it melts too quickly it's subject to the same limitations
  as heavy rainfall. Snowfall melted quickly this year, which <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >limited our ability to capture it in our water supply (timestamp 35:22)</a
  >.
</p>

<h3>Beaver Dams</h3>

<p>
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-october-6-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >Residents have noticed that more beaver dams have been constructed recently (timestamp 1:30:00)</a
  >, expressing concerns that this is preventing water from getting into our water supply.
  <a
    href="https://www.mass.gov/info-details/addressing-property-damage-from-beaver-activity"
    target="_blank"
    rel="external noopener noreferrer">These are protected</a
  >
  because of their
  <a
    href="https://www.epa.gov/sciencematters/how-do-beaver-dams-affect-water-quality"
    target="_blank"
    rel="external noopener noreferrer">ecological benefits</a
  >, though, so removing them could be complicated.
</p>

<p>
  It should also be noted that these dams create new pools, but they probably don't limit the supply
  all that much. The drought is a result of decreased water coming into the system, removing these
  dams would only have a one time increase to what's in the lake. One way to think about this is
  that the water behind a beaver dam is like a full tub; if you pour a bottle of water into the tub
  then a bottle's worth of water would overflow.
</p>

<h3>New Hampshire Drawdown</h3>

<p>
  <a
    href="https://www.des.nh.gov/news-and-media/state-announces-its-2026-fall-drawdown-lakes"
    target="_blank"
    rel="external noopener noreferrer">New Hampshire reduces lake levels annually</a
  >, and
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-planning-development-committee-meeting-october-19-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >some have suggested some of Salem's drawdown could be diverted into our water supply (timestamp
    1:23:10)</a
  >. There are
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-planning-development-committee-meeting-october-19-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >regulatory restrictions on moving water from other bodies of water into our water supply,
    though, ones which would be complicated to circumvent (timestamp 1:28:10)</a
  >.
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-planning-development-committee-meeting-october-19-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >Transporting that water would also be extremely expensive (timestamp 1:27:30)</a
  >, significantly more than other options available to the city to supplement our water supply.
</p>

<h2>Consumption</h2>

<p>
  Haverhill consumes approximately 6 million gallons of water a day. In dry years, this goes up
  significantly during the summer, when we had all of that rainfall in 2023 <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >we used 204 million gallons less than 2022 (timestamp 44:19)</a
  > which was considerably more dry.
</p>

<WaterUsageChart days={WATER_USAGE} />

<h3>Industry/Commercial Use</h3>

<p>
  Haverhill sees <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer">heavy industry use (timestamp 1:18:41)</a
  >, in 2025
  <a href={Router.reference("cy25-water-usage.xlsx")}>51.06% of our total water usage</a> was from
  that sector. It was
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >implied in the September drought update that voluntary conservation has not had a significant
    impact (timestamp 1:19:14)</a
  >
  and
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >the city is currently investigating tiered pricing to create a stronger incentive for these
    businesses (timestamp 1:32:20)</a
  >.
</p>

<p>
  Car washes are an extremely visible water consumer, many of which justify operation during
  droughts because of how much water they're able to reclaim. Much of the information out there,
  though, is published by car washes which obviously have a vested interest in remaining open. The
  EPA published <a
    href="https://www.epa.gov/system/files/documents/2023-11/ws-commercial-bmp-watersenseatwork_section5.4_vehiclewashes.pdf"
    target="_blank"
    rel="external noopener noreferrer">a guide in 2023</a
  > which includes some numbers:
</p>

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Per Vehicle Use</th>
      <th>Use After Reclamation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Conveyor Systems</td>
      <td>65.8 gallons</td>
      <td>30.0 gallons</td>
    </tr>
    <tr>
      <td>In-Bay Automatic</td>
      <td>85.3 gallons</td>
      <td>43.3 gallons</td>
    </tr>
    <tr>
      <td>Self-Service</td>
      <td>15.0 gallons</td>
      <td>15.0 gallons</td>
    </tr>
  </tbody>
</table>

<p>
  As you can see, reclamation systems do save a lot of water, but even with those in place they
  still use significantly more than self service washing. In that situation, reclamation isn't
  possible because of activities like changing oil in the bays which would damage the filters. It's
  possible that the equipment available for self service translates to significant conservation, but
  it's difficult to compare to home washing because most sources estimating that usage are biased.
</p>

<p>
  Another visible commercial use is golf courses, which are explicitly exempted since it is
  considered a core function of their business. According to the water department, though, <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >most golf courses get their water elsewhere (timestamp 1:17:40)</a
  >. Golf courses aren't particularly forthcoming on their watering practices, though, and depending
  on what they're doing it could still impact drought conditions.
</p>

<h3>Well Usage</h3>

<!-- Figure 7 of the circular the paragraph below links, floated so the text
     explaining a cone of depression runs beside the drawing of one. A float
     shortens the line boxes of the paragraphs that follow, which is what
     sets them alongside it; a block-level figure would sit above them.

     The four panels are this section's whole argument in order: the aquifer
     discharging to the stream, the well drawing on storage, the cone
     reaching far enough to capture water that would have reached the stream,
     and the stream itself feeding the aquifer. At this width the panel
     labels cannot be read, so the figure opens the report it came out of.

     Served from here rather than hotlinked, the promise the rest of the site
     keeps; it is a USGS circular, a federal work and in the public domain. -->
<figure class="not-prose mb-3 w-full sm:float-left sm:mt-1 sm:mr-6 sm:mb-2 sm:w-2/5 sm:max-w-xs">
  <!-- Named for the destination: an `<a>` holding nothing but an `<img>`
       takes the alt as its accessible name, and the alt here is four panels
       of aquifer described in full. The description stays on the image; the
       link says where it goes. -->
  <a
    href="https://pubs.usgs.gov/circ/1376/pdf/circ1376_barlow_report_508.pdf"
    target="_blank"
    rel="external noopener noreferrer"
    aria-label="USGS Circular 1376, the report this figure comes from, PDF (opens in a new tab)"
  >
    <img
      src={Router.reference("streamflow-depletion-figure-7.png")}
      width="1200"
      height="1676"
      class="h-auto w-full"
      alt="Four cross-sections of a hypothetical aquifer, stacked. A: under natural conditions, arrows curve down from the land surface through an unconfined aquifer and out into a stream at the right. B: a well pumps near the stream and a cone of depression dips the water table around it, the arrows nearest the well turning towards it while the rest still reach the stream. C: the cone has widened until arrows that had run to the stream turn back towards the well instead. D: the water table has fallen below the stream and arrows run out of the stream into the aquifer. Figure 7 of USGS Circular 1376."
    />
  </a>
</figure>

<p>
  Well usage can potentially <a
    href="https://pubs.usgs.gov/circ/1376/pdf/circ1376_barlow_report_508.pdf"
    target="_blank"
    rel="external noopener noreferrer">have an impact on the available water supply</a
  >, depending on a combination of geological factors and the location of the well. As a rule of
  thumb, if a well is within the watershed of one of the city's water supplies, pumping from it
  probably reduces what will flow into that supply.
</p>

<p>
  When wells pump, they create something called a cone of depression around them where water begins
  flowing towards the well. If this cone becomes large enough to interact with a nearby stream, the
  flow of that stream will be reduced to supply water to the well. The size of the cone depends
  heavily on geologic factors and how much is being pumped from the well. There doesn't seem to be
  publicly available data on this information for our areas, but the geologically similar Ipswich
  River basin has been <a
    href="https://pubs.usgs.gov/wri/wri004029/whole_report.pdf"
    target="_blank"
    rel="external noopener noreferrer">heavily studied</a
  >. It was found that well pumping in that area had a significant effect on flow rates of streams
  and rivers.
</p>

<p>
  The location of the well matters greatly. Since all of our water supplies are north of the
  Merrimack, it's incredibly unlikely that wells south of the river would impact them. On the other
  hand, <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-planning-development-meeting-march-30-2026"
    target="_blank"
    rel="external noopener noreferrer">Crystal Lake is spring fed (timestamp 19:23)</a
  > so if it's in that watershed it's extremely likely to be influencing drought conditions.
</p>

<h3>New Apartment Buildings</h3>

<p>
  There have been concerns expressed about new apartment buildings bringing more people into the
  city than our water supply can handle. In the drought update, the city provided some data on <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >how much water some of these new buildings use (timestamp 44:26)</a
  >. By only measuring the usage of some of those developments, though, it's difficult to see if
  that information is comprehensive enough to fully represent the added strain this represents.
</p>

<p>
  It's possible to get a closer approximation of new apartment usage by combining
  <a
    href="https://www.census.gov/data/tables/time-series/demo/popest/2020s-total-cities-and-towns.html"
    target="_blank"
    rel="external noopener noreferrer">population information from the census</a
  >
  with general usage statistics. There were 1040 new residents added to the city in the last five years
  (difference between highest and lowest population years, 68,416 - 67,376), and each of these use approximately
  <a
    href="https://www.mass.gov/info-details/public-water-supply-tools-resources-performance-standards"
    target="_blank"
    rel="external noopener noreferrer">51 gallons a day</a
  >. This translates to 39,780 gallons (1040 * 51 gallons), which is 0.884% of our overall usage
  (39,780 gallons / 6,000,000 gallons).
</p>

<PopulationChart years={POPULATION} />

<p>
  This calculation has some degree of error, but these factors go in both directions and hopefully
  balance each other:
</p>

<ul>
  <li>
    The 2020 decennial census resulted in an upward adjustment of the population, making it
    difficult to use earlier numbers to exclude apartments constructed prior to that year.
  </li>
  <li>
    Some of the new residents included in this calculation may have moved into a more traditional
    home.
  </li>
  <li>
    Residents in apartment buildings do not have lawns, so outdoor water use is extremely minimal.
  </li>
  <li>
    Older homes use substantially more water than new construction; for example, our average of 51
    is significantly higher than the <a
      href="https://www.mass.gov/info-details/public-water-supply-tools-resources-performance-standards"
      target="_blank"
      rel="external noopener noreferrer">Boston average of 38.1</a
    >.
  </li>
</ul>

<h2>City Response</h2>

<p>
  The city has known for a while that our water supply is vulnerable, and earlier this year they
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-june-2-2026"
    target="_blank"
    rel="external noopener noreferrer">acquired property (timestamp 13:06)</a
  >
  to allow us to pull water from the Merrimack River. This project will
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer">take about two years to complete (timestamp 42:48)</a
  >, so they are working on building
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer">a connection to Methuen's water supply (timestamp 38:45)</a
  > as a precaution if ours gets too low.
</p>

<h3>Merrimack River</h3>

<p>
  The city is building a <a
    href="https://en.wikipedia.org/wiki/Ranney_collector"
    target="_blank"
    rel="external noopener noreferrer">Ranney Collector Well</a
  >
  to collect from the groundwater beneath the Merrimack. This is estimated to provide up to
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer">6-7 million gallons a day (timestamp 43:49)</a
  >, effectively doubling our available water supply. This project
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-june-2-2026"
    target="_blank"
    rel="external noopener noreferrer">will cost around $26 million (timestamp 24:00)</a
  >.
</p>

<p>
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-june-2-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >309 E Broadway was acquired for $1.8 million (timestamp 30:01)</a
  >
  and has been going full speed ahead since July. The geologic properties beneath the river make this
  location
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-june-2-2026"
    target="_blank"
    rel="external noopener noreferrer">uniquely suited for collection (timestamp 15:11)</a
  >, but obtaining it was somewhat challenging. The owner was not willing to sell the portion of
  land the city needed for this project, and on March 10th City Council
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-march-10-2026"
    target="_blank"
    rel="external noopener noreferrer">pushed back on the use of eminent domain (timestamp 39:00)</a
  >. The city was then able to negotiate a more friendly taking of the full property which was
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-june-2-2026"
    target="_blank"
    rel="external noopener noreferrer">approved by City Council on June 2nd (timestamp 50:40)</a
  >. It should also be noted that
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-june-2-2026"
    target="_blank"
    rel="external noopener noreferrer">this project dates back to 2012 (timestamp 26:45)</a
  >, when the property was originally identified and a loan order approved by the council.
</p>

<p>
  There may be concerns about the <a
    href="https://www.mass.gov/info-details/sewer-force-main-break-in-haverhill-frequently-asked-questions"
    target="_blank"
    rel="external noopener noreferrer">sewage recently discharged into the river</a
  >
  becoming our drinking water, as well as the landfill and paper mill being upriver of that site, but
  the
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-june-2-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >water is undergoing extensive testing to ensure that it is safe (timestamp 22:04)</a
  >. Additionally, the layers of sediment it must pass through
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-june-2-2026"
    target="_blank"
    rel="external noopener noreferrer">act as a natural filter (timestamp 27:54)</a
  >, and water actually reaching collection will
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-june-2-2026"
    target="_blank"
    rel="external noopener noreferrer">take decades (timestamp 23:15)</a
  > to pass through these layers.
</p>

<h3>Methuen</h3>

<p>
  As mentioned earlier, we will soon have the ability to obtain water from Methuen. This will ensure
  that if decreased rainfall occurs for the next couple years, demand of the city will continue to
  be met. This will be <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer">more expensive than using our own supply (timestamp 58:30)</a
  >, though, although the exact impact on water rates has not been provided.
</p>

<p>
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >The pipe for this connection is already mostly built (timestamp 57:50)</a
  >. The bigger issue revealed in that meeting, though, is that there is a
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >water chemistry problem between the two cities treatment methods (timestamp 38:55)</a
  >. Methuen is going to change their treatment process to match Haverhill's, something they've been
  planning to do for a while, which is estimated to be approved by the end of October.
</p>

<h3>Ordinance Changes</h3>

<p>
  On October 6th, Haverhill approved <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-october-6-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >many revisions to the water use ordinance (timestamp 41:29)</a
  >
  to reduce resident usage during drought conditions. These include increased fines for violations such
  as lawn irrigation and new requirements for new and upgraded irrigation systems. These changes were
  <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-planning-development-meeting-march-30-2026"
    target="_blank"
    rel="external noopener noreferrer">originally discussed on March 30th</a
  >, and several provisions were removed from those discussed. Most significantly, this included any
  restrictions for well users and irrigation restrictions during non-drought conditions.
</p>

<h3>Tiered Rates</h3>

<p>
  City Council ordered the water department to <a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-september-15-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >investigate tiered rates in mid-September (timestamp 1:32:20)</a
  > during the drought update. These will hopefully curtail industry/commercial usage, but if they don't
  they will at least offset the costs associated with pulling water from Methuen or building the Ranney
  Collector Well. These could be implemented immediately once that investigation is complete, although
  no further update has been provided on this change.
</p>
