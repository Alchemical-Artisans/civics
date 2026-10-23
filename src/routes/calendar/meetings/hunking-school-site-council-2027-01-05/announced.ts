import type { Announcement } from "$lib/calendar"

/**
 * The council's agenda of 27 October closes with its own schedule for the rest
 * of the school year -- the first Tuesday of each month at 5:15 PM, seven dates
 * printed out -- and nothing else on the site has any of them: the city's
 * events calendar has posted notices only for this month, and no document has
 * been scraped for the date. This is what puts the sitting on the calendar, and
 * keeps it there once a notice does arrive and then drops back out, which would
 * otherwise leave this page with no sitting and fail the build.
 *
 * The agenda caveats the run -- "Subject to change with notice based on
 * Hunking/HPS events and happenings" -- but a date the body has published is
 * still the best word there is on when it next sits.
 */
export const announced: Announcement = {
  board: "Hunking School Site Council",
  date: "2027-01-05",
  time: "5:15 PM",
  meeting: "hunking-school-site-council-2026-10-27",
  title: "Announced at the Hunking School Site Council meeting of October 27, 2026",
}
