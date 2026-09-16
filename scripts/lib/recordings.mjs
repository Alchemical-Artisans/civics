/**
 * The video of a sitting, where Haverhill Community Television has it.
 *
 * HC Media (haverhillcommunitytv.org) records the City Council, the School
 * Committee and the License Commission and posts each meeting as a `/video/`
 * page under `/category/government/<body>/`. For a reader who wants to see what
 * happened rather than read the agenda, that recording is the thing -- and it
 * is on none of the city's own pages, so nothing else on this site carries it.
 *
 * **A recording is matched to a sitting, never allowed to invent one.** It is
 * evidence a meeting was held, not evidence of what it was about, and the day
 * and body come from a title a volunteer typed -- "Haverhill School Committee
 * Meeting - March 12, 2026", whose own slug says the 13th. So a recording is
 * kept only where the calendar already has that board on that date from an
 * agenda, minutes or a notice; one that matches nothing is written with
 * `orphan: true`, filtered off the site, and listed in the run's attention
 * report for a person to place or dismiss. `update-recordings.mjs` does the
 * matching, because only it has the rest of `meetings.json` to match against.
 *
 * **`classifyRecording` is a hand-kept list, like `BODIES` in notices.mjs.**
 * HC Media titles a council committee's meeting "Haverhill City Council
 * Planning & Development Meeting", where the city's own notice for the same
 * body says "Planning and Development Committee" -- a different vocabulary for
 * the same rooms, read by a person and written down here. A title it does not
 * place (a swearing-in, a "Minute with the Mayor") reaches nothing.
 *
 * `source` is `http://haverhillcommunitytv.org/`, which is what keeps this
 * scrape from colliding with the others: every record names the scrape that
 * produced it and each replaces only its own, exactly as `update-board-pages`
 * and `update-notice-documents` do.
 */
import { parseDateFromTitle, retrying } from "./haverhill.mjs"

export const RECORDINGS_ORIGIN = "http://haverhillcommunitytv.org"

/**
 * A plain, honest identifier rather than the browser string `haverhill.mjs`
 * sends. The city's own host is behind Azure Front Door and 502s a request with
 * no browser `User-Agent`; HC Media is the other way round -- a WordPress site
 * with rate-based bot protection that flags a browser string making a run of
 * requests and lets an obvious tool through. Say what this is.
 */
const USER_AGENT = "civics-calendar/1.0 (+https://haverhill.alchemicalartisans.com)"

/**
 * The `/category/government/` sub-pages that are meeting recordings. The other
 * sub-categories there are programmes -- "Minute with the Mayor", "Haverhill
 * How-To", the police bulletin -- and `whittier-tech-school-committee` is a
 * regional district's board, not one of Haverhill's.
 */
export const RECORDING_CATEGORIES = ["city-council", "school-committee", "license-commission"]

/**
 * A recording title reduced to the words that name the body. `&` becomes "and"
 * because HC Media writes "Planning & Development" where the city writes
 * "Planning and Development"; everything else non-alphanumeric goes.
 */
const normalise = (title) =>
  title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

/**
 * Which board a recording is of, or null for a title that names none.
 *
 * First match wins, so the council's own committees are listed before the
 * council itself: every committee recording's title carries "city council"
 * too, and the specific reading is the one wanted. The board names are spelled
 * as `meetings.json` spells them -- the city's own committee is "Public Health,
 * Safety & Works Committee" even where HC Media's title says only "Public
 * Safety Committee" -- so a matched recording lands on the right sitting.
 */
export const RECORDING_BODIES = [
  {
    board: "Administration & Finance Committee",
    match: /\bcity council\b.*\badministrat\w*\b.*\bfinance\b/,
  },
  {
    board: "Planning and Development Committee",
    match: /\bcity council\b.*\bplanning\b.*\bdevelopment\b/,
  },
  {
    board: "Public Health, Safety & Works Committee",
    match: /\bcity council\b.*\bpublic (health|safety)\b/,
  },
  {
    board: "Natural Resources and Public Property Committee",
    match: /\bcity council\b.*\bnatural resources?\b.*\bpublic property\b/,
  },
  // Two more from years back the lookahead below caught as unrecognised rather
  // than silently tying to the council. Named for what HC Media's own titles
  // call them -- there is no other document under either to check the wording
  // against.
  {
    board: "Citizen Outreach Committee",
    match: /\bcity council\b.*\bcitizen outreach\b.*\bcommittee\b/,
  },
  {
    board: "Joint Ward Districts Committee",
    match: /\bcity council\b.*\bjoint ward districts\b.*\bcommittee\b/,
  },
  // Budget hearings and emergency meetings are the council itself, sitting on a
  // day of their own. Left as "City Council" so they match a council sitting on
  // that date if there is one, and orphan cleanly if there is not. One year HC
  // Media titled the budget hearings "Haverhill City Budget Meeting", with no
  // "Council" in it at all.
  //
  // The lookahead is what keeps this from being a catch-all: a title naming a
  // council committee this list has not learned yet still says "committee",
  // and matching it here anyway would tie that recording to the plain
  // council -- a different sitting, silently wrong. Failing to match instead
  // leaves it unrecognised, where a person can teach this list the real
  // board, the way this file itself got taught about Natural Resources and
  // Public Property.
  {
    board: "City Council",
    match: /\bcity council\b(?!.*\bcommittee\b)|\bhaverhill city budget\b/,
  },
  { board: "School Committee", match: /\bschool committee\b/ },
  { board: "License Commission", match: /\blicense commission\b/ },
]

export const classifyRecording = (title) =>
  RECORDING_BODIES.find((body) => body.match.test(normalise(title)))?.board ?? null

/**
 * The date a recording is of.
 *
 * Read from the post's slug rather than its shown title: the title is trimmed
 * with an ellipsis on the listing once it runs long ("... Meeting - Augus..."),
 * where the slug carries the whole date ("...-meeting-august-24-2026"). The
 * words are the same ones `parseDateFromTitle` reads off an agenda title.
 */
export const recordingDate = (slug) => parseDateFromTitle(slug.replace(/-/g, " "))

/**
 * Every recording on one category-listing page.
 *
 * A card is an `<article class="... video ...">` whose `<h1 class="entry-title">`
 * links to the `/video/` post. The live-stream cards in the page furniture are
 * `/video/channel-N-live-stream` and are dropped.
 */
export function parseRecordingList(html) {
  const out = []
  const re =
    /<h1 class="entry-title">\s*<a href="(https?:\/\/haverhillcommunitytv\.org\/video\/([^"/]+))"[^>]*>([\s\S]*?)<\/a>/g
  for (const m of html.matchAll(re)) {
    const [url, slug] = [m[1], m[2]]
    if (/^channel-\d+-live-stream$/.test(slug)) continue
    const title = m[3]
      .replace(/<[^>]+>/g, " ")
      .replace(/&#8211;|&#8212;/g, "-")
      .replace(/&amp;/g, "&")
      .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
      .replace(/\s+/g, " ")
      .replace(/\s*(?:\.\.\.|…)\s*$/, "")
      .trim()
    out.push({ url, slug, title })
  }
  return out
}

/** The total-pages count WordPress prints on page 2 and after, or null. */
const totalPages = (html) => {
  const m = html.match(/Page \d+ of (\d+)/)
  return m ? +m[1] : null
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Every recording HC Media has for the three bodies, oldest listing page last.
 *
 * Page 1 of a category carries no page count, so paging is "keep asking for
 * `/page/N` until one 404s", capped so a markup change cannot loop forever.
 * The host rate-limits, so the pages are fetched one at a time with a pause
 * between -- `retrying` covers a stray 403, and the honest `USER_AGENT` above
 * is what keeps them rare.
 */
export async function fetchRecordings({ delayMs = 1500, maxPages = 80 } = {}) {
  const records = []
  const unrecognised = new Map()
  let pagesRead = 0

  for (const category of RECORDING_CATEGORIES) {
    const base = `${RECORDINGS_ORIGIN}/category/government/${category}`
    let page = 1
    let last = maxPages

    while (page <= last) {
      const url = page === 1 ? `${base}/` : `${base}/page/${page}/`
      const html = await retrying(`recordings ${category} p${page}`, async () => {
        const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "follow" })
        if (res.status === 404) return null
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      if (html === null) break
      pagesRead++

      const entries = parseRecordingList(html)
      if (!entries.length) break
      last = Math.min(last, totalPages(html) ?? last)

      for (const entry of entries) {
        const date = recordingDate(entry.slug)
        if (!date) continue // a ceremony, an inauguration -- not a sitting
        const board = classifyRecording(entry.title)
        if (!board) {
          const seen = unrecognised.get(entry.title)
          if (seen) seen.count++
          else unrecognised.set(entry.title, { title: entry.title, url: entry.url, count: 1 })
          continue
        }
        records.push({ title: entry.title, url: entry.url, board, date })
      }

      page++
      if (page <= last) await sleep(delayMs)
    }
    await sleep(delayMs)
  }

  return { records, unrecognised: [...unrecognised.values()], pagesRead }
}
