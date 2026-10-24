import type { Announcement } from "$lib/calendar"

/**
 * The City Council's agenda of 27 October announces this sitting, and the
 * Chairperson's notice to the Clerk states the hour and the room.
 *
 * Declared here even though the city's events calendar has posted a notice for
 * the day: a notice drops off the calendar once its day has passed, and this
 * sitting has a written page, which the layout would 404 on a sitting the
 * calendar no longer had.
 */
export const announced: Announcement = {
  board: "Planning and Development Committee",
  date: "2026-11-09",
  time: "6:00 PM",
  meeting: "city-council-2026-10-27",
  item: "planning-development-committee-meeting",
  title: "Announced at the City Council meeting of October 27, 2026",
}
