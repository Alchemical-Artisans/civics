import { page } from "vitest/browser"
import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-svelte"
import RainfallYearsChart from "./RainfallYearsChart.svelte"
import type { PrecipitationWeek, PrecipitationYear } from "./precipitation"

/**
 * Four weeks a year rather than the real fifty-three: the component's job
 * here is the comparison it draws and the labels it writes, and a fixture
 * small enough to read by eye is what makes a wrong figure obvious. The
 * shape is the real one -- `cumulativeInches` already accumulated, the
 * current year stopping short, which is the case the chart has to get right.
 */
const weeks = (values: number[]): PrecipitationWeek[] =>
  values.map((cumulativeInches, i) => ({
    week: i + 1,
    startMonthDay: ["01-01", "01-08", "01-15", "01-22"][i],
    inches: i === 0 ? cumulativeInches : cumulativeInches - values[i - 1],
    cumulativeInches,
    filledDays: 0,
    unreadDays: 0,
  }))

const year = (
  y: number,
  values: number[],
  extra: Partial<PrecipitationYear> = {},
): PrecipitationYear => ({
  year: y,
  weeks: weeks(values),
  totalInches: values.at(-1)!,
  throughDate: `${y}-01-${String(1 + (values.length - 1) * 7).padStart(2, "0")}`,
  filledDays: 0,
  unreadDays: 0,
  ...extra,
})

const YEARS = [
  year(2023, [2, 5, 9, 14]),
  year(2024, [1, 3, 6, 10]),
  year(2025, [1, 2, 4, 8]),
  // The current year, two weeks short of the other three.
  year(2026, [1, 2], { filledDays: 36 }),
]

const NORMAL = weeks([1.5, 3, 5, 7])

describe("RainfallYearsChart.svelte", () => {
  it("draws a line per year plus the normal", async () => {
    render(RainfallYearsChart, { years: YEARS, normal: NORMAL })

    const lines = page.getByRole("img")
    await expect.element(lines.nth(0)).toBeInTheDocument()
    expect(lines.elements().length).toBe(5)
  })

  /**
   * The comparison the chart exists for, and the one it must not get wrong:
   * a part-year read against three whole ones. 2025 ends at 8 inches but had
   * only reached 2 by the week 2026 stops at, which is 2026's own figure --
   * so the two have to read as level, not as 2 against 8.
   */
  it("reads every year at the week the current year has reached", async () => {
    render(RainfallYearsChart, { years: YEARS, normal: NORMAL })

    const labels = page
      .getByRole("img")
      .elements()
      .map((el) => el.getAttribute("aria-label") ?? "")

    const current = labels.find((label) => label.startsWith("2026:"))
    const previous = labels.find((label) => label.startsWith("2025:"))
    expect(current).toContain("2 inches by Jan 8")
    expect(previous).toContain("2 inches by Jan 8")
  })

  it("still names a completed year's own full-year total", async () => {
    render(RainfallYearsChart, { years: YEARS, normal: NORMAL })

    const labels = page
      .getByRole("img")
      .elements()
      .map((el) => el.getAttribute("aria-label") ?? "")

    expect(labels.find((label) => label.startsWith("2023:"))).toContain(
      "14 inches over the full year",
    )
  })

  it("says how many of the current year's days came from a neighbouring gauge", async () => {
    render(RainfallYearsChart, { years: YEARS, normal: NORMAL })

    const labels = page
      .getByRole("img")
      .elements()
      .map((el) => el.getAttribute("aria-label") ?? "")

    expect(labels.find((label) => label.startsWith("2026:"))).toContain(
      "36 days filled from a neighbouring gauge",
    )
  })

  it("heads the legend with the week its figures are read at", async () => {
    render(RainfallYearsChart, { years: YEARS, normal: NORMAL })

    await expect
      .element(page.getByText("Accumulated by Jan 8, each year read at the same week:"))
      .toBeInTheDocument()
  })

  /** Nothing the pointer reveals may be only the pointer's -- the site's rule. */
  it("carries every figure in a table for a reader who hovers nothing", async () => {
    render(RainfallYearsChart, { years: YEARS, normal: NORMAL })

    await expect
      .element(page.getByRole("table", { name: /Rainfall accumulated since January 1st/ }))
      .toBeInTheDocument()
  })
})
