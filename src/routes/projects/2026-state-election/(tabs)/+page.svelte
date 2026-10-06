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
    buildings,
    precinctName,
    wardColour,
  } from "../election"

  const bounds = boundsOf(WARDS.map((w) => w.shape))

  // One pin per building, named for every precinct voting there.
  const markers = buildings().map((places) => ({
    lon: places[0].lon,
    lat: places[0].lat,
    name: `${places[0].name}, ${places[0].address}: ${places.map((p) => p.label).join("; ")}`,
  }))
</script>

<svelte:head>
  <title>{PROJECT.title} - Haverhill</title>
  <meta
    name="description"
    content="Haverhill's {PROJECT.title} on {formatLongDate(
      ELECTION.date,
    )}: every ward, precinct and polling place on a map, and the City Council agenda items that set it up."
  />
</svelte:head>

<!-- The map takes the height of the window, and stays put while the timeline
     beside it is read. -->
<div class="h-[70dvh] lg:sticky lg:top-4 lg:h-[calc(100dvh-2rem)]">
  <PrecinctMap
    interactive
    title="Haverhill's seven wards and twenty-one precincts, with each polling place"
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
    {markers}
    width={1200}
    height={900}
    caption="Ward and precinct lines: {PRECINCT_SOURCE.name}. Polling places: the warrant."
  />
</div>
