import { expect, test } from "@playwright/test"
import meetings from "../../lib/data/meetings.json" with { type: "json" }
import { meetingId } from "../../lib/calendar"
import { expectedSittings } from "../../lib/schedule"

/**
 * The sittings the Council's rule expects that no document covers -- derived
 * the way the site derives them, so this follows the data and the calendar
 * rather than pinning a date the city may publish an agenda for tomorrow.
 *
 * The suite runs against a build made moments ago, so "today" here and the
 * build's own projection horizon are the same day.
 */
const documented = new Set(
  meetings.meetings.filter((m) => m.date).map((m) => `${m.board}::${m.date}`),
)
const expected = expectedSittings(new Date().toISOString().slice(0, 10))
  .filter((s) => !documented.has(`${s.board}::${s.date}`))
  .map((s) => ({ id: meetingId(s.board, s.date), date: s.date }))

/** `September 2026` for `2026-09-15`, which is what the month heading reads. */
const monthHeading = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })

/** Step the calendar to a month, which is client-side and needs no reload. */
async function goToMonth(page: import("@playwright/test").Page, name: string) {
  const heading = page.getByRole("heading", { level: 2 })
  for (let i = 0; i < 120 && (await heading.textContent()) !== name; i++) {
    const next = page.getByRole("button", { name: "Next month" })
    if (await next.isDisabled()) break
    await next.click()
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

  test("opens on the newest month with a document, not the projection's last", async ({ page }) => {
    // The rule projects to the end of the year, so the newest month the
    // calendar covers is December. Opening there would drop every reader into a
    // month of Tuesdays nothing has been published for.
    const newest = meetings.meetings
      .filter((m) => m.date)
      .map((m) => m.date!)
      .sort()
      .at(-1)!
    await expect(page.getByRole("heading", { level: 2 })).toHaveText(monthHeading(newest))
  })

  // Nested, so the skip below governs only these two. A group-level `test.skip`
  // applies to every test in its describe wherever it is written, which in the
  // outer one would take the rest of the suite with it.
  test.describe(() => {
    // Skipped only in the last days of December, when the rule's horizon --
    // the end of the calendar year -- has nothing left in it.
    test.skip(expected.length === 0, "no expected sittings left in the year")

    test("shows a sitting the Council's rule expects, with no agenda yet", async ({ page }) => {
      const { id, date } = expected[0]
      await goToMonth(page, monthHeading(date))

      const entry = page.locator(`table a[href$="/calendar/meetings/${id}"]`)
      await expect(entry).toHaveCount(1)
      // Drawn as an outline rather than a filled chip: the city has published
      // nothing for it, and it must not read like an entry carrying an agenda.
      await expect(entry).toHaveClass(/border-dashed/)
      await expect(entry).toHaveAttribute("title", /expected/)
    })

    test("the Expected toggle hides those sittings and nothing else", async ({ page }) => {
      const { id, date } = expected[0]
      await goToMonth(page, monthHeading(date))

      const entries = page.locator("table a")
      const before = await entries.count()
      const entry = page.locator(`table a[href$="/calendar/meetings/${id}"]`)

      await page.getByRole("checkbox", { name: "Expected" }).uncheck()
      await expect(entry).toHaveCount(0)
      // A sitting with documents is untouched: the kind toggles govern those.
      expect(await entries.count()).toBe(
        before - expected.filter((s) => s.date.startsWith(date.slice(0, 7))).length,
      )
    })
  })
})
