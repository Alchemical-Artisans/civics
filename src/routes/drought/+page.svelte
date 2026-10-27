<script lang="ts">
  // The rainfall chart's months are aggregated in `+page.server.ts`: the
  // three station files behind them run to megabytes, and a server load is
  // what keeps them out of this page's own bundle.
  import RainfallChart from "$lib/RainfallChart.svelte"
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import waterBodies from "$lib/data/water-bodies.json"

  let { data } = $props()

  const current = $derived(data.rainfallYears.at(-1)!)
  const previous = $derived(data.rainfallYears.at(-2)!)
  const city = $derived(data.rainfallSource.cityStation)
  const gauges = $derived(data.rainfallSource.neighbourStations)

  // `toDateInches` is each year summed only to the same month and day the
  // current year reaches, which is the one figure of these comparable across
  // both -- see $lib/precipitation.ts. The sentence below must not put a
  // part-year beside a whole one.

  // The waters Haverhill's public system draws from, drawn as one system
  // rather than one category each: same fill, each named on itself, with the
  // city's own boundary outlined around them. See scripts/lib/water-bodies.mjs
  // for where the supply list and the shapes each come from, and for why the
  // list is the Water Department's own three rather than MassDEP's four.
  const WATER = "#0369a1"

  // Spelled rather than numeric: "names 3 surface sources" reads as a count in
  // a table and this is a sentence. Derived rather than written into the prose
  // because the written version went stale the moment a source came off the
  // map -- the paragraph below said "four" while the map drew three.
  const COUNT_WORD = ["no", "one", "two", "three", "four", "five", "six"]

  // A protection area runs to four figures, and "1541 acres" reads as a year
  // rather than a quantity.
  const acres = (value: number | undefined) => value?.toLocaleString("en-US") ?? ""
  const supplyAreas = waterBodies.bodies.map((body) => ({
    id: body.sourceId,
    shape: body.shape,
    name: `${titleCase(body.name)} — ${body.areaSqKm} square kilometres`,
    fill: WATER,
    opacity: 0.55,
    // No standing label: this map is a two-fifths float a few hundred pixels
    // wide, and three names drawn on it at once crowd each other and the
    // shapes they belong to. `hoverLabel` names one at a time instead, on
    // hover or focus, which is legible at any size and cannot collide. The
    // paragraph beside the map also names all three, largest first, for a
    // reader who hovers nothing.
  }))

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
  <div class="h-80 md:col-start-2 md:row-start-1">
    <PrecinctMap
      title="Haverhill, and the {COUNT_WORD[
        waterBodies.bodies.length
      ]} bodies of water its public water supply draws from"
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

    <RainfallChart years={data.rainfallYears} baseline={data.rainfallBaseline} />
  </div>
</div>

<h3>Where the water comes from</h3>

<p>
  The Water Department names {COUNT_WORD[waterBodies.bodies.length]} surface sources for public water
  system {waterBodies.pwsid}:
  {waterBodies.bodies.map((body) => titleCase(body.name)).join(", ")} &mdash; largest first, which is
  also how to read them off the map, since each is drawn at its own size inside the city boundary. Millvale
  is the smallest of the {COUNT_WORD[waterBodies.bodies.length]} but sits in by far the largest protection
  area, {acres(waterBodies.bodies.find((b) => b.name.startsWith("MILLVALE"))?.zoneAcres)} acres against
  Kenoza's
  {acres(waterBodies.bodies.find((b) => b.name.startsWith("KENOZA"))?.zoneAcres)} &mdash; a small reservoir
  under a wide watershed. Which waters are the supply is the city's own list; the outlines and the protection-area
  acreages are the state's and the federal hydrography dataset's.
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
2022 vs 2023 was 200M gallons Al: Independent audit
