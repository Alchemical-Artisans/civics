import { page } from "vitest/browser"
import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-svelte"
import WaterCalculator from "./WaterCalculator.svelte"

describe("WaterCalculator.svelte", () => {
  it("shows nothing computed before any input is entered", async () => {
    render(WaterCalculator)

    await expect.element(page.getByText(/per person per day/)).not.toBeInTheDocument()
  })

  it("compares a household's own gallons per person per day to the city's target", async () => {
    render(WaterCalculator)

    await page.getByLabelText("Gallons used").fill("900")
    await page.getByLabelText("People in the household").fill("3")
    await page.getByLabelText("Over how many days").fill("30")

    // 900 / 3 / 30 = 10 gal per person per day, well under the 65 target.
    await expect
      .element(page.getByText(/uses about 10 gal per person per day, at or under/))
      .toBeInTheDocument()
  })

  it("says how far over target a household is, above 65 gal/person/day", async () => {
    render(WaterCalculator)

    await page.getByLabelText("Gallons used").fill("6300")
    await page.getByLabelText("People in the household").fill("3")
    await page.getByLabelText("Over how many days").fill("30")

    // 6300 / 3 / 30 = 70 gal, five over the 65 target.
    await expect.element(page.getByText(/5 gal more than the city's target/)).toBeInTheDocument()
  })
})
