import { expect, test } from "@playwright/test"
import { easternDate, monthKey, weekOf } from "../../../lib/calendar"

const TODAY = easternDate()
const MONTH = `/calendar/${monthKey(TODAY).replace("-", "/")}`
const WEEK = `/calendar/week/${weekOf(TODAY)[0]}`
const DAY = `/calendar/day/${TODAY}`

test.describe("week and day views", () => {
  test("the front page's week links to the week and to each day", async ({ page }) => {
    await page.goto("/")
    await page.locator(`a[href$="${WEEK}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${WEEK}$`))

    await page.goto("/")
    await page.locator(`a[href$="${DAY}"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`${DAY}$`))
  })

  test("a day in the month grid opens that day", async ({ page }) => {
    await page.goto(MONTH)
    await page.locator(`td a[href$="${DAY}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${DAY}$`))
    await expect(page.getByRole("heading", { level: 2 })).toContainText(
      String(Number(TODAY.slice(8))),
    )
  })

  test("the view switch moves between month, week and day", async ({ page }) => {
    await page.goto(MONTH)
    const views = page.getByRole("navigation", { name: "Calendar view" })
    await views.getByRole("link", { name: "Week" }).click()
    await expect(page).toHaveURL(new RegExp(`${WEEK}$`))
    await expect(views.getByRole("link", { name: "Week" })).toHaveAttribute("aria-current", "page")
    await views.getByRole("link", { name: "Day" }).click()
    await expect(page).toHaveURL(new RegExp(`${DAY}$`))
    await views.getByRole("link", { name: "Month" }).click()
    await expect(page).toHaveURL(new RegExp(`${MONTH}$`))
  })

  test("Prev and Next step a week and a day", async ({ page }) => {
    await page.goto(WEEK)
    await page.getByRole("link", { name: "Next week" }).click()
    await expect(page).not.toHaveURL(new RegExp(`${WEEK}$`))
    await page.goto(DAY)
    await page.getByRole("link", { name: "Previous day" }).click()
    await expect(page).not.toHaveURL(new RegExp(`${DAY}$`))
  })
})
