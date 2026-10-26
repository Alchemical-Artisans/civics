import { describe, expect, it } from "vitest"
import { MONTH_NAMES, daysInMonth, isLeapYear, longDate } from "./precipitation"

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
