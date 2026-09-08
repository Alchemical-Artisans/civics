import { describe, it, expect } from "vitest"
import { parseLongDate, parseMeetingCalendars, parseMeetingRules } from "./schedule.mjs"

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

/** The Commission's own table, in the two columns the page lays it out in. */
const commissionPage = `
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

describe("parseLongDate", () => {
  it("reads the form the page prints", () => {
    expect(parseLongDate("January 8, 2026")).toBe("2026-01-08")
    expect(parseLongDate("  December 3, 2026 ")).toBe("2026-12-03")
  })

  it("refuses a day that does not exist in its month", () => {
    // A round trip catches the rollover `new Date` would otherwise perform
    // silently, turning a misread into a plausible-looking date.
    expect(parseLongDate("September 31, 2026")).toBeNull()
    expect(parseLongDate("February 30, 2026")).toBeNull()
  })

  it("refuses anything that is not a date at all", () => {
    expect(parseLongDate("")).toBeNull()
    expect(parseLongDate("Hours")).toBeNull()
    expect(parseLongDate("Smarch 4, 2026")).toBeNull()
    expect(parseLongDate("8 January 2026")).toBeNull()
  })
})

describe("parseMeetingCalendars", () => {
  it("reads the whole table, both columns, in date order", () => {
    // The page runs January beside July, so document order is not date order.
    const [calendar] = parseMeetingCalendars(commissionPage)
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
  })

  it("takes only the table under its own heading", () => {
    // The page carries other tables -- hours, phone, the clerk's name -- and a
    // second heading after this one. Only the calendar's own table is read.
    expect(parseMeetingCalendars(commissionPage)).toHaveLength(1)
    expect(parseMeetingCalendars(`<table><tr><td>January 8, 2026</td></tr></table>`)).toEqual([])
  })

  it("returns nothing when the heading moves", () => {
    // The update script treats an empty result as a failure rather than writing
    // a file that would empty the calendar of every upcoming sitting.
    expect(
      parseMeetingCalendars(commissionPage.replace("CALENDAR OF MEETINGS FOR", "Meetings in")),
    ).toEqual([])
  })
})
