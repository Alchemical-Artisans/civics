import { describe, it, expect } from "vitest"
import {
  addMonths,
  boardsOf,
  buildMonthGrid,
  formatLongDate,
  formatMonth,
  groupByDate,
  groupIntoMeetings,
  meetingId,
  monthKey,
  easternDate,
  monthsCovered,
  withScheduled,
  type MeetingDocument,
  type ScheduledSitting,
} from "./calendar"

const doc = (
  date: string | null,
  board = "City Council",
  kind: MeetingDocument["kind"] = "agenda",
): MeetingDocument => ({
  title: `${date} ${board} ${kind}`,
  date,
  board,
  kind,
  fileUrl: `https://example.test/${date}-${board}-${kind}.pdf`,
  pageUrl: "/p",
  docId: "a-document-0000abcd",
})

/** The calendar always groups before it buckets, so tests do too. */
const meeting = (
  date: string | null,
  board = "City Council",
  kind: MeetingDocument["kind"] = "agenda",
) => groupIntoMeetings([doc(date, board, kind)])[0]

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
  it("buckets by date", () => {
    const g = groupByDate([meeting("2026-08-27"), meeting("2026-08-27", "Planning Board")])
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

  it("returns nothing when there are no meetings", () => {
    expect(monthsCovered([])).toEqual([])
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

describe("meetingId", () => {
  it("slugs a board name and appends the date", () => {
    expect(meetingId("City Council", "2026-08-25")).toBe("city-council-2026-08-25")
  })

  it("collapses punctuation rather than dropping it", () => {
    expect(meetingId("Administration & Finance Committee", "2026-01-02")).toBe(
      "administration-finance-committee-2026-01-02",
    )
  })
})

describe("groupIntoMeetings", () => {
  it("puts an agenda and its minutes into one meeting", () => {
    const meetings = groupIntoMeetings([
      doc("2026-08-25", "City Council", "minutes"),
      doc("2026-08-25", "City Council", "agenda"),
    ])
    expect(meetings).toHaveLength(1)
    expect(meetings[0].id).toBe("city-council-2026-08-25")
    expect(meetings[0].documents.map((d) => d.kind)).toEqual(["agenda", "minutes"])
  })

  it("keeps different boards on the same day apart", () => {
    const meetings = groupIntoMeetings([
      doc("2026-08-25", "City Council"),
      doc("2026-08-25", "Planning Board"),
    ])
    expect(meetings.map((m) => m.board)).toEqual(["City Council", "Planning Board"])
  })

  it("keeps the same board on different days apart", () => {
    const meetings = groupIntoMeetings([
      doc("2026-08-26", "City Council"),
      doc("2026-08-25", "City Council"),
    ])
    expect(meetings.map((m) => m.date)).toEqual(["2026-08-25", "2026-08-26"])
  })

  it("holds more than one document of a kind", () => {
    const meetings = groupIntoMeetings([
      doc("2026-08-25", "City Council", "agenda"),
      doc("2026-08-25", "City Council", "agenda"),
      doc("2026-08-25", "City Council", "minutes"),
    ])
    expect(meetings).toHaveLength(1)
    expect(meetings[0].documents).toHaveLength(3)
  })

  it("drops undated documents, and the meeting with them", () => {
    expect(groupIntoMeetings([doc(null)])).toEqual([])
  })
})

const sitting = (date: string, board = "City Council"): ScheduledSitting => ({
  board,
  date,
  time: "7:00 PM",
  source: {
    kind: "rule",
    url: "https://example.test/agendas-and-minutes/",
    intro: "Regular meetings shall be held every Tuesday at 7:00 o'clock P.M. except in:",
    exceptions: ["June there shall be a meeting on the first, third and fourth Tuesday."],
  },
})

describe("withScheduled", () => {
  it("adds a sitting the rule names and no document covers", () => {
    const meetings = withScheduled([], [sitting("2025-01-28")])
    expect(meetings).toHaveLength(1)
    expect(meetings[0].id).toBe("city-council-2025-01-28")
    expect(meetings[0].documents).toEqual([])
    expect(meetings[0].scheduled?.time).toBe("7:00 PM")
    expect(meetings[0].scheduled?.source.kind).toBe("rule")
  })

  it("leaves an expected date the city published a document for alone", () => {
    // The documents are the record; the rule only fills what they leave empty,
    // so an entry with an agenda must not pick up a `scheduled` flag that would
    // draw it as an absence.
    const documented = groupIntoMeetings([doc("2025-01-07")])
    const meetings = withScheduled(documented, [sitting("2025-01-07")])
    expect(meetings).toHaveLength(1)
    expect(meetings[0].scheduled).toBeUndefined()
    expect(meetings[0].documents).toHaveLength(1)
  })

  it("matches on board as well as date", () => {
    // Two bodies can sit the same evening, and a Conservation Commission
    // agenda says nothing about whether the Council met.
    const other = groupIntoMeetings([doc("2025-01-28", "Conservation Commission")])
    const meetings = withScheduled(other, [sitting("2025-01-28")])
    expect(meetings.map((m) => m.id)).toEqual([
      "city-council-2025-01-28",
      "conservation-commission-2025-01-28",
    ])
  })

  it("adds a date only once however many times it is listed", () => {
    const meetings = withScheduled([], [sitting("2025-01-28"), sitting("2025-01-28")])
    expect(meetings).toHaveLength(1)
  })

  it("keeps the whole list in date then board order", () => {
    const documented = groupIntoMeetings([doc("2025-02-04"), doc("2025-01-07")])
    const meetings = withScheduled(documented, [sitting("2025-01-28")])
    expect(meetings.map((m) => m.date)).toEqual(["2025-01-07", "2025-01-28", "2025-02-04"])
  })

  it("marks an expected sitting written when somebody has written it up", () => {
    const meetings = withScheduled([], [sitting("2025-01-28")], (id) => id.endsWith("2025-01-28"))
    expect(meetings[0].written).toBe(true)
  })
})

describe("easternDate", () => {
  it("names the day it is in Haverhill, not in UTC", () => {
    // 8pm on 8 September in Haverhill is already the 9th in UTC (EDT is four
    // hours behind), and a calendar that jumps a month at dinnertime for every
    // reader is the bug this exists to stop.
    const evening = new Date("2026-09-09T00:30:00Z")
    expect(evening.toISOString().slice(0, 10)).toBe("2026-09-09")
    expect(easternDate(evening)).toBe("2026-09-08")
  })

  it("follows the zone across the daylight-saving boundary", () => {
    // EDT is UTC-4, EST is UTC-5, so the hour that is still "yesterday" here
    // differs either side of the change. 1 December is EST.
    expect(easternDate(new Date("2026-12-02T04:30:00Z"))).toBe("2026-12-01")
    expect(easternDate(new Date("2026-12-02T05:30:00Z"))).toBe("2026-12-02")
  })

  it("zero-pads to the YYYY-MM-DD the rest of the file speaks", () => {
    expect(easternDate(new Date("2026-01-05T17:00:00Z"))).toBe("2026-01-05")
    expect(easternDate(new Date("2026-01-05T17:00:00Z"))).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
