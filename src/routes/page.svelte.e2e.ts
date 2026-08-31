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

test.describe("the site header", () => {
  test("carries the mark and both sections on every kind of page", async ({ page }) => {
    for (const at of ["/", "/calendar", "/budget", `/budget/${newest}`]) {
      await page.goto(at)
      const header = page.getByRole("banner")
      // Located as an element, not by role: the mark is decorative (`alt=""`)
      // because the site name sits right beside it, and a decorative image has
      // no img role to find it by.
      await expect(header.locator("img")).toBeVisible()
      await expect(header.getByRole("link", { name: "Haverhill Public Documents" })).toBeVisible()
      await expect(header.getByRole("link", { name: "Budget", exact: true })).toBeVisible()
      await expect(header.getByRole("link", { name: "Calendar", exact: true })).toBeVisible()
    }
  })

  test("its budget link opens the book, not the list of years", async ({ page }) => {
    // The same destination `/` forwards to. Sending it to the index would put
    // back the hop that landing on the budget was meant to remove.
    await page.goto("/calendar")
    await page.getByRole("banner").getByRole("link", { name: "Budget", exact: true }).click()
    await expect(page).toHaveURL(`/budget/${newest}`)
  })

  test("its calendar link opens the calendar", async ({ page }) => {
    await page.goto(`/budget/${newest}`)
    await page.getByRole("banner").getByRole("link", { name: "Calendar", exact: true }).click()
    await expect(page).toHaveURL("/calendar")
  })

  test("the mark goes to the front door", async ({ page }) => {
    await page.goto("/calendar")
    await page.getByRole("link", { name: "Haverhill Public Documents" }).click()
    // `/` forwards, so the mark lands where the front door lands.
    await expect(page).toHaveURL(`/budget/${newest}`)
  })

  // Asserted on the served HTML rather than the live DOM. The first spelling of
  // this compared a Router-built href against the pathname, which cannot match
  // during prerendering but starts matching after hydration -- so every
  // prerendered page shipped without `aria-current` and a DOM assertion passed
  // anyway. Reading the bytes is the only version of this test that would have
  // caught it.
  test("marks the current section in the HTML it serves, before any script runs", async ({
    page,
  }) => {
    /** The text of whichever header link the served HTML marks as current. */
    const marked = async (at: string) => {
      const html = await (await page.request.get(at)).text()
      const link = html.match(/<a[^>]*aria-current="page"[^>]*>([\s\S]*?)<\/a>/)
      return link?.[1].replace(/<[^>]*>/g, "").trim() ?? null
    }

    expect(await marked("/calendar")).toBe("Calendar")
    expect(await marked(`/budget/${newest}`)).toBe("Budget")
    // Three levels down still marks its half of the site.
    expect(await marked(`/budget/${newest}/mayors-budget-message`)).toBe("Budget")
    // `/` is in neither section; it only forwards.
    expect(await marked("/")).toBeNull()
  })

  test("marks which section the reader is in", async ({ page }) => {
    const header = page.getByRole("banner")

    await page.goto("/calendar")
    await expect(header.getByRole("link", { name: "Calendar", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    )
    await expect(header.getByRole("link", { name: "Budget", exact: true })).not.toHaveAttribute(
      "aria-current",
      "page",
    )

    // A section three levels down still marks its half of the site.
    await page.goto(`/budget/${newest}/mayors-budget-message`)
    await expect(header.getByRole("link", { name: "Budget", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    )
  })
})
