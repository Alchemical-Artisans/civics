import { page } from "vitest/browser"
import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-svelte"
import DroughtChart from "./DroughtChart.svelte"
import type { LakeLevelYear } from "./kenoza-levels"
import { MONTH_NAMES, type PrecipitationMonth, type PrecipitationYear } from "./precipitation"

/**
 * Fixtures small enough to read by eye, in the real shape: monthly inches
 * with a running total beside them, a current year stopping short on an
 * incomplete month, and a lake series that stops earlier still -- the three
 * cases the chart has to get right.
 */
const months = (values: number[], partialLast = false): PrecipitationMonth[] => {
  let running = 0
  return values.map((inches, i) => {
    running += inches
    return {
      month: i + 1,
      label: MONTH_NAMES[i],
      inches,
      cumulativeInches: Math.round(running * 100) / 100,
      days: partialLast && i === values.length - 1 ? 12 : 31,
      partial: partialLast && i === values.length - 1,
      cityDays: partialLast && i === values.length - 1 ? 12 : 31,
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
  cityOnlyToDateInches: Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100,
  throughDate: `${y}-${String(values.length).padStart(2, "0")}-12`,
  cityDays: values.length * 31,
  filledDays: 0,
  unreadDays: 0,
  ...extra,
})

const level = (y: number, feet: number[], throughDate: string, low: number): LakeLevelYear => ({
  year: y,
  months: feet.map((value, i) => ({ month: i + 1, label: MONTH_NAMES[i], feet: value })),
  throughDate,
  low: { feet: low, note: "test" },
})

const YEARS = [
  year(2025, [1, 2, 4, 3], { toDateInches: 7 }),
  // The current year: one month short, and its last month incomplete.
  year(2026, [1, 2, 4], { toDateInches: 7, filledDays: 36 }, true),
]

const LEVELS = [
  level(2025, [105, 104, 106, 108], "2025-04-30", 104),
  // Stops a month earlier than even the rainfall does.
  level(2026, [102, 101, 100], "2026-03-15", 100),
]

const props = { years: YEARS, levels: LEVELS }

describe("DroughtChart.svelte", () => {
  const labels = () =>
    page
      .getByRole("img")
      .elements()
      .map((el) => el.getAttribute("aria-label") ?? "")

  it("draws one focusable group per year, carrying both that year's lines", async () => {
    render(DroughtChart, props)

    const lines = page.getByRole("img")
    await expect.element(lines.nth(0)).toBeInTheDocument()
    expect(lines.elements().length).toBe(2)
  })

  /**
   * The point of stacking: the two panels share one calendar, so the months
   * are drawn once rather than per panel.
   */
  it("labels the shared x axis once with all twelve months", async () => {
    const { container } = render(DroughtChart, props)

    const axis = [...container.querySelectorAll("svg text")]
      .map((el) => el.textContent?.trim() ?? "")
      .filter((text) => MONTH_NAMES.includes(text))
    expect(axis).toEqual(MONTH_NAMES)
  })

  it("names each panel, since the two carry different units", async () => {
    render(DroughtChart, props)

    await expect.element(page.getByText(/Rainfall, inches in the month/)).toBeInTheDocument()
    await expect.element(page.getByText(/Kenoza Lake, feet/)).toBeInTheDocument()
  })

  /**
   * The lake figures are read off a picture rather than published as numbers,
   * and are drawn dotted to say so. The rainfall lines are solid apart from
   * the incomplete month's own dashed tail, which uses a different pattern.
   */
  it("draws the lake level dotted and the rainfall solid", async () => {
    const { container } = render(DroughtChart, props)

    expect([...container.querySelectorAll("path[stroke-dasharray='1.5 3.5']")].length).toBe(2)
    expect([...container.querySelectorAll("path[stroke-linejoin='round']")].length).toBeGreaterThan(
      0,
    )
  })

  it("marks the incomplete rainfall month rather than drawing it like the rest", async () => {
    const { container } = render(DroughtChart, props)

    expect([...container.querySelectorAll("path[stroke-dasharray='3 3']")].length).toBe(1)
    expect([...container.querySelectorAll("circle[fill='#fff']")].length).toBe(1)
  })

  /** The drought hue belongs to the current year whatever the span's length. */
  it("gives the current year the drought colour, picked by name not position", async () => {
    const { container } = render(DroughtChart, props)

    const widest = [...container.querySelectorAll("path[stroke-width='2.5']")]
    expect(widest.length).toBeGreaterThan(0)
    for (const path of widest) expect(path.getAttribute("stroke")).toBe("#ea580c")
  })

  /**
   * The comparison the chart must not get wrong: a part-year read against a
   * whole one. 2025 ends at 10 inches but had only 7 by the point 2026 stops
   * at, which is 2026's own figure -- so the two read as level.
   */
  it("reports each year's rainfall total read to the same day", async () => {
    render(DroughtChart, props)

    expect(labels().find((l) => l.startsWith("2026:"))).toContain("7 inches of rain by Mar 12")
    expect(labels().find((l) => l.startsWith("2025:"))).toContain("7 inches of rain by Mar 12")
  })

  it("still names a completed year's own full-year total", async () => {
    render(DroughtChart, props)

    expect(labels().find((l) => l.startsWith("2025:"))).toContain("10 inches over the full year")
  })

  it("names the lake level and the year's low in the same label", async () => {
    render(DroughtChart, props)

    expect(labels().find((l) => l.startsWith("2026:"))).toContain("Kenoza Lake 100.0 feet by Mar")
    expect(labels().find((l) => l.startsWith("2026:"))).toContain("low of 100.0 feet")
  })

  it("says how many of the current year's rainfall days came from a neighbouring gauge", async () => {
    render(DroughtChart, props)

    expect(labels().find((l) => l.startsWith("2026:"))).toContain(
      "36 rainfall days filled from a neighbouring gauge",
    )
  })

  it("heads the legend with the day its rainfall totals are read to", async () => {
    render(DroughtChart, props)

    await expect
      .element(page.getByText("Rainfall total by Mar 12, each year read to the same day:"))
      .toBeInTheDocument()
  })

  /** Nothing the pointer reveals may be only the pointer's -- the site's rule. */
  it("carries both panels' figures in a table for a reader who hovers nothing", async () => {
    render(DroughtChart, props)

    await expect
      .element(page.getByRole("table", { name: /Rainfall in inches and Kenoza Lake's level/ }))
      .toBeInTheDocument()
    await expect
      .element(page.getByRole("columnheader", { name: "2026 lake level" }))
      .toBeInTheDocument()
    await expect.element(page.getByText("(12 days)")).toBeInTheDocument()
  })

  /**
   * A month one series reaches and the other does not must read as absent,
   * not as zero: 2026's lake line stops in March, so April is a dash.
   */
  it("shows a month a series never reached as absent rather than as zero", async () => {
    render(DroughtChart, props)

    const cells = page
      .getByRole("cell")
      .elements()
      .map((el) => el.textContent?.trim())
    expect(cells.filter((text) => text === "—").length).toBeGreaterThan(0)
  })
})
