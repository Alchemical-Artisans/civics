import { expect, test } from "@playwright/test"
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { meetingId } from "../../../lib/calendar"
import data from "../../../lib/data/meetings.json" with { type: "json" }

/**
 * The documents somebody has written a page for: one route directory each,
 * named for the document id. Read from disk rather than hardcoded, so these
 * tests follow the pages as they are written instead of pinning whichever one
 * happened to exist first.
 */
const dir = fileURLToPath(new URL(".", import.meta.url))
const written = readdirSync(dir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, "+page.svelte")))
  .map((entry) => entry.name)

/** The sitting the first written-up document belongs to. */
const record = data.meetings.find((m) => m.docId === written[0] && m.date)!
const meeting = meetingId(record.board, record.date!)

test.describe("meeting document pages", () => {
  test("renders the page written for a document", async ({ page }) => {
    await page.goto(`/calendar/documents/${written[0]}`)

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByRole("article")).not.toBeEmpty()
  })

  test("offers the original document at the top of the page", async ({ page }) => {
    await page.goto(`/calendar/documents/${written[0]}`)

    // Asserted on attributes rather than by following them, so the suite never
    // reaches out to the city's CDN.
    const media = page.getByRole("link", { name: /^Original Page/ })
    expect(await media.getAttribute("href")).toMatch(/^https:\/\/www\.haverhillma\.gov\//)
    await expect(media).toHaveAttribute("target", "_blank")

    const pdf = page.getByRole("link", { name: /^\(PDF/ })
    expect(await pdf.getAttribute("href")).toMatch(/^https:\/\/media-001.*\.pdf$/)
    await expect(pdf).toHaveAttribute("target", "_blank")
    expect(await pdf.getAttribute("rel")).toContain("noopener")
  })

  test("returns to the meeting it belongs to", async ({ page }) => {
    // Not to the calendar: an agenda and its minutes are two documents about
    // one sitting, and the meeting page is the step the reader came through.
    await page.goto(`/calendar/documents/${written[0]}`)
    await page.locator("nav a").click()
    await expect(page).toHaveURL(/\/calendar\/meetings\/[a-z0-9-]+-\d{4}-\d{2}-\d{2}$/)
  })

  test("is reached from the calendar by way of its meeting", async ({ page }) => {
    // Write-ups are the exception, so walking the grid until one turns up is
    // slow and depends on which month opens by default. Look the meeting up in
    // the same data the site is built from instead.
    await page.goto("/calendar")
    const entry = page.locator(`a[href*="/calendar/meetings/${meeting}"]`)
    if (await entry.count()) await entry.first().click()
    else await page.goto(`/calendar/meetings/${meeting}`)

    await expect(page).toHaveURL(new RegExp(`/calendar/meetings/${meeting}$`))
    await page.locator(`a[href*="/calendar/documents/${written[0]}"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`/calendar/documents/${written[0]}$`))
  })

  test("has no page for a document nobody has written up", async ({ page }) => {
    const response = await page.goto("/calendar/documents/not-a-document-00000000")
    expect(response?.status()).toBe(404)
  })
})
