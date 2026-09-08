/**
 * What the city publishes about when its boards sit, turned into dates.
 *
 * Two boards say so, and they say it differently.
 *
 * **The License Commission prints the dates.** Its own page carries a table
 * headed "CALENDAR OF MEETINGS FOR 2026" listing all twelve. Nothing is
 * interpreted here: the dates are used as they are printed. It is by far the
 * better evidence -- every one of this year's past dates on it carries
 * documents, and the two Commission sittings in the data that are *not* on it
 * are special meetings, which is exactly what one would expect.
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

/** A board's own printed list of dates, exactly as scraped. */
export interface MeetingCalendar {
  board: string
  source: string
  year: number
  /** The board's own heading over the table, e.g. `CALENDAR OF MEETINGS FOR 2026`. */
  heading: string
  /** `YYYY-MM-DD`, ascending. */
  dates: string[]
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

/** The printed calendars as scraped, oldest year first. */
export function meetingCalendars(): MeetingCalendar[] {
  return raw.calendars as MeetingCalendar[]
}

/**
 * Every sitting a board has said it will hold, from `today` onwards.
 *
 * A printed calendar contributes the dates it prints; the Council's rule
 * contributes the Tuesdays it names in the year `today` falls in, which is as
 * far as a projection is worth carrying. Both are cut at `today`: nothing here
 * ever speaks about a day that has already happened.
 *
 * `today` is the build date -- the site is prerendered, so this is resolved
 * once when the calendar is built rather than in the reader's browser. A build
 * left unrefreshed for weeks therefore keeps projecting from the day it ran;
 * every push rebuilds, so in practice the horizon moves with the deploy.
 */
export function expectedSittings(today: string): ScheduledSitting[] {
  const fromCalendars = meetingCalendars().flatMap((calendar) =>
    calendar.dates
      .filter((date) => date >= today)
      .map((date) => ({
        board: calendar.board,
        date,
        // No time: the Commission prints the dates and not the hour, and the
        // hour on its last agenda is not evidence about a sitting that has not
        // happened. An event with no time is an all-day one; see $lib/ics.
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

  // Printed dates first, so that a board publishing both a calendar and a rule
  // has the calendar win in `withScheduled`, which keeps the first of any
  // duplicate. Nothing does today, but the better evidence should be the one
  // that survives if one ever does.
  return [...fromCalendars, ...fromRules].sort(
    (a, b) => a.date.localeCompare(b.date) || a.board.localeCompare(b.board),
  )
}
