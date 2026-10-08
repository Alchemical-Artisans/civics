import type { Announcement } from "$lib/calendar"

/**
 * The board's own agenda of 13 October closes by naming its next sitting, and
 * nothing else on the site has it: the city's events calendar has posted no
 * notice for November yet and no document has been scraped for the date. This
 * is what puts the sitting on the calendar, and keeps it there once a notice
 * does arrive and then drops out of the forward projection, which would
 * otherwise leave this page with no sitting and fail the build.
 */
export const announced: Announcement = {
  board: "Retirement Board",
  date: "2026-11-10",
  time: "9:00AM",
  meeting: "retirement-board-2026-10-13",
  title: "Announced at the Retirement Board meeting of October 13, 2026",
}
