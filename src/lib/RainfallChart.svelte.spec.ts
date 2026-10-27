import { page } from "vitest/browser"
import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-svelte"
import RainfallChart from "./RainfallChart.svelte"
import { MONTH_NAMES, type PrecipitationMonth, type PrecipitationYear } from "./precipitation"

const months = (values: number[], partialLast = false): PrecipitationMonth[] => {
  let running = 0
  return values.map((inches, i) => {
    running += inches
    const partial = partialLast && i === values.length - 1
    return {
      month: i + 1,
      label: MONTH_NAMES[i],
      inches,
      cumulativeInches: Math.round(running * 100) / 100,
      days: partial ? 12 : 31,
      partial,
      cityDays: partial ? 12 : 31,
      filledDays: 0,
      unreadDays: 0,
    }
  })
}

const year = (
  y: number,
  toDate: number,
  extra: Partial<PrecipitationYear> = {},
): PrecipitationYear => ({
  year: y,
  months: months([1, 2, 3]),
  totalInches: toDate,
  toDateInches: toDate,
  cityOnlyToDateInches: toDate,
  throughDate: `${y}-10-26`,
  cityDays: 300,
  filledDays: 0,
  unreadDays: 0,
  ...extra,
})

/** The real shape of the finding: a wet year, then three declining ones. */
const YEARS = [
  year(2023, 53.71),
  year(2024, 35.55),
  year(2025, 31.96),
  year(2026, 30.52, { filledDays: 36 }),
]

const BASELINE = { inches: 37.49, from: 2016, to: 2025, years: 10 }

const props = { years: YEARS, baseline: BASELINE }

describe("RainfallChart.svelte", () => {
  const labels = () =>
    page
      .getByRole("img")
      .elements()
      .map((el) => el.getAttribute("aria-label") ?? "")

  /** Four years and the average: five quantities on one axis. */
  it("draws a bar per year plus one for the average", async () => {
    const { container } = render(RainfallChart, props)

    await expect.element(page.getByRole("img").nth(0)).toBeInTheDocument()
    expect([...container.querySelectorAll("svg rect")].length).toBe(5)
  })

  it("puts the earliest year on the left and the average last", async () => {
    const { container } = render(RainfallChart, props)

    const order = [...container.querySelectorAll("svg g[role='img']")].map((g) => {
      const x = Number(g.querySelector("rect")!.getAttribute("x"))
      return { x, label: g.getAttribute("aria-label") ?? "" }
    })
    expect(order.map((o) => o.x)).toEqual([...order.map((o) => o.x)].sort((a, b) => a - b))
    expect(order[0].label).toMatch(/^2023:/)
    expect(order.at(-1)!.label).toMatch(/^10-yr avg/)
  })

  /**
   * The comparison the chart exists to get right. The current year is ten
   * months old, so a bar drawn against whole years would read as a
   * catastrophe in any month -- every bar, the average included, is summed
   * to the same day, and the caption has to say which day.
   */
  it("says the day every bar is read to", async () => {
    render(RainfallChart, props)

    await expect.element(page.getByText(/each year read to Oct 26/)).toBeInTheDocument()
    for (const label of labels()) expect(label).toContain("Oct 26")
  })

  it("names the span the average is taken over", async () => {
    render(RainfallChart, props)

    await expect.element(page.getByText(/10-year average, 2016–2025/)).toBeInTheDocument()
    expect(labels().find((l) => l.startsWith("10-yr avg"))).toContain("2016 to 2025")
  })

  /** Bars compare badly end to end, so the average is also a rule across them. */
  it("draws the average as a dashed rule as well as a bar", async () => {
    const { container } = render(RainfallChart, props)

    const dashed = [...container.querySelectorAll("line[stroke-dasharray]")]
    expect(dashed.length).toBe(1)
  })

  /** Zero-based: a seven-inch shortfall must not be drawn as a cliff. */
  it("scales from zero, rounded out to whole tens", async () => {
    const { container } = render(RainfallChart, props)

    const ticks = [...container.querySelectorAll("svg text")]
      .map((t) => t.textContent?.trim() ?? "")
      .filter((t) => /^\d+"$/.test(t))
    expect(ticks).toEqual(['10"', '20"', '30"', '40"', '50"', '60"'])
  })

  /** Each bar prints its own figure: nothing here is visible only to a mouse. */
  it("prints every figure on the chart without a hover", async () => {
    render(RainfallChart, props)

    for (const value of ['53.71"', '35.55"', '31.96"', '30.52"', '37.49"']) {
      await expect.element(page.getByText(value, { exact: true }).first()).toBeInTheDocument()
    }
  })

  /** The drought hue belongs to the current year whatever the span's length. */
  it("gives the current year the drought colour, picked by name not position", async () => {
    const { container } = render(RainfallChart, props)

    const bars = [...container.querySelectorAll("svg g[role='img'] rect")]
    const current = bars.find((r) =>
      r.closest("g")!.getAttribute("aria-label")!.startsWith("2026:"),
    )!
    expect(current.getAttribute("fill")).toBe("#ea580c")
  })

  it("states how each year stands against the average", async () => {
    render(RainfallChart, props)

    expect(labels().find((l) => l.startsWith("2026:"))).toContain(
      "6.97 inches below the 10-year average",
    )
    expect(labels().find((l) => l.startsWith("2023:"))).toContain(
      "16.22 inches above the 10-year average",
    )
  })

  /**
   * Not "filled from a neighbouring gauge": every day is an average of
   * whatever read it, so what these days lack is the city's own reading.
   */
  it("says how many of the current year's days carry no city reading", async () => {
    render(RainfallChart, props)

    expect(labels().find((l) => l.startsWith("2026:"))).toContain(
      "36 days carry no reading from the city's own gauge",
    )
  })

  /** "1 day carry" read as a typo in the accessible name for every year with one. */
  it("agrees the verb with a single unread day", async () => {
    render(RainfallChart, {
      ...props,
      years: [YEARS[0], YEARS[1], YEARS[2], { ...YEARS[3], filledDays: 1 }],
    })

    expect(labels().find((l) => l.startsWith("2026:"))).toContain("1 day carries no reading")
  })

  it("carries the same five figures in a table", async () => {
    render(RainfallChart, props)

    await expect
      .element(page.getByRole("table", { name: /Rainfall in inches by year/ }))
      .toBeInTheDocument()
    await expect.element(page.getByRole("rowheader", { name: "2026" })).toBeInTheDocument()
    await expect
      .element(page.getByRole("rowheader", { name: "10-yr avg (2016–2025)" }))
      .toBeInTheDocument()
  })
})
