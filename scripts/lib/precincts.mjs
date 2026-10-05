/**
 * The city's wards and precincts, as shapes, and which of the Commonwealth's
 * districts each one votes in.
 *
 * Nothing the city publishes draws a precinct. The warrant names twenty-one of
 * them and a polling place for each; where a precinct's edges run is MassGIS's
 * "Wards and Precincts 2022" layer, the boundaries the Secretary of the
 * Commonwealth certified after the 2020 census and the ones every election
 * since has used. MassGIS also publishes the sub-precincts -- the `A` halves
 * the warrant prints as "Precinct 2/2A" -- which exist because a legislative
 * district line cuts through a precinct, and that is the whole reason a
 * precinct page has to say which ballot it is describing.
 *
 * Which districts a precinct votes in is not a field on either layer for most
 * precincts (a sub-precinct records only the one district it was carved out
 * for), so it is worked out here: the share of the precinct's area lying in
 * each district, from the 2021 redistricting's own polygons. A precinct is
 * drawn inside one district by design, so anything short of nearly all of it
 * in one is a sign the layers have stopped agreeing, and the run stops rather
 * than writing a guess. The slivers it does find -- a tenth of a percent here
 * and there -- are the two layers digitised to slightly different lines, not
 * voters in a second district.
 *
 * Polygon arithmetic is `polygon-clipping`, and the only things done with it
 * are a union (a ward is its precincts), a difference (a precinct less its `A`
 * half) and intersections measured for area. Coordinates stay in degrees
 * throughout: an area here is only ever compared with another area at the same
 * latitude, so the ratio is what matters and degrees give it exactly enough.
 */
import polygonClipping from "polygon-clipping"

/** Every polygon here is a MultiPolygon: an array of polygons, each an array of rings. */
export function asMulti(geometry) {
  if (geometry.type === "Polygon") return [geometry.coordinates]
  if (geometry.type === "MultiPolygon") return geometry.coordinates
  throw new Error(`Not a polygon: ${geometry.type}`)
}

/** Shoelace area of one ring, unsigned, in square degrees. */
function ringArea(ring) {
  let sum = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1])
  }
  return Math.abs(sum / 2)
}

/** A MultiPolygon's area: each polygon's outer ring less its holes. */
export function area(multi) {
  let total = 0
  for (const [outer, ...holes] of multi) {
    total += ringArea(outer) - holes.reduce((sum, hole) => sum + ringArea(hole), 0)
  }
  return total
}

export const union = (...multis) => polygonClipping.union(...multis)
export const difference = (multi, ...others) =>
  others.length ? polygonClipping.difference(multi, ...others) : multi
const intersection = (a, b) => polygonClipping.intersection(a, b)

/**
 * The district holding most of `shape`, and how much of it.
 *
 * `districts` is `[{ name, shape }]`. Returns `{ name, share }` for the
 * largest, so the caller decides how much short of the whole it will accept.
 */
export function districtOf(shape, districts) {
  const whole = area(shape)
  let best = { name: null, share: 0 }
  for (const district of districts) {
    const share = area(intersection(shape, district.shape)) / whole
    if (share > best.share) best = { name: district.name, share }
  }
  return best
}

/** Perpendicular distance from `p` to the segment `a`-`b`. */
function distanceToSegment(p, a, b) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const length = dx * dx + dy * dy
  const t = length
    ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length))
    : 0
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))
}

/**
 * Douglas-Peucker on one closed ring, keeping its first and last point.
 *
 * MassGIS digitises a boundary to the centimetre, which is a vertex every few
 * feet along a river bank; the map draws a whole city in a few hundred pixels,
 * where anything finer than a couple of metres is under a pixel even zoomed to
 * one precinct. Neighbouring precincts are simplified independently, so their
 * shared edge can come out a metre apart -- invisible at any zoom the map
 * draws, and the price of not building a topology for a picture.
 */
export function simplifyRing(ring, tolerance) {
  if (ring.length <= 4) return ring
  const keep = new Uint8Array(ring.length)
  keep[0] = keep[ring.length - 1] = 1
  const stack = [[0, ring.length - 1]]
  while (stack.length) {
    const [first, last] = stack.pop()
    let worst = 0
    let index = -1
    for (let i = first + 1; i < last; i++) {
      const d = distanceToSegment(ring[i], ring[first], ring[last])
      if (d > worst) {
        worst = d
        index = i
      }
    }
    if (worst > tolerance) {
      keep[index] = 1
      stack.push([first, index], [index, last])
    }
  }
  const out = ring.filter((_, i) => keep[i])
  // A ring simplified below a triangle is no longer a shape; keep the original
  // rather than drop a sliver somebody might be standing in.
  return out.length >= 4 ? out : ring
}

/** Simplify and round a MultiPolygon for the committed file. */
export function compact(multi, { tolerance, digits }) {
  const round = (n) => Number(n.toFixed(digits))
  return multi.map((polygon) =>
    polygon.map((ring) => simplifyRing(ring, tolerance).map(([x, y]) => [round(x), round(y)])),
  )
}
