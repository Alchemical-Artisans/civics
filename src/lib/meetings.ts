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
  withoutSecondCopies,
  type Meeting,
  type MeetingDocument,
  type MeetingKind,
} from "./calendar"
import {
  expectedSittings,
  meetingCalendars,
  meetingNotices,
  meetingRules,
  noticeCalendar,
} from "./schedule"
import { Router } from "./router"

/**
 * The page the city published a document on, where that is a page about the
 * document rather than the index its link was read off.
 *
 * Derived rather than listed. A record's `source` is the page the scrape read,
 * so a `pageUrl` that is not that page is the document's own: the listing's
 * media pages and the events calendar's notice detail pages are, the two
 * archives' and the two boards' single index pages are not. A scraper reading
 * a new page gets the right answer without anyone adding it here, which is the
 * same bargain the Sources list makes.
 *
 * Compared on host and path, since `pageUrl` is a path on the city's own site
 * and an absolute URL on the events calendar, and the city is inconsistent
 * about the trailing slash.
 */
const documentPage = (pageUrl: string, source: string): string | null => {
  const at = (url: string) => new URL(Router.cityPage(url))
  const [page, read] = [at(pageUrl), at(source)]
  const path = (url: URL) => url.pathname.replace(/\/+$/, "")
  return page.host === read.host && path(page) === path(read) ? null : page.href
}

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
  /**
   * Where the expected sittings were read off: the city's events calendar
   * first, then the four boards that publish a schedule of their own, by
   * board.
   *
   * The calendar is one page for every board that posts a notice to it, where
   * the others are one board's own page each -- so it is named for itself and
   * listed once, rather than repeated under each of the thirteen boards whose
   * sittings it currently accounts for.
   */
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
  // The School Committee's own page on the Haverhill Public Schools site, where
  // the committee publishes its agendas, minutes and meeting packets.
  "meeting-schedule-and-agenda-packet": "School Committee",
  // A whole host rather than a page under one, so the "last path segment" rule
  // leaves the hostname, and the slug fallback would title it
  // "Events.haverhillma.gov".
  "events.haverhillma.gov": "Events Calendar",
  // Another whole host: HC Media's recordings, one origin for all three bodies
  // it films, the way the events calendar is one page for all its notices.
  "haverhillcommunitytv.org": "Video Recordings",
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

/**
 * What the calendar page needs, and nothing else.
 *
 * It used to carry nine counts as well -- documents indexed, records with no
 * date, duplicates collapsed, dates the scraper flagged, documents the city has
 * taken down, sittings projected -- which the page printed as four paragraphs
 * under the grid. They were there to keep the site honest about data it knows
 * to be imperfect, and they are still true; what they were not was anything a
 * reader came for, and they made the foot of the page a wall of small type
 * around the one thing there worth reading, which is where all of this comes
 * from. `scripts/` still counts every one of them, and the run summary's
 * "NEEDS YOUR ATTENTION" block is where they belong -- it is addressed to
 * whoever can act on them. `generatedAt` stays, as the one line under the
 * links: when the scrape last ran is not a caveat about the data, it is how
 * old the page is, and a reader looking at a calendar of public meetings has
 * every reason to want it.
 */
export interface Calendar {
  meetings: Meeting[]
  /** Every page the calendar is read off. */
  sources: Sources
  /** When the scrape behind all of this last ran, as the scraper stamped it. */
  generatedAt: string
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

  // A recording HC Media has that matched no sitting the city published
  // anything for -- `update-recordings.mjs` set `orphan` because the day or
  // body in the volunteer-typed title is wrong, or the meeting was filmed and
  // never documented. A recording is only ever shown beside a sitting's own
  // documents, never on its own, so an orphan is dropped here and left to the
  // run's attention report. `settled` in reviews.json is how a person waves one
  // off for good.
  const placed = live.filter((m) => !("orphan" in m && m.orphan))
  const dated = placed.filter((m) => m.date)

  // An agenda read off a meeting notice, where the city published the same
  // agenda in its own listing too. The listing's copy is the one kept -- see
  // `withoutSecondCopies`, which explains why, and why this is done here rather
  // than in the scrape.
  const filling = withoutSecondCopies(dated, noticeCalendar()?.url)

  // One document whose file and whose page the city published in two different
  // places, so no two URLs here match and `best` below cannot see they are one.
  // The listing gave the Planning Board's agenda of 8 April 2026 a media page
  // and hung no file off it -- the only listing row in the record with none --
  // while the board's own page links the file and gives it no page at all. Two
  // rows for one agenda, one of which opens a page about a document rather than
  // the document.
  //
  // Board, date and kind are the identity, the same as `withoutSecondCopies`
  // uses and for the same reason: the two records share no URL and no title.
  // The record with the file is the document, and it takes the other's page as
  // its own; the page-only record is dropped. A record with no file that
  // nothing else covers is left alone -- it is all the city published, and its
  // page is still the way to what there is.
  const identity = (m: (typeof dated)[number]) => `${m.board}|${m.date}|${m.kind}`
  const filed = new Set(filling.filter((m) => m.fileUrl).map(identity))
  const pages = new Map(
    filling
      .filter((m) => !m.fileUrl && filed.has(identity(m)) && documentPage(m.pageUrl, m.source))
      .map((m) => [identity(m), documentPage(m.pageUrl, m.source)!]),
  )
  const joined = filling.filter((m) => m.fileUrl || !pages.has(identity(m)))

  // A handful of PDFs are published under two media pages, which would
  // otherwise render the same document twice. Keep one copy, preferring the
  // record whose date the scraper did not flag.
  const best = new Map<string, (typeof dated)[number]>()
  for (const m of joined) {
    const key = m.fileUrl ?? m.pageUrl
    const kept = best.get(key)
    if (!kept || (kept.needsReview && !m.needsReview)) best.set(key, m)
  }

  const documents: MeetingDocument[] = [...best.values()].map((m) => ({
    title: m.title,
    date: m.date,
    board: m.board,
    kind: m.kind as MeetingKind,
    fileUrl: m.fileUrl,
    pageUrl: m.pageUrl,
    documentPage: documentPage(m.pageUrl, m.source) ?? pages.get(identity(m)) ?? null,
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

  // The hour the city's notice states, carried onto the sitting whether or not
  // an agenda has turned up for it. A sitting with no documents gets it through
  // `scheduled`; one with documents had nowhere to get it at all, so publishing
  // the agenda used to take the time off the page.
  const hours = new Map(
    meetingNotices()
      .filter((notice) => notice.time)
      .map((notice) => [`${notice.board}|${notice.date}`, notice.time!]),
  )
  const timed = meetings.map((meeting) => {
    const time = hours.get(`${meeting.board}|${meeting.date}`)
    return time ? { ...meeting, time } : meeting
  })

  // Distinct, over `placed` rather than `kept`, so a page whose every document
  // is a duplicate of another page's still says it was read -- but a source
  // whose every record is an orphan recording, contributing nothing the
  // calendar shows, is not a page the calendar "comes from".
  const perSource = new Set(placed.map((m) => m.source))

  // Rules and printed calendars together, by board. The City Council's rule is
  // printed above the document table on the listing page, so its URL is the
  // listing's -- the same page under both headings, which is what it is.
  const schedules = [
    ...meetingRules().map((rule) => ({ board: rule.board, url: rule.source })),
    ...meetingCalendars().map((calendar) => ({ board: calendar.board, url: calendar.source })),
  ].sort((a, b) => a.board.localeCompare(b.board))

  // The events calendar ahead of them, named for itself. It is where most of
  // the boards on the calendar come from, and it is one page rather than one
  // per board.
  const notices = noticeCalendar()

  return {
    meetings: timed,
    generatedAt: raw.generatedAt,
    sources: {
      // By URL, which is not an arbitrary order: the city's own listing is the
      // shortest of these paths and the two archives sit under it, so sorting
      // the strings puts the listing first with its archives beneath it and the
      // board pages after. Ordering by how many documents came from each would
      // read the other way round, since the archives together hold more of the
      // record than the listing they hang off does.
      documents: [...perSource]
        // The city's own hosts first, ordered by URL -- which sorts the
        // agendas-and-minutes listing above its two archives and the board
        // pages after, the order explained by the archives holding more of the
        // record than the listing they hang off. Then the School Committee's
        // own page on the Haverhill Public Schools site: the city's record of a
        // body haverhillma.gov omits, so part of it, but a step removed. Then
        // anything else -- HC Media's recordings -- last: a supplement, not part
        // of the city's record.
        .sort((a, b) => {
          const rank = (url: string) =>
            url.includes("haverhillma.gov") ? 0 : url.includes("haverhill-ps.org") ? 1 : 2
          return rank(a) - rank(b) || a.localeCompare(b)
        })
        .map((url) => ({ name: pageName(url), url, pdf: url.endsWith(".pdf") })),
      schedules: [
        ...(notices ? [{ name: notices.name, url: notices.url, pdf: false }] : []),
        ...schedules.map(({ board, url }) => ({
          name: board,
          url,
          pdf: url.endsWith(".pdf"),
        })),
      ],
    },
    today: BUILT_ON,
  }
}
