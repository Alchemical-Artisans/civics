import { describe, it, expect } from "vitest"
import {
  CALENDAR_PAGES,
  parseCalendarDate,
  parseMeetingCalendars,
  parseMeetingRules,
  parseTime,
} from "./schedule.mjs"

const licensePage = CALENDAR_PAGES.find((p) => p.board === "License Commission")
const conservationPage = CALENDAR_PAGES.find((p) => p.board === "Conservation Commission")

/** The shape the page actually serves, trimmed to what the parser looks at. */
const page = `
<section class="content component usn_cmp_text base-bg">
  <div class="text base-text">
    <h2>City Council</h2>
    <p>Regular meetings of the City Council shall be held every Tuesday at 7:00 o&#39;clock P.M. except in:</p>
    <ul>
      <li>June there shall be a meeting on the first, third and fourth Tuesday.</li>
      <li>From July until the second Tuesday after Labor&nbsp;Day, the Council shall meet every other week.</li>
    </ul>
  </div>
</section>
<section class="content component usn_cmp_documentlisting">
  <h2>Agendas and Meeting Minutes</h2>
  <p>Search all files in this listing.</p>
</section>
`

describe("parseMeetingRules", () => {
  it("reads the board, the sentence and the exceptions", () => {
    const rules = parseMeetingRules(page)
    expect(rules).toHaveLength(1)
    expect(rules[0].board).toBe("City Council")
    expect(rules[0].intro).toBe(
      "Regular meetings of the City Council shall be held every Tuesday at 7:00 o'clock P.M. except in:",
    )
    expect(rules[0].exceptions).toHaveLength(2)
  })

  it("decodes entities and collapses the markup's whitespace", () => {
    // The page prints a typographic apostrophe as an entity and a non-breaking
    // space inside "Labor Day"; both have to survive as ordinary characters,
    // because the wording is compared against a pinned copy on the site side.
    const [rule] = parseMeetingRules(page)
    expect(rule.intro).toContain("o'clock")
    expect(rule.exceptions[1]).toContain("Labor Day")
    expect(rule.exceptions[1]).not.toMatch(/\s{2,}/)
  })

  it("ignores a text block with no list, and the listing's own headings", () => {
    // The rule is the list. A heading over a paragraph of something else is
    // not one, and the document listing section is not a text block at all.
    expect(parseMeetingRules(page).map((r) => r.board)).toEqual(["City Council"])
    expect(
      parseMeetingRules(
        `<section class="usn_cmp_text"><h2>Archives</h2><p>Use the links.</p></section>`,
      ),
    ).toEqual([])
  })

  it("returns nothing when the page's markup changes shape", () => {
    // The update script treats an empty result as a failure rather than writing
    // an empty file, so this is the signal that the scrape needs revisiting.
    expect(parseMeetingRules("<div><h2>City Council</h2><ul><li>Tuesdays</li></ul></div>")).toEqual(
      [],
    )
  })
})

/** The License Commission's table, in the two columns the page lays it out in. */
const licenseHtml = `
<h2>CALENDAR OF MEETINGS FOR 2026</h2>
<table border="1">
<tbody>
<tr><td>January 8, 2026</td><td>July 2, 2026</td></tr>
<tr><td>February 5, 2026</td><td>August 6, 2026</td></tr>
<tr><td>March 5, 2026</td><td>September 3, 2026</td></tr>
</tbody>
</table>
<h2>ABCC Advisory</h2>
<p>Not a calendar.</p>
`

/** The Conservation Commission's: prose, then three columns with a header row. */
const conservationHtml = `
<p class="heading">2026 Meeting Schedule</p>
<div class="text"><p>The Commission generally meets every three (3) weeks on Thursday evenings at
7:15 PM (unless otherwise posted), however, sometimes the timing of holidays impacts this
schedule.</p>
<p><strong>Filing deadlines are 11:00AM two weeks prior to the Meeting Date.</strong></p></div>
<table border="1">
<tbody>
<tr><td><strong>Submittal Date</strong></td><td><strong>Meeting Date</strong></td><td><strong>Postponement Date</strong></td></tr>
<tr><td>12/18/2025</td><td><strong>1/8/2026</strong></td><td>1/15/2026</td></tr>
<tr><td>1/15</td><td><strong>1/29</strong></td><td>2/5</td></tr>
<tr><td>12/17</td><td><strong>1/7/2027</strong></td><td>1/14/2027</td></tr>
</tbody>
</table>
`

describe("parseCalendarDate", () => {
  it("reads the long form the License Commission prints", () => {
    expect(parseCalendarDate("January 8, 2026", 2026)).toBe("2026-01-08")
    expect(parseCalendarDate("  December 3, 2026 ", 2026)).toBe("2026-12-03")
  })

  it("reads the slashed form, taking the year from the heading when absent", () => {
    expect(parseCalendarDate("1/8/2026", 2026)).toBe("2026-01-08")
    expect(parseCalendarDate("1/29", 2026)).toBe("2026-01-29")
    expect(parseCalendarDate("12/10", 2026)).toBe("2026-12-10")
  })

  it("lets an explicit year win over the heading's", () => {
    // The Conservation Commission's last row is the first sitting of the next
    // year. Forcing the heading's year onto it would move the meeting.
    expect(parseCalendarDate("1/7/2027", 2026)).toBe("2027-01-07")
  })

  it("refuses a day that does not exist in its month", () => {
    // A round trip catches the rollover `new Date` would otherwise perform
    // silently, turning a misread into a plausible-looking date.
    expect(parseCalendarDate("September 31, 2026", 2026)).toBeNull()
    expect(parseCalendarDate("2/30", 2026)).toBeNull()
  })

  it("refuses anything that is not a date at all", () => {
    for (const junk of ["", "Meeting Date", "Smarch 4, 2026", "8 January 2026", "1/"]) {
      expect(parseCalendarDate(junk, 2026)).toBeNull()
    }
  })
})

describe("parseTime", () => {
  it("takes the hour the page says the board sits at", () => {
    expect(parseTime("meets on Thursday evenings at 7:15 PM (unless otherwise posted)")).toBe(
      "7:15 PM",
    )
    expect(parseTime("held every Tuesday at 7:00 o'clock P.M. except in:")).toBe("7:00 PM")
  })

  it("is not fooled by a filing deadline in the same paragraph", () => {
    // The anchor is "at". The Commission's own "Filing deadlines are 11:00AM"
    // sits beside its meeting time and must not be read as one.
    expect(
      parseTime("Filing deadlines are 11:00AM two weeks prior to the Meeting Date."),
    ).toBeNull()
    expect(parseTime("meets at 7:15 PM. Filing deadlines are 11:00AM two weeks prior.")).toBe(
      "7:15 PM",
    )
  })

  it("is null when the page states no hour", () => {
    expect(parseTime("CALENDAR OF MEETINGS FOR 2026")).toBeNull()
  })
})

describe("parseMeetingCalendars", () => {
  it("reads a whole plain table, both columns, in date order", () => {
    // The page runs January beside July, so document order is not date order.
    const [calendar] = parseMeetingCalendars(licenseHtml, licensePage)
    expect(calendar.year).toBe(2026)
    expect(calendar.heading).toBe("CALENDAR OF MEETINGS FOR 2026")
    expect(calendar.dates).toEqual([
      "2026-01-08",
      "2026-02-05",
      "2026-03-05",
      "2026-07-02",
      "2026-08-06",
      "2026-09-03",
    ])
    // The page prints dates and no hour.
    expect(calendar.time).toBeUndefined()
  })

  it("takes one named column where the table holds more than sittings", () => {
    // The other two columns are real dates and neither is a meeting: taking the
    // whole table would treble the board's calendar.
    const [calendar] = parseMeetingCalendars(conservationHtml, conservationPage)
    expect(calendar.dates).toEqual(["2026-01-08", "2026-01-29", "2027-01-07"])
    expect(calendar.heading).toBe("2026 Meeting Schedule")
    expect(calendar.time).toBe("7:15 PM")
  })

  it("finds nothing rather than guessing when the named column is gone", () => {
    // Three date columns and no way to tell which is the meeting. Guessing
    // would put filing deadlines on the calendar as sittings.
    const renamed = conservationHtml.replace(
      "Meeting Date</strong></td><td>",
      "Meeting</strong></td><td>",
    )
    expect(parseMeetingCalendars(renamed, conservationPage)).toEqual([])
  })

  it("takes only the table under its own heading", () => {
    expect(parseMeetingCalendars(licenseHtml, licensePage)).toHaveLength(1)
    expect(
      parseMeetingCalendars(`<table><tr><td>January 8, 2026</td></tr></table>`, licensePage),
    ).toEqual([])
  })

  it("returns nothing when the heading moves", () => {
    // The update script treats an empty result as a failure rather than writing
    // a file that would empty the calendar of every upcoming sitting.
    expect(
      parseMeetingCalendars(
        licenseHtml.replace("CALENDAR OF MEETINGS FOR", "Meetings in"),
        licensePage,
      ),
    ).toEqual([])
  })
})
