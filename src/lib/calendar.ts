/**
 * Pure date/grouping helpers behind the meeting calendar.
 *
 * Everything works on `YYYY-MM-DD` strings and UTC-constructed Dates. Using the
 * local-time Date constructor here would shift days across timezones and land
 * meetings on the wrong cell for anyone west of UTC.
 */

export type MeetingKind = "agenda" | "minutes" | "other"

export interface Meeting {
  title: string
  date: string | null
  board: string
  kind: MeetingKind
  fileUrl: string | null
  pageUrl: string
  /**
   * The document's page on this site, or null when nobody has written one --
   * in which case the calendar links straight to the city's PDF. Pages are
   * written by hand; see docs/document-pages.md.
   */
  docId: string | null
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

/** Index meetings by their date string; undated entries are dropped. */
export function groupByDate(meetings: Meeting[]): Map<string, Meeting[]> {
  const out = new Map<string, Meeting[]>()
  for (const m of meetings) {
    if (!m.date) continue
    const bucket = out.get(m.date)
    if (bucket) bucket.push(m)
    else out.set(m.date, [m])
  }
  for (const list of out.values()) {
    list.sort((a, b) => a.board.localeCompare(b.board) || a.kind.localeCompare(b.kind))
  }
  return out
}

/** Every month between the earliest and latest meeting, oldest first. */
export function monthsCovered(meetings: Meeting[]): string[] {
  const keys = meetings.filter((m) => m.date).map((m) => monthKey(m.date!))
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
