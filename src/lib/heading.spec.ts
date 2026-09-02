import { describe, it, expect } from "vitest"
import { barOf, headingOf } from "./heading"

const BOOK = { year: 2027, budget: "https://example.org/fy2027.pdf" }

describe("barOf", () => {
  it("names a budget book by its year, and says what that year covers", () => {
    const bar = barOf({ book: BOOK })
    expect(bar.name).toBe("2027 Budget")
    expect(bar.dates).toBe("July 1, 2026 to June 30, 2027")
  })

  // The book's own front page does not link the book: the file hangs off the
  // budget calendar there, on the step of the process that produced it.
  it("leaves the book unlinked on the page that is the book", () => {
    expect(barOf({ book: BOOK }).sources).toEqual([])
  })

  // A section's own `+page.ts` is loaded under the layout that looked the book
  // up, so both are in `page.data` and the more specific one has to win.
  it("prefers a section's own title, and opens the book at that section", () => {
    const bar = barOf({ book: BOOK, section: { title: "Fiscal Reserves", page: 17 } })
    expect(bar.name).toBe("Fiscal Reserves")
    expect(bar.sources).toEqual([{ label: "Original Source", href: `${BOOK.budget}#page=17` }])
  })

  it("says nothing about a page that heads itself", () => {
    expect(barOf({})).toEqual({ name: null, dates: null, sources: [] })
  })

  // FY2022 and FY2023 are printed as plain text on the city's page, with no
  // file behind them, and a book that is not published has no source to link.
  it("has no source where the city published no file", () => {
    const bar = barOf({ book: { year: 2023, budget: null }, section: { title: "X", page: 1 } })
    expect(bar.sources).toEqual([])
  })

  // A page can rest on a document that is not the book: the front page charts
  // the Council's own appropriation orders, which are on an agenda.
  it("carries what else a page says it was built from, after the book", () => {
    const order = { label: "City Council Order", href: "https://example.org/agenda.pdf" }
    const bar = barOf({ book: BOOK, section: { title: "Spending", page: 15 }, sources: [order] })

    expect(bar.sources).toEqual([
      { label: "Original Source", href: `${BOOK.budget}#page=15` },
      order,
    ])
  })
})

describe("headingOf", () => {
  it("is the bar's name", () => {
    expect(headingOf({ book: BOOK })).toBe("2027 Budget")
  })
})
