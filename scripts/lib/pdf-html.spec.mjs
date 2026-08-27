import { describe, it, expect } from "vitest"
import { convertXmlToHtml, hasReadableText, parseRuns } from "./pdf-html.mjs"

// Builders for `pdftohtml -xml` output. Inline fixtures rather than checked-in
// PDFs, matching how parseListing is tested in haverhill.spec.mjs: the point is
// the layout heuristics, and coordinates are the only input they read.
const font = (id, size) => `<fontspec id="${id}" size="${size}" family="Times" color="#000000"/>`
const text = (top, left, width, inner, { height = 24, font: f = 0 } = {}) =>
  `<text top="${top}" left="${left}" width="${width}" height="${height}" font="${f}">${inner}</text>`
const page = (body, { number = 1, height = 1188 } = {}) =>
  `<page number="${number}" position="absolute" top="0" left="0" height="${height}" width="918">\n${body}\n</page>`
const doc = (pages, fonts = font(0, 18)) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<pdf2xml producer="poppler" version="26.01.0">\n${fonts}\n${
    Array.isArray(pages) ? pages.join("\n") : pages
  }\n</pdf2xml>`

describe("parseRuns", () => {
  it("splits inline markup into formatting runs", () => {
    expect(parseRuns("plain <b>bold</b> tail")).toEqual([
      { text: "plain ", bold: false, italic: false, href: null },
      { text: "bold", bold: true, italic: false, href: null },
      { text: " tail", bold: false, italic: false, href: null },
    ])
  })

  it("tracks nested bold and italic", () => {
    expect(parseRuns("<b><i>both</i></b>")).toEqual([
      { text: "both", bold: true, italic: true, href: null },
    ])
  })

  it("ignores a stray closing tag rather than unbalancing the rest", () => {
    expect(parseRuns("</b>after")).toEqual([
      { text: "after", bold: false, italic: false, href: null },
    ])
  })

  it("treats a non-breaking space as an ordinary space", () => {
    expect(parseRuns("a&#160;b")[0].text).toBe("a b")
  })
})

describe("convertXmlToHtml", () => {
  it("returns nothing for a PDF with no text layer", () => {
    // Poppler reports a scanned document as pages holding no <text> nodes at
    // all, which is how the caller tells a scan from a conversion failure.
    expect(convertXmlToHtml(doc([page(""), page("", { number: 2 })]))).toBe("")
  })

  it("merges a small-caps heading split across nodes into one bold run", () => {
    // Poppler emits `<b>C</b><b>ITY OF </b><b>H</b><b>AVERHILL</b>` for text set
    // in small caps, with the runs butted up against each other at gap 0.
    const html = convertXmlToHtml(
      doc(
        page(
          [
            text(51, 294, 26, "<b>C</b>", { height: 50, font: 1 }),
            text(59, 320, 107, "<b>ITY OF </b>", { height: 39, font: 1 }),
            text(51, 427, 28, "<b>H</b>", { height: 50, font: 1 }),
            text(59, 456, 155, "<b>AVERHILL</b>", { height: 39, font: 1 }),
          ].join("\n"),
        ),
        [font(0, 18), font(1, 36)].join("\n"),
      ),
    )
    expect(html).toContain("<b>CITY OF HAVERHILL</b>")
  })

  it("infers a word space from the horizontal gap without splitting words", () => {
    // `.` and `under` sit 4px apart at 18px -- a real space poppler did not
    // emit. The small-caps runs above butt together at 0 and must not gain one.
    const html = convertXmlToHtml(
      doc(
        page(
          [text(200, 700, 87, "P.M"), text(200, 787, 5, "."), text(200, 796, 45, "under")].join(
            "\n",
          ),
        ),
      ),
    )
    expect(html).toContain("P.M. under")
  })

  it("keeps a hyperlink and collapses the anchors poppler wraps around it", () => {
    const html = convertXmlToHtml(
      doc(
        page(
          [
            text(200, 81, 40, "link:"),
            text(200, 130, 10, '<a href="https://example.gov/x"> </a>'),
            text(200, 141, 200, '<a href="https://example.gov/x">example.gov/x</a>'),
            text(200, 342, 10, '<a href="https://example.gov/x"> </a>'),
          ].join("\n"),
        ),
      ),
    )
    expect(html.match(/<a /g)).toHaveLength(1)
    expect(html).toContain(
      '<a href="https://example.gov/x" target="_blank" rel="external noopener noreferrer">example.gov/x</a>',
    )
  })

  it("refuses to emit a link for an unsafe scheme but keeps its text", () => {
    const html = convertXmlToHtml(
      doc(page(text(200, 81, 200, '<a href="javascript:alert(1)">click me</a>'))),
    )
    expect(html).not.toContain("javascript:")
    expect(html).toContain("click me")
  })

  it("escapes text that looks like markup", () => {
    const html = convertXmlToHtml(doc(page(text(200, 81, 200, "Smith &amp; Sons &lt;tag&gt;"))))
    expect(html).toContain("Smith &amp; Sons &lt;tag&gt;")
  })

  it("promotes a large line to a heading and starts levels at h2", () => {
    const html = convertXmlToHtml(
      doc(
        page(
          [
            text(51, 294, 300, "<b>CITY OF HAVERHILL</b>", { height: 50, font: 1 }),
            text(200, 81, 700, "Ordinary body copy that runs the width of the column."),
            text(240, 54, 300, "<b>1. REQUEST FOR DETERMINATION</b>"),
          ].join("\n"),
        ),
        [font(0, 18), font(1, 36)].join("\n"),
      ),
    )
    expect(html).toContain("<h2><b>CITY OF HAVERHILL</b></h2>")
    expect(html).toContain("<h3><b>1. REQUEST FOR DETERMINATION</b></h3>")
  })

  it("only promotes a bold line that looks like a section head", () => {
    // Minutes bold the applicant, trading name and street address under each
    // item; promoting those buries the numbered structure they sit beneath.
    const html = convertXmlToHtml(
      doc(
        page(
          [
            text(
              160,
              81,
              700,
              "Body copy, establishing how wide the text column on this page runs.",
            ),
            text(200, 54, 300, "<b>4.1 Erich J Prinz, President</b>"),
            text(240, 54, 300, "<b>River Street Petroleum, Inc.</b>"),
            text(280, 54, 300, "<b>790 River Street</b>"),
          ].join("\n"),
        ),
      ),
    )
    expect(html).toContain("<h2><b>4.1 Erich J Prinz, President</b></h2>")
    expect(html).toContain("<p><b>River Street Petroleum, Inc.</b></p>")
    expect(html).toContain("<p><b>790 River Street</b></p>")
  })

  it("starts a new paragraph where a first line is indented", () => {
    const html = convertXmlToHtml(
      doc(
        page(
          [
            text(200, 108, 692, "First paragraph, whose opening line is indented,"),
            text(221, 81, 719, "and which wraps back to the left margin below it."),
            text(242, 108, 692, "Second paragraph, indented again to mark the break."),
          ].join("\n"),
        ),
      ),
    )
    expect(html.match(/<p>/g)).toHaveLength(2)
    expect(html).toContain("indented, and which wraps")
  })

  it("strips a repeated letterhead and footer but keeps repeated body text", () => {
    // The letterhead here reaches 18% down the page, past any plausible margin
    // band, and `Second: seconded.` recurs mid-page on every page as real
    // content. Only the shared leading and trailing runs may be dropped.
    const pages = [1, 2, 3].map((n) =>
      page(
        [
          text(58, 511, 400, "Haverhill License Commission, Room 118"),
          text(189, 649, 300, "nflynn@haverhillma.gov"),
          text(
            400,
            81,
            700,
            `The commission took up the ${"application review renewal".split(" ")[n - 1]} at this point in the evening.`,
          ),
          text(500, 81, 700, "Second: seconded."),
          text(1096, 81, 300, `Page ${n} of 3`),
        ].join("\n"),
        { number: n },
      ),
    )
    const html = convertXmlToHtml(doc(pages))
    expect(html).not.toContain("nflynn@haverhillma.gov")
    expect(html).not.toContain("Page 2 of 3")
    expect(html.match(/Second: seconded\./g)).toHaveLength(3)
    expect(html).toContain("took up the review at this point")
  })

  it("leaves a short document alone, where a repeat is not yet a pattern", () => {
    const pages = [1, 2].map((n) =>
      page(text(58, 511, 400, "Haverhill License Commission, Room 118"), { number: n }),
    )
    expect(convertXmlToHtml(doc(pages)).match(/Room 118/g)).toHaveLength(2)
  })

  it("wraps each page in a labelled section", () => {
    const html = convertXmlToHtml(
      doc([page(text(200, 81, 700, "One.")), page(text(200, 81, 700, "Two."), { number: 2 })]),
    )
    expect(html).toContain('<section aria-label="Page 1">')
    expect(html).toContain('<section aria-label="Page 2">')
  })
})

describe("hasReadableText", () => {
  it("accepts ordinary prose", () => {
    expect(hasReadableText("<p>The Commission will meet on Thursday evening.</p>")).toBe(true)
  })

  it("rejects the stray glyphs a scanned drawing leaves behind", () => {
    // Taken from an 82MB Council packet whose only text layer is noise off the
    // site plans. Non-empty, but not a document.
    expect(hasReadableText("<p>e ::I JI 11I I I I 0 I I I , I II I I I</p>")).toBe(false)
  })

  it("rejects an empty conversion", () => {
    expect(hasReadableText("")).toBe(false)
  })

  it("keeps a short agenda that is mostly numbers and names", () => {
    expect(hasReadableText("<p>1. Roll call 2. Minutes 3. Adjourn</p>")).toBe(true)
  })

  it("looks past markup and entities rather than counting them as text", () => {
    expect(hasReadableText('<a href="https://example.gov/x">&amp;</a>')).toBe(false)
  })
})
