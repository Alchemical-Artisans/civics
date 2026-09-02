import { describe, it, expect } from "vitest"
import { barOf, headingOf } from "./heading"

const BOOK = { id: "fy2027", year: 2027, budget: "https://example.org/fy2027.pdf" }

describe("barOf", () => {
  it("names a budget book by its year, and says what that year covers", () => {
    const bar = barOf({ book: BOOK })
    expect(bar.name).toBe("2027 Budget")
    expect(bar.dates).toBe("July 1, 2026 to June 30, 2027")
  })

  // The page that is the book has nothing above it but the site itself, which
  // is the mark at the far left of the bar and not part of this.
  it("gives a book's own page no trail", () => {
    expect(barOf({ book: BOOK }).trail).toEqual([])
  })

  // A section's own `+page.ts` is loaded under the layout that looked the book
  // up, so both are in `page.data` and the more specific one has to win.
  it("prefers a section's own title to the book's name", () => {
    const bar = barOf({ book: BOOK, section: { title: "Fiscal Reserves", page: 17 } })
    expect(bar.name).toBe("Fiscal Reserves")
    expect(bar.dates).toBe("July 1, 2026 to June 30, 2027")
  })

  // A section used to take the bar over -- "Haverhill Public Documents /
  // Reserves" -- which named the page and lost the year it belonged to. The
  // book goes before it, and is the way back to it.
  it("puts the book before a section of it, as a link to the book", () => {
    const bar = barOf({ book: BOOK, section: { title: "Fiscal Reserves", page: 17 } })
    expect(bar.trail).toEqual([{ name: "2027 Budget", href: "/budget/fy2027" }])
  })

  it("says nothing about a page that heads itself", () => {
    expect(barOf({})).toEqual({ name: null, dates: null, trail: [] })
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

    expect(bar).toEqual({
      name: "Spending",
      dates: "July 1, 2026 to June 30, 2027",
      trail: [{ name: "2027 Budget", href: "/budget/fy2027" }],
    })
  })
})

describe("headingOf", () => {
  it("is the bar's name", () => {
    expect(headingOf({ book: BOOK })).toBe("2027 Budget")
  })
})
