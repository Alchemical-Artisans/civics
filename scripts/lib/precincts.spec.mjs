import { describe, expect, it } from "vitest"
import { area, difference, districtOf, simplifyRing, union } from "./precincts.mjs"

const box = (x0, y0, x1, y1) => [
  [
    [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
      [x0, y0],
    ],
  ],
]

describe("area", () => {
  it("measures a polygon less its holes", () => {
    expect(area(box(0, 0, 2, 2))).toBe(4)
    expect(area(difference(box(0, 0, 2, 2), box(0.5, 0.5, 1.5, 1.5)))).toBeCloseTo(3)
  })
})

describe("union", () => {
  it("makes one ward out of two precincts side by side", () => {
    const ward = union(box(0, 0, 1, 1), box(1, 0, 2, 1))
    expect(ward).toHaveLength(1)
    expect(area(ward)).toBeCloseTo(2)
  })
})

describe("districtOf", () => {
  it("names the district holding most of a precinct, and how much", () => {
    const districts = [
      { name: "West", shape: box(0, 0, 1.9, 1) },
      { name: "East", shape: box(1.9, 0, 3, 1) },
    ]
    const found = districtOf(box(0, 0, 2, 1), districts)
    expect(found.name).toBe("West")
    expect(found.share).toBeCloseTo(0.95)
  })
})

describe("simplifyRing", () => {
  it("drops a point that sits on the line between its neighbours", () => {
    const ring = [
      [0, 0],
      [1, 0.000001],
      [2, 0],
      [2, 2],
      [0, 2],
      [0, 0],
    ]
    expect(simplifyRing(ring, 0.001)).toEqual([
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
      [0, 0],
    ])
  })

  it("keeps a point that bends the line", () => {
    const ring = [
      [0, 0],
      [1, 0.5],
      [2, 0],
      [2, 2],
      [0, 2],
      [0, 0],
    ]
    expect(simplifyRing(ring, 0.001)).toHaveLength(6)
  })
})
