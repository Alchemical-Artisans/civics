import { expect, test } from "@playwright/test"

test.describe("meeting calendar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calendar")
  })

  test("renders the calendar with a month heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Haverhill Meeting Calendar" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2 })).toHaveText(/^[A-Z][a-z]+ \d{4}$/)
  })

  test("links a meeting with a page written for it to that page", async ({ page }) => {
    const link = page.locator('table a[href*="/calendar/documents/"]').first()
    await expect(link).toBeVisible()
    expect(await link.getAttribute("href")).toMatch(/\/calendar\/documents\/[a-z0-9-]+$/)
    // Stays on the site, so no new tab.
    expect(await link.getAttribute("target")).toBeNull()
  })

  test("sends every other meeting to the city's own file, in a new tab", async ({ page }) => {
    // Pages here are written by hand and most documents have none. Those link
    // straight to the city rather than to a page with nothing on it, and a link
    // that leaves the site opens in a new tab. Checked on every link, because
    // one going to the wrong place would be easy to miss.
    const links = page.locator("table a")
    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      const href = await link.getAttribute("href")
      if (/\/calendar\/documents\//.test(href!)) continue
      expect(href).toMatch(/^https:\/\//)
      expect(await link.getAttribute("target")).toBe("_blank")
      expect(await link.getAttribute("rel")).toContain("noopener")
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
