import { describe, it, expect } from "vitest"
import { assignIds, documentId, summarizeDocuments } from "./documents.mjs"

const record = (over = {}) => ({
  title: "City Council Agenda",
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

// Whether a document has a page is decided by what is on disk, not by anything
// recorded in meetings.json -- writing a page is one step, adding the file.
describe("summarizeDocuments", () => {
  it("counts the documents with a page written against those without", () => {
    const meetings = [
      record({ fileUrl: "https://media.example/a/one.pdf" }),
      record({ fileUrl: "https://media.example/b/two.pdf" }),
    ]
    assignIds(meetings)
    expect(summarizeDocuments(meetings, new Set([meetings[0].docId]))).toEqual({
      documents: 2,
      withPage: 1,
      withoutPage: 1,
    })
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
    expect(summarizeDocuments(meetings, new Set())).toEqual({
      documents: 0,
      withPage: 0,
      withoutPage: 0,
    })
  })
})
