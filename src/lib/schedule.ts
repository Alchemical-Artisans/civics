/**
 * The Council's standing meeting rule, turned into the Tuesdays it names.
 *
 * The "Agendas and Minutes" page prints a short rule above its document
 * listing: the Council sits every Tuesday at 7:00 PM, with three exceptions
 * covering June, the summer, and the return to weekly meetings in September.
 * `scripts/update-schedule.mjs` scrapes those words into `data/schedule.json`;
 * this file is the reading of them.
 *
 * **It projects forward only.** Sittings are generated from the build date to
 * the end of that year and never into the past, because the rule is not the
 * schedule the Council actually adopts. Checked against the Council's own
 * published 2025 schedule, the rule yields 46 sittings where the adopted
 * schedule has 35: it says "every Tuesday", but the Council skips roughly one
 * Tuesday a month, and it drops 10 June 2025, which the Council did hold. So
 * for a date already past, a rule-Tuesday with no agenda and no minutes is
 * far more likely to be a Tuesday the Council never sat than a gap in the
 * record -- and the documents are the better authority for any day that has
 * already happened. Ahead of today there are no documents to be the authority,
 * and a projection understood as one is worth more than an empty calendar.
 *
 * That is also why these entries are called expected rather than scheduled.
 * The city has announced nothing about a particular Tuesday; the Council has
 * said which Tuesdays it means to sit on, and this is that statement applied
 * to a date.
 */
// The import attribute is redundant under Vite, which resolves JSON itself,
// but the e2e suite reaches this module through Playwright's plain Node
// loader, which refuses a JSON import without it.
import raw from "./data/schedule.json" with { type: "json" }
import type { ScheduledSitting } from "./calendar"

/** A board's rule, exactly as `update-schedule.mjs` scraped it. */
export interface MeetingRule {
  board: string
  intro: string
  exceptions: string[]
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
 * "the second Tuesday after Labor Day" -- the day weekly meetings resume, and
 * the day the summer's every-other-week run stops.
 *
 * Counted from Labor Day itself: the Tuesday of that same week is the first
 * after it, and a week later is the second.
 */
function weeklyResumes(year: number): Date {
  const monday = laborDay(year)
  const firstAfter = add(monday, (2 - monday.getUTCDay() + 7) % 7 || 7)
  return add(firstAfter, 7)
}

/**
 * Every Tuesday the rule names in one calendar year.
 *
 * June is its own exception; July and August come only from the summer's
 * every-other-week run, which may reach into September; September is weekly
 * from the day the rule says weekly resumes; every other month is every
 * Tuesday, which is the rule before any exception touches it.
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

  // "every other week beginning with the second Tuesday of July", running
  // until weekly meetings resume -- which is why early September can carry a
  // sitting that is not part of September's own weekly run.
  for (let d = tuesdays(year, 7)[1]; d < resume; d = add(d, 14)) out.push(d)

  return [...new Set(out.map(iso))].sort()
}

/** The rules as scraped, in the order the page prints them. */
export function meetingRules(): MeetingRule[] {
  return raw.rules as MeetingRule[]
}

/**
 * The sittings the rule names from `today` to the end of that year.
 *
 * `today` is the build date -- the site is prerendered, so this is resolved
 * once when the calendar is built rather than in the reader's browser. A build
 * left unrefreshed for weeks therefore keeps projecting from the day it ran;
 * every push rebuilds, so in practice the horizon moves with the deploy.
 */
export function expectedSittings(today: string): ScheduledSitting[] {
  const year = Number(today.slice(0, 4))
  return meetingRules().flatMap((rule) =>
    rule.board === RULE_AS_READ.board
      ? sittingsIn(year)
          .filter((date) => date >= today)
          .map((date) => ({
            board: rule.board,
            date,
            time: TIME,
            rule: { url: raw.source, intro: rule.intro, exceptions: rule.exceptions },
          }))
      : // A board whose rule nobody has read into dates yet. Adding one means
        // reading its wording and extending `sittingsIn`, not guessing here.
        [],
  )
}
