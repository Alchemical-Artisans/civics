import type { PageLoad } from "./$types"
import { fiscalYears } from "$lib/budget"

/**
 * Where `/` sends the visitor: the most recent budget book readable here.
 *
 * Resolved from the data rather than written out, so the year it opens follows
 * the books as they are written. `fiscalYears()` comes back newest first, so
 * the first one marked written is the most recent -- and marking it written is
 * itself derived from the route directory existing, which means adding
 * `src/routes/budget/fy2028/` is the whole act of moving the front door.
 *
 * The fallback matters more than it looks: `written` is a glob over route
 * directories, so a checkout with the budget routes removed, or a mistake that
 * makes the glob match nothing, would otherwise leave the site's front door
 * pointing nowhere. The list of years is still there in that case, so `/budget`
 * is the honest thing to open.
 */
export const load: PageLoad = () => {
  const newest = fiscalYears().find((year) => year.written)

  return {
    book: newest ? { id: newest.id, year: newest.year } : null,
  }
}
