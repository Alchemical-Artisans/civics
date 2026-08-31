import { describe, it, expect } from "vitest"
import {
  classifyReport,
  contentRegion,
  diffYears,
  lastYearIn,
  parseBudgetListing,
} from "./budget.mjs"

/** The page's shape: years and links pasted into one <p>, with no structure. */
const page = (body) => `<html><body><main>
  <nav><a href="/">Home</a><a href="/government/">Government</a></nav>
  <h1>Budget and Audit Reports</h1>
  ${body}
  <nav><a href="/government/elections/">Elections</a></nav>
</main></body></html>`

const cdn = (name) => `https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/x/${name}`

/** Twenty-two years, which is what the guard wants before it will believe a parse. */
const filler = Array.from(
  { length: 20 },
  (_, i) =>
    `FY${2006 + i} Mayor's <a href="${cdn(`b${i}.pdf`)}">Budget</a> ` +
    `City <a href="${cdn(`fy-financial-statements-${i}.pdf`)}">Audit Report</a>`,
).join("")

describe("contentRegion", () => {
  it("drops the navs on both sides of the content", () => {
    const region = contentRegion(page("<p>FY2027</p>"))
    expect(region).toContain("FY2027")
    expect(region).not.toContain("Elections")
    // The breadcrumb comes before the content, so cutting at the first <nav>
    // rather than removing them all would throw the page away.
    expect(region).not.toContain("Government</a>")
  })
})

describe("lastYearIn", () => {
  it("reads both spellings the page uses", () => {
    expect(lastYearIn("FY2027 Mayor's Budget")).toBe(2027)
    expect(lastYearIn("FY 2014 Mayor's Budget")).toBe(2014)
  })

  it("takes the last marker, which owns the links that follow it", () => {
    expect(lastYearIn("FY2023 Mayor's Budget FY2022 Mayor's Budget")).toBe(2022)
  })

  it("is null for text naming no year", () => {
    expect(lastYearIn("City Audit Report")).toBeNull()
  })
})

describe("classifyReport", () => {
  it("trusts the anchor text first", () => {
    expect(classifyReport("Audit Report", cdn("anything.pdf"))).toBe("audit")
    expect(classifyReport("Budget", cdn("anything.pdf"))).toBe("budget")
  })

  // Twenty years of the city renaming the same document.
  it("falls back to the filename, in all the spellings the city has used", () => {
    expect(classifyReport("", cdn("haverhill-fy2023-financial-statements.pdf"))).toBe("audit")
    expect(classifyReport("", cdn("haverhill_audited_financials__fy08_.pdf"))).toBe("audit")
    expect(classifyReport("", cdn("h-haverhill-2020-gasb-fs-final.pdf"))).toBe("audit")
    expect(classifyReport("", cdn("haverhill-budgetbook21.pdf"))).toBe("budget")
    expect(classifyReport("", cdn("mayor_proposed_budget.pdf"))).toBe("budget")
  })

  it("is null for a link that is neither", () => {
    expect(classifyReport("Contact Us", cdn("directory.pdf"))).toBeNull()
  })
})

describe("parseBudgetListing", () => {
  it("attaches a link whose anchor carries the year to that year", () => {
    // FY2027's whole label sits inside the anchor, unlike every other row.
    const { years } = parseBudgetListing(
      page(`<p><a href="${cdn("fy-2027-budget.pdf")}">FY2027 Mayor's Budget</a></p>${filler}`),
    )
    expect(years[0]).toEqual({
      year: 2027,
      budget: cdn("fy-2027-budget.pdf"),
      audit: null,
    })
  })

  it("separates years the city pasted into one paragraph", () => {
    const { years } = parseBudgetListing(page(filler))
    expect(years).toHaveLength(20)
    expect(years[0].year).toBe(2025)
    expect(years.at(-1).year).toBe(2006)
  })

  it("records a year the city lists with no file behind it", () => {
    const { years } = parseBudgetListing(
      page(
        `<p>FY2026 Mayor's Budget City <a href="${cdn("fy26-audit.pdf")}">Audit Report</a></p>${filler}`,
      ),
    )
    expect(years.find((y) => y.year === 2026)).toEqual({
      year: 2026,
      budget: null,
      audit: cdn("fy26-audit.pdf"),
    })
  })

  it("ignores links that are not PDFs", () => {
    const { years } = parseBudgetListing(
      page(
        `<p>FY2026 <a href="/government/budget-and-finance/">Budget and Finance</a></p>${filler}`,
      ),
    )
    expect(years.find((y) => y.year === 2026).budget).toBeNull()
  })

  it("reports a link it cannot place rather than dropping it", () => {
    const { unclassified } = parseBudgetListing(
      page(`<p>FY2026 <a href="${cdn("capital-plan.pdf")}">Capital Plan</a></p>${filler}`),
    )
    expect(unclassified).toEqual([
      { year: 2026, href: cdn("capital-plan.pdf"), text: "Capital Plan" },
    ])
  })

  // Without this a redesign would quietly replace the committed data with an
  // empty list, and the site would build fine with nothing on it.
  it("refuses a parse that finds almost nothing", () => {
    expect(() => parseBudgetListing(page("<p>FY2027 Mayor's Budget</p>"))).toThrow(
      /expected at least 20/,
    )
  })
})

describe("diffYears", () => {
  const year = (over) => ({ year: 2027, budget: "a.pdf", audit: null, ...over })

  it("says nothing changed when nothing did", () => {
    expect(diffYears([year()], [year()])).toEqual({ added: [], removed: [], changed: [] })
  })

  it("names a new fiscal year", () => {
    expect(diffYears([year()], [year({ year: 2028 }), year()]).added).toEqual([2028])
  })

  it("names a report the city has replaced", () => {
    expect(diffYears([year()], [year({ budget: "b.pdf" })]).changed).toEqual([
      { year: 2027, field: "budget", from: "a.pdf", to: "b.pdf" },
    ])
  })

  it("notices an audit arriving for a year that had none", () => {
    expect(diffYears([year()], [year({ audit: "c.pdf" })]).changed).toEqual([
      { year: 2027, field: "audit", from: null, to: "c.pdf" },
    ])
  })

  it("treats a first run as everything being new", () => {
    expect(diffYears(null, [year()]).added).toEqual([2027])
  })
})
