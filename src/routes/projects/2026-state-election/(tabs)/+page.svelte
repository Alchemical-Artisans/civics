<script lang="ts">
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { boundsOf } from "$lib/map"
  import { Router } from "$lib/router"
  import {
    ELECTION,
    PRECINCTS,
    PRECINCT_SOURCE,
    PROJECT,
    WARDS,
    precinctName,
    wardColour,
  } from "../election"

  const bounds = boundsOf(WARDS.map((w) => w.shape))
</script>

<svelte:head>
  <title>{PROJECT.title} - Haverhill</title>
  <meta
    name="description"
    content="Haverhill's {PROJECT.title} on {formatLongDate(
      ELECTION.date,
    )}: every ward and precinct on a map, and the City Council agenda items that set it up."
  />
</svelte:head>

<!-- The map takes whatever height the header and the tabs leave. -->
<div class="h-[70dvh] lg:h-full">
  <PrecinctMap
    interactive
    title="Haverhill's seven wards and twenty-one precincts, "
    {bounds}
    areas={PRECINCTS.map((p) => ({
      id: p.id,
      shape: p.shape,
      name: precinctName(p.id),
      href: Router.precinct(PROJECT.slug, p.id),
      fill: wardColour(p.ward),
      opacity: 0.4,
      label: p.id,
    }))}
    outlines={WARDS.map((w) => ({ shape: w.shape, name: `Ward ${w.ward}` }))}
    width={1200}
    height={900}
    caption="Ward and precinct lines: {PRECINCT_SOURCE.name}."
  />
</div>
