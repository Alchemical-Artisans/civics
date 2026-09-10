import { describe, expect, it } from "vitest"
import { calendar } from "./meetings"

const documents = calendar().meetings.flatMap((m) => m.documents)

describe("documentPage", () => {
  /**
   * The link a meeting page offers beside the file. Four of the six pages the
   * calendar is read off are one run of links -- the two archives and the two
   * boards' own pages -- so every record read off one carries that index as its
   * `pageUrl`. A board's front door is not that document's page, and linking it
   * from a meeting sends a reader looking for the agenda they already have
   * open, so those documents get no link at all.
   */
  const indexes = [
    "https://www.haverhillma.gov/government/agendas-and-minutes/agenda-archive/",
    "https://www.haverhillma.gov/government/agendas-and-minutes/minutes-archive/",
    "https://www.haverhillma.gov/government/boards-committees-and-commissions/planning-board/",
    "https://www.haverhillma.gov/government/boards-committees-and-commissions/zoning-board-of-appeals/",
  ]

  it("never points at the page a run of links was read off", () => {
    const trimmed = (url: string) => url.replace(/\/+$/, "")
    const offered = documents.map((d) => d.documentPage).filter((page) => page !== null)
    expect(offered.length).toBeGreaterThan(0)
    for (const index of indexes) {
      expect(offered.map(trimmed)).not.toContain(trimmed(index))
    }
  })

  it("is the media page for a document the city's listing published", () => {
    const listed = documents.filter((d) => d.pageUrl.startsWith("/document-manager/media-pages/"))
    expect(listed.length).toBeGreaterThan(0)
    for (const doc of listed) {
      expect(doc.documentPage).toContain("/document-manager/media-pages/")
    }
  })

  it("is the notice's own detail page for an agenda hung off one", () => {
    const posted = documents.filter((d) => d.pageUrl.includes("events.haverhillma.gov"))
    expect(posted.length).toBeGreaterThan(0)
    for (const doc of posted) {
      expect(doc.documentPage).toBe(doc.pageUrl)
      // The notice, not the file hanging off it -- the file's URL is the
      // notice's with a GUID on the end, which is why this is worth pinning.
      expect(doc.documentPage).not.toBe(doc.fileUrl)
    }
  })
})
