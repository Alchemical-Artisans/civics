/**
 * One entry on a timeline rail, drawn by `Timeline.svelte`.
 *
 * The type is here rather than in the component because a `<script lang="ts">`
 * block is the instance script and exports nothing a sibling module can
 * import; the two things that build these lists -- a project's registry and a
 * hearing's own record -- both want to name the shape they are building.
 */
export interface TimelineEntry {
  /** The fragment this entry answers to, where anything links to one. */
  id?: string
  /**
   * `YYYY-MM-DD`, where the entry has a day. A step the record does not date
   * -- something expected but not yet scheduled -- leaves it off, and is
   * drawn with no date line and sorted after everything dated.
   */
  date?: string
  /**
   * What to print instead of the formatted date, where the date is known to
   * less precision than a day. `/issues/drought`'s first step is a 2012 loan order
   * whose own record the city no longer publishes: the year is what is
   * known, and "January 1, 2012" would be a precision nobody has.
   */
  dateLabel?: string
  /** The last day of a run of days, like early voting's. */
  through?: string
  /** A line above the title: the board and the agenda's number for an item. */
  eyebrow?: string
  title: string
  /** Where the title goes, where it goes anywhere. */
  href?: string
  /** A line under the title: the vote the Council recorded, say. */
  note?: string
}

/**
 * The last day an entry covers: a run of days ends on its `through`.
 *
 * An entry with no date at all is never behind the reader -- it is something
 * expected whose day nobody has set -- so it sorts after every dated entry
 * and stays out of the fold.
 */
export const entryEnd = (entry: TimelineEntry) => entry.through ?? entry.date ?? "9999-12-31"

/**
 * A timeline split into what is behind the reader and what is still ahead.
 *
 * `projects.ts` has the same split over a project's own `Entry`, which is
 * where this one came from, and the two are not one function because they
 * read different shapes: a project entry is an agenda item or a run of days
 * and knows its own date through `entryDate`, where a `TimelineEntry` has
 * already been flattened to `date` and `through`.
 *
 * An entry is past only once its last day has gone -- a run of days is still
 * ahead on the day it ends -- and a sitting today is not past either, so the
 * item that set a deadline stays in view on the day it is read out.
 */
export function splitTimelineAtToday(
  entries: TimelineEntry[],
  today: string,
): { past: TimelineEntry[]; upcoming: TimelineEntry[] } {
  return {
    past: entries.filter((entry) => entryEnd(entry) < today),
    upcoming: entries.filter((entry) => entryEnd(entry) >= today),
  }
}
