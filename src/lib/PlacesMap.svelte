<!--
  Several places named in one document, on one map, each pin labelled.

  `AddressMap` is the single place: one address under the paragraph that
  states it, drawn as OpenStreetMap's own embed, which a reader can drag and
  zoom where they stand. An agenda item naming two places got two of those,
  one under the other, and two maps of one city is the one arrangement that
  cannot answer the question two places raise -- where they are in relation to
  each other, which is a mile apart across the river in the case this was
  written for. OpenStreetMap's embed takes a single marker, so a map of
  several is drawn here instead, the way `PrecinctMap` draws one: an SVG over
  OpenStreetMap's raster tiles, framed at build time by `$lib/map`, with the
  reader's browser fetching the tiles.

  The frame is whatever box holds every place, so the map says how far apart
  they are by how far apart they are drawn. Each pin carries its own short
  label, because a pin a reader has to match against a caption is a legend,
  and a legend for two pins is one more thing to read than the map is worth.

  `not-prose`: a picture, not a reading column, the same as `AddressMap`.
-->
<script lang="ts">
  import { Router } from "$lib/router"
  import { boundsOf, frame, project, tiles, type LonLat } from "$lib/map"

  interface Place {
    /** The place as the document names it, which is the link's text. */
    name: string
    /** What is drawn beside its pin, where the full name is too long for one. */
    label?: string
    lat: number
    lon: number
  }

  let {
    title,
    places,
    width = 576,
    height = 360,
    pad = 40,
  }: {
    /** What the map shows, as one phrase: the figure's accessible name. */
    title: string
    places: Place[]
    /** The size it is laid out for, which picks the zoom; it scales to its container. */
    width?: number
    height?: number
    /** Room around the outermost pins, in pixels, for their labels. */
    pad?: number
  } = $props()

  const points = $derived(places.map((p): LonLat => [p.lon, p.lat]))
  const f = $derived(frame(boundsOf([], points), width, height, pad))

  // Text and pins are sized to the frame rather than in pixels, since the SVG
  // scales: a fixed 12 would be unreadable on a phone and shouting on a
  // desktop. `PrecinctMap` sizes its own the same way.
  const unit = $derived(f.width / 36)

  /**
   * Where a pin's label sits: outside the pin, and on whichever side of it
   * has more of the frame left, so a label never runs off the edge it is
   * nearest.
   */
  const pins = $derived(
    places.map((place) => {
      const [x, y] = project([place.lon, place.lat], f.z)
      const left = x > f.x + f.width / 2
      return { place, x, y, left, text: place.label ?? place.name }
    }),
  )
</script>

<figure class="not-prose my-4 max-w-xl">
  <svg
    viewBox="{f.x} {f.y} {f.width} {f.height}"
    class="h-auto w-full border border-slate-300 bg-slate-100"
    role="img"
    aria-label={title}
  >
    <g aria-hidden="true">
      {#each tiles(f) as t (`${t.z}/${t.x}/${t.y}`)}
        <image href={Router.osmTile(t.z, t.x, t.y)} x={t.left} y={t.top} width="256" height="256" />
      {/each}
    </g>

    <!-- The pins are named in the caption below, each a link to the place on
         OpenStreetMap, so a reader who never sees the picture has the places
         and not a drawing of them. The labels here repeat those names and are
         hidden from a screen reader for that reason. -->
    {#each pins as pin (pin.place.name)}
      <g class="pin">
        <circle cx={pin.x} cy={pin.y} r={unit / 2.2} stroke-width={unit / 6} />
        <text
          x={pin.left ? pin.x - unit : pin.x + unit}
          y={pin.y}
          text-anchor={pin.left ? "end" : "start"}
          dominant-baseline="central"
          font-size={unit}
          aria-hidden="true">{pin.text}</text
        >
      </g>
    {/each}
  </svg>
  <figcaption class="mt-1 text-xs text-slate-500">
    {#each places as place, i (place.name)}{i > 0 ? ", " : ""}<a
        class="underline hover:text-slate-900"
        href={Router.osmView(place.lat, place.lon)}
        target="_blank"
        rel="external noopener noreferrer"
        >{place.name}<span class="sr-only">, opens in a new tab</span></a
      >{/each}. Street map &copy;
    <a
      class="underline hover:text-slate-900"
      href={Router.osmCopyright()}
      target="_blank"
      rel="external noopener noreferrer">OpenStreetMap contributors</a
    >.
  </figcaption>
</figure>

<style>
  .pin circle {
    fill: #dc2626;
    stroke: white;
  }
  /* The label is read over whatever the street map has underneath it, so it
     carries its own white outline, as `PrecinctMap`'s do. */
  .pin text {
    fill: #0f172a;
    font-weight: 600;
    paint-order: stroke;
    stroke: white;
    stroke-width: 3px;
  }
</style>
