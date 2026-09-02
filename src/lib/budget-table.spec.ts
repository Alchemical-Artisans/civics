import { describe, it, expect } from "vitest"
import { amount, cell, column, sum, type BudgetTableData } from "./budget-table"

const table: BudgetTableData = {
  columns: ["Appropriations", "2026 Budgeted", "2027 Proposed"],
  rows: [
    { label: "Education", cells: ["$143,170,043", "$147,158,454"] },
    // A row the book fills in for one year and leaves blank for the next.
    { label: "Capital - Pay as you go", cells: ["$423,901", ""] },
    { label: "Overlay", cells: ["–", "$250,000"] },
    { label: "Grand Total", cells: ["$277,218,448", "$285,272,159"] },
    { label: "Budget Surplus (Deficit)", emphasis: true, cells: ["$1", "$(0)"] },
  ],
}

describe("amount", () => {
  it("reads a dollar figure", () => {
    expect(amount("$147,158,454")).toBe(147158454)
    expect(amount("$1")).toBe(1)
  })

  // Parentheses are the book's negative sign, throughout every table.
  it("treats parentheses as negative", () => {
    expect(amount("$(1,781,111)")).toBe(-1781111)
    expect(amount("$(0)")).toBe(0)
  })

  // The reserve dials print both in one cell: "$13,985,452 (7.85%)".
  it("reads the dollars out of a cell that also carries a share", () => {
    expect(amount("$13,985,452 (7.85%)")).toBe(13985452)
    expect(amount("$0 (0%)")).toBe(0)
    expect(amount("$5,347,848 (3%)")).toBe(5347848)
  })

  // The Council's appropriation orders print numbers with a space in them:
  // "$15, 967,043" for the wastewater department, "$ 5,150,000" for free cash.
  it("reads a figure the source printed with a space in it", () => {
    expect(amount("$15, 967,043")).toBe(15967043)
    expect(amount("$ 5,150,000")).toBe(5150000)
    expect(amount("$ 274,750,725")).toBe(274750725)
  })

  it("is null for a cell holding no money", () => {
    expect(amount("")).toBeNull()
    // The book's own mark for a year with no entry.
    expect(amount("–")).toBeNull()
    // A percentage sits in the same row as dollars in several tables; a chart
    // asking for a dollar column should get nothing rather than 4.2.
    expect(amount("4.2%")).toBeNull()
    expect(amount("2027 Proposed")).toBeNull()
  })
})

describe("column", () => {
  it("returns the named column as label/amount pairs", () => {
    expect(column(table, "2027 Proposed")).toEqual([
      { label: "Education", amount: 147158454 },
      { label: "Overlay", amount: 250000 },
      { label: "Grand Total", amount: 285272159 },
      { label: "Budget Surplus (Deficit)", amount: 0 },
    ])
  })

  it("drops rows with nothing in that column", () => {
    // "Capital - Pay as you go" has a 2026 figure and no 2027 one.
    expect(column(table, "2026 Budgeted").map((r) => r.label)).toContain("Capital - Pay as you go")
    expect(column(table, "2027 Proposed").map((r) => r.label)).not.toContain(
      "Capital - Pay as you go",
    )
  })

  it("excludes the rows it is told to", () => {
    expect(
      column(table, "2027 Proposed", { exclude: ["Grand Total", "Budget Surplus (Deficit)"] }),
    ).toEqual([
      { label: "Education", amount: 147158454 },
      { label: "Overlay", amount: 250000 },
    ])
  })

  it("refuses a column that is not there rather than charting the wrong one", () => {
    expect(() => column(table, "2028 Proposed")).toThrow(/No column "2028 Proposed"/)
    // The heading column holds labels, not figures, so it is not chartable.
    expect(() => column(table, "Appropriations")).toThrow()
  })
})

describe("cell", () => {
  it("finds a figure by row and column", () => {
    expect(cell(table, "Grand Total", "2027 Proposed")).toBe("$285,272,159")
  })

  it("throws on a row or column that is not there", () => {
    expect(() => cell(table, "Nope", "2027 Proposed")).toThrow(/No row/)
    expect(() => cell(table, "Grand Total", "Nope")).toThrow(/No column/)
  })
})

describe("sum", () => {
  it("adds a column up", () => {
    expect(sum(column(table, "2027 Proposed", { exclude: ["Grand Total"] }))).toBe(147408454)
  })

  it("skips the cells that hold nothing", () => {
    // Overlay has an en dash for 2026 and Capital has no 2027 figure, so
    // neither column is the sum of every row in the table.
    // 143,170,043 + 423,901 + the $1 surplus line.
    expect(sum(column(table, "2026 Budgeted", { exclude: ["Grand Total"] }))).toBe(143593945)
  })
})
