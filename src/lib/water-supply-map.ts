// The waters Haverhill's public system draws from, and the land that drains to
// each, as the areas a `ShapeMap` draws. Shared by the drought guide and the
// front page's drought card, so the two maps cannot disagree.
//
// See scripts/lib/water-bodies.mjs for where the supply list, the shorelines
// and the watersheds each come from, and for why the list is the Water
// Department's own three rather than MassDEP's four.
import { COLOURS } from "$lib/chart-colours"
import waterBodies from "$lib/data/water-bodies.json"

// A hue per source rather than one fill for the whole system, which is what
// this drew before the watersheds were on it. With only the lakes there was
// one question -- where is the water -- and one colour answered it. With
// the watersheds there is a second: which ground feeds which lake. That
// cannot be read off three shapes in a single colour, so each source keeps a
// hue across both of its shapes, the watershed pale and the water itself
// solid.
const SOURCE_HUES = [COLOURS[0], COLOURS[2], COLOURS[3], COLOURS[4]]
const hueFor = (i: number) => SOURCE_HUES[i % SOURCE_HUES.length]

// Spelled rather than numeric: "names 3 surface sources" reads as a count in
// a table and this is a sentence. Derived rather than written into the prose
// because the written version went stale the moment a source came off the
// map -- the paragraph said "four" while the map drew three.
export const COUNT_WORD = ["no", "one", "two", "three", "four", "five", "six"]

/**
 * MassDEP writes a source's name in capitals and abbreviates one of them; a
 * map label should do neither. No `\b` after the full stop in `res\.` -- a
 * word boundary needs a word character on the far side, and that
 * abbreviation ends the string, so the anchored version silently never
 * matched and the map read "Millvale Res."
 */
function titleCase(name: string): string {
  return name
    .toLowerCase()
    .replace(/\bres\./, "reservoir")
    .replace(/\b[a-z]/g, (c) => c.toUpperCase())
}

// Watersheds first so the water sits on top of the ground that feeds it;
// `areas` draws in order.
export const supplyAreas = [
  ...waterBodies.bodies
    .filter((body) => body.watershed)
    .map((body, i) => ({
      id: `${body.sourceId}-watershed`,
      shape: body.watershed!.shape,
      name: `${titleCase(body.name)} watershed`,
      fill: hueFor(i),
      // Against the greyed street map 0.18 washed out entirely -- Crystal's
      // watershed was invisible at the size this draws. The water itself
      // stays darker, so the pairing still reads as ground and the lake it
      // feeds.
      opacity: 0.34,
    })),
  ...waterBodies.bodies.map((body, i) => ({
    id: body.sourceId,
    shape: body.shape,
    name: titleCase(body.name),
    fill: hueFor(i),
    opacity: 0.85,
    // No standing label: `hoverLabel` names one at a time instead, on hover
    // or focus, which is legible at any size and cannot collide. The name and
    // nothing else -- a figure is a different question and wants a sentence.
  })),
]
