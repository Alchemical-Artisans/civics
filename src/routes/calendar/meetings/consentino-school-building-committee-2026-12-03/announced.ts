import type { Announcement } from "$lib/calendar"

/**
 * The committee's agenda of 5 November names its next sitting under "Upcoming
 * Dates", and nothing else on the site has it: the city's events calendar has
 * posted no notice for December yet and no document has been scraped for the
 * date. This is what puts the sitting on the calendar, and keeps it there once
 * a notice does arrive and then drops out of the forward projection, which
 * would otherwise leave this page with no sitting and fail the build.
 */
export const announced: Announcement = {
  board: "Consentino School Building Committee",
  date: "2026-12-03",
  time: "9:00 AM",
  meeting: "consentino-school-building-committee-2026-11-05",
  title: "Announced at the Consentino School Building Committee meeting of November 5, 2026",
}
