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

  it("draws one segment per department with a 2027 figure, plus the two enterprise funds", () => {
    // Forty-four departments less the four with nothing recommended for
    // 2027 (Building Inspections, Crossing Guards, Other Education Funding,
    // Pay As You Go Capital -- all already accounted for elsewhere, per
    // `overview.spec.ts`'s "the department table"), plus Water and
    // Wastewater.
    expect(SPENDING).toHaveLength(42)
  })

  // The department table's own Grand Total is a dollar over the total
  // `APPROPRIATIONS` and the revenue table both state -- see `tables.ts`'s
  // own note on `SPENDING_TOTAL` -- so building the bar's segments from the
  // department table draws a dollar more than the total it is shown beside,
  // the same dollar as before the segments moved from categories to
  // departments, for a different reason.
  it("comes within a dollar of what the book states, and no more", () => {
    expect(sum(SPENDING) - SPENDING_TOTAL).toBe(1)
  })
})
