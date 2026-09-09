/**
 * This book in two bars, for the front page's card.
 *
 * The front page wants the year's headline and nothing more: what the city
 * spends, what it takes in, and roughly what each is made of. It reads the
 * same `SPENDING` and `REVENUE_DETAIL` this book's own front page draws in
 * full, so the card and the book cannot state different figures -- one copy,
 * the same reason those two arrays live in their sections' `tables.ts` rather
 * than being assembled again by each chart that reads them.
 *
 * What the card adds is the rolling-up: forty-two departments and fifty-four
 * revenue sources are what `/budget/fy2027` is for, and a bar an inch tall
 * that tried to draw them would draw stripes. `headline` keeps the largest
 * three of each and gathers the rest, which for this year is the two figures
 * that actually answer "where does the money go": the schools at 43% of the
 * spending and the tax levy at 47% of the revenue.
 */
import { headline, type BookSummary } from "$lib/budget"
import { Router } from "$lib/router"
import { SPENDING, SPENDING_TOTAL } from "./spending/tables"
import { REVENUE_DETAIL, REVENUE_TOTAL } from "./revenue/tables"

const BOOK = "fy2027"

export const SUMMARY: BookSummary = {
  spending: {
    label: "Spending",
    href: Router.spendingTab(BOOK, "goals-recommendations"),
    total: SPENDING_TOTAL,
    parts: headline(SPENDING),
  },
  revenue: {
    label: "Revenue",
    href: Router.revenueTab(BOOK, "revenue-projection"),
    total: REVENUE_TOTAL,
    parts: headline(REVENUE_DETAIL),
  },
}
