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
  const senate = page.getByRole("row", { name: /SENATOR IN GENERAL COURT/ })
  await expect(senate).toContainText("SECOND ESSEX AND MIDDLESEX DISTRICT")
  await expect(senate).toContainText("FIRST ESSEX DISTRICT")
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
