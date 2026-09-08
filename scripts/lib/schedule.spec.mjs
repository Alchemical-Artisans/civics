import { describe, it, expect } from "vitest"
import {
  CALENDAR_PAGES,
  parseCalendarDate,
  parseMeetingCalendars,
  parseMeetingRules,
  parseScheduleLinks,
  parseScheduleText,
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
    expect(calendar.sittings).toEqual([
      { date: "2026-01-08" },
      { date: "2026-02-05" },
      { date: "2026-03-05" },
      { date: "2026-07-02" },
      { date: "2026-08-06" },
      { date: "2026-09-03" },
    ])
    // The page prints dates and no hour, and nothing beside them to carry.
    expect(calendar.time).toBeUndefined()
  })

  it("takes one named column where the table holds more than sittings", () => {
    // The other two columns are real dates and neither is a meeting: taking the
    // whole table would treble the board's calendar.
    const [calendar] = parseMeetingCalendars(conservationHtml, conservationPage)
    expect(calendar.sittings.map((s) => s.date)).toEqual(["2026-01-08", "2026-01-29", "2027-01-07"])
    expect(calendar.heading).toBe("2026 Meeting Schedule")
    expect(calendar.time).toBe("7:15 PM")
  })

  it("keeps the row's other columns beside the sitting, under their own labels", () => {
    // Not sittings, but what the board published about the day: the deadline
    // for filing to be heard at it, and where it moves if postponed.
    const [calendar] = parseMeetingCalendars(conservationHtml, conservationPage)
    expect(calendar.sittings[0]).toEqual({
      date: "2026-01-08",
      related: [
        { label: "Submittal Date", date: "2025-12-18" },
        { label: "Postponement Date", date: "2026-01-15" },
      ],
    })
    // The year comes from the heading where a cell leaves it off, which works
    // because the board writes it out on exactly the rows that need it -- the
    // first submittal falls in the previous year, the last postponement in the
    // next, and both are printed in full.
    expect(calendar.sittings.at(-1).related).toEqual([
      { label: "Submittal Date", date: "2026-12-17" },
      { label: "Postponement Date", date: "2027-01-14" },
    ])
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

const planningPage = CALENDAR_PAGES.find((p) => p.board === "Planning Board")

/** The board page's own two sections: this year's schedules, then the archive. */
const planningHtml = `
<p>Planning Board Meeting Schedules</p>
<a href="https://cdn.test/pb-2026.pdf">Planning Board Meeting Schedule 2026</a>
<a href="https://cdn.test/pb-2025.pdf">Planning Board Meeting Schedule 2025</a>
<p>Planning Board Meeting Schedule Archive</p>
<a href="https://cdn.test/old-2024.pdf">Planning Board Meeting Schedule 2024</a>
<a href="https://cdn.test/old-2025.pdf">Planning Board Meeting Schedule 2025</a>
<a href="https://cdn.test/agenda.pdf">Planning Board Agenda 9.9.26</a>
`

/** `pdftotext -layout` output, as the labelled blocks the PDF is written in. */
const planningText = [
  "                           2026---PLANNING BOARD---2026",
  "      Meeting Date:                                          January 14, 2026",
  "      Escrows-deadline                                       December 17 , 2026",
  "      Public Hearings-Cut Off Date                           12/3/26-Hearing Cut Off Date.",
  "      ADVERTISE:                                             12/25/26 & 1/1/26-Advertise dates",
  "",
  "      Meeting Date:                                          November 11, 2026",
  "                                                             NO MEETING VETERANS DAY!",
  "      Escrows-deadline                                       October 21,2026",
  "      ADVERTISE:                                             11/26/26 & 12/3/26",
  "",
  "      Meeting Date:                                          December 9, 2026",
  "      Escrows-deadline                                       November 18, 2026",
].join("\n")

describe("parseScheduleLinks", () => {
  it("finds a schedule PDF per year, newest section first", () => {
    const links = parseScheduleLinks(planningHtml, planningPage.pdf)
    expect(links.map((l) => l.year)).toEqual([2026, 2025, 2024])
  })

  it("keeps the first link for a year, not the archive's copy", () => {
    // The page lists 2025 twice -- once at the top and again in the archive.
    // They are the same schedule, and the one the page leads with is the one.
    const links = parseScheduleLinks(planningHtml, planningPage.pdf)
    expect(links.find((l) => l.year === 2025).url).toBe("https://cdn.test/pb-2025.pdf")
  })

  it("ignores PDFs that are not schedules", () => {
    const links = parseScheduleLinks(planningHtml, planningPage.pdf)
    expect(links.some((l) => l.url.endsWith("agenda.pdf"))).toBe(false)
  })
})

describe("parseScheduleText", () => {
  it("reads the Meeting Date line of each block", () => {
    const { sittings } = parseScheduleText(planningText, 2026)
    expect(sittings.map((s) => s.date)).toEqual(["2026-01-14", "2026-12-09"])
  })

  it("drops a date the schedule itself calls off, and reports it", () => {
    // 11 November carries "NO MEETING VETERANS DAY!" on the line beneath it.
    // Putting it on the calendar would advertise a meeting already called off.
    const { sittings, cancelled } = parseScheduleText(planningText, 2026)
    expect(cancelled).toEqual(["2026-11-11"])
    expect(sittings.map((s) => s.date)).not.toContain("2026-11-11")
  })

  it("reads no dates from the other three labelled lines", () => {
    // Deliberate: this board's own copies of them are full of slips -- an
    // escrow deadline of "December 17 , 2026" against a meeting in January
    // 2026 -- so parsing them would publish the city's typos as fact.
    const { sittings } = parseScheduleText(planningText, 2026)
    expect(sittings.every((s) => !s.related)).toBe(true)
    expect(sittings).toHaveLength(2)
  })
})
