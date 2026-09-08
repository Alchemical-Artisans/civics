import { describe, it, expect } from "vitest"
import {
  RULE_AS_READ,
  expectedSittings,
  meetingCalendars,
  meetingRules,
  sittingsIn,
} from "./schedule"

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

describe("the scraped calendars", () => {
  const find = (board: string) => meetingCalendars().find((c) => c.board === board)

  it("gives the License Commission a date a month", () => {
    // Twelve dates, one per month, is the shape the Commission has published
    // every year. A parse that half-worked -- one column of the two-column
    // table, say -- would show up here as six.
    const commission = find("License Commission")
    expect(commission).toBeDefined()
    expect(commission!.dates).toHaveLength(12)
    expect(new Set(commission!.dates.map((d) => d.slice(0, 7))).size).toBe(12)
    // The page prints dates and no hour.
    expect(commission!.time).toBeUndefined()
  })

  it("gives the Conservation Commission a Thursday every three weeks", () => {
    // The board's own description of its schedule, and the cheapest check that
    // the middle column was the one read: the filing deadlines two weeks either
    // side of it are Thursdays too, but a fortnight apart rather than three
    // weeks. Reading the wrong column would fail the gap and not the weekday.
    const commission = find("Conservation Commission")
    expect(commission).toBeDefined()
    expect(commission!.time).toBe("7:15 PM")
    const days = commission!.dates.map((d) => Date.parse(`${d}T00:00:00Z`) / 86_400_000)
    for (const [i, day] of days.entries()) {
      expect(new Date(day * 86_400_000).getUTCDay()).toBe(4)
      if (i) expect(day - days[i - 1]).toBeGreaterThanOrEqual(21)
    }
  })

  it("lets a schedule run past the year it is headed with", () => {
    // The Conservation Commission's last row is the first sitting of the next
    // year, printed with its own year. Clamping to the heading would move it.
    const commission = find("Conservation Commission")!
    expect(commission.dates.at(-1)!.slice(0, 4)).toBe(String(commission.year + 1))
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

  it("does not let the summer run reach into September", () => {
    // Read literally, "until the second Tuesday after Labor Day" would add one
    // more fortnightly sitting before weekly resumes -- 8 September 2026, and
    // 2 September 2025. The Council's own published 2025 schedule has neither:
    // its summer run ends on 19 August and September begins at the return to
    // weekly. September is the third clause's, and it says the month's meetings
    // start with the second Tuesday after Labor Day.
    expect(sittingsIn(2026)).not.toContain("2026-09-08")
    expect(sittingsIn(2025)).not.toContain("2025-09-02")
    expect(
      sittingsIn(2025)
        .filter((d) => d.startsWith("2025-08"))
        .at(-1),
    ).toBe("2025-08-19")
  })

  it("returns to weekly on the second Tuesday after Labor Day", () => {
    // Labor Day 2026 is Monday 7 September, so the Tuesday of that week is the
    // first after it and the 15th is the second -- the day weekly resumes.
    expect(sittingsIn(2026).filter((d) => d.startsWith("2026-09"))).toEqual([
      "2026-09-15",
      "2026-09-22",
      "2026-09-29",
    ])
  })

  it("counts the Labor Day week's own Tuesday as the first after it", () => {
    // The counting is what the Council's published 2025 schedule confirms.
    // Labor Day fell on 1 September 2025, so this gives 9 September -- and that
    // schedule is headed "Amended - removal of 9/9/25 due to municipal
    // preliminary election", which only makes sense if 9 September had been
    // scheduled. What the amended sheet prints, 16/23/30, is what is left.
    expect(sittingsIn(2025).filter((d) => d.startsWith("2025-09"))).toEqual([
      "2025-09-09",
      "2025-09-16",
      "2025-09-23",
      "2025-09-30",
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
  it("projects forward only", () => {
    // Never backwards: the rule over-generates against the schedule the Council
    // actually adopts, so for a day already past the documents are the better
    // authority and a rule-Tuesday with nothing on it is far more likely to be
    // a Tuesday the Council never sat. See schedule.ts.
    const sittings = expectedSittings("2026-09-08")
    expect(sittings.every((s) => s.date >= "2026-09-08")).toBe(true)
    expect(sittings[0].date).toBe("2026-09-15")
  })

  it("stops projecting the rule at the end of the year", () => {
    // The cap is the rule's, being a projection, and not the whole list's.
    const rules = expectedSittings("2026-09-08").filter((s) => s.source.kind === "rule")
    expect(rules.at(-1)!.date).toBe("2026-12-29")
  })

  it("carries the evidence itself onto every sitting", () => {
    // The source is the evidence for the entry, so the meeting page can show it
    // rather than paraphrasing why the sitting is there.
    for (const sitting of expectedSittings("2026-09-08")) {
      expect(sitting.source.url).toMatch(/^https:\/\/www\.haverhillma\.gov\//)
      if (sitting.source.kind === "rule") {
        expect(sitting.board).toBe("City Council")
        expect(sitting.time).toBe("7:00 PM")
        expect(sitting.source.intro).toBe(RULE_AS_READ.intro)
      } else {
        expect(sitting.source.heading).toBeTruthy()
        // An hour only where the page states one. A board that prints dates and
        // nothing else gets none: the hour on its last agenda is not evidence
        // about a sitting that has not happened.
        expect(sitting.time).toBe(meetingCalendars().find((c) => c.board === sitting.board)!.time)
      }
    }
  })

  it("takes a printed calendar's dates exactly as printed", () => {
    // Nothing is interpreted for a board that prints its dates, so the only
    // thing to check is that every date it prints and nothing else comes back.
    for (const calendar of meetingCalendars()) {
      const mine = expectedSittings("2026-09-08")
        .filter((s) => s.board === calendar.board)
        .map((s) => s.date)
      expect(mine).toEqual(calendar.dates.filter((d) => d >= "2026-09-08"))
    }
  })

  it("carries a printed calendar past the end of its own year", () => {
    // Only the Council's rule is capped at year end, being a projection. A date
    // the city has actually published stands however far ahead it is.
    const dates = expectedSittings("2026-09-08").map((s) => s.date)
    expect(dates.at(-1)!.startsWith("2027")).toBe(true)
  })

  it("puts every board's sittings in one list, in date order", () => {
    const sittings = expectedSittings("2026-09-08")
    expect(sittings.map((s) => s.date)).toEqual([...sittings.map((s) => s.date)].sort())
    expect(new Set(sittings.map((s) => s.board))).toEqual(
      new Set(["City Council", "Conservation Commission", "License Commission"]),
    )
  })

  it("is empty once every published date is behind us", () => {
    expect(expectedSittings("2027-12-30")).toEqual([])
  })
})
