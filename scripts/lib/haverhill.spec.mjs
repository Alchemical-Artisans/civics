import { describe, it, expect } from "vitest"
import {
  classify,
  documentKey,
  parseDateFromFilename,
  parseDateFromTitle,
  parseListing,
  parseMeetingDate,
} from "./haverhill.mjs"

describe("parseMeetingDate", () => {
  it("reads the US-format date and ignores the clock time", () => {
    expect(parseMeetingDate("01/06/2026 03:00 PM")).toEqual({
      date: "2026-01-06",
      adjusted: false,
    })
    expect(parseMeetingDate("08/27/2026 07:15 PM")).toEqual({
      date: "2026-08-27",
      adjusted: false,
    })
  })

  it("rolls a 12:00 AM UTC-rollover record back one day", () => {
    // A Tuesday 7pm EST meeting is rendered as midnight the next day.
    expect(parseMeetingDate("01/08/2025 12:00 AM")).toEqual({ date: "2025-01-07", adjusted: true })
  })

  it("rolls back across a month boundary", () => {
    expect(parseMeetingDate("03/01/2026 12:00 AM")).toEqual({ date: "2026-02-28", adjusted: true })
  })

  it("leaves 11:00 PM records alone (EDT keeps the correct day)", () => {
    expect(parseMeetingDate("04/15/2025 11:00 PM")).toEqual({
      date: "2025-04-15",
      adjusted: false,
    })
  })

  it("returns null when there is no date", () => {
    expect(parseMeetingDate("")).toBeNull()
    expect(parseMeetingDate(null)).toBeNull()
  })
})

describe("parseDateFromTitle", () => {
  it.each([
    ["2025-03-06 Conservation Commission Minutes", "2025-03-06"],
    ["2025-4-1 City Council Agenda", "2025-04-01"],
    ["April 2, 2026 License Commission Agenda", "2026-04-02"],
    ["City Council Agenda - April 14, 2026", "2026-04-14"],
    ["BOA mtg min 10.28.2025", "2025-10-28"],
    ["Board of Registrars Meeting Minutes 9.16.2025", "2025-09-16"],
    ["CityCouncil_4.8.25_minutes", "2025-04-08"],
  ])("parses %s", (title, expected) => {
    expect(parseDateFromTitle(title)).toBe(expected)
  })

  it("returns null for titles with no date", () => {
    expect(parseDateFromTitle("Agenda and Minutes (10)")).toBeNull()
  })

  it("rejects an impossible calendar date", () => {
    expect(parseDateFromTitle("2025-02-30 City Council Agenda")).toBeNull()
  })
})

describe("parseDateFromFilename", () => {
  it("splits an 8-digit MMDDYYYY run", () => {
    expect(parseDateFromFilename("/media/x/boa-mtg-min-09092025.pdf")).toEqual({
      date: "2025-09-09",
      ambiguous: false,
    })
  })

  it("handles a 6-digit MDYYYY run", () => {
    expect(parseDateFromFilename("/media/x/boa-mtg-min-552026.pdf")).toEqual({
      date: "2026-05-05",
      ambiguous: false,
    })
  })

  it("flags a 3-digit month/day remainder as ambiguous", () => {
    // `106` could be 1/06 or 10/6; we take the former and say so.
    expect(parseDateFromFilename("/media/x/mtg-boa-1062026.pdf")).toEqual({
      date: "2026-01-06",
      ambiguous: true,
    })
  })

  it("falls back to a 2-digit year", () => {
    expect(parseDateFromFilename("/media/x/citycouncil_72225_minutes.pdf")).toEqual({
      date: "2025-07-22",
      ambiguous: false,
    })
  })

  it("returns null without a filename", () => {
    expect(parseDateFromFilename(null)).toBeNull()
  })
})

describe("classify", () => {
  it("splits a category into board and kind", () => {
    expect(classify({ category: "City Council Minutes", title: "x" })).toEqual({
      board: "City Council",
      kind: "minutes",
    })
    expect(classify({ category: "Water Department Meeting Agendas", title: "x" })).toEqual({
      board: "Water Department",
      kind: "agenda",
    })
  })

  it("falls back to the PDF filename when the category is empty", () => {
    expect(
      classify({
        category: "",
        title: "Agenda and Minutes (10)",
        fileUrl: "https://x/media/q/boa-mtg-min-1062026.pdf",
      }),
    ).toEqual({ board: "Board of Assessors", kind: "minutes" })
  })

  it("uses only the first of several categories", () => {
    expect(
      classify({
        category: "Conservation Commission Minutes, Conservation Commission Agendas",
        title: "x",
      }).board,
    ).toBe("Conservation Commission")
  })
})

describe("documentKey", () => {
  it("distinguishes two documents sharing a media page", () => {
    const a = { pageUrl: "/p/agenda-and-minutes-5/", fileUrl: "https://x/june-5-2025.pdf" }
    const b = {
      pageUrl: "/p/agenda-and-minutes-5/",
      fileUrl: "https://x/boa-mtg-min-09092025.pdf",
    }
    expect(documentKey(a)).not.toBe(documentKey(b))
  })

  it("is stable for the same document", () => {
    const a = { pageUrl: "/p/x/", fileUrl: "https://x/a.pdf" }
    expect(documentKey(a)).toBe(documentKey({ ...a }))
  })
})

describe("parseListing", () => {
  it("pulls title, page, file, and category out of a listing row", () => {
    const html = `
			<tr class="document-item">
				<td><a href="/document-manager/media-pages/x/">2025-03-06 Conservation Commission Minutes</a></td>
				<td> Conservation Commission Minutes </td>
				<td></td>
				<td><div class="download-links">
					<a href="/media/m0/x.pdf" download>Download</a>
					<a href="https://media-001-us.cdn.govstack.com/h/media/m0/x.pdf" target="_blank">View</a>
				</div></td>
			</tr>`
    expect(parseListing(html)).toEqual([
      {
        title: "2025-03-06 Conservation Commission Minutes",
        pageUrl: "/document-manager/media-pages/x/",
        fileUrl: "https://media-001-us.cdn.govstack.com/h/media/m0/x.pdf",
        category: "Conservation Commission Minutes",
        description: "",
      },
    ])
  })

  it("decodes HTML entities in categories", () => {
    const html = `<tr class="document-item"><td><a href="/p/">t</a></td><td>Administration &amp; Finance Committee Minutes</td><td></td></tr>`
    expect(parseListing(html)[0].category).toBe("Administration & Finance Committee Minutes")
  })

  it("returns nothing for markup with no rows", () => {
    expect(parseListing("<table></table>")).toEqual([])
  })
})
