import { expect, test } from "@playwright/test"
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { easternDate, monthKey } from "../lib/calendar"

/** The current month's own page -- there is no bare `/calendar` any more. */
const CALENDAR = `/calendar/${monthKey(easternDate()).replace("-", "/")}`

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
  test("is a landing page, not a forward", async ({ page }) => {
    const response = await page.goto("/")
    // `/` used to forward straight to the budget book; it is a page in its own
    // right now, and the reader stays on it.
    expect(response?.status()).toBe(200)
    await expect(page).toHaveURL("/")
    await expect(page.getByRole("heading", { level: 1, name: "Meetinghouse" })).toBeVisible()
  })

  test("points at both halves", async ({ page }) => {
    await page.goto("/")
    const main = page.getByRole("navigation", { name: "The two halves" })
    await expect(main.getByRole("link", { name: /Meeting calendar/ })).toHaveAttribute(
      "href",
      new RegExp(`${CALENDAR}$`),
    )
    await expect(main.getByRole("link", { name: /Budget/ })).toHaveAttribute(
      "href",
      new RegExp(`/budget/${newest}$`),
    )
  })

  test("its calendar card opens the calendar", async ({ page }) => {
    await page.goto("/")
    await page
      .getByRole("navigation", { name: "The two halves" })
      .getByRole("link", { name: /Meeting calendar/ })
      .click()
    await expect(page).toHaveURL(CALENDAR)
  })

  test("draws the week the build ran in, a day to a row", async ({ page }) => {
    await page.goto("/")
    const card = page.getByRole("navigation", { name: "The two halves" }).locator("> div").first()

    // Seven days, Sunday first, whatever week the build landed in.
    const days = card.getByRole("listitem").filter({ hasText: /^(SUN|MON|TUE|WED|THU|FRI|SAT)/i })
    await expect(days).toHaveCount(7)
    await expect(days.first()).toContainText("Sun")
    await expect(days.last()).toContainText("Sat")
  })

  test("its budget card draws the year rather than describing it", async ({ page }) => {
    await page.goto("/")
    const card = page.getByRole("navigation", { name: "The two halves" }).locator("> div").last()

    // The same two columns the book's own front page opens with, named twice
    // apiece -- once under the column, once over its half of the legend.
    await expect(card.getByText("Spending", { exact: true })).toHaveCount(2)
    await expect(card.getByText("Revenue", { exact: true })).toHaveCount(2)

    // Every segment names itself, so the four colours are not decoration.
    await expect(card.getByText("Everything else")).toHaveCount(2)

    // The figures are the book's own, read out of the transcribed tables by
    // `summary.ts` rather than typed a second time here. The card and the page
    // it opens cannot disagree, and this fails if either changes alone.
    const book = await (await page.request.get(`/budget/${newest}`)).text()
    for (const total of ["$316,044,835", "$310,893,296"]) {
      await expect(card.getByText(total)).toBeVisible()
      expect(book).toContain(total)
    }
  })

  test("a sitting in the week opens its own meeting page", async ({ page }) => {
    await page.goto("/")
    const card = page.getByRole("navigation", { name: "The two halves" }).locator("> div").first()
    const sitting = card.locator('a[href*="/calendar/meetings/"]').first()

    // A quiet week is the ordinary case and is not a failure -- Haverhill's
    // boards sit once or twice a week, and some weeks not at all. What is
    // asserted is that a sitting drawn here is a way in and not a picture: the
    // card is one big link to the calendar, and this has to survive that.
    if (!(await sitting.count())) return
    await sitting.click()
    await expect(page).toHaveURL(/\/calendar\/meetings\/.+/)
  })
})

test.describe("the site's attribution line", () => {
  test("is the last thing on a calendar page", async ({ page }) => {
    await page.goto(CALENDAR)
    await expect(
      page.getByRole("contentinfo").getByText("Created by Alchemical Artisans"),
    ).toBeVisible()
  })

  test("sits below the budget calendar on a budget page", async ({ page }) => {
    // Both are fixed to the bottom of the window on this half of the site, and
    // the attribution is under the calendar rather than wedged between the
    // reading and it. Asserted as geometry, because that is the whole claim.
    await page.goto(`/budget/${newest}`)
    const attribution = page.getByText("Created by Alchemical Artisans")
    const timeline = page.locator(".budget-timeline")

    const below = (await attribution.boundingBox())!
    const above = (await timeline.boundingBox())!
    expect(below.y).toBeGreaterThan(above.y + above.height - 1)

    // And nothing of the page is left underneath either of them: the layout
    // pads by more than the two are tall.
    const clearance = await page.evaluate(() => {
      const article = document.querySelector("article.budget-prose")!
      return window.innerHeight - article.getBoundingClientRect().bottom
    })
    expect(clearance).toBeGreaterThan(0)
  })
})

test.describe("the site header", () => {
  test("carries the mark and both sections on every kind of page", async ({ page }) => {
    for (const at of ["/", CALENDAR, `/budget/${newest}`, `/budget/${newest}/${section}`]) {
      await page.goto(at)
      const header = page.getByRole("banner")
      // Located as an element, not by role: the mark is decorative (`alt=""`)
      // because the site name sits right beside it, and a decorative image has
      // no img role to find it by.
      await expect(header.locator("img")).toBeVisible()
      await expect(header.getByRole("link", { name: "Meetinghouse" })).toBeVisible()
      await expect(header.getByRole("link", { name: "Budget", exact: true })).toBeVisible()
      await expect(header.getByRole("link", { name: "Calendar", exact: true })).toBeVisible()
    }
  })

  test("the word Budget opens this year's book", async ({ page }) => {
    // The same destination `/` forwards to. It is a link and not the thing you
    // press to see the years, because a word that navigates cannot be both.
    await page.goto(CALENDAR)
    await page.getByRole("banner").getByRole("link", { name: "Budget", exact: true }).click()
    await expect(page).toHaveURL(`/budget/${newest}`)
  })

  test("hovering Budget lists every fiscal year the city publishes", async ({ page }) => {
    // Everything the deleted `/budget` page used to list, under the pointer
    // instead of behind a page of its own.
    await page.goto(CALENDAR)
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
    await page.goto(CALENDAR)
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
    await page.goto(CALENDAR)
    const header = page.getByRole("banner")
    await header.getByRole("link", { name: "Budget", exact: true }).hover()
    await header.getByRole("link", { name: `FY${newest.slice(2)}` }).click()

    await expect(page).toHaveURL(`/budget/${newest}`)
    // Nothing else would close it: the bar survives the navigation under it,
    // and the pointer is still inside the menu that is no longer wanted.
    await expect(header.locator("#budget-years")).toBeHidden()
  })

  test("closes the budget menu on Escape", async ({ page }) => {
    await page.goto(CALENDAR)
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
    await expect(page).toHaveURL(CALENDAR)
  })

  test("the mark goes to the front page", async ({ page }) => {
    await page.goto(CALENDAR)
    await page.getByRole("link", { name: "Meetinghouse" }).click()
    await expect(page).toHaveURL("/")
    await expect(page.getByRole("heading", { level: 1, name: "Meetinghouse" })).toBeVisible()
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

    expect(await marked(CALENDAR)).toBe("Calendar")
    expect(await marked(`/budget/${newest}`)).toBe("Budget")
    // Three levels down still marks its half of the site.
    expect(await marked(`/budget/${newest}/${section}`)).toBe("Budget")

    // The front page is in neither half, so it marks neither.
    expect(await marked("/")).toBeNull()
  })

  test("marks which section the reader is in", async ({ page }) => {
    const header = page.getByRole("banner")

    await page.goto(CALENDAR)
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
    await page.goto(CALENDAR)
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
    await page.goto(CALENDAR)
    const header = page.getByRole("banner")
    await header.getByRole("link", { name: "Budget", exact: true }).tap()
    await expect(page).toHaveURL(`/budget/${newest}`)
  })

  test("a tap outside puts the menu away", async ({ page }) => {
    await page.goto(CALENDAR)
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
    await page.goto(CALENDAR)
    const header = page.getByRole("banner")
    const years = header.locator("#budget-years")

    await expect(years).toBeHidden()
    await header.getByRole("link", { name: "Budget", exact: true }).hover()
    await expect(years).toBeVisible()
    await expect(years.getByRole("link", { name: /^FY2006/ })).toBeVisible()
  })
})
