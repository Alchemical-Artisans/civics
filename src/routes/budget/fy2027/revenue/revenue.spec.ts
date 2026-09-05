import { describe, it, expect } from "vitest"
import { amount, cell, column, sum } from "$lib/budget-table"
import {
  DEPARTMENT_REVENUE,
  EXCISE,
  FEES,
  FINES_INVESTMENTS,
  LICENSE_PERMITS,
  OTHER_LOCAL_RECEIPTS,
  REVENUE,
  REVENUE_DETAIL,
  REVENUE_TOTAL,
  STATE_AID,
} from "./tables"

const CHARTED = "2027 Proposed"

/**
 * What the page's own bar and the "Revenue Sources" tab rest on: the same
 * figure the front page's revenue column states. One copy in `tables.ts`,
 * read by both charts -- see the note there -- so this pins the copy rather
 * than either chart's use of it.
 */
describe("the revenue bar", () => {
  it("totals what the coarse categories total, less free cash and plus what the orders billed", () => {
    expect(REVENUE_TOTAL).toBe(310893296)
  })

  it("draws one segment per source with a 2027 figure", () => {
    // Six Cherry Sheet lines, the tax levy, six excise lines, four other
    // local receipts, ten fees, eight department-revenue lines, ten license
    // & permit lines (eleven categories less Constable License Fee, which
    // has no 2027 figure), six fines & investments lines, the Hospital
    // Trust, and the two enterprise funds.
    expect(REVENUE_DETAIL).toHaveLength(54)
  })
})

/**
 * Every source table opens a page-78 row, or two, into the finer table the
 * book gives for it a few pages earlier. Each has to sum to what it
 * replaces, the same check `overview.spec.ts` runs for `DEPARTMENTS` against
 * `APPROPRIATIONS`.
 */
describe("each source table against the coarse row it opens", () => {
  it("splits state aid into six Cherry Sheet lines", () => {
    const NOT_A_SOURCE = [
      "Sub-Total Cherry Sheet Receipts",
      "OFFSET ITEMS: School Choice & Library",
      "Total Cherry Sheet Receipts",
      "Assessments - SPECIAL EDUCATION",
      "Assessments - SCHOOL CHOICE SENDING",
      "Assessments - CHARTER SCHOOL",
      "Assessments - AIR POLLUTION DISTRICTS",
      "Assessments - RMV NON-RENEWAL",
      "Assessments - MBTA",
      "Assessments - MOSQUITO CONTROL",
      "Total Cherry Sheet Assessments",
      "TOTAL ESTIMATED CHERRY SHEET LESS OFFSETS & ASSESSMENTS",
    ]
    const sources = column(STATE_AID, "2027 House Budget", { exclude: NOT_A_SOURCE })
    expect(sources).toHaveLength(6)

    const combined =
      amount(cell(REVENUE, "CH 70 STATE AID", CHARTED))! +
      amount(cell(REVENUE, "STATE AID (CHERRY SHEET) W/O CH. 70", CHARTED))!
    expect(sum(sources)).toBe(combined)
  })

  it("splits excise into six lines", () => {
    const rows = column(EXCISE, CHARTED, { exclude: ["Grand Total"] })
    const combined =
      amount(cell(REVENUE, "MOTOR VEHICLE EXCISE", CHARTED))! +
      amount(cell(REVENUE, "OTHER EXCISE", CHARTED))!
    expect(sum(rows)).toBe(combined)
  })

  it("splits penalties, interest, PILOT and waste disposal into four lines", () => {
    const rows = column(OTHER_LOCAL_RECEIPTS, CHARTED, { exclude: ["Grand Total"] })
    const combined =
      amount(cell(REVENUE, "PENALTIES & INTEREST", CHARTED))! +
      amount(cell(REVENUE, "PILOT & WASTE DISPOSAL FEE", CHARTED))!
    expect(sum(rows)).toBe(combined)
  })

  it("matches the book's own FEES total", () => {
    const rows = column(FEES, CHARTED, { exclude: ["Grand Total"] })
    expect(sum(rows)).toBe(amount(cell(REVENUE, "FEES", CHARTED)))
  })

  it("splits department revenue into cable, refuse, medicaid and rentals", () => {
    const rows = column(DEPARTMENT_REVENUE, CHARTED, { exclude: ["Grand Total"] })
    const combined =
      amount(cell(REVENUE, "OTHER DEPT. REVENUE", CHARTED))! +
      amount(cell(REVENUE, "MEDICAID REIMBURSEMENT", CHARTED))! +
      amount(cell(REVENUE, "RENTALS", CHARTED))!
    expect(sum(rows)).toBe(combined)
  })

  it("matches the book's own LICENSE & PERMITS total", () => {
    const rows = column(LICENSE_PERMITS, CHARTED, { exclude: ["Grand Total"] })
    expect(sum(rows)).toBe(amount(cell(REVENUE, "LICENSE & PERMITS", CHARTED)))
  })

  it("splits fines & forfeits and investments into six lines", () => {
    const rows = column(FINES_INVESTMENTS, CHARTED, { exclude: ["Grand Total"] })
    const combined =
      amount(cell(REVENUE, "FINES & FORFEITS", CHARTED))! +
      amount(cell(REVENUE, "INVESTMENTS", CHARTED))!
    expect(sum(rows)).toBe(combined)
  })
})

/**
 * "Fire" names a row in both `FEES` and `LICENSE_PERMITS`. `REVENUE_DETAIL`
 * renames each so a chart segment names one and not the other; the source
 * tables `<BudgetTable>` renders on the page keep the book's own "Fire" in
 * both, unrenamed.
 */
describe("the Fire fee and the Fire license", () => {
  it("are told apart on the chart", () => {
    const labels = REVENUE_DETAIL.map((r) => r.label)
    expect(labels).toContain("Fire Fee")
    expect(labels).toContain("Fire License")
    expect(labels).not.toContain("Fire")
  })

  it("are both still 'Fire' in the tables the page transcribes", () => {
    expect(cell(FEES, "Fire", CHARTED)).toBe("$50,000")
    expect(cell(LICENSE_PERMITS, "Fire", CHARTED)).toBe("$90,000")
  })
})
