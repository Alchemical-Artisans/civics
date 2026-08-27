import { expect, test } from "@playwright/test"

test.describe("meeting calendar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calendar")
  })

  test("renders the calendar with a month heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Haverhill Meeting Calendar" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2 })).toHaveText(/^[A-Z][a-z]+ \d{4}$/)
  })

  test("links meetings to their document pages", async ({ page }) => {
    const link = page.locator('table a[href*="/calendar/documents/"]').first()
    await expect(link).toBeVisible()
    expect(await link.getAttribute("href")).toMatch(/^\/calendar\/documents\/[a-z0-9-]+$/)
  })

  test("keeps document links on this site, in the same tab", async ({ page }) => {
    // Documents used to open on the city's CDN in a new tab. They are pages
    // here now, so a new tab would be wrong; checked on every link because a
    // stray leftover would be easy to miss.
    const links = page.locator("table a")
    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      expect(await link.getAttribute("href")).toMatch(/^\/calendar\/documents\//)
      expect(await link.getAttribute("target")).toBeNull()
    }
  })

  test("navigates to the previous month", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 2 })
    const start = await heading.textContent()
    await page.getByRole("button", { name: "Previous month" }).click()
    await expect(heading).not.toHaveText(start!)
  })

  test("filtering by board narrows the visible documents", async ({ page }) => {
    const cells = page.locator('table a[href*="/calendar/documents/"]')
    const before = await cells.count()
    await page.getByRole("button", { name: "Conservation Commission", exact: true }).click()
    await expect(cells).not.toHaveCount(before)
    expect(await cells.count()).toBeLessThan(before)
  })

  test("unchecking agendas hides agenda entries", async ({ page }) => {
    const cells = page.locator('table a[href*="/calendar/documents/"]')
    const before = await cells.count()
    await page.getByRole("checkbox", { name: "Agendas" }).uncheck()
    expect(await cells.count()).toBeLessThan(before)
  })
})
