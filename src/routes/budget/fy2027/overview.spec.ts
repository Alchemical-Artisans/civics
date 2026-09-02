import { describe, it, expect } from "vitest"
import { amount, cell, column, sum } from "$lib/budget-table"
import { APPROPRIATIONS, DEPARTMENTS } from "./spending/tables"
import { REVENUE } from "./revenue/tables"
import { FUND_BALANCE, FREE_CASH, STABILIZATION } from "./reserves/tables"
import { LONG_TERM_DEBT } from "./outstanding-debt/tables"
import { APPROPRIATED, ENTERPRISE, GENERAL_FUND } from "./council-orders"

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

describe("page 21, the debt the front page charts", () => {
  // The section's own sentence: "This translates into $175,745,444 in
  // outstanding bonds." The pie draws the six lines, so the six lines have to
  // come to what the sentence beside them claims.
  it("adds up to the total the section states", () => {
    expect(sum(column(LONG_TERM_DEBT, "Amount"))).toBe(175745444)
  })

  it("charts one slice per purpose", () => {
    expect(column(LONG_TERM_DEBT, "Amount")).toHaveLength(6)
  })
})

describe("page 17, the reserves the front page charts", () => {
  // The front page adds the three balances into one bar. The book never adds
  // them, so the sum is arithmetic of ours: this is what it comes to, and it
  // is here so that a correction to any dial has to account for the total.
  it("holds $21,986,546 across the three funds", () => {
    const held = [
      amount(cell(FUND_BALANCE, "Actual", "Amount"))!,
      amount(cell(STABILIZATION, "Actual Balance", "Amount"))!,
      amount(cell(FREE_CASH, "Anticipated", "Amount"))!,
    ]
    expect(held.reduce((a, b) => a + b, 0)).toBe(21986546)
  })

  // Free cash is certified out of the undesignated fund balance, so a year
  // with both would count some of the money twice. This year's is nothing,
  // which is what makes the sum above sound -- and this is the assertion that
  // will fail when that stops being true.
  it("has no free cash to double-count", () => {
    expect(amount(cell(FREE_CASH, "Anticipated", "Amount"))).toBe(0)
  })

  // The share is printed in the same cell as the money, and the front page
  // pulls the two apart to label the bar.
  it("prints a share beside the balance", () => {
    expect(cell(FUND_BALANCE, "Actual", "Amount")).toContain("(7.85%)")
    expect(amount(cell(FUND_BALANCE, "Actual", "Amount"))).toBe(13985452)
  })
})

describe("the Council's orders of 2 June 2026", () => {
  // Order 13.3 states a total and then lists what funds it. The chart draws
  // the five sources and adds them up itself, so they have to come to the
  // figure the order states.
  it("funds the general fund appropriation from five sources", () => {
    const sources = column(GENERAL_FUND, "Amount")
    expect(sources).toHaveLength(5)
    expect(sum(sources)).toBe(amount(APPROPRIATED))
  })

  // The gap between what the Council votes and what the book prints: state
  // assessments and the overlay, which are charged to the city rather than
  // appropriated by it. A dollar of it is the same dollar the appropriations
  // column is already known to be over its own total by.
  it("votes less than the book proposes, by the assessments and the overlay", () => {
    const charged =
      amount(cell(APPROPRIATIONS, "State Assessments", CHARTED))! +
      amount(cell(APPROPRIATIONS, "Overlay", CHARTED))!

    expect(TOTAL - amount(APPROPRIATED)!).toBe(charged - 1)
  })

  // The two enterprise departments, which the book does not carry at all.
  it("appropriates the water and wastewater departments separately", () => {
    const funds = column(ENTERPRISE, "Amount")
    expect(funds.map((f) => f.label)).toEqual(["Water Department", "Wastewater Department"])
    expect(sum(funds)).toBe(30772676)
  })

  // Each enterprise order also appropriates an amount inside the general fund,
  // funded from that department's receipts. Those are rows of order 13.3, so
  // the two bars on the chart do not count them twice.
  it("counts the receipts transfers once, in the general fund", () => {
    expect(amount(cell(GENERAL_FUND, "Water Receipts", "Amount"))).toBe(234784)
    expect(amount(cell(GENERAL_FUND, "Wastewater Receipts", "Amount"))).toBe(698981)
  })
})
