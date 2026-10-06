/**
 * Projects: one thing the city is doing, followed across every sitting that
 * touched it.
 *
 * The calendar is organised the way the city publishes -- a sitting, then its
 * agenda, then the items on it -- and that is the wrong shape for anything
 * that takes more than one evening. An election is a warrant the Council
 * receives, an early-voting schedule the Clerk announces, a posting deadline
 * and a polling day; on the calendar those are four entries in two months
 * with nothing joining them. A project is the join: a page of its own, with a
 * timeline of every agenda item that bears on it, and each of those items
 * linking back.
 *
 * The timeline is declared here, in one place, rather than by each item page
 * saying which project it belongs to: the project page has to list its items
 * in order, and the meeting layout has to find an item's project, so one of
 * them would otherwise be restating the other. An item is named by its
 * meeting id and its directory name, the two segments of its URL -- the same
 * identity the layout already reads off the URL to find the meeting.
 *
 * A project page itself is hand-written, one static route each under
 * `src/routes/projects/`, the same way a meeting write-up is: what an election
 * needs (a map, a ballot per precinct) is not what a building project would.
 */

/** An agenda item on a project's timeline. */
import { Router } from "./router"

export interface ItemEntry {
  kind: "item"
  /** The meeting's id, e.g. `city-council-2026-10-06`. */
  meeting: string
  /** The item page's directory name beneath the meeting. */
  item: string
  board: string
  /** The agenda's own number for the item, as printed. */
  number: string
  title: string
}

/**
 * A date a document on the timeline sets, rather than a sitting: early voting
 * opening, a filing deadline, the election itself. Shown on the timeline so a
 * reader can see what the agenda items were *for*, and where the process
 * stands, but drawn apart from the agenda items, since nobody met.
 */
export interface DateEntry {
  kind: "date"
  date: string
  /** The last day of a run of days, like early voting's. */
  through?: string
  title: string
  /** The agenda item whose document states the date. */
  from: { meeting: string; item: string }
}

export type Entry = ItemEntry | DateEntry

export interface Project {
  slug: string
  title: string
  /**
   * What sort of undertaking it is, which is how the bar's Projects menu
   * groups them. Elections are the one kind so far; the menu's budgets are
   * fiscal years from `budget.json` rather than entries here.
   */
  kind: "election"
  entries: Entry[]
}

export const PROJECTS: Project[] = [
  {
    slug: "2026-state-election",
    title: "2026 State Election",
    kind: "election",
    entries: [
      {
        kind: "item",
        meeting: "city-council-2026-07-14",
        item: "polling-place-changes",
        board: "City Council",
        number: "8.2",
        title: "Polling Place Changes",
      },
      {
        kind: "item",
        meeting: "city-council-2026-07-14",
        item: "primary-election-warrant",
        board: "City Council",
        number: "8.3",
        title: "Election Warrant, 2026 State Primary",
      },
      {
        kind: "item",
        meeting: "city-council-2026-08-11",
        item: "early-voting-schedule",
        board: "City Council",
        number: "8.1",
        title: "Early Voting Schedule and Election Deadlines, State Primary",
      },
      {
        kind: "date",
        date: "2026-08-22",
        through: "2026-08-28",
        title:
          "Early voting for the State Primary, in the Early Voting Room on the basement level of City Hall",
        from: { meeting: "city-council-2026-08-11", item: "early-voting-schedule" },
      },
      {
        kind: "date",
        date: "2026-08-25",
        title: "Vote-by-mail applications for the State Primary must be received by 5:00 PM",
        from: { meeting: "city-council-2026-08-11", item: "early-voting-schedule" },
      },
      {
        kind: "date",
        date: "2026-08-25",
        title: "Primary warrant must be posted, at least seven days before the primary",
        from: { meeting: "city-council-2026-07-14", item: "primary-election-warrant" },
      },
      {
        kind: "date",
        date: "2026-09-01",
        title: "State Primary, 7:00 A.M. to 8:00 P.M.",
        from: { meeting: "city-council-2026-07-14", item: "primary-election-warrant" },
      },
      {
        kind: "item",
        meeting: "city-council-2026-10-06",
        item: "early-voting-schedule",
        board: "City Council",
        number: "8.1",
        title: "Early Voting Schedule and Election Deadlines",
      },
      {
        kind: "item",
        meeting: "city-council-2026-10-06",
        item: "election-warrant",
        board: "City Council",
        number: "8.2",
        title: "Election Warrant, 2026 State Election",
      },
      {
        kind: "date",
        date: "2026-10-17",
        through: "2026-10-30",
        title: "Early voting, in the Early Voting Room on the basement level of City Hall",
        from: { meeting: "city-council-2026-10-06", item: "early-voting-schedule" },
      },
      {
        kind: "date",
        date: "2026-10-27",
        title: "Vote-by-mail applications must be received by 5:00 PM",
        from: { meeting: "city-council-2026-10-06", item: "early-voting-schedule" },
      },
      {
        kind: "date",
        date: "2026-10-27",
        title: "Warrant must be posted, at least seven days before the election",
        from: { meeting: "city-council-2026-10-06", item: "election-warrant" },
      },
      {
        kind: "date",
        date: "2026-11-03",
        title: "Election Day, 7:00 A.M. to 8:00 P.M.",
        from: { meeting: "city-council-2026-10-06", item: "election-warrant" },
      },
    ],
  },
]

/** The date an entry falls on: a sitting's is the tail of its meeting id. */
export function entryDate(entry: Entry): string {
  return entry.kind === "item" ? entry.meeting.slice(-10) : entry.date
}

/**
 * The fragment an entry answers to on its project's page. An agenda item's is
 * its own URL's last two segments, so it is unique and readable in an address
 * bar; a date's is never linked to, but takes one anyway so every entry can be
 * pointed at.
 */
export function entryId(entry: Entry): string {
  return entry.kind === "item"
    ? `${entry.meeting}-${entry.item}`
    : `${entry.date}-${entry.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`
}

/** A project's entries in date order, agenda items ahead of dates on the same day. */
export function timeline(project: Project): Entry[] {
  return project.entries
    .map((entry, i) => ({ entry, i }))
    .sort(
      (a, b) =>
        entryDate(a.entry).localeCompare(entryDate(b.entry)) ||
        Number(a.entry.kind === "date") - Number(b.entry.kind === "date") ||
        a.i - b.i,
    )
    .map(({ entry }) => entry)
}

/**
 * The last day an entry covers: a run of days like early voting ends on its
 * `through`, anything else on its own date.
 */
export function entryEnd(entry: Entry): string {
  return entry.kind === "date" && entry.through ? entry.through : entryDate(entry)
}

/**
 * A timeline's entries split at today, in the order `timeline` gives them.
 *
 * What is behind a reader is the record, which the page has to carry but which
 * few come for; what is ahead is the part they can still act on, so the page
 * shows that and folds the rest away. An entry is past only once its last day
 * has gone -- early voting is still ahead on the day it ends -- and a sitting
 * today is not yet past either, so the agenda item that set a deadline stays
 * in view on the day it is read out.
 */
export function splitAtToday(
  entries: Entry[],
  today: string,
): { past: Entry[]; upcoming: Entry[] } {
  return {
    past: entries.filter((entry) => entryEnd(entry) < today),
    upcoming: entries.filter((entry) => entryEnd(entry) >= today),
  }
}

/** Every project an agenda item is on, with the entry naming it. */
export function projectsOf(
  meeting: string,
  item: string,
): { project: Project; entry: ItemEntry }[] {
  return PROJECTS.flatMap((project) =>
    project.entries
      .filter((e): e is ItemEntry => e.kind === "item" && e.meeting === meeting && e.item === item)
      .map((entry) => ({ project, entry })),
  )
}

/**
 * Where an agenda's own line for an item should point.
 *
 * An item that is part of a project opens the project, on its own entry: a
 * reader following the agenda wants to see what the item is a step in, and
 * the project page puts that step in the context of every other, with the
 * item's own write-up one click further on its timeline. An item that is in
 * no project opens its write-up, as every item did before projects existed.
 *
 * A project page rather than the item page even though the item page still
 * exists: the agenda used to hand the reader the warrant's seven pages, when
 * the reader who clicks "Election Warrant" from an agenda wants to know where
 * they vote and what is on the ballot -- which the project answers and the
 * warrant only implies.
 */
export function agendaHref(meeting: string, item: string): string {
  const [first] = projectsOf(meeting, item)
  return first
    ? Router.project(first.project.slug, entryId(first.entry))
    : Router.meetingItem(meeting, item)
}
