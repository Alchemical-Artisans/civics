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

  /**
   * The span is the city station's, reaching back to 1899, where the two
   * volunteer gauges begin in 2015 and 2022 -- so for most of the record the
   * mean is of one reading and equals that station's own figure.
   */
  it("is the city gauge alone before the volunteer gauges existed", () => {
    const early = byDate.get("1950-06-15")
    expect(early?.gauges).toBe(1)
    expect(early?.cityRead).toBe(true)
    expect(early?.inches).toBe(early?.cityInches)
  })

  /** Every gauge that read the day counts once, the city's own included. */
  it("averages all three gauges on a day they all read", () => {
    const day = byDate.get("2026-10-14")
    expect(day?.cityRead).toBe(true)
    expect(day?.gauges).toBeGreaterThan(1)
    expect(day?.cityInches).toBe(0.43)
  })

  it("stands on the neighbours alone where the city observer missed a day", () => {
    // 2026-01-20 falls in the January run of days the city gauge did not read.
    const day = byDate.get("2026-01-20")
    expect(day?.cityRead).toBe(false)
    expect(day?.cityInches).toBeNull()
    expect(day?.inches).not.toBeNull()
    expect(day?.gauges).toBeGreaterThanOrEqual(1)
  })

  it("keeps the city's own reading beside the mean rather than discarding it", () => {
    for (const day of days.slice(-400)) {
      if (day.cityRead) expect(day.cityInches).not.toBeNull()
      else expect(day.cityInches).toBeNull()
    }
  })

  it("never reports a figure without saying how many gauges it came from", () => {
    for (const day of days.slice(-400)) {
      if (day.inches === null) expect(day.gauges).toBe(0)
      else expect(day.gauges).toBeGreaterThan(0)
    }
  })

  it("leaves a day no gauge read unread rather than filling it from the normal", () => {
    const unread = days.filter((day) => day.gauges === 0)
    expect(unread.every((day) => day.inches === null)).toBe(true)
  })

  /** The mean must sit between the readings it was taken over, never outside. */
  it("produces a mean inside the range of the gauges it averaged", () => {
    const multi = days.filter((day) => day.gauges > 1 && day.cityInches !== null).slice(-200)
    expect(multi.length).toBeGreaterThan(0)
    for (const day of multi) expect(day.inches).toBeGreaterThanOrEqual(0)
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

  /**
   * An inch figure as a whole number of hundredths, which is what these are:
   * rainfall is published to two decimal places and every total here is
   * rounded to them. Integers so that a comparison within a stated tolerance
   * means what it says -- a tenth or a hundredth of an inch added to one of
   * these in binary floating point lands just under the figure it was meant
   * to reach, and the assertion fails on the arithmetic rather than the rain.
   */
  const hundredths = (inches: number) => Math.round(inches * 100)

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
      // Compared in hundredths of an inch, the precision the gauge publishes
      // and these figures are rounded to. The two are each rounded off their
      // own sum, so for the year still running -- where reading to date and
      // reading the whole of it are the same span -- they can land a hundredth
      // apart, which is what the tolerance is for. In inches that tolerance
      // cannot be written: 2026 reads 32.13 to date against a total of 32.12,
      // and `32.12 + 0.01` is 32.129999999999995 in binary floating point, so
      // the sum meant to admit 32.13 excluded it.
      expect(hundredths(year.toDateInches)).toBeLessThanOrEqual(hundredths(year.totalInches) + 1)
    }
    expect(y2026.toDateInches).toBeCloseTo(y2026.totalInches, 1)
    expect(y2025.toDateInches).toBeLessThan(y2025.totalInches)
  })

  /**
   * 2026 is the year the fill actually matters for: 36 days against 1, 10 and
   * 5 in the three before it, and 30 of those 36 in January through March.
   */
  it("counts the days the city gauge did not read, which is why it is averaged", () => {
    expect(y2026.filledDays).toBeGreaterThan(30)
    expect(y2023.filledDays).toBeLessThanOrEqual(2)
    expect(y2024.filledDays).toBeLessThanOrEqual(12)
    expect(y2025.filledDays).toBeLessThanOrEqual(6)
    for (const year of years) {
      expect(year.cityDays + year.filledDays + year.unreadDays).toBe(
        year.months.reduce((total, month) => total + month.days, 0),
      )
    }
  })

  /**
   * The series is an all-gauge mean, so it differs from the city station's
   * own figures on every day more than one gauge reported -- not only on the
   * days the city gauge missed. Keeping both is what makes that checkable.
   */
  it("keeps the city gauge's own total beside the averaged one", () => {
    for (const year of years) {
      expect(year.cityOnlyToDateInches).toBeGreaterThan(0)
      expect(year.cityOnlyToDateInches).not.toBe(year.toDateInches)
    }
  })

  it("leaves no day of the four years unread, the two gauges between them covering it", () => {
    for (const year of years) expect(year.unreadDays).toBe(0)
  })
})
