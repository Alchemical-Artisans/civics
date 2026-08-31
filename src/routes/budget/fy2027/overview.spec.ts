import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { load } from "./+page"

/**
 * The chart figures are copied from the transcription of page 78, so there are
 * two places holding the same numbers. This reads them back out of the
 * transcription and fails if they have drifted apart -- correcting one and
 * forgetting the other is the whole failure mode, and it would show up as a
 * chart quietly disagreeing with the table it links to.
 */
const brief = readFileSync(
  fileURLToPath(new URL("./2027-budget-in-brief/+page.svelte", import.meta.url)),
  "utf8",
)

/** The last column of each row of the nth table, keyed by its row heading. */
function lastColumn(html: string, nth: number): Map<string, number> {
  const tables = html.match(/<table[\s\S]*?<\/table\s*>/gi) ?? []
  const rows = tables[nth].match(/<tr\s*>[\s\S]*?<\/tr\s*>/gi) ?? []
  const out = new Map<string, number>()

  for (const row of rows) {
    // Data rows only. A header row's cells are `scope="col"`, and its last one
    // reads "2027 Proposed" -- which parses to a number and would otherwise
    // land in the map as a category called "Appropriations".
    if (!/scope="row"/.test(row)) continue

    const cells = [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]\s*>/gi)].map((c) =>
      c[1]
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&ndash;/g, "-")
        .trim(),
    )
    if (cells.length < 2) continue
    const amount = Number(cells.at(-1)!.replace(/[^0-9]/g, ""))
    if (amount) out.set(cells[0], amount)
  }
  return out
}

// Page 78 carries the appropriations table then the revenue one; the section's
// own page prints the department table above both.
const APPROPRIATIONS = 1
const REVENUE = 2

const { overview } = load({} as Parameters<typeof load>[0]) as unknown as {
  overview: {
    appropriations: { label: string; amount: number }[]
    revenue: { label: string; amount: number }[]
    total: number
  }
}

describe("the budget-at-a-glance charts", () => {
  it("charts the appropriations the transcription prints", () => {
    const table = lastColumn(brief, APPROPRIATIONS)
    for (const { label, amount } of overview.appropriations) {
      expect(table.get(label), `appropriation "${label}"`).toBe(amount)
    }
  })

  it("charts the revenue the transcription prints", () => {
    // The table sets these in capitals; the chart uses ordinary case, so the
    // comparison is on the figures against a case-folded lookup.
    const table = new Map(
      [...lastColumn(brief, REVENUE)].map(([label, amount]) => [label.toLowerCase(), amount]),
    )
    for (const { label, amount } of overview.revenue) {
      expect(table.get(label.toLowerCase()), `revenue "${label}"`).toBe(amount)
    }
  })

  it("leaves out only the rows the table leaves blank for 2027", () => {
    // Everything in the table is charted except its own grand total, the
    // surplus line, and the rows with no 2027 figure -- which `lastColumn`
    // has already dropped, since a blank cell is not a number.
    const charted = new Set(overview.appropriations.map((a) => a.label))
    const skipped = [...lastColumn(brief, APPROPRIATIONS).keys()].filter((l) => !charted.has(l))
    expect(skipped).toEqual(["Grand Total"])
  })

  it("uses the grand total the book states, not the sum of its own parts", () => {
    // The appropriations column adds up to a dollar more than the total printed
    // under it. The book prints both; the site shows the one it states.
    const sum = overview.appropriations.reduce((n, a) => n + a.amount, 0)
    expect(sum).toBe(285272160)
    expect(overview.total).toBe(285272159)
  })

  it("balances revenue against the stated total exactly", () => {
    expect(overview.revenue.reduce((n, r) => n + r.amount, 0)).toBe(overview.total)
  })
})
