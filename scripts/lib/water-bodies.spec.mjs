import { describe, expect, it } from "vitest"
import {
  NOT_DRAWN,
  boundsOfRings,
  isDrawn,
  matchBodies,
  ringsToMulti,
  sameWater,
} from "./water-bodies.mjs"

describe("ringsToMulti", () => {
  it("wraps each Esri ring as its own GeoJSON polygon", () => {
    const multi = ringsToMulti([
      [
        [-71, 42],
        [-70, 42],
        [-70, 43],
        [-71, 42],
      ],
    ])
    expect(multi.length).toBe(1)
    expect(multi[0].length).toBe(1)
    expect(multi[0][0][0]).toEqual([-71, 42])
  })
})

describe("boundsOfRings", () => {
  const multi = ringsToMulti([
    [
      [-71.1, 42.7],
      [-70.9, 42.7],
      [-70.9, 42.85],
      [-71.1, 42.85],
      [-71.1, 42.7],
    ],
  ])

  it("reaches the corners of the shapes it is given", () => {
    expect(boundsOfRings([multi])).toEqual([-71.1, 42.7, -70.9, 42.85])
  })

  it("spans several shapes at once", () => {
    const other = ringsToMulti([
      [
        [-71.3, 42.6],
        [-71.2, 42.6],
        [-71.2, 42.65],
        [-71.3, 42.6],
      ],
    ])
    expect(boundsOfRings([multi, other])).toEqual([-71.3, 42.6, -70.9, 42.85])
  })

  /**
   * The bug this is really here for: flattening two levels instead of three
   * leaves rings rather than points, and the whole thing came out as four
   * nulls in the committed file rather than failing.
   */
  it("throws rather than returning nulls when handed the wrong nesting", () => {
    expect(() => boundsOfRings(multi)).toThrow(/nesting is wrong|no coordinates/)
  })

  it("throws on nothing at all", () => {
    expect(() => boundsOfRings([])).toThrow(/no coordinates/)
  })
})

describe("sameWater", () => {
  it("sees through MassDEP's shouting and abbreviating", () => {
    expect(sameWater("KENOZA LAKE", "Kenoza Lake")).toBe(true)
    expect(sameWater("MILLVALE RES.", "Millvale Reservoir")).toBe(true)
  })

  it("sees through a word one source appends and the other does not", () => {
    expect(sameWater("CRYSTAL LAKE", "Crystal Lake Reservoir")).toBe(true)
  })

  /** The one that actually differs, and the reason the match is geometric. */
  it("reports a real disagreement", () => {
    expect(sameWater("ROUND POND", "Lake Pentucket")).toBe(false)
  })

  it("treats an unnamed body as no agreement", () => {
    expect(sameWater("ROUND POND", null)).toBe(false)
  })
})

describe("matchBodies", () => {
  const zone = { SITE_NAME: "ROUND POND", SOURCE_ID: "3128000-07S", ACRES: 88.76791802 }
  const body = (name, area, ftype, id) => ({
    attributes: { GNIS_NAME: name, AREASQKM: area, FTYPE: ftype, PERMANENT_IDENTIFIER: id },
  })

  it("takes the largest reservoir-type body inside the zone", () => {
    const matched = matchBodies(zone, [
      body("Lake Pentucket", 0.153, 436, "135911147"),
      body(null, 0.003, 390, "135911116"),
      body(null, 0.222, 466, "135917185"),
    ])
    expect(matched).toMatchObject({
      name: "ROUND POND",
      mappedName: "Lake Pentucket",
      nhdId: "135911147",
      areaSqKm: 0.153,
      candidates: 1,
    })
  })

  /** A marsh is 466 and a pond 390; neither is the managed water a city draws. */
  it("ignores marshes and ponds however large", () => {
    expect(matchBodies(zone, [body(null, 9, 466, "x"), body(null, 8, 390, "y")])).toBeNull()
  })

  it("flags a source the two agencies name differently", () => {
    const matched = matchBodies(zone, [body("Lake Pentucket", 0.153, 436, "a")])
    expect(matched.namesDiffer).toBe(true)
  })

  it("does not flag one they agree on", () => {
    const kenoza = { SITE_NAME: "KENOZA LAKE", SOURCE_ID: "3128000-01S", ACRES: 333.6 }
    const matched = matchBodies(kenoza, [
      body("Kenoza Lake", 0.972, 436, "a"),
      body("Lake Pentucket", 0.153, 436, "b"),
    ])
    expect(matched.namesDiffer).toBe(false)
    expect(matched.mappedName).toBe("Kenoza Lake")
    // Both are reservoirs in Kenoza's own Zone A, and the count says so.
    expect(matched.candidates).toBe(2)
  })

  it("rounds the zone's acres and the body's area rather than carrying ten decimals", () => {
    const matched = matchBodies(zone, [body("Lake Pentucket", 0.15316319, 436, "a")])
    expect(matched.zoneAcres).toBe(88.8)
    expect(matched.areaSqKm).toBe(0.153)
  })
})

describe("isDrawn", () => {
  /**
   * The three the Water Department's own page names. If one of these ever
   * comes back false the map has quietly lost a source the city does name,
   * which is the failure worth a test of its own.
   */
  it("draws every source the city currently names", () => {
    for (const id of ["3128000-01S", "3128000-03S", "3128000-05S"]) {
      expect(isDrawn(id)).toBe(true)
    }
  })

  it("leaves out Round Pond, which the city's current page does not name", () => {
    expect(isDrawn("3128000-07S")).toBe(false)
  })

  /** A source MassDEP has not registered is not excluded, merely absent. */
  it("draws an id it has never heard of", () => {
    expect(isDrawn("3128000-99S")).toBe(true)
  })

  /**
   * Every exclusion is a judgement about what the city publishes, so each has
   * to carry the reason with it -- the entry is the only record of why a
   * registered source is not on the map.
   */
  it("gives a reason for everything it leaves out", () => {
    const entries = Object.entries(NOT_DRAWN)
    expect(entries.length).toBeGreaterThan(0)
    for (const [id, entry] of entries) {
      expect(id).toMatch(/^3128000-\d\d[A-Z]$/)
      expect(entry.name).toBeTruthy()
      expect(entry.reason.length).toBeGreaterThan(40)
    }
  })

  /** Guards the prototype hole: `isDrawn("toString")` must not come back false. */
  it("is not fooled by an inherited property name", () => {
    expect(isDrawn("toString")).toBe(true)
    expect(isDrawn("constructor")).toBe(true)
  })
})
