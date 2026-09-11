import { describe, it, expect } from "vitest"
import { assignIds, documentId, newMeetingIds, summarizeDocuments } from "./documents.mjs"

const record = (over = {}) => ({
  title: "City Council Agenda",
  board: "City Council",
  date: "2026-08-25",
  pageUrl: "/document-manager/media-pages/agenda-and-minutes/city-council-agenda/",
  fileUrl: "https://media.example/media/abc123/agenda.pdf",
  needsReview: false,
  ...over,
})

describe("documentId", () => {
  it("reads as the media page slug with a hash appended", () => {
    expect(documentId(record())).toMatch(/^city-council-agenda-[0-9a-f]{8}$/)
  })

  it("is stable across runs", () => {
    expect(documentId(record())).toBe(documentId(record()))
  })

  it("separates two documents that share a media page slug", () => {
    // The city really does publish two different documents under
    // `agenda-and-minutes-5`; the hash of the file URL is what tells them apart.
    const page = "/document-manager/media-pages/agenda-and-minutes/agenda-and-minutes-5/"
    const a = documentId(record({ pageUrl: page, fileUrl: "https://media.example/x/june.pdf" }))
    const b = documentId(record({ pageUrl: page, fileUrl: "https://media.example/y/boa.pdf" }))
    expect(a).not.toBe(b)
    expect(a.startsWith("agenda-and-minutes-5-")).toBe(true)
  })

  it("falls back to a placeholder slug when the page URL has no usable segment", () => {
    expect(documentId(record({ pageUrl: "/" }))).toMatch(/^document-[0-9a-f]{8}$/)
  })
})

describe("assignIds", () => {
  it("gives one id to two listing rows sharing a PDF", () => {
    // Five PDFs are published under two media pages each. They are one
    // document and must not become two pages.
    const meetings = [
      record({ pageUrl: "/media-pages/first/" }),
      record({ pageUrl: "/media-pages/second/" }),
    ]
    const documents = assignIds(meetings)
    expect(documents).toHaveLength(1)
    expect(meetings[0].docId).toBe(meetings[1].docId)
  })

  it("names the shared document after its unflagged row", () => {
    const meetings = [
      record({ pageUrl: "/media-pages/flagged/", needsReview: true }),
      record({ pageUrl: "/media-pages/clean/" }),
    ]
    assignIds(meetings)
    expect(meetings[0].docId).toMatch(/^clean-/)
  })

  it("picks the same row no matter what order the listing arrived in", () => {
    const forwards = [
      record({ pageUrl: "/media-pages/aaa/" }),
      record({ pageUrl: "/media-pages/bbb/" }),
    ]
    const backwards = [
      record({ pageUrl: "/media-pages/bbb/" }),
      record({ pageUrl: "/media-pages/aaa/" }),
    ]
    assignIds(forwards)
    assignIds(backwards)
    expect(forwards[0].docId).toBe(backwards[0].docId)
  })

  it("leaves a record with no file without an id, since it has no page", () => {
    const meetings = [record({ fileUrl: null })]
    expect(assignIds(meetings)).toHaveLength(0)
    expect(meetings[0].docId).toBeNull()
  })

  it("keeps distinct documents distinct", () => {
    const meetings = [
      record({ fileUrl: "https://media.example/a/one.pdf" }),
      record({ fileUrl: "https://media.example/b/two.pdf" }),
    ]
    expect(assignIds(meetings)).toHaveLength(2)
    expect(meetings[0].docId).not.toBe(meetings[1].docId)
  })
})

// Whether a sitting has a page is decided by what is on disk, not by anything
// recorded in meetings.json -- writing a page is one step, adding the
// directory. The ids compared against it are meeting ids, not docIds: a page
// covers a sitting, and a sitting usually has an agenda and minutes under it.
describe("summarizeDocuments", () => {
  it("counts documents and sittings separately", () => {
    // One sitting, two documents -- which is the ordinary case, and the one
    // that made the old per-document count read as half-written.
    const meetings = [
      record({ fileUrl: "https://media.example/a/agenda.pdf" }),
      record({ fileUrl: "https://media.example/b/minutes.pdf" }),
    ]
    assignIds(meetings)
    expect(summarizeDocuments(meetings, new Set())).toEqual({
      documents: 2,
      meetings: 1,
      withPage: 0,
      withoutPage: 1,
    })
  })

  it("credits a sitting whose meeting id has a route directory", () => {
    const meetings = [record({ board: "City Council", date: "2026-08-25" })]
    assignIds(meetings)
    expect(summarizeDocuments(meetings, new Set(["city-council-2026-08-25"]))).toMatchObject({
      meetings: 1,
      withPage: 1,
      withoutPage: 0,
    })
  })

  // The id has to be spelled the way `meetingId` in src/lib/calendar.ts spells
  // it, or the summary counts pages the site does not serve. Ampersands and
  // slashes appear in board names.
  it("slugs a board name the way the site's routes do", () => {
    const meetings = [record({ board: "Administration & Finance Committee", date: "2026-01-07" })]
    assignIds(meetings)
    expect(
      summarizeDocuments(meetings, new Set(["administration-finance-committee-2026-01-07"])),
    ).toMatchObject({ withPage: 1 })
  })

  it("counts a document published under two media pages once", () => {
    const meetings = [
      record({ pageUrl: "/media-pages/one/" }),
      record({ pageUrl: "/media-pages/two/" }),
    ]
    assignIds(meetings)
    expect(summarizeDocuments(meetings, new Set()).documents).toBe(1)
  })

  it("ignores a record with no file, which can never have a page", () => {
    const meetings = [record({ fileUrl: null })]
    assignIds(meetings)
    expect(summarizeDocuments(meetings, new Set()).documents).toBe(0)
  })

  it("does not count an undated record as a sitting", () => {
    const meetings = [record({ date: null })]
    assignIds(meetings)
    expect(summarizeDocuments(meetings, new Set()).meetings).toBe(0)
  })
})

// Which meeting ids a run's console output should point a person to run
// `npm run transcribe --` against.
describe("newMeetingIds", () => {
  it("names a sitting that was not there before", () => {
    const before = [record({ board: "City Council", date: "2026-08-25" })]
    const after = [...before, record({ board: "Planning Board", date: "2026-08-26" })]
    expect(newMeetingIds(before, after)).toEqual(["planning-board-2026-08-26"])
  })

  it("does not name a sitting that already had a document", () => {
    // A second document -- minutes landing beside an agenda -- is not a new
    // meeting, just a fuller one.
    const before = [record({ board: "City Council", date: "2026-08-25", kind: "agenda" })]
    const after = [
      ...before,
      record({ board: "City Council", date: "2026-08-25", kind: "minutes" }),
    ]
    expect(newMeetingIds(before, after)).toEqual([])
  })

  it("ignores an undated record, which the calendar cannot place", () => {
    const after = [record({ date: null })]
    expect(newMeetingIds([], after)).toEqual([])
  })

  it("ignores a record the city has taken down", () => {
    const after = [record({ board: "City Council", date: "2026-08-25", gone: true })]
    expect(newMeetingIds([], after)).toEqual([])
  })

  it("ignores an orphan recording, which the calendar does not show", () => {
    const after = [record({ board: "City Council", date: "2026-08-25", orphan: true })]
    expect(newMeetingIds([], after)).toEqual([])
  })

  it("sorts the result", () => {
    const after = [
      record({ board: "Zoning Board of Appeals", date: "2026-08-25" }),
      record({ board: "Board of Assessors", date: "2026-08-25" }),
    ]
    expect(newMeetingIds([], after)).toEqual([
      "board-of-assessors-2026-08-25",
      "zoning-board-of-appeals-2026-08-25",
    ])
  })
})
