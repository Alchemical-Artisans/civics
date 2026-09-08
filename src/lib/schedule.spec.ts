import { describe, it, expect } from "vitest"
import { scheduledSittings, sittingsOf, type Schedule } from "./schedule"
import raw from "./data/schedule.json"

const schedule: Schedule = {
  board: "City Council",
  year: 2025,
  document: { title: "Schedule", pageUrl: "/p", fileUrl: "https://example.test/s.pdf" },
  time: "7:00 PM",
  location: { name: "Council Chambers Room 202", mapQuery: "4 Summer Street, Haverhill, MA 01830" },
  months: [
    { month: 1, days: [7, 14] },
    { month: 12, days: [2] },
  ],
}

describe("sittingsOf", () => {
  it("expands each month's days into zero-padded ISO dates", () => {
    expect(sittingsOf(schedule).map((s) => s.date)).toEqual([
      "2025-01-07",
      "2025-01-14",
      "2025-12-02",
    ])
  })

  it("carries the head of the schedule onto every date it lists", () => {
    // The time and room are printed once for the whole year, so every sitting
    // gets them -- that is what lets a meeting page state when and where a
    // sitting is before any agenda exists.
    for (const sitting of sittingsOf(schedule)) {
      expect(sitting.board).toBe("City Council")
      expect(sitting.time).toBe("7:00 PM")
      expect(sitting.location?.name).toBe("Council Chambers Room 202")
      expect(sitting.document.fileUrl).toBe("https://example.test/s.pdf")
    }
  })

  it("orders by date regardless of how the document lists its months", () => {
    const shuffled: Schedule = { ...schedule, months: [...schedule.months].reverse() }
    expect(sittingsOf(shuffled).map((s) => s.date)).toEqual([
      "2025-01-07",
      "2025-01-14",
      "2025-12-02",
    ])
  })
})

describe("the transcribed schedules", () => {
  it("lists only dates inside the year it claims", () => {
    // A day that does not exist in its month, or a month outside 1-12, is a
    // transcription slip rather than something the city published, and this is
    // the cheapest place to catch one.
    for (const s of raw.schedules) {
      for (const { month, days } of s.months) {
        expect(month).toBeGreaterThanOrEqual(1)
        expect(month).toBeLessThanOrEqual(12)
        for (const day of days) {
          const dt = new Date(Date.UTC(s.year, month - 1, day))
          expect(dt.getUTCFullYear()).toBe(s.year)
          expect(dt.getUTCMonth()).toBe(month - 1)
          expect(dt.getUTCDate()).toBe(day)
        }
      }
    }
  })

  it("puts the City Council on Tuesdays through 2025", () => {
    // Every date the amended 2025 schedule prints is a Tuesday. Not a rule the
    // code enforces -- a board may sit any day it likes -- but it is true of
    // what is transcribed, and a mistyped day would almost certainly break it.
    const council = scheduledSittings().filter((s) => s.date.startsWith("2025-"))
    expect(council).toHaveLength(35)
    for (const sitting of council) {
      const [y, m, d] = sitting.date.split("-").map(Number)
      expect(new Date(Date.UTC(y, m - 1, d)).getUTCDay()).toBe(2)
    }
  })
})
