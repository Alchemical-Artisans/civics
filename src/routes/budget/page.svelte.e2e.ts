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
 * Sections the book page opens some other way than from its contents: the four
 * a chart's own title links, and the glossary, which every defined term in the
 * city's prose links. A contents line as well would offer the same page twice
 * on one screen.
 */
const linkedElsewhere = ["reserves", "outstanding-debt", "revenue", "spending", "glossary"]

test.describe("budget pages", () => {
  test("the book opens on the budget at a glance, before its contents", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // Two columns on one scale rather than two pies: what the city spends, and
    // what pays for it. The gap between them is the point -- the year does not
    // pay for itself, and $5,150,000 of last year's free cash closes it, which
    // is why free cash is not drawn as revenue.
    const chart = page.locator(".budget-columns")
    const columns = chart.locator(".budget-column")
    await expect(columns).toHaveCount(2)
    await expect(chart).toContainText("Spending")
    await expect(chart).toContainText("$316,044,835")
    await expect(chart).toContainText("Revenue")
    await expect(chart).toContainText("$310,894,835")

    // Each name opens the side of the book its column is drawn from, and is the
    // only way to it: neither has a line in the contents.
    await expect(chart.getByRole("link", { name: "Spending" })).toHaveAttribute(
      "href",
      /\/spending$/,
    )
    await expect(chart.getByRole("link", { name: "Revenue" })).toHaveAttribute("href", /\/revenue$/)

    // Every segment says what it is and what it costs as its accessible name.
    const spending = columns.first().getByRole("img")
    expect(await spending.count()).toBeGreaterThan(5)
    await expect(spending.first()).toHaveAttribute(
      "aria-label",
      "Spending, Education, $147,158,454, 46.6%",
    )
    for (const segment of await spending.all()) {
      expect(await segment.getAttribute("aria-label")).toMatch(/\$[\d,]+/)
    }

    // And the taller column really is the taller one, on one scale.
    const height = async (at: number) =>
      (await columns.nth(at).locator("> div").boundingBox())!.height
    expect(await height(0)).toBeGreaterThan(await height(1))
  })
  test("charts the reserves and the debt above the contents", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // Above the contents, which is where the standing position belongs: the
    // pies beside it are the year, this is what the year sits on.
    await expect(page.getByRole("heading", { name: "Reserves and Debt" })).toBeVisible()

    const chart = page.locator(".budget-stack")
    const bars = chart.locator(".budget-series")
    await expect(bars).toHaveCount(2)
    await expect(bars.first()).toContainText("$21,986,546")
    await expect(bars.last()).toContainText("$175,745,444")

    // Each bar's name is the way into the section it is drawn from, and the
    // only way: neither has a line in the contents below.
    await expect(bars.first().getByRole("link", { name: "Reserves" })).toHaveAttribute(
      "href",
      /\/reserves$/,
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

  test("lists what the city funds, and nothing that has a home elsewhere", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // One list, unheaded: every other section of the book is reached from a
    // chart, the bar, a see-also, or a word in the prose.
    // `> div`, because the calendar in the footer is a list too.
    const lists = page.locator("article > div ol")
    await expect(lists).toHaveCount(1)
    await expect(page.getByRole("heading", { name: "Departments" })).toHaveCount(0)
    await expect(page.getByRole("heading", { name: "Table of Contents" })).toHaveCount(0)

    // One line per thing the city funds, by name rather than by the book's
    // grouping: a reader who wants one of them knows what it is called.
    //
    // `toContainText`, because a line with no page here carries an `sr-only`
    // note saying it opens the city's PDF.
    const funded = lists.locator("li")
    await expect(funded.first()).toContainText("Assessor's Office")
    await expect(funded.last()).toContainText("Veterans Services")

    const named = await funded.evaluateAll((lines) =>
      lines.map((line) => line.textContent?.split(",")[0].trim() ?? ""),
    )
    expect(named).toEqual([...named].sort((a, b) => a.localeCompare(b, "en")))

    // Education is page 26, printed a hundred pages before the rest of these,
    // and filed here because this is where a reader looks for it.
    await expect(funded.filter({ hasText: "Education" })).toHaveCount(1)

    // Nothing the book says about the year itself is in this list any more.
    for (const gone of [
      "Goals",
      "Glossary",
      "Budget in Brief",
      "Debt Service",
      "Fund Accounting",
    ]) {
      await expect(funded.filter({ hasText: gone })).toHaveCount(0)
    }
  })
  test("gathers the revenue sections on one page", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/revenue`)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Revenue")

    // Page 48, the estimates, and page 64, the summary of the same year, which
    // the book prints sixteen pages apart with the forecasts in between.
    await expect(page.getByRole("heading", { name: "2027 Revenue Projection" })).toBeVisible()
    await expect(
      page.getByRole("heading", { name: /^Summary of General Fund Revenue/ }),
    ).toBeVisible()
    await expect(page.getByRole("heading", { name: "Revenue Forecast" })).toBeVisible()

    // Page 67, the ten years after it, and page 79, what it comes to for one
    // household.
    await expect(page.getByRole("heading", { name: "10-Year Revenue Projection" })).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "$245 Estimated Tax Bill Increase" }),
    ).toBeVisible()

    // The bar's source link opens the book where the run begins.
    expect(await page.locator('header a[href*="#page="]').getAttribute("href")).toMatch(/#page=48$/)

    // Neither section has a line in the contents: the pie's heading is the way
    // to both.
    await page.goto(`/budget/${books[0]}`)
    const every = page.locator("article > div ol li")
    await expect(every.filter({ hasText: "Revenue Summary" })).toHaveCount(0)
    await expect(every.filter({ hasText: "Revenue Estimates" })).toHaveCount(0)
  })

  test("opens the spending side from its own chart", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // Both pie headings are links now, each to the side of the book its chart
    // is about, and neither section has a line in the contents.
    await expect(page.getByRole("link", { name: "Spending", exact: true })).toHaveAttribute(
      "href",
      /\/spending$/,
    )
    const every = page.locator("article > div ol li")
    await expect(every.filter({ hasText: "Appropriation Forecast" })).toHaveCount(0)
    await expect(every.filter({ hasText: "Revenue Forecast" })).toHaveCount(0)

    await page.goto(`/budget/${books[0]}/spending`)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spending")

    // The spending side of the book, in its order: what the city wants to
    // build (28), where the spending is going (69), and what departments asked
    // to add to it (72).
    await expect(page.getByRole("heading", { name: "Capital Planning" })).toBeVisible()
    await expect(
      page.getByRole("heading", { name: /^10-Year Appropriation Projection/ }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Summary Department Budget Requests" }),
    ).toBeVisible()
    await expect(page.getByRole("heading", { name: /^Other Budget Reductions/ })).toBeVisible()

    // And the goals the rest of it is an account of, from pages 15 and 16.
    await expect(page.getByRole("heading", { name: "Mayor's 2027 Budgetary Goals" })).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Long-Term Perspective Strategic Goals" }),
    ).toBeVisible()

    // The bar's source link opens the book where the run begins, which is now
    // the goals.
    expect(await page.locator('header a[href*="#page="]').getAttribute("href")).toMatch(/#page=15$/)

    // Three lines of the appropriation itself, which nobody has transcribed:
    // the city's own file, opened at the page the book gives them.
    for (const [title, at] of [
      ["Debt Service", 200],
      ["State Assessments", 209],
      ["Employee Benefits", 211],
      ["Budget Policies", 221],
    ] as const) {
      const link = page.getByRole("link", { name: new RegExp(`^${title}`) })
      expect(await link.getAttribute("href")).toMatch(new RegExp(`#page=${at}$`))
      await expect(link).toHaveAttribute("target", "_blank")
    }

    // None of them keeps a line in the contents.
    await page.goto(`/budget/${books[0]}`)
    for (const gone of [
      "Projects",
      "Capital Planning",
      "Budget Requests",
      "Budget Challenges",
      "Debt Service",
      "State Assessments",
      "Employee Benefits",
      "Budget Policies",
    ]) {
      await expect(page.locator("article > div ol li").filter({ hasText: gone })).toHaveCount(0)
    }
  })

  test("links the reserves and the spending that projects them", async ({ page }) => {
    // The projections for the budget reserve and the excess levy are two rows
    // of the ten-year appropriation forecast, which cannot be lifted out of
    // that table -- so the two pages point at each other instead.
    await page.goto(`/budget/${books[0]}/reserves`)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Reserves")
    await expect(page.getByRole("heading", { name: "Fiscal Reserves" })).toBeVisible()
    await expect(
      page.getByRole("link", { name: /^10-Year Appropriation Forecast/ }),
    ).toHaveAttribute("href", /\/spending$/)

    // The two reserve sections nobody has transcribed, at their own pages.
    for (const [title, at] of [
      ["Liability, Overlay & Reserves", 213],
      ["Financial Reserve Policies", 227],
    ] as const) {
      const link = page.getByRole("link", { name: new RegExp(`^${title.replace("&", "&")}`) })
      expect(await link.getAttribute("href")).toMatch(new RegExp(`#page=${at}$`))
    }

    await page.goto(`/budget/${books[0]}/spending`)
    await expect(page.getByRole("link", { name: /^Fiscal Reserves/ })).toHaveAttribute(
      "href",
      /\/reserves$/,
    )

    // "Fund Accounting" (218) is on the reserves page and the debt page both:
    // it is what says these funds are separate things, and half the debt drawn
    // on the front page is not the general fund's.
    for (const at of ["reserves", "outstanding-debt"]) {
      await page.goto(`/budget/${books[0]}/${at}`)
      const link = page.getByRole("link", { name: /^Fund Accounting/ })
      expect(await link.getAttribute("href")).toMatch(/#page=218$/)
    }

    // Neither reserve section keeps a contents line.
    await page.goto(`/budget/${books[0]}`)
    for (const gone of [
      "Liability, Overlay & Reserves",
      "Financial Reserve Policies",
      "Fund Accounting",
    ]) {
      await expect(page.locator("article > div ol li").filter({ hasText: gone })).toHaveCount(0)
    }
  })

  test("links the book's own terms wherever its prose uses them", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/reserves`)

    // A link to the term's own entry in the glossary, and nothing else: it
    // works with no script, is announced as a link, and a touch reader gets
    // somewhere to go rather than something to dismiss.
    const term = page.locator("a.glossary-term").first()
    await expect(term).toHaveText("fund")
    expect(await term.getAttribute("href")).toMatch(/\/glossary#fund$/)

    // Every use, not only the first: a reader who arrives halfway down a page
    // has not passed the paragraph where the word came up first.
    expect(await page.locator("a.glossary-term").count()).toBeGreaterThan(10)
    expect(await page.locator('a.glossary-term[href$="#fund"]').count()).toBeGreaterThan(1)

    // And it lands on the definition.
    await term.click()
    await expect(page).toHaveURL(new RegExp(`/budget/${books[0]}/glossary#fund$`))
    await expect(page.locator("#fund")).toHaveText("Fund")
  })

  test("carries the whole glossary as a page of its own", async ({ page }) => {
    // Reached from a term in the prose, which is the only way in: a contents
    // line as well would offer the same page twice on one screen.
    await page.goto(`/budget/${books[0]}`)
    await expect(page.locator("article > div ol li").filter({ hasText: "Glossary" })).toHaveCount(0)

    await page.goto(`/budget/${books[0]}/reserves`)
    await page.locator("a.glossary-term").first().click()

    await expect(page).toHaveURL(new RegExp(`/budget/${books[0]}/glossary#`))
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Glossary")
    await expect(page.getByRole("heading", { name: "Glossary of Terms" })).toBeVisible()

    // Every term the book defines, in its order, each with the page's own
    // anchor so a definition can be linked to.
    await expect(page.locator("dt")).toHaveCount(62)
    await expect(page.locator("dt").first()).toHaveText("Abatement")
    await expect(page.locator("dt").last()).toHaveText("Warrant")
    await expect(page.locator("#free-cash")).toHaveText("Free Cash")

    // The bar opens the book where the terms start, not at the divider the
    // contents names.
    expect(await page.locator('header a[href*="#page="]').getAttribute("href")).toMatch(
      /#page=232$/,
    )
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

  test("charts the budget the Council adopted, not the book's proposal", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // The book's $285,272,159 is the Mayor's proposal for the general fund.
    // What the city spends is the eleven functions the Council voted, plus the
    // two enterprise departments the book does not carry at all.
    await expect(page.locator(".budget-columns")).toContainText("$316,044,835")

    const wedges = page.locator(".budget-column").first().getByRole("img")
    const labels = await wedges.evaluateAll((w) => w.map((el) => el.getAttribute("aria-label")))
    expect(labels.some((l) => l?.includes("Wastewater Department, $15,967,043"))).toBe(true)
    expect(labels.some((l) => l?.includes("Water Department, $14,805,633"))).toBe(true)

    // Charged to the city rather than chosen by it -- the Commonwealth's bill
    // for charter school tuition, the MBTA and the rest, and the assessors'
    // overlay for the abatements the year will grant -- but spent either way,
    // so the chart carries them.
    expect(labels.some((l) => l?.includes("State Assessments, $10,271,435"))).toBe(true)
    expect(labels.some((l) => l?.includes("Overlay, $250,000"))).toBe(true)

    // The other side of the same budget: the book's sixteen sources, with what
    // the two departments are billed beside them, net of what those orders
    // transfer into the general fund and the book already counts.
    const sources = page.locator(".budget-column").last().getByRole("img")
    const income = await sources.evaluateAll((w) => w.map((el) => el.getAttribute("aria-label")))
    expect(income.some((l) => l?.includes("TAX LEVY, $146,107,374"))).toBe(true)
    expect(income.some((l) => l?.includes("CH 70 STATE AID, $96,427,042"))).toBe(true)
    expect(income.some((l) => l?.includes("Wastewater Revenue, $15,967,043"))).toBe(true)
    expect(income.some((l) => l?.includes("Water Revenue, $14,805,633"))).toBe(true)

    // And the high-level view says none of that: the spending page does, in
    // the city's own words.
    await expect(page.getByRole("heading", { name: /^Appropriated by the Council/ })).toHaveCount(0)
  })

  test("says on the spending page what the chart leaves out", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/spending`)

    // The orders themselves, quoted as the agenda words them.
    await expect(page.getByRole("heading", { name: "What the Council appropriated" })).toBeVisible()
    const article = page.getByRole("article")
    await expect(article).toContainText("be appropriated to operate the Water Department")
    await expect(article).toContainText("$15, 967,043")
    await expect(article).toContainText("$ 274,750,725")
    await expect(article).toContainText("Taxation and Other Receipts")

    // And why the two totals differ.
    await expect(article).toContainText("state assessments")
    await expect(article).toContainText("tax rate recapitulation sheet")

    // The order is linked in the bar beside the book.
    const source = page.getByRole("banner").getByRole("link", { name: /^City Council Order/ })
    expect(await source.getAttribute("href")).toMatch(/full-agenda-6226\.pdf$/)
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
    await page.goto(`/budget/${books[0]}/reserves`)
    await expect(page.getByRole("article")).toContainText("$13,985,452 (7.85%)")

    await page.goto(`/budget/${books[0]}/outstanding-debt`)
    const table = page.getByRole("table").first()
    await expect(table).toContainText("School Department")
    await expect(table).toContainText("$71,517,300")
    // The book prints no headings over these two columns, so neither does the
    // page: the names in the data are what a chart asks for a column by.
    await expect(table.locator("thead")).toHaveCount(0)
  })

  test("names and prices the column segment under the pointer", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    const chart = page.locator(".budget-columns")
    await chart.locator(".budget-column").first().getByRole("img").first().hover()

    const tooltip = chart.locator(".budget-tooltip")
    await expect(tooltip).toContainText("Education")
    await expect(tooltip).toContainText("$147,158,454")
    await expect(tooltip).toContainText("46.6%")
  })
  test("reaches the segment no mouse can hit with the keyboard", async ({ page }) => {
    // The overlay is $250,000 of $316 million, a couple of pixels tall. Focus
    // is the only way to it, which is why every segment takes focus.
    await page.goto(`/budget/${books[0]}`)
    const chart = page.locator(".budget-columns")
    await chart.locator(".budget-column").first().getByRole("img").last().focus()
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
      sections.filter((name) => !unlinked.includes(name) && !linkedElsewhere.includes(name)).length,
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
