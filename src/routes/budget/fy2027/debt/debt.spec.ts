import { describe, it, expect } from "vitest"
import { cell, column, sum } from "$lib/budget-table"
import { LONG_TERM_DEBT, DEBT_POLICIES } from "./tables"

const percent = (value: string) => Number(value.replace("%", ""))

/**
 * What the page's composition chart rests on: page 21's own sentence, "This
 * translates into $175,745,444 in outstanding bonds."
 */
describe("the long term debt chart", () => {
  it("adds up to the total the section states", () => {
    expect(sum(column(LONG_TERM_DEBT, "Amount"))).toBe(175745444)
  })

  it("charts one segment per purpose", () => {
    expect(column(LONG_TERM_DEBT, "Amount")).toHaveLength(6)
  })
})

/**
 * The three policies, each read against where the city actually stands. The
 * book states these two ways -- a sentence in the Results paragraph and a
 * bare percentage here -- and this is what keeps the two from disagreeing.
 */
describe("the three debt policies", () => {
  it("keeps debt inside its ceiling of the equalized valuation", () => {
    expect(percent(cell(DEBT_POLICIES, "Long Term Debt", "Limit"))).toBe(5)
    expect(percent(cell(DEBT_POLICIES, "Long Term Debt", "Actual"))).toBe(1.5)
  })

  it("keeps debt service inside its ceiling of general fund revenue", () => {
    expect(percent(cell(DEBT_POLICIES, "Annual Debt Payments", "Limit"))).toBe(4)
    expect(percent(cell(DEBT_POLICIES, "Annual Debt Payments", "Actual"))).toBe(3.1)
  })

  // The one policy of the three the city is not meeting: a floor of 65%
  // retired within ten years, against 59% actually on track to be.
  it("falls short of the floor on retiring debt within ten years", () => {
    const limit = percent(cell(DEBT_POLICIES, "Retiring Debt", "Limit"))
    const actual = percent(cell(DEBT_POLICIES, "Retiring Debt", "Actual"))
    expect(limit).toBe(65)
    expect(actual).toBe(59)
    expect(actual).toBeLessThan(limit)
  })
})
