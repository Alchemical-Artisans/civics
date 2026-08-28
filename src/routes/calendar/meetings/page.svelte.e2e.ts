import { expect, test } from "@playwright/test"

/**
 * A meeting page is where a sitting's documents live. Reached through the
 * calendar rather than by a hardcoded id, so these follow the data instead of
 * pinning one meeting that a scrape could move.
 */
const firstMeeting = async (page: import("@playwright/test").Page) => {
  await page.goto("/calendar")
  await page.locator("table a").first().click()
  await expect(page).toHaveURL(/\/calendar\/meetings\//)
}

test.describe("meeting pages", () => {
  test("names the board and the date", async ({ page }) => {
    await firstMeeting(page)
    await expect(page.getByRole("heading", { level: 1 })).not.toBeEmpty()
    await expect(page.locator("header p")).toHaveText(
      /^[A-Z][a-z]+day, [A-Z][a-z]+ \d{1,2}, \d{4}$/,
    )
  })

  test("lists at least one document", async ({ page }) => {
    await firstMeeting(page)
    expect(await page.locator("ul > li a").count()).toBeGreaterThan(0)
  })

  test("sends a document with no page written straight to the city, in a new tab", async ({
    page,
  }) => {
    // The common case by a long way: most of the corpus has no write-up here,
    // and those link to the city rather than to a page with nothing on it.
    // Asserted on attributes so the suite never reaches the city's CDN.
    await page.goto("/calendar")
    const external = page.locator('a[href^="https://media-001"]')
    let found = false
    for (const link of await page.locator("table a").all()) {
      await page.goto(new URL((await link.getAttribute("href"))!, page.url()).toString())
      if (await external.count()) {
        const first = external.first()
        await expect(first).toHaveAttribute("target", "_blank")
        expect(await first.getAttribute("rel")).toContain("noopener")
        found = true
        break
      }
      await page.goBack()
    }
    expect(found).toBe(true)
  })

  test("returns to the calendar", async ({ page }) => {
    await firstMeeting(page)
    await page.getByRole("link", { name: "Back to the calendar" }).click()
    await expect(page).toHaveURL(/\/calendar$/)
  })

  test("has no page for a meeting that never happened", async ({ page }) => {
    const response = await page.goto("/calendar/meetings/not-a-board-2026-01-01")
    expect(response?.status()).toBe(404)
  })
})
