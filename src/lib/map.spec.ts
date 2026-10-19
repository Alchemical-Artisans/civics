import { describe, expect, it } from "vitest"
import {
  boundsAround,
  boundsOf,
  contains,
  frame,
  labelPoint,
  pathOf,
  pathOfLine,
  project,
  tiles,
  type Shape,
} from "./map"

// A square with a square hole in it, a degree on a side, near Haverhill.
const square: Shape = [
  [
    [
      [-71, 42],
      [-70, 42],
      [-70, 43],
      [-71, 43],
      [-71, 42],
    ],
    [
      [-70.6, 42.4],
      [-70.4, 42.4],
      [-70.4, 42.6],
      [-70.6, 42.6],
      [-70.6, 42.4],
    ],
  ],
]

describe("project", () => {
  it("puts the origin in the middle of the world tile", () => {
    const [x, y] = project([0, 0], 0)
    expect(x).toBeCloseTo(128)
    expect(y).toBeCloseTo(128)
  })

  it("lands Haverhill City Hall in OpenStreetMap's own tile for it", () => {
    // tile.openstreetmap.org/13/2478/3017 is the tile City Hall is drawn on.
    const [x, y] = project([-71.076848, 42.7781603], 13)
    expect(Math.floor(x / 256)).toBe(2478)
    expect(Math.floor(y / 256)).toBe(3017)
  })
})

describe("frame", () => {
  it("picks the closest zoom the box fits at", () => {
    const f = frame(boundsOf([square]), 800, 600)
    expect(f.width).toBeLessThanOrEqual(800)
    expect(f.height).toBeLessThanOrEqual(600)
    // One zoom further in would not have fitted, one way or the other.
    const [x0, y1] = project([-71, 42], f.z + 1)
    const [x1, y0] = project([-70, 43], f.z + 1)
    expect(x1 - x0 + 32 > 800 || y1 - y0 + 32 > 600).toBe(true)
  })

  it("never zooms past 17", () => {
    expect(frame([-71, 42, -71, 42], 800, 600).z).toBe(17)
  })
})

describe("tiles", () => {
  it("covers the whole frame and nothing outside it", () => {
    const f = frame(boundsOf([square]), 800, 600)
    const ts = tiles(f)
    expect(Math.min(...ts.map((t) => t.left))).toBeLessThanOrEqual(f.x)
    expect(Math.max(...ts.map((t) => t.left + 256))).toBeGreaterThanOrEqual(f.x + f.width)
    expect(Math.min(...ts.map((t) => t.top))).toBeLessThanOrEqual(f.y)
    expect(Math.max(...ts.map((t) => t.top + 256))).toBeGreaterThanOrEqual(f.y + f.height)
    expect(ts.every((t) => t.left < f.x + f.width && t.top < f.y + f.height)).toBe(true)
  })
})

describe("contains", () => {
  it("is inside the square and outside its hole", () => {
    expect(contains(square, [-70.9, 42.1])).toBe(true)
    expect(contains(square, [-70.5, 42.5])).toBe(false)
    expect(contains(square, [-69, 42.5])).toBe(false)
  })
})

describe("labelPoint", () => {
  it("lands inside the shape, clear of the hole", () => {
    const p = labelPoint(square)
    expect(contains(square, p)).toBe(true)
  })
})

describe("pathOf", () => {
  it("draws one closed subpath per ring", () => {
    expect(pathOf(square, 10).match(/M/g)).toHaveLength(2)
    expect(pathOf(square, 10).match(/Z/g)).toHaveLength(2)
  })
})

describe("boundsAround", () => {
  it("gives a single place the ground around it rather than a box of nothing", () => {
    const [x0, y0, x1, y1] = boundsAround([[-71.0859945, 42.775684]])
    expect(x1 - x0).toBeCloseTo(0.0036, 10)
    expect(y1 - y0).toBeCloseTo(0.0036, 10)
    expect((x0 + x1) / 2).toBeCloseTo(-71.0859945, 10)
    expect((y0 + y1) / 2).toBeCloseTo(42.775684, 10)
  })

  it("leaves a box already wider than the span alone", () => {
    expect(
      boundsAround([
        [-71.09, 42.76],
        [-71.07, 42.78],
      ]),
    ).toEqual([-71.09, 42.76, -71.07, 42.78])
  })
})

describe("pathOfLine", () => {
  it("draws an open path, which is what a street is", () => {
    const d = pathOfLine(
      [
        [-71.104605, 42.76726],
        [-71.104614, 42.770916],
      ],
      17,
    )
    expect(d.startsWith("M")).toBe(true)
    expect(d).toContain("L")
    expect(d).not.toContain("Z")
  })

  it("has nothing to draw for no points", () => {
    expect(pathOfLine([], 17)).toBe("")
  })
})
