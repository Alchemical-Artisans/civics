/**
 * The arithmetic behind `PrecinctMap`: where a longitude and latitude land on
 * OpenStreetMap's tiles, which zoom fits a given box, which tiles cover it, and
 * where inside a shape its label can go.
 *
 * A map here is an SVG drawn at build time, not a map library run in the
 * reader's browser. The shapes are links -- a precinct opens its own page --
 * and an SVG `<a>` is a link before anything hydrates, for a keyboard and a
 * screen reader as much as a mouse, the bargain the bar's own menu makes. The
 * cost is a map that does not pan or zoom; it does not need to, since every
 * map on the site is of one city or one part of it, framed in advance.
 *
 * The street map underneath is OpenStreetMap's own raster tiles, laid into the
 * SVG as images in the same Web Mercator pixel grid the tiles are cut on --
 * which is why the projection is done here rather than borrowed: a shape drawn
 * in any other projection would sit beside the street it follows rather than
 * on it. The reader's browser fetches the tiles, as it already does for the
 * OpenStreetMap embed `AddressMap` shows, so the build stays offline.
 *
 * Kept outside the component, the way `calendar.ts` keeps its date helpers, so
 * all of it is tested without rendering anything.
 */

/** `[lon, lat]`, the order GeoJSON and MassGIS give coordinates in. */
export type LonLat = [number, number]

/** `[minLon, minLat, maxLon, maxLat]`. */
export type Bounds = [number, number, number, number]

/** GeoJSON MultiPolygon coordinates. */
export type Shape = number[][][][]

const TILE = 256

/**
 * Web Mercator: a longitude and latitude to pixels at zoom `z`, measured from
 * the top-left corner of the world -- the grid OpenStreetMap's tiles are cut
 * on, 256 pixels to a tile and `2^z` tiles to a side.
 */
export function project([lon, lat]: LonLat, z: number): [number, number] {
  const scale = TILE * 2 ** z
  const x = ((lon + 180) / 360) * scale
  const sin = Math.sin((lat * Math.PI) / 180)
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale
  return [x, y]
}

/** The box around every point of every shape given. */
export function boundsOf(shapes: Shape[], points: LonLat[] = []): Bounds {
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity]
  const take = ([x, y]: number[]) => {
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  }
  for (const shape of shapes)
    for (const polygon of shape) for (const ring of polygon) ring.forEach(take)
  points.forEach(take)
  return [minX, minY, maxX, maxY]
}

/** A framed map: the zoom its tiles are drawn at and the pixel box it shows at that zoom. */
export interface Frame {
  z: number
  x: number
  y: number
  width: number
  height: number
}

/**
 * The closest zoom at which `bounds` fits inside `width` by `height` pixels,
 * and the box it frames, padded by `pad` pixels on every side.
 *
 * `width` and `height` are the size the map is laid out at, not the size it is
 * drawn at -- the SVG scales to its container -- so they decide how much detail
 * a tile carries. Too far in and a phone fetches a hundred tiles to show a
 * blur; too far out and the street names are unreadable on a desktop. Zoom is
 * capped at 17, past which a precinct of three blocks would be three tiles of
 * rooftops.
 */
export function frame(bounds: Bounds, width: number, height: number, pad = 16): Frame {
  let z = 17
  for (; z > 0; z--) {
    const [x0, y1] = project([bounds[0], bounds[1]], z)
    const [x1, y0] = project([bounds[2], bounds[3]], z)
    if (x1 - x0 + 2 * pad <= width && y1 - y0 + 2 * pad <= height) break
  }
  const [x0, y1] = project([bounds[0], bounds[1]], z)
  const [x1, y0] = project([bounds[2], bounds[3]], z)
  return {
    z,
    x: Math.floor(x0 - pad),
    y: Math.floor(y0 - pad),
    width: Math.ceil(x1 - x0 + 2 * pad),
    height: Math.ceil(y1 - y0 + 2 * pad),
  }
}

/** Every tile a frame shows any part of, with where it sits in the frame's pixels. */
export function tiles(f: Frame): { z: number; x: number; y: number; left: number; top: number }[] {
  const out = []
  const last = 2 ** f.z - 1
  for (let ty = Math.floor(f.y / TILE); ty * TILE < f.y + f.height; ty++) {
    for (let tx = Math.floor(f.x / TILE); tx * TILE < f.x + f.width; tx++) {
      if (tx < 0 || ty < 0 || tx > last || ty > last) continue
      out.push({ z: f.z, x: tx, y: ty, left: tx * TILE, top: ty * TILE })
    }
  }
  return out
}

/**
 * A shape as an SVG path in the frame's pixel coordinates, to one decimal --
 * finer than a pixel and no more, since every digit is served in the HTML.
 * Drawn with `fill-rule="evenodd"`, which is what makes a hole a hole.
 */
export function pathOf(shape: Shape, z: number): string {
  const r = (n: number) => Math.round(n * 10) / 10
  return shape
    .flatMap((polygon) =>
      polygon.map((ring) => {
        const [first, ...rest] = ring.map((p) => project(p as LonLat, z))
        return (
          `M${r(first[0])} ${r(first[1])}` + rest.map(([x, y]) => `L${r(x)} ${r(y)}`).join("") + "Z"
        )
      }),
    )
    .join("")
}

/** Ray casting against every ring of a shape, holes included. */
export function contains(shape: Shape, [x, y]: LonLat): boolean {
  let inside = false
  for (const polygon of shape) {
    for (const ring of polygon) {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i]
        const [xj, yj] = ring[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
      }
    }
  }
  return inside
}

function distanceToEdges(shape: Shape, [x, y]: LonLat): number {
  let best = Infinity
  for (const polygon of shape) {
    for (const ring of polygon) {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [ax, ay] = ring[j]
        const [bx, by] = ring[i]
        const dx = bx - ax
        const dy = by - ay
        const len = dx * dx + dy * dy
        const t = len ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len)) : 0
        best = Math.min(best, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)))
      }
    }
  }
  return best
}

/**
 * Somewhere inside a shape with room around it, for its label.
 *
 * Not the centroid: a precinct following a river bend has its centroid in the
 * river, or in the next precinct over, and a label there names the wrong
 * shape. This takes the point of a grid over the shape that lies inside it and
 * furthest from any edge -- polylabel's idea without its refinement, which
 * matters at a cartographer's precision and not at a label's.
 */
export function labelPoint(shape: Shape, steps = 24): LonLat {
  const [minX, minY, maxX, maxY] = boundsOf([shape])
  let best: LonLat = [(minX + maxX) / 2, (minY + maxY) / 2]
  let room = -1
  for (let i = 0; i <= steps; i++) {
    for (let j = 0; j <= steps; j++) {
      const p: LonLat = [minX + ((maxX - minX) * i) / steps, minY + ((maxY - minY) * j) / steps]
      if (!contains(shape, p)) continue
      const d = distanceToEdges(shape, p)
      if (d > room) {
        room = d
        best = p
      }
    }
  }
  return best
}
