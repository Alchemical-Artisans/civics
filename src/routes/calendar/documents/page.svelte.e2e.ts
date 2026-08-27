import { expect, test } from "@playwright/test"

test.describe("meeting document pages", () => {
  test("reaches a document from the calendar and shows its converted text", async ({ page }) => {
    await page.goto("/calendar")
    // Conservation Commission agendas are published with a text layer, so one
    // of them is guaranteed to have been converted rather than embedded.
    await page.getByRole("button", { name: "Conservation Commission", exact: true }).click()
    await page.locator('table a[href*="/calendar/documents/"]').first().click()

    await expect(page).toHaveURL(/\/calendar\/documents\//)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByRole("article")).toContainText(/Conservation Commission/i)
  })

  test("offers the original document at the top of the page", async ({ page }) => {
    await page.goto("/calendar")
    await page.getByRole("button", { name: "Conservation Commission", exact: true }).click()
    await page.locator('table a[href*="/calendar/documents/"]').first().click()

    // Asserted on attributes rather than by following them, so the suite never
    // reaches out to the city's CDN.
    const media = page.getByRole("link", { name: /^Original Page/ })
    expect(await media.getAttribute("href")).toMatch(/^https:\/\/www\.haverhillma\.gov\//)
    await expect(media).toHaveAttribute("target", "_blank")

    const pdf = page.getByRole("link", { name: /^\(PDF/ })
    expect(await pdf.getAttribute("href")).toMatch(/^https:\/\/media-001.*\.pdf$/)
    await expect(pdf).toHaveAttribute("target", "_blank")
    expect(await pdf.getAttribute("rel")).toContain("noopener")
  })

  test("returns to the calendar", async ({ page }) => {
    await page.goto("/calendar")
    await page.locator('table a[href*="/calendar/documents/"]').first().click()
    await page.getByRole("link", { name: "Back to the calendar" }).click()
    await expect(page).toHaveURL(/\/calendar$/)
  })

  test("falls back to an embedded viewer for a scanned document", async ({ page }) => {
    // Most City Council documents are image-only scans with nothing to convert.
    await page.goto("/calendar")
    await page.getByRole("button", { name: "City Council", exact: true }).click()

    // Collected up front and visited directly. Clicking through and going back
    // would re-run the filter on every iteration, and racing hydration that way
    // made this flaky.
    const hrefs = await page
      .locator('table a[href*="/calendar/documents/"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")!))
    expect(hrefs.length).toBeGreaterThan(0)

    for (const href of hrefs) {
      await page.goto(href)
      if (await page.locator('object[type="application/pdf"]').count()) {
        await expect(page.getByText(/published this document as a scan/i)).toBeVisible()
        return
      }
    }
    throw new Error("expected at least one scanned City Council document")
  })
})
