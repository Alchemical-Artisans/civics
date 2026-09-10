/**
 * The meeting notices the city posts to its own events calendar.
 *
 * <https://events.haverhillma.gov> is where Haverhill files what the Open
 * Meeting Law requires it to post: a body, a day, an hour, and a room, up
 * ahead of the sitting. It is not a document listing and carries no minutes --
 * an entry is the notice itself, which is why the sittings feed
 * `schedule.json` and not `meetings.json`.
 *
 * **But a notice can carry the agenda as a file, and often the city publishes
 * it nowhere else.** The law requires the notice to list the topics, so the PDF
 * hung off a notice's detail page is that body's agenda for that day -- "Public
 * Meeting Notice / Board of Assessors / Anticipated Topics for Discussion",
 * over the city clerk's date stamp. Those are documents, and
 * `fetchNoticeDocuments` reads them into `meetings.json` under a `source` of
 * their own. Of the 97 files on the calendar today, 60 are for sittings this
 * site holds no other document for at all. The city began attaching them in
 * quantity in June 2026 and has done so every month since.
 *
 * **It is the only place most of the city's boards appear at all.** The
 * agendas-and-minutes listing and its two archives cover five boards between
 * them; this covers roughly thirty, including every one the site could
 * previously say nothing about -- the School Committee and its subcommittees,
 * the Housing Authority, the Retirement Board, the Library Trustees, the three
 * historic district commissions, the Council's own standing committees.
 *
 * **It is also better evidence than the Council's rule.** The rule says "every
 * Tuesday" and the Council skips roughly one a month; the notices are the days
 * the Council has actually posted. See `src/lib/schedule.ts`, which prefers
 * these and caps the rule at the last of them.
 *
 * One plain GET per month, no session and no token handshake -- but the origin
 * sits behind Azure Front Door, which answers a request with no browser
 * `User-Agent` with a 502 rather than a 403. `USER_AGENT` is the project's
 * usual one and is not optional here.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { USER_AGENT, retrying } from "./haverhill.mjs"

/**
 * The calendar itself, named as the city names it in its own navigation.
 *
 * Every notice is read off one page of this, so a sitting's source URL is the
 * month it was read from rather than this -- but the footer lists the calendar
 * once, under this name, however many boards it accounts for.
 */
export const NOTICE_CALENDAR = {
  name: "Events Calendar",
  origin: "https://events.haverhillma.gov",
}

const CACHE = path.join(import.meta.dirname, "..", "..", ".cache")

const pad = (n) => String(n).padStart(2, "0")

/** The month view's own URL. `StartDate` is the month, and the day is ignored. */
export const monthUrl = (year, month) =>
  `${NOTICE_CALENDAR.origin}/default/Month?StartDate=${pad(month)}/01/${year}`

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/g, " ")

const text = (s) =>
  decode(s.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()

/**
 * A notice title reduced to the letters that name the body.
 *
 * The city retypes these freely -- "Board of Assessors", "Haverhill Board of
 * Assessors Mtg", "Board of Assessor's Meeting" are one board on three days --
 * so the patterns below are matched against this rather than against the title
 * as posted. Punctuation goes because of the apostrophes; `&` and `/` stay
 * because two bodies are named with them ("Budget & Finance", "Water/
 * Wastewater").
 */
export const normaliseTitle = (title) =>
  decode(title)
    .toLowerCase()
    .replace(/[^a-z0-9&/ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

/**
 * The bodies whose notices reach the calendar, and how to recognise one.
 *
 * **This list is the decision, and a person makes it.** Nothing the events
 * calendar publishes says whether an entry is a Haverhill board, a regional
 * authority that meets here, or a utility hearing: a notice carries a title, a
 * date, an hour and a category, and the category vocabulary is two words deep.
 * The city's own roster of boards and commissions does not settle it either --
 * it names thirteen bodies and omits the Board of Assessors, the Board of
 * Health, the Harbor Commission, the three historic district commissions, the
 * Housing Authority, the Retirement Board and the Library Trustees, all of
 * which post notices here.
 *
 * So this is not a rule the scrape derives. It is a list somebody wrote after
 * reading eighteen months of postings, and **a title it does not recognise
 * does not reach the calendar** -- it is written to `.cache/` instead, for a
 * person to add here or ignore. Inclusion is opt-in, the way `CALENDAR_PAGES`
 * is, and the cost of that is a body nobody has filed yet being invisible
 * until someone reads the report. The alternative is guessing, and a calendar
 * of public meetings is the wrong place to guess.
 *
 * `board` must match `meetings.json`'s spelling exactly wherever the board is
 * already there, because that is the identity a sitting and its documents are
 * matched on: a notice for a day the city later publishes an agenda for has to
 * merge with it rather than sit beside it. That is why the Board of Health's
 * notices are filed under `Health Department` and the water abatement board's
 * under `Water Department` -- those are the names the document listing's own
 * categories gave them, whatever the notice says.
 *
 * **Bodies are named apart where they sit apart.** The School Committee and
 * its negotiating subcommittee meet on the same evening most weeks, an hour
 * apart, and a sitting is identified by its board and its date -- so folding
 * them under one name would silently drop one of the two. The same goes for
 * the eleven schools' site councils, which are eleven bodies and not one.
 */
export const BODIES = [
  // The five the document listing already covers. Their notices are worth
  // having anyway: they carry the hour and the room, and they run ahead of the
  // agenda.
  { board: "City Council", match: /\bcity council\b/ },
  { board: "License Commission", match: /\blicense commission\b/ },
  { board: "Board of Assessors", match: /\bboard of assessors?\b/ },
  { board: "Zoning Board of Appeals", match: /\bboard of appeals\b|\bzoning board\b/ },
  { board: "Planning Board", match: /\bplanning board\b/ },
  { board: "Conservation Commission", match: /\bconservation commission\b/ },
  { board: "Board of Registrars", match: /\bboard of registrars\b/ },
  // The festival committee is the Cultural Council's own, and meets on its own
  // evening -- twice on the same day as the council itself in this data, an
  // hour apart -- so it is named apart for the same reason the School
  // Committee's subcommittees are.
  {
    board: "Cultural Council Multicultural Festival Committee",
    match: /\bmulticultural festival\b/,
  },
  { board: "Cultural Council", match: /\bcultural council\b/ },

  // Filed under the names the listing's own categories gave these two. The
  // notices call them the Board of Health and the water abatement board.
  { board: "Health Department", match: /\bboard of health\b/ },
  { board: "Water Department", match: /\babatement board\b|\bwater\b.*\babatement\b/ },
  // A different body from the abatement board above: this one sets the rates.
  // Matched on the pair of words alone, because the city writes one notice as
  // bare "Water/ Wastewater" -- same body, same hour, same evening of the
  // quarter -- and the abatement board has already claimed its own above.
  { board: "Water/Wastewater Rating Board", match: /\bwater\s*\/?\s*wa(ste|ter)water\b/ },

  // The Council's own standing committees, which meet on their own evenings.
  {
    board: "Administration & Finance Committee",
    match: /\badministrat\w+ and finance committee\b/,
  },
  {
    board: "Natural Resources and Public Property Committee",
    match: /\bnatural resources\b/,
  },
  {
    board: "Planning and Development Committee",
    match: /\bplanning and development committee\b/,
  },
  {
    board: "Public Health, Safety & Works Committee",
    match: /\bpublic (health|safety)\b[^|]*\bcommittee\b/,
  },

  // The School Committee, and its subcommittees named apart from it because
  // they sit on the same evenings. The negotiating subcommittees are one entry
  // rather than nine: the city names them by the unit being bargained with --
  // teachers, custodians, secretaries, nurses, security specialists, ESP,
  // maintenance, transportation -- and they are one standing function of the
  // committee, sitting one at a time.
  {
    board: "School Committee Negotiating Subcommittee",
    match: /\bschool committee\b.*\b(negotiat\w+|grievances)\b/,
  },
  {
    board: "School Committee Policy Subcommittee",
    match: /\bschool committee\b.*\bpolicy subcommittee\b/,
  },
  {
    board: "School Committee Budget & Finance Subcommittee",
    match: /\bschool committee\b.*\bbudget\b/,
  },
  {
    board: "School Committee Diversity, Health & Safety Subcommittee",
    match: /\bschool committee\b.*\bdiversity\b/,
  },
  {
    board: "School Committee Strategic Planning Subcommittee",
    match: /\bschool committee\b.*\bstrategic planning subcommittee\b/,
  },
  // Last of the school-committee patterns, so the subcommittees above claim
  // their own entries first and this takes the committee's own meetings.
  { board: "School Committee", match: /\bschool committee\b/ },

  // Eleven schools, eleven councils. The city writes several of them more than
  // one way -- "Caleb Dustin Hunking", "Caleb Duston Hunking", "Hunking" -- so
  // each pattern is the shortest thing that names the school and nothing else.
  {
    board: "Bradford Elementary School Site Council",
    match: /\bbradford elementary\b.*\b(site counci|school council)/,
  },
  {
    board: "Consentino Middle School Site Council",
    match: /\bconsentino\b.*\b(site counci|school council)/,
  },
  {
    board: "Gateway Academy Site Council",
    match: /\bgateway academy\b.*\b(site counci|school council)/,
  },
  {
    board: "Haverhill High School Site Council",
    match: /\bhigh school\b.*\b(site counci|school council)/,
  },
  { board: "Hunking School Site Council", match: /\bhunking\b.*\b(site counci|school council)/ },
  {
    board: "John Greenleaf Whittier Middle School Site Council",
    match: /\bwhitt(ier|er)\b.*\b(site counci|school council)/,
  },
  { board: "Moody School Site Council", match: /\bmoody\b.*\b(site counci|school council)/ },
  {
    board: "Nettle Middle School Site Council",
    match: /\bnettle\b.*\b(site counci|school council)/,
  },
  {
    board: "Pentucket Lake Elementary School Site Council",
    match: /\bpentucket lake\b.*\b(site counci|school council)/,
  },
  {
    board: "Silver Hill School Site Council",
    match: /\bsilver hill\b.*\b(site counci|school council)/,
  },
  { board: "Tilton School Site Council", match: /\btilton\b.*\b(site counci|school council)/ },
  {
    board: "Walnut Square School Site Council",
    match: /\bwalnut square\b.*\b(site counci|school council)/,
  },

  // The building committees, which are not site councils: each oversees one
  // school's construction, and the city names the owner's-project-manager
  // selection committee separately while meaning the same body's work.
  {
    board: "Consentino School Building Committee",
    match: /\bconsentino\b.*\bbuilding commit?tee\b/,
  },
  {
    board: "John Greenleaf Whittier School Building Committee",
    match: /\bwhitt(ier|er)\b.*\b(building commit?tee|project manager|opm)\b/,
  },

  // Parent bodies, city-wide rather than one school's.
  { board: "District Parent Council", match: /\bdistrict parent council\b/ },
  {
    board: "Special Education Parent Advisory Council",
    match: /\bsepac\b|\bspecial education paren\w+ advisory\b/,
  },

  // Boards and commissions with no documents in the listing at all.
  { board: "Housing Authority", match: /\bhousing authority\b/ },
  { board: "Retirement Board", match: /\bretirement (board|system)\b/ },
  { board: "Library Board of Trustees", match: /\blibrary\b.*\btrustees\b/ },
  // Named apart: the Historic Commission is city-wide, the district
  // commissions each govern one district (Bradford Common, Rocks Village,
  // Washington Street Shoe).
  { board: "Bradford Common Historic District Commission", match: /\bbradford common\b/ },
  { board: "Rocks Village Historic District Commission", match: /\brocks village\b/ },
  {
    board: "Washington Street Shoe Historic District Commission",
    match: /\bwashington street shoe\b/,
  },
  { board: "Historic Commission", match: /\bhistoric commission\b/ },
  { board: "Harbor Commission", match: /\bharbor commission\b/ },
  {
    board: "Central Business District Parking Commission",
    match: /\bparking (commission|district commission)\b/,
  },
  { board: "Commission on Disability Issues", match: /\bdisability issues\b/ },
  {
    board: "Community Affairs Advisory Board",
    match: /\bcommunity affair\w*\b.*\badvisory board\b|\bcaab\b/,
  },
]

/**
 * The board a notice is about, or null for a title nothing here recognises.
 *
 * First match wins, which is what puts the School Committee's own pattern
 * after its subcommittees': every subcommittee title contains "school
 * committee" too, and the specific reading is the right one.
 */
export function classifyNotice(title) {
  const name = normaliseTitle(title)
  return BODIES.find((body) => body.match.test(name))?.board ?? null
}

/**
 * Whether a notice says the sitting is off.
 *
 * The city writes this into the title -- "CANCELED-Haverhill School Committee
 * & High School Student Council Mtg", "Haverhill Conservation Commission
 * Mtg-POSTPONED" -- rather than taking the entry down. Putting such a day on
 * the calendar would advertise a meeting already called off, which is the same
 * judgement `parseCancelledOnPage` makes about a board's own page.
 *
 * "Revised" and "Amended" are not this: they mean the notice was reissued, and
 * the sitting stands.
 */
export const isCalledOff = (title) =>
  /\b(cancell?ed|cancellation|postponed)\b/i.test(normaliseTitle(title))

/**
 * Every entry on one month view, as the markup gives them.
 *
 * A day's entry is a `day__event-meta` block holding two spans -- the hour and
 * the category -- and a link to the notice. The date is taken from the link's
 * own path (`/default/Detail/2026-09-09-1900-Planning-Board-Meeting`) rather
 * than from the cell it sits in, because the path states it outright and the
 * cell only numbers the day.
 *
 * The month view pads to whole weeks, so its first and last rows carry days
 * belonging to the months either side; those entries are dropped by the caller,
 * which knows the month it asked for.
 */
export function parseNotices(html) {
  const out = []
  for (const block of html.matchAll(/<div class="day__event-meta">([\s\S]*?)<\/div>/g)) {
    const spans = [...block[1].matchAll(/<span>([\s\S]*?)<\/span>/g)].map((m) => text(m[1]))
    const link = block[1].match(/<a\s+href="(\/default\/Detail\/(\d{4}-\d{2}-\d{2})-\d{4}[^"]*)"/)
    if (!link) continue
    const title = text(block[1].match(/<a[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? "")
    if (!title) continue
    out.push({
      date: link[2],
      title,
      // The category, which is the whole of the calendar's own vocabulary:
      // "Meetings" or "Events". Only the first is a sitting.
      category: spans[1] ?? "",
      time: parseNoticeTime(spans[0] ?? ""),
      url: `${NOTICE_CALENDAR.origin}${link[1]}`,
    })
  }
  return out
}

/**
 * The hour a notice states, in the form a meeting page prints, or null.
 *
 * Midnight is not an hour any board sits at: the calendar uses `12:00 am` for
 * an all-day posting -- a legal notice, a road closure, a week of early voting
 * -- and an event with no time is an all-day one here rather than one given an
 * invented hour. See `$lib/ics`.
 */
export function parseNoticeTime(printed) {
  const m = printed.trim().match(/^(\d{1,2}):(\d{2})\s*([ap])m$/i)
  if (!m) return null
  const hour = Number(m[1])
  const meridiem = m[3].toUpperCase()
  if (hour === 12 && meridiem === "A") return null
  return `${hour}:${m[2]} ${meridiem}M`
}

const get = (url, label) =>
  retrying(label, async () => {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text()
  })

/**
 * The months a scrape covers: this one, through the end of this year.
 *
 * The same horizon `src/lib/schedule.ts` projects the Council's rule to, and
 * for the same reason -- a sitting further out than that is not something
 * anyone is planning around yet. Months already past are not fetched at all:
 * the site shows no expected sitting for a day that has happened, because for
 * such a day the documents are the better authority.
 */
export function monthsToFetch(today) {
  const year = Number(today.slice(0, 4))
  const from = Number(today.slice(5, 7))
  return Array.from({ length: 12 - from + 1 }, (_, i) => ({ year, month: from + i }))
}

/**
 * Fetch the notices, classify them, and say what could not be classified.
 *
 * Notices are returned for whole months including days already past, because
 * the month is the unit the city publishes; `expectedSittings` is what cuts
 * them at today, the same as it does for every other schedule.
 */
export async function fetchNotices({ today = new Date().toISOString().slice(0, 10) } = {}) {
  const notices = []
  const cancelled = []
  const unrecognised = new Map()

  for (const { year, month } of monthsToFetch(today)) {
    const url = monthUrl(year, month)
    const html = await get(url, `fetch notices for ${year}-${pad(month)}`)
    const entries = parseNotices(html).filter(
      // The grid pads to whole weeks, so it shows a few days of the months
      // either side; each is fetched under its own month.
      (e) => e.date.startsWith(`${year}-${pad(month)}`),
    )
    console.log(`  ${year}-${pad(month)}: ${entries.length} entries`)

    for (const entry of entries) {
      // Two categories exist, and only one of them is a sitting. The other is
      // the city's community events -- a shoreline cleanup, a vaccine clinic,
      // trick-or-treat hours -- which are not meetings and are not what this
      // calendar is.
      if (entry.category !== "Meetings") continue
      const board = classifyNotice(entry.title)
      if (!board) {
        const key = normaliseTitle(entry.title)
        if (!unrecognised.has(key)) unrecognised.set(key, { ...entry, count: 0 })
        unrecognised.get(key).count++
        continue
      }
      if (isCalledOff(entry.title)) {
        cancelled.push({ board, date: entry.date, title: entry.title })
        continue
      }
      notices.push({
        board,
        date: entry.date,
        title: entry.title,
        url: entry.url,
        ...(entry.time ? { time: entry.time } : {}),
      })
    }
  }

  // The city posts a notice twice often enough to matter -- the original and a
  // "Revised" reissue, at the same hour on the same day. One sitting.
  const byId = new Map()
  for (const notice of notices) {
    const id = `${notice.board}|${notice.date}`
    if (!byId.has(id)) byId.set(id, notice)
  }

  return {
    notices: [...byId.values()].sort(
      (a, b) => a.date.localeCompare(b.date) || a.board.localeCompare(b.board),
    ),
    cancelled: cancelled.sort((a, b) => a.date.localeCompare(b.date)),
    unrecognised: [...unrecognised.values()].sort((a, b) => b.count - a.count),
  }
}

export const UNRECOGNISED_FILE = path.join(CACHE, "unrecognised-notices.txt")

/**
 * Write every title the list did not recognise, with one of its notices.
 *
 * The same bargain `printAttention` makes: the console gets a count and a
 * path, and the full list goes where it can be read beside the work. Most of
 * what lands here is not a Haverhill board at all -- utility hearings, the
 * regional planning commission, MassHire, election notices -- so this is a
 * list to skim rather than a list to work through, and the run says so.
 */
export function writeUnrecognised(unrecognised) {
  mkdirSync(CACHE, { recursive: true })
  const body = unrecognised
    .map(
      (u) =>
        `  ${String(u.count).padStart(3)}x  ${u.title}\n` +
        `${" ".repeat(9)}first seen ${u.date}  ${u.url}\n`,
    )
    .join("\n")
  writeFileSync(
    UNRECOGNISED_FILE,
    `Notice titles no body in scripts/lib/notices.mjs recognises, as of ${new Date().toISOString()}\n\n` +
      `${"-".repeat(74)}\nWHAT TO DO WITH THESE\n\n` +
      `Most are not Haverhill boards: the city posts utility hearings, regional\n` +
      `authorities that meet here, election notices and legal notices to the same\n` +
      `calendar. Those belong nowhere on this site and want no action.\n\n` +
      `Where one IS a city body the calendar should carry, add it to BODIES in\n` +
      `scripts/lib/notices.mjs -- a board name and the shortest pattern that names\n` +
      `that body and nothing else -- and run \`npm run schedule:update\` again.\n` +
      `Until then its sittings do not reach the calendar at all.\n${"-".repeat(74)}\n\n` +
      (body || "Nothing. Every notice matched a body.\n"),
  )
  return UNRECOGNISED_FILE
}

/**
 * The files a notice's own detail page hangs off it, as `{ name, url }`.
 *
 * The page lists them under a "Related Files:" heading as links back into the
 * notice's own path with a GUID on the end -- `/default/Detail/<slug>/<guid>`
 * -- which is the download. The link's text is the city's own filename for it,
 * and it is the only name the document has: nothing serves it under a filename
 * of its own and the response carries no `Content-Disposition`.
 *
 * Anchored on the notice's own path, so nothing else linked from the page can
 * be mistaken for one of its files.
 */
export function parseAttachments(html, detailPath) {
  const out = []
  const pattern = new RegExp(
    `href="(${detailPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/[0-9a-f-]{36})"[^>]*>([\\s\\S]*?)</a>`,
    "g",
  )
  for (const m of html.matchAll(pattern)) {
    const name = text(m[2])
    if (name) out.push({ name, url: `${NOTICE_CALENDAR.origin}${m[1]}` })
  }
  return out
}

/**
 * Where the calendar's own record starts. Before this it holds a handful of
 * stray entries and nothing with a file on it.
 */
export const FIRST_MONTH = { year: 2025, month: 4 }

/**
 * The months a document sweep covers: every month the calendar carries.
 *
 * **Wider than `monthsToFetch`, and deliberately.** An expected sitting is only
 * ever a future one -- for a day already past the documents are the better
 * authority -- but these *are* documents, and the document half of this site is
 * entirely retrospective. An agenda the city published in June is worth having
 * in September.
 */
export function documentMonths(today, from = FIRST_MONTH) {
  const out = []
  const lastYear = Number(today.slice(0, 4))
  for (let y = from.year; y <= lastYear; y++) {
    for (let m = y === from.year ? from.month : 1; m <= 12; m++) out.push({ year: y, month: m })
  }
  return out
}

/**
 * How far back a notice is asked again for a file it did not have before.
 *
 * The city posts the notice first and attaches the agenda later, often the day
 * before the sitting, so "we looked once and there was nothing" goes stale for
 * anything recent. Older than this and the answer is settled: a body that never
 * attached its June agenda is not going to now.
 */
const RECHECK_DAYS = 45

const CACHE_FILE = path.join(CACHE, "notice-attachments.json")

/** What a previous run found on each notice's page, or nothing. */
function loadAttachmentCache() {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, "utf8"))
  } catch {
    return {}
  }
}

/**
 * Every agenda the city has hung off a meeting notice, as document records.
 *
 * One request per notice, which is 700-odd on a cold cache and a handful after
 * that: what each page held is remembered in `.cache/`, and only notices within
 * `RECHECK_DAYS` of today are asked again. That cache is gitignored and
 * disposable -- losing it costs a slow run, not a wrong one.
 *
 * The records this produces are unusual in one way, and it is the good way:
 * the **date is the notice's**, not something read out of a title or a
 * filename. The city posted this notice for this day, which is better evidence
 * of when the body sat than any string in a file's name.
 */
export async function fetchNoticeDocuments({
  today = new Date().toISOString().slice(0, 10),
  months = documentMonths(today),
} = {}) {
  const cache = loadAttachmentCache()
  const cutoff = new Date(`${today}T00:00:00Z`)
  cutoff.setUTCDate(cutoff.getUTCDate() - RECHECK_DAYS)
  const recheckFrom = cutoff.toISOString().slice(0, 10)

  const documents = []
  const unrecognised = new Map()
  let fetched = 0
  let notices = 0

  for (const { year, month } of months) {
    const html = await get(monthUrl(year, month), `fetch notices for ${year}-${pad(month)}`)
    const entries = parseNotices(html).filter(
      (e) => e.date.startsWith(`${year}-${pad(month)}`) && e.category === "Meetings",
    )
    notices += entries.length

    for (const entry of entries) {
      const board = classifyNotice(entry.title)
      if (!board) {
        const key = normaliseTitle(entry.title)
        if (!unrecognised.has(key)) unrecognised.set(key, { ...entry, count: 0 })
        unrecognised.get(key).count++
        continue
      }

      let files = cache[entry.url]?.files
      if (!files || entry.date >= recheckFrom) {
        const page = await get(entry.url, `fetch notice ${entry.date}`)
        files = parseAttachments(page, new URL(entry.url).pathname)
        cache[entry.url] = { checkedAt: new Date().toISOString(), files }
        fetched++
      }

      for (const file of files) {
        documents.push({
          // The notice's own title. The file has no title of its own, only a
          // filename, which goes in `description` so the city's name for it is
          // in the data.
          title: entry.title,
          description: file.name,
          pageUrl: entry.url,
          fileUrl: file.url,
          // Already decided, by a list a person keeps, rather than left for
          // `classify` to recover from strings the city wrote for something
          // else. See `update-notice-documents.mjs` for why that matters here
          // and nowhere else.
          board,
          date: entry.date,
        })
      }
    }
  }

  mkdirSync(CACHE, { recursive: true })
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1) + "\n")

  return {
    documents: documents.sort(
      (a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title),
    ),
    notices,
    fetched,
    unrecognised: [...unrecognised.values()].sort((a, b) => b.count - a.count),
  }
}
