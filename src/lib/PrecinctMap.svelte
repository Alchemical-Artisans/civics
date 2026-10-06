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

  `interactive` is for a map that has a pane to itself: it fills the height its
  parent gives it and, once the page has hydrated, pans (drag), zooms (wheel,
  pinch, the buttons) and fetches finer tiles as it goes in. Until then it is
  the same static SVG as any other, framed in advance, so the links and the
  picture are there with no script.
-->
<script lang="ts">
  import { onMount, untrack } from "svelte"
  import { SvelteMap } from "svelte/reactivity"
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
    interactive = false,
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
    /** Fill the parent's height and, once hydrated, pan and zoom. */
    interactive?: boolean
  } = $props()

  const f = $derived(frame(bounds, width, height))

  // -- Pan and zoom. ---------------------------------------------------------
  // The view is a centre in the frame's pixels and `s`, screen pixels per
  // frame pixel. Shapes stay drawn once, at the frame's zoom; only the viewBox
  // moves, and the tiles are re-chosen at whatever zoom `s` has reached.
  const MAX_TILE_ZOOM = 19

  let live = $state(false)
  onMount(() => (live = interactive))

  let box = $state({ w: 0, h: 0 })
  let view = $state<{ cx: number; cy: number; s: number } | null>(null)
  let svg = $state<SVGSVGElement>()

  const fit = $derived(box.w && box.h ? Math.min(box.w / f.width, box.h / f.height) : 1)
  const home = $derived({ cx: f.x + f.width / 2, cy: f.y + f.height / 2, s: fit })
  const v = $derived(view ?? home)
  const minS = $derived(fit / 2)
  const maxS = $derived(2 ** (MAX_TILE_ZOOM - f.z))

  // A new frame -- another precinct -- starts from its own fit.
  $effect(() => {
    void f
    untrack(() => (view = null))
  })

  const shown = $derived(
    live && box.w
      ? {
          x: v.cx - box.w / (2 * v.s),
          y: v.cy - box.h / (2 * v.s),
          width: box.w / v.s,
          height: box.h / v.s,
        }
      : f,
  )
  const tileZoom = $derived(
    live ? Math.min(MAX_TILE_ZOOM, Math.max(1, Math.round(f.z + Math.log2(v.s)))) : f.z,
  )
  const tileScale = $derived(2 ** (tileZoom - f.z))
  const tileList = $derived(
    tiles({
      z: tileZoom,
      x: shown.x * tileScale,
      y: shown.y * tileScale,
      width: shown.width * tileScale,
      height: shown.height * tileScale,
    }),
  )

  // Text and pins are sized to the frame rather than in pixels, since a static
  // SVG scales: a fixed 12 would be unreadable on a phone and shouting on a
  // desktop. A live map is drawn at its own pixel size, so there it is pixels.
  const unit = $derived(live ? 14 / v.s : f.width / 64)

  const zoomAt = (px: number, py: number, factor: number) => {
    const s = Math.min(maxS, Math.max(minS, v.s * factor))
    const wx = v.cx - box.w / (2 * v.s) + px / v.s
    const wy = v.cy - box.h / (2 * v.s) + py / v.s
    view = { cx: wx - px / s + box.w / (2 * s), cy: wy - py / s + box.h / (2 * s), s }
  }
  const zoomBy = (factor: number) => zoomAt(box.w / 2, box.h / 2, factor)

  // The wheel needs `preventDefault`, which a passive listener may not call.
  $effect(() => {
    if (!live || !svg) return
    const el = svg
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const r = el.getBoundingClientRect()
      zoomAt(event.clientX - r.left, event.clientY - r.top, Math.exp(-event.deltaY * 0.0015))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  })

  const pointers = new SvelteMap<number, { x: number; y: number }>()
  let travelled = 0
  let dragged = false
  let pinch = 0

  const spread = () => {
    const [a, b] = [...pointers.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }
  const down = (event: PointerEvent) => {
    if (!live) return
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.size === 1) travelled = 0
    if (pointers.size === 2) pinch = spread()
  }
  const move = (event: PointerEvent) => {
    const before = pointers.get(event.pointerId)
    if (!live || !before || !svg) return
    const now = { x: event.clientX, y: event.clientY }
    pointers.set(event.pointerId, now)
    if (pointers.size === 1) {
      const dx = now.x - before.x
      const dy = now.y - before.y
      travelled += Math.abs(dx) + Math.abs(dy)
      // Below a few pixels it is still a click on a precinct, not a drag.
      if (travelled > 4) {
        if (!dragged) svg.setPointerCapture(event.pointerId)
        dragged = true
        view = { ...v, cx: v.cx - dx / v.s, cy: v.cy - dy / v.s }
      }
    } else if (pointers.size === 2) {
      const r = svg.getBoundingClientRect()
      const [a, b] = [...pointers.values()]
      const next = spread()
      if (pinch) zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, next / pinch)
      pinch = next
      dragged = true
    }
  }
  const up = (event: PointerEvent) => {
    pointers.delete(event.pointerId)
    if (pointers.size < 2) pinch = 0
    // The click that ends a drag arrives after this; let it be swallowed first.
    if (!pointers.size) setTimeout(() => (dragged = false))
  }
  const swallowDragClick = (event: MouseEvent) => {
    if (!dragged) return
    event.preventDefault()
    event.stopPropagation()
  }
</script>

<figure class="not-prose my-4 {interactive ? 'flex h-full min-h-80 flex-col' : ''}">
  <div
    class="relative {interactive ? 'min-h-0 flex-1' : ''}"
    bind:clientWidth={box.w}
    bind:clientHeight={box.h}
  >
    <svg
      bind:this={svg}
      viewBox="{shown.x} {shown.y} {shown.width} {shown.height}"
      class="border border-slate-300 bg-slate-100 {interactive
        ? 'absolute inset-0 h-full w-full'
        : 'h-auto w-full'}"
      class:live
      style:touch-action={live ? "none" : undefined}
      role="group"
      aria-label={title}
      onpointerdown={down}
      onpointermove={move}
      onpointerup={up}
      onpointercancel={up}
      onclickcapture={swallowDragClick}
    >
      <g class="tiles" aria-hidden="true" transform="scale({1 / tileScale})">
        {#each tileList as t (`${t.z}/${t.x}/${t.y}`)}
          <image
            href={Router.osmTile(t.z, t.x, t.y)}
            x={t.left}
            y={t.top}
            width="256"
            height="256"
          />
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
        <path
          class="ward-line"
          d={pathOf(outline.shape, f.z)}
          fill="none"
          stroke-width={live ? 2.5 : unit / 4}
        />
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
    {#if live}
      <div
        class="absolute top-2 right-2 flex flex-col overflow-hidden rounded border border-slate-300 bg-white shadow-sm"
      >
        <button
          type="button"
          class="h-8 w-8 cursor-pointer text-lg leading-none text-slate-700 hover:bg-slate-100"
          aria-label="Zoom in"
          onclick={() => zoomBy(1.6)}>+</button
        >
        <button
          type="button"
          class="h-8 w-8 cursor-pointer border-t border-slate-300 text-lg leading-none text-slate-700 hover:bg-slate-100"
          aria-label="Zoom out"
          onclick={() => zoomBy(1 / 1.6)}>&minus;</button
        >
      </div>
    {/if}
  </div>
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
  .live path {
    vector-effect: non-scaling-stroke;
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
