/**
 * Pure date/grouping helpers behind the meeting calendar.
 *
 * Everything works on `YYYY-MM-DD` strings and UTC-constructed Dates. Using the
 * local-time Date constructor here would shift days across timezones and land
 * meetings on the wrong cell for anyone west of UTC.
 */

export type MeetingKind = "agenda" | "minutes" | "other"

export interface MeetingDocument {
  title: string
  date: string | null
  board: string
  kind: MeetingKind
  fileUrl: string | null
  pageUrl: string
  /** The scraper's id for this document. Not a route; see `Meeting.written`. */
  docId: string | null
}

/**
 * What the city has published saying a sitting will be held, where that is not
 * a document about the sitting itself.
 *
 * Two boards say so, in two different ways, and the difference is worth keeping
 * rather than flattening -- one is far better evidence than the other.
 *
 * A `calendar` is a list of dates the board printed: the License Commission's
 * own page carries a table of the twelve for this year. Nothing is interpreted
 * and nothing can be misread. Every one of this year's past dates on it carries
 * documents.
 *
 * A `rule` is a standing statement about which days a board sits, printed above
 * the document listing: the Council sits every Tuesday, with exceptions. It has
 * to be read into dates, and it over-generates against the schedule the Council
 * actually adopts -- see `$lib/schedule`.
 */
export type SittingSource =
  | { kind: "calendar"; url: string; heading: string }
  | { kind: "rule"; url: string; intro: string; exceptions: string[] }

/**
 * One sitting the city has said will be held, ahead of any document about it.
 *
 * Read off a board's published dates or its standing rule, these show sittings
 * the documents cannot: **a sitting that has not happened yet has no agenda**,
 * so a calendar built only from what the city has published is blank from today
 * forward, which is precisely the part a reader wanting to attend one needs.
 *
 * Scraped by `scripts/update-schedule.mjs` and turned into dates by
 * `$lib/schedule`, which projects forward only and explains at length why.
 */
export interface ScheduledSitting {
  board: string
  /** `YYYY-MM-DD`, a day the board's own calendar or rule names. */
  date: string
  /** Start time where the source states one, e.g. `"7:00 PM"`. */
  time?: string
  /**
   * Other dates the board's schedule prints on this sitting's own row, labelled
   * by its own column headers.
   *
   * The Conservation Commission's table gives two: the deadline for filing a
   * permit application to be heard at the sitting, and the date the sitting
   * moves to if it is postponed. Neither is a sitting and neither is ever
   * treated as one -- they would treble that board's calendar -- but they are
   * what the board published about the day, and a reader looking at it wants
   * them.
   */
  related?: { label: string; date: string }[]
  /** What the city published that puts this sitting on the calendar. */
  source: SittingSource
}

/**
 * One sitting of one board, and every document the city published for it.
 *
 * The city publishes an agenda and minutes as separate records, but they are
 * two documents about the same meeting, so the calendar shows one entry per
 * meeting rather than one per document. Board and date are the identity, which
 * is the most the scrape supports: nothing in the data ties a document to a
 * sitting except the board that held it and the day it was held.
 *
 * A meeting can carry more than two documents. Fourteen have three and two
 * have four -- a revised agenda alongside the original, executive-session
 * minutes kept apart from the ordinary ones, or a special permit decision
 * recorded as minutes of its own. Whether such a decision was taken at that
 * sitting or at a separate one the same day is not something the records say,
 * and grouping them together assumes the former.
 */
export interface Meeting {
  /** `city-council-2026-08-25`; the meeting page's route segment. */
  id: string
  board: string
  date: string
  /**
   * Published order, agendas before minutes. Empty on a sitting that reached
   * the calendar from a published schedule rather than from a document -- see
   * `scheduled`, which is set on exactly those.
   */
  documents: MeetingDocument[]
  /**
   * What the city published saying this sitting would be held, set only where
   * it has published no document for it at all.
   *
   * A sitting here is **expected, not announced**: the board has said which
   * days it means to sit on, and this is that statement applied to a date.
   * Whether it sits, and what it takes up, is what the agenda will say when the
   * city publishes one -- at which point this stops being an expected sitting
   * and becomes an ordinary meeting with documents under it.
   *
   * Only ever a future date. See `$lib/schedule` for why neither source is
   * trusted backwards.
   */
  scheduled?: ScheduledSitting
  /**
   * True when somebody has written this meeting up by hand, which is to say
   * when `src/routes/calendar/meetings/<id>/+page.svelte` exists. The route
   * decides what the reader sees -- a static directory wins over `[meeting]` --
   * so this is only here to keep the generated route from prerendering an id a
   * written page already covers.
   */
  written: boolean
}

/**
 * The route segment for a meeting: the board slugged, then the date.
 *
 * Ampersands and slashes appear in board names ("Administration & Finance
 * Committee"), so everything outside a-z0-9 collapses to a single dash.
 */
export function meetingId(board: string, date: string): string {
  const slug = board
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `${slug}-${date}`
}

/** Agendas first, then minutes, then anything else; stable within a kind. */
const KIND_ORDER: Record<MeetingKind, number> = { agenda: 0, minutes: 1, other: 2 }

/**
 * Collapse documents into the meetings they belong to.
 *
 * Undated documents are dropped: they cannot be placed on a calendar, and the
 * count of them is disclosed in the footer instead. Order is by date, then
 * board, so a day's meetings read alphabetically.
 */
export function groupIntoMeetings(
  documents: MeetingDocument[],
  written: (id: string) => boolean = () => false,
): Meeting[] {
  const byId = new Map<string, Meeting>()
  for (const doc of documents) {
    if (!doc.date) continue
    const id = meetingId(doc.board, doc.date)
    const found = byId.get(id)
    if (found) found.documents.push(doc)
    else byId.set(id, { id, board: doc.board, date: doc.date, documents: [doc], written: false })
  }
  const meetings = [...byId.values()]
  for (const m of meetings) {
    m.documents.sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind])
    m.written = written(m.id)
  }
  return meetings.sort((a, b) => a.date.localeCompare(b.date) || a.board.localeCompare(b.board))
}

/**
 * Add the sittings a board has said it will hold and no document covers.
 *
 * Board and date are the identity here exactly as they are for a document, so
 * an expected date the city has since published an agenda for is already on the
 * calendar and is left alone -- these are only ever consulted for dates nothing
 * else accounts for. That also means an agenda for a date no calendar or rule
 * named is unaffected: the License Commission's special meetings of 20 May and
 * 18 June are on the calendar from their documents and are none the worse for
 * being absent from the Commission's published dates. The documents are the
 * record; this only fills what they leave empty.
 *
 * Pure, and takes its sittings as an argument rather than reading the JSON, for
 * the same reason the rest of this file does: it tests without a fixture file
 * and without rendering.
 */
export function withScheduled(
  meetings: Meeting[],
  sittings: ScheduledSitting[],
  written: (id: string) => boolean = () => false,
): Meeting[] {
  const known = new Set(meetings.map((m) => m.id))
  const out = [...meetings]
  for (const sitting of sittings) {
    const id = meetingId(sitting.board, sitting.date)
    // Two boards cannot collide, but a board with both a rule and a published
    // calendar could name one date twice, so this guards against duplicates
    // within the projection as much as against the documents.
    if (known.has(id)) continue
    known.add(id)
    out.push({
      id,
      board: sitting.board,
      date: sitting.date,
      documents: [],
      scheduled: sitting,
      written: written(id),
    })
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || a.board.localeCompare(b.board))
}

/**
 * What a document says about attending its meeting, read off the document by
 * whoever wrote the page up.
 *
 * None of this comes from the scrape. `meetings.json` carries a clock time in
 * `rawMeetingDate`, but it is a mix of real times and placeholders rendered
 * without timezone conversion -- 41 City Council agendas say 11:00 PM for a
 * body that meets at 7:00 -- so it is not displayed anywhere. See
 * docs/dates.md. A time here is one a person read off the page.
 *
 * Every field is optional: minutes rarely state a time, and plenty of
 * documents offer no remote option.
 */
export interface MeetingDetails {
  /** Start time exactly as printed, e.g. `"7:00 PM"`. */
  time?: string
  location?: {
    /** Shown to the reader, verbatim from the document. */
    name: string
    /**
     * What to hand a map service. Kept apart from `name` because the printed
     * form is usually a room inside a building, and "Room 202" geocodes to
     * nothing -- so this is the street address, with the city added.
     */
    mapQuery: string
  }
  /**
   * The remote option, when the document gives one. `url` is the join link;
   * `meetingId` and `passcode` are shown beside it when the document prints
   * them, since a reader dialling in from a phone needs them and should not
   * have to dig them out of the notice.
   */
  remote?: {
    url: string
    meetingId?: string
    passcode?: string
  }
  /**
   * Standing boilerplate from the head of the document -- Open Meeting Law
   * status, recording notices -- one string per paragraph. It is about the
   * meeting rather than about any item on it, so it belongs up in the header
   * behind a disclosure rather than in the write-up, where it would push the
   * agenda itself below the fold on every page.
   */
  notice?: string[]
}

export interface DayCell {
  date: string
  day: number
  inMonth: boolean
  isToday: boolean
}

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

/**
 * The city's timezone, and the one every "today" on this site is a date in.
 *
 * Haverhill is on US Eastern time, which is four or five hours behind UTC, so
 * `new Date().toISOString()` names tomorrow from eight in the evening onwards.
 * A calendar that opens on the wrong month, or highlights the wrong cell, for
 * everyone reading it after dinner is a bug in the one thing this site is for.
 *
 * Nothing else here converts between zones. Dates are `YYYY-MM-DD` strings and
 * are parsed with `Date.UTC(...)` throughout, which is what stops a stored date
 * sliding a day; this is only about which day *now* is.
 */
export const TIMEZONE = "America/New_York"

/**
 * Today's date in the city, as `YYYY-MM-DD`.
 *
 * Built from `formatToParts` rather than a locale whose format happens to be
 * ISO, so it cannot quietly depend on the runtime's locale data being what one
 * particular tag means this year.
 */
export function easternDate(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const at = (type: string) => parts.find((p) => p.type === type)!.value
  return `${at("year")}-${at("month")}-${at("day")}`
}

/** `2026-08-27` -> `2026-08`. */
export function monthKey(date: string): string {
  return date.slice(0, 7)
}

/** `2026-08` -> `August 2026`. */
export function formatMonth(key: string): string {
  const [y, m] = key.split("-").map(Number)
  return `${MONTH_NAMES[m - 1]} ${y}`
}

/** `2026-08-27` -> `Thursday, August 27, 2026`. */
export function formatLongDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number)
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return `${names[weekday]}, ${MONTH_NAMES[m - 1]} ${d}, ${y}`
}

const isoOf = (dt: Date) => dt.toISOString().slice(0, 10)

/** Shift a `YYYY-MM` key by `delta` months. */
export function addMonths(key: string, delta: number): string {
  const [y, m] = key.split("-").map(Number)
  const dt = new Date(Date.UTC(y, m - 1 + delta, 1))
  return isoOf(dt).slice(0, 7)
}

/**
 * Build the Sunday-aligned grid for a month, padded with the leading/trailing
 * days needed to fill whole weeks.
 */
export function buildMonthGrid(key: string, today?: string): DayCell[][] {
  const [year, month] = key.split("-").map(Number)
  const first = new Date(Date.UTC(year, month - 1, 1))
  const start = new Date(first)
  start.setUTCDate(1 - first.getUTCDay())

  const weeks: DayCell[][] = []
  const cursor = new Date(start)
  // Six rows covers every month layout; trim trailing all-outside weeks after.
  for (let w = 0; w < 6; w++) {
    const week: DayCell[] = []
    for (let d = 0; d < 7; d++) {
      const date = isoOf(cursor)
      week.push({
        date,
        day: cursor.getUTCDate(),
        inMonth: cursor.getUTCMonth() === month - 1,
        isToday: date === today,
      })
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    weeks.push(week)
  }
  while (weeks.length && weeks.at(-1)!.every((c) => !c.inMonth)) weeks.pop()
  return weeks
}

/** Index meetings by their date string. */
export function groupByDate(meetings: Meeting[]): Map<string, Meeting[]> {
  const out = new Map<string, Meeting[]>()
  for (const m of meetings) {
    const bucket = out.get(m.date)
    if (bucket) bucket.push(m)
    else out.set(m.date, [m])
  }
  for (const list of out.values()) list.sort((a, b) => a.board.localeCompare(b.board))
  return out
}

/** Every month between the earliest and latest meeting, oldest first. */
export function monthsCovered(meetings: Meeting[]): string[] {
  const keys = meetings.map((m) => monthKey(m.date))
  if (!keys.length) return []
  keys.sort()
  const out: string[] = []
  for (let k = keys[0]; k <= keys.at(-1)!; k = addMonths(k, 1)) out.push(k)
  return out
}

/** Distinct board names, alphabetical. */
export function boardsOf(meetings: Meeting[]): string[] {
  return [...new Set(meetings.map((m) => m.board))].sort((a, b) => a.localeCompare(b))
}
