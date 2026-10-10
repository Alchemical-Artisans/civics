import type { Announcement } from "$lib/calendar"

/**
 * The board's own agenda of 15 October closes by naming its next sitting, and
 * nothing else on the site has it: the city's events calendar has posted no
 * notice for November yet and no document has been scraped for the date. This
 * is what puts the sitting on the calendar, and keeps it there once a notice
 * does arrive and then drops out of the forward projection, which would
 * otherwise leave this page with no sitting and fail the build.
 *
 * The board has met at 9:30 a.m. every month this year, but the announcement
 * is the date alone, so no hour is stated here.
 */
export const announced: Announcement = {
  board: "Library Board of Trustees",
  date: "2026-11-19",
  meeting: "library-board-of-trustees-2026-10-15",
  title: "Announced at the Library Board of Trustees meeting of October 15, 2026",
}
