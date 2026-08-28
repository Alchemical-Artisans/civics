import { expect, test } from "@playwright/test"
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * The documents somebody has written a page for: one route directory each,
 * named for the document id. Read from disk rather than hardcoded, so these
 * tests follow the pages as they are written instead of pinning whichever one
 * happened to exist first.
 */
const dir = fileURLToPath(new URL(".", import.meta.url))
const written = readdirSync(dir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, "+page.svelte")))
  .map((entry) => entry.name)

test.describe("meeting document pages", () => {
  test("renders the page written for a document", async ({ page }) => {
    await page.goto(`/calendar/documents/${written[0]}`)

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByRole("article")).not.toBeEmpty()
  })

  test("offers the original document at the top of the page", async ({ page }) => {
    await page.goto(`/calendar/documents/${written[0]}`)

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
    await page.goto(`/calendar/documents/${written[0]}`)
    await page.getByRole("link", { name: "Back to the calendar" }).click()
    await expect(page).toHaveURL(/\/calendar$/)
  })

  test("reaches the written page from the calendar", async ({ page }) => {
    await page.goto("/calendar")
    // Internal links are the exception now, so finding one at all is the
    // assertion: it proves the calendar still routes to a page when there is
    // one to route to.
    await page.locator('a[href*="/calendar/documents/"]').first().click()
    await expect(page).toHaveURL(/\/calendar\/documents\//)
  })

  test("sends a document with no page written straight to the city's PDF", async ({ page }) => {
    // The common case by a long way: most of the corpus has no page here, and
    // the calendar links those to the city rather than to a page with nothing
    // on it. Asserted on attributes so the suite never leaves the site.
    await page.goto("/calendar")

    const external = page.locator('a[href^="https://media-001"]').first()
    await expect(external).toHaveAttribute("target", "_blank")
    expect(await external.getAttribute("rel")).toContain("noopener")
  })

  test("has no page for a document nobody has written up", async ({ page }) => {
    const response = await page.goto("/calendar/documents/not-a-document-00000000")
    expect(response?.status()).toBe(404)
  })
})
