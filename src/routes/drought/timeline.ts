import type { TimelineEntry } from "$lib/timeline"

/**
 * HC Media's recording of a sitting. Every meeting on this timeline links to
 * one of these.
 *
 * **The video rather than this site's own write-up**, which is what these
 * linked before. A reader following the timeline wants to watch the thing
 * being decided, and for most of these sittings the video is the only record
 * that carries it: the city's agenda names an item in six words and its
 * minutes record the vote, while what the Water Department actually said --
 * the slides, the figures, the questions councillors asked -- exists only in
 * the recording.
 *
 * Spelled `http://` because that is how the page's own prose links them and
 * the two must not disagree about where a citation points.
 */
const video = (slug: string) => `http://haverhillcommunitytv.org/video/${slug}`

/**
 * The drought as a sequence of dated acts, for the timeline beside the page.
 *
 * **Each entry carries the earliest minute the prose cites from that
 * sitting**, in the same "(timestamp h:mm:ss)" form the prose uses. HC
 * Media's player takes no time fragment, so a minute can only be printed and
 * sought to by hand -- and the earliest is the right one, because it is where
 * the item the entry names begins rather than wherever the article happened
 * to quote it from.
 *
 * **Two entries carry no link and no date.** The tiered-rates analysis and
 * the Methuen connection are both expected rather than recorded: the Council
 * ordered one and the pipe for the other is nearly built, but no date has
 * been published for either, so they say "(unconfirmed)" and sort after
 * everything that has happened. The 2012 loan order is the opposite case --
 * it happened, and the city no longer publishes a record of it that far
 * back, so it carries the year it is known to and nothing more.
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
    id: "loan-order-2012",
    // The year and no more: the project "dates back to 2012", and the
    // sitting that approved the loan order is older than anything the city
    // publishes a document or a recording for.
    date: "2012-12-31",
    dateLabel: "2012",
    eyebrow: "City Council",
    title: "Property identified and a loan order approved",
  },
  {
    id: "eminent-domain-deferred",
    date: "2026-03-10",
    eyebrow: "City Council",
    title: "Property acquisition deferred (timestamp 39:00)",
    href: video("haverhill-city-council-meeting-march-10-2026"),
  },
  {
    id: "ordinance-first-discussed",
    date: "2026-03-30",
    eyebrow: "Planning and Development Committee",
    title: "Water use ordinance first discussed (timestamp 19:23)",
    href: video("haverhill-city-council-planning-development-meeting-march-30-2026"),
  },
  {
    id: "ranney-well-and-acquisition",
    date: "2026-06-02",
    eyebrow: "City Council",
    title: "Ranney Collector Well presented and the acquisition approved (timestamp 13:06)",
    href: video("haverhill-city-council-meeting-june-2-2026"),
  },
  {
    id: "drought-update",
    date: "2026-09-15",
    eyebrow: "City Council",
    title: "Drought update (timestamp 29:17)",
    href: video("haverhill-city-council-meeting-september-15-2026"),
  },
  {
    id: "ordinance-changes",
    date: "2026-10-06",
    eyebrow: "City Council",
    title: "Water use ordinance revisions approved (timestamp 41:29)",
    href: video("haverhill-city-council-meeting-october-6-2026"),
  },
  {
    id: "tiered-rates-due",
    eyebrow: "Water Department",
    title: "Tiered rates analysis due (unconfirmed)",
  },
  {
    id: "methuen-available",
    eyebrow: "Water Department",
    title: "Methuen water available (unconfirmed)",
  },
]
