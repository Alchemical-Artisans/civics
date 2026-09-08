import { describe, it, expect } from "vitest"
import { parseArchive, readHeading } from "./archives.mjs"

describe("readHeading", () => {
  it("reads a board and a year off a Council heading", () => {
    expect(readHeading("2019 Council Meeting Minutes")).toEqual({
      board: "City Council",
      year: 2019,
    })
    expect(readHeading("2015 - Council Agendas - Click here")).toEqual({
      board: "City Council",
      year: 2015,
    })
  })

  it("reads the License Commission's, which names no year", () => {
    expect(readHeading("LICENSE COMMISSION MINUTES")).toEqual({
      board: "License Commission",
      year: undefined,
    })
  })

  it("takes a bare year as a year alone", () => {
    // The License Commission's section is split by year that way, under the one
    // heading that names the board.
    expect(readHeading("2021")).toEqual({ year: 2021 })
  })

  it("is not fooled by the sidebar", () => {
    expect(readHeading("Toggle Menu Agendas and Minutes")).toBeNull()
    expect(readHeading("January 7, 2025")).toBeNull()
  })
})

/** The archives' actual shape: a run of links with headings in bare text. */
const page = `
<div class="content-col">
<p>2019 Council Meeting Minutes</p>
<a href="https://cdn.test/a.pdf">January 8, 2019</a>
<a href="https://cdn.test/b.pdf">Jan 15</a>
<a href="https://cdn.test/boa-mtg-min-01072025.pdf">1.07.2025.BOA.Mtg.Min</a>
<a href="https://cdn.test/c.pdf">June 7, 2o16</a>
<p>LICENSE COMMISSION MINUTES</p>
<p>2021</p>
<a href="https://cdn.test/d.pdf">March 2, 2021</a>
</div>
`

describe("parseArchive", () => {
  it("files a link under the heading above it", () => {
    const { documents } = parseArchive(page, "minutes")
    expect(documents[0]).toMatchObject({
      title: "January 8, 2019",
      category: "City Council Minutes",
    })
    expect(documents.at(-1)).toMatchObject({
      title: "March 2, 2021",
      category: "License Commission Minutes",
    })
  })

  it("lends the heading's year to a label that has none", () => {
    // The older Council sections write "Jan 15" and leave the year above.
    const { documents } = parseArchive(page, "minutes")
    expect(documents.map((d) => d.title)).toContain("Jan 15, 2019")
  })

  it("files a link under the board its own title names, not the heading's", () => {
    // 268 Board of Assessors minutes sit under a Council heading. They are the
    // same `boa-mtg-min-*` series the city's listing files under that board,
    // and nothing the Council ever sat for.
    const { documents, reattributed } = parseArchive(page, "minutes")
    expect(documents.find((d) => d.fileUrl.includes("boa-mtg-min")).category).toBe(
      "Board of Assessors Minutes",
    )
    expect(reattributed).toHaveLength(1)
    expect(reattributed[0]).toMatchObject({ from: "City Council", to: "Board of Assessors" })
  })

  it("skips a label with no readable date rather than inventing one", () => {
    // "June 7, 2o16" -- a letter o for a nought, in the city's own copy.
    const { documents, skipped } = parseArchive(page, "minutes")
    expect(documents.some((d) => d.title.includes("2o16"))).toBe(false)
    expect(skipped.map((s) => s.title)).toContain("June 7, 2o16")
  })

  it("ignores links before any heading", () => {
    // Nothing claims them, and a board cannot be guessed from a bare date.
    const { documents } = parseArchive(
      `<div class="content-col"><a href="x.pdf">May 1, 2020</a></div>`,
      "minutes",
    )
    expect(documents).toEqual([])
  })
})
