import type { Announcement } from "$lib/calendar"

/**
 * The Council's agenda of 6 October announced this sitting, and the committee's
 * own notice is on the city's events calendar too, so the notice is what puts it
 * on the calendar today. This keeps it there once the notice has dropped out of
 * the forward projection and before any agenda or minutes are scraped for it,
 * which would otherwise leave this page with no sitting and fail the build.
 */
export const announced: Announcement = {
  board: "Planning and Development Committee",
  date: "2026-10-19",
  time: "6:00 PM",
  meeting: "city-council-2026-10-06",
  item: "planning-development-committee-meeting",
  title: "Announced at the City Council meeting of October 6, 2026",
}
