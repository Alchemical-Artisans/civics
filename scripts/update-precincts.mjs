#!/usr/bin/env node
/**
 * Re-read Haverhill's wards and precincts from MassGIS and write
 * `src/lib/data/precincts.json`: each precinct's shape, its sub-precinct where
 * it has one, each ward's outline, and the districts each votes in.
 *
 * Not a step of `metadata:update`. Precinct lines are redrawn once a decade,
 * after a census, and the Commonwealth's districts with them; a run between
 * those is a run that changes nothing. It is here so that the next redraw is a
 * command rather than an archaeology project -- and so the districts a precinct
 * page names are worked out from the Commonwealth's own polygons in a way
 * anyone can repeat, rather than typed in by somebody who looked once.
 *
 * Every request is a plain `GET` against MassGIS's public ArcGIS server, with
 * no key; see `scripts/lib/precincts.mjs` for what is done with the answers.
 */
import path from "node:path"
import { writeDataFile } from "./lib/data-file.mjs"
import { asMulti, compact, difference, districtOf, union } from "./lib/precincts.mjs"

const SERVER = "https://arcgisserver.digital.mass.gov/arcgisserver/rest/services/AGOL"
const TOWN = "HAVERHILL"

/**
 * The layers read, and the field naming each feature. The district layers are
 * the 2021 redistricting's (the `…2021` services, and the 118th Congress's
 * map, which is the same 2021 plan) -- *not* `Massachusetts_House_Districts`
 * and its siblings, whose polygons are the pre-2022 districts with the
 * pre-2022 members' names on them. Layer 1 of each is the polygons; layer 0 is
 * the lines.
 */
const LAYERS = {
  precincts: `${SERVER}/WardsPrecincts2022/FeatureServer/0`,
  subprecincts: `${SERVER}/Subprecincts2022/FeatureServer/0`,
}
const DISTRICTS = {
  congress: { url: `${SERVER}/Congress118/FeatureServer/1`, field: "DISTRICT" },
  council: { url: `${SERVER}/GovCouncil2021/FeatureServer/1`, field: "DIST_NAME" },
  senate: { url: `${SERVER}/Senate2021/FeatureServer/1`, field: "SEN_DIST" },
  house: { url: `${SERVER}/House2021/FeatureServer/1`, field: "REP_DIST" },
}

/**
 * How much of a precinct has to lie in one district before it is called that
 * district's. A precinct is drawn inside its districts by law; the shortfall
 * this allows for is the two layers digitised to slightly different lines,
 * which runs to a few tenths of a percent at worst.
 */
const MIN_SHARE = 0.98

/** About two metres, and a metre's rounding: see `simplifyRing`. */
const COMPACT = { tolerance: 0.00002, digits: 5 }

export const DATA_FILE = path.join(
  import.meta.dirname,
  "..",
  "src",
  "lib",
  "data",
  "precincts.json",
)

async function query(layer, params) {
  const url = `${layer}/query?${new URLSearchParams({ outSR: "4326", f: "geojson", ...params })}`
  const res = await fetch(url, { headers: { "User-Agent": "civics-calendar/1.0" } })
  if (!res.ok) throw new Error(`${res.status} from ${url}`)
  const body = await res.json()
  if (!body.features?.length) throw new Error(`Nothing returned from ${url}`)
  return body.features
}

console.log("  reading Haverhill's wards and precincts from MassGIS...")

const where = `TOWN='${TOWN}'`
const precinctFeatures = await query(LAYERS.precincts, {
  where,
  outFields: "WARD,PRECINCT,POP_2020",
})
const subFeatures = await query(LAYERS.subprecincts, { where, outFields: "SUBPRECINCT" })

// Every district polygon touching the city. The envelope is generous on
// purpose: a district that only grazes it scores zero below and is ignored.
const shapes = precinctFeatures.map((f) => asMulti(f.geometry))
const xs = shapes.flat(4).filter((_, i) => i % 2 === 0)
const ys = shapes.flat(4).filter((_, i) => i % 2 === 1)
const envelope = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].join(",")

const districts = {}
for (const [kind, { url, field }] of Object.entries(DISTRICTS)) {
  const features = await query(url, {
    geometry: envelope,
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: field,
    // The district is only measured against, never drawn, so a metre's
    // generalisation costs nothing and saves fetching every vertex of the
    // coastline the Sixth Congressional District follows.
    maxAllowableOffset: "0.00001",
  })
  districts[kind] = features.map((f) => ({ name: f.properties[field], shape: asMulti(f.geometry) }))
}

function districtsOf(shape, label) {
  const out = {}
  for (const [kind, list] of Object.entries(districts)) {
    const { name, share } = districtOf(shape, list)
    if (share < MIN_SHARE) {
      console.error(
        `${label}: only ${(share * 100).toFixed(1)}% of it is in the ${name} ${kind} district.`,
      )
      console.error("A precinct should sit inside one district; the layers no longer agree.")
      process.exit(1)
    }
    out[kind] = name
  }
  return out
}

const subsByParent = new Map()
for (const f of subFeatures) {
  const id = f.properties.SUBPRECINCT
  const parent = id.replace(/A$/, "")
  subsByParent.set(parent, [
    ...(subsByParent.get(parent) ?? []),
    { id, shape: asMulti(f.geometry) },
  ])
}

const precincts = precinctFeatures
  .map((f) => {
    const ward = Number(f.properties.WARD)
    const id = `${ward}-${f.properties.PRECINCT}`
    const shape = asMulti(f.geometry)
    const subs = subsByParent.get(id) ?? []
    // The districts a precinct votes in are those of the part of it that is
    // not its `A` half -- the half exists because it votes somewhere else.
    const rest = difference(shape, ...subs.map((s) => s.shape))
    return {
      id,
      ward,
      precinct: f.properties.PRECINCT,
      population: f.properties.POP_2020,
      districts: districtsOf(rest, `Precinct ${id}`),
      shape: compact(shape, COMPACT),
      subprecincts: subs.map((s) => ({
        id: s.id,
        districts: districtsOf(s.shape, `Sub-precinct ${s.id}`),
        shape: compact(s.shape, COMPACT),
      })),
      _raw: shape,
    }
  })
  .sort((a, b) => a.ward - b.ward || a.precinct.localeCompare(b.precinct))

const wards = [...new Set(precincts.map((p) => p.ward))].map((ward) => ({
  ward,
  shape: compact(union(...precincts.filter((p) => p.ward === ward).map((p) => p._raw)), COMPACT),
}))

for (const p of precincts) delete p._raw

await writeDataFile(DATA_FILE, {
  source: {
    name: "MassGIS, Wards and Precincts 2022 and Sub-precincts 2022",
    url: "https://www.mass.gov/info-details/massgis-data-2022-wards-and-precincts",
    districts: "MassGIS, 2021 House, Senate and Governor's Council districts; 118th Congress",
  },
  wards,
  precincts,
})

console.log(
  `  ${precincts.length} precincts, ${subFeatures.length} sub-precincts, ${wards.length} wards`,
)
