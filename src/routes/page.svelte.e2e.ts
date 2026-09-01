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
const written = (at: string) =>
  readdirSync(at, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(at, entry.name, "+page.svelte")))
    .map((entry) => entry.name)
    .sort()

const newest = written(budget).at(-1)!

/** Any section of that book, for the pages three levels down. Read from disk
    for the same reason: a section written up today and dropped tomorrow should
    not take a test with it. */
const section = written(join(budget, newest))[0]

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
    for (const at of ["/", "/calendar", `/budget/${newest}`, `/budget/${newest}/${section}`]) {
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

  test("the word Budget opens this year's book", async ({ page }) => {
    // The same destination `/` forwards to. It is a link and not the thing you
    // press to see the years, because a word that navigates cannot be both.
    await page.goto("/calendar")
    await page.getByRole("banner").getByRole("link", { name: "Budget", exact: true }).click()
    await expect(page).toHaveURL(`/budget/${newest}`)
  })

  test("hovering Budget lists every fiscal year the city publishes", async ({ page }) => {
    // Everything the deleted `/budget` page used to list, under the pointer
    // instead of behind a page of its own.
    await page.goto("/calendar")
    const header = page.getByRole("banner")
    const years = header.locator("#budget-years")

    await expect(years).toBeHidden()
    await header.getByRole("link", { name: "Budget", exact: true }).hover()
    await expect(years).toBeVisible()

    // 2006 through 2027, one row each.
    await expect(years.locator("li")).toHaveCount(22)
    await expect(years.getByRole("link", { name: /^FY2027/ })).toBeVisible()
    await expect(years.getByRole("link", { name: /^FY2006/ })).toBeVisible()
  })

  test("a year with no page here opens the city's own file", async ({ page }) => {
    await page.goto("/calendar")
    const header = page.getByRole("banner")
    await header.getByRole("link", { name: "Budget", exact: true }).hover()

    // Asserted on attributes rather than by following them, so the suite never
    // reaches out to the city's CDN. The audit reports are here too: this menu
    // is the only place on the site that links them.
    const file = header.locator('#budget-years a[href^="https://"]').first()
    await expect(file).toHaveAttribute("target", "_blank")
    expect(await file.getAttribute("rel")).toContain("noopener")
    await expect(header.getByRole("link", { name: /^Audit/ }).first()).toBeVisible()
  })

  test("picking a year opens its book, and the menu closes behind itself", async ({ page }) => {
    await page.goto("/calendar")
    const header = page.getByRole("banner")
    await header.getByRole("link", { name: "Budget", exact: true }).hover()
    await header.getByRole("link", { name: `FY${newest.slice(2)}` }).click()

    await expect(page).toHaveURL(`/budget/${newest}`)
    // Nothing else would close it: the bar survives the navigation under it,
    // and the pointer is still inside the menu that is no longer wanted.
    await expect(header.locator("#budget-years")).toBeHidden()
  })

  test("closes the budget menu on Escape", async ({ page }) => {
    await page.goto("/calendar")
    const header = page.getByRole("banner")
    const years = header.locator("#budget-years")

    await header.getByRole("link", { name: "Budget", exact: true }).hover()
    await expect(years).toBeVisible()
    // Still hovered, which is the case CSS alone could not close -- the reason
    // the component takes the hover over from it once it has mounted.
    await page.keyboard.press("Escape")
    await expect(years).toBeHidden()
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
    expect(await marked(`/budget/${newest}/${section}`)).toBe("Budget")

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
    await page.goto(`/budget/${newest}/${section}`)
    await expect(header.getByRole("link", { name: "Budget", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    )

    // And inside the menu, the book the reader is actually in.
    await header.getByRole("link", { name: "Budget", exact: true }).hover()
    await expect(header.getByRole("link", { name: `FY${newest.slice(2)}` })).toHaveAttribute(
      "aria-current",
      "true",
    )
  })
})

test.describe("the site header on a touch screen", () => {
  // A phone: no hover to give, and a tap on the word beside the caret
  // navigates. `isMobile` is what makes `(hover: hover)` false in the page, so
  // this is the only place the caret is the whole control.
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } })

  test("the caret opens the menu, and closes it again", async ({ page }) => {
    await page.goto("/calendar")
    const header = page.getByRole("banner")
    const caret = header.getByRole("button", { name: "Every fiscal year" })
    const years = header.locator("#budget-years")

    await expect(years).toBeHidden()
    await expect(caret).toHaveAttribute("aria-expanded", "false")

    await caret.tap()
    await expect(years).toBeVisible()
    await expect(caret).toHaveAttribute("aria-expanded", "true")

    await caret.tap()
    await expect(years).toBeHidden()
  })

  test("tapping the word opens this year's book instead", async ({ page }) => {
    await page.goto("/calendar")
    const header = page.getByRole("banner")
    await header.getByRole("link", { name: "Budget", exact: true }).tap()
    await expect(page).toHaveURL(`/budget/${newest}`)
  })

  test("a tap outside puts the menu away", async ({ page }) => {
    await page.goto("/calendar")
    const header = page.getByRole("banner")
    const years = header.locator("#budget-years")

    await header.getByRole("button", { name: "Every fiscal year" }).tap()
    await expect(years).toBeVisible()
    // A point on the page rather than an element: the menu covers the top
    // right of it, and what is being tested is the tap landing anywhere else.
    await page.touchscreen.tap(20, 500)
    await expect(years).toBeHidden()
  })
})

test.describe("the site header with no script", () => {
  // The pages are prerendered and readable before anything hydrates, and the
  // menu is written to hold that: hidden markup revealed by a CSS `:hover`,
  // which the component takes over from once it has mounted.
  test.use({ javaScriptEnabled: false })

  test("still opens the budget menu on hover", async ({ page }) => {
    await page.goto("/calendar")
    const header = page.getByRole("banner")
    const years = header.locator("#budget-years")

    await expect(years).toBeHidden()
    await header.getByRole("link", { name: "Budget", exact: true }).hover()
    await expect(years).toBeVisible()
    await expect(years.getByRole("link", { name: /^FY2006/ })).toBeVisible()
  })
})
