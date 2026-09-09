/**
 * `meetings.json` turned into the meetings the site shows.
 *
 * Both the calendar and each meeting page need the same list, built the same
 * way, so the work lives here rather than in either route. It runs at build
 * time -- the site is fully prerendered -- so nothing here ships to the
 * browser except the data it returns.
 */
import raw from "./data/meetings.json"
import {
  easternDate,
  groupIntoMeetings,
  withScheduled,
  type Meeting,
  type MeetingDocument,
  type MeetingKind,
} from "./calendar"
import { expectedSittings, meetingCalendars, meetingRules } from "./schedule"

/**
 * The meetings somebody has written up by hand.
 *
 * Only the keys matter, so the modules are never called -- the glob is being
 * used as a directory listing that Vite can resolve at build time. The path is
 * relative and literal because a glob has to be static.
 *
 * Existence of the route directory is the whole signal, and the router honours
 * it without being told: a static `<meeting id>/` beats `[meeting]/`. Nothing
 * in meetings.json records which meetings are written up, so writing one is a
 * single step -- add the directory -- and a data refresh cannot contradict it.
 *
 * `[meeting]` itself matches the glob, and is dropped.
 */
/**
 * The day this build ran, in the city -- as far back as the calendar's
 * projection of future sittings starts, and the month the calendar opens on
 * until the reader's own browser says otherwise.
 *
 * Read once at module load rather than per call. `calendar()` is called by the
 * calendar page, by every meeting page's layout, and by `entries()` deciding
 * which meeting routes to prerender -- a build that crossed midnight between
 * two of those would prerender a set of ids the layout then disagreed with, and
 * fail. One value for the whole build cannot.
 */
const BUILT_ON = easternDate()

const written = new Set(
  Object.keys(import.meta.glob("../routes/calendar/meetings/*/+page.svelte"))
    .map((path) => path.split("/").at(-2)!)
    .filter((name) => !name.startsWith("[")),
)

/** One page or file the calendar is built out of. */
export interface Source {
  /** What the city calls it. */
  name: string
  url: string
  /** True where the source is a PDF rather than a page, worth saying before a click. */
  pdf: boolean
}

/**
 * Every page the calendar is read off, in two groups.
 *
 * The calendar used to name one: the agendas-and-minutes listing, in a sentence
 * under the heading. That was the answer while the listing was the whole
 * scrape, and it stopped being true twice over -- the listing reaches back only
 * to 2025 and two archives hold the rest, two boards keep their own documents
 * on their own pages, and none of the four boards that publish a schedule
 * publishes it there. A reader who wants to check what is here against what the
 * city posted needs all of them, so all of them are listed.
 *
 * Derived rather than written out. Documents come from the distinct `source` on
 * the records themselves and schedules from `schedule.json`, so a scrape that
 * starts reading a new page puts it here without anyone remembering to.
 */
export interface Sources {
  /** Where the agendas and minutes were read off, most documents first. */
  documents: Source[]
  /** Where the expected sittings were read off, by board. */
  schedules: Source[]
}

/**
 * What the city calls each page, since a record carries only its URL.
 *
 * Keyed on the last path segment rather than the whole URL: the city has moved
 * this material once already, from cityofhaverhill.com to haverhillma.gov, and
 * a page that moves under a different parent keeps its own name. Anything not
 * named here is titled from its slug, so a page added to the scrape appears
 * with a reasonable name rather than not at all.
 */
const PAGE_NAMES: Record<string, string> = {
  "agendas-and-minutes": "Agendas & Minutes",
  "agenda-archive": "Agenda Archive",
  "minutes-archive": "Minutes Archive",
  "planning-board": "Planning Board",
  "zoning-board-of-appeals": "Zoning Board of Appeals",
}

const slugOf = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? url

const pageName = (url: string) => {
  const slug = slugOf(url)
  return (
    PAGE_NAMES[slug] ??
    slug
      .replace(/\.[a-z]+$/, "")
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ")
  )
}

export interface Calendar {
  meetings: Meeting[]
  generatedAt: string
  source: string
  /** Every page the calendar is read off. */
  sources: Sources
  /** Records with no date, which cannot be placed on a calendar. */
  undated: number
  /** Records dropped as duplicate publications of one PDF. */
  duplicates: number
  /** Kept records whose date the scraper was unsure of. */
  flagged: number
  /** Meetings with a write-up on this site. */
  written: number
  /** Documents shown, across every meeting. */
  documents: number
  /** Sittings the Council's rule expects, ahead of any document. */
  scheduled: number
  /** Documents the city has taken down, dropped rather than linked to a 404. */
  gone: number
  /**
   * The day this build ran, in the city. The calendar opens on its month and
   * marks its cell, so a reader running no script still gets a today rather
   * than none; the browser replaces it on mount with the reader's own date.
   */
  today: string
}

/**
 * Every meeting the calendar knows about, with the counts the footer discloses.
 *
 * Fields only the scraper cares about -- rawMeetingDate, category, dateSource --
 * are dropped here so they never reach the browser.
 */
export function calendar(): Calendar {
  // Documents the city has taken down. `links:check` finds them and the
  // decision is recorded in `reviews.json` as `gone`, which is why it survives
  // into the data rather than living in the gitignored link cache -- the site
  // has to know, and a build has nothing to check a URL against.
  //
  // They are dropped outright rather than shown as broken. A calendar entry
  // whose only offer is a link to a 404 wastes the one action it invites, and
  // there is nothing here to transcribe or link instead: the record is that the
  // city published something and has since removed it, which the footer says in
  // one line rather than 84 dead ends.
  const live = raw.meetings.filter((m) => !("gone" in m && m.gone))
  const gone = raw.meetings.length - live.length

  const dated = live.filter((m) => m.date)

  // A handful of PDFs are published under two media pages, which would
  // otherwise render the same document twice. Keep one copy, preferring the
  // record whose date the scraper did not flag.
  const best = new Map<string, (typeof dated)[number]>()
  for (const m of dated) {
    const key = m.fileUrl ?? m.pageUrl
    const kept = best.get(key)
    if (!kept || (kept.needsReview && !m.needsReview)) best.set(key, m)
  }

  const kept = [...best.values()]
  const documents: MeetingDocument[] = kept.map((m) => ({
    title: m.title,
    date: m.date,
    board: m.board,
    kind: m.kind as MeetingKind,
    fileUrl: m.fileUrl,
    pageUrl: m.pageUrl,
    docId: m.docId,
  }))

  // The documents first, then the sittings the Council's rule expects that none
  // of them account for. Order matters: an expected date the city has since
  // published an agenda for is an ordinary meeting, and `withScheduled` only
  // fills the gaps left over.
  const isWritten = (id: string) => written.has(id)
  const meetings = withScheduled(
    groupIntoMeetings(documents, isWritten),
    expectedSittings(BUILT_ON),
    isWritten,
  )

  // Distinct, over `live` rather than `kept`, so a page whose every document is
  // a duplicate of another page's still says it was read.
  const perSource = new Set(live.map((m) => m.source))

  // Rules and printed calendars together, by board. The City Council's rule is
  // printed above the document table on the listing page, so its URL is the
  // listing's -- the same page under both headings, which is what it is.
  const schedules = [
    ...meetingRules().map((rule) => ({ board: rule.board, url: rule.source })),
    ...meetingCalendars().map((calendar) => ({ board: calendar.board, url: calendar.source })),
  ].sort((a, b) => a.board.localeCompare(b.board))

  return {
    meetings,
    generatedAt: raw.generatedAt,
    source: raw.source,
    sources: {
      // By URL, which is not an arbitrary order: the city's own listing is the
      // shortest of these paths and the two archives sit under it, so sorting
      // the strings puts the listing first with its archives beneath it and the
      // board pages after. Ordering by how many documents came from each would
      // read the other way round, since the archives together hold more of the
      // record than the listing they hang off does.
      documents: [...perSource]
        .sort()
        .map((url) => ({ name: pageName(url), url, pdf: url.endsWith(".pdf") })),
      schedules: schedules.map(({ board, url }) => ({
        name: board,
        url,
        pdf: url.endsWith(".pdf"),
      })),
    },
    undated: live.length - dated.length,
    duplicates: dated.length - documents.length,
    flagged: kept.filter((m) => m.needsReview).length,
    written: meetings.filter((m) => m.written).length,
    documents: documents.length,
    scheduled: meetings.filter((m) => m.scheduled).length,
    gone,
    today: BUILT_ON,
  }
}
