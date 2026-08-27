import { describe, it, expect } from "vitest"
import {
  addMonths,
  boardsOf,
  buildMonthGrid,
  formatLongDate,
  formatMonth,
  groupByDate,
  monthKey,
  monthsCovered,
  type Meeting,
} from "./calendar"

const meeting = (
  date: string | null,
  board = "City Council",
  kind: Meeting["kind"] = "agenda",
): Meeting => ({
  title: `${date} ${board}`,
  date,
  board,
  kind,
  fileUrl: "https://example.test/a.pdf",
  pageUrl: "/p",
})

describe("monthKey / formatMonth", () => {
  it("extracts and formats the month", () => {
    expect(monthKey("2026-08-27")).toBe("2026-08")
    expect(formatMonth("2026-08")).toBe("August 2026")
  })
})

describe("addMonths", () => {
  it("crosses year boundaries in both directions", () => {
    expect(addMonths("2025-12", 1)).toBe("2026-01")
    expect(addMonths("2026-01", -1)).toBe("2025-12")
    expect(addMonths("2025-06", 12)).toBe("2026-06")
  })
})

describe("formatLongDate", () => {
  it("names the correct weekday", () => {
    expect(formatLongDate("2026-08-27")).toBe("Thursday, August 27, 2026")
  })
})

describe("buildMonthGrid", () => {
  it("starts every week on Sunday and covers the whole month", () => {
    const weeks = buildMonthGrid("2026-08")
    expect(weeks.every((w) => w.length === 7)).toBe(true)
    const inMonth = weeks.flat().filter((c) => c.inMonth)
    expect(inMonth).toHaveLength(31)
    expect(inMonth[0].date).toBe("2026-08-01")
    expect(inMonth.at(-1)!.date).toBe("2026-08-31")
  })

  it("pads leading days from the previous month", () => {
    // 2026-08-01 is a Saturday, so the first row is six August-less cells.
    const first = buildMonthGrid("2026-08")[0]
    expect(first.filter((c) => c.inMonth)).toHaveLength(1)
    expect(first[0].date).toBe("2026-07-26")
  })

  it("handles a leap February", () => {
    const inMonth = buildMonthGrid("2024-02")
      .flat()
      .filter((c) => c.inMonth)
    expect(inMonth).toHaveLength(29)
  })

  it("marks today", () => {
    const cells = buildMonthGrid("2026-08", "2026-08-27").flat()
    expect(cells.filter((c) => c.isToday).map((c) => c.date)).toEqual(["2026-08-27"])
  })

  it("does not emit an all-outside trailing week", () => {
    const weeks = buildMonthGrid("2026-02")
    expect(weeks.at(-1)!.some((c) => c.inMonth)).toBe(true)
  })
})

describe("groupByDate", () => {
  it("buckets by date and drops undated entries", () => {
    const g = groupByDate([
      meeting("2026-08-27"),
      meeting("2026-08-27", "Planning Board"),
      meeting(null),
    ])
    expect(g.size).toBe(1)
    expect(g.get("2026-08-27")).toHaveLength(2)
  })

  it("orders entries within a day by board", () => {
    const g = groupByDate([meeting("2026-08-27", "Zoning"), meeting("2026-08-27", "Airport")])
    expect(g.get("2026-08-27")!.map((m) => m.board)).toEqual(["Airport", "Zoning"])
  })
})

describe("monthsCovered", () => {
  it("fills gaps between the first and last meeting", () => {
    expect(monthsCovered([meeting("2025-11-04"), meeting("2026-02-10")])).toEqual([
      "2025-11",
      "2025-12",
      "2026-01",
      "2026-02",
    ])
  })

  it("returns nothing when no meeting has a date", () => {
    expect(monthsCovered([meeting(null)])).toEqual([])
  })
})

describe("boardsOf", () => {
  it("lists distinct boards alphabetically", () => {
    expect(
      boardsOf([
        meeting("2026-01-01", "Zoning"),
        meeting("2026-01-02", "Airport"),
        meeting("2026-01-03", "Zoning"),
      ]),
    ).toEqual(["Airport", "Zoning"])
  })
})
