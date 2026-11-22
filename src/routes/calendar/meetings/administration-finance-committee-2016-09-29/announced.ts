import type { Announcement } from "$lib/calendar"

/**
 * Councillor LePage announced this sitting at the Council meeting of 27
 * September 2016, and the minutes of that meeting record it. The city's
 * listing has no document for it, so this is what puts it on the calendar.
 */
export const announced: Announcement = {
  board: "Administration & Finance Committee",
  date: "2016-09-29",
  time: "7:00PM",
  meeting: "city-council-2016-09-27",
  title: "Announced at the City Council meeting of September 27, 2016",
}
