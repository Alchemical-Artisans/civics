import { describe, it, expect } from "vitest"
import { amount, cell } from "$lib/budget-table"
import { FUND_BALANCE, FUND_BALANCE_HISTORY, FREE_CASH, STABILIZATION } from "./tables"

const money = (table: typeof FUND_BALANCE, row: string, column = "Amount") =>
  amount(cell(table, row, column))!

/**
 * What the page's first chart rests on.
 *
 * The book draws these three policies as three dials, one to a page, and a dial
 * says only whether a needle is inside an arc. The chart here puts them on one
 * scale, which is only honest if the three are measured against the same thing
 * -- and they are: each policy is a percentage of general fund revenue less
 * debt exclusion and Chapter 70, and every floor and ceiling the book prints
 * implies that same figure back.
 */
describe("the three reserve policies", () => {
  // The percentage each figure is of that revenue, as the policy states it.
  const IMPLIED: [name: string, dollars: number, share: number][] = [
    ["fund balance floor, 5%", money(FUND_BALANCE, "Minimum"), 0.05],
    ["fund balance ceiling, 15%", money(FUND_BALANCE, "Maximum"), 0.15],
    ["free cash floor, 2%", money(FREE_CASH, "Minimum"), 0.02],
    ["free cash ceiling, 8%", money(FREE_CASH, "Maximum"), 0.08],
    ["stabilization floor, 3%", money(STABILIZATION, "Minimum Balance"), 0.03],
  ]

  it("are all a percentage of the same revenue", () => {
    const bases = IMPLIED.map(([, dollars, share]) => dollars / share)

    // Within $20 of each other, which is the book rounding each figure to the
    // dollar rather than five different bases.
    expect(Math.max(...bases) - Math.min(...bases)).toBeLessThan(25)
    for (const base of bases) expect(Math.round(base / 100) * 100).toBe(178261600)
  })

  // The shares the book prints beside the balances, against the base its own
  // floors imply. If these stopped agreeing, one scale would be the wrong
  // picture and the chart would have to become three.
  it("puts the balances at the shares the book prints beside them", () => {
    const base = money(FREE_CASH, "Minimum") / 0.02

    expect(cell(FUND_BALANCE, "Actual", "Amount")).toContain("(7.85%)")
    expect(money(FUND_BALANCE, "Actual") / base).toBeCloseTo(0.0785, 4)

    expect(cell(STABILIZATION, "Actual Balance", "Amount")).toContain("(4.49%)")
    expect(money(STABILIZATION, "Actual Balance") / base).toBeCloseTo(0.0449, 4)
  })

  // The year the chart is about: nothing held against a floor of $3,565,232.
  // The bar draws no width at all, and the band it does not reach is the whole
  // of what the page has to say.
  it("has free cash below its own floor, at nothing", () => {
    expect(money(FREE_CASH, "Anticipated")).toBe(0)
    expect(money(FREE_CASH, "Minimum")).toBeGreaterThan(0)
  })

  // Only two of the three set a ceiling. Stabilization's band runs to the end
  // of the rail because the policy stops at "at least 3%".
  it("sets no ceiling on stabilization", () => {
    expect(STABILIZATION.rows.map((row) => row.label)).toEqual([
      "Minimum Balance",
      "Actual Balance",
    ])
  })
})

/** What the page's second chart draws: the bottom row of page 18's table. */
describe("three years of the fund balance", () => {
  const YEARS = ["2023", "2024", "2025"]
  const ending = YEARS.map((year) => money(FUND_BALANCE_HISTORY, "Ending Fund Balance", year))

  it("rises across the three years the book accounts for", () => {
    expect(ending).toEqual([10209394, 12569995, 13985453])
    expect(ending).toEqual([...ending].sort((a, b) => a - b))
  })

  // Each year opens where the last one closed, which is what makes the three
  // columns one line rather than three unrelated figures.
  it("opens each year where the last one closed", () => {
    for (const [at, year] of YEARS.slice(1).entries()) {
      expect(money(FUND_BALANCE_HISTORY, "Beginning Fund Balance", year)).toBe(ending[at])
    }
  })

  // The book's own arithmetic: what came in, less what went out, less the
  // encumbrances carried forward.
  it("moves by the year's own revenue, spending and encumbrances", () => {
    for (const [at, year] of YEARS.entries()) {
      const moved =
        money(FUND_BALANCE_HISTORY, "Plus Fiscal Year Revenue", year) +
        money(FUND_BALANCE_HISTORY, "Less Fiscal Year Expenditures", year) +
        money(FUND_BALANCE_HISTORY, "Net Reserve for Encumbrances", year)

      expect(money(FUND_BALANCE_HISTORY, "Beginning Fund Balance", year) + moved).toBe(ending[at])
    }
  })

  // The book gives the same balance on the same date twice and differs from
  // itself by a dollar: $13,985,453 in this table, $13,985,452 on the dial and
  // in the prose beside it. Both are printed as printed; this is here so a
  // correction has to account for the dollar rather than quietly absorb it.
  it("closes a dollar over the dial's figure for the same date", () => {
    expect(ending[2] - money(FUND_BALANCE, "Actual")).toBe(1)
  })
})
