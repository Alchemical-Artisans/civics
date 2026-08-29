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
  /** Published order, agendas before minutes. Never empty. */
  documents: MeetingDocument[]
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
  /** Join URL for the remote option, when the document gives one. */
  remote?: string
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
