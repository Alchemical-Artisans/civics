import { expect, test } from "@playwright/test"

const PROJECT = "/projects/2026-state-election"
const WARRANT = "/calendar/meetings/city-council-2026-10-06/election-warrant"

test("the warrant links to its project, which opens on the warrant", async ({ page }) => {
  await page.goto(WARRANT)
  await page.getByRole("link", { name: "Project 2026 State Election" }).click()
  await expect(page).toHaveURL(`${PROJECT}#city-council-2026-10-06-election-warrant`)
  const entry = page.locator("#city-council-2026-10-06-election-warrant")
  await expect(entry).toBeInViewport()
  // `:target` is what rings it.
  expect(await entry.evaluate((el) => el.matches(":target"))).toBe(true)
})

test("every precinct on the map is a link to its own page", async ({ page }) => {
  await page.goto(PROJECT)
  const map = page.getByRole("group", { name: /wards and twenty-one precincts/ })
  await expect(map.getByRole("link")).toHaveCount(21)
  await map.getByRole("link", { name: "Ward 7, Precinct 2" }).click()
  await expect(page).toHaveURL(`${PROJECT}/precincts/7-2`)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ward 7, Precinct 2")
})

test("a precinct with an A half shows both ballots and both buildings", async ({ page }) => {
  await page.goto(`${PROJECT}/precincts/7-2`)
  await expect(page.getByText("Hunking Middle School", { exact: true })).toBeVisible()
  await expect(page.getByText("Consentino Middle School", { exact: true })).toBeVisible()
  const ballot = page.getByRole("tabpanel").filter({ visible: true })
  await expect(ballot).toContainText("Barry R. Finegold")
  await page.getByRole("tab", { name: "Precinct 7-2A" }).click()
  await expect(ballot).toContainText("Pavel M. Payano")
})

test("the early-voting item links to the project too", async ({ page }) => {
  await page.goto("/calendar/meetings/city-council-2026-10-06/early-voting-schedule")
  await page.getByRole("link", { name: "Project 2026 State Election" }).click()
  await expect(page).toHaveURL(`${PROJECT}#city-council-2026-10-06-early-voting-schedule`)
})

test("a precinct page links the statewide questions out and offers the day", async ({ page }) => {
  await page.goto(`${PROJECT}/precincts/5-3`)
  await expect(page.getByRole("link", { name: /Information for Voters/ })).toHaveAttribute(
    "href",
    /sec\.state\.ma\.us/,
  )
  await expect(page.getByRole("heading", { name: "Question 10" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Question 1", exact: true })).toHaveCount(0)
  await expect(page.getByRole("button", { name: /add to calendar/i })).toBeVisible()
})

test("the agenda opens the project on the item, not the item's own page", async ({ page }) => {
  await page.goto("/calendar/meetings/city-council-2026-10-06")
  await page.getByRole("link", { name: "Election Warrant, 2026 State Election" }).click()
  await expect(page).toHaveURL(`${PROJECT}#city-council-2026-10-06-election-warrant`)
  // The write-up is still a click away, from the timeline entry itself.
  await page
    .locator("#city-council-2026-10-06-election-warrant")
    .getByRole("link", { name: "Election Warrant, 2026 State Election" })
    .click()
  await expect(page).toHaveURL(WARRANT)
})

test("the map and the polling places are two pages, the map first", async ({ page }) => {
  await page.goto(PROJECT)
  const tabs = page.getByRole("navigation", { name: "Where to vote" })
  await expect(tabs.getByRole("link", { name: "Map" })).toHaveAttribute("aria-current", "page")
  await expect(page.getByRole("table")).toHaveCount(0)
  await tabs.getByRole("link", { name: "Polling places" }).click()
  await expect(page).toHaveURL(`${PROJECT}/polling-places`)
  await expect(tabs.getByRole("link", { name: "Polling places" })).toHaveAttribute(
    "aria-current",
    "page",
  )
  await expect(page.getByRole("group", { name: /twenty-one precincts/ })).toHaveCount(0)
  await page.getByRole("link", { name: "Ward 7, Precinct 2A" }).click()
  await expect(page).toHaveURL(`${PROJECT}/precincts/7-2`)
})

test("the bar's Projects menu lists the election under Elections", async ({ page }) => {
  await page.goto("/")
  const header = page.locator("header")
  const menu = header.locator("#project-list")
  await expect(menu).toBeHidden()
  await header.getByRole("button", { name: /Projects/ }).click()
  await expect(menu).toBeVisible()
  await expect(menu.getByText("Elections")).toBeVisible()
  await menu.getByRole("link", { name: "2026 State Election" }).click()
  await expect(page).toHaveURL(PROJECT)
  // Inside the section, the word is marked as where the reader is.
  await expect(
    header.getByRole("button", { name: /Projects/ }).getByText("Projects", { exact: true }),
  ).toHaveClass(/font-medium/)
})

test("the Projects menu opens on hover with no script", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto("/")
  const header = page.locator("header")
  await header.getByRole("button", { name: /Projects/ }).hover()
  await expect(header.locator("#project-list")).toBeVisible()
  await context.close()
})

// The reader's own date decides what is behind them, so pin it: these would
// otherwise change meaning the day the election is over.
const ON_THE_DAY = new Date("2026-10-06T12:00:00-04:00")

test("the timeline folds away what has already happened", async ({ page }) => {
  await page.clock.setFixedTime(ON_THE_DAY)
  await page.goto(PROJECT)
  const fold = page.locator("details", { hasText: "earlier steps" })
  await expect(fold).toBeVisible()
  await expect(fold).not.toHaveAttribute("open", "")
  // Closed, none of the summer's entries is on the page to read ...
  await expect(page.locator("#city-council-2026-07-14-primary-election-warrant")).toBeHidden()
  // ... and what is ahead is not behind the fold.
  const ahead = page.locator("#city-council-2026-10-06-election-warrant")
  await expect(ahead).toBeVisible()
  await expect(fold.locator("#city-council-2026-10-06-election-warrant")).toHaveCount(0)
  await expect(page.locator('[id="2026-11-03-election-day-7-00-a-m-to-8-00-p-m"]')).toBeVisible()
  await fold.getByText("earlier steps").click()
  await expect(page.locator("#city-council-2026-07-14-primary-election-warrant")).toBeVisible()
})

test("a link into an earlier entry opens the fold and lands on it", async ({ page }) => {
  await page.clock.setFixedTime(ON_THE_DAY)
  await page.goto(`${PROJECT}#city-council-2026-07-14-primary-election-warrant`)
  const entry = page.locator("#city-council-2026-07-14-primary-election-warrant")
  await expect(entry).toBeVisible()
  await expect(page.locator("details", { hasText: "earlier steps" })).toHaveAttribute("open", "")
})

test("the fold says how many steps and nothing about when", async ({ page }) => {
  await page.clock.setFixedTime(ON_THE_DAY)
  await page.goto(PROJECT)
  const summary = page.locator("details > summary", { hasText: "earlier steps" })
  await expect(summary).toHaveText(/^\s*\d+ earlier steps\s*$/)
})

test("open, the steps are one group under a summary that does not move, and it closes again", async ({
  page,
}) => {
  await page.clock.setFixedTime(ON_THE_DAY)
  await page.goto(PROJECT)
  const fold = page.locator("details", { hasText: "earlier steps" })
  const summary = fold.locator("summary")
  const before = (await summary.boundingBox())!
  await summary.click()
  const first = page.locator("#city-council-2026-07-14-primary-election-warrant")
  await expect(first).toBeVisible()
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)))
  // The line the reader clicked stays where it was ...
  const after = (await summary.boundingBox())!
  expect([after.x, after.y, after.width, after.height]).toEqual([
    before.x,
    before.y,
    before.width,
    before.height,
  ])
  // ... and the steps sit together in a tinted, bordered panel beneath it.
  const panel = fold.locator("div > div", { has: first })
  const style = await panel.evaluate((el) => {
    const css = getComputedStyle(el)
    return { background: css.backgroundColor, border: css.borderTopWidth }
  })
  expect(style.background).not.toBe("rgba(0, 0, 0, 0)")
  expect(style.border).not.toBe("0px")
  const box = (await panel.boundingBox())!
  expect(box.y).toBeGreaterThanOrEqual(after.y + after.height)
  expect((await first.boundingBox())!.y).toBeGreaterThanOrEqual(box.y)
  // Shut again, it slides away and the line is exactly where it was.
  await summary.click()
  await expect(first).toBeHidden()
  await expect(fold).not.toHaveAttribute("open", "")
  expect(await summary.boundingBox()).toEqual(before)
})
