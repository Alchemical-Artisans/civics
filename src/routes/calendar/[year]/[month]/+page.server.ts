import { error } from "@sveltejs/kit"
import type { EntryGenerator, PageServerLoad } from "./$types"
import { calendar, calendarMonth } from "$lib/meetings"
import { monthsCovered } from "$lib/calendar"

/**
 * Every month this route has to prerender, split into the two path segments
 * the URL carries.
 *
 * The site is fully prerendered, so a route with a parameter has to say up
 * front what its parameters can be -- see `../../meetings/[meeting]/+page.ts`
 * for the same reason. `monthsCovered` already runs from the earliest document
 * to the end of the year the Council's rule projects to, so this generates
 * roughly one page per month of that whole span rather than only the months
 * something happens to be on.
 */
export const entries: EntryGenerator = () =>
  monthsCovered(calendar().meetings).map((key) => {
    const [year, month] = key.split("-")
    return { year, month }
  })

/**
 * Runs at build time (the site is fully prerendered), so a month's meetings
 * are baked into its own page rather than the whole record being shipped to
 * every visitor. See `$lib/meetings` for the work itself.
 *
 * `+page.server.ts` rather than `+page.ts`, and deliberately so: a universal
 * load ships to the browser so client-side navigation between months can
 * re-run it, which would mean bundling all of `$lib/meetings` -- and the
 * ~2,200-document dataset it reads -- into client JS just to filter it down
 * to one month again. A server load runs only here; the prerendered output
 * for client-side Prev/Next is this page's own small `__data.json`, not a
 * multi-hundred-KB chunk shared by every month.
 */
export const load: PageServerLoad = ({ params }) => {
  const key = `${params.year}-${params.month}`
  const data = calendarMonth(key)
  // A directory naming a month outside the calendar's range. The site is
  // fully prerendered, so this fails the build rather than reaching a
  // reader -- the only way here is a typo, since `entries` above is what
  // decides which months exist at all.
  if (!data) error(404, `No such month: ${key}`)
  return data
}
