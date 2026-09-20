import { describe, it, expect } from "vitest"
import {
  ELEMENTS,
  NORMAL_ELEMENTS,
  NORMAL_REFERENCE_YEAR,
  diffObserved,
  parseInches,
  parseNormal,
  parseObserved,
  summarizeNormal,
  todayISO,
} from "./weather.mjs"

describe("todayISO", () => {
  it("formats a date as ACIS expects, in UTC", () => {
    expect(todayISO(new Date("2026-09-18T04:00:00Z"))).toBe("2026-09-18")
  })
})

describe("parseInches", () => {
  it("reads a plain reading", () => {
    expect(parseInches("0.19")).toBe(0.19)
    expect(parseInches("0.00")).toBe(0)
  })

  it("reads a plain temperature reading, negative included", () => {
    expect(parseInches("34")).toBe(34)
    expect(parseInches("-5")).toBe(-5)
  })

  it("drops a trailing flag letter and keeps the number", () => {
    expect(parseInches("0.00A")).toBe(0)
    expect(parseInches("1.28T")).toBe(1.28)
  })

  it("is null for a value that is only a flag", () => {
    expect(parseInches("M")).toBeNull()
    expect(parseInches("S")).toBeNull()
  })
})

describe("NORMAL_ELEMENTS", () => {
  it("carries only elements ACIS actually normals -- snwd and obst refuse it", () => {
    const names = NORMAL_ELEMENTS.map((e) => e.name)
    expect(names).toEqual(["maxt", "mint", "avgt", "pcpn", "snow"])
    expect(names).not.toContain("snwd")
    expect(names).not.toContain("obst")
  })

  it("is a subset of every requested element, in the same relative order", () => {
    const allNames = ELEMENTS.map((e) => e.name)
    const normalNames = NORMAL_ELEMENTS.map((e) => e.name)
    expect(normalNames.every((n) => allNames.includes(n))).toBe(true)
  })
})

describe("summarizeNormal", () => {
  it("sums an accumulating element and averages a snapshot one", () => {
    // Column order here matches NORMAL_ELEMENTS: maxt, mint, avgt, pcpn, snow.
    const data = [
      ["2024-01-01", "34", "16", "25.0", "0.13", "0.5"],
      ["2024-01-02", "36", "18", "27.0", "0.12", "0.0"],
    ]
    const summary = summarizeNormal(data)
    expect(summary.find((s) => s.name === "maxt")).toEqual({
      name: "maxt",
      label: "Maximum temperature (°F)",
      reduce: "mean",
      value: 35,
    })
    expect(summary.find((s) => s.name === "pcpn")).toEqual({
      name: "pcpn",
      label: "Total precipitation, liquid-water-equivalent (inches)",
      reduce: "sum",
      value: 0.25,
    })
  })

  it("ignores a flag-only day rather than treating it as zero for a mean", () => {
    const data = [
      ["2024-01-01", "34", "16", "25.0", "0.13", "0.5"],
      ["2024-01-02", "M", "18", "27.0", "0.12", "0.0"],
    ]
    const maxt = summarizeNormal(data).find((s) => s.name === "maxt")
    expect(maxt.value).toBe(34)
  })
})

describe("parseObserved", () => {
  it("returns the data rows when there are plausibly enough of them", () => {
    const data = Array.from({ length: 40001 }, (_, i) => [`1900-01-${(i % 28) + 1}`, "0.00"])
    expect(parseObserved({ data })).toBe(data)
  })

  // Without this a change to ACIS's response shape would quietly replace 127
  // years of committed data with almost nothing, and nothing downstream would
  // notice until someone charted an empty period of record.
  it("refuses a response far shorter than the station's real period of record", () => {
    expect(() => parseObserved({ data: [["2026-01-01", "0.00"]] })).toThrow(/expected at least/)
  })

  it("refuses a response with no data array at all", () => {
    expect(() => parseObserved({})).toThrow(/no data array/)
  })
})

describe("parseNormal", () => {
  it("accepts exactly 366 rows for the leap reference year", () => {
    const data = Array.from({ length: 366 }, () => [`${NORMAL_REFERENCE_YEAR}-01-01`, "0.1"])
    expect(parseNormal({ data })).toBe(data)
  })

  it("refuses a row count that does not match the reference year's own days", () => {
    const data = Array.from({ length: 365 }, () => [`${NORMAL_REFERENCE_YEAR}-01-01`, "0.1"])
    expect(() => parseNormal({ data })).toThrow(/expected 366/)
  })

  it("expects 365 for a non-leap year passed explicitly", () => {
    const data = Array.from({ length: 365 }, () => ["2025-01-01", "0.1"])
    expect(parseNormal({ data }, { year: 2025 })).toBe(data)
  })
})

describe("diffObserved", () => {
  const day = (date, v = "0.00") => [date, v]

  it("treats a first run as everything being new", () => {
    const after = [day("1899-11-01"), day("1899-11-02")]
    expect(diffObserved(null, after)).toEqual({
      beforeCount: 0,
      afterCount: 2,
      added: 2,
      lastBefore: null,
      lastAfter: "1899-11-02",
    })
  })

  it("counts the days added since the last run", () => {
    const before = [day("1899-11-01")]
    const after = [day("1899-11-01"), day("1899-11-02"), day("1899-11-03")]
    expect(diffObserved(before, after)).toEqual({
      beforeCount: 1,
      afterCount: 3,
      added: 2,
      lastBefore: "1899-11-01",
      lastAfter: "1899-11-03",
    })
  })
})
