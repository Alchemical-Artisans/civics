import type { Announcement } from "$lib/calendar"

/**
 * The School Building Committee's presentation of 14 October, which the
 * Superintendent brought to the Committee on 22 October, lists this sitting
 * among the project's upcoming outreach dates. Nothing else on the calendar
 * has it: the Committee's meeting schedule is not a document the scrape can
 * read, the city's events calendar carries no notice for it yet, and no
 * agenda or minutes exist to be scraped. This is what puts it on the
 * calendar, and what keeps this page from failing the build once a notice
 * arrives and later drops out of the forward projection.
 *
 * No hour: the slide gives the date and nothing else.
 */
export const announced: Announcement = {
  board: "School Committee",
  date: "2026-11-19",
  meeting: "school-committee-2026-10-22",
  item: "jgw-tilton-school-building-updates",
  title: "Announced at the School Committee meeting of October 22, 2026",
}
