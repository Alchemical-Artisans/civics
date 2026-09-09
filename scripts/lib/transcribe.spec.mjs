import { describe, it, expect } from "vitest"
import { hasTextLayer, material, readableDate, select, sittings } from "./transcribe.mjs"

const document = (over = {}) => ({
  id: over.id ?? "doc-1",
  record: {
    title: "Planning Board Agenda 9.9.26",
    board: "Planning Board",
    date: "2026-09-09",
    kind: "agenda",
    fileUrl: "https://cdn.test/a.pdf",
    ...over.record,
  },
})

describe("sittings", () => {
  it("keys a sitting by the id its page directory is named with", () => {
    const all = sittings([document()])
    expect([...all.keys()]).toEqual(["planning-board-2026-09-09"])
    expect(all.get("planning-board-2026-09-09")).toMatchObject({
      board: "Planning Board",
      date: "2026-09-09",
    })
  })

  it("puts one board's agenda and minutes for a day under one sitting, agenda first", () => {
    const all = sittings([
      document({ id: "m", record: { kind: "minutes", title: "Minutes" } }),
      document({ id: "a" }),
    ])
    expect(all.size).toBe(1)
    expect(all.get("planning-board-2026-09-09").documents.map((d) => d.id)).toEqual(["a", "m"])
  })

  it("keeps two boards sitting the same day apart", () => {
    const all = sittings([
      document(),
      document({ id: "c", record: { board: "Conservation Commission" } }),
    ])
    expect([...all.keys()].sort()).toEqual([
      "conservation-commission-2026-09-09",
      "planning-board-2026-09-09",
    ])
  })

  it("drops an undated record, which belongs to no sitting", () => {
    // The site drops these before grouping too: a document that cannot be
    // placed on a calendar has no meeting page to be written on.
    expect(sittings([document({ record: { date: null } })]).size).toBe(0)
  })
})

describe("select", () => {
  const all = sittings([
    document(),
    document({ id: "c", record: { board: "Conservation Commission" } }),
    document({ id: "p2", record: { date: "2026-10-14" } }),
  ])

  it("takes a meeting id exactly", () => {
    expect(select(all, "planning-board-2026-09-09").map((s) => s.id)).toEqual([
      "planning-board-2026-09-09",
    ])
  })

  it("takes a date, which can name more than one sitting", () => {
    expect(select(all, "2026-09-09").map((s) => s.id).length).toBe(2)
  })

  it("takes part of a board's name, oldest first", () => {
    expect(select(all, "planning-board").map((s) => s.date)).toEqual(["2026-09-09", "2026-10-14"])
  })

  it("matches nothing rather than guessing", () => {
    expect(select(all, "school-committee")).toEqual([])
  })
})

describe("hasTextLayer", () => {
  it("calls a copier scan what it is", () => {
    // The Planning Board's agenda of 9 September 2026: two pages off a Toshiba
    // e-STUDIO, `pdftotext` returns two bytes.
    expect(hasTextLayer("\f\n", 2)).toBe(false)
  })

  it("accepts a page of real text", () => {
    expect(hasTextLayer("word ".repeat(200), 1)).toBe(true)
  })

  it("measures per page, so one good page among many scans does not pass", () => {
    expect(hasTextLayer("word ".repeat(200), 20)).toBe(false)
  })
})

describe("readableDate", () => {
  it("reads the date as a day, parsed as UTC", () => {
    // Parsed locally this is the 8th anywhere west of UTC, which is the same
    // slip `calendar.ts` constructs its dates in UTC to avoid.
    expect(readableDate("2026-09-09")).toBe("Wednesday, 9 September 2026")
  })
})

describe("material", () => {
  const sitting = sittings([document()]).get("planning-board-2026-09-09")

  it("names the directory, and says a scan has to be read by eye", () => {
    const text = material(
      sitting,
      [
        {
          title: "Planning Board Agenda 9.9.26",
          kind: "agenda",
          fileUrl: "https://cdn.test/a.pdf",
          cached: ".cache/documents/doc-1.pdf",
          pages: 2,
          imageDir: ".cache/transcribe/doc-1",
          imagesRendered: 2,
          imagesTruncated: false,
        },
      ],
      { written: false },
    )
    expect(text).toContain("src/routes/calendar/meetings/planning-board-2026-09-09/")
    expect(text).toContain("nothing written yet")
    expect(text).toContain("No text layer")
    expect(text).toContain(".cache/transcribe/doc-1/page-*.png")
  })

  it("says when only the front of a packet was rendered", () => {
    const text = material(
      sitting,
      [
        {
          title: "City Council Agenda",
          kind: "agenda",
          fileUrl: "https://cdn.test/a.pdf",
          cached: ".cache/documents/doc-1.pdf",
          pages: 312,
          imageDir: ".cache/transcribe/doc-1",
          imagesRendered: 40,
          imagesTruncated: true,
        },
      ],
      { written: false },
    )
    expect(text).toContain("first 40 pages only")
  })

  it("warns that an existing page is being amended rather than written", () => {
    const text = material(
      sitting,
      [
        {
          title: "Planning Board Agenda 9.9.26",
          kind: "agenda",
          fileUrl: "https://cdn.test/a.pdf",
          cached: ".cache/documents/doc-1.pdf",
          pages: 2,
          textPath: ".cache/transcribe/doc-1/text.txt",
        },
      ],
      { written: true },
    )
    expect(text).toContain("already written")
  })

  it("says so when the city's file could not be fetched", () => {
    const text = material(
      sitting,
      [
        {
          title: "Planning Board Agenda 9.9.26",
          kind: "agenda",
          fileUrl: "https://cdn.test/a.pdf",
          cached: null,
          problem: "failed",
        },
      ],
      { written: false },
    )
    expect(text).toContain("Not cached")
  })
})
