import { describe, it, expect } from "vitest"
import { contents, fiscalYears, headline, sectionSlug } from "./budget"

describe("sectionSlug", () => {
  it("slugs a plain title", () => {
    expect(sectionSlug("Fiscal Reserves")).toBe("fiscal-reserves")
  })

  // The bug this rule exists for: collapsing the apostrophe gives
  // `mayor-s-budget-message`, which no directory would be named.
  it("drops apostrophes rather than turning them into dashes", () => {
    expect(sectionSlug("Mayor's Budget Message")).toBe("mayors-budget-message")
    expect(sectionSlug("Treasurer’s & Collector's Office")).toBe("treasurers-collectors-office")
  })

  it("keeps digits, including a title that opens with them", () => {
    expect(sectionSlug("2027 Estimated Tax Bill Impact")).toBe("2027-estimated-tax-bill-impact")
    expect(sectionSlug("10-Year Revenue Forecast")).toBe("10-year-revenue-forecast")
  })

  it("collapses runs of punctuation and trims the ends", () => {
    expect(sectionSlug("Liability, Overlay & Reserves")).toBe("liability-overlay-reserves")
  })
})

describe("contents", () => {
  it("keeps the book's order, titles and page numbers", () => {
    const list = contents("fy2027", [
      ["Mayor's Budget Message", 2],
      ["Budget Calendar", 13],
    ])
    expect(list.map((s) => [s.title, s.page, s.slug])).toEqual([
      ["Mayor's Budget Message", 2, "mayors-budget-message"],
      ["Budget Calendar", 13, "budget-calendar"],
    ])
  })

  // The glob is resolved against the real route directories, so this asserts
  // that a section written up is found and one that is not is not -- which is
  // what decides whether the contents page links here or into the city's PDF.
  it("marks a section written when its route directory exists", () => {
    const [written, absent] = contents("fy2027", [
      // A section's slug is its title, and "Reserves" is a page here; the
      // book's own "Fiscal Reserves" is a heading on it rather than a route.
      ["Reserves", 17],
      // Not a page here, and unlikely to become one: the book's own contents
      // lists it, and the site has no section by that name.
      ["Mayor's Budget Message", 2],
    ])
    expect(written.written).toBe(true)
    expect(absent.written).toBe(false)
  })

  it("does not credit one book's sections to another", () => {
    expect(contents("fy2026", [["Reserves", 17]])[0].written).toBe(false)
  })
})

describe("fiscalYears", () => {
  it("runs newest first, back to 2006", () => {
    const years = fiscalYears().map((y) => y.year)
    expect(years[0]).toBe(2027)
    expect(years.at(-1)).toBe(2006)
    expect(years).toEqual([...years].sort((a, b) => b - a))
  })

  it("gives every year an id matching its route directory", () => {
    expect(fiscalYears().find((y) => y.year === 2027)?.id).toBe("fy2027")
  })

  // The city's page prints these two years with no link behind the words
  // "Mayor's Budget", and lists no audit for a year it has not yet audited.
  it("records the gaps in the city's own listing", () => {
    const by = new Map(fiscalYears().map((y) => [y.year, y]))
    expect(by.get(2023)!.budget).toBeNull()
    expect(by.get(2022)!.budget).toBeNull()
    expect(by.get(2027)!.audit).toBeNull()
    expect(by.get(2025)!.audit).toContain("haverhill-financials-25.pdf")
  })

  it("marks FY2027 written, since its book has a page here", () => {
    expect(fiscalYears().find((y) => y.id === "fy2027")?.written).toBe(true)
  })
})

describe("headline", () => {
  const parts = [
    { label: "Small", amount: 1 },
    { label: "Large", amount: 100 },
    { label: "Middling", amount: 10 },
    { label: "Tiny", amount: 2 },
    { label: "Smaller", amount: 3 },
  ]

  it("keeps the largest few, largest first", () => {
    expect(
      headline(parts)
        .slice(0, 3)
        .map((part) => part.label),
    ).toEqual(["Large", "Middling", "Smaller"])
  })

  // The bar is still the whole side: what is left over is drawn rather than
  // dropped, so the segments add up to what the column is worth.
  it("gathers the rest into one part rather than dropping it", () => {
    const rolled = headline(parts)
    expect(rolled.at(-1)).toEqual({ label: "Everything else", amount: 3 })
    expect(rolled.reduce((sum, part) => sum + part.amount, 0)).toBe(116)
  })

  it("adds no leftover part when the largest few are all of them", () => {
    expect(headline(parts, 5).map((part) => part.label)).not.toContain("Everything else")
  })

  it("leaves the caller's array alone", () => {
    headline(parts)
    expect(parts[0].label).toBe("Small")
  })
})
