import { page } from "vitest/browser"
import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-svelte"
import RainfallYearsChart from "./RainfallYearsChart.svelte"
import { MONTH_NAMES, type PrecipitationMonth, type PrecipitationYear } from "./precipitation"

/**
 * A fixture small enough to read by eye, in the real shape: monthly inches
 * with a running total beside them, and a current year stopping short on an
 * incomplete month -- the case the chart has to get right.
 */
const months = (values: number[], partialLast = false): PrecipitationMonth[] => {
  let running = 0
  return values.map((inches, i) => {
    running += inches
    const month = i + 1
    return {
      month,
      label: MONTH_NAMES[i],
      inches,
      cumulativeInches: Math.round(running * 100) / 100,
      days: partialLast && i === values.length - 1 ? 12 : 31,
      partial: partialLast && i === values.length - 1,
      filledDays: 0,
      unreadDays: 0,
    }
  })
}

const year = (
  y: number,
  values: number[],
  extra: Partial<PrecipitationYear> = {},
  partialLast = false,
): PrecipitationYear => ({
  year: y,
  months: months(values, partialLast),
  totalInches: Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100,
  toDateInches: Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100,
  throughDate: `${y}-${String(values.length).padStart(2, "0")}-12`,
  filledDays: 0,
  unreadDays: 0,
  ...extra,
})

const YEARS = [
  year(2024, [1, 3, 6, 2], { toDateInches: 10 }),
  year(2025, [1, 2, 4, 3], { toDateInches: 7 }),
  // The current year: one month short, and its last month incomplete.
  year(2026, [1, 2, 4], { toDateInches: 7, filledDays: 36 }, true),
]

const props = { years: YEARS }

describe("RainfallYearsChart.svelte", () => {
  it("draws one line per year and nothing else", async () => {
    render(RainfallYearsChart, props)

    const lines = page.getByRole("img")
    await expect.element(lines.nth(0)).toBeInTheDocument()
    expect(lines.elements().length).toBe(3)
  })

  /**
   * The normal was a dashed reference line and was dropped as a distraction;
   * the only dashes left belong to an incomplete month. If a reference curve
   * ever comes back this is the test that should be rewritten, not deleted.
   */
  it("draws no reference curve", async () => {
    const { container } = render(RainfallYearsChart, props)

    expect([...container.querySelectorAll("path[stroke-dasharray='5 4']")].length).toBe(0)
    expect([...container.querySelectorAll("path[stroke='#64748b']")].length).toBe(0)
  })

  /** The drought hue belongs to the current year whatever the span's length. */
  it("gives the current year the drought colour, picked by name not position", async () => {
    const { container } = render(RainfallYearsChart, props)

    const widest = [...container.querySelectorAll("path[stroke-width='2.5']")]
    expect(widest.length).toBeGreaterThan(0)
    for (const path of widest) expect(path.getAttribute("stroke")).toBe("#ea580c")
  })

  const labels = () =>
    page
      .getByRole("img")
      .elements()
      .map((el) => el.getAttribute("aria-label") ?? "")

  /**
   * The comparison the chart must not get wrong: a part-year read against
   * three whole ones. 2025 ends at 10 inches but had only 7 by the point
   * 2026 stops at, which is 2026's own figure -- so the two read as level.
   */
  it("reports each year's total read to the same day", async () => {
    render(RainfallYearsChart, props)

    expect(labels().find((l) => l.startsWith("2026:"))).toContain("7 inches by Mar 12")
    expect(labels().find((l) => l.startsWith("2025:"))).toContain("7 inches by Mar 12")
  })

  it("still names a completed year's own full-year total", async () => {
    render(RainfallYearsChart, props)

    expect(labels().find((l) => l.startsWith("2024:"))).toContain("12 inches over the full year")
  })

  it("says how many of the current year's days came from a neighbouring gauge", async () => {
    render(RainfallYearsChart, props)

    expect(labels().find((l) => l.startsWith("2026:"))).toContain(
      "36 days filled from a neighbouring gauge",
    )
  })

  it("heads the legend with the day its totals are read to", async () => {
    render(RainfallYearsChart, props)

    await expect
      .element(page.getByText("Total by Mar 12, each year read to the same day:"))
      .toBeInTheDocument()
  })

  /**
   * Queried off the SVG rather than by text: each month name appears twice
   * on the page, once on the axis and once as a row header in the table
   * below, and `getByText` cannot tell them apart.
   */
  it("labels the x axis with all twelve months", async () => {
    const { container } = render(RainfallYearsChart, props)

    const axis = [...container.querySelectorAll("svg text")]
      .map((el) => el.textContent?.trim())
      .filter((text) => text && !text.endsWith('"'))
    expect(axis).toEqual(MONTH_NAMES)
  })

  /**
   * An incomplete month must not read as a dry one. It is drawn on its own
   * dashed path and with a hollow point, and the table says what it stands on.
   */
  it("marks the incomplete month rather than drawing it like the rest", async () => {
    const { container } = render(RainfallYearsChart, props)

    const dashed = [...container.querySelectorAll("path[stroke-dasharray='3 3']")]
    expect(dashed.length).toBe(1)

    const hollow = [...container.querySelectorAll("circle[fill='#fff']")]
    expect(hollow.length).toBe(1)
  })

  /** Nothing the pointer reveals may be only the pointer's -- the site's rule. */
  it("carries every figure in a table for a reader who hovers nothing", async () => {
    render(RainfallYearsChart, props)

    await expect
      .element(page.getByRole("table", { name: /Rainfall by month, in inches/ }))
      .toBeInTheDocument()
    await expect.element(page.getByText("(12 days)")).toBeInTheDocument()
  })
})
