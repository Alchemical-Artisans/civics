import { expect, test } from "@playwright/test"
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * The most recent budget book written up: route directories under `budget/`
 * are named `fy<year>`, so the last one alphabetically is the newest. Read from
 * disk rather than hardcoded, so this follows the books as they are written --
 * which is the whole point of the page under test.
 */
const budget = fileURLToPath(new URL("./budget", import.meta.url))
const newest = readdirSync(budget, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(budget, entry.name, "+page.svelte")))
  .map((entry) => entry.name)
  .sort()
  .at(-1)!

test.describe("the site root", () => {
  test("opens the most recent budget book", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(`/budget/${newest}`)
    await expect(page.getByRole("heading", { name: "Table of Contents" })).toBeVisible()
  })

  test("leaves the site when the back button is pressed", async ({ page }) => {
    // The forward must replace `/` in history, not push onto it, or back from
    // the budget returns to `/` and is thrown forward again -- a trap the
    // visitor cannot get out of.
    await page.goto("/demo")
    await page.goto("/")
    await expect(page).toHaveURL(`/budget/${newest}`)
    await page.goBack()
    await expect(page).toHaveURL("/demo")
  })

  test("does not send a cacheable redirect status", async ({ page }) => {
    // A 301 would be cached by the browser, sometimes indefinitely, and would
    // keep opening this year's book long after next year's replaced it.
    const response = await page.goto("/")
    expect(response?.status()).toBe(200)
  })

  test("names both halves for a reader who does not follow the refresh", async ({ page }) => {
    // What a crawler reading the markup sees. The calendar has no other entry
    // point from here, so it has to be one of them.
    const html = await (await page.request.get("/")).text()
    expect(html).toContain(`/budget/${newest}`)
    expect(html).toMatch(/href="[^"]*\/calendar"/)
  })
})

test.describe("the two halves link to each other", () => {
  test("the calendar offers the budget", async ({ page }) => {
    await page.goto("/calendar")
    await page.getByRole("link", { name: "Budget and audit reports" }).click()
    await expect(page).toHaveURL("/budget")
  })

  test("the budget offers the calendar", async ({ page }) => {
    await page.goto("/budget")
    await page.getByRole("link", { name: "Meeting calendar" }).click()
    await expect(page).toHaveURL("/calendar")
  })

  test("so does the book everyone lands on", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Meeting calendar" }).click()
    await expect(page).toHaveURL("/calendar")
  })
})
