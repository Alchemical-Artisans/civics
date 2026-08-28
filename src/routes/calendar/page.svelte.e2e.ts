import { expect, test } from "@playwright/test"

test.describe("meeting calendar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calendar")
  })

  test("renders the calendar with a month heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Haverhill Meeting Calendar" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2 })).toHaveText(/^[A-Z][a-z]+ \d{4}$/)
  })

  test("every entry opens a meeting on this site", async ({ page }) => {
    // An entry is one sitting, not one document, so nothing in the grid leaves
    // the site any more -- the documents, and the links out to the city, are on
    // the meeting page. Checked on every link, because one going somewhere else
    // would be easy to miss.
    const links = page.locator("table a")
    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      expect(await link.getAttribute("href")).toMatch(
        /\/calendar\/meetings\/[a-z0-9-]+-\d{4}-\d{2}-\d{2}$/,
      )
      expect(await link.getAttribute("target")).toBeNull()
    }
  })

  test("navigates to the previous month", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 2 })
    const start = await heading.textContent()
    await page.getByRole("button", { name: "Previous month" }).click()
    await expect(heading).not.toHaveText(start!)
  })

  test("filtering by board narrows the visible meetings", async ({ page }) => {
    const entries = page.locator("table a")
    const before = await entries.count()
    await page.getByRole("button", { name: "Conservation Commission", exact: true }).click()
    await expect(entries).not.toHaveCount(before)
    expect(await entries.count()).toBeLessThan(before)
  })

  test("unchecking agendas hides agendas without hiding their meetings", async ({ page }) => {
    // The kind toggles hide documents rather than whole meetings, so a sitting
    // with both an agenda and minutes stays on the calendar with one fewer
    // document. The month summary counts both, and is the thing that must move.
    // The template interpolates each number on its own line, so the rendered
    // text carries newlines between them -- hence \s+ rather than a space.
    const summary = page.locator("p", { hasText: /\d+\s+meetings?,\s+\d+\s+documents?/ }).first()
    const read = async () => (await summary.textContent())!.match(/(\d+)\s+meetings?,\s+(\d+)/)!
    const [, meetingsBefore, documentsBefore] = await read()

    await page.getByRole("checkbox", { name: "Agendas" }).uncheck()

    const [, meetingsAfter, documentsAfter] = await read()
    expect(Number(documentsAfter)).toBeLessThan(Number(documentsBefore))
    expect(Number(meetingsAfter)).toBeLessThanOrEqual(Number(meetingsBefore))
  })
})
