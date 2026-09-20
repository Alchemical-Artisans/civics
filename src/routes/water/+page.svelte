<script lang="ts">
  // The third half: the city's drought emergency, not scraped from anywhere
  // -- see docs/water-pages.md and $lib/water for where every figure here
  // comes from and why that is a hand-kept exception rather than a scrape.
  import BudgetStack from "$lib/BudgetStack.svelte"
  import BudgetTable from "$lib/BudgetTable.svelte"
  import DroughtScale from "$lib/DroughtScale.svelte"
  import ProductionChart from "$lib/ProductionChart.svelte"
  import RainfallChart from "$lib/RainfallChart.svelte"
  import WaterCalculator from "$lib/WaterCalculator.svelte"
  import { Router } from "$lib/router"
  import {
    DROUGHT_MEETING,
    DROUGHT_ITEM,
    DROUGHT_STAGE,
    CURRENT_DROUGHT_ZONE,
    KENOZA_LAKE_LEVEL_FEET,
    KENOZA_LAKE_ZONE,
    USE_SPLIT_MGD,
    AVERAGE_PRODUCTION_MGD,
    RESTRICTED_USES,
    SOURCES,
    ORDINANCE_SOURCE,
  } from "$lib/water"
  import {
    RAINFALL_JAN_AUG,
    RAINFALL_RECORD_YEARS,
    CURRENT_RAINFALL_YEAR,
    CURRENT_RAINFALL_RANK,
    rainfallDeparture,
    ordinal,
    NOAA_SOURCE,
  } from "$lib/rainfall"

  // The production chart's rows are aggregated in `+page.server.ts`: the
  // daily files behind them run to megabytes, and a server load is what
  // keeps them out of this page's own bundle.
  let { data } = $props()

  const mgd = (n: number) => `${n} MGD`

  const currentRainfall = RAINFALL_JAN_AUG.find((row) => row.year === CURRENT_RAINFALL_YEAR)!
  const rainfallInches = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })
  const rainfallDeficit = Math.abs(rainfallDeparture(currentRainfall.inches))
</script>

<svelte:head>
  <title>Water — Meetinghouse</title>
  <meta
    name="description"
    content="Haverhill's drought emergency: what the city's own figures say about water use, what's restricted, and how a household compares to the city's conservation target."
  />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 sm:py-14">
  <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Water</h1>

  <!--
    Temporary development notice. A water-balance model (rainfall, snowfall,
    temperature, consumption) is being built behind the scenes in
    data/weather/ and data/consumption/ -- rainfall and temperature are real,
    station-sourced data; consumption is entirely fabricated placeholder data
    until a real source is found (data/consumption/README.md). Anything built
    on the placeholder carries its own warning at the point it appears, same
    as this one. Remove this banner once the model itself is real, cited, and
    either shown here or deliberately not.
  -->
  <div class="mt-4 max-w-2xl rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm">
    <p class="m-0 font-semibold text-amber-900">Development notice</p>
    <p class="m-0 mt-1 text-amber-800">
      A water-balance model is being built behind the scenes, using rainfall and temperature data
      from a real weather station plus <strong>entirely fabricated placeholder</strong> water-consumption
      figures, until a real source is found. Anything below built on the placeholder says so where it
      appears; everything under "Outdated" is still the city's own cited figures, untouched.
    </p>
  </div>

  <section class="mt-10">
    <h2 class="text-xl font-semibold tracking-tight text-slate-900">Water produced, by year</h2>
    <p class="mt-2 max-w-2xl text-sm text-slate-600">
      Forty years of water produced, against the rain that fell and the temperature it fell at over
      the same twelve months. <strong>{data.productionWarning}</strong> Both lines are real: they are
      the Haverhill weather station's own record. Each of the three is drawn as its distance from its
      own forty-year normal, which is the only way three measurements in gallons, inches and degrees share
      one scale -- so a bar or a point above the line is an unusual year for that measurement, not a large
      one.
    </p>
    <div class="mt-4 max-w-2xl">
      <ProductionChart windows={data.windows} />
    </div>
  </section>

  <!--
    Everything from here down predates the water-balance model and no longer
    reflects what this page is for -- kept rather than deleted, since it's
    still real, cited content, just not what's being built now. New work
    lands above this heading; nothing below it should grow.
  -->
  <h2
    class="mt-10 border-t border-slate-200 pt-6 text-sm font-semibold tracking-wide text-slate-400 uppercase"
  >
    Outdated
  </h2>

  <!--
    The status line is the city's own words for its own status, plus the one
    number this site can point to something committed for: the Kenoza Lake
    chart the Water/Wastewater director showed the Council. Linking to the
    Council briefing rather than restating it, the same reason the budget
    calendar links to a PDF instead of copying it.
  -->
  <p class="mt-3 max-w-2xl text-lg text-slate-600">
    The City of Haverhill remains in <strong>{DROUGHT_STAGE}</strong>. On September 15, 2026, the
    Water/Wastewater director told the City Council that Kenoza Lake stood at
    <strong>{KENOZA_LAKE_LEVEL_FEET} ft</strong>, inside the city's own
    <a
      class="underline decoration-slate-400 hover:decoration-slate-900"
      href={Router.excerpt(DROUGHT_MEETING, `${DROUGHT_ITEM}/drought-chart`)}
      target="_blank"
      rel="external noopener noreferrer"
    >
      {KENOZA_LAKE_ZONE}<span class="sr-only">, PDF chart, opens in a new tab</span>
    </a>.
    <a
      class="underline decoration-slate-400 hover:decoration-slate-900"
      href={Router.meeting(DROUGHT_MEETING)}
    >
      Read the Council's own briefing.
    </a>
  </p>

  <div class="mt-4 max-w-xs">
    <DroughtScale current={CURRENT_DROUGHT_ZONE} />
    <!--
      What the percentage actually is, right beside the scale it labels --
      not buried in the footer's Sources list, since "based on what" is the
      first question a number like this earns. Only Emergency's threshold is
      independently confirmed here; see the comment on `DROUGHT_ZONES`.
    -->
    <p class="mt-1 text-xs text-slate-500">
      Each stage is Kenoza Lake's deficit from its own average reservoir capacity for the day of
      year —
      <a
        class="underline decoration-slate-300 hover:decoration-slate-900"
        href={Router.cityPage(ORDINANCE_SOURCE.path)}
        target="_blank"
        rel="external noopener noreferrer"
      >
        confirmed for Emergency by ordinance<span class="sr-only">, PDF, opens in a new tab</span>
      </a>.
    </p>
  </div>

  <article class="prose mt-10 max-w-none prose-slate">
    <section>
      <h3>Why now</h3>
      <p>
        The Water Department's own explanation is reduced rainfall, not increased demand. NOAA's
        statewide precipitation record backs that: Massachusetts has had
        {rainfallInches.format(currentRainfall.inches)} inches of rain from January through August {CURRENT_RAINFALL_YEAR},
        {rainfallInches.format(rainfallDeficit)} inches below the 1901–2000 average — the
        {ordinal(CURRENT_RAINFALL_RANK)}-driest such stretch in the {RAINFALL_RECORD_YEARS} years NOAA
        has measured it. The bars below are the same stretch for each of the last fifteen years, so this
        year reads against recent memory rather than against one number alone.
      </p>
      <RainfallChart />
    </section>

    <section class="mt-10">
      <h3>Who uses the water</h3>
      <p>
        Haverhill produces an average of {AVERAGE_PRODUCTION_MGD} million gallons of treated drinking
        water a day. Typically 68% of that is residential use — the rest is commercial, industrial, and
        every other non-residential draw on the same system.
      </p>
      <BudgetStack rows={[{ label: "Citywide Water Use", parts: USE_SPLIT_MGD }]} format={mgd} />
    </section>

    <section class="mt-10">
      <h3>What's restricted, and what isn't</h3>
      <p>
        Golf courses, plant nurseries, and a handful of other uses are exempt from the drought
        restrictions; most outdoor watering is prohibited outright; a narrow band — newly planted
        lawns, hand-held hoses, drip irrigation — is allowed only before 7 a.m. or after 7 p.m.
        Chapter 250 of the City Code sets all of it out use by use:
      </p>
      <div class="not-prose overflow-x-auto">
        <BudgetTable table={RESTRICTED_USES} />
      </div>
    </section>

    <section class="mt-10">
      <h3>How your household compares</h3>
      <p>
        The city's Water Management Act permit sets a target for residential use: no more than 65
        gallons per person per day, citywide. Haverhill has stayed under that goal every year since
        2009. A water bill states usage in gallons over a billing period — enter it below to see how
        a household compares.
      </p>
      <WaterCalculator />
    </section>
  </article>

  <!--
    Where every figure above came from, the same job the calendar's own
    Sources list does — except hand-kept rather than derived from scrape
    metadata, since nothing here is scraped. See $lib/water.
  -->
  <footer class="mt-12 border-t border-slate-200 pt-4 text-xs text-slate-500">
    <section aria-label="Sources" class="space-y-1">
      <p class="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span class="font-semibold text-slate-700">Sources</span>
        {#each SOURCES as source, at (source.path)}
          {#if at}<span class="text-slate-300" aria-hidden="true">&middot;</span>{/if}
          <a
            class="underline decoration-slate-300 hover:decoration-slate-900"
            href={Router.cityPage(source.path)}
            target="_blank"
            rel="external noopener noreferrer"
          >
            {source.label}<span class="sr-only">, opens in a new tab</span>
          </a>
          <span>(accessed {source.accessed})</span>
        {/each}
        <span class="text-slate-300" aria-hidden="true">&middot;</span>
        <a
          class="underline decoration-slate-300 hover:decoration-slate-900"
          href={Router.meeting(DROUGHT_MEETING)}
        >
          City Council, Drought Emergency Update<span class="sr-only">, opens in a new tab</span>
        </a>
        <span>(September 15, 2026)</span>
        <span class="text-slate-300" aria-hidden="true">&middot;</span>
        <a
          class="underline decoration-slate-300 hover:decoration-slate-900"
          href={Router.cityPage(ORDINANCE_SOURCE.path)}
          target="_blank"
          rel="external noopener noreferrer"
        >
          {ORDINANCE_SOURCE.label}<span class="sr-only">, opens in a new tab</span>
        </a>
        <span>(accessed {ORDINANCE_SOURCE.accessed})</span>
        <span class="text-slate-300" aria-hidden="true">&middot;</span>
        <a
          class="underline decoration-slate-300 hover:decoration-slate-900"
          href={NOAA_SOURCE.url}
          target="_blank"
          rel="external noopener noreferrer"
        >
          {NOAA_SOURCE.label}<span class="sr-only">, opens in a new tab</span>
        </a>
        <span>(accessed {NOAA_SOURCE.accessed})</span>
      </p>
    </section>
  </footer>
</div>
