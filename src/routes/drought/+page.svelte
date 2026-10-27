<script lang="ts">
  // The rainfall chart's months are aggregated in `+page.server.ts`: the
  // three station files behind them run to megabytes, and a server load is
  // what keeps them out of this page's own bundle.
  import DroughtChart from "$lib/DroughtChart.svelte"
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import { KENOZA_LEVELS, KENOZA_SOURCE } from "$lib/kenoza-levels"
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

  // The four waters Haverhill's public system draws from, drawn as one system
  // rather than four categories: same fill, each named on itself, with the
  // city's own boundary outlined around them. See scripts/lib/water-bodies.mjs
  // for where the supply list and the shapes each come from.
  const WATER = "#0369a1"
  const supplyAreas = waterBodies.bodies.map((body) => ({
    id: body.sourceId,
    shape: body.shape,
    name: `${titleCase(body.name)} — ${body.areaSqKm} square kilometres`,
    fill: WATER,
    opacity: 0.55,
    // No standing label: Kenoza and Round Pond sit close enough together that
    // theirs would overlap at the zoom this opens on. `hoverLabel` names one
    // at a time instead, on hover or focus, which is legible at any size and
    // cannot collide. The paragraph beside the map also names all four,
    // largest first, for a reader who hovers nothing.
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

  const renamed = $derived(waterBodies.bodies.filter((body) => body.namesDiffer))

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

<p>
  Our water is primarily replenished through rainfall, which runs into Crystal Lake, Millvale
  Reservoir and Kenoza Lake. In the spring, snow melt also runs into these water supplies, making up
  another significant source.
</p>

<h3>Where the water comes from</h3>

<!-- `flow-root` so the float is contained: without it the heading below
     would wrap around the map instead of starting under it. The map only
     floats from `sm` up; at phone width it is full width above the text,
     since a two-fifths map beside a two-fifths column is neither. -->
<div class="flow-root">
  <!-- `h-80` because an interactive map fills the height its parent gives it,
       and has a 20rem floor of its own; without a height on the wrapper there
       is nothing for it to fill. -->
  <div class="mb-3 h-80 w-full sm:float-right sm:mb-2 sm:ml-5 sm:w-2/5">
    <PrecinctMap
      title="Haverhill, and the four bodies of water its public water supply draws from"
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
    Massachusetts DEP lists four surface sources against {titleCase(waterBodies.supplier)}, public
    water system {waterBodies.pwsid}:
    {waterBodies.bodies.map((body) => titleCase(body.name)).join(", ")} &mdash; largest first, which is
    also how to read them off the map, since each is drawn at its own size inside the city boundary. Millvale
    is the smallest body of the four but sits in by far the largest protection area, {waterBodies.bodies.find(
      (b) => b.name.startsWith("MILLVALE"),
    )?.zoneAcres} acres against Kenoza's {waterBodies.bodies.find((b) =>
      b.name.startsWith("KENOZA"),
    )?.zoneAcres} &mdash; a small reservoir under a wide watershed.
  </p>

  {#if renamed.length}
    <p>
      One caution on the names. The state's two agencies do not agree on all of them: what MassDEP
      files as {renamed.map((body) => titleCase(body.name)).join(", ")} is the water the federal hydrography
      dataset calls
      {renamed.map((body) => body.mappedName).join(", ")}. The shapes here are matched to the
      sources by position rather than by name, so the outline is the right water whichever name is
      used &mdash; but if you are asking the city about it, it is worth naming the location as well
      as the pond.
    </p>
  {/if}
</div>

<h3>Rainfall and reservoir level, this year against last</h3>

<DroughtChart years={data.rainfallYears} levels={KENOZA_LEVELS} />

<p>
  Inches of precipitation each month, averaged across Haverhill's rain gauges, and the same rainfall
  accumulating since January 1st beneath it. {current.year} has had
  {current.toDateInches} inches through {throughLabel}, and {previous.year} had
  {previous.toDateInches} inches by the same day. The last point on {current.year}'s line is dashed
  in both because the month is not over.
</p>

<p>
  The two rainfall panels answer different questions. A month's own inches shows when it rained
  &mdash; {current.year}'s wettest month and its driest differ by several inches, and a running
  total hides both. The accumulation shows how far behind a year is by now, which is the question
  the reservoir is answering to, so it sits directly above the lake rather than beside its own
  monthly chart.
</p>

<p>
  The lower panel is Kenoza Lake's own level over the same months. Those figures are dotted because
  they are weaker than the rest: the city has never published the series as numbers, so each one is
  where a line sat on its published
  <a href={KENOZA_SOURCE.url} target="_blank" rel="external noopener noreferrer">
    drought-status chart
  </a>, as of {KENOZA_SOURCE.asOf} &mdash; good to about a fifth of a foot and no better. The one level
  the city states outright is the 99.8-foot low of mid-September, which that reading reproduces exactly.
  {KENOZA_LEVELS.at(-1)!.year}'s line stops in September because that is when the chart was drawn.
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
