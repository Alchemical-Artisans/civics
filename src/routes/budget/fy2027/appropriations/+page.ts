import type { PageLoad } from "./$types"
import { Router } from "$lib/router"

/**
 * Everything the book says about where the money goes: "Capital Planning"
 * (page 28), "10-Year Appropriation Forecast" (69), "2027 Budget Requests" (72)
 * and "2027 Budget Challenges" (73), in the book's order, and three of the
 * appropriation's own lines -- Debt Service (200), State Assessments (209) and
 * Employee Benefits (211) -- which nobody has transcribed and which are
 * therefore links into the city's file at the page the book gives them.
 *
 * "Budget Policies" (221) is listed with them: it is the rules the year's
 * spending is made under, which is this page's subject seen from the process
 * side, and it sits with the reserve policies on `reserves` as a pair.
 *
 * The reserves are listed with them, pointing the other way: the forecast on
 * this page carries the projections for the budget reserve and the excess levy,
 * and the balances those are projections of are on that one.
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
 * it to balance and what is driving it up (the challenges), where it is going
 * (the forecast), and what the city wants to build or buy, which is mostly
 * *not* in this year's appropriation at all -- capital over $250,000 is
 * borrowed, and reaches the budget years later as debt service.
 *
 * The page number is the first of them, so the bar's source link opens the
 * city's file where the run begins.
 */
export const load: PageLoad = async ({ parent }) => {
  const { book } = await parent()

  return {
    section: { title: "Appropriations", page: 28 },
    elsewhere: [
      { title: "Fiscal Reserves", section: "reserves" },
      { title: "Debt Service", href: Router.pdfPage(book.budget!, 200) },
      { title: "State Assessments", href: Router.pdfPage(book.budget!, 209) },
      { title: "Employee Benefits", href: Router.pdfPage(book.budget!, 211) },
      { title: "Budget Policies", href: Router.pdfPage(book.budget!, 221) },
    ],
  }
}
