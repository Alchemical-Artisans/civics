import { describe, it, expect } from "vitest"
import { amount, cell, column, sum } from "$lib/budget-table"
import { APPROPRIATIONS, DEPARTMENTS, REVENUE } from "./2027-budget-in-brief/tables"

/**
 * What the book's own page 78 says about itself.
 *
 * The chart and the transcription now render from one copy of these figures,
 * so there is no longer a drift to guard against. What is worth pinning is the
 * arithmetic: the two tables are meant to balance, one of them does not quite,
 * and a future correction should have to look at that on purpose.
 */
const CHARTED = "2027 Proposed"
const TOTAL = 285272159

describe("page 78", () => {
  it("states the same grand total on both tables", () => {
    expect(amount(cell(APPROPRIATIONS, "Grand Total", CHARTED))).toBe(TOTAL)
    expect(amount(cell(REVENUE, "Grand Total", CHARTED))).toBe(TOTAL)
  })

  it("balances revenue against that total exactly", () => {
    const rows = column(REVENUE, CHARTED, { exclude: ["Grand Total", "Budget Surplus (Deficit)"] })
    expect(sum(rows)).toBe(TOTAL)
  })

  // The book prints both figures. The site shows the stated total, and this is
  // here so that a correction to any appropriation line has to account for the
  // dollar rather than silently absorbing it.
  it("has an appropriations column a dollar over its own total", () => {
    const rows = column(APPROPRIATIONS, CHARTED, { exclude: ["Grand Total"] })
    expect(sum(rows)).toBe(TOTAL + 1)
  })

  it("charts every category and no totals", () => {
    const rows = column(APPROPRIATIONS, CHARTED, { exclude: ["Grand Total"] })
    expect(rows.map((r) => r.label)).not.toContain("Grand Total")
    expect(rows).toHaveLength(13)
    expect(rows.some((r) => r.label === "Capital - Pay as you go")).toBe(false)
  })
})

describe("the department table", () => {
  // Pages 76-77 are not charted, but they are the same figures rolled up
  // differently, and the book's own recommended column agrees with the sum of
  // the functions rather than with the total it prints beside it.
  it("recommends what the appropriations column adds up to", () => {
    expect(amount(cell(DEPARTMENTS, "Grand Total", "2027 Recommended"))).toBe(TOTAL + 1)
  })
})
