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
import { LISTING_URL, USER_AGENT, retrying } from "./haverhill.mjs"

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

/**
 * `January 8, 2026` -> `2026-01-08`, or null for anything else.
 *
 * Built from the parts rather than handed to `new Date(...)`, which accepts a
 * great deal it should not and answers with a local-time instant -- exactly the
 * two things the rest of this project's date handling avoids.
 */
export function parseLongDate(text) {
  const m = text.trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/)
  if (!m) return null
  const month = MONTHS[m[1].toLowerCase()]
  const day = Number(m[2])
  if (!month || day < 1 || day > 31) return null
  const iso = `${m[3]}-${pad(month)}-${pad(day)}`
  // A date that does not survive the round trip -- 31 September, say -- is a
  // misread rather than something the city published.
  return new Date(`${iso}T00:00:00Z`).toISOString().slice(0, 10) === iso ? iso : null
}

/**
 * Every "CALENDAR OF MEETINGS FOR <year>" table on a page, as ISO dates.
 *
 * The heading is kept as printed: it is what a meeting page cites, and it is
 * the board's own name for the list. The table runs in two columns -- January
 * beside July, February beside August -- so the cells are sorted rather than
 * read in document order.
 */
export function parseMeetingCalendars(html) {
  const out = []
  const re =
    /<h2[^>]*>\s*(CALENDAR OF MEETINGS FOR\s*(\d{4}))\s*<\/h2>\s*(<table[\s\S]*?<\/table>)/gi
  for (const match of html.matchAll(re)) {
    const cells = [...match[3].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => text(c[1]))
    const dates = [...new Set(cells.map(parseLongDate).filter(Boolean))].sort()
    if (dates.length) out.push({ year: Number(match[2]), heading: text(match[1]), dates })
  }
  return out
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

/** Fetch each board page that prints its own dates, and read them. */
export async function fetchMeetingCalendars() {
  const out = []
  for (const page of CALENDAR_PAGES) {
    const found = parseMeetingCalendars(await get(page.url, `fetch ${page.board} page`))
    for (const calendar of found) out.push({ board: page.board, source: page.url, ...calendar })
  }
  return out.sort((a, b) => a.year - b.year || a.board.localeCompare(b.board))
}
