import { describe, it, expect } from "vitest"
import {
  RAINFALL_JAN_AUG,
  RAINFALL_NORMAL_INCHES,
  RAINFALL_RECORD_YEARS,
  CURRENT_RAINFALL_YEAR,
  CURRENT_RAINFALL_RANK,
  rainfallDeparture,
  ordinal,
} from "./rainfall"

describe("ordinal", () => {
  it("handles the 11-13 exception and the usual 1/2/3 suffixes", () => {
    expect(ordinal(1)).toBe("1st")
    expect(ordinal(2)).toBe("2nd")
    expect(ordinal(3)).toBe("3rd")
    expect(ordinal(4)).toBe("4th")
    expect(ordinal(11)).toBe("11th")
    expect(ordinal(12)).toBe("12th")
    expect(ordinal(13)).toBe("13th")
    expect(ordinal(21)).toBe("21st")
    expect(ordinal(25)).toBe("25th")
    expect(ordinal(111)).toBe("111th")
  })
})

describe("rainfallDeparture", () => {
  it("is positive for a wetter-than-normal year and negative for a drier one", () => {
    expect(rainfallDeparture(RAINFALL_NORMAL_INCHES + 1)).toBeCloseTo(1, 5)
    expect(rainfallDeparture(RAINFALL_NORMAL_INCHES - 1)).toBeCloseTo(-1, 5)
  })
})

describe("the current year", () => {
  it("is the last entry in the chart's own series", () => {
    expect(RAINFALL_JAN_AUG.at(-1)?.year).toBe(CURRENT_RAINFALL_YEAR)
  })

  // Pins the headline figure the page states in prose: 25.75 in., 3.76 in.
  // below the 1901-2000 average -- computed from the same row the chart
  // draws, so the sentence and the bar cannot disagree.
  it("is 3.76 inches below the 1901-2000 average", () => {
    const current = RAINFALL_JAN_AUG.find((row) => row.year === CURRENT_RAINFALL_YEAR)!
    expect(current.inches).toBe(25.75)
    expect(rainfallDeparture(current.inches)).toBeCloseTo(-3.76, 2)
  })

  it("ranks inside the full record NOAA has, not just the 15 years shown", () => {
    expect(CURRENT_RAINFALL_RANK).toBeGreaterThan(0)
    expect(CURRENT_RAINFALL_RANK).toBeLessThanOrEqual(RAINFALL_RECORD_YEARS)
  })
})

it("carries at least a decade of years for the chart to draw", () => {
  expect(RAINFALL_JAN_AUG.length).toBeGreaterThanOrEqual(10)
  const years = RAINFALL_JAN_AUG.map((row) => row.year)
  expect(years).toEqual([...years].sort((a, b) => a - b))
})
