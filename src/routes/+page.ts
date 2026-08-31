import type { PageLoad } from "./$types"
import { calendar } from "$lib/meetings"
import { fiscalYears } from "$lib/budget"
import { boardsOf, formatMonth, monthKey } from "$lib/calendar"

/**
 * What each half of the site actually holds, counted at build time.
 *
 * The landing page says how much is behind each link rather than describing it
 * in adjectives, which means the description cannot drift: a data refresh moves
 * the numbers, and writing a meeting or a budget section up moves them again,
 * with nothing here to remember to edit.
 *
 * `meetings` comes back sorted by date, so the ends of the array are the span.
 */
export const load: PageLoad = () => {
  const { meetings, documents, written, generatedAt } = calendar()
  const years = fiscalYears()

  return {
    calendar: {
      meetings: meetings.length,
      documents,
      written,
      boards: boardsOf(meetings).length,
      from: formatMonth(monthKey(meetings[0].date)),
      to: formatMonth(monthKey(meetings.at(-1)!.date)),
      generatedAt,
    },
    budget: {
      years: years.length,
      oldest: years.at(-1)!.year,
      newest: years[0].year,
      /** The books readable here a section at a time, newest first. */
      books: years.filter((y) => y.written).map((y) => y.year),
    },
  }
}
