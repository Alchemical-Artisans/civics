/**
 * What the city publishes about when its boards sit, which is never a document.
 *
 * Two boards say so, in two different ways, and neither is in the document
 * listing at all -- both are ordinary HTML on a page, which is why the calendar
 * could not see either while it read only the listing.
 *
 * **The City Council prints a rule.** Above the document listing on the
 * "Agendas and Minutes" page: a heading naming the board, a sentence saying
 * when it sits, and a list of exceptions. It describes every Tuesday the
 * Council intends to sit, for any year, and has to be read into dates --
 * `src/lib/schedule.ts` does that, and is kept honest by a test pinning the
 * exact wording it was written against, so a reworded rule fails the build
 * rather than being quietly misread.
 *
 * **The License Commission prints the dates.** Its own page carries a table
 * headed "CALENDAR OF MEETINGS FOR 2026" with the twelve of them in it.
 * Nothing has to be interpreted, and nothing here can misread it: the dates
 * are the dates. It is much the better evidence of the two -- every one of
 * this year's past dates carries documents.
 *
 * Only what the page says is taken here, either way.
 */
import { spawn } from "node:child_process"
import { LISTING_URL, USER_AGENT, parseDateFromTitle, retrying } from "./haverhill.mjs"

export { LISTING_URL }

/**
 * The License Commission's own page, which is where its dates are.
 *
 * The board is the page rather than anything the markup says -- the heading
 * over the table names the year and not the commission -- so it is named here
 * beside the URL, and has to match `meetings.json`'s `board` exactly.
 */
export const CALENDAR_PAGES = [
  {
    board: "License Commission",
    url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/license-commission/",
    // A heading, then a table that is nothing but dates, two columns wide --
    // January beside July.
    heading: /CALENDAR OF MEETINGS FOR\s*(\d{4})/i,
  },
  {
    board: "Conservation Commission",
    url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/conservation-commission/meeting-schedule/",
    heading: /(\d{4})\s+Meeting Schedule/i,
    // Three columns, and only the middle one is a sitting: the first is the
    // filing deadline for permit applications, the third is where the meeting
    // goes if it is postponed. Both are real dates and neither is a meeting --
    // taking the whole table would treble the board's calendar.
    column: "Meeting Date",
  },
  {
    board: "Zoning Board of Appeals",
    url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/zoning-board-of-appeals/",
    // Same shape as the Planning Board's: a schedule PDF per year, written as
    // labelled blocks. Its own labels differ -- "Online Filing Deadline",
    // "Appeal Period Expires @ Midnight" -- which is why a block's rows are
    // recognised by their shape rather than by name.
    pdf: /(\d{4})\s*BOA MEETING SCHEDULE/i,
  },
  {
    board: "Planning Board",
    url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/planning-board/",
    // This board's dates are not on the page at all: the page links a PDF per
    // year, and the dates are inside it. Only years from the current one are
    // fetched -- the page also lists an archive back to 2018, and a schedule
    // whose year is over has nothing left to project.
    pdf: /Planning Board Meeting Schedule (\d{4})/i,
  },
]

const MONTHS = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/g, " ")

const text = (s) =>
  decode(s.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()

/**
 * Every board rule on the page, in the order it prints them.
 *
 * Anchored on the `usn_cmp_text` blocks rather than on the whole page, because
 * the site's own navigation carries an `<h2>` or two of its own and the section
 * class is what marks this as editorial content. A block with a heading but no
 * list is skipped: the rule is the list, and a heading over a paragraph of
 * something else is not one.
 */
export function parseMeetingRules(html) {
  const rules = []
  const blocks = html.match(/<section[^>]*usn_cmp_text[\s\S]*?<\/section>/g) ?? []
  for (const block of blocks) {
    const board = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1]
    const intro = block.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1]
    const items = block.match(/<li[^>]*>[\s\S]*?<\/li>/g) ?? []
    if (!board || !intro || !items.length) continue
    const exceptions = items.map(text).filter(Boolean)
    if (!exceptions.length) continue
    rules.push({ board: text(board), intro: text(intro), exceptions })
  }
  return rules
}

const pad = (n) => String(n).padStart(2, "0")

/** `2026-01-08` if that date exists, else null. Rejects 31 September and such. */
function iso(year, month, day) {
  if (!year || !month || day < 1 || day > 31) return null
  const out = `${year}-${pad(month)}-${pad(day)}`
  // A date that does not survive the round trip is a misread rather than
  // something the city published, and `new Date` would roll it over silently.
  return new Date(`${out}T00:00:00Z`).toISOString().slice(0, 10) === out ? out : null
}

/**
 * One cell of a meeting table as `YYYY-MM-DD`, or null for anything else.
 *
 * Two forms, because the two boards write dates differently: `January 8, 2026`
 * and `1/8/2026`. The slashed form often drops the year -- a schedule headed
 * with one does not repeat it on every row -- so `year` fills it in. An
 * explicit year always wins: the Conservation Commission's last row carries
 * `1/7/2027`, the first sitting of the year after the one the page is headed
 * with, and forcing the heading's year onto it would move the meeting.
 *
 * Built from the parts rather than handed to `new Date(...)`, which accepts a
 * great deal it should not and answers with a local-time instant -- the two
 * things the rest of this project's date handling avoids.
 */
export function parseCalendarDate(text, year) {
  const trimmed = text.trim()
  const long = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/)
  if (long) return iso(Number(long[3]), MONTHS[long[1].toLowerCase()], Number(long[2]))
  const slashed = trimmed.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/)
  if (slashed) {
    return iso(Number(slashed[3] ?? year), Number(slashed[1]), Number(slashed[2]))
  }
  return null
}

/**
 * The hour a page states its board sits at, e.g. `7:15 PM`, or null.
 *
 * Anchored on "at", which is what keeps the Conservation Commission's own
 * "Filing deadlines are 11:00AM two weeks prior" from being read as a meeting
 * time -- that sentence sits in the same paragraph as "on Thursday evenings at
 * 7:15 PM". Only the text between the heading and its table is searched, so
 * nothing elsewhere on the page can supply one.
 */
export function parseTime(prose) {
  const m = prose.match(/\bat\s+(\d{1,2}):(\d{2})\s*(?:o'clock\s*)?([AaPp])\.?\s*[Mm]\.?/)
  return m ? `${Number(m[1])}:${m[2]} ${m[3].toUpperCase()}M` : null
}

const rowsOf = (table) =>
  [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((row) =>
    [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((cell) => text(cell[1])),
  )

/**
 * The sittings one board page prints, per `page`'s description of it.
 *
 * `page.heading` finds the heading and the year in its one capture group; the
 * first table after it is the schedule. `page.column` names the column holding
 * the sittings where the table has more than dates in it -- without one, every
 * cell is a sitting.
 *
 * Where there is a named column, the **other** dated columns of a sitting's own
 * row come back with it, labelled by their own headers. They are not sittings
 * and must never be treated as ones -- the Conservation Commission's are the
 * deadline for filing a permit application and the date the meeting moves to if
 * it is postponed -- but they are what the board published about that sitting,
 * and a reader looking at the date wants them.
 *
 * The heading is kept as printed: it is what a meeting page cites, and it is
 * the board's own name for its list.
 */
export function parseMeetingCalendars(html, page) {
  const heading = page.heading.exec(html)
  if (!heading) return []
  const year = Number(heading[1])
  const table = /<table[\s\S]*?<\/table>/.exec(html.slice(heading.index))
  if (!table) return []

  const rows = rowsOf(table[0])
  let sittings
  if (page.column) {
    const at = rows[0]?.indexOf(page.column) ?? -1
    // No such column means the table has been rearranged, and guessing which
    // of three date columns is the meeting would be worse than finding none.
    if (at < 0) return []
    sittings = rows.slice(1).flatMap((row) => {
      const date = parseCalendarDate(row[at] ?? "", year)
      if (!date) return []
      // The year is taken from the heading where a cell leaves it off, which
      // works because the board spells it out on exactly the rows that need it
      // -- the first submittal date falls in the previous year and the last
      // postponement in the next, and both are written out in full.
      const related = rows[0].flatMap((label, i) => {
        const other = i === at ? null : parseCalendarDate(row[i] ?? "", year)
        return other ? [{ label, date: other }] : []
      })
      return [related.length ? { date, related } : { date }]
    })
  } else {
    sittings = rows
      .flat()
      .map((cell) => parseCalendarDate(cell, year))
      .filter(Boolean)
      .map((date) => ({ date }))
  }

  // One entry per date, and in date order: a schedule laid out in columns does
  // not run in date order down the page.
  const byDate = new Map(sittings.map((sitting) => [sitting.date, sitting]))
  if (!byDate.size) return []
  const ordered = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))

  const prose = html.slice(heading.index + heading[0].length, heading.index + table.index)
  const time = parseTime(text(prose))

  return [{ year, heading: text(heading[0]), sittings: ordered, ...(time ? { time } : {}) }]
}

/**
 * The schedule PDFs a board page links, newest first, one per year.
 *
 * Several boards keep an archive of past years on the same page, so this is
 * filtered by the caller rather than here: what counts as still worth reading
 * is a question about today, not about the page.
 */
export function parseScheduleLinks(html, pattern) {
  const out = []
  for (const m of html.matchAll(/<a[^>]+href="([^"]+\.pdf[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const label = text(m[2])
    const year = pattern.exec(label)?.[1]
    if (year) out.push({ year: Number(year), label, url: m[1] })
  }
  // The same year can be linked twice -- once in the current section and again
  // in the archive. Keep the first, which is the one the page leads with.
  const seen = new Set()
  return out.filter(({ year }) => !seen.has(year) && seen.add(year))
}

/**
 * The sittings a Planning Board schedule PDF states, from its extracted text.
 *
 * The PDF is a run of labelled blocks rather than a table:
 *
 * ```
 * Meeting Date:                 January 14, 2026
 * Escrows-deadline              December 17 , 2026
 * Public Hearings-Cut Off Date  12/3/26-Hearing Cut Off Date.
 * ADVERTISE:                    12/25/26 & 1/1/26-Advertise dates
 * ```
 *
 * Only the `Meeting Date` line is read. **The other three are left alone on
 * purpose**: this board's own copy of them is full of slips -- an escrow
 * deadline of "December 17 , 2026" against a meeting on 14 January 2026, a cut
 * off date of "2/18/226", an "7/1//26" -- so parsing them into dates would
 * publish the city's typos as fact. The Conservation Commission's equivalent
 * columns are clean, which is why those are carried and these are not.
 *
 * A block can carry an unlabelled line under the date saying the board will not
 * sit that day -- "NO MEETING VETERANS DAY!" against 11 November 2026. That is
 * the board saying a scheduled date is off, so the date is dropped: putting it
 * on the calendar would be advertising a meeting the board has already called
 * off.
 */
/**
 * Whether a line is one of a block's labelled rows rather than a note under it.
 *
 * A labelled row is a label, a wide gap, and a value -- so it carries a run of
 * two or more spaces between text. A note is a bare phrase sitting in the value
 * column ("NO MEETING VETERANS DAY!") and carries none. That is the rule rather
 * than a list of the labels themselves, because the two boards use different
 * ones: the Planning Board's are Escrows and ADVERTISE, the Zoning Board's are
 * "Online Filing Deadline" and "Appeal Period Expires @ Midnight".
 */
const isLabelledRow = (line) => /\S {2,}\S/.test(line.trim())

export function parseScheduleText(pdfText, year) {
  const lines = pdfText.split(/\r?\n/)
  const sittings = []
  const cancelled = []
  for (const [i, line] of lines.entries()) {
    const m = line.match(/^\s*Meeting Date:?\s\s+(.+?)\s*$/i)
    if (!m) continue
    const date = parseCalendarDate(m[1], year)
    if (!date) continue
    // A note sits between the date and the block's next labelled row.
    let note = ""
    for (let j = i + 1; j < lines.length; j++) {
      if (!lines[j].trim() || isLabelledRow(lines[j])) break
      note += ` ${lines[j]}`
    }
    if (/NO MEETING/i.test(note)) cancelled.push(date)
    else sittings.push({ date })
  }
  return { sittings, cancelled }
}

/**
 * Dates a board page says are off, from entries that carry no document.
 *
 * A cancelled sitting is written as an ordinary entry with the note appended
 * and **no link behind it** -- "September 16, 2026 Agenda MEETING CANCELLED",
 * "Planning Board Agenda 6.10.26 NO MEETING". There is no agenda to publish for
 * a meeting that will not happen, which is exactly what makes the missing link
 * the signal.
 *
 * This matters most where the schedule PDF does not know. The Zoning Board's
 * 2026 schedule lists 16 September as a meeting date; its page says the meeting
 * is cancelled. The page is the later word, and without it the calendar would
 * advertise a sitting the board has called off.
 */
export function parseCancelledOnPage(html) {
  const out = new Set()
  for (const m of html.matchAll(/<(p|li|td)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    if (/<a[^>]+\.pdf/i.test(m[2])) continue
    const label = text(m[2])
    if (!/\b(meeting cancell?ed|no meeting)\b/i.test(label)) continue
    // The date sits wherever the board puts it -- before the word Agenda for
    // one board ("September 16, 2026 Agenda MEETING CANCELLED"), after it for
    // the other ("Planning Board Agenda 6.10.26 NO MEETING") -- so this is the
    // same loose reader the document titles use rather than a fixed shape.
    const date = parseDateFromTitle(label)
    if (date) out.add(date)
  }
  return [...out].sort()
}

const get = (url, label) =>
  retrying(label, async () => {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text()
  })

/** Fetch the listing page and read its rules. One request, no session needed. */
export async function fetchMeetingRules() {
  const rules = parseMeetingRules(await get(LISTING_URL, "fetch listing page"))
  return rules.map((rule) => ({ ...rule, source: LISTING_URL }))
}

/**
 * A PDF's text, via poppler's `pdftotext`.
 *
 * Shelled out to rather than pulled in as a library because poppler is already
 * how this project reads the city's PDFs -- the budget book was checked with
 * it, and a document's excerpts are cut with it -- and the scrapers run by hand
 * on a developer's machine, never in CI. A missing binary says so plainly
 * instead of failing as an empty parse, which would look like the city having
 * moved the schedule.
 */
async function pdfText(url, label) {
  const res = await retrying(label, async () => {
    const r = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return Buffer.from(await r.arrayBuffer())
  })
  // `spawn` rather than `execFile`: the latter has no way to hand a child its
  // stdin, and the PDF goes in that way so nothing is written to disk.
  return new Promise((resolve, reject) => {
    const child = spawn("pdftotext", ["-layout", "-", "-"])
    const out = []
    const err = []
    child.stdout.on("data", (chunk) => out.push(chunk))
    child.stderr.on("data", (chunk) => err.push(chunk))
    child.on("error", (e) =>
      reject(
        e.code === "ENOENT"
          ? new Error("pdftotext not found: install poppler-utils to read schedule PDFs")
          : e,
      ),
    )
    child.on("close", (code) =>
      code === 0
        ? resolve(Buffer.concat(out).toString("utf8"))
        : reject(new Error(`pdftotext exited ${code}: ${Buffer.concat(err).toString("utf8")}`)),
    )
    child.stdin.on("error", reject)
    child.stdin.end(res)
  })
}

/** Fetch each board page that publishes its own dates, and read them. */
export async function fetchMeetingCalendars({ year = new Date().getFullYear() } = {}) {
  const out = []
  for (const page of CALENDAR_PAGES) {
    console.log(`  reading ${page.board}...`)
    const html = await get(page.url, `fetch ${page.board} page`)

    if (page.pdf) {
      // The dates are in a linked PDF, one per year. A schedule whose year is
      // already out has nothing left to project, so the archive is skipped.
      for (const link of parseScheduleLinks(html, page.pdf).filter((l) => l.year >= year)) {
        console.log(`    ${link.label}`)
        const { sittings, cancelled } = parseScheduleText(
          await pdfText(link.url, `fetch ${link.label}`),
          link.year,
        )
        // The page is the later word than the PDF it links: a board that has
        // called a sitting off says so beside the missing agenda, not by
        // reissuing the schedule.
        const off = [...new Set([...cancelled, ...parseCancelledOnPage(html)])].sort()
        const kept = sittings.filter((s) => !off.includes(s.date))
        if (kept.length) {
          out.push({
            board: page.board,
            source: link.url,
            year: link.year,
            heading: link.label,
            sittings: kept,
            ...(off.length ? { cancelled: off } : {}),
          })
        }
      }
      continue
    }

    for (const calendar of parseMeetingCalendars(html, page)) {
      out.push({ board: page.board, source: page.url, ...calendar })
    }
  }
  return out.sort((a, b) => a.year - b.year || a.board.localeCompare(b.board))
}
