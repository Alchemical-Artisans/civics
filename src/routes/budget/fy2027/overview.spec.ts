import { describe, it, expect } from "vitest"
import { amount, cell, column, sum } from "$lib/budget-table"
import { APPROPRIATIONS, DEPARTMENTS } from "./spending/tables"
import { OTHER_AVAILABLE, REVENUE } from "./revenue/tables"
import { FUND_BALANCE, FREE_CASH, STABILIZATION } from "./reserves/tables"
import { LONG_TERM_DEBT } from "./debt/tables"
import {
  APPROPRIATED,
  ENTERPRISE,
  ENTERPRISE_REVENUE,
  GENERAL_FUND,
  ORDERS,
} from "./council-orders"

/**
 * What the book's own page 78 says about itself.
 *
 * The chart and the transcription now render from one copy of these figures,
 * so there is no longer a drift to guard against. What is worth pinning is the
 * arithmetic: the two tables are meant to balance, one of them does not quite,
 * and a future correction should have to look at that on purpose.
 */
const CHARTED = "2027 Proposed"
const RECOMMENDED = "2027 Recommended"
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

  // The front page's list of what the city funds prices each line from this
  // table. Education is the one line with no row of its own: the book budgets
  // the schools in two pieces, and page 78's category for them is those two
  // pieces added up, which is what makes the list's figure the book's and not
  // an invention of ours.
  it("budgets the schools in the two pieces page 78 adds together", () => {
    const schools =
      amount(cell(DEPARTMENTS, "School Department", RECOMMENDED))! +
      amount(cell(DEPARTMENTS, "Regional Schools", RECOMMENDED))!

    expect(schools).toBe(amount(cell(APPROPRIATIONS, "Education", CHARTED)))
    expect(schools).toBe(147158454)
  })

  // Every line of that list finds a row, under one name or another. The pairing
  // is written out in `+page.ts` because the two pages of the book disagree
  // about what a department is called; what makes it a pairing rather than a
  // guess is that nothing is left over on either side.
  it("has one row per thing the city funds, and twelve rows that are not", () => {
    const NOT_A_DEPARTMENT = [
      // Money the city owes or is charged rather than a thing it runs. Each has
      // its own line elsewhere on the front page, or none.
      "Debt Services",
      "Employee Benefits",
      "Liability Insurance",
      "State Assessments",
      "Reserves",
      "Other",
      "Pay As You Go Capital",
      // The two school lines, which the list carries as one "Education", and
      // the third the book zeroed out this year.
      "School Department",
      "Regional Schools",
      "Other Education Funding",
      // Departments the book still prints a history for and no longer funds:
      // building inspections folded into Health & Inspections, and the crossing
      // guards' line has been empty since 2022.
      "Building Inspections",
      "Crossing Guards",
      "Grand Total",
    ]

    const departments = DEPARTMENTS.rows
      .map((row) => row.label)
      .filter((label) => !NOT_A_DEPARTMENT.includes(label))

    expect(departments).toHaveLength(32)
    // Thirty-three lines in the list: these thirty-two, plus Education.
    expect(new Set(departments).size).toBe(32)
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

describe("the two columns", () => {
  const NOT_A_CATEGORY = ["Grand Total", "Budget Surplus (Deficit)"]

  const spending = [
    ...column(APPROPRIATIONS, CHARTED, { exclude: NOT_A_CATEGORY }),
    ...column(ENTERPRISE, "Amount"),
  ]

  // What the two departments are billed, whole: the reimbursement they send the
  // general fund is inside these, so the book's own line for it is left out
  // rather than charted beside them.
  const billed = column(ENTERPRISE_REVENUE, "Amount")

  // The trust row is charted under the name the book's prose gives it, "the
  // Hospital Trust fund, which subsidizes the Public Health department", rather
  // than the "Transfer from Trust & Agency" its table heads the row with.
  const trust = column(OTHER_AVAILABLE, CHARTED, {
    exclude: ["Grand Total", "Free Cash (Budget Only)", "Transfer From Enterprise"],
  }).map((row) => ({ ...row, label: "Hospital Trust" }))

  const revenue = [
    ...column(REVENUE, CHARTED, {
      exclude: [...NOT_A_CATEGORY, "OTHER AVAILABLE REVENUE SOURCES"],
    }),
    ...trust,
    ...billed,
  ]

  // The spending column is the book's stated total plus what the two
  // departments appropriate, which is their revenue less what they send the
  // general fund.
  const stated =
    amount(cell(APPROPRIATIONS, "Grand Total", CHARTED))! + sum(column(ENTERPRISE, "Amount"))

  // The gap between the columns is the whole point of drawing them: the year
  // does not pay for itself, and last year's surplus closes it.
  it("is short of what it spends by the free cash it leaves out", () => {
    expect(stated).toBe(316044835)
    expect(sum(revenue)).toBe(310893296)

    const freeCash = amount(cell(OTHER_AVAILABLE, "Free Cash (Budget Only)", CHARTED))!
    expect(stated - sum(revenue)).toBe(freeCash + 1539)
  })

  // That $1,539: the book projected the enterprise reimbursement at $935,304 in
  // May and the orders set it at $933,765 in June. The chart takes the orders'
  // figures for the departments, so the difference lands in the gap.
  it("differs from the book by the month between a projection and a vote", () => {
    const projected = amount(cell(OTHER_AVAILABLE, "Transfer From Enterprise", CHARTED))!
    expect(projected - (234784 + 698981)).toBe(1539)
  })

  // Page 63 is the only place the book breaks that line open. What is taken
  // from it is the Hospital Trust money that subsidises Public Health; the free
  // cash and the reimbursement are left out, for different reasons.
  it("keeps only the trust money from the book's available-funds line", () => {
    expect(sum(column(OTHER_AVAILABLE, CHARTED, { exclude: ["Grand Total"] }))).toBe(
      amount(cell(REVENUE, "OTHER AVAILABLE REVENUE SOURCES", CHARTED)),
    )
    expect(trust).toHaveLength(1)
    expect(trust[0]).toEqual({ label: "Hospital Trust", amount: 125000 })
    expect(cell(OTHER_AVAILABLE, "Transfer from Trust & Agency", CHARTED)).toBe("$125,000")
    expect(revenue.map((r) => r.label)).not.toContain("Transfer From Enterprise")
    expect(revenue.map((r) => r.label)).not.toContain("Free Cash (Budget Only)")
  })

  // The book's appropriations column is a dollar over the total printed under
  // it. The site shows the stated total, so the slices come to a dollar more.
  it("draws a dollar more than the book states", () => {
    expect(sum(spending)).toBe(316044836)
  })

  // Whole, not net: the reimbursement is inside these, which is why the book's
  // own line for it is not charted beside them.
  it("charts what the two departments are billed", () => {
    expect(sum(billed)).toBe(31706441)
    expect(sum(billed) - (234784 + 698981)).toBe(30772676)
  })

  // Charged rather than chosen, but spent: the Commonwealth bills the city and
  // the assessors raise the overlay, and both are in what the city spends.
  it("keeps the assessments and the overlay in what the city spends", () => {
    const labels = spending.map((r) => r.label)
    expect(labels).toContain("State Assessments")
    expect(labels).toContain("Overlay")
    expect(labels).toContain("Water Department")
    expect(labels).toContain("Wastewater Department")
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

  // The orders are quoted on the spending page, so their wording is part of the
  // record too -- including the spaces the agenda sets inside its numbers.
  it("quotes the orders as the agenda words them", () => {
    expect(ORDERS.map((o) => o.item)).toEqual(["13.1", "13.2", "13.3", "13.4"])
    expect(ORDERS[1].text).toContain("$15, 967,043")
    expect(ORDERS[0].parts).toContain("$ 0 comes from available Retaining Earnings")
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
