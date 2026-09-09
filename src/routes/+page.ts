import type { PageLoad } from "./$types"
import { calendar } from "$lib/meetings"
import { WEEKDAYS, weekOf, type Meeting, type MeetingKind } from "$lib/calendar"
import type { BookSummary } from "$lib/budget"

/**
 * The newest written book's own headline figures.
 *
 * The same directory-listing glob `$lib/budget` uses to find which books have
 * a page here, one file deeper: a book carries its own `summary.ts`, and the
 * front page reads whichever belongs to the book the header's menu opens on.
 * Nothing here names a fiscal year, so writing next year's book up moves the
 * card with everything else.
 *
 * Eager, because this runs at build time and the alternative -- a dynamic
 * import in a prerendered load -- buys nothing on a page that ships its data
 * baked in. A book with a page but no summary yields null, and the card falls
 * back to its own words rather than to a broken chart.
 */
const summaries = import.meta.glob<{ SUMMARY: BookSummary }>("./budget/*/summary.ts", {
  eager: true,
})

/** One meeting as the week strip draws it: a name, a link, and its documents' kinds. */
export interface WeekEntry {
  id: string
  board: string
  /** One letter per document, in published order. Empty on an expected sitting. */
  kinds: MeetingKind[]
  /** True where the city has published nothing for the sitting but said it will hold it. */
  expected: boolean
}

/** One day of the strip. */
export interface WeekDay {
  date: string
  /** `Sun`, for the column head. */
  weekday: string
  /** The day of the month, as the calendar's own cells print it. */
  day: number
  isToday: boolean
  meetings: WeekEntry[]
}

const entryOf = (meeting: Meeting): WeekEntry => ({
  id: meeting.id,
  board: meeting.board,
  kinds: meeting.documents.map((document) => document.kind),
  expected: Boolean(meeting.scheduled),
})

export const load: PageLoad = async ({ parent }) => {
  const { budgetBook } = await parent()
  const { meetings, today } = calendar()

  /**
   * The week we are in, trimmed to itself.
   *
   * The whole calendar is a few thousand meetings and the card shows seven
   * days of it, so the page carries the seven days rather than the list: this
   * is prerendered, and everything returned here is baked into the HTML.
   *
   * `today` is the build's date in the city, the same one the calendar page
   * opens on. The strip is therefore as fresh as the last deploy, which is
   * the same bargain the budget calendar's today mark makes -- except that
   * this one cannot be corrected on mount, since the meetings for a week the
   * build did not pick are not in the page to draw.
   */
  const days = weekOf(today)
  const week: WeekDay[] = days.map((date, at) => ({
    date,
    weekday: WEEKDAYS[at],
    day: Number(date.slice(8)),
    isToday: date === today,
    meetings: meetings
      .filter((meeting) => meeting.date === date)
      .sort((a, b) => a.board.localeCompare(b.board))
      .map(entryOf),
  }))

  return {
    today,
    week,
    summary: budgetBook
      ? (summaries[`./budget/${budgetBook.id}/summary.ts`]?.SUMMARY ?? null)
      : null,
  }
}
