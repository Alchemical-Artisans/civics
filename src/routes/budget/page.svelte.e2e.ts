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

/**
 * Sections written up that the book's own contents page does not list -- its
 * front matter -- so the book page has no line to link them from. They render
 * at their own URLs; nothing on the site points at them.
 */
const unlinked = [
  "budget-phases",
  "city-hall-of-haverhill",
  "council-members",
  "mayors-budget-team",
]

/**
 * Sections the book page opens from its chart rather than from its contents:
 * each is a bar, and the bar's own name is the link. A contents line as well
 * would offer the same page twice on one screen.
 */
const charted = ["fiscal-reserves", "outstanding-debt", "revenue"]

test.describe("budget pages", () => {
  test("the book opens on the budget at a glance, before its contents", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // Both halves of the same total, each ranked largest first, and each
    // heading carrying that total rather than a line of its own under it.
    await expect(
      page.getByRole("heading", { name: /^Appropriations \$285,272,159$/ }),
    ).toBeVisible()
    // The revenue heading opens the section every figure in that pie comes
    // from, and is the only way to it: it has no line in the contents.
    await expect(page.getByRole("heading", { name: /^Revenue \$285,272,159$/ })).toBeVisible()
    await expect(page.getByRole("link", { name: "Revenue", exact: true })).toHaveAttribute(
      "href",
      /\/revenue$/,
    )
    await expect(
      page.locator("article > div ol li").filter({ hasText: "Revenue Estimates" }),
    ).toHaveCount(0)

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

  test("charts the reserves and the debt above the contents", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // Above the contents, which is where the standing position belongs: the
    // pies beside it are the year, this is what the year sits on.
    await expect(page.getByRole("heading", { name: "Reserves and Debt" })).toBeVisible()

    // One chart, two bars, each divided into what it is made of.
    const chart = page.locator(".budget-stack")
    const bars = chart.locator(".budget-series")
    await expect(bars).toHaveCount(2)
    await expect(bars.first()).toContainText("$21,986,546")
    await expect(bars.last()).toContainText("$175,745,444")

    // Each bar's name is the way into the section it is drawn from, and the
    // only way: neither has a line in the contents below.
    await expect(bars.first().getByRole("link", { name: "Reserves" })).toHaveAttribute(
      "href",
      /fiscal-reserves$/,
    )
    await expect(bars.last().getByRole("link", { name: "Debt" })).toHaveAttribute(
      "href",
      /outstanding-debt$/,
    )
    const contents = page.locator("article ol li")
    await expect(contents.filter({ hasText: "Fiscal Reserves" })).toHaveCount(0)
    await expect(contents.filter({ hasText: "Outstanding Debt" })).toHaveCount(0)

    // Free cash is nothing this year, so it draws no segment and keeps a line
    // for a screen reader instead.
    const held = bars.first().getByRole("img")
    await expect(held).toHaveCount(2)
    await expect(held.first()).toHaveAttribute(
      "aria-label",
      "Reserves, Fund Balance, $13,985,452, 63.6%",
    )
    await expect(bars.first()).toContainText("Reserves, Free Cash, $0")

    // Largest first, whatever order the book's own list is in.
    const owed = bars.last().getByRole("img")
    await expect(owed).toHaveCount(6)
    await expect(owed.first()).toHaveAttribute(
      "aria-label",
      "Debt, School Department, $71,517,300, 40.7%",
    )
    await expect(owed.last()).toHaveAttribute("aria-label", "Debt, Public Works, $1,455,200, 0.8%")
  })

  test("splits the contents into the year and what it funds", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // Two lists and no heading over either: sixty lines in one list is a list
    // nobody reads to the end of, and the second one is not all departments.
    // `> div`, because the calendar in the footer is a list too.
    const lists = page.locator("article > div ol")
    await expect(lists).toHaveCount(2)
    await expect(page.getByRole("heading", { name: "Departments" })).toHaveCount(0)
    await expect(page.getByRole("heading", { name: "Table of Contents" })).toHaveCount(0)

    // One line per thing the city funds, by name rather than by the book's
    // grouping: a reader who wants one of them knows what it is called.
    //
    // `toContainText`, because a line with no page here carries an `sr-only`
    // note saying it opens the city's PDF.
    const funded = lists.last().locator("li")
    await expect(funded.first()).toContainText("Assessor's Office")
    await expect(funded.last()).toContainText("Veterans Services")

    const named = await funded.evaluateAll((lines) =>
      lines.map((line) => line.textContent?.split(",")[0].trim() ?? ""),
    )
    expect(named).toEqual([...named].sort((a, b) => a.localeCompare(b, "en")))

    // Education is page 26, printed a hundred pages before the rest of these,
    // and filed here because this is where a reader looks for it.
    await expect(funded.filter({ hasText: "Education" })).toHaveCount(1)

    // What the city owes rather than something that spends it, so these stay
    // with the year's own account on the left.
    const year = lists.first().locator("li")
    await expect(year.filter({ hasText: "Debt Service" })).toHaveCount(1)
    await expect(year.filter({ hasText: "Employee Benefits" })).toHaveCount(1)
    await expect(year.filter({ hasText: "Glossary" })).toHaveCount(1)

    // The three lines the Education page covers are gone from both lists.
    const every = page.locator("article > div ol li")
    await expect(every.filter({ hasText: "Net School Spending" })).toHaveCount(0)
    await expect(every.filter({ hasText: "Regional Schools" })).toHaveCount(0)
    await expect(every.filter({ hasText: "School Department" })).toHaveCount(0)
  })

  test("carries capital planning under Projects", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/projects`)

    // A category, not a section: the book's page is under the heading it is
    // printed with, and the page is named for what more of the book will join.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projects")
    await expect(page.getByRole("heading", { name: "Capital Planning" })).toBeVisible()
    await expect(page.getByRole("article")).toContainText("5-Year Capital Requests by Category")

    // The bar's source link opens the book where that section begins.
    expect(await page.locator('header a[href*="#page="]').getAttribute("href")).toMatch(/#page=28$/)

    // And the contents says Projects, not Capital Planning.
    await page.goto(`/budget/${books[0]}`)
    const every = page.locator("article > div ol li")
    await expect(every.filter({ hasText: "Projects" })).toHaveCount(1)
    await expect(every.filter({ hasText: "Capital Planning" })).toHaveCount(0)
  })

  test("puts the three school sections on one page", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/education`)

    // The one that is transcribed, under the heading the book prints over it.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Education")
    await expect(
      page.getByRole("heading", { name: "Net School Spending", exact: true }),
    ).toBeVisible()
    await expect(page.getByRole("article")).toContainText("$167,320,644")

    // The two that are not: the city's own file, opened at the page the book
    // gives them, which is what a contents line does for any unwritten section.
    for (const [title, at] of [
      ["Regional Schools", 150],
      ["School Department", 152],
    ] as const) {
      const link = page.getByRole("link", { name: new RegExp(`^${title}`) })
      expect(await link.getAttribute("href")).toMatch(new RegExp(`#page=${at}$`))
      await expect(link).toHaveAttribute("target", "_blank")
    }
  })

  test("draws both bars to one scale", async ({ page }) => {
    // The point of the chart: $22 million against $176 million, so the
    // reserves are the eighth of the debt that they are rather than a bar the
    // same length drawn beside it.
    await page.goto(`/budget/${books[0]}`)
    const bars = page.locator(".budget-stack .budget-series")

    const drawn = async (bar: ReturnType<typeof bars.nth>) => {
      const boxes = await Promise.all(
        (await bar.getByRole("img").all()).map((segment) => segment.boundingBox()),
      )
      return boxes.reduce((width, box) => width + (box?.width ?? 0), 0)
    }

    const reserves = await drawn(bars.first())
    const debt = await drawn(bars.last())
    expect(reserves / debt).toBeGreaterThan(0.11)
    expect(reserves / debt).toBeLessThan(0.14)
  })

  test("names and prices the segment under the pointer", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    const chart = page.locator(".budget-stack")
    await expect(chart.locator(".budget-tooltip")).toHaveCount(0)

    const held = chart.locator(".budget-series").first().getByRole("img")
    await held.first().hover()
    const tooltip = chart.locator(".budget-tooltip")
    await expect(tooltip).toContainText("Fund Balance")
    await expect(tooltip).toContainText("$13,985,452")
    // Its share of its own bar, not of the scale both bars are drawn to.
    await expect(tooltip).toContainText("63.6%")

    // Hovering a reserve fades the other reserves and leaves the debt alone:
    // the two bars are there to be compared, and fading one defeats that.
    await expect(held.last()).toHaveCSS("opacity", "0.4")
    await expect(chart.locator(".budget-series").last().getByRole("img").first()).toHaveCSS(
      "opacity",
      "1",
    )

    // Reachable without a mouse, like every wedge on this page.
    await chart.locator(".budget-series").last().getByRole("img").first().focus()
    await expect(tooltip).toContainText("School Department")
  })

  test("charts what the sections themselves print", async ({ page }) => {
    // The front page reads these out of the sections' own transcriptions, so
    // the two cannot disagree. This is that claim, end to end.
    await page.goto(`/budget/${books[0]}/fiscal-reserves`)
    await expect(page.getByRole("article")).toContainText("$13,985,452 (7.85%)")

    await page.goto(`/budget/${books[0]}/outstanding-debt`)
    const table = page.getByRole("table").first()
    await expect(table).toContainText("School Department")
    await expect(table).toContainText("$71,517,300")
    // The book prints no headings over these two columns, so neither does the
    // page: the names in the data are what a chart asks for a column by.
    await expect(table.locator("thead")).toHaveCount(0)
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

  test("draws the budget calendar as the page's footer", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // Fixed to the bottom of the window, so it is on screen at the top of the
    // page as well as the end of it.
    const footer = page.locator("article footer")
    await expect(footer).toHaveCSS("position", "fixed")
    // The row is named where the row is: there is no line of chrome above it
    // saying what the boxes are, and no date printed beside that.
    await expect(footer.getByRole("list", { name: "Budget calendar" })).toBeVisible()
    await expect(footer).not.toContainText("Today,")

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

    // The stage the process has reached is the highlighted one. This book's
    // calendar ended at adoption, so that is the last box, and stays so.
    await expect(entries.last()).toContainText("This is where the budget is.")

    // Which is also where the mark sits: at the end of the row, and the mark is
    // now the only thing here that says what day it is.
    await expect(page.locator(".budget-today")).toHaveAttribute("style", "left: 100%")
  })

  test("gives the book's own wording for the step under the pointer", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    const box = page.locator(".budget-timeline li").nth(1)
    await box.hover()

    const detail = page.locator(".budget-detail")
    await expect(detail).toContainText("1/15/26")
    await expect(detail).toContainText("Finance prepared revenue projections")
    await expect(detail).toContainText("assessed debt capacity.")

    // A tooltip: above the box it belongs to, and gone when the pointer is.
    const over = (await detail.boundingBox())!
    const under = (await box.boundingBox())!
    expect(over.y + over.height).toBeLessThanOrEqual(under.y)
    await page.mouse.move(0, 0)
    await expect(detail).toBeHidden()
  })

  test("a contents line with no page here opens the city's PDF at that page", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    // Scoped to the page: the bar's menu of years is a list of links too.
    const outward = page.locator('article li a[href*="#page="]').first()
    await expect(outward).toHaveAttribute("target", "_blank")
    expect(await outward.getAttribute("href")).toMatch(/#page=\d+$/)
  })

  test("a section names itself, and the bar leads back to its book", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/${sections[0]}`)
    await expect(page.getByRole("heading", { level: 1 })).not.toBeEmpty()
    await expect(page.getByRole("article")).not.toBeEmpty()
    // The header link points into the book at this section's own page.
    await expect(page.locator('header a[href*="#page="]')).toHaveCount(1)

    // The way back up, now that no page carries one of its own: the bar's menu
    // of years, which reaches any book from any page.
    const header = page.getByRole("banner")
    await header.getByRole("link", { name: "Budget", exact: true }).hover()
    await header.getByRole("link", { name: `FY${books[0].slice(2)}` }).click()
    await expect(page).toHaveURL(new RegExp(`/budget/${books[0]}$`))
  })

  test("puts nothing above the page but the bar", async ({ page }) => {
    // A book and a section each used to open with a "back" line. The only
    // navigation left on a budget page is the header's own.
    await page.goto(`/budget/${books[0]}/${sections[0]}`)
    await expect(page.getByRole("navigation")).toHaveCount(1)
    await expect(page.getByRole("banner").getByRole("navigation")).toHaveCount(1)
  })

  test("every section the contents links to actually renders", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    const local = await page.locator('article li a:not([href*="#page="])').all()
    const hrefs = await Promise.all(local.map((link) => link.getAttribute("href")))
    expect(hrefs.length).toBe(
      sections.filter((name) => !unlinked.includes(name) && !charted.includes(name)).length,
    )
    for (const href of hrefs) {
      const response = await page.goto(new URL(href!, page.url()).toString())
      expect(response?.status()).toBe(200)
      await expect(page.getByRole("article")).not.toBeEmpty()
    }
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
