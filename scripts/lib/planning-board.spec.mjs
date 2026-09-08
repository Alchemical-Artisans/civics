import { describe, it, expect } from "vitest"
import { documentFromLink, parseDocumentLinks } from "./planning-board.mjs"

/** The page's own shape: sections of links, some of them not documents. */
const page = `
<p>Planning Board Meeting Schedules</p>
<a href="https://cdn.test/sched-2026.pdf">Planning Board Meeting Schedule 2026</a>
<p>Planning Board Agenda 2026</p>
<a href="https://cdn.test/a-21126.pdf">Planning Board Agenda 2.11.26</a>
<a>Planning Board Agenda 1.14.26 NO MEETING</a>
<a href="https://cdn.test/m-21126.pdf">Planning Board Meeting Minutes 2.11.26</a>
<p>Archives</p>
<a href="https://cdn.test/a-11817.pdf">Planning Board Agenda 11-8-17</a>
<a href="https://cdn.test/a-91119.pdf">Planning Board Agenda 9-11-19 Amended</a>
<a href="https://cdn.test/a-21126.pdf">Planning Board Agenda 2.11.26</a>
<a href="https://cdn.test/zoning.pdf">Zoning Map (Large)</a>
<a href="https://cdn.test/section_1.pdf">Section - 1</a>
`

describe("documentFromLink", () => {
  it("takes an agenda or minutes with a date in its label", () => {
    expect(documentFromLink("Planning Board Agenda 2.11.26", "u")).toMatchObject({
      title: "Planning Board Agenda 2.11.26",
      fileUrl: "u",
    })
    expect(documentFromLink("Planning Board Meeting Minutes 7-11-18", "u")).not.toBeNull()
  })

  it("refuses the schedules, which are not about one sitting", () => {
    // They go to `schedule.json` instead, as the dates the board expects to
    // sit on. A schedule on the calendar as a document would be undated.
    expect(documentFromLink("Planning Board Meeting Schedule 2026", "u")).toBeNull()
  })

  it("refuses everything else the page links", () => {
    for (const label of ["Zoning Map (Large)", "Section - 1", "Form A (Approval Not Required)"]) {
      expect(documentFromLink(label, "u")).toBeNull()
    }
  })

  it("refuses a label with no date, which cannot be placed on a calendar", () => {
    // There is no media page here to fall back on: the label is the only place
    // a date could come from.
    expect(documentFromLink("Planning Board Agenda", "u")).toBeNull()
  })

  it("keeps a note the board wrote after the date", () => {
    // "Amended", "Cancelled", "N/A". A cancelled meeting's agenda is still a
    // document the city published, and the title is where a reader learns so.
    expect(documentFromLink("Planning Board Agenda 9-11-19 Amended", "u").title).toBe(
      "Planning Board Agenda 9-11-19 Amended",
    )
  })

  it("points every record at the board's page, there being no media page", () => {
    expect(documentFromLink("Planning Board Agenda 2.11.26", "u").pageUrl).toBe(
      "/government/boards-committees-and-commissions/planning-board/",
    )
  })
})

describe("parseDocumentLinks", () => {
  it("finds the documents and nothing else", () => {
    expect(parseDocumentLinks(page).map((d) => d.title)).toEqual([
      "Planning Board Agenda 2.11.26",
      "Planning Board Meeting Minutes 2.11.26",
      "Planning Board Agenda 11-8-17",
      "Planning Board Agenda 9-11-19 Amended",
    ])
  })

  it("counts a file linked twice as one document", () => {
    // The page repeats a few in an archive section below.
    const urls = parseDocumentLinks(page).map((d) => d.fileUrl)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it("skips an entry with no link at all", () => {
    // "NO MEETING" rows are text, not documents -- there is no PDF behind them.
    expect(parseDocumentLinks(page).some((d) => d.title.includes("NO MEETING"))).toBe(false)
  })
})
