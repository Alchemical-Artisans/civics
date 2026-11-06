import { describe, expect, it } from "vitest"
import {
  MONTH_NAMES,
  type PrecipitationYear,
  averageToDate,
  daysInMonth,
  isLeapYear,
  longDate,
} from "./precipitation"

describe("daysInMonth", () => {
  it("knows each month's length", () => {
    expect(daysInMonth(1, 2026)).toBe(31)
    expect(daysInMonth(4, 2026)).toBe(30)
    expect(daysInMonth(12, 2026)).toBe(31)
  })

  /** The whole reason this is a function and not a constant array. */
  it("gives February its leap day only in a leap year", () => {
    expect(daysInMonth(2, 2024)).toBe(29)
    expect(daysInMonth(2, 2025)).toBe(28)
    expect(daysInMonth(2, 2026)).toBe(28)
    expect(daysInMonth(2, 2000)).toBe(29)
    expect(daysInMonth(2, 1900)).toBe(28)
  })
})

describe("isLeapYear", () => {
  it("follows the century rule, not just the four-year one", () => {
    expect(isLeapYear(2024)).toBe(true)
    expect(isLeapYear(2026)).toBe(false)
    expect(isLeapYear(2000)).toBe(true)
    expect(isLeapYear(1900)).toBe(false)
  })
})

describe("MONTH_NAMES", () => {
  it("runs January to December", () => {
    expect(MONTH_NAMES.length).toBe(12)
    expect(MONTH_NAMES[0]).toBe("Jan")
    expect(MONTH_NAMES[11]).toBe("Dec")
  })
})

describe("longDate", () => {
  it("says a stored date the way a sentence wants it", () => {
    expect(longDate("2026-10-26")).toBe("Oct 26")
    expect(longDate("2026-01-05")).toBe("Jan 5")
  })
})

describe("averageToDate", () => {
  const year = (y: number, toDate: number): PrecipitationYear => ({
    year: y,
    months: [],
    totalInches: toDate + 9,
    toDateInches: toDate,
    cityOnlyToDateInches: toDate,
    throughDate: `${y}-10-26`,
    cityDays: 0,
    filledDays: 0,
    unreadDays: 0,
  })

  /**
   * The mistake this exists to prevent: averaging `totalInches` would put
   * whole years against the current year's ten months. Each fixture's full
   * year is nine inches wetter than its to-date figure, so an average over
   * the wrong field is off by exactly that.
   */
  it("averages the to-date figures, never the whole-year totals", () => {
    const average = averageToDate([year(2024, 30), year(2025, 40)])
    expect(average).toBe(35)
  })

  it("rounds to hundredths, as every other figure here does", () => {
    expect(averageToDate([year(2024, 10), year(2025, 10), year(2026, 11)])).toBe(10.33)
  })

  it("is zero for no years rather than NaN", () => {
    expect(averageToDate([])).toBe(0)
  })

  /** One year's average is that year, which is what makes the span explicit. */
  it("returns the single year it is given", () => {
    expect(averageToDate([year(2026, 30.52)])).toBe(30.52)
  })
})
