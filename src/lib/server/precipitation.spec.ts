import { describe, expect, it } from "vitest"
import { dailyPrecipitation, parsePrecipitation, precipitationByYear } from "./precipitation"

describe("parsePrecipitation", () => {
  it("reads a plain figure", () => {
    expect(parsePrecipitation("0.42")).toBe(0.42)
  })

  it("treats a trace as zero rather than unknown", () => {
    expect(parsePrecipitation("T")).toBe(0)
  })

  it("treats a day rolled into a later total as zero, so its water is not counted twice", () => {
    expect(parsePrecipitation("S")).toBe(0)
  })

  it("keeps an accumulated total's own figure", () => {
    expect(parsePrecipitation("0.46A")).toBe(0.46)
  })

  it("reports a missing reading as missing, not as no rain", () => {
    expect(parsePrecipitation("M")).toBeNull()
  })
})

describe("dailyPrecipitation", () => {
  const days = dailyPrecipitation()
  const byDate = new Map(days.map((day) => [day.date, day]))

  it("covers the city station's whole record", () => {
    expect(days.length).toBeGreaterThan(46_000)
    expect(days[0].date).toBe("1899-11-01")
  })

  it("takes the city gauge's own reading where it has one", () => {
    // 2026-10-14 is a plain city reading, no fill involved.
    expect(byDate.get("2026-10-14")).toMatchObject({ source: "city", inches: 0.43 })
  })

  it("fills a day the city observer missed from the neighbour gauges", () => {
    // 2026-01-20 falls in the January run of unread days.
    const day = byDate.get("2026-01-20")
    expect(day?.source).toBe("neighbour")
    expect(day?.inches).not.toBeNull()
    expect(day?.gauges).toBeGreaterThanOrEqual(1)
  })

  it("never reports a figure without saying which gauge it came from", () => {
    for (const day of days.slice(-400)) {
      if (day.inches === null) expect(day.source).toBe("unread")
      else expect(day.source === "city" || day.source === "neighbour").toBe(true)
    }
  })

  it("leaves a day no gauge read unread rather than filling it from the normal", () => {
    const unread = days.filter((day) => day.source === "unread")
    expect(unread.every((day) => day.inches === null)).toBe(true)
  })
})

/**
 * The page asks for three years, not four: 2023 and the 1991-2020 normal were
 * both dropped from the chart as distractions. The module itself takes any
 * span, so this still exercises a four-year call where that is the clearer
 * test, and `precipitationByYear` is given exactly what the route gives it
 * where the figures matter.
 */
describe("precipitationByYear", () => {
  const years = precipitationByYear([2023, 2024, 2025, 2026])
  const [y2023, y2024, y2025, y2026] = years

  it("returns the years asked for, in order", () => {
    expect(years.map((year) => year.year)).toEqual([2023, 2024, 2025, 2026])
  })

  it("takes any span, the three the page asks for included", () => {
    const three = precipitationByYear([2024, 2025, 2026])
    expect(three.map((year) => year.year)).toEqual([2024, 2025, 2026])
    expect(three.at(-1)?.toDateInches).toBe(y2026.toDateInches)
  })

  it("gives a completed year all twelve months", () => {
    for (const year of [y2023, y2024, y2025]) expect(year.months.length).toBe(12)
  })

  it("sums the months to the year's own total", () => {
    for (const year of years) {
      const summed = year.months.reduce((total, month) => total + month.inches, 0)
      expect(summed).toBeCloseTo(year.totalInches, 1)
    }
  })

  it("carries a running total alongside each month's own figure", () => {
    expect(y2023.months.at(-1)?.cumulativeInches).toBeCloseTo(y2023.totalInches, 1)
    for (let i = 1; i < y2023.months.length; i++) {
      expect(y2023.months[i].cumulativeInches).toBeGreaterThanOrEqual(
        y2023.months[i - 1].cumulativeInches,
      )
    }
  })

  /**
   * Every month of a finished year is whole; the current year's last one is
   * not, and the chart draws that one dashed rather than letting a month
   * read as dry because it is only two thirds over.
   */
  it("marks only the incomplete month partial", () => {
    for (const year of [y2023, y2024, y2025]) {
      expect(year.months.every((month) => !month.partial)).toBe(true)
    }
    expect(y2026.months.at(-1)?.partial).toBe(true)
    expect(y2026.months.slice(0, -1).every((month) => !month.partial)).toBe(true)
  })

  it("counts the days a partial month actually stands on", () => {
    const last = y2026.months.at(-1)!
    expect(last.days).toBeGreaterThan(0)
    expect(last.days).toBeLessThan(32)
    expect(y2026.throughDate.slice(5, 7)).toBe(String(last.month).padStart(2, "0"))
  })

  /**
   * The finding the chart exists to show, and the reason the gaps are filled
   * at all: 2026 is not the driest of the four, it is level with 2025. On the
   * city gauge alone 2026 reads 26.58 in against 2025's 30.64, four inches
   * drier; filled and read to the same day, the two sit within half an inch.
   * If this fails, re-read the page's own prose before changing the number.
   */
  it("puts 2026 level with 2025 when both are read to the same day", () => {
    expect(Math.abs(y2026.toDateInches - y2025.toDateInches)).toBeLessThan(2)
  })

  /** A part-year against three whole ones is the comparison to avoid. */
  it("reads every year to the same day for its comparable total", () => {
    for (const year of years) {
      expect(year.toDateInches).toBeLessThanOrEqual(year.totalInches + 0.01)
    }
    expect(y2026.toDateInches).toBeCloseTo(y2026.totalInches, 1)
    expect(y2025.toDateInches).toBeLessThan(y2025.totalInches)
  })

  /**
   * 2026 is the year the fill actually matters for: 36 days against 1, 10 and
   * 5 in the three before it, and 30 of those 36 in January through March.
   */
  it("counts 2026's filled days, the gaps that made the fill necessary", () => {
    expect(y2026.filledDays).toBeGreaterThan(30)
    expect(y2023.filledDays).toBeLessThanOrEqual(2)
    expect(y2024.filledDays).toBeLessThanOrEqual(12)
    expect(y2025.filledDays).toBeLessThanOrEqual(6)
  })

  it("leaves no day of the four years unread, the two gauges between them covering it", () => {
    for (const year of years) expect(year.unreadDays).toBe(0)
  })
})
