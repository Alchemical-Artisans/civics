<!--
  A map of shapes over a street map: Haverhill's precincts, each a link to its
  own page, the wards outlined around them, and the polling places as pins.

  An SVG drawn at build time over OpenStreetMap's tiles; see `$lib/map` for why
  it is not a map library, and for the arithmetic. The short of it is that a
  shape here is an `<a>`, so the map works as a set of links before anything
  hydrates and for a reader who never sees it -- each link is named in words,
  and every page that draws one also lists what it draws in a table, so the
  map is a way into the page rather than the only one.

  `not-prose`: a picture, not a reading column, the same as `AddressMap`.
-->
<script lang="ts">
  import { Router } from "$lib/router"
  import { frame, labelPoint, pathOf, project, tiles, type Bounds, type Shape } from "$lib/map"

  interface Area {
    id: string
    shape: Shape
    /** Its accessible name, and the tooltip on hover. */
    name: string
    href?: string
    /**
     * Called when the shape is clicked, for one that selects something on the
     * page rather than going to another. Ignored where there is an `href`.
     */
    onselect?: () => void
    /** Drawn over the street map in this colour. */
    fill: string
    /** 0 to 1; the shapes a page is about are filled more strongly than their neighbours. */
    opacity: number
    /** The short text drawn inside it, if any. */
    label?: string
  }

  interface Marker {
    lon: number
    lat: number
    name: string
  }

  let {
    title,
    bounds,
    areas,
    outlines = [],
    markers = [],
    width = 800,
    height = 560,
    caption,
  }: {
    /** What the map shows, as one phrase: the figure's accessible name. */
    title: string
    bounds: Bounds
    areas: Area[]
    /** Heavier lines drawn over the areas -- wards around precincts. */
    outlines?: { shape: Shape; name: string }[]
    markers?: Marker[]
    /** The size it is laid out for, which picks the zoom; it scales to its container. */
    width?: number
    height?: number
    /** Credit for the shapes, which the tiles' own credit does not cover. */
    caption: string
  } = $props()

  const f = $derived(frame(bounds, width, height))
  // Text and pins are sized to the frame rather than in pixels, since the SVG
  // scales: a fixed 12 would be unreadable on a phone and shouting on a desktop.
  const unit = $derived(f.width / 64)
</script>

<figure class="not-prose my-4">
  <svg
    viewBox="{f.x} {f.y} {f.width} {f.height}"
    class="h-auto w-full border border-slate-300 bg-slate-100"
    role="group"
    aria-label={title}
  >
    <g class="tiles" aria-hidden="true">
      {#each tiles(f) as t (`${t.x}/${t.y}`)}
        <image href={Router.osmTile(t.z, t.x, t.y)} x={t.left} y={t.top} width="256" height="256" />
      {/each}
    </g>

    {#each areas as area (area.id)}
      {#if area.href}
        <a href={area.href} aria-label={area.name} class="area">
          <title>{area.name}</title>
          <path
            d={pathOf(area.shape, f.z)}
            fill={area.fill}
            fill-opacity={area.opacity}
            fill-rule="evenodd"
          />
        </a>
      {:else}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <path
          class="area"
          class:selectable={area.onselect}
          role={area.onselect ? "button" : undefined}
          tabindex={area.onselect ? 0 : undefined}
          aria-label={area.onselect ? area.name : undefined}
          d={pathOf(area.shape, f.z)}
          fill={area.fill}
          fill-opacity={area.opacity}
          fill-rule="evenodd"
          onclick={area.onselect}
          onkeydown={(event) => {
            if (area.onselect && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault()
              area.onselect()
            }
          }}
        >
          <title>{area.name}</title>
        </path>
      {/if}
    {/each}

    {#each outlines as outline (outline.name)}
      <path class="ward-line" d={pathOf(outline.shape, f.z)} fill="none" stroke-width={unit / 4} />
    {/each}

    <!-- Labels are the link's own name in shorter form, so they are hidden
         from a screen reader, which already has the long one; and they let a
         click through to the shape underneath. -->
    <g aria-hidden="true" class="labels" font-size={unit}>
      {#each areas.filter((a) => a.label) as area (area.id)}
        {@const [x, y] = project(labelPoint(area.shape), f.z)}
        <text {x} {y} text-anchor="middle" dominant-baseline="central">{area.label}</text>
      {/each}
    </g>

    {#each markers as marker (`${marker.lon},${marker.lat}`)}
      {@const [x, y] = project([marker.lon, marker.lat], f.z)}
      <g class="marker" role="img" aria-label={marker.name}>
        <title>{marker.name}</title>
        <circle cx={x} cy={y} r={unit / 2.2} stroke-width={unit / 6} />
      </g>
    {/each}
  </svg>
  <figcaption class="mt-1 text-xs text-slate-500">
    {caption} Street map &copy;
    <a
      class="underline hover:text-slate-900"
      href={Router.osmCopyright()}
      target="_blank"
      rel="external noopener noreferrer">OpenStreetMap contributors</a
    >.
  </figcaption>
</figure>

<style>
  /* The street map is context for the shapes, not the subject, so it is
     greyed back: in full colour its parks and main roads compete with the
     precincts drawn over them. */
  .tiles {
    filter: grayscale(1);
    opacity: 0.6;
  }
  .selectable {
    cursor: pointer;
  }
  .selectable:hover,
  .selectable:focus-visible {
    fill-opacity: 0.85;
  }
  .selectable:focus-visible {
    outline: none;
    stroke: #0f172a;
    stroke-width: 3;
  }
  .area,
  .area path {
    stroke: white;
    stroke-width: 1.5;
    transition: fill-opacity 120ms;
  }
  a.area:hover path,
  a.area:focus-visible path {
    fill-opacity: 0.85;
  }
  a.area:focus-visible {
    outline: none;
  }
  a.area:focus-visible path {
    stroke: #0f172a;
    stroke-width: 3;
  }
  .ward-line {
    stroke: #0f172a;
    pointer-events: none;
  }
  .labels text {
    fill: #0f172a;
    font-weight: 600;
    paint-order: stroke;
    stroke: white;
    stroke-width: 3px;
    pointer-events: none;
  }
  .marker circle {
    fill: #dc2626;
    stroke: white;
  }
</style>
