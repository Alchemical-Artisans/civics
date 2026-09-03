import { describe, it, expect } from "vitest"
import { amount, cell, column, sum } from "$lib/budget-table"
import { LONG_TERM_DEBT, ANNUAL_DEBT_PAYMENTS, DEBT_PER_CAPITA, DEBT_POLICIES } from "./tables"

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

/** What the payments chart draws: page 22's middle row, on its own scale
    because the revenue row beside it is two orders of magnitude larger. */
describe("five years of annual debt payments", () => {
  const YEARS = ANNUAL_DEBT_PAYMENTS.columns.slice(1)

  it("rises to $8,834,819 by 2027", () => {
    expect(amount(cell(ANNUAL_DEBT_PAYMENTS, "Annual Debt Payments", "2027"))).toBe(8834819)
  })

  // The book's own row is the two other rows' share, to the tenth of a
  // percent -- checked here so a correction to either dollar row has to
  // account for this one too.
  it("prints the payment's share of revenue in its own row", () => {
    for (const year of YEARS) {
      const revenue = amount(cell(ANNUAL_DEBT_PAYMENTS, "General Fund Revenue", year))!
      const payment = amount(cell(ANNUAL_DEBT_PAYMENTS, "Annual Debt Payments", year))!
      const share = cell(ANNUAL_DEBT_PAYMENTS, "Debt Payments as % of Revenue", year)

      expect(Math.round((payment / revenue) * 1000) / 10).toBeCloseTo(percent(share), 1)
    }
  })
})

/** What the comparison chart draws: eleven years of Haverhill against the
    state average, both in the same units. */
describe("eleven years of debt per capita", () => {
  it("has Haverhill below the state average every year but its own high", () => {
    for (const row of DEBT_PER_CAPITA.rows) {
      const haverhill = amount(cell(DEBT_PER_CAPITA, row.label, "Haverhill"))!
      const state = amount(cell(DEBT_PER_CAPITA, row.label, "State Average"))!
      expect(haverhill).toBeLessThanOrEqual(state)
    }
  })

  it("closes 2026 the closest it has been to the state average", () => {
    const haverhill = amount(cell(DEBT_PER_CAPITA, "2026", "Haverhill"))!
    const state = amount(cell(DEBT_PER_CAPITA, "2026", "State Average"))!
    expect(state - haverhill).toBe(136)
  })
})
