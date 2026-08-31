import type { LayoutLoad } from "./$types"
import { fiscalYears } from "$lib/budget"

export const prerender = true

/**
 * The newest budget book with a page here, for the header on every page.
 *
 * It lives on the root layout because the header does, and because `/` wants
 * the same answer for its forward -- the site's front door and the header's
 * budget link are the same destination by definition, so resolving it twice
 * would be two places to get it wrong.
 *
 * `written` is a glob over route directories, so this follows the books as
 * they are written: adding `src/routes/budget/fy2028/` moves both.
 */
export const load: LayoutLoad = () => {
  const newest = fiscalYears().find((year) => year.written)

  return {
    budgetBook: newest ? { id: newest.id, year: newest.year } : null,
  }
}
