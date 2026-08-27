import { expect, test } from "@playwright/test"

test.describe("landing page", () => {
  test("forwards to the calendar", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL("/calendar")
    await expect(page.getByRole("heading", { name: "Haverhill Meeting Calendar" })).toBeVisible()
  })

  test("leaves the site when the back button is pressed", async ({ page }) => {
    // The forward must replace `/` in history, not push onto it, or back from
    // the calendar returns to `/` and is thrown forward again.
    await page.goto("/demo")
    await page.goto("/")
    await expect(page).toHaveURL("/calendar")
    await page.goBack()
    await expect(page).toHaveURL("/demo")
  })
})
