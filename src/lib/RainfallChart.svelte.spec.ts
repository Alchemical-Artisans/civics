import { page } from "vitest/browser"
import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-svelte"
import RainfallChart from "./RainfallChart.svelte"

describe("RainfallChart.svelte", () => {
  it("names every year's total and departure in its own accessible label", async () => {
    render(RainfallChart)

    const bars = page.getByRole("img")
    await expect.element(bars.nth(0)).toBeInTheDocument()

    const labels = bars.elements().map((el) => el.getAttribute("aria-label"))
    expect(labels.some((label) => label?.startsWith("2026:"))).toBe(true)
    expect(labels.find((label) => label?.startsWith("2026:"))).toContain("-3.76 in vs.")
  })

  it("shows a tooltip with the year's figures on focus", async () => {
    render(RainfallChart)

    const bars = page.getByRole("img")
    const last = bars.nth(bars.elements().length - 1)
    await last.element().focus()

    await expect.element(page.getByText("2026", { exact: true })).toBeInTheDocument()
  })
})
