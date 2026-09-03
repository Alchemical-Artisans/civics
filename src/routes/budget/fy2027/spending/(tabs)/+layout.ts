import type { LayoutLoad } from "./$types"
import { Router } from "$lib/router"

/**
 * Everything the book says about where the money goes.
 *
 * Called "Spending" rather than "Appropriations", which is the book's word and
 * the exact one -- an appropriation is the Council's authorisation to spend a
 * stated amount, for a stated purpose, from a stated source, in one year -- but
 * a word most readers would have to look up before the page could tell them
 * anything. It is in the glossary, and the prose here still says it.
 *
 * What it holds: the two sets of goals
 * (pages 15 and 16), "Capital Planning" (28), "2027 Budget Requests" (72) and
 * "2027 Budget Challenges" (73), in the
 * book's order, and three of the
 * appropriation's own lines -- Debt Service (200), State Assessments (209) and
 * Employee Benefits (211) -- which nobody has transcribed and which are
 * therefore links into the city's file at the page the book gives them.
 *
 * "Budget Policies" (221) is listed with them: it is the rules the year's
 * spending is made under, which is this page's subject seen from the process
 * side, and it sits with the reserve policies on `reserves` as a pair.
 *
 * The rest are a different kind of thing from the four sections above: those are
 * accounts *of* the year's spending, and these are parts *of* it, each a line
 * in the page-78 table the pie is drawn from. They are here because that is
 * still the spending side, and because the contents is not the place to keep a
 * line the reader would have to know is an appropriation to look for.
 *
 * Appropriations is the umbrella, and it is a precise word rather than a
 * category: an appropriation is the City Council's authorisation to spend a
 * stated amount, for a stated purpose, from a stated source, in one fiscal
 * year. Nothing is spent without one, which is why the appropriations table
 * comes to the same total as revenue -- the budget has to balance.
 *
 * The sections here are that authorisation from every side the book takes it
 * from: what departments asked to add to it (the requests, which are increments
 * to existing budgets rather than money of their own), what had to come out of
 * it to balance and what is driving it up (the challenges), and what the city
 * wants to build or buy, which is mostly
 * *not* in this year's appropriation at all -- capital over $250,000 is
 * borrowed, and reaches the budget years later as debt service.
 *
 * The goals are here rather than in the contents because they are goals for
 * the spending: what the Mayor set out to do with the year's money, which is
 * the first thing the rest of this page is an account of.
 *
 * The page number is the first of them, so the bar's source link opens the
 * city's file where the run begins.
 *
 * A `+layout.ts` rather than a `+page.ts` now: the five topics below are their
 * own routes, one directory each under this one, and every one of them wants
 * this same title, width and reference list. Loading it once here is what lets
 * `/spending` itself have nothing to load at all -- it only forwards.
 */
export const load: LayoutLoad = async ({ parent }) => {
  const { book } = await parent()

  return {
    section: { title: "Spending", page: 15 },

    /**
     * Laid out as `reserves` and `debt` are: charts down the left and the
     * reading in the only box that scrolls. The spending bar and the
     * five-year capital chart both want more room than a 48rem strip has to
     * give.
     */
    wide: true,

    // The other document this page rests on: the orders quoted at the foot of
    // it are on the Council's agenda, not in the book.
    references: [
      { title: "Fiscal Reserves", section: "reserves" },
      // Where this spending is going: the ten-year projection, which was on
      // this page until it was clear that what it has in common with the rest
      // of the book is not that it is spending but that it is not about 2027.
      { title: "10-Year Appropriation Projection", section: "history" },
      { title: "Debt Service", href: Router.pdfPage(book.budget!, 200) },
      { title: "State Assessments", href: Router.pdfPage(book.budget!, 209) },
      { title: "Employee Benefits", href: Router.pdfPage(book.budget!, 211) },
      { title: "Budget Policies", href: Router.pdfPage(book.budget!, 221) },
    ],
  }
}
