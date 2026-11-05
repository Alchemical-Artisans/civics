import type { TimelineEntry } from "$lib/timeline"
import { Router } from "$lib/router"

/**
 * The drought as a sequence of dated acts, for the timeline beside the page.
 *
 * **Every entry is something the city did on a day it can be pinned to, and
 * is titled in the city's own words.** Three are agenda items -- the board,
 * the agenda's own number and the printed title, each linking to the
 * write-up this site already carries -- and the fourth is the day the city
 * revised its own drought page, quoted from the line it prints there. The
 * drought itself has no start date anybody published, and "rainfall began to
 * fall short" is not an act, so there is no entry for it: a reader wanting
 * that is looking at the rainfall chart.
 *
 * It is not in `$lib/projects.ts`, where a project's timeline lives, because
 * `/drought` is not a project: `PROJECTS` is what the bar's Projects menu
 * lists, and putting the drought there would file it beside the elections
 * and the budget books as an undertaking the city is working through. It is
 * a subject this site reports on. So the entries sit beside the page that
 * draws them, the same as `spending/tables.ts` and the election's own
 * `election.ts`.
 */
export const DROUGHT_TIMELINE: TimelineEntry[] = [
  {
    id: "drought-emergency-update",
    date: "2026-09-15",
    eyebrow: "City Council, item 5.1",
    title: "Drought Emergency Update",
    href: Router.meetingItem("city-council-2026-09-15", "drought-emergency-update"),
  },
  {
    id: "water-use-restriction-ordinance-first",
    date: "2026-09-22",
    eyebrow: "City Council, item 5.2",
    title: "Water Use Restriction Ordinance",
    href: Router.meetingItem("city-council-2026-09-22", "water-use-restriction-ordinance"),
  },
  {
    id: "water-use-restriction-ordinance-second",
    date: "2026-10-06",
    eyebrow: "City Council, item 16.2",
    title: "Water Use Restriction Ordinance",
    href: Router.meetingItem("city-council-2026-10-06", "water-use-restriction-ordinance"),
  },
  {
    // The city states this date on the page itself, over the words
    // "UPDATED: October 28, 2026", and the status in the heading above it.
    // `KENOZA_SOURCE.page` is the same page the lake chart opens.
    id: "city-status-2026-10-28",
    date: "2026-10-28",
    eyebrow: "Water Department",
    title: "Current Status: Level 4 Drought Emergency",
    note: "The city's own drought page, as it stands",
  },
]
