import { expect, test } from "@playwright/test"

test.describe("landing page", () => {
  test("offers both halves of the site", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Haverhill Public Documents")
    // Two ways in and no more: the page is a hub, not a place to read anything.
    await expect(page.getByRole("main").or(page.locator("body")).getByRole("listitem")).toHaveCount(
      2,
    )
  })

  test("says how much is behind each link", async ({ page }) => {
    await page.goto("/")
    // Counted from the data at build time, so these assert that the numbers
    // rendered at all rather than pinning figures a refresh will move.
    await expect(page.getByRole("listitem").first()).toContainText(/\d+ meetings, \d+ documents/)
    await expect(page.getByRole("listitem").last()).toContainText(/\d+ fiscal years/)
  })

  test("opens the calendar", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Meeting Calendar" }).click()
    await expect(page).toHaveURL("/calendar")
    await expect(page.getByRole("heading", { name: "Haverhill Meeting Calendar" })).toBeVisible()
  })

  test("opens the budget reports", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Budget and Audit Reports" }).click()
    await expect(page).toHaveURL("/budget")
    await expect(page.getByRole("heading", { name: "Budget and Audit Reports" })).toBeVisible()
  })

  test("both halves come back to it", async ({ page }) => {
    for (const from of ["/calendar", "/budget"]) {
      await page.goto(from)
      await page.getByRole("link", { name: "Haverhill Public Documents" }).click()
      await expect(page).toHaveURL("/")
    }
  })

  test("leaves the site when the back button is pressed", async ({ page }) => {
    // `/` used to forward to the calendar, and the forward had to replace `/`
    // in history rather than push onto it, or back was thrown forward again.
    // Now that `/` is a page, back from it simply leaves -- which is what this
    // still checks, so the trap cannot come back by another route.
    await page.goto("/demo")
    await page.goto("/")
    await page.goBack()
    await expect(page).toHaveURL("/demo")
  })
})
