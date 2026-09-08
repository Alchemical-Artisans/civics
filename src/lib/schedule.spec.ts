import { describe, it, expect } from "vitest"
import { RULE_AS_READ, expectedSittings, meetingRules, sittingsIn } from "./schedule"

describe("the scraped rule", () => {
  it("still says what the date logic was written against", () => {
    // The one test that matters most here. `sittingsIn` is a reading of prose,
    // and the reading is only valid for the prose it was made about -- so the
    // wording is pinned. When `schedule:update` brings back different words
    // this fails, and a person re-reads the rule before the calendar projects
    // another Tuesday from it.
    const council = meetingRules().find((r) => r.board === RULE_AS_READ.board)
    expect(council).toBeDefined()
    expect(council!.intro).toBe(RULE_AS_READ.intro)
    expect(council!.exceptions).toEqual([...RULE_AS_READ.exceptions])
  })
})

describe("sittingsIn", () => {
  it("meets every Tuesday outside the exceptions", () => {
    const jan = sittingsIn(2026).filter((d) => d.startsWith("2026-01"))
    expect(jan).toEqual(["2026-01-06", "2026-01-13", "2026-01-20", "2026-01-27"])
  })

  it("takes the first, third and fourth Tuesday of a four-Tuesday June", () => {
    // June 2026 has Tuesdays on the 2nd, 9th, 16th, 23rd and 30th -- five, so
    // the rule's own "then it will be first, third and fifth" applies.
    expect(sittingsIn(2026).filter((d) => d.startsWith("2026-06"))).toEqual([
      "2026-06-02",
      "2026-06-16",
      "2026-06-30",
    ])
    // June 2025 has four: the 3rd, 10th, 17th and 24th.
    expect(sittingsIn(2025).filter((d) => d.startsWith("2025-06"))).toEqual([
      "2025-06-03",
      "2025-06-17",
      "2025-06-24",
    ])
  })

  it("runs every other week from the second Tuesday of July", () => {
    // The four dates the city has published agendas for, exactly.
    const summer = sittingsIn(2026).filter((d) => d >= "2026-07" && d < "2026-09")
    expect(summer).toEqual(["2026-07-14", "2026-07-28", "2026-08-11", "2026-08-25"])
  })

  it("returns to weekly on the second Tuesday after Labor Day", () => {
    // Labor Day 2026 is Monday 7 September, so the Tuesday of that week is the
    // first after it and the 15th is the second -- the day weekly resumes. The
    // 8th is still the summer run, being a fortnight after 25 August.
    expect(sittingsIn(2026).filter((d) => d.startsWith("2026-09"))).toEqual([
      "2026-09-08",
      "2026-09-15",
      "2026-09-22",
      "2026-09-29",
    ])
  })

  it("names no date twice and keeps them in order", () => {
    const dates = sittingsIn(2026)
    expect(dates).toEqual([...new Set(dates)].sort())
  })

  it("names only Tuesdays", () => {
    for (const date of sittingsIn(2026)) {
      const [y, m, d] = date.split("-").map(Number)
      expect(new Date(Date.UTC(y, m - 1, d)).getUTCDay()).toBe(2)
    }
  })
})

describe("expectedSittings", () => {
  it("projects forward only, to the end of the year", () => {
    // Never backwards: the rule over-generates against the schedule the Council
    // actually adopts, so for a day already past the documents are the better
    // authority and a rule-Tuesday with nothing on it is far more likely to be
    // a Tuesday the Council never sat. See schedule.ts.
    const dates = expectedSittings("2026-09-08").map((s) => s.date)
    expect(dates[0]).toBe("2026-09-08")
    expect(dates.at(-1)).toBe("2026-12-29")
    expect(dates.every((d) => d >= "2026-09-08")).toBe(true)
  })

  it("carries the rule itself onto every sitting", () => {
    // The rule is the evidence for the entry, so the meeting page can quote it
    // rather than paraphrasing why the sitting is there.
    for (const sitting of expectedSittings("2026-09-08")) {
      expect(sitting.board).toBe("City Council")
      expect(sitting.time).toBe("7:00 PM")
      expect(sitting.rule.intro).toBe(RULE_AS_READ.intro)
      expect(sitting.rule.url).toMatch(/^https:\/\/www\.haverhillma\.gov\//)
    }
  })

  it("is empty once the year is out", () => {
    expect(expectedSittings("2026-12-30")).toEqual([])
  })
})
