import type { PageLoad } from "./$types"
import { calendar } from "$lib/meetings"
import {
  WEEKDAYS,
  byHourThenBoard,
  statedTime,
  weekOf,
  type Meeting,
  type MeetingKind,
} from "$lib/calendar"

/** One meeting as the week strip draws it: a name, a link, and its documents' kinds. */
export interface WeekEntry {
  id: string
  board: string
  /** One letter per document, in published order. Empty on an expected sitting. */
  kinds: MeetingKind[]
  /**
   * The hour the city stated for the sitting, where a notice or a published
   * schedule states one -- see `statedTime`, which explains why a past sitting
   * usually has none.
   */
  time?: string
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
  ...(statedTime(meeting) ? { time: statedTime(meeting)! } : {}),
})

export const load: PageLoad = () => {
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
      // The order the calendar's own cells use, so the week here and the week
      // there read the same way: by the hour the city stated, then by board.
      .sort(byHourThenBoard)
      .map(entryOf),
  }))

  return {
    today,
    week,
  }
}
