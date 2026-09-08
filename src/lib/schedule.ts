/**
 * The meeting schedules the city publishes, turned into dated sittings.
 *
 * A board's schedule for a calendar year is one of the documents in the
 * "Agendas and Minutes" listing, but it is not about any single sitting -- it
 * is a page of month-and-days saying which sittings are to be held. Read that
 * way it puts meetings on the calendar the documents cannot: a sitting that has
 * not happened yet has no agenda, and a sitting the city never published
 * anything for has nothing at all.
 *
 * **No scraper produces this file.** The one schedule the city has published is
 * a scan -- a Toshiba copier's JPEG wrapped in a PDF, with no text layer to
 * parse -- so it is transcribed by hand into `data/schedule.json`, the way the
 * FY2027 budget book's own pages were. `glossary.json` is the other file in
 * `data/` no scraper writes.
 *
 * The JSON keeps the document's own shape, a month and its days, rather than a
 * flat list of dates: that is what the page prints, so a transcription can be
 * checked against it line by line. Expanding it into `YYYY-MM-DD` is this
 * file's whole job.
 */
import raw from "./data/schedule.json"
import type { ScheduledSitting } from "./calendar"

/** A schedule as transcribed: the document, what it prints once, and its months. */
export interface Schedule {
  board: string
  year: number
  document: { title: string; pageUrl: string; fileUrl: string }
  time?: string
  location?: { name: string; mapQuery: string }
  months: { month: number; days: number[] }[]
}

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * Every date a schedule lists, oldest first.
 *
 * The dates are built as strings rather than through `Date`, so nothing here
 * can slip a day the way a local-time constructor does -- the same rule the
 * rest of the calendar keeps. Nothing validates that a day exists in its month;
 * a schedule listing 31 September would be a transcription error, and inventing
 * a date for it would hide the mistake rather than surface it.
 */
export function sittingsOf(schedule: Schedule): ScheduledSitting[] {
  const out: ScheduledSitting[] = []
  for (const { month, days } of schedule.months) {
    for (const day of days) {
      out.push({
        board: schedule.board,
        date: `${schedule.year}-${pad(month)}-${pad(day)}`,
        time: schedule.time,
        location: schedule.location,
        document: schedule.document,
      })
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date))
}

/** Every sitting every transcribed schedule lists, oldest first. */
export function scheduledSittings(): ScheduledSitting[] {
  return (raw.schedules as Schedule[])
    .flatMap(sittingsOf)
    .sort((a, b) => a.date.localeCompare(b.date) || a.board.localeCompare(b.board))
}
