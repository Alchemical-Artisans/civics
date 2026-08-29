import { expect, test } from "@playwright/test"
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * The meetings somebody has written up: one route directory each, named for
 * the meeting id. Read from disk rather than hardcoded, so these follow the
 * pages as they are written instead of pinning whichever one existed first.
 * `[meeting]` is the generated route and is not one of them.
 */
const dir = fileURLToPath(new URL(".", import.meta.url))
const written = readdirSync(dir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      !entry.name.startsWith("[") &&
      existsSync(join(dir, entry.name, "+page.svelte")),
  )
  .map((entry) => entry.name)

/** An item page beneath the first written meeting, by the same reasoning. */
const items = readdirSync(join(dir, written[0]), { withFileTypes: true })
  .filter(
    (entry) => entry.isDirectory() && existsSync(join(dir, written[0], entry.name, "+page.svelte")),
  )
  .map((entry) => entry.name)

test.describe("meeting pages", () => {
  test("a written meeting is what the calendar lands on", async ({ page }) => {
    // The whole point of merging the two: clicking a meeting shows the agenda,
    // not a list with one link on it.
    await page.goto("/calendar")
    const entry = page.locator(`a[href*="/calendar/meetings/${written[0]}"]`)
    if (await entry.count()) await entry.first().click()
    else await page.goto(`/calendar/meetings/${written[0]}`)

    await expect(page).toHaveURL(new RegExp(`/calendar/meetings/${written[0]}$`))
    await expect(page.getByRole("article")).not.toBeEmpty()
    expect(await page.getByRole("article").locator("h2").count()).toBeGreaterThan(0)
  })

  test("names the board and the date, and lists the city's files", async ({ page }) => {
    await page.goto(`/calendar/meetings/${written[0]}`)
    await expect(page.getByRole("heading", { level: 1 })).not.toBeEmpty()
    // A direct child: the notice popover also renders paragraphs, and they sit
    // inside the header too.
    await expect(page.locator("header > p").first()).toContainText(
      /^[A-Z][a-z]+day, [A-Z][a-z]+ \d{1,2}, \d{4}/,
    )

    // Asserted on attributes rather than by following them, so the suite never
    // reaches out to the city's CDN.
    const file = page.locator('header a[href^="https://"]').last()
    await expect(file).toHaveAttribute("target", "_blank")
    expect(await file.getAttribute("rel")).toContain("noopener")
  })

  test("a meeting nobody has written up still lists its files", async ({ page }) => {
    await page.goto("/calendar")
    for (const link of await page.locator("table a").all()) {
      const href = (await link.getAttribute("href"))!
      if (written.some((id) => href.endsWith(id))) continue
      await page.goto(new URL(href, page.url()).toString())
      await expect(page.getByRole("article")).toContainText("Nobody has transcribed")
      expect(await page.locator('header a[href^="https://"]').count()).toBeGreaterThan(0)
      return
    }
    throw new Error("every meeting on the default month has been written up")
  })

  test("an item page sits beneath its meeting and returns to it", async ({ page }) => {
    await page.goto(`/calendar/meetings/${written[0]}/${items[0]}`)
    await expect(page.getByRole("heading", { level: 1 })).not.toBeEmpty()
    await page.locator("nav a").click()
    await expect(page).toHaveURL(new RegExp(`/calendar/meetings/${written[0]}$`))
  })

  test("returns to the calendar", async ({ page }) => {
    await page.goto(`/calendar/meetings/${written[0]}`)
    await page.getByRole("link", { name: "Back to the calendar" }).click()
    await expect(page).toHaveURL(/\/calendar$/)
  })

  test("has no page for a meeting that never happened", async ({ page }) => {
    const response = await page.goto("/calendar/meetings/not-a-board-2026-01-01")
    expect(response?.status()).toBe(404)
  })
})
