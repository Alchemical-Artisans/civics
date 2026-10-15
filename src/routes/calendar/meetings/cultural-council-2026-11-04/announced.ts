import type { Announcement } from "$lib/calendar"

/**
 * The council's agenda of 21 October closes by naming its next sitting, and
 * nothing else on the calendar has it: no notice has been filed on the city's
 * events calendar and no document is scraped for it. This is what puts it
 * there, and what keeps this page's sitting from going missing later.
 *
 * The agenda prints no hour for it, so none is stated here; the council's own
 * sittings run at 6:30, but that is a pattern rather than something this
 * document says.
 */
export const announced: Announcement = {
  board: "Cultural Council",
  date: "2026-11-04",
  meeting: "cultural-council-2026-10-21",
  title: "Announced at the Cultural Council meeting of October 21, 2026",
}
