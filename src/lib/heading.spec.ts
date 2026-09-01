import { describe, it, expect } from "vitest"
import { barOf, headingOf } from "./heading"

const BOOK = { year: 2027, budget: "https://example.org/fy2027.pdf" }

describe("barOf", () => {
  it("names a budget book by its year, and says what that year covers", () => {
    const bar = barOf({ book: BOOK })
    expect(bar.name).toBe("2027 Budget")
    expect(bar.dates).toBe("July 1, 2026 to June 30, 2027")
    expect(bar.source).toBe(BOOK.budget)
  })

  // A section's own `+page.ts` is loaded under the layout that looked the book
  // up, so both are in `page.data` and the more specific one has to win.
  it("prefers a section's own title, and opens the book at that section", () => {
    const bar = barOf({ book: BOOK, section: { title: "Fiscal Reserves", page: 17 } })
    expect(bar.name).toBe("Fiscal Reserves")
    expect(bar.source).toBe(`${BOOK.budget}#page=17`)
  })

  it("says nothing about a page that heads itself", () => {
    expect(barOf({})).toEqual({ name: null, dates: null, source: null })
  })

  // FY2022 and FY2023 are printed as plain text on the city's page, with no
  // file behind them, and a book that is not published has no source to link.
  it("has no source where the city published no file", () => {
    expect(barOf({ book: { year: 2023, budget: null } }).source).toBeNull()
  })
})

describe("headingOf", () => {
  it("is the bar's name", () => {
    expect(headingOf({ book: BOOK })).toBe("2027 Budget")
  })
})
