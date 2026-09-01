import type { PageLoad } from "./$types"

/**
 * Everything the book says about where the money goes: "Capital Planning"
 * (page 28), "10-Year Appropriation Forecast" (69) and "2027 Budget Requests"
 * (72), in the book's order.
 *
 * Appropriations is the umbrella, and it is a precise word rather than a
 * category: an appropriation is the City Council's authorisation to spend a
 * stated amount, for a stated purpose, from a stated source, in one fiscal
 * year. Nothing is spent without one, which is why the appropriations table
 * comes to the same total as revenue -- the budget has to balance.
 *
 * The three sections here are that authorisation from three sides: what the
 * year's spending is asked to be (the requests, which are the increments to
 * departments' existing budgets rather than money of their own), where it is
 * going (the forecast), and what the city wants to build or buy, which is
 * mostly *not* in this year's appropriation at all -- capital over $250,000 is
 * borrowed, and reaches the budget years later as debt service.
 *
 * The page number is the first of the three, so the bar's source link opens
 * the city's file where the run begins.
 */
export const load: PageLoad = () => ({
  section: { title: "Appropriations", page: 28 },
})
