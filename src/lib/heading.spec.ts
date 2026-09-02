import { describe, it, expect } from "vitest"
import { barOf, headingOf } from "./heading"

const BOOK = { year: 2027, budget: "https://example.org/fy2027.pdf" }

describe("barOf", () => {
  it("names a budget book by its year, and says what that year covers", () => {
    const bar = barOf({ book: BOOK })
    expect(bar.name).toBe("2027 Budget")
    expect(bar.dates).toBe("July 1, 2026 to June 30, 2027")
  })

  // A section's own `+page.ts` is loaded under the layout that looked the book
  // up, so both are in `page.data` and the more specific one has to win.
  it("prefers a section's own title to the book's name", () => {
    const bar = barOf({ book: BOOK, section: { title: "Fiscal Reserves", page: 17 } })
    expect(bar.name).toBe("Fiscal Reserves")
    expect(bar.dates).toBe("July 1, 2026 to June 30, 2027")
  })

  it("says nothing about a page that heads itself", () => {
    expect(barOf({})).toEqual({ name: null, dates: null })
  })

  // The bar carried an "Original Source" link, and anything else a page named
  // in its own `sources`, until the budget calendar in the footer took both
  // over: the book off the step that produced it, the Council's orders off the
  // hearings their agenda falls inside. Nothing a page puts in `page.data` puts
  // a link back in the bar.
  it("carries no link to a document at all", () => {
    const bar = barOf({
      book: BOOK,
      section: { title: "Spending", page: 15 },
      sources: [{ label: "City Council Order", href: "https://example.org/agenda.pdf" }],
    })

    expect(bar).toEqual({ name: "Spending", dates: "July 1, 2026 to June 30, 2027" })
  })
})

describe("headingOf", () => {
  it("is the bar's name", () => {
    expect(headingOf({ book: BOOK })).toBe("2027 Budget")
  })
})
