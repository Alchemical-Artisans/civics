import { describe, it, expect } from "vitest"
import { sum } from "$lib/budget-table"
import { SPENDING, SPENDING_TOTAL } from "./tables"

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
