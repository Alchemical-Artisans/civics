import { describe, it, expect } from "vitest"
import { amount, cell, column, sum } from "$lib/budget-table"
import { SPENDING, SPENDING_TOTAL, CAPITAL_REQUESTS } from "./tables"

/**
 * What the page's own bar rests on: the same figure the front page's column
 * states, page 78's own total plus the two enterprise funds it carries
 * nowhere. One copy in `tables.ts`, read by both charts -- see the note
 * there -- so this pins the copy rather than either chart's use of it.
 */
describe("the spending bar", () => {
  it("totals what the book states plus the two enterprise funds", () => {
    expect(SPENDING_TOTAL).toBe(316044835)
  })

  it("draws one segment per category, general fund and enterprise both", () => {
    // The page-78 categories less "Grand Total", plus Water and Wastewater.
    expect(SPENDING).toHaveLength(15)
  })

  // The book's appropriations column adds to a dollar over the total it
  // prints -- see `fy2027/+page.ts` -- so the bar states the book's own
  // figure rather than the sum of its parts, and this is the dollar between
  // them rather than a mistake in either.
  it("comes within a dollar of what the book states, and no more", () => {
    expect(sum(SPENDING) - SPENDING_TOTAL).toBe(1)
  })
})

/**
 * Page 29's table, which the line graph reads a category at a time. Pinned
 * against the book's own row and column totals so a transcription error
 * shows up here rather than only as a line in the wrong place.
 */
describe("the five-year capital requests chart", () => {
  const YEARS = CAPITAL_REQUESTS.columns.slice(1, -1)
  const CATEGORIES = CAPITAL_REQUESTS.rows
    .map((row) => row.label)
    .filter((label) => label !== "Grand Total")

  it("charts nine categories across five years", () => {
    expect(CATEGORIES).toHaveLength(9)
    expect(YEARS).toEqual(["2027", "2028", "2029", "2030", "2031"])
  })

  it("sums each category's five years to its own Grand Total column", () => {
    for (const category of CATEGORIES) {
      const years = YEARS.map((year) => amount(cell(CAPITAL_REQUESTS, category, year)) ?? 0)
      const stated = amount(cell(CAPITAL_REQUESTS, category, "Grand Total"))!
      expect(years.reduce((total, value) => total + value, 0)).toBe(stated)
    }
  })

  it("sums each year's nine categories to the book's own Grand Total row", () => {
    for (const year of YEARS) {
      const categories = CATEGORIES.map(
        (category) => amount(cell(CAPITAL_REQUESTS, category, year)) ?? 0,
      )
      const stated = amount(cell(CAPITAL_REQUESTS, "Grand Total", year))!
      expect(categories.reduce((total, value) => total + value, 0)).toBe(stated)
    }
  })

  it("peaks in 2028 on Buildings & Building Improvements, the JGW/Fire Station year", () => {
    expect(amount(cell(CAPITAL_REQUESTS, "Buildings & Building Improvements", "2028"))).toBe(
      125002000,
    )
  })

  it("sums to the $173,903,952 the book states across every category and year", () => {
    expect(amount(cell(CAPITAL_REQUESTS, "Grand Total", "Grand Total"))).toBe(173903952)
    expect(sum(column(CAPITAL_REQUESTS, "Grand Total", { exclude: ["Grand Total"] }))).toBe(
      173903952,
    )
  })
})
