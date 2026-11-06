#!/usr/bin/env node
/**
 * Refresh the bodies of water Haverhill's drinking water comes out of.
 *
 * Not a step of `npm run metadata:update`, for the same reason
 * `precincts:update` is not: a reservoir does not move, and MassDEP redraws a
 * protection area about as often as the state redistricts. Run it by hand.
 *
 * Reads MassDEP for which waters are a public supply and USGS's National
 * Hydrography Dataset for their shapes, joins the two by geometry, and writes
 * `src/lib/data/water-bodies.json`. See `scripts/lib/water-bodies.mjs` for why
 * it takes two sources and why the join is geometric.
 */
import path from "node:path"
import { writeDataFile } from "./lib/data-file.mjs"
import { createLog } from "./lib/log.mjs"
import { compact, simplifyRing } from "./lib/precincts.mjs"
import {
  MASSGIS,
  NHD_WATERBODY,
  NOT_DRAWN,
  PWSID,
  WATERSHEDS,
  boundsOfRings,
  coarsenZone,
  isDrawn,
  matchBodies,
  query,
  ringsToMulti,
} from "./lib/water-bodies.mjs"

/** About two metres, and a metre's rounding -- the same as the precinct shapes. */
const COMPACT = { tolerance: 0.00002, digits: 5 }

/** About twenty metres: a watershed is drawn at a tenth the zoom a shoreline is. */
const WATERSHED_COMPACT = { tolerance: 0.0002, digits: 5 }

export const DATA_FILE = path.join(
  import.meta.dirname,
  "..",
  "src",
  "lib",
  "data",
  "water-bodies.json",
)

const log = createLog("water-bodies")
console.log("  reading Haverhill's water supply from MassDEP and the NHD...")

// -- The town outline, so the map is of Haverhill and not of four lakes. ----
const [town] = await query(`${MASSGIS}/Census2020_Towns/FeatureServer/2`, {
  where: "TOWN20 = 'HAVERHILL'",
  outFields: "TOWN20,SQ_MILES,POP2020",
  returnGeometry: "true",
})
if (!town) throw new Error("MassGIS returned no Haverhill town boundary")
const townShape = compact(ringsToMulti(town.geometry.rings), COMPACT)

// -- Which waters are the supply, per MassDEP. -----------------------------
const zones = await query(`${MASSGIS}/ZoneABC/FeatureServer/0`, {
  where: `PWSID = '${PWSID}'`,
  outFields: "SITE_NAME,SOURCE_ID,PWSID,ACRES,SUPPLIER",
  returnGeometry: "true",
})
if (!zones.length) throw new Error(`MassDEP returned no surface sources for PWSID ${PWSID}`)
log.write(`  MassDEP names ${zones.length} surface source(s) for PWSID ${PWSID}:`)

// -- Each source's own shape, from the NHD, matched inside its Zone A. ------
const bodies = []
for (const zone of zones) {
  // Left out on purpose, and said out loud rather than quietly filtered --
  // see NOT_DRAWN for which source and why. Skipped before the NHD query
  // rather than after, since there is no shape to go and fetch for a body
  // nothing will draw.
  if (!isDrawn(zone.attributes.SOURCE_ID)) {
    log.write(
      `    ${zone.attributes.SITE_NAME} (${zone.attributes.SOURCE_ID}): not drawn -- ` +
        NOT_DRAWN[zone.attributes.SOURCE_ID].reason,
    )
    continue
  }

  const geometry = JSON.stringify({
    rings: coarsenZone(zone.geometry.rings, simplifyRing),
    spatialReference: { wkid: 4326 },
  })
  const intersecting = await query(NHD_WATERBODY, {
    geometry,
    geometryType: "esriGeometryPolygon",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "GNIS_NAME,AREASQKM,FTYPE,PERMANENT_IDENTIFIER",
    returnGeometry: "true",
  })

  const matched = matchBodies(zone.attributes, intersecting)
  if (!matched) {
    log.write(`    ${zone.attributes.SITE_NAME}: no reservoir-type body inside its Zone A`)
    continue
  }

  const shape = intersecting.find((f) => f.attributes.PERMANENT_IDENTIFIER === matched.nhdId)
    .geometry.rings

  // The land that drains to this source. A watershed is much larger than the
  // body it feeds -- Millvale's is a hundred times its reservoir -- so it is
  // simplified harder than the shorelines are: at this size on the page the
  // difference is invisible, and the full rings run to tens of thousands of
  // coordinates.
  const [shed] = await query(WATERSHEDS, {
    where: `SOURCE_ID = '${zone.attributes.SOURCE_ID}'`,
    outFields: "SOURCE_ID,SITE_NAME,TYPE,WSHEDACRES,MA_ACRES",
    returnGeometry: "true",
  })
  if (!shed) log.write(`    ${matched.name}: no watershed polygon`)

  bodies.push({
    ...matched,
    shape: compact(ringsToMulti(shape), COMPACT),
    watershed: shed
      ? {
          acres: Math.round(shed.attributes.WSHEDACRES),
          /** Acres inside Massachusetts; the rest is over the New Hampshire line. */
          massachusettsAcres: shed.attributes.MA_ACRES,
          type: shed.attributes.TYPE,
          shape: compact(ringsToMulti(shed.geometry.rings), WATERSHED_COMPACT),
        }
      : null,
  })
  log.write(
    `    ${matched.name} (${matched.sourceId}) -> ${matched.mappedName ?? "unnamed"}, ` +
      `${matched.areaSqKm} km2, ${matched.candidates} reservoir-type candidate(s) in its Zone A` +
      (matched.namesDiffer ? "  [NAMES DIFFER]" : ""),
  )
}

if (!bodies.length) throw new Error("No water bodies matched; nothing written")

const differing = bodies.filter((b) => b.namesDiffer)
if (differing.length) {
  log.write(`\n  ${differing.length} source(s) where MassDEP and the NHD do not agree on the name:`)
  for (const b of differing) log.write(`    MassDEP "${b.name}" is NHD "${b.mappedName}"`)
}

await writeDataFile(DATA_FILE, {
  generatedAt: new Date().toISOString(),
  sources: {
    supply: {
      name: "MassDEP, Surface Water Supply Protection Areas (Zone A)",
      url: "https://www.mass.gov/info-details/massgis-data-massdep-surface-water-supply-protection-areas",
      note: `Which waters are a public supply, for PWSID ${PWSID}.`,
    },
    shapes: {
      name: "USGS, National Hydrography Dataset (Waterbody, large scale)",
      url: "https://www.usgs.gov/national-hydrography/national-hydrography-dataset",
      note: "The outlines. MassGIS publishes nothing finer than a major-waters subset.",
    },
    town: {
      name: "MassGIS, Census 2020 Towns",
      url: "https://www.mass.gov/info-details/massgis-data-2020-us-census-towns",
      note: "Haverhill's own boundary.",
    },
  },
  pwsid: PWSID,
  supplier: zones[0].attributes.SUPPLIER,
  /**
   * Sources MassDEP registers that this file deliberately carries no shape
   * for. Written out so the omission is visible in the data rather than only
   * in the script that made it, and so a reader of the JSON can see that the
   * state's list is longer than the city's.
   */
  notDrawn: zones
    .filter((zone) => !isDrawn(zone.attributes.SOURCE_ID))
    .map((zone) => ({
      name: zone.attributes.SITE_NAME,
      sourceId: zone.attributes.SOURCE_ID,
      zoneAcres: Math.round(zone.attributes.ACRES * 10) / 10,
      reason: NOT_DRAWN[zone.attributes.SOURCE_ID].reason,
    })),
  town: { name: "Haverhill", shape: townShape },
  // The watersheds reach past the town line into New Hampshire, so they set
  // the frame rather than the town does.
  bounds: boundsOfRings([
    townShape,
    ...bodies.map((b) => b.shape),
    ...bodies.filter((b) => b.watershed).map((b) => b.watershed.shape),
  ]),
  bodies: bodies.sort((a, b) => b.areaSqKm - a.areaSqKm),
})

log.write(`\n  wrote ${DATA_FILE}`)
console.log(`  full run detail: ${log.file}`)
