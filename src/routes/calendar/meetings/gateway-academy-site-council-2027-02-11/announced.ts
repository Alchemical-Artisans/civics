import type { Announcement } from "$lib/calendar"

/**
 * The council's agenda of 19 November closes with its quarterly meeting
 * schedule for the school year, four dates and no hour, and nothing else on the
 * site has this one: the city's events calendar has no notice for it and no
 * document has been scraped for the date. This is what puts the sitting on the
 * calendar, and keeps it there once a notice arrives and then drops back out,
 * which would otherwise leave this page with no sitting and fail the build.
 * No `time`: the schedule prints dates only.
 */
export const announced: Announcement = {
  board: "Gateway Academy Site Council",
  date: "2027-02-11",
  meeting: "gateway-academy-site-council-2026-11-19",
  title: "Announced at the Gateway Academy Site Council meeting of November 19, 2026",
}
