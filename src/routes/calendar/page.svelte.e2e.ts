import { expect, test } from "@playwright/test"
import meetings from "../../lib/data/meetings.json" with { type: "json" }
import schedule from "../../lib/data/schedule.json" with { type: "json" }
import { meetingId } from "../../lib/calendar"

/**
 * The sittings a published schedule lists and no document covers -- worked out
 * from the same two files the site builds from, so this follows the data
 * instead of pinning whichever date happens to be uncovered today.
 */
const documented = new Set(
  meetings.meetings.filter((m) => m.date).map((m) => `${m.board}::${m.date}`),
)
const scheduledOnly = schedule.schedules.flatMap((s) =>
  s.months.flatMap(({ month, days }) =>
    days
      .map((day) => `${s.year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
      .filter((date) => !documented.has(`${s.board}::${date}`))
      .map((date) => ({ id: meetingId(s.board, date), date })),
  ),
)

/** `January 2025` for `2025-01-07`, which is what the month heading reads. */
const monthHeading = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })

/** Step the calendar back to a month, which is client-side and needs no reload. */
async function goToMonth(page: import("@playwright/test").Page, name: string) {
  const heading = page.getByRole("heading", { level: 2 })
  const prev = page.getByRole("button", { name: "Previous month" })
  for (let i = 0; i < 120 && (await heading.textContent()) !== name; i++) {
    if (await prev.isDisabled()) break
    await prev.click()
  }
  await expect(heading).toHaveText(name)
}

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
    // the site any more -- the city's files are listed on the meeting page.
    // Checked on every link, because one going somewhere else would be easy to
    // miss.
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

  // Nested, so the skip below governs only these two. A group-level `test.skip`
  // applies to every test in its describe wherever it is written, which in the
  // outer one would take the rest of the suite with it.
  test.describe(() => {
    // Skipped only if every scheduled date has since acquired a document, which
    // would be the city filling its own gaps rather than a broken feature.
    test.skip(
      scheduledOnly.length === 0,
      "every scheduled sitting is covered by a document the city published",
    )

    test("shows a sitting the schedule lists and no document covers", async ({ page }) => {
      const { id, date } = scheduledOnly[0]
      await goToMonth(page, monthHeading(date))

      const entry = page.locator(`table a[href$="/calendar/meetings/${id}"]`)
      await expect(entry).toHaveCount(1)
      // Drawn as an outline rather than a filled chip: the city has published
      // nothing for it, and it must not read like an entry carrying an agenda.
      await expect(entry).toHaveClass(/border-dashed/)
      await expect(entry).toHaveAttribute("title", /scheduled/)
    })

    test("the Scheduled toggle hides those sittings and nothing else", async ({ page }) => {
      const { id, date } = scheduledOnly[0]
      await goToMonth(page, monthHeading(date))

      const entries = page.locator("table a")
      const before = await entries.count()
      const entry = page.locator(`table a[href$="/calendar/meetings/${id}"]`)

      await page.getByRole("checkbox", { name: "Scheduled" }).uncheck()
      await expect(entry).toHaveCount(0)
      // A sitting with documents is untouched: the kind toggles govern those.
      expect(await entries.count()).toBe(
        before - scheduledOnly.filter((s) => s.date.startsWith(date.slice(0, 7))).length,
      )
    })
  })
})
