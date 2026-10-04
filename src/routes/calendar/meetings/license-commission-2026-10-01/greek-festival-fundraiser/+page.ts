import type { PageLoad } from "./$types"

/**
 * Items 5.2 and 5.3 on the agenda: one organisation asking for a one day
 * licence on each day of one two-day festival, so one write-up rather than
 * two that would differ only in the date.
 */
export const load: PageLoad = () => ({
  item: { title: "Greek Festival Fundraiser – One Day Liquor Licenses" },
})
