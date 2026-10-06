<script lang="ts">
  import PrecinctMap from "$lib/PrecinctMap.svelte"
  import { COLOURS } from "$lib/chart-colours"
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
  } from "../election"

  const bounds = boundsOf(WARDS.map((w) => w.shape))

  // A colour per ward, so the precincts read as seven groups before a reader
  // has found a single number on the map. The chart sequence, since it is the
  // one set of colours on the site already checked for telling apart.
  //
  // Not simply the first seven: the seventh is a second blue, and Ward 7 shares
  // a long border with Ward 1's. Ochre is the sequence's furthest from all six
  // of its neighbours' colours.
  const WARD_COLOURS = [0, 1, 2, 3, 4, 5, 11].map((i) => COLOURS[i])
  const wardColour = (ward: number) => WARD_COLOURS[ward - 1]

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

<PrecinctMap
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
