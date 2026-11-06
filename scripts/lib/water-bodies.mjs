/**
 * Which bodies of water Haverhill's drinking water comes out of, and the
 * shapes to draw them with.
 *
 * **Two sources, because neither answers the whole question.** MassDEP knows
 * which waters are a public supply and the city's own page does not list them
 * as a set; the National Hydrography Dataset knows the shape of a lake and
 * nothing about who drinks it. So the supply is read from MassDEP and the
 * outline from NHD, and the two are joined by geometry rather than by name --
 * see `matchBodies` for why name matching would not have worked.
 *
 * Nothing here is a judgement about what counts as the water supply. MassDEP's
 * own Surface Water Supply Protection Areas layer names four sources against
 * Haverhill's public water system, PWSID 3128000, and those four are what this
 * writes. The city's own drought page mentions three of them.
 */

/** MassGIS's ArcGIS REST server, the same one `update-precincts.mjs` reads. */
export const MASSGIS = "https://arcgisserver.digital.mass.gov/arcgisserver/rest/services/AGOL"

/**
 * USGS's National Hydrography Dataset. Layer 12 is "Waterbody - Large Scale",
 * the resolution that has Haverhill's reservoirs in it; MassGIS's own
 * `Hydro_Major` is a major-waters subset carrying Crystal Lake and none of the
 * other three, and nothing finer is published on its REST server.
 */
export const NHD_WATERBODY = "https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/12"

/**
 * MassDEP's Surface Water Supply Watersheds -- the land that drains to each
 * source, which is a different thing from the Zone A protection buffer the
 * `ZoneABC` service draws. A watershed is where the water comes from; a Zone
 * A is the strip around the source that regulation protects.
 *
 * Keyed on the same `SOURCE_ID` as the zones, so the two join without
 * guessing. `TYPE` separates an active surface source (`SW`) from one held
 * for emergencies (`ESW`), which is how the city's seven registered sources
 * divide into the four it uses and the three it does not.
 */
export const WATERSHEDS =
  "https://arcgisserver.digital.mass.gov/arcgisserver/rest/services/AGOL/Surface_Water_Supply_Watersheds/FeatureServer/0"

/** Haverhill's public water system, as MassDEP numbers it. */
export const PWSID = "3128000"

/**
 * NHD's own code for a reservoir, as against 390 (lake or pond) and 466
 * (swamp or marsh). Every one of Haverhill's four sources comes back 436,
 * which is the check that the geometric match landed on a managed water body
 * rather than on a marsh inside the same protection area.
 */
export const FTYPE_RESERVOIR = 436

/**
 * Sources MassDEP registers against Haverhill that this site does not draw.
 *
 * **MassDEP's four are not the city's three, and where they disagree the
 * city's own current page wins.** The state's Zone A layer registers Round
 * Pond as `3128000-07S`, a numbered surface source against PWSID 3128000, and
 * the city's Open Space & Recreation Plan listed it as an "Active Primary
 * Source" alongside the other three. But that plan ran July 2016 to July 2023
 * and has expired, and the Water Department's own Water Supply page names
 * Kenoza Lake, Crystal Lake and Millvale Reservoir and nothing else -- the
 * words "Round Pond", "Pentucket" and "Winnekenni" are not on it. A map here
 * drawing a fourth source the department does not currently name would be
 * this site asserting something about the water supply rather than
 * republishing what the city says about it.
 *
 * So it is left out, and left out *here* rather than filtered in the page, so
 * the decision sits next to the query it overrides and the generated file
 * records it. **To put it back, delete the entry.** That is the whole act, and
 * it is what to do if the Water Department says the pond is in the supply:
 * the shape, the Zone A acreage and the name matching all still work, having
 * never been the reason it came out.
 *
 * Keyed on `SOURCE_ID` rather than on the name, because the name is the one
 * field the two agencies disagree about: MassDEP's "ROUND POND" is the water
 * USGS calls "Lake Pentucket", and the two ponds NHD does call Round Pond are
 * in other towns twelve and twenty miles off.
 */
export const NOT_DRAWN = {
  "3128000-07S": {
    name: "ROUND POND",
    reason:
      "Registered by MassDEP and named in the city's expired 2016-2023 Open Space & " +
      "Recreation Plan, but not on the Water Department's current Water Supply page.",
  },
}

/** Whether MassDEP's source id is one the site leaves off the map. */
export function isDrawn(sourceId) {
  return !Object.hasOwn(NOT_DRAWN, sourceId)
}

const agent = { "User-Agent": "civics-calendar/1.0" }

/**
 * ArcGIS REST query. POSTed rather than GET because a Zone A ring is a few
 * thousand coordinates and goes in the body of the request, past any URL
 * length a server will take.
 *
 * Retried, because the NHD's own server is the flaky one here: handed
 * Millvale's Zone A unsimplified it answers 504, and it answers one now and
 * then even for a request it will serve on a second ask.
 */
export async function query(layer, params, { attempts = 3 } = {}) {
  let last
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const body = new URLSearchParams({ f: "json", outSR: "4326", ...params })
      const res = await fetch(`${layer}/query`, { method: "POST", headers: agent, body })
      if (!res.ok) throw new Error(`${res.status} from ${layer}`)
      const json = await res.json()
      if (json.error) throw new Error(`${layer}: ${json.error.message ?? "query failed"}`)
      return json.features ?? []
    } catch (err) {
      last = err
      if (attempt < attempts) await new Promise((r) => setTimeout(r, 2000 * attempt))
    }
  }
  throw last
}

/**
 * A Zone A ring, coarse enough for the NHD to accept as a spatial filter.
 *
 * Millvale's is 1,540 acres and some thousands of coordinates, and the NHD's
 * server answers 504 rather than clip against it. The zone is only ever used
 * here to ask which water bodies lie inside a 400-foot buffer, so a fifty
 * metre tolerance costs the answer nothing -- the shapes that get drawn are
 * the NHD's own, never these.
 */
export function coarsenZone(rings, simplifyRing, tolerance = 0.0005) {
  return rings.map((ring) => simplifyRing(ring, tolerance)).filter((ring) => ring.length >= 4)
}

/** An Esri polygon's rings as GeoJSON MultiPolygon coordinates. */
export function ringsToMulti(rings) {
  return rings.map((ring) => [ring.map(([lon, lat]) => [lon, lat])])
}

/**
 * `[minLon, minLat, maxLon, maxLat]` around every shape given.
 *
 * `flat(3)`, not `flat(2)`: the argument is a list of MultiPolygons, which is
 * four deep to a coordinate pair -- list, polygon, ring, point. Flattening two
 * levels leaves rings rather than points, and `Math.min` over arrays returns
 * NaN, which `JSON.stringify` then writes as `null`. That is exactly what the
 * first run of this wrote, and why `boundsOfRings` has a test of its own.
 */
export function boundsOfRings(multis) {
  const points = multis.flat(3)
  if (!points.length) throw new Error("boundsOfRings was given no coordinates")
  const lons = points.map((p) => p[0])
  const lats = points.map((p) => p[1])
  const bounds = [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)]
  if (bounds.some((v) => !Number.isFinite(v))) {
    throw new Error(`boundsOfRings produced ${JSON.stringify(bounds)}; the nesting is wrong`)
  }
  return bounds
}

/**
 * Joins each MassDEP source to the NHD water body it protects.
 *
 * **By geometry, not by name.** Three of the four agree on a name closely
 * enough to match on (MassDEP's "KENOZA LAKE" to NHD's "Kenoza Lake",
 * "CRYSTAL LAKE" to "Crystal Lake Reservoir", "MILLVALE RES." to "Millvale
 * Reservoir") but the fourth does not: MassDEP's "ROUND POND" sits over the
 * body NHD calls **Lake Pentucket**, and the two ponds NHD does call "Round
 * Pond" are in other towns entirely, twelve and twenty miles off. Matching on
 * the name would have silently taken one of those or dropped the source.
 *
 * A Zone A is a 400-foot buffer drawn around the source, so the body it
 * protects lies inside it -- along with marshes, inlets and, where two sources
 * are close, a neighbour's water. The largest intersecting body of NHD's
 * reservoir type is the source; `candidates` keeps the rest so the choice is
 * auditable rather than asserted.
 */
export function matchBodies(zone, intersecting) {
  const reservoirs = intersecting
    .filter((f) => f.attributes.FTYPE === FTYPE_RESERVOIR)
    .sort((a, b) => b.attributes.AREASQKM - a.attributes.AREASQKM)

  const chosen = reservoirs[0]
  if (!chosen) return null

  return {
    /** MassDEP's own name for the source, which is the city's water, not the map's. */
    name: zone.SITE_NAME,
    sourceId: zone.SOURCE_ID,
    zoneAcres: Math.round(zone.ACRES * 10) / 10,
    /** NHD's name for the same water, kept because it is not always the same word. */
    mappedName: chosen.attributes.GNIS_NAME ?? null,
    nhdId: chosen.attributes.PERMANENT_IDENTIFIER,
    areaSqKm: Math.round(chosen.attributes.AREASQKM * 1000) / 1000,
    /** True where the two agencies do not call this water the same thing. */
    namesDiffer: !sameWater(zone.SITE_NAME, chosen.attributes.GNIS_NAME),
    candidates: reservoirs.length,
  }
}

/**
 * Whether two names plausibly describe one water: MassDEP shouts and
 * abbreviates ("MILLVALE RES."), NHD spells out and sometimes appends its own
 * word ("Millvale Reservoir", "Crystal Lake Reservoir"). Only used to decide
 * whether to flag a disagreement, never to make the match.
 */
export function sameWater(depName, nhdName) {
  if (!nhdName) return false
  const norm = (s) =>
    s
      .toLowerCase()
      .replace(/\bres\.?\b/g, "reservoir")
      .replace(/\b(lake|pond|reservoir)\b/g, "")
      .replace(/[^a-z]+/g, "")
  return norm(depName) === norm(nhdName)
}
