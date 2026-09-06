import { describe, it, expect } from "vitest"
import { eventForMeeting, icsStamp, parseClockTime, toIcs } from "./ics"
import type { Meeting } from "./calendar"

const meeting = (over: Partial<Meeting> = {}): Meeting => ({
  id: "conservation-commission-2026-09-17",
  board: "Conservation Commission",
  date: "2026-09-17",
  documents: [],
  written: true,
  ...over,
})

const details = {
  time: "7:15 P.M.",
  location: { name: "4 Summer Street, City Hall Room 301, Haverhill, MA 01830", mapQuery: "x" },
  remote: { url: "https://tinyurl.com/x", meetingId: "243 284 796 220 8", passcode: "oz3UT23Q" },
}

describe("parseClockTime", () => {
  it("reads the forms the agendas actually print", () => {
    expect(parseClockTime("7:15 P.M.")).toEqual([19, 15])
    expect(parseClockTime("7:00 PM")).toEqual([19, 0])
    expect(parseClockTime("9:30 A.M.")).toEqual([9, 30])
    expect(parseClockTime("12:00 AM")).toEqual([0, 0])
    expect(parseClockTime("12:30 PM")).toEqual([12, 30])
  })

  it("returns null for anything it cannot be sure of", () => {
    expect(parseClockTime(undefined)).toBeNull()
    expect(parseClockTime("noon")).toBeNull()
    expect(parseClockTime("7 PM")).toBeNull()
  })
})

describe("eventForMeeting", () => {
  it("runs two hours from a stated start", () => {
    const e = eventForMeeting(meeting(), details)
    expect(e.allDay).toBe(false)
    expect(e.start).toBe("20260917T191500")
    expect(e.end).toBe("20260917T211500")
    expect(e.title).toBe("Haverhill Conservation Commission")
    expect(e.location).toBe("4 Summer Street, City Hall Room 301, Haverhill, MA 01830")
    expect(e.uid).toBe("conservation-commission-2026-09-17@haverhill.alchemicalartisans.com")
    expect(e.url).toBe(
      "https://haverhill.alchemicalartisans.com/calendar/meetings/conservation-commission-2026-09-17",
    )
    expect(e.description).toContain("Join remotely: https://tinyurl.com/x")
    expect(e.description).toContain("Passcode: oz3UT23Q")
    expect(e.description).toContain(e.url)
  })

  it("is an all-day entry when the document states no time", () => {
    const e = eventForMeeting(meeting())
    expect(e.allDay).toBe(true)
    expect(e.start).toBe("20260917")
    expect(e.end).toBe("20260918")
    expect(e.location).toBeUndefined()
  })
})

describe("toIcs", () => {
  const stamp = "20260906T120000Z"

  it("writes a timezone-pinned event, with the zone it names", () => {
    const ics = toIcs(eventForMeeting(meeting(), details), stamp)
    expect(ics).toContain("BEGIN:VCALENDAR")
    expect(ics).toContain("BEGIN:VTIMEZONE\r\nTZID:America/New_York")
    expect(ics).toContain("DTSTART;TZID=America/New_York:20260917T191500")
    expect(ics).toContain("DTEND;TZID=America/New_York:20260917T211500")
    expect(ics).toContain(`DTSTAMP:${stamp}`)
    // The comma in the address is escaped, per RFC 5545.
    expect(ics).toContain("LOCATION:4 Summer Street\\, City Hall Room 301\\, Haverhill\\, MA 01830")
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true)
  })

  it("uses CRLF and folds a line past 75 octets", () => {
    const ics = toIcs(eventForMeeting(meeting(), details), stamp)
    for (const line of ics.split("\r\n")) expect(line.length).toBeLessThanOrEqual(75)
    // A folded line is joined by CRLF + a leading space.
    expect(ics).toMatch(/\r\n /)
  })

  it("drops the timezone block for an all-day event", () => {
    const ics = toIcs(eventForMeeting(meeting()), stamp)
    expect(ics).not.toContain("VTIMEZONE")
    expect(ics).toContain("DTSTART;VALUE=DATE:20260917")
    expect(ics).toContain("DTEND;VALUE=DATE:20260918")
  })
})

describe("icsStamp", () => {
  it("is compact UTC", () => {
    expect(icsStamp(new Date("2026-09-06T12:34:56Z"))).toBe("20260906T123456Z")
  })
})
