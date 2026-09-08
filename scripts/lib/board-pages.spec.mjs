import { describe, it, expect } from "vitest"
import { BOARD_PAGES, documentFromLink, parseDocumentLinks } from "./board-pages.mjs"

const planning = BOARD_PAGES.find((p) => p.board === "Planning Board")
const zoning = BOARD_PAGES.find((p) => p.board === "Zoning Board of Appeals")

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
    expect(documentFromLink("Planning Board Agenda 2.11.26", "u", planning)).toMatchObject({
      title: "Planning Board Agenda 2.11.26",
      fileUrl: "u",
    })
    expect(documentFromLink("Planning Board Meeting Minutes 7-11-18", "u", planning)).not.toBeNull()
  })

  it("refuses the schedules, which are not about one sitting", () => {
    // They go to `schedule.json` instead, as the dates the board expects to
    // sit on. A schedule on the calendar as a document would be undated.
    expect(documentFromLink("Planning Board Meeting Schedule 2026", "u", planning)).toBeNull()
  })

  it("refuses everything else the page links", () => {
    for (const label of ["Zoning Map (Large)", "Section - 1", "Form A (Approval Not Required)"]) {
      expect(documentFromLink(label, "u", planning)).toBeNull()
    }
  })

  it("refuses a label with no date, which cannot be placed on a calendar", () => {
    // There is no media page here to fall back on: the label is the only place
    // a date could come from.
    expect(documentFromLink("Planning Board Agenda", "u", planning)).toBeNull()
  })

  it("keeps a note the board wrote after the date", () => {
    // "Amended", "Cancelled", "N/A". A cancelled meeting's agenda is still a
    // document the city published, and the title is where a reader learns so.
    expect(documentFromLink("Planning Board Agenda 9-11-19 Amended", "u", planning).title).toBe(
      "Planning Board Agenda 9-11-19 Amended",
    )
  })

  it("points every record at the board's page, there being no media page", () => {
    expect(documentFromLink("Planning Board Agenda 2.11.26", "u", planning).pageUrl).toBe(
      "/government/boards-committees-and-commissions/planning-board/",
    )
  })
})

describe("parseDocumentLinks", () => {
  it("finds the documents and nothing else", () => {
    expect(parseDocumentLinks(page, planning).map((d) => d.title)).toEqual([
      "Planning Board Agenda 2.11.26",
      "Planning Board Meeting Minutes 2.11.26",
      "Planning Board Agenda 11-8-17",
      "Planning Board Agenda 9-11-19 Amended",
    ])
  })

  it("counts a file linked twice as one document", () => {
    // The page repeats a few in an archive section below.
    const urls = parseDocumentLinks(page, planning).map((d) => d.fileUrl)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it("skips an entry with no link at all", () => {
    // "NO MEETING" rows are text, not documents -- there is no PDF behind them.
    expect(parseDocumentLinks(page, planning).some((d) => d.title.includes("NO MEETING"))).toBe(
      false,
    )
  })
})

/** The Zoning Board writes its labels the other way round, and leaves some blank. */
const zoningHtml = `
<p>Zoning Board of Appeals Meeting Schedules</p>
<a href="https://cdn.test/2026-boa-meeting-schedule.pdf">2026 BOA MEETING SCHEDULE</a>
<p><a href="https://cdn.test/january-212026-boa-agenda.pdf">January 21, 2026 Agenda</a></p>
<p>February 18, 2026 Agenda MEETING CANCELLED</p>
<p><a href="https://cdn.test/minutes-february-192025.pdf" title="Minutes February 192025"></a></p>
<a href="https://cdn.test/boa_application.pdf">Board of Appeals Application</a>
`

describe("a board that names its documents the other way round", () => {
  it("reads a label that puts the date before the kind", () => {
    const doc = documentFromLink("January 21, 2026 Agenda", "u", zoning)
    expect(doc.title).toBe("January 21, 2026 Agenda")
    // The board is carried as the category, which is the field the city's own
    // listing names a board in -- so `classify` derives it the same way for
    // both sources. Guessing would read `boa-` in the filename as the Board of
    // Assessors, which is a different body entirely.
    expect(doc.category).toBe("Zoning Board of Appeals")
  })

  it("falls back to the title attribute where the label is blank", () => {
    // Thirteen of this board's links have no text at all.
    const docs = parseDocumentLinks(zoningHtml, zoning)
    expect(docs.map((d) => d.title)).toContain("Minutes February 192025")
  })

  it("leaves the schedule and the application form alone", () => {
    const titles = parseDocumentLinks(zoningHtml, zoning).map((d) => d.title)
    expect(titles).not.toContain("2026 BOA MEETING SCHEDULE")
    expect(titles).not.toContain("Board of Appeals Application")
  })

  it("skips a cancelled meeting, which has no agenda behind it", () => {
    // The board writes the cancellation as text with no link. `schedule.mjs`
    // reads those as sittings called off; there is no document here.
    const titles = parseDocumentLinks(zoningHtml, zoning).map((d) => d.title)
    expect(titles.some((t) => t.includes("CANCELLED"))).toBe(false)
  })
})
