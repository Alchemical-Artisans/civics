import { expect, test } from "@playwright/test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import meetingsData from "../../../lib/data/meetings.json" with { type: "json" }
import { easternDate, meetingId } from "../../../lib/calendar"
import { expectedSittings } from "../../../lib/schedule"

/**
 * The sittings the Council's rule expects that no document covers, derived the
 * way the site derives them -- read rather than hardcoded, for the same reason
 * `written` is read off the route directories.
 */
const documented = new Set(
  meetingsData.meetings.filter((m) => m.date).map((m) => `${m.board}::${m.date}`),
)
const expected = expectedSittings(easternDate())
  .filter((s) => !documented.has(`${s.board}::${s.date}`))
  .map((s) => ({ id: meetingId(s.board, s.date), source: s.source, related: s.related }))

/**
 * The meetings somebody has written up: one route directory each, named for
 * the meeting id. Read from disk rather than hardcoded, so these follow the
 * pages as they are written instead of pinning whichever one existed first.
 * `[meeting]` is the generated route and is not one of them.
 */
const dir = fileURLToPath(new URL(".", import.meta.url))
const written = readdirSync(dir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      !entry.name.startsWith("[") &&
      existsSync(join(dir, entry.name, "+page.svelte")),
  )
  .map((entry) => entry.name)

/** An item page beneath the first written meeting, by the same reasoning. */
const items = readdirSync(join(dir, written[0]), { withFileTypes: true })
  .filter(
    (entry) => entry.isDirectory() && existsSync(join(dir, written[0], entry.name, "+page.svelte")),
  )
  .map((entry) => entry.name)

test.describe("meeting pages", () => {
  test("a written meeting is what the calendar lands on", async ({ page }) => {
    // The whole point of merging the two: clicking a meeting shows the agenda,
    // not a list with one link on it.
    await page.goto("/calendar")
    const entry = page.locator(`a[href*="/calendar/meetings/${written[0]}"]`)
    if (await entry.count()) await entry.first().click()
    else await page.goto(`/calendar/meetings/${written[0]}`)

    await expect(page).toHaveURL(new RegExp(`/calendar/meetings/${written[0]}$`))
    await expect(page.getByRole("article")).not.toBeEmpty()
    expect(await page.getByRole("article").locator("h2").count()).toBeGreaterThan(0)
  })

  test("names the board and the date, and lists the city's files", async ({ page }) => {
    await page.goto(`/calendar/meetings/${written[0]}`)
    await expect(page.getByRole("heading", { level: 1 })).not.toBeEmpty()
    // Visible text, so the notice popover's own paragraphs -- hidden until
    // opened -- do not count.
    await expect(
      page.locator("header").getByText(/^[A-Z][a-z]+day, [A-Z][a-z]+ \d{1,2}, \d{4}/),
    ).toBeVisible()

    // Asserted on attributes rather than by following them, so the suite never
    // reaches out to the city's CDN.
    const file = page.locator('header a[href^="https://"]').last()
    await expect(file).toHaveAttribute("target", "_blank")
    expect(await file.getAttribute("rel")).toContain("noopener")
  })

  test("a meeting nobody has written up still lists its files", async ({ page }) => {
    await page.goto("/calendar")
    for (const link of await page.locator("table a").all()) {
      const href = (await link.getAttribute("href"))!
      if (written.some((id) => href.endsWith(id))) continue
      await page.goto(new URL(href, page.url()).toString())
      await expect(page.getByRole("article")).toContainText("Nobody has transcribed")
      expect(await page.locator('header a[href^="https://"]').count()).toBeGreaterThan(0)
      return
    }
    throw new Error("every meeting on the default month has been written up")
  })

  test("an item page sits beneath its meeting and returns to it", async ({ page }) => {
    await page.goto(`/calendar/meetings/${written[0]}/${items[0]}`)
    await expect(page.getByRole("heading", { level: 1 })).not.toBeEmpty()
    // By href rather than by nav position: the site header is a nav of its own
    // on every page now, and this is the only link that points at the meeting.
    await page.locator(`a[href$="/calendar/meetings/${written[0]}"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`/calendar/meetings/${written[0]}$`))
  })

  test("offers to add the sitting to a calendar", async ({ page }) => {
    await page.goto(`/calendar/meetings/${written[0]}`)
    await page.getByRole("button", { name: "Add to calendar" }).click()

    // Google Calendar is a plain prefilled link -- it works with no script.
    const google = page.getByRole("link", { name: /Google Calendar/ })
    const href = new URL((await google.getAttribute("href"))!)
    expect(href.host).toBe("calendar.google.com")
    expect(href.searchParams.get("text")).toMatch(/^Haverhill /)
    expect(href.searchParams.get("dates")).toMatch(/^\d{8}(T\d{6})?\/\d{8}(T\d{6})?$/)

    // The .ics is built in the browser and handed over as a download.
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Download/ }).click(),
    ])
    expect(download.suggestedFilename()).toBe(`${written[0]}.ics`)
    const ics = readFileSync((await download.path())!, "utf8")
    expect(ics).toContain("BEGIN:VEVENT")
    expect(ics).toContain("SUMMARY:Haverhill ")
    expect(ics).toContain(`UID:${written[0]}@`)
  })

  test("returns to the calendar", async ({ page }) => {
    await page.goto(`/calendar/meetings/${written[0]}`)
    await page.getByRole("link", { name: "Back to the calendar" }).click()
    await expect(page).toHaveURL(/\/calendar$/)
  })

  test("has no page for a meeting that never happened", async ({ page }) => {
    const response = await page.goto("/calendar/meetings/not-a-board-2026-01-01")
    expect(response?.status()).toBe(404)
  })

  // Skipped only if the city has since published something for every date its
  // own schedule lists, which would be the gap closing rather than a break.
  test.describe(() => {
    test.skip(expected.length === 0, "no expected sittings left in the year")

    test("an expected sitting shows the evidence it rests on", async ({ page }) => {
      // Both kinds, since they do not say the same thing: a board that prints
      // its dates has stated this one, where a rule states a pattern the day
      // falls under. One of each is on the calendar today.
      for (const kind of ["calendar", "rule"] as const) {
        const sitting = expected.find((s) => s.source.kind === kind)
        if (!sitting) continue
        await page.goto(`/calendar/meetings/${sitting.id}`)

        const article = page.getByRole("article")
        await expect(article).toContainText("published no agenda for this sitting yet")
        if (sitting.source.kind === "rule") {
          // Quoted, not paraphrased -- and every clause of it.
          await expect(article).toContainText(sitting.source.intro)
          for (const clause of sitting.source.exceptions)
            await expect(article).toContainText(clause)
        } else {
          await expect(article).toContainText(sitting.source.heading)
          // The other dated columns of the sitting's own row, under the board's
          // own headings. Not sittings -- a filing deadline and a postponement
          // date -- but what the board published about the day.
          for (const other of sitting.related ?? []) {
            await expect(article.getByRole("term").filter({ hasText: other.label })).toHaveCount(1)
          }
          if (sitting.related?.length) {
            await expect(article.getByRole("definition")).toHaveCount(sitting.related.length)
          }
        }

        // It stands where the agenda would, linked to the page it is printed
        // on. The last `header` on the page: the site banner is the first.
        const header = page.locator("header").last()
        const source = header.locator(`a[href="${sitting.source.url}"]`)
        await expect(source).toHaveCount(1)
        await expect(source).toHaveAttribute("target", "_blank")
        await expect(header).toContainText("Expected")
      }
    })

    test("an expected sitting can be added to a reader's own calendar", async ({ page }) => {
      // The point of showing a sitting before its agenda exists. A source that
      // states the hour pins the event to it; one that prints only dates gets
      // an all-day event rather than an invented time.
      for (const kind of ["calendar", "rule"] as const) {
        const sitting = expected.find((s) => s.source.kind === kind)
        if (!sitting) continue
        await page.goto(`/calendar/meetings/${sitting.id}`)

        const when = page
          .locator("header")
          .last()
          .getByText(/^[A-Z][a-z]+day, [A-Z][a-z]+ \d/)
        await expect(when).toContainText(kind === "rule" ? "at 7:00 PM" : /\d{4}$/)

        await page.getByRole("button", { name: "Add to calendar" }).click()
        const href = new URL(
          (await page.getByRole("link", { name: /Google Calendar/ }).getAttribute("href"))!,
        )
        expect(href.searchParams.get("dates")).toMatch(
          kind === "rule" ? /^\d{8}T\d{6}\/\d{8}T\d{6}$/ : /^\d{8}\/\d{8}$/,
        )
      }
    })
  })
})
