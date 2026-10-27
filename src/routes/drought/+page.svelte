<script lang="ts">
  // The rainfall chart's months are aggregated in `+page.server.ts`: the
  // three station files behind them run to megabytes, and a server load is
  // what keeps them out of this page's own bundle.
  import DroughtChart from "$lib/DroughtChart.svelte"
  import { KENOZA_LEVELS, KENOZA_SOURCE } from "$lib/kenoza-levels"

  let { data } = $props()

  const current = $derived(data.rainfallYears.at(-1)!)
  const previous = $derived(data.rainfallYears.at(-2)!)
  const city = $derived(data.rainfallSource.cityStation)
  const gauges = $derived(data.rainfallSource.neighbourStations)

  // `toDateInches` is each year summed only to the same month and day the
  // current year reaches, which is the one figure of these comparable across
  // all four -- see $lib/precipitation.ts. The sentence below must not put a
  // part-year beside three whole ones.
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

<h3>Rainfall and reservoir level, this year against last</h3>

<DroughtChart years={data.rainfallYears} levels={KENOZA_LEVELS} />

<p>
  Inches of precipitation each month, as the city's own gauge measured them.
  {current.year} has had {current.toDateInches} inches through {throughLabel}, and
  {previous.year} had {previous.toDateInches} inches by the same day. The last point on
  {current.year}'s line is dashed because the month is not over.
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
  Readings are the National Weather Service Cooperative Observer station inside the city ({city.name},
  <code>{city.sid}</code>), which is read by hand and so has gaps: {current.filledDays} of {current.year}'s
  days carry no reading from it. Those days are filled from the two CoCoRaHS gauges also inside
  Haverhill &mdash; {gauges.map((gauge) => `${gauge.name}, ${gauge.miles} miles`).join("; ")}
  &mdash; averaged where both read the day. Nothing is estimated or interpolated: every figure is some
  gauge's own reading, and no day is filled from the long-term normal. Station records come from
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
