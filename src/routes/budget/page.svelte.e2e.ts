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
const linkedElsewhere = ["reserves", "debt", "revenue", "spending", "glossary"]

/**
 * The calendar's link to the city's own file, which is on every page of a book.
 *
 * It used to be "Original Source" in the bar at the top. The bar could say only
 * that the page came from somewhere; the box says which step of the year
 * produced it, and it opens the book at whatever page the reader is on.
 */
const bookPdf = (page: import("@playwright/test").Page) =>
  page.locator(".budget-timeline li").filter({ hasText: "Final review" }).getByRole("link")

/**
 * `spending`'s seven topics, each its own route now rather than a tab a
 * script switched -- content elsewhere in the suite goes straight to one
 * rather than opening it first. `BookReferences` is one of the seven now,
 * `references`, rather than sitting in the shared layout under all of them.
 */
const spendingUrl = (slug: string) => `/budget/${books[0]}/spending/${slug}`

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
    await expect(chart).toContainText("$310,893,296")

    // Each name opens the side of the book its column is drawn from, and is the
    // only way to it: neither has a line in the contents. Spending's own
    // link goes straight to its first topic -- there is no bare `/spending`
    // page any more, only the five beneath it.
    await expect(chart.getByRole("link", { name: "Spending" })).toHaveAttribute(
      "href",
      /\/spending\/goals-recommendations$/,
    )
    await expect(chart.getByRole("link", { name: "Revenue" })).toHaveAttribute("href", /\/revenue$/)

    // Every segment says what it is and what it costs as its accessible name.
    const spending = columns.first().getByRole("img")
    expect(await spending.count()).toBeGreaterThan(5)
    await expect(spending.first()).toHaveAttribute(
      "aria-label",
      "Spending, School Department, $136,998,618, 43.3%",
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
    await expect(bars.last().getByRole("link", { name: "Debt" })).toHaveAttribute("href", /\/debt$/)
    // The two-column contents list specifically, not `article ol li` broadly
    // -- the budget calendar in the footer is inside the same `<article>` and
    // has its own `<li>`s, one of which happens to mention "debt capacity".
    const contents = page.locator("article > div ol li")
    await expect(contents.filter({ hasText: "Fiscal Reserves" })).toHaveCount(0)
    await expect(contents.filter({ hasText: "Debt" })).toHaveCount(0)

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

  test("is one screen, with only the list scrolling", async ({ page }) => {
    // The charts are the answer the page exists to give, and a reader working
    // down thirty-four department names is the reader who wants them still in
    // view. So the page does not scroll: the list does.
    await page.setViewportSize({ width: 1280, height: 700 })
    await page.goto(`/budget/${books[0]}`)

    const moved = await page.evaluate(() => {
      window.scrollTo(0, 5000)
      const at = window.scrollY
      window.scrollTo(0, 0)
      return at
    })
    expect(moved).toBe(0)

    const list = page.locator("article div.lg\\:overflow-y-auto")
    expect(await list.evaluate((box) => box.scrollHeight - box.clientHeight)).toBeGreaterThan(50)

    // Below `lg` it is a page again, and scrolls as one.
    await page.setViewportSize({ width: 390, height: 800 })
    await page.reload()
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight),
    ).toBeGreaterThan(200)
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

    // One line per thing the city funds, priced and ordered by what it costs:
    // the schools are more than eight times the police and the senior center is
    // $14,500, and the list says so without the reader opening anything.
    //
    // `toContainText`, because a line with no page here carries an `sr-only`
    // note saying it opens the city's PDF.
    const funded = lists.locator("li")
    await expect(funded).toHaveCount(33)
    await expect(funded.first()).toContainText("Education")
    await expect(funded.first()).toContainText("$147,158,454")
    await expect(funded.last()).toContainText("Senior Center")
    await expect(funded.last()).toContainText("$14,500")

    // Every line carries a figure, and they run down the page in order.
    const priced = await funded.evaluateAll((lines) =>
      lines.map((line) => Number(line.textContent?.match(/\$([\d,]+)/)?.[1].replace(/,/g, ""))),
    )
    expect(priced).toHaveLength(33)
    expect(priced.every((money) => money > 0)).toBe(true)
    expect(priced).toEqual([...priced].sort((a, b) => b - a))

    // "Finance Division" is a divider page -- three office names and the
    // division's staff, no budget of its own -- and the three offices under it
    // are each here with their own figure.
    await expect(funded.filter({ hasText: "Finance Division" })).toHaveCount(0)
    for (const office of ["Auditor's Office", "Treasurer's & Collector's Office"]) {
      await expect(funded.filter({ hasText: office })).toHaveCount(1)
    }

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

    // The calendar's own link to the book opens it where the run begins.
    expect(await bookPdf(page).getAttribute("href")).toMatch(/#page=48$/)

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
    // is about, and neither section has a line in the contents. Spending's
    // own link goes straight to its first topic -- there is no bare
    // `/spending` page any more, only the five beneath it.
    await expect(page.getByRole("link", { name: "Spending", exact: true })).toHaveAttribute(
      "href",
      /\/spending\/goals-recommendations$/,
    )
    const every = page.locator("article > div ol li")
    await expect(every.filter({ hasText: "Appropriation Forecast" })).toHaveCount(0)
    await expect(every.filter({ hasText: "Revenue Forecast" })).toHaveCount(0)

    await page.goto(spendingUrl("goals-recommendations"))
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spending")

    // The spending side of the book, in its order: what the city wants to
    // build (28) and what departments asked to add to the budget (72). Where
    // the spending is going (69) is not here any more -- it is a forecast, and
    // this page is about 2027. Each topic is its own route now, so going to it
    // is what puts it on the page at all, rather than merely visible.
    await page.goto(spendingUrl("capital-planning"))
    await expect(page.getByRole("article")).toContainText("five-year capital requests exceed")
    await expect(
      page.getByRole("heading", { name: /^10-Year Appropriation Projection/ }),
    ).toHaveCount(0)

    await page.goto(spendingUrl("requests"))
    await expect(page.getByRole("article")).toContainText("Non-Union Step Increase")
    await page.goto(spendingUrl("challenges"))
    await expect(
      page.getByRole("heading", { name: "Major Budget Driver - Group Health Insurance" }),
    ).toBeVisible()

    // And the goals the rest of it is an account of, from pages 15 and 16 --
    // the topic this page's own chart opens on, but this test has gone to two
    // others by now.
    await page.goto(spendingUrl("goals-recommendations"))
    await expect(page.getByRole("heading", { name: "Mayor's 2027 Budgetary Goals" })).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Long-Term Perspective Strategic Goals" }),
    ).toBeVisible()

    // Page 73's own lead-in and close of "Other Budget Reductions" moved
    // here from Challenges: the book's linear run bracketed the challenges
    // with them because a straight run of pages had nowhere else to put
    // them, but they are goals and their resolution, not a challenge, so
    // Challenges opens and closes without either sitting in front of the
    // cuts it explains.
    await expect(
      page.getByRole("heading", { name: "Preliminary Budget Goals for Fiscal 2027" }),
    ).toBeVisible()
    await expect(page.getByRole("heading", { name: "Final Recommendations" })).toBeVisible()
    await page.goto(spendingUrl("challenges"))
    await expect(
      page.getByRole("heading", { name: "Preliminary Budget Goals for Fiscal 2027" }),
    ).toHaveCount(0)
    await expect(page.getByRole("heading", { name: "Final Recommendations" })).toHaveCount(0)

    // The calendar's link to the book opens it where the run begins, which is
    // now the goals.
    expect(await bookPdf(page).getAttribute("href")).toMatch(/#page=15$/)

    // Three lines of the appropriation itself, which nobody has transcribed:
    // the city's own file, opened at the page the book gives them -- on
    // References now, not merely visible from wherever the reader was.
    await page.goto(spendingUrl("references"))
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

  test("charts the spending page's own bar", async ({ page }) => {
    await page.goto(spendingUrl("capital-planning"))

    // The same bar the front page draws for "Spending", one column of it --
    // and with no link back to a page it is already on, unlike the front
    // page's own. It is in the shared layout, present on every topic's route,
    // not particular to this one.
    const bar = page.locator(".budget-columns").first()
    await expect(bar.locator(".budget-column")).toHaveCount(1)
    await expect(bar).toContainText("Spending")
    await expect(bar).toContainText("$316,044,835")
    await expect(bar.getByRole("link", { name: "Spending" })).toHaveCount(0)

    const segment = bar.getByRole("img").first()
    await segment.focus()
    await expect(bar).toContainText("School Department")

    // Page 29's own 5-year chart is gone with the rest of the site's
    // forecasts, along with the two projects it left out of 2028 -- only the
    // single `.budget-columns` bar above remains on this page.
    await expect(
      page.getByRole("heading", { name: "5-Year Capital Requests by Category" }),
    ).toHaveCount(0)
    await expect(page.locator(".budget-columns")).toHaveCount(1)
    await expect(page.getByRole("article")).not.toContainText("Excluded from 2028")
  })

  test("tabs the seven capital-request tables in place, on script alone", async ({ page }) => {
    await page.goto(spendingUrl("capital-planning"))

    // Scoped to the tabbed table group itself: "Vehicles" and most of the
    // other six category names are repeated below as `<h3>`s over the
    // 2027 write-ups, which answer to none of this tab set.
    const tables = page.locator(".tables")

    // Seven tabs, Buildings open on arrival -- and only Buildings: the other
    // six tables are not merely scrolled away, they are out of the
    // accessibility tree entirely until their own tab is opened. This is a
    // script switch, not a route -- seven tables of one dataset are facets
    // of one topic rather than seven of their own, unlike the routes above.
    // "Planning & Design" is not among them: trimmed to 2027 it has nothing
    // to show, so it is left out rather than kept as an empty tab.
    await expect(tables.getByRole("tab")).toHaveCount(7)
    await expect(
      tables.getByRole("tab", { name: "Buildings & Building Improvements" }),
    ).toHaveAttribute("aria-selected", "true")
    await expect(tables.getByRole("heading", { name: "Vehicles", exact: true })).toHaveCount(0)
    await expect(tables.getByRole("row", { name: /^Trash Truck - Highway/ })).toHaveCount(0)

    // Left/Right move between tabs and select the one moved to, Home/End
    // jump to the ends -- the same keyboard pattern the five routes above
    // used before they were routes. Tested from Buildings' own starting
    // focus, since the component moves relative to the *selected* tab, not
    // merely the focused one, and clicking ahead first would leave the two
    // apart.
    await tables.getByRole("tab", { name: "Buildings & Building Improvements" }).focus()
    await page.keyboard.press("ArrowRight")
    await expect(tables.getByRole("tab", { name: "Computer Equipment" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    await expect(tables.getByRole("tab", { name: "Computer Equipment" })).toBeFocused()
    await page.keyboard.press("End")
    await expect(tables.getByRole("tab", { name: "Vehicles" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    await page.keyboard.press("Home")
    await expect(
      tables.getByRole("tab", { name: "Buildings & Building Improvements" }),
    ).toHaveAttribute("aria-selected", "true")

    // Opening a tab by pointer is what puts its table on the page, and
    // closes Buildings the same way.
    await tables.getByRole("tab", { name: "Vehicles" }).click()
    await expect(tables.getByRole("tab", { name: "Vehicles" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    await expect(
      tables.getByRole("tab", { name: "Buildings & Building Improvements" }),
    ).toHaveAttribute("aria-selected", "false")
    await expect(tables.getByRole("heading", { name: "Vehicles", exact: true })).toBeVisible()
    await expect(tables.getByRole("row", { name: /^Trash Truck - Highway/ })).toBeVisible()
    await expect(
      tables.getByRole("heading", { name: "Buildings & Building Improvements" }),
    ).toHaveCount(0)

    // The book's own per-year grand total sits at the foot of the last
    // table, where the book prints it -- not scoped to "Vehicles", but
    // reachable from it since that is where the page run it came off ends.
    await expect(tables.getByRole("row", { name: /^Grand Total/ })).toContainText("$17,219,620")
  })

  test("keeps all seven capital-request tables on the page without script", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const noscript = await context.newPage()
    await noscript.goto(spendingUrl("capital-planning"))

    // Hidden markup rather than markup that is not there: a reader who never
    // hydrates gets every table, stacked, and no tab bar to click that would
    // not do anything anyway.
    await expect(noscript.getByRole("tab")).toHaveCount(0)
    const tables = noscript.locator(".tables")
    for (const heading of [
      "Buildings & Building Improvements",
      "Computer Equipment",
      "Computer Software",
      "Equipment",
      "Infrastructure",
      "Land & Land Improvements",
      "Vehicles",
    ]) {
      await expect(tables.getByRole("heading", { name: heading, exact: true })).toBeVisible()
    }
    await expect(tables.getByRole("heading", { name: "Planning & Design" })).toHaveCount(0)

    await context.close()
  })

  test("links a table row to its own capital-request page where the book gives one", async ({
    page,
  }) => {
    await page.goto(spendingUrl("capital-planning"))
    const tables = page.locator(".tables")

    // A row is a link into its own page, pages 36 to 45's case for it -- the
    // category's own total at the foot of each table is not a project and
    // has no page of its own to link to.
    const link = tables.getByRole("link", { name: "City Hall Elevator Rehabilitation" })
    await expect(link).toHaveAttribute(
      "href",
      /\/spending\/capital-planning\/city-hall-elevator-rehabilitation$/,
    )
    await expect(
      tables.getByRole("rowheader", { name: "Buildings & Building Improvements Total" }),
    ).toBeVisible()
    await expect(
      tables.getByRole("link", { name: "Buildings & Building Improvements Total" }),
    ).toHaveCount(0)

    // The link opens the write-up itself: the case, the urgency, the figure
    // -- the same content that used to run in one long "2027 Capital
    // Requests" section, now on its own page per project.
    await link.click()
    await expect(page).toHaveURL(
      new RegExp(`${spendingUrl("capital-planning")}/city-hall-elevator-rehabilitation$`),
    )
    await expect(
      page.getByRole("heading", { name: "City Hall Elevator Rehabilitation" }),
    ).toBeVisible()
    const article = page.getByRole("article")
    await expect(article).toContainText("rehab and update the 50 year-old City Hall Elevator")
    await expect(article).toContainText("High — $130,000")

    // Still under Capital Planning as far as the nav is concerned, one
    // level deeper than the five topics it sits below.
    await expect(page.getByRole("link", { name: "Capital Planning" })).toHaveAttribute(
      "aria-current",
      "page",
    )

    // The book spells this project two different ways on its two different
    // pages -- "Highway Administration Roof Replacement" in the summary
    // table, "Admin. Roof Replacement - Highway" in its own write-up -- and
    // both stay exactly as the book prints them, on the page each belongs
    // to; the route is built from the table's own label, the one a reader
    // actually clicks.
    await page.goto(spendingUrl("capital-planning"))
    await tables.getByRole("link", { name: "Highway Administration Roof Replacement" }).click()
    await expect(page).toHaveURL(
      new RegExp(`${spendingUrl("capital-planning")}/highway-administration-roof-replacement$`),
    )
    await expect(
      page.getByRole("heading", { name: "Admin. Roof Replacement - Highway" }),
    ).toBeVisible()
  })

  test("stands each capital-request page on its own without script", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const noscript = await context.newPage()
    await noscript.goto(`${spendingUrl("capital-planning")}/city-hall-elevator-rehabilitation`)
    await expect(
      noscript.getByRole("heading", { name: "City Hall Elevator Rehabilitation" }),
    ).toBeVisible()
    await expect(noscript.getByRole("article")).toContainText("High — $130,000")
    await context.close()
  })

  test("splits spending into one route per topic, linked by a plain nav", async ({ page }) => {
    await page.goto(spendingUrl("goals-recommendations"))

    // Seven links, in the book's own order, `aria-current` marking the one
    // the reader is on -- and only Goals & Recommendations is on the page at
    // all: Capital Planning is not merely hidden, its content is not in the
    // DOM until its own route is. It carries no heading of its own -- the
    // nav link already says "Capital Planning" -- so its own prose is what
    // stands in for one here.
    const nav = page.getByRole("navigation", { name: "Spending" })
    await expect(nav.getByRole("link")).toHaveCount(7)
    await expect(nav.getByRole("link", { name: "Goals & Recommendations" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    await expect(nav.getByRole("link", { name: "Capital Planning" })).not.toHaveAttribute(
      "aria-current",
    )
    await expect(page.getByRole("heading", { name: "Mayor's 2027 Budgetary Goals" })).toBeVisible()
    await expect(page.getByRole("article")).not.toContainText("five-year capital requests exceed")

    // Following the link is what puts Capital Planning on the page, and
    // Goals & Recommendations off it -- an ordinary navigation, not a
    // script swapping panels.
    await nav.getByRole("link", { name: "Capital Planning" }).click()
    await expect(page).toHaveURL(new RegExp(`${spendingUrl("capital-planning")}$`))
    await expect(nav.getByRole("link", { name: "Capital Planning" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    await expect(nav.getByRole("link", { name: "Goals & Recommendations" })).not.toHaveAttribute(
      "aria-current",
    )
    await expect(page.getByRole("article")).toContainText("five-year capital requests exceed")
    await expect(page.getByRole("heading", { name: "Mayor's 2027 Budgetary Goals" })).toHaveCount(0)

    // References is not on this page at all any more -- it is its own
    // topic now, last in the nav, not a fixture under every other one. It
    // carries no heading either, for the same reason Capital Planning does
    // not: the nav link already says "References".
    await expect(page.getByRole("link", { name: "Fiscal Reserves" })).toHaveCount(0)
    await nav.getByRole("link", { name: "References" }).click()
    await expect(page).toHaveURL(new RegExp(`${spendingUrl("references")}$`))
    await expect(page.getByRole("link", { name: "Fiscal Reserves" })).toBeVisible()

    // The spending bar in the left column answers to none of this: it is
    // outside the nav entirely, the same on every one of the seven routes.
    await expect(page.locator(".budget-columns").first()).toContainText("$316,044,835")
  })

  test("stands each spending topic on its own page, reachable without script", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const noscript = await context.newPage()

    // An ordinary prerendered page per topic now, not a panel a script
    // showed -- so a reader with no script at all reaches every one of them
    // directly, the same as any other write-up on the site, and the nav
    // between them is plain links rather than a control that needs script to
    // do anything.
    for (const [slug, heading] of [
      ["goals-recommendations", "Mayor's 2027 Budgetary Goals"],
      ["challenges", "Major Budget Driver - Group Health Insurance"],
      ["council-orders", "What the Council appropriated"],
    ] as const) {
      await noscript.goto(spendingUrl(slug))
      await expect(noscript.getByRole("heading", { name: heading })).toBeVisible()
      await expect(noscript.getByRole("tab")).toHaveCount(0)
    }

    // Requests, Capital Planning, Departments and References carry no
    // heading of their own at all -- redundant with the tab each is already
    // on -- so each is checked by its own content instead.
    for (const [slug, text] of [
      ["requests", "Non-Union Step Increase"],
      ["capital-planning", "five-year capital requests exceed"],
      ["departments", "School Department"],
      ["references", "Fiscal Reserves"],
    ] as const) {
      await noscript.goto(spendingUrl(slug))
      await expect(noscript.getByRole("article")).toContainText(text)
      await expect(noscript.getByRole("tab")).toHaveCount(0)
    }

    await context.close()
  })

  test("tables the same departments the spending bar charts, for the segments too small to read", async ({
    page,
  }) => {
    await page.goto(spendingUrl("departments"))

    // The same forty-two rows the bar draws, largest first -- a reader who
    // wants Senior Center's $14,500 without hunting for the sliver that
    // carries it on the chart gets it read off a row instead.
    const rows = page.getByRole("row")
    await expect(rows).toHaveCount(44) // header row, 42 departments, Total.
    const first = rows.nth(1)
    await expect(first).toContainText("School Department")
    await expect(first).toContainText("$136,998,618")

    // Water and Wastewater are on it too -- the same two enterprise funds
    // the bar carries and the book does not -- and the overlay is "Other",
    // the department table's own name for it, not "Overlay".
    await expect(
      page.getByRole("rowheader", { name: "Water Department", exact: true }),
    ).toBeVisible()
    await expect(page.getByRole("rowheader", { name: "Wastewater Department" })).toBeVisible()
    await expect(page.getByRole("rowheader", { name: "Other", exact: true })).toBeVisible()
    await expect(page.getByRole("rowheader", { name: "Overlay" })).toHaveCount(0)

    // The smallest figure on the chart, spelled out rather than hovered or
    // focused for.
    const senior = page.getByRole("row", { name: /Senior Center/ })
    await expect(senior).toContainText("$14,500")

    // The same total the bar states, not the sum of the rows above it -- a
    // dollar apart, the same dollar the bar and the book's own department
    // table disagree by.
    await expect(page.getByRole("row", { name: /^Total/ })).toContainText("$316,044,835")
  })

  test("links the reserves and the spending it pays for", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/reserves`)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Reserves")

    // Fiscal Reserves headed the whole run when the reading was one straight
    // column; now each policy heads its own collapsed section, and a heading
    // naming the run as well would say the same thing twice.
    await expect(page.getByRole("heading", { name: "Fiscal Reserves" })).toHaveCount(0)

    // The ten-year projection was listed here, because two of its rows project
    // these balances. It is not any more: this page is what the city holds
    // now, and a forecast is not that.
    await expect(page.getByRole("link", { name: /Appropriation Projection/ })).toHaveCount(0)

    // Every page of the book this one was built out of, then the pages the book
    // keeps the rest of the subject on -- the whole of it under "References",
    // which was "Elsewhere in the book" while it held only the second half.
    await expect(page.getByRole("heading", { name: "References" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Elsewhere in the book" })).toHaveCount(0)

    // Three pages transcribed now, not four: "Fund Balance" (18) defined a
    // term rather than stating a policy, so it carries no section -- and no
    // reference -- of its own here any more.
    await expect(page.getByRole("link", { name: /^Fund Balance/ })).toHaveCount(0)

    for (const [title, at] of [
      ["Fiscal Reserves", 17],
      ["Free Cash", 19],
      ["Stabilization Reserve", 20],
      // 228, not the 227 its contents line gives: 227 is a title page with
      // nothing on it but the words, and Reserve Policy 2 is on 228.
      ["Financial Reserve Policies", 228],
      ["Liability, Overlay & Reserves", 213],
    ] as const) {
      const link = page.getByRole("link", { name: new RegExp(`^${title.replace("&", "&")}`) })
      expect(await link.getAttribute("href")).toMatch(new RegExp(`#page=${at}$`))
    }

    await page.goto(spendingUrl("references"))
    await expect(page.getByRole("link", { name: /^Fiscal Reserves/ })).toHaveAttribute(
      "href",
      /\/reserves$/,
    )

    // "Fund Accounting" (218) is on the reserves page and the debt page both:
    // it is what says these funds are separate things, and half the debt drawn
    // on the front page is not the general fund's.
    for (const at of ["reserves", "debt"]) {
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

  test("carries the reserve policy the book's own section leaves out", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/reserves`)
    const article = page.getByRole("article")
    const details = article.locator("details")

    // Pages 17 to 20 run #1, #3, #4 and skip #2, which reads as a policy that
    // went missing. It is not missing: it is the one of the four with no dial
    // to draw, being what has to happen when the fund balance falls out of the
    // bottom of #1's band rather than a band of its own. The book states it on
    // page 228, and that is where this is quoted from. `toContainText` reads
    // the DOM regardless of what a closed `<details>` hides on screen, which
    // is what lets this check run before any section is opened.
    await expect(article).toContainText(
      "In the event that the city's undesignated fund balance falls below 5%",
    )
    await expect(article).toContainText(
      "shall be submitted to the City Council during the next budget cycle",
    )

    // Four sections, in the book's own order -- #2 is the second of them,
    // right after #1, because it is #1's consequence.
    await expect(details).toHaveCount(4)
    await expect(details.nth(0)).toContainText("The City shall maintain an undesignated")
    await expect(details.nth(1)).toContainText("In the event that the city's undesignated")
    await expect(details.nth(2)).toContainText("The amount to be held in")

    // Neither of the book's own two labels for this policy is printed any
    // more -- the summary above carries its own "Policy #2" instead, in one
    // voice with the other three.
    await expect(article).not.toContainText("City Reserve Policy #")
    await expect(article).not.toContainText("Reserve Policy 2:")
  })

  test("opens each reserve policy on its standing, closed until asked for", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/reserves`)
    const details = page.getByRole("article").locator("details")

    // Four sections, all closed on arrival -- the column a reader lands on is
    // four one-line answers, not four paragraphs to scroll past.
    for (const section of await details.all()) {
      expect(await section.getAttribute("open")).toBeNull()
    }

    // Each summary carries its own running count -- ours, not the book's two
    // disagreeing labels -- names the fund, prices it exactly as the dial
    // beside it does, and says in words the same thing the chart says in a
    // bar's length, computed from the same figures so the two can not
    // disagree. Free cash is the one of the four below its floor this year.
    const summaries = details.locator("summary")
    await expect(summaries.nth(0)).toContainText("Policy #1")
    await expect(summaries.nth(0)).toContainText("Undesignated Fund Balance")
    await expect(summaries.nth(0)).toContainText("$13,985,452 (7.85%)")
    await expect(summaries.nth(0)).toContainText("Within policy")

    await expect(summaries.nth(1)).toContainText("Policy #2")
    await expect(summaries.nth(1)).toContainText("Fund Balance Floor")
    await expect(summaries.nth(1)).toContainText("Not triggered")

    await expect(summaries.nth(2)).toContainText("Policy #3")
    await expect(summaries.nth(2)).toContainText("Free Cash")
    await expect(summaries.nth(2)).toContainText("$0 (0%)")
    await expect(summaries.nth(2)).toContainText("Below floor")

    await expect(summaries.nth(3)).toContainText("Policy #4")
    await expect(summaries.nth(3)).toContainText("Stabilization Reserve")
    await expect(summaries.nth(3)).toContainText("$8,001,094 (4.49%)")
    await expect(summaries.nth(3)).toContainText("Within policy")

    // A native disclosure: nothing but a click on the summary is what reveals
    // the policy's own words -- which open on the policy itself now, the
    // book's own numbering label no longer printed above them.
    const body = details.nth(2).getByText(/^The amount to be held in/)
    await expect(body).toBeHidden()
    await summaries.nth(2).click()
    await expect(body).toBeVisible()
  })

  test("opens each debt policy on its standing, the same as reserves", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/debt`)
    const details = page.getByRole("article").locator("details")

    // Three policies, not four -- the book states #1, #2a and #2b, and there
    // is no #2 of its own the way reserves' is a use for the label.
    await expect(details).toHaveCount(3)
    for (const section of await details.all()) {
      expect(await section.getAttribute("open")).toBeNull()
    }

    // Each summary carries a limit's worth of standing in a percentage rather
    // than a dollar figure, since the book gives none of these a base in
    // dollars the way a reserve dial's floor and ceiling have one. Two of the
    // three are inside their policy; retiring debt is not, which is the
    // book's own "not currently on track" read as a mark rather than a
    // sentence.
    const summaries = details.locator("summary")
    await expect(summaries.nth(0)).toContainText("Policy #1")
    await expect(summaries.nth(0)).toContainText("Long Term Debt")
    await expect(summaries.nth(0)).toContainText("1.5%")
    await expect(summaries.nth(0)).toContainText("Within policy")

    await expect(summaries.nth(1)).toContainText("Policy #2")
    await expect(summaries.nth(1)).toContainText("Annual Debt Payments")
    await expect(summaries.nth(1)).toContainText("3.1%")
    await expect(summaries.nth(1)).toContainText("Within policy")

    await expect(summaries.nth(2)).toContainText("Policy #3")
    await expect(summaries.nth(2)).toContainText("Retiring Debt")
    await expect(summaries.nth(2)).toContainText("59%")
    await expect(summaries.nth(2)).toContainText("Below floor")

    const body = details.nth(0).getByText(/^In accordance with MGL c\.58 s\.10c/)
    await expect(body).toBeHidden()
    await summaries.nth(0).click()
    await expect(body).toBeVisible()
  })

  test("opens the bond rating on the page its quotes are on", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/debt`)

    // The card, not a transcription: the rating itself and the book's own
    // attribution line, nothing quoted from S&P.
    const rating = page.getByRole("link", { name: /^Bond Rating/ })
    await expect(rating).toContainText("AA")
    await expect(rating).toContainText("S&P Global Ratings April 1, 2026")
    await expect(rating).toHaveAttribute("href", /#page=23$/)
    await expect(rating).toHaveAttribute("target", "_blank")

    // Neither the quotes nor a second link to the same page survive: the
    // card is the only way to page 23 now.
    await expect(page.getByRole("article")).not.toContainText("Haverhill's creditworthiness")
    await expect(page.getByRole("link", { name: /^Bond Rating/ })).toHaveCount(1)
  })

  test("charts what the debt page is made of", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/debt`)

    // The composition bar: every purpose the book lists, on hover or focus
    // exactly as the reserve dials are.
    const composition = page.locator(".budget-debt-bar [role='img']")
    await expect(composition).toHaveCount(6)
    await composition.last().focus()
    await expect(page.locator(".budget-debt-bar .budget-tooltip")).toContainText("Public Works")
  })

  test("draws each reserve against the policy it answers to", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/reserves`)

    // One column per policy, named as the book's own dial table heads it. The
    // three figures the book prints for it are not on the page until a reader
    // asks for them, which is what the rest of this test does.
    const chart = page.locator(".budget-bands")
    const rails = page.locator(".budget-band")
    const names = chart.locator("p")

    await expect(rails).toHaveCount(3)
    await expect(names.nth(0)).toHaveText("Undesignated Fund Balance")
    await expect(names.nth(1)).toHaveText("Free Cash")
    await expect(names.nth(2)).toHaveText("Stabilization Reserve")

    // The middle column is this year: nothing held, and a floor of $3,565,232
    // it does not reach. The bar draws no height, and the band it falls short
    // of does -- which is the whole of what the chart has to say.
    const held = await rails.nth(1).locator("div").last().boundingBox()
    const allowed = (await rails.nth(1).locator("div").first().boundingBox())!
    expect(held?.height ?? 0).toBe(0)
    expect(allowed.height).toBeGreaterThan(0)

    // One scale across all three, which is what the shared denominator buys:
    // the same inch of height is the same money in every column.
    const scale = await rails.evaluateAll((each) =>
      each.map((rail) => Math.round(rail.getBoundingClientRect().height)),
    )
    expect(new Set(scale).size).toBe(1)

    // Bars rise from the foot of the rail, so the taller bar is the bigger
    // balance and nothing is measured from anywhere but zero.
    const feet = await rails.evaluateAll((each) =>
      each.map((rail) => Math.round(rail.getBoundingClientRect().bottom)),
    )
    expect(new Set(feet).size).toBe(1)

    // Everything the chart draws is in the column's accessible name, so a
    // reader who never hovers anything still gets the three figures.
    await expect(rails.nth(1)).toHaveAttribute(
      "aria-label",
      /Free Cash: Anticipated \$0 \(0%\), Minimum \$3,565,232, Maximum \$14,260,927/,
    )
  })

  test("names and prices the column under the pointer", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/reserves`)
    const chart = page.locator(".budget-bands")
    await expect(chart.locator(".budget-tooltip")).toHaveCount(0)

    await chart.locator(".budget-band").first().hover()
    const tooltip = chart.locator(".budget-tooltip")
    await expect(tooltip).toContainText("Undesignated Fund Balance")
    await expect(tooltip).toContainText("Actual $13,985,452 (7.85%)")
    await expect(tooltip).toContainText("Minimum $8,913,079")
    await expect(tooltip).toContainText("Maximum $26,739,238")

    await page.mouse.move(0, 0)
    await expect(tooltip).toBeHidden()

    // Reachable without a mouse, like every mark on these pages. The third
    // policy sets no ceiling, so its tooltip prints no maximum.
    await chart.locator(".budget-band").last().focus()
    await expect(tooltip).toContainText("Stabilization Reserve")
    await expect(tooltip).toContainText("Minimum Balance $5,347,848 (3%)")
    await expect(tooltip).not.toContainText("Maximum")
  })

  test("lays the reserves page out as one screen", async ({ page }) => {
    // The same shape as the book's front page: the charts down the left and
    // across the top, and the reading under them in the only box that scrolls.
    // A reader working down four sections of the city's prose is the reader who
    // wants to know whether each fund is inside its band. A shorter viewport
    // than the front page's own test needs, now that the page's own history
    // chart and its explanatory prose are gone: four collapsed sections and an
    // intro paragraph no longer overflow 700px, only something shorter.
    await page.setViewportSize({ width: 1280, height: 500 })
    await page.goto(`/budget/${books[0]}/reserves`)

    const moved = await page.evaluate(() => {
      window.scrollTo(0, 5000)
      const at = window.scrollY
      window.scrollTo(0, 0)
      return at
    })
    expect(moved).toBe(0)

    const prose = page.locator("article div.lg\\:overflow-y-auto")
    expect(await prose.evaluate((box) => box.scrollHeight - box.clientHeight)).toBeGreaterThan(50)

    // The charts are outside it, so they stay while the prose moves.
    const bands = (await page.locator(".budget-bands").boundingBox())!
    await prose.evaluate((box) => box.scrollTo(0, box.scrollHeight))
    expect((await page.locator(".budget-bands").boundingBox())!.y).toBe(bands.y)

    // A section is normally a reading column, and this one asks not to be, so
    // the page around the prose is wider than one -- the prose keeps its own.
    const article = (await page.getByRole("article").boundingBox())!
    expect(article.width).toBeGreaterThan(1000)

    // Below `lg` it is a page again, and scrolls as one, charts first.
    await page.setViewportSize({ width: 390, height: 800 })
    await page.reload()
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight),
    ).toBeGreaterThan(200)
  })

  test("links the book's own terms wherever its prose uses them", async ({ page }) => {
    await page.goto(`/budget/${books[0]}/reserves`)

    // The first use is inside the first of the page's collapsed reserve
    // policies now, so reaching it is what opening that section is for.
    await page.locator("details").first().locator("summary").click()

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
    await page.locator("details").first().locator("summary").click()
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
    expect(await bookPdf(page).getAttribute("href")).toMatch(/#page=232$/)
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
    // What the city spends is the forty-two departments with a 2027 figure
    // the Council voted, plus the two enterprise departments the book does
    // not carry at all.
    await expect(page.locator(".budget-columns")).toContainText("$316,044,835")

    const wedges = page.locator(".budget-column").first().getByRole("img")
    const labels = await wedges.evaluateAll((w) => w.map((el) => el.getAttribute("aria-label")))
    expect(labels.some((l) => l?.includes("Wastewater Department, $15,967,043"))).toBe(true)
    expect(labels.some((l) => l?.includes("Water Department, $14,805,633"))).toBe(true)

    // Charged to the city rather than chosen by it -- the Commonwealth's bill
    // for charter school tuition, the MBTA and the rest, and the assessors'
    // overlay for the abatements the year will grant -- but spent either way,
    // so the chart carries them. The department table has no row called
    // "Overlay": it is "Other" there, the book's own name for the same
    // $250,000 on pages 76-77.
    expect(labels.some((l) => l?.includes("State Assessments, $10,271,435"))).toBe(true)
    expect(labels.some((l) => l?.includes("Other, $250,000"))).toBe(true)

    // The other side of the same budget: the book's sources, with what the two
    // departments are billed beside them -- whole, because the reimbursement
    // they send the general fund is inside those figures rather than a slice of
    // its own.
    const sources = page.locator(".budget-column").last().getByRole("img")
    const income = await sources.evaluateAll((w) => w.map((el) => el.getAttribute("aria-label")))
    expect(income.some((l) => l?.includes("TAX LEVY, $146,107,374"))).toBe(true)
    expect(income.some((l) => l?.includes("CH 70 STATE AID, $96,427,042"))).toBe(true)
    expect(income.some((l) => l?.includes("Wastewater Revenue, $16,666,024"))).toBe(true)
    expect(income.some((l) => l?.includes("Water Revenue, $15,040,417"))).toBe(true)

    // And the high-level view says none of that: the spending page does, in
    // the city's own words.
    await expect(page.getByRole("heading", { name: /^Appropriated by the Council/ })).toHaveCount(0)
  })

  test("says on the spending page what the chart leaves out", async ({ page }) => {
    await page.goto(spendingUrl("council-orders"))

    // None of the four orders are quoted here any more -- each reads better
    // beside the figure it already belongs to. 13.1 and 13.2's totals
    // ($14,805,633 and $15,967,043) are segments of the spending bar; 13.3
    // is on Revenue, since it is that figure's revenue side; 13.4 is on
    // Reserves, beside the free cash policy it answers to.
    await expect(page.getByRole("heading", { name: "What the Council appropriated" })).toBeVisible()
    const article = page.getByRole("article")
    await expect(article).not.toContainText("be appropriated to operate the Water Department")
    await expect(article).not.toContainText("be appropriated to operate the Wastewater Department")
    await expect(article).not.toContainText("$15, 967,043")
    await expect(article).not.toContainText("$ 274,750,725")
    await expect(article).not.toContainText("Taxation and Other Receipts")
    await expect(article).not.toContainText("$2,770,000")

    // Why the two enterprise totals are missing.
    await expect(article).toContainText("enterprise funds")

    // The agenda those orders are on is on the calendar under this page, on the
    // hearings it falls inside -- not in the bar, which carries no document
    // link on any page now.
    const agenda = page
      .locator(".budget-timeline li")
      .filter({ hasText: "Public hearings" })
      .getByRole("link")
    expect(await agenda.getAttribute("href")).toMatch(/full-agenda-6226\.pdf$/)
    await expect(
      page.getByRole("banner").getByRole("link", { name: /^City Council Order/ }),
    ).toHaveCount(0)
  })

  test("transfers free cash against the snow and ice deficit, moved onto Reserves", async ({
    page,
  }) => {
    await page.goto(`/budget/${books[0]}/reserves`)

    // Order 13.4, quoted beside Policy #3's own "Results" paragraph, which
    // already describes the same deficit in the book's own words.
    const article = page.getByRole("article")
    await article.locator("details").nth(2).locator("summary").click()
    await expect(article).toContainText("exceptionally high snow removal costs")
    await expect(article).toContainText(
      "$2,770,000 will be transferred from fiscal 2025- certified free cash",
    )
  })

  test("raises the general fund on the revenue page, moved off Council Orders", async ({
    page,
  }) => {
    await page.goto(`/budget/${books[0]}/revenue`)

    // Order 13.3, quoted the same way it was on Council Orders -- the
    // agenda's own words, spacing and all.
    const article = page.getByRole("article")
    await expect(page.getByRole("heading", { name: "What the Council Raised" })).toBeVisible()
    await expect(article).toContainText(
      "be and hereby raised and appropriated designated as appropriation",
    )
    await expect(article).toContainText("Taxation and Other Receipts")
    await expect(article).toContainText("$268,541,960")

    // And why the Council's own total differs from the book's.
    await expect(article).toContainText("$ 274,750,725")
    await expect(article).toContainText("state assessments")
    await expect(article).toContainText("tax rate recapitulation sheet")
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
    await expect(page.locator(".budget-band").first()).toHaveAttribute(
      "aria-label",
      /\$13,985,452 \(7\.85%\)/,
    )

    await page.goto(`/budget/${books[0]}/debt`)
    // No table on this page either now -- the composition chart carries every
    // cell of it, the same as the reserve dials above.
    await expect(page.getByRole("article").getByRole("table")).toHaveCount(0)
    await expect(page.locator(".budget-debt-bar [role='img']").first()).toHaveAttribute(
      "aria-label",
      /School Department, \$71,517,300/,
    )
  })

  test("names and prices the column segment under the pointer", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)
    const chart = page.locator(".budget-columns")
    await chart.locator(".budget-column").first().getByRole("img").first().hover()

    const tooltip = chart.locator(".budget-tooltip")
    await expect(tooltip).toContainText("School Department")
    await expect(tooltip).toContainText("$136,998,618")
    await expect(tooltip).toContainText("43.3%")
  })
  test("reaches the segment no mouse can hit with the keyboard", async ({ page }) => {
    // Senior Center is $14,500 of $316 million, a fraction of a pixel tall.
    // Focus is the only way to it, which is why every segment takes focus.
    await page.goto(`/budget/${books[0]}`)
    const chart = page.locator(".budget-columns")
    await chart.locator(".budget-column").first().getByRole("img").last().focus()
    await expect(chart.locator(".budget-tooltip")).toContainText("Senior Center")
    await expect(chart.locator(".budget-tooltip")).toContainText("$14,500")
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

  test("hangs each document off the step that produced it", async ({ page }) => {
    await page.goto(`/budget/${books[0]}`)

    // The book is the outcome of the final review, and the Council's
    // appropriation orders were on an agenda inside the run of hearings. Both
    // used to hang off the bar at the top, where "Original Source" said nothing
    // about where in the year either came from; a box in the calendar does.
    const review = page.locator(".budget-timeline li").filter({ hasText: "Final review" })
    expect(await review.getByRole("link").getAttribute("href")).toMatch(/fy-2027-budget-book/)

    const hearings = page.locator(".budget-timeline li").filter({ hasText: "Public hearings" })
    expect(await hearings.getByRole("link").getAttribute("href")).toMatch(/full-agenda-6226\.pdf$/)

    // Every other box is text: a step that produced nothing the city published
    // has nothing to link.
    await expect(page.locator(".budget-timeline li a")).toHaveCount(2)

    // And the bar no longer carries the book, since the box does.
    await expect(
      page.getByRole("banner").getByRole("link", { name: /^Original Source/ }),
    ).toHaveCount(0)

    // The calendar is under every page of the book, not just its front page,
    // which is what lets the bar carry nothing: a document is reachable from
    // wherever the reader is, presented the one way. On a section the book
    // opens at that section's own page.
    for (const [at, opensAt] of [
      ["reserves", 17],
      ["glossary", 232],
    ] as const) {
      await page.goto(`/budget/${books[0]}/${at}`)
      await expect(page.locator("article footer .budget-timeline li")).toHaveCount(12)
      expect(await bookPdf(page).getAttribute("href")).toMatch(new RegExp(`#page=${opensAt}$`))
    }

    // Nowhere else. It is this book's own page 13, not the site's furniture.
    await page.goto("/calendar")
    await expect(page.locator(".budget-timeline")).toHaveCount(0)
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

    // The bar reads "Haverhill Public Documents / 2027 Budget / Reserves": a
    // section used to take it over, which named the page and lost the year it
    // belonged to. The middle of it is the way back to the book.
    const bar = page.getByRole("banner")
    const book = bar.getByRole("link", { name: "2027 Budget", exact: true })
    expect(await book.getAttribute("href")).toMatch(new RegExp(`/budget/${books[0]}$`))

    const crumb = (await book.boundingBox())!
    const name = (await page.getByRole("heading", { level: 1 }).boundingBox())!
    const mark = (await bar.getByRole("link", { name: /Haverhill Public/ }).boundingBox())!
    expect(crumb.x).toBeGreaterThan(mark.x)
    expect(crumb.x).toBeLessThan(name.x)

    // The book's own page is the thing, so it carries no crumb of its own.
    await page.goto(`/budget/${books[0]}`)
    await expect(
      page.getByRole("banner").getByRole("link", { name: "2027 Budget", exact: true }),
    ).toHaveCount(0)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("2027 Budget")

    await page.goto(`/budget/${books[0]}/${sections[0]}`)
    await expect(page.getByRole("article")).not.toBeEmpty()
    // The way into the book is the calendar's, not the bar's: the bar carries
    // no link to a document on any page now.
    await expect(page.locator('header a[href*="#page="]')).toHaveCount(0)
    await expect(bookPdf(page)).toHaveCount(1)

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
    // Scoped to the contents lists: the calendar in the footer is a list of
    // boxes inside the same article, and two of its boxes link a document.
    const local = await page.locator('article > div ol li a:not([href*="#page="])').all()
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
