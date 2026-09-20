import { describe, it, expect } from "vitest"
import {
  USE_SPLIT,
  USE_SPLIT_MGD,
  AVERAGE_PRODUCTION_MGD,
  RGPCD_TARGET,
  RESTRICTED_USES,
  WATER_USE_CHART,
  CONSERVATION_TIPS,
  DROUGHT_ZONES,
  CURRENT_DROUGHT_ZONE,
  KENOZA_LAKE_ZONE,
  ORDINANCE_SOURCE,
  gallonsPerPersonPerDay,
} from "./water"

describe("the citywide use split", () => {
  it("adds to 100%, residential and non-residential being the whole of it", () => {
    expect(USE_SPLIT.reduce((sum, part) => sum + part.amount, 0)).toBe(100)
  })

  it("applied to average production, adds back to that same total", () => {
    const total = USE_SPLIT_MGD.reduce((sum, part) => sum + part.amount, 0)
    expect(total).toBeCloseTo(AVERAGE_PRODUCTION_MGD, 1)
  })
})

describe("the restricted-use table", () => {
  it("classifies every row as Prohibited, Exempt, or Restricted", () => {
    for (const row of RESTRICTED_USES.rows) {
      expect(row.cells[0]).toMatch(/^(Prohibited|Exempt|Restricted)/)
    }
  })

  it("carries the golf-course and car-wash rows the city actually states", () => {
    const labels = RESTRICTED_USES.rows.map((row) => row.label)
    expect(labels.some((label) => label.includes("Golf course irrigation"))).toBe(true)
    expect(labels).toContain("Washing vehicles (except commercial car washes)")
  })
})

describe("the Water Use Chart", () => {
  it("has a Without-Conservation figure for every activity", () => {
    for (const row of WATER_USE_CHART.rows) {
      expect(row.cells[0]).toMatch(/gallons?$/)
    }
  })
})

describe("gallonsPerPersonPerDay", () => {
  it("divides gallons by people and by days", () => {
    expect(gallonsPerPersonPerDay(900, 3, 30)).toBeCloseTo(10, 5)
  })

  it("returns null rather than Infinity or NaN with nothing entered", () => {
    expect(gallonsPerPersonPerDay(0, 0, 0)).toBeNull()
    expect(gallonsPerPersonPerDay(100, 0, 30)).toBeNull()
    expect(gallonsPerPersonPerDay(100, 3, 0)).toBeNull()
  })

  it("allows zero gallons but not negative ones", () => {
    expect(gallonsPerPersonPerDay(0, 3, 30)).toBe(0)
    expect(gallonsPerPersonPerDay(-5, 3, 30)).toBeNull()
  })
})

// The permit target itself, so a future edit that changes this number without
// meaning to -- rather than because the city republished a different one --
// fails here instead of silently changing what the calculator says.
it("pins the RGPCD permit target at 65", () => {
  expect(RGPCD_TARGET).toBe(65)
})

describe("the drought scale", () => {
  it("orders the chart's own legend mild to severe", () => {
    expect(DROUGHT_ZONES.map((zone) => zone.name)).toEqual([
      "Watch",
      "Warning",
      "Emergency",
      "Critical",
    ])
  })

  it("names the current zone as one of the four", () => {
    expect(DROUGHT_ZONES.map((zone) => zone.name)).toContain(CURRENT_DROUGHT_ZONE)
  })

  it("builds the sentence form off the same current zone", () => {
    expect(KENOZA_LAKE_ZONE).toBe(`${CURRENT_DROUGHT_ZONE} Zone`)
  })

  it("compacts each zone's own range into the percent a narrow scale shows", () => {
    expect(DROUGHT_ZONES.map((zone) => zone.percent)).toEqual(["5-10%", "10-20%", "20-35%", ">35%"])
  })

  // The one zone with an independent legal citation, not just the chart's
  // own legend: the city's drought-emergency declaration quotes this exact
  // range against Ordinance section 250-25.1. If this ever drifts from the
  // chart's own "Emergency" row, the two sources disagree and need
  // reconciling by hand, not a silent pick of one.
  it("matches the ordinance-cited range for Emergency specifically", () => {
    const emergency = DROUGHT_ZONES.find((zone) => zone.name === "Emergency")!
    expect(emergency.percent).toBe("20-35%")
    expect(ORDINANCE_SOURCE.label).toContain("Drought Emergency")
  })
})

it("carries the city's own four-item indoor conservation list", () => {
  expect(CONSERVATION_TIPS).toEqual([
    "Fix leaks promptly",
    "Run full dishwasher and laundry loads",
    "Take shorter showers",
    "Install water-efficient fixtures",
  ])
})
