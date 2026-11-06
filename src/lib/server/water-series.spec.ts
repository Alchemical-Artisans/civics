import { describe, it, expect } from "vitest"
import { PRODUCTION_WARNING, waterWindows } from "./water-series"

const daysBetween = (start: string, end: string) =>
  Math.round(
    (new Date(`${end}T00:00:00Z`).getTime() - new Date(`${start}T00:00:00Z`).getTime()) /
      86_400_000,
  ) + 1

const windows = waterWindows()

describe("waterWindows", () => {
  it("carries a run of windows, oldest first", () => {
    expect(windows.length).toBeGreaterThanOrEqual(2)
    const ends = windows.map((w) => w.endDate)
    expect(ends).toEqual([...ends].sort())
  })

  it("spans exactly 365 or 366 days -- a real year, never a partial one", () => {
    for (const w of windows) {
      expect([365, 366]).toContain(daysBetween(w.startDate, w.endDate))
    }
  })

  it("tiles without gaps or overlap", () => {
    for (let i = 1; i < windows.length; i++) {
      const dayAfter = new Date(`${windows[i - 1].endDate}T00:00:00Z`)
      dayAfter.setUTCDate(dayAfter.getUTCDate() + 1)
      expect(windows[i].startDate).toBe(dayAfter.toISOString().slice(0, 10))
    }
  })

  it("totals production rather than averaging it", () => {
    // ~6 MGD across a year lands in the low thousands of million gallons.
    expect(windows.at(-1)!.producedMg).toBeGreaterThan(1000)
  })

  it("sums real rainfall into a plausible New England annual total", () => {
    // Haverhill's own normal is a bit under 50 inches a year; anything far
    // outside this band means the column moved or the flags stopped parsing.
    for (const w of windows) {
      expect(w.rainfallInches).toBeGreaterThan(15)
      expect(w.rainfallInches).toBeLessThan(90)
    }
  })

  it("averages temperature into a plausible New England annual mean", () => {
    // Haverhill's own annual normal is a shade under 50°F; a window far
    // outside this band means the column moved or a sum crept in where a
    // mean belongs.
    for (const w of windows) {
      expect(w.avgTempF).toBeGreaterThan(40)
      expect(w.avgTempF).toBeLessThan(60)
    }
  })

  it("averages temperature over the days it read, not the whole calendar", () => {
    // A window with gaps still has to land in the same band -- if missing
    // days were being counted as 0°F the mean would collapse.
    const patchy = windows.filter((w) => w.tempMissingDays > 18)
    for (const w of patchy) {
      expect(w.avgTempF).toBeGreaterThan(40)
    }
  })

  it("counts the station's unrecorded days rather than reading them as no rain", () => {
    for (const w of windows) {
      expect(w.rainfallMissingDays).toBeGreaterThanOrEqual(0)
      expect(w.rainfallMissingDays).toBeLessThan(366)
    }
    // The real record does have gaps -- if this ever hits zero everywhere,
    // the flag parsing has probably started swallowing them silently.
    expect(windows.some((w) => w.rainfallMissingDays > 0)).toBe(true)
  })
})

it("carries the placeholder file's own warning, unedited", () => {
  expect(PRODUCTION_WARNING).toContain("PLACEHOLDER DATA")
})
