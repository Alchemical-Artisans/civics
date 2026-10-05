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
