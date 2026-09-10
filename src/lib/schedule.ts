/**
 * What the city publishes about when its boards sit, turned into dates.
 *
 * Three kinds of statement, and they are not equally good.
 *
 * **The city posts a notice before each sitting.** Its events calendar is
 * where the Open Meeting Law postings go: this body, this day, this hour, and
 * often the room. That is the strongest evidence there is short of an agenda
 * -- it is about the sitting itself rather than about a pattern the sitting
 * falls under -- and it is the only thing the site has for most of the city's
 * boards, since the document listing covers five and the notices cover around
 * fifty. So a notice wins wherever one exists, and it caps the Council's rule:
 * see `expectedSittings`.
 *
 * **Three boards publish their dates.** The License Commission's page carries a
 * table headed "CALENDAR OF MEETINGS FOR 2026" listing all twelve; the
 * Conservation Commission's carries eighteen, every three weeks on a Thursday,
 * in the middle column of a table whose other two are the filing deadline and
 * the date a postponed meeting moves to; the Planning Board's are not on its
 * page at all but inside a PDF it links, one per year, as a run of labelled
 * blocks. Nothing is interpreted for any of them: the dates are used as
 * printed. This is by far the better evidence -- every past date carries
 * documents, and the handful of sittings in the data that are *not* on them
 * are special meetings and postponements, which is exactly what one would
 * expect.
 *
 * **The City Council prints a rule.** The "Agendas and Minutes" page carries a
 * short standing rule above its document listing: the Council sits every
 * Tuesday at 7:00 PM, with three exceptions covering June, the summer, and the
 * return to weekly meetings in September. That has to be read into dates, and
 * most of this file is that reading.
 *
 * **It projects forward only.** Sittings are generated from the build date to
 * the end of that year and never into the past, because the rule is not the
 * schedule the Council actually adopts. Checked against the Council's own
 * published 2025 schedule, the rule yields 45 sittings where the adopted
 * schedule has 35: it says "every Tuesday", but the Council skips roughly one
 * Tuesday a month, and it drops 10 June 2025, which the Council did hold. So
 * for a date already past, a rule-Tuesday with no agenda and no minutes is
 * far more likely to be a Tuesday the Council never sat than a gap in the
 * record -- and the documents are the better authority for any day that has
 * already happened. Ahead of today there are no documents to be the authority,
 * and a projection understood as one is worth more than an empty calendar.
 *
 * That is also why these entries are called expected rather than scheduled.
 * The city has announced nothing about a particular day; a board has said which
 * days it means to sit on, and this is that statement applied to a date. True
 * of the Commission's printed dates as well as the Council's rule, though it is
 * a good deal truer of the rule.
 */
// The import attribute is redundant under Vite, which resolves JSON itself,
// but the e2e suite reaches this module through Playwright's plain Node
// loader, which refuses a JSON import without it.
import raw from "./data/schedule.json" with { type: "json" }
import type { ScheduledSitting } from "./calendar"

/** A board's rule, exactly as `update-schedule.mjs` scraped it. */
export interface MeetingRule {
  board: string
  source: string
  intro: string
  exceptions: string[]
}

/**
 * One posted notice, exactly as `update-schedule.mjs` read it off the city's
 * events calendar.
 *
 * `board` is the name `scripts/lib/notices.mjs` filed the notice under, which
 * is `meetings.json`'s spelling wherever the board is already there -- that is
 * what lets a notice merge with the agenda the city later publishes for the
 * same day rather than sit beside it.
 */
export interface MeetingNotice {
  board: string
  date: string
  /** The notice's own title, as posted. Quoted on the meeting page. */
  title: string
  /** The notice's page on the events calendar. */
  url: string
  /** The hour it states, e.g. `7:00 PM`. Absent on an all-day posting. */
  time?: string
}

/** A board's own printed list of dates, exactly as scraped. */
export interface MeetingCalendar {
  board: string
  source: string
  year: number
  /** The board's own heading over the table, e.g. `CALENDAR OF MEETINGS FOR 2026`. */
  heading: string
  /**
   * The dates it prints, ascending, each with whatever else its own row says.
   * May run past `year`: a schedule's last row often carries the first sitting
   * of the next.
   */
  sittings: { date: string; related?: { label: string; date: string }[] }[]
  /**
   * The hour the page states, e.g. `7:15 PM`, where it states one. The
   * Conservation Commission's does, in the paragraph over its table; the
   * License Commission's prints dates and nothing else.
   */
  time?: string
  /**
   * Dates the schedule names and then calls off -- the Planning Board's own
   * "NO MEETING VETERANS DAY!" against 11 November 2026.
   *
   * Kept rather than silently dropped so the exclusion is auditable: a parser
   * that quietly lost dates would look exactly like a board that scheduled
   * fewer. Nothing on the site draws them; a sitting the board has already
   * called off is not a sitting, and the calendar says nothing about it.
   */
  cancelled?: string[]
}

/**
 * The wording this file was written against.
 *
 * `schedule.spec.ts` fails when the scrape no longer matches it. The rule is
 * prose, and reading prose into dates is a judgement -- so the judgement is
 * pinned to the exact sentences it was made about, and a reworded rule stops
 * the build instead of being silently reinterpreted.
 */
export const RULE_AS_READ = {
  board: "City Council",
  intro:
    "Regular meetings of the City Council shall be held every Tuesday at 7:00 o'clock P.M. except in:",
  exceptions: [
    "June there shall be a meeting on the first, third and fourth Tuesday --- except when June has five Tuesdays then it will be first, third and fifth.",
    "From July until the second Tuesday after Labor Day, the Council shall meet every other week beginning with the second Tuesday of July.",
    "In September, starting with the second Tuesday after Labor Day, the Council shall return to its regular weekly schedule.",
  ],
} as const

/** The time the rule states, normalised to the form a meeting page prints. */
const TIME = "7:00 PM"

const iso = (d: Date) => d.toISOString().slice(0, 10)
const add = (d: Date, days: number) => new Date(d.getTime() + days * 86400000)

/** Every Tuesday in a month, UTC throughout so nothing slips a day. */
function tuesdays(year: number, month: number): Date[] {
  const first = new Date(Date.UTC(year, month - 1, 1))
  let d = add(first, (2 - first.getUTCDay() + 7) % 7)
  const out: Date[] = []
  while (d.getUTCMonth() === month - 1) {
    out.push(d)
    d = add(d, 7)
  }
  return out
}

/** Labor Day: the first Monday in September. */
function laborDay(year: number): Date {
  const first = new Date(Date.UTC(year, 8, 1))
  return add(first, (1 - first.getUTCDay() + 7) % 7)
}

/**
 * "the second Tuesday after Labor Day" -- the day weekly meetings resume.
 *
 * Counted from Labor Day itself: the Tuesday of that same week is the first
 * after it, and a week later is the second. The Council's published 2025
 * schedule confirms the counting. Labor Day fell on 1 September that year, so
 * this gives 9 September -- and the schedule is headed "Amended - removal of
 * 9/9/25 due to municipal preliminary election", which only makes sense if the
 * Council had scheduled 9 September in the first place.
 */
function weeklyResumes(year: number): Date {
  const monday = laborDay(year)
  const firstAfter = add(monday, (2 - monday.getUTCDay() + 7) % 7 || 7)
  return add(firstAfter, 7)
}

/**
 * Every Tuesday the rule names in one calendar year.
 *
 * June is its own exception; July and August are the summer's every-other-week
 * run and nothing else; September is weekly from the day the rule says weekly
 * resumes, and holds nothing before it; every other month is every Tuesday,
 * which is the rule before any exception touches it.
 */
export function sittingsIn(year: number): string[] {
  const resume = weeklyResumes(year)
  const out: Date[] = []

  for (let month = 1; month <= 12; month++) {
    const all = tuesdays(year, month)
    if (month === 6) {
      // First, third and fourth -- or first, third and fifth in a June with
      // five Tuesdays.
      out.push(all[0], all[2], all.length === 5 ? all[4] : all[3])
    } else if (month === 7 || month === 8) {
      // Wholly inside the summer run below.
    } else if (month === 9) {
      out.push(...all.filter((d) => d >= resume))
    } else {
      out.push(...all)
    }
  }

  // "every other week beginning with the second Tuesday of July" -- July and
  // August, and no further.
  //
  // Read literally, "until the second Tuesday after Labor Day" would let the
  // run put one more sitting in early September, a fortnight after the last
  // August one. It does not: the third clause governs September and says the
  // month's meetings *start* with the second Tuesday after Labor Day, so
  // nothing in September precedes them. The Council's own published 2025
  // schedule settles it -- the summer run there ends on 19 August and the
  // schedule has no sitting on 2 September, which is exactly the date the
  // literal reading invents.
  for (let d = tuesdays(year, 7)[1]; d.getUTCMonth() <= 7; d = add(d, 14)) out.push(d)

  return [...new Set(out.map(iso))].sort()
}

/** The rules as scraped, in the order the page prints them. */
export function meetingRules(): MeetingRule[] {
  return raw.rules as MeetingRule[]
}

/**
 * The events calendar itself: what the city calls it, and where it is.
 *
 * The footer lists it once however many boards its notices account for, so
 * unlike a printed calendar -- which is one board's own page -- this is one
 * page for all of them, and is recorded by the scrape rather than rebuilt out
 * of a notice's URL.
 */
export function noticeCalendar(): { name: string; url: string } | null {
  return raw.noticeCalendar ?? null
}

/** The posted notices as scraped, oldest first. */
export function meetingNotices(): MeetingNotice[] {
  return (raw.notices ?? []) as MeetingNotice[]
}

/** The printed calendars as scraped, oldest year first. */
export function meetingCalendars(): MeetingCalendar[] {
  return raw.calendars as MeetingCalendar[]
}

/**
 * Every sitting a board has said it will hold, from `today` onwards.
 *
 * A posted notice contributes the day it names; a printed calendar the dates
 * it prints; the Council's rule the Tuesdays it names in the year `today`
 * falls in, which is as far as a projection is worth carrying. All three are
 * cut at `today`: nothing here ever speaks about a day that has already
 * happened.
 *
 * **A notice beats a rule outright, and silences it while it lasts.** The
 * Council's rule says every Tuesday; the Council actually skips roughly one a
 * month, and the notices are the days it has posted. Left to run alongside
 * them, the rule would put six sittings on the rest of 2026 that the Council
 * has not called -- 13 October, three Tuesdays in November, two in December --
 * each of them looking exactly like the ten it has. So for a board that has
 * posted any notice, the rule is capped at the last posted date and picks up
 * only beyond it, where the postings run out and a projection is again better
 * than an empty calendar.
 *
 * That cap assumes the postings are complete as far as they go, which is true
 * of the only board this touches: the Council posts its year as a recurring
 * series, so the last notice is December's rather than next week's. A board
 * that posted one date far ahead and nothing between would have its rule
 * suppressed across the gap -- worth knowing if a second rule is ever read
 * into dates, and `schedule.spec.ts` pins the behaviour either way.
 *
 * `today` is the build date -- the site is prerendered, so this is resolved
 * once when the calendar is built rather than in the reader's browser. A build
 * left unrefreshed for weeks therefore keeps projecting from the day it ran;
 * every push rebuilds, so in practice the horizon moves with the deploy.
 */
export function expectedSittings(today: string): ScheduledSitting[] {
  const fromNotices = meetingNotices()
    .filter((notice) => notice.date >= today)
    .map((notice) => ({
      board: notice.board,
      date: notice.date,
      // The hour the notice itself states. Absent on an all-day posting, which
      // is what the events calendar records a legal notice as -- and an event
      // with no time is an all-day one rather than one given an invented hour.
      ...(notice.time ? { time: notice.time } : {}),
      source: {
        kind: "notice" as const,
        url: notice.url,
        title: notice.title,
      },
    }))

  // The last day each board has posted a notice for. A rule is capped here.
  const postedThrough = new Map<string, string>()
  for (const notice of fromNotices) {
    const last = postedThrough.get(notice.board)
    if (!last || notice.date > last) postedThrough.set(notice.board, notice.date)
  }

  const fromCalendars = meetingCalendars().flatMap((calendar) =>
    calendar.sittings
      .filter((sitting) => sitting.date >= today)
      .map((sitting) => ({
        board: calendar.board,
        date: sitting.date,
        // The board's own other columns for this row -- a filing deadline, a
        // postponement date. Carried onto the sitting rather than left in the
        // source, because they are facts about the day rather than about the
        // page it was read from.
        ...(sitting.related ? { related: sitting.related } : {}),
        // Only where the page states one. A board that prints dates and no
        // hour gets none: the hour on its last agenda is not evidence about a
        // sitting that has not happened, and an event with no time is an
        // all-day one rather than an invented one. See $lib/ics.
        ...(calendar.time ? { time: calendar.time } : {}),
        source: {
          kind: "calendar" as const,
          url: calendar.source,
          heading: calendar.heading,
        },
      })),
  )

  const year = Number(today.slice(0, 4))
  const fromRules = meetingRules().flatMap((rule) =>
    rule.board === RULE_AS_READ.board
      ? sittingsIn(year)
          .filter((date) => date >= today)
          // Only past the last day this board has posted a notice for. Inside
          // that range the city has said which days it sits, and the rule's
          // guess at the same range would contradict it.
          .filter((date) => date > (postedThrough.get(rule.board) ?? ""))
          .map((date) => ({
            board: rule.board,
            date,
            time: TIME,
            source: {
              kind: "rule" as const,
              url: rule.source,
              intro: rule.intro,
              exceptions: rule.exceptions,
            },
          }))
      : // A board whose rule nobody has read into dates yet. Adding one means
        // reading its wording and extending `sittingsIn`, not guessing here.
        [],
  )

  // Best evidence first, so that a board saying the same thing twice has the
  // better statement win in `withScheduled`, which keeps the first of any
  // duplicate. A notice is about this sitting; a printed calendar is a year's
  // intention stated in advance; a rule is a pattern the day falls under.
  // Four boards publish both a notice and a calendar, and the notice is what
  // the meeting page should quote.
  return [...fromNotices, ...fromCalendars, ...fromRules].sort(
    (a, b) => a.date.localeCompare(b.date) || a.board.localeCompare(b.board),
  )
}
