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

  test("the book opens on the budget at a glance, before its contents", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // Both halves of the same total, each ranked largest first, and each
    // heading carrying that total rather than a line of its own under it.
    await expect(
      page.getByRole("heading", { name: /^Appropriations \$285,272,159$/ }),
    ).toBeVisible()
    await expect(page.getByRole("heading", { name: /^Revenue \$285,272,159$/ })).toBeVisible()

    const charts = page.locator(".budget-chart")
    await expect(charts).toHaveCount(2)

    // Every wedge says what it is and what it costs as its accessible name,
    // whether or not anyone can hover something a third of a degree wide.
    const wedges = charts.first().getByRole("img")
    expect(await wedges.count()).toBeGreaterThan(5)
    await expect(wedges.first()).toHaveAttribute("aria-label", "Education, $147,158,454, 51.6%")
    for (const wedge of await wedges.all()) {
      expect(await wedge.getAttribute("aria-label")).toMatch(/\$[\d,]+/)
    }
  })

  test("names and prices the wedge under the pointer", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    const chart = page.locator(".budget-chart").first()
    const box = (await chart.boundingBox())!

    // Right of centre and below it, which is inside Education -- the wedge
    // running from twelve o'clock through half the circle.
    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.7)

    const tooltip = chart.locator(".budget-tooltip")
    await expect(tooltip).toContainText("Education")
    await expect(tooltip).toContainText("$147,158,454")
    await expect(tooltip).toContainText("51.6%")
  })

  test("reaches the wedge no mouse can hit with the keyboard", async ({ page }) => {
    // Overlay is 1/589th of Education, about a third of a degree. Focus is the
    // only way to it, which is why every wedge takes focus.
    await page.goto(`/budget/${books[0]}`)
    const chart = page.locator(".budget-chart").first()
    await chart.getByRole("img").last().focus()
    await expect(chart.locator(".budget-tooltip")).toContainText("Overlay")
    await expect(chart.locator(".budget-tooltip")).toContainText("$250,000")
  })

  test("draws the budget calendar across the foot of the page", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    await expect(page.getByRole("heading", { name: "Budget Calendar" })).toBeVisible()

    // A box per entry, in the book's order, each showing its date and a few
    // words and carrying the book's own sentence for a reader who cannot hover.
    const entries = page.locator(".budget-timeline li")
    await expect(entries).toHaveCount(12)
    await expect(entries.first()).toContainText("1/9/26")
    await expect(entries.first()).toContainText("Directives to departments")
    await expect(entries.first()).toContainText(
      "Mayor distributed budget directives to departments.",
    )
    await expect(entries.last()).toContainText("6/16/26")
    await expect(entries.last()).toContainText("Budget adopted")

    // This book's calendar ended when the council adopted the budget, so the
    // mark sits at the end of the row and stays there.
    const today = page.locator(".budget-today")
    await expect(today).toContainText("Today,")
    await expect(today).toHaveAttribute("style", "left: 100%")
  })

  test("gives the book's own wording for the step under the pointer", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    await page.locator(".budget-timeline li").nth(1).hover()

    const detail = page.locator(".budget-detail")
    await expect(detail).toContainText("1/15/26")
    await expect(detail).toContainText("Finance prepared revenue projections")
    await expect(detail).toContainText("assessed debt capacity.")
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

    // Scoped past the site header, which is a nav of its own on every page.
    await page.getByRole("link", { name: `FY${books[0].slice(2)} Mayor's Budget` }).click()
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

  test("is where the site root lands", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(new RegExp(`/budget/${books[0]}$`))
  })
})
