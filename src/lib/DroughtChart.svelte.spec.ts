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

  it("draws one focusable group per year, carrying all three of its lines", async () => {
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

  it("names each panel, since the three answer different questions", async () => {
    render(DroughtChart, props)

    await expect.element(page.getByText(/Rainfall, inches in the month/)).toBeInTheDocument()
    await expect.element(page.getByText(/Rainfall, inches since January 1st/)).toBeInTheDocument()
    await expect.element(page.getByText(/Kenoza Lake, feet/)).toBeInTheDocument()
  })

  /**
   * The accumulation can only rise, which is the whole reason it does not
   * replace the monthly panel -- and the reason it is worth drawing beside
   * it. If a cumulative line ever falls, a month went negative.
   */
  it("never lets the cumulative line fall", async () => {
    render(DroughtChart, props)

    for (const year of YEARS) {
      const values = year.months.map((month) => month.cumulativeInches)
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThanOrEqual(values[i - 1])
      }
    }
  })

  /**
   * The lake figures are read off a picture rather than published as numbers,
   * and are drawn dotted to say so. The rainfall lines are solid apart from
   * the incomplete month's own dashed tail, which uses a different pattern.
   */
  it("draws the lake level dotted and the rainfall solid", async () => {
    const { container } = render(DroughtChart, props)

    // One dotted path per year, in the lake panel only -- not in either
    // rainfall panel, whose figures are gauge readings rather than estimates.
    expect([...container.querySelectorAll("path[stroke-dasharray='1.5 3.5']")].length).toBe(2)
    expect([...container.querySelectorAll("path[stroke-linejoin='round']")].length).toBeGreaterThan(
      0,
    )
  })

  /**
   * Marked in both rainfall panels, since the incomplete month is the last
   * point of each -- one dashed tail and one hollow point per panel.
   */
  it("marks the incomplete rainfall month in both rainfall panels", async () => {
    const { container } = render(DroughtChart, props)

    expect([...container.querySelectorAll("path[stroke-dasharray='3 3']")].length).toBe(2)
    expect([...container.querySelectorAll("circle[fill='#fff']")].length).toBe(2)
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

  /**
   * Not "filled from a neighbouring gauge" any more: every day is an average
   * of whatever read it, so what these days lack is the city's own reading,
   * not a value.
   */
  it("says how many of the current year's days carry no city reading", async () => {
    render(DroughtChart, props)

    expect(labels().find((l) => l.startsWith("2026:"))).toContain(
      "36 rainfall days carry no reading from the city's own gauge",
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
      .element(page.getByRole("table", { name: /rainfall since January 1st, and Kenoza Lake/ }))
      .toBeInTheDocument()
    await expect
      .element(page.getByRole("columnheader", { name: "2026 lake level" }))
      .toBeInTheDocument()
    await expect
      .element(page.getByRole("columnheader", { name: "2026 since January 1st" }))
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
