import { expect, test } from "@playwright/test"
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * The budget books somebody has written up, and the sections beneath the first
 * of them: one route directory each. Read from disk rather than hardcoded, the
 * same way the meeting suite does it, so these follow the pages as they are
 * written instead of pinning whichever one existed first.
 */
const dir = fileURLToPath(new URL(".", import.meta.url))
const directories = (at: string) =>
  readdirSync(at, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(at, entry.name, "+page.svelte")))
    .map((entry) => entry.name)

const books = directories(dir)
const sections = directories(join(dir, books[0]))

test.describe("budget pages", () => {
  test("lists every fiscal year the city publishes", async ({ page }) => {
    await page.goto("/budget")
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Budget and Audit Reports")
    // 2006 through 2027, one row each, plus the header row.
    expect(await page.locator("tbody tr").count()).toBe(22)
    await expect(page.getByRole("rowheader", { name: "FY2027" })).toBeVisible()
    await expect(page.getByRole("rowheader", { name: "FY2006" })).toBeVisible()
  })

  test("a year with no page here links to the city's own file", async ({ page }) => {
    await page.goto("/budget")
    // Asserted on attributes rather than by following them, so the suite never
    // reaches out to the city's CDN.
    const file = page.locator('tbody a[href^="https://"]').first()
    await expect(file).toHaveAttribute("target", "_blank")
    expect(await file.getAttribute("rel")).toContain("noopener")
  })

  test("a written book opens on its own table of contents", async ({ page }) => {
    await page.goto("/budget")
    await page.locator(`a[href$="/budget/${books[0]}"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`/budget/${books[0]}$`))
    await expect(page.getByRole("heading", { name: "Table of Contents" })).toBeVisible()
    // The book's contents, every line of it, whether or not it has a page here.
    expect(await page.getByRole("listitem").count()).toBeGreaterThan(50)
  })

  test("a contents line with no page here opens the city's PDF at that page", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    const outward = page.locator('li a[href*="#page="]').first()
    await expect(outward).toHaveAttribute("target", "_blank")
    expect(await outward.getAttribute("href")).toMatch(/#page=\d+$/)
  })

  test("a section names itself and returns to the book", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/${sections[0]}`)
    await expect(page.getByRole("heading", { level: 1 })).not.toBeEmpty()
    await expect(page.getByRole("article")).not.toBeEmpty()
    // The header link points into the book at this section's own page.
    await expect(page.locator('header a[href*="#page="]')).toHaveCount(1)

    await page.locator("nav a").click()
    await expect(page).toHaveURL(new RegExp(`/budget/${books[0]}$`))
  })

  test("every section the contents links to actually renders", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    const local = await page.locator('li a:not([href*="#page="])').all()
    const hrefs = await Promise.all(local.map((link) => link.getAttribute("href")))
    expect(hrefs.length).toBe(sections.length)
    for (const href of hrefs) {
      const response = await page.goto(new URL(href!, page.url()).toString())
      expect(response?.status()).toBe(200)
      await expect(page.getByRole("article")).not.toBeEmpty()
    }
  })

  test("returns to the overview from a book", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    await page.getByRole("link", { name: "Back to budget and audit reports" }).click()
    await expect(page).toHaveURL(/\/budget$/)
  })

  test("has no page for a fiscal year the city does not publish", async ({ page }) => {
    const response = await page.goto("/budget/fy1999")
    expect(response?.status()).toBe(404)
  })

  test("is reachable from the calendar", async ({ page }) => {
    await page.goto("/calendar")
    await page.getByRole("link", { name: "budget and audit reports" }).click()
    await expect(page).toHaveURL(/\/budget$/)
  })
})
