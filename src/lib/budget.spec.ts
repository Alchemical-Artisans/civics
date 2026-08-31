import { describe, it, expect } from "vitest"
import { contents, fiscalYears, sectionSlug } from "./budget"

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
      ["Fiscal Reserves", 17],
      ["Glossary", 231],
    ])
    expect(written.written).toBe(true)
    expect(absent.written).toBe(false)
  })

  it("does not credit one book's sections to another", () => {
    expect(contents("fy2026", [["Fiscal Reserves", 17]])[0].written).toBe(false)
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
