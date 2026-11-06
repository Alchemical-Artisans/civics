import { page } from "vitest/browser"
import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-svelte"
import ProductionChart from "./ProductionChart.svelte"

/** Five windows, spread far enough apart to give each series a real normal to depart from. */
const windows = [
  {
    startDate: "2021-09-20",
    endDate: "2022-09-19",
    producedMg: 2100,
    rainfallInches: 44.5,
    rainfallMissingDays: 0,
    avgTempF: 50.1,
    tempMissingDays: 0,
  },
  {
    startDate: "2022-09-20",
    endDate: "2023-09-19",
    producedMg: 2200,
    rainfallInches: 60,
    rainfallMissingDays: 0,
    avgTempF: 52.4,
    tempMissingDays: 0,
  },
  {
    startDate: "2023-09-20",
    endDate: "2024-09-19",
    producedMg: 2150,
    rainfallInches: 51.25,
    rainfallMissingDays: 40,
    avgTempF: 49.2,
    tempMissingDays: 40,
  },
  {
    startDate: "2024-09-20",
    endDate: "2025-09-19",
    producedMg: 2050,
    rainfallInches: 38,
    rainfallMissingDays: 3,
    avgTempF: 48.8,
    tempMissingDays: 0,
  },
  {
    startDate: "2025-09-20",
    endDate: "2026-09-19",
    producedMg: 1900,
    rainfallInches: 30,
    rainfallMissingDays: 0,
    avgTempF: 51.7,
    tempMissingDays: 0,
  },
]

const hitTargets = () =>
  [...document.querySelectorAll(".production-chart svg rect")].filter(
    (r) => r.getAttribute("fill") === "transparent",
  )

describe("ProductionChart.svelte", () => {
  it("names all three series' real figures and their departures on every window", async () => {
    render(ProductionChart, { windows })
    await expect.element(page.getByRole("img").nth(0)).toBeInTheDocument()

    const newest = hitTargets().at(-1)!.getAttribute("aria-label")!.replace(/\s+/g, " ")

    expect(newest).toContain("1,900 million gallons produced (fabricated)")
    expect(newest).toContain("30 inches of rain")
    expect(newest).toContain("51.7 degrees Fahrenheit")
    // Each one also states how far from its own normal it sits.
    expect(newest.match(/standard deviations from normal|from normal/g)?.length).toBe(3)
  })

  it("draws the driest window below normal and the wettest above it", async () => {
    render(ProductionChart, { windows })

    const labels = hitTargets().map((t) => t.getAttribute("aria-label")!.replace(/\s+/g, " "))
    const driest = labels.find((l) => l.includes("30 inches of rain"))!
    const wettest = labels.find((l) => l.includes("60 inches of rain"))!

    expect(driest).toMatch(/30 inches of rain, -\d/)
    expect(wettest).toMatch(/60 inches of rain, \+\d/)
  })

  it("marks a window the station under-recorded, on whichever series it affects", async () => {
    render(ProductionChart, { windows })

    await expect.element(page.getByText(/the figure is a floor/)).toBeInTheDocument()
    // The third window is short on both rainfall and temperature: one ring each.
    const rings = document.querySelectorAll(".production-chart svg circle[fill='white']")
    expect(rings.length).toBe(2)
  })

  it("says nothing about gaps when the record is complete throughout", async () => {
    const clean = windows.map((w) => ({ ...w, rainfallMissingDays: 0, tempMissingDays: 0 }))
    render(ProductionChart, { windows: clean })

    expect(document.querySelectorAll(".production-chart svg circle[fill='white']").length).toBe(0)
    expect(document.body.textContent).not.toContain("the figure is a floor")
  })

  it("labels the axis against a normal rather than in any one series' units", async () => {
    render(ProductionChart, { windows })

    await expect.element(page.getByText("normal", { exact: true })).toBeInTheDocument()
    await expect.element(page.getByText("Mean temperature")).toBeInTheDocument()
    await expect.element(page.getByText(/^12 months ending/)).toBeInTheDocument()
  })

  it("shows every series' own figure on focus", async () => {
    render(ProductionChart, { windows })

    hitTargets()
      .at(-1)!
      .dispatchEvent(new FocusEvent("focus", { bubbles: true }))

    await expect.element(page.getByText(/1,900 MG/)).toBeInTheDocument()
    await expect.element(page.getByText(/30 in/)).toBeInTheDocument()
    await expect.element(page.getByText(/51\.7°F/)).toBeInTheDocument()
  })
})
