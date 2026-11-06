import { page } from "vitest/browser"
import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-svelte"
import DroughtScale from "./DroughtScale.svelte"

describe("DroughtScale.svelte", () => {
  it("names every stage, its percentage, and the current one in a single accessible name", () => {
    render(DroughtScale, { current: "Emergency" })

    const scale = page.getByRole("img")
    const label = scale.element().getAttribute("aria-label")
    expect(label).toContain("Watch (5-10% below average reservoir capacity)")
    expect(label).toContain("Warning (10-20% below average reservoir capacity)")
    expect(label).toContain("Emergency (20-35% below average reservoir capacity)")
    expect(label).toContain("Critical (>35% below average reservoir capacity)")
    expect(label).toMatch(/currently Emergency$/)
  })

  it("shows every stage name and percentage, and marks the current one", async () => {
    render(DroughtScale, { current: "Watch" })

    for (const name of ["Watch", "Warning", "Emergency", "Critical"]) {
      await expect.element(page.getByText(name, { exact: true })).toBeInTheDocument()
    }
    for (const percent of ["5-10%", "10-20%", "20-35%", ">35%"]) {
      await expect.element(page.getByText(percent, { exact: true })).toBeInTheDocument()
    }
  })
})
