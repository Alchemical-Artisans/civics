import type { LayoutLoad } from "./$types"
import { fiscalYears } from "$lib/budget"

export const prerender = true

/**
 * Every fiscal year the city publishes, for the header on every page.
 *
 * The header's budget menu is the only list of them there is -- there is no
 * `/budget` index any more -- so the whole listing rides along with each page.
 * It is twenty-odd rows of two URLs, small enough that the alternative (a
 * fetch, on a site that never talks to a server) would cost more than it saves.
 *
 * `budgetBook` is the newest year with a page here: the site's front door, and
 * the first thing the menu offers. `/` forwards there, which is why it is
 * resolved once, here, rather than in both places.
 *
 * `written` is a glob over route directories, so this follows the books as
 * they are written: adding `src/routes/budget/fy2028/` moves both.
 */
export const load: LayoutLoad = () => {
  const years = fiscalYears()
  const newest = years.find((year) => year.written)

  return {
    budgetYears: years,
    budgetBook: newest ? { id: newest.id, year: newest.year } : null,
  }
}
