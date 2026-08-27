import { describe, it, expect } from "vitest"
import { applyReviews, reviewKey, summarizeReviews, syncReviews } from "./reviews.mjs"

const record = (over = {}) => ({
  title: "Board of Registrars Minutes",
  pageUrl: "/document-manager/media-pages/agenda-and-minutes/brd-of-registrars-26/",
  fileUrl: "https://media.example/media/abc/09092025-meeting-minutes.pdf",
  date: "2025-09-16",
  dateConflict: true,
  needsReview: true,
  ...over,
})

describe("reviewKey", () => {
  it("joins the media-page slug to the PDF filename", () => {
    expect(reviewKey(record())).toBe("brd-of-registrars-26::09092025-meeting-minutes.pdf")
  })

  it("separates two documents published under one media page", () => {
    // The city really does publish two documents under `agenda-and-minutes-5`.
    // They can carry different dates, so a correction to one must not reach the
    // other -- which is why this is keyed on the record, not on docId.
    const page = "/document-manager/media-pages/agenda-and-minutes/agenda-and-minutes-5/"
    const a = reviewKey(record({ pageUrl: page, fileUrl: "https://m.example/x/june-5-2025.pdf" }))
    const b = reviewKey(record({ pageUrl: page, fileUrl: "https://m.example/y/boa-min.pdf" }))
    expect(a).not.toBe(b)
  })

  it("handles a record with no file", () => {
    expect(reviewKey(record({ fileUrl: null }))).toBe("brd-of-registrars-26::none")
  })
})

describe("syncReviews", () => {
  it("adds an entry for a newly flagged record", () => {
    const reviews = {}
    const meetings = [record()]
    expect(syncReviews(meetings, reviews)).toHaveLength(1)
    expect(reviews["brd-of-registrars-26::09092025-meeting-minutes.pdf"]).toEqual({
      needsReview: true,
    })
  })

  it("adds an entry for a record with no date at all", () => {
    const reviews = {}
    syncReviews([record({ date: null, dateConflict: false, needsReview: true })], reviews)
    expect(Object.keys(reviews)).toHaveLength(1)
  })

  it("leaves records the scraper is happy with alone", () => {
    const reviews = {}
    syncReviews([record({ dateConflict: false, needsReview: false })], reviews)
    expect(reviews).toEqual({})
  })

  it("never disturbs an entry that already exists", () => {
    const key = "brd-of-registrars-26::09092025-meeting-minutes.pdf"
    const reviews = { [key]: { needsReview: false, date: "2025-09-09" } }
    expect(syncReviews([record()], reviews)).toHaveLength(0)
    expect(reviews[key]).toEqual({ needsReview: false, date: "2025-09-09" })
  })

  it("picks up a hand-edit made before this file existed", () => {
    // `update` never rewrites a stored record, so someone who set needsReview
    // to false by hand leaves a record that still carries its dateConflict.
    // That decision has to be captured before a rebuild re-derives it away.
    const reviews = {}
    syncReviews([record({ needsReview: false })], reviews)
    expect(reviews["brd-of-registrars-26::09092025-meeting-minutes.pdf"]).toEqual({
      needsReview: false,
    })
  })
})

describe("applyReviews", () => {
  it("signs a record off without touching anything else", () => {
    const meetings = [record()]
    applyReviews(meetings, {
      "brd-of-registrars-26::09092025-meeting-minutes.pdf": { needsReview: false },
    })
    expect(meetings[0].needsReview).toBe(false)
    expect(meetings[0].date).toBe("2025-09-16")
    // The scraper's own evidence is left intact, so why it was flagged is still
    // on the record.
    expect(meetings[0].dateConflict).toBe(true)
  })

  it("overlays a corrected date", () => {
    const meetings = [record()]
    applyReviews(meetings, {
      "brd-of-registrars-26::09092025-meeting-minutes.pdf": {
        needsReview: false,
        date: "2025-09-09",
      },
    })
    expect(meetings[0].date).toBe("2025-09-09")
  })

  it("leaves records with no entry untouched", () => {
    const meetings = [record()]
    expect(applyReviews(meetings, {})).toBe(0)
    expect(meetings[0].date).toBe("2025-09-16")
  })

  it("survives the round trip a rebuild puts it through", () => {
    // A rebuild re-derives every field, so the overlay is what has to carry the
    // correction across.
    const reviews = {
      "brd-of-registrars-26::09092025-meeting-minutes.pdf": {
        needsReview: false,
        date: "2025-09-09",
      },
    }
    const rebuilt = [record()]
    syncReviews(rebuilt, reviews)
    applyReviews(rebuilt, reviews)
    expect(rebuilt[0]).toMatchObject({ date: "2025-09-09", needsReview: false })
  })
})

describe("summarizeReviews", () => {
  it("separates outstanding from signed off and corrected", () => {
    expect(
      summarizeReviews({
        a: { needsReview: true },
        b: { needsReview: false },
        c: { needsReview: false, date: "2025-09-09" },
      }),
    ).toEqual({ total: 3, outstanding: 1, corrected: 1 })
  })
})
