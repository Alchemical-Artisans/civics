import { describe, expect, it } from "vitest"
import {
  dailyPrecipitation,
  normalByWeek,
  parsePrecipitation,
  precipitationByYear,
} from "./precipitation"

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

describe("precipitationByYear", () => {
  const years = precipitationByYear([2023, 2024, 2025, 2026])
  const [y2023, y2024, y2025, y2026] = years

  it("returns the years asked for, in order", () => {
    expect(years.map((year) => year.year)).toEqual([2023, 2024, 2025, 2026])
  })

  it("accumulates, so each week is at least the one before it", () => {
    for (const year of years) {
      for (let i = 1; i < year.weeks.length; i++) {
        expect(year.weeks[i].cumulativeInches).toBeGreaterThanOrEqual(
          year.weeks[i - 1].cumulativeInches,
        )
      }
    }
  })

  it("ends each full year on its own total", () => {
    for (const year of [y2023, y2024, y2025]) {
      expect(year.weeks.at(-1)?.cumulativeInches).toBe(year.totalInches)
      expect(year.throughDate.slice(0, 4)).toBe(String(year.year))
    }
  })

  /**
   * The finding the chart exists to show, and the reason the gaps are filled
   * at all: 2026 is not the driest of the four, it is level with 2025. On the
   * city gauge alone 2026 reads 26.58 in against 2025's 30.64, four inches
   * drier; filled, the two sit within half an inch of each other. If this
   * ever fails, re-read the chart's own caption before changing the number.
   */
  it("puts 2026 level with 2025 rather than four inches below it", () => {
    const through = y2026.throughDate.slice(5)
    const to2025 = y2025.weeks.find((week) => week.startMonthDay > through)
    expect(Math.abs(y2026.totalInches - (to2025?.cumulativeInches ?? 0))).toBeLessThan(2)
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

  it("stops the year in progress at its last read day rather than at week 53", () => {
    expect(y2026.weeks.length).toBeLessThan(53)
    expect(y2026.throughDate > "2026-10-01").toBe(true)
  })
})

describe("normalByWeek", () => {
  const normal = normalByWeek()

  it("covers the whole calendar", () => {
    expect(normal.length).toBe(53)
    expect(normal[0].startMonthDay).toBe("01-01")
  })

  /**
   * The normal file's own `annual.pcpn` is 49.58 in; accumulating the daily
   * curve a week at a time has to land on the same figure, or the bucketing
   * is dropping days.
   */
  it("accumulates to the normal file's own annual figure", () => {
    expect(normal.at(-1)?.cumulativeInches).toBeCloseTo(49.58, 1)
  })
})
