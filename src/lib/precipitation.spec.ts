import { describe, expect, it } from "vitest"
import { longDate, monthTicks, weekOfYear, weekStartMonthDay } from "./precipitation"

describe("weekOfYear", () => {
  it("opens week 1 on January 1st", () => {
    expect(weekOfYear("01-01", 2023)).toBe(1)
    expect(weekOfYear("01-07", 2023)).toBe(1)
    expect(weekOfYear("01-08", 2023)).toBe(2)
  })

  it("puts the same date in the same week in every year, leap or not", () => {
    for (const year of [2023, 2024, 2025, 2026]) {
      expect(weekOfYear("07-04", year)).toBe(weekOfYear("07-04", 2023))
      expect(weekOfYear("12-25", year)).toBe(weekOfYear("12-25", 2023))
    }
  })

  it("folds February 29th into week 9 rather than discarding the day", () => {
    expect(weekOfYear("02-29", 2024)).toBe(9)
    expect(weekOfYear("02-28", 2024)).toBe(9)
    expect(weekOfYear("03-01", 2024)).toBe(9)
  })

  it("never runs past week 53", () => {
    expect(weekOfYear("12-31", 2023)).toBe(53)
    expect(weekOfYear("12-31", 2024)).toBe(53)
  })

  it("labels a week by the day it opens", () => {
    expect(weekStartMonthDay(1)).toBe("01-01")
    expect(weekStartMonthDay(2)).toBe("01-08")
  })
})

describe("monthTicks", () => {
  const ticks = monthTicks()

  it("gives one tick per month, January first", () => {
    expect(ticks.length).toBe(12)
    expect(ticks[0]).toMatchObject({ label: "Jan", week: 1 })
  })

  it("keeps the ticks in order across the year", () => {
    for (let i = 1; i < ticks.length; i++) expect(ticks[i].week).toBeGreaterThan(ticks[i - 1].week)
  })

  /** Fractional on purpose: rounding each to a week boundary drifts by December. */
  it("places December inside the 53-week axis", () => {
    expect(ticks.at(-1)!.week).toBeGreaterThan(48)
    expect(ticks.at(-1)!.week).toBeLessThanOrEqual(53)
  })
})

describe("longDate", () => {
  it("says a stored date the way a sentence wants it", () => {
    expect(longDate("2026-10-26")).toBe("Oct 26")
    expect(longDate("2026-01-05")).toBe("Jan 5")
  })
})
