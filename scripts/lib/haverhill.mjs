/**
 * Scraper for the Haverhill, MA "Agendas and Minutes" document listing.
 *
 * The listing page renders an empty <div class="docListing"> and fills it via a
 * POST to an Umbraco surface controller, so we replay that request rather than
 * parsing the landing page. Each row links to a per-document "media page" which
 * carries the authoritative `Meeting Date` field -- document titles use at least
 * five different date formats and ~9% carry no date at all, so the media page is
 * the only reliable source.
 */

const ORIGIN = "https://www.haverhillma.gov"
export const LISTING_URL = `${ORIGIN}/government/agendas-and-minutes/`
const FILTER_ENDPOINT = `${ORIGIN}/umbraco/surface/DocumentManager/GetDocumentsByFilters`

// Hidden form values identifying the document-listing block on the page above.
const PAGE_KEY = "12437"
const CONTENT_KEY = "0a375e52-71a5-4b77-a81d-d140b10479fc"
const SETTINGS_KEY = "db2f2ad8-3c61-42ad-985b-bd2b0d6dc284"

const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&nbsp;/g, " ")

const stripTags = (s) =>
  decode(s.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()

async function retrying(label, fn, { retries = 3 } = {}) {
  let lastErr
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt < retries) await new Promise((r) => setTimeout(r, 400 * attempt ** 2))
    }
  }
  throw new Error(`${label}: ${lastErr.message}`)
}

/** GET the listing page to pick up the antiforgery token and its paired cookie. */
async function openSession() {
  return retrying("open session", async () => {
    const res = await fetch(LISTING_URL, { headers: { "User-Agent": USER_AGENT } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const html = await res.text()
    const token = html.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/)?.[1]
    if (!token) throw new Error("no antiforgery token found on listing page")
    const cookie = (res.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ")
    return { token, cookie }
  })
}

/** Replay the AJAX filter request to get every document in one shot. */
export async function fetchListing({ pageSize = 2000 } = {}) {
  const { token, cookie } = await openSession()
  const body = new URLSearchParams({
    data: "",
    keyword: "",
    page: "1",
    pageSize: String(pageSize),
    contentPageId: PAGE_KEY,
    blockContentKeyId: CONTENT_KEY,
    blockSettingsKeyId: SETTINGS_KEY,
    selectDateFieldId: "",
    startDate: "",
    endDate: "",
    culture: "en-US",
  })

  const html = await retrying("fetch listing", async () => {
    const res = await fetch(FILTER_ENDPOINT, {
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        RequestVerificationToken: token,
        "X-Requested-With": "XMLHttpRequest",
        Cookie: cookie,
        Referer: LISTING_URL,
      },
      body,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text()
  })

  return parseListing(html)
}

export function parseListing(html) {
  const rows = html.match(/<tr class="document-item">[\s\S]*?<\/tr>/g) ?? []
  const docs = []
  for (const row of rows) {
    const link = row.match(/<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/)
    if (!link) continue
    const cells = row.match(/<td>([\s\S]*?)<\/td>/g) ?? []
    docs.push({
      title: stripTags(link[2]),
      pageUrl: link[1],
      // The CDN copy is the "View" link; the /media/ one is the download.
      fileUrl: row.match(/href="(https:\/\/media[^"]+)"/)?.[1] ?? null,
      category: cells[1] ? stripTags(cells[1]) : "",
      description: cells[2] ? stripTags(cells[2]) : "",
    })
  }
  return docs
}

const MONTHS = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
}

const iso = (y, m, d) => {
  if (!(m >= 1 && m <= 12 && d >= 1 && d <= 31)) return null
  const dt = new Date(Date.UTC(y, m - 1, d))
  // Rejects overflow like Feb 30 rolling into March.
  if (dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

/**
 * `01/06/2026 03:00 PM` -> `{ date: '2026-01-06' }`.
 *
 * The CMS renders a raw UTC instant with no timezone conversion, so an evening
 * meeting entered as 7:00 PM local lands on the *following* day at 12:00 AM
 * whenever Haverhill is on EST (UTC-5); under EDT (UTC-4) the same meeting shows
 * as 11:00 PM on the correct day. Every `12:00 AM` record is therefore one day
 * late, which we roll back. Evidence: 17 of the 20 midnight records are City
 * Council meetings sitting on a Wednesday, and the city states the Council meets
 * "every Tuesday at 7:00 o'clock P.M."; rolling back also reconciles 5 of the 7
 * such records whose PDF filename carries its own date.
 *
 * The clock times themselves are unreliable (City Council shows 12:00 PM as
 * often as an evening time), so only the date is kept.
 */
export function parseMeetingDate(raw) {
  const m = raw?.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (!m) return null
  const date = iso(+m[3], +m[1], +m[2])
  if (!date) return null
  if (!/12:00\s*AM/i.test(raw)) return { date, adjusted: false }
  const [y, mo, d] = date.split("-").map(Number)
  const back = new Date(Date.UTC(y, mo - 1, d - 1))
  return { date: back.toISOString().slice(0, 10), adjusted: true }
}

/** Handles the several date shapes seen in document titles. */
export function parseDateFromTitle(title) {
  let m
  // 2025-03-06 / 2025-4-1 / 2025.4.1
  if ((m = title.match(/(?:^|\s)(\d{4})[-_./](\d{1,2})[-_./](\d{1,2})(?!\d)/)))
    return iso(+m[1], +m[2], +m[3])
  // April 2, 2026  |  City Council Agenda - April 14, 2026
  if ((m = title.match(/([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/))) {
    const mon = MONTHS[m[1].slice(0, 3).toLowerCase()]
    if (mon) return iso(+m[3], mon, +m[2])
  }
  // 10.28.2025 | 9.16.2025 | 4.8.25
  if ((m = title.match(/(?:^|[\s_])(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})(?!\d)/))) {
    const y = +m[3]
    return iso(y < 100 ? 2000 + y : y, +m[1], +m[2])
  }
  return null
}

/**
 * Last resort: dates embedded in PDF filenames as an unseparated digit run,
 * e.g. `boa-mtg-min-09092025` or `mtg-boa-1062026`. The trailing 4 (or 2) digits
 * are the year and what remains splits into month+day. A 3-digit remainder like
 * `106` is genuinely ambiguous (1/06 vs 10/6); we prefer the single-digit-month
 * reading and mark the result as low confidence so it can be reviewed.
 */
export function parseDateFromFilename(fileUrl) {
  if (!fileUrl) return null
  const name = decodeURIComponent(fileUrl.split("/").pop() ?? "").replace(/\.[a-z]+$/i, "")
  for (const run of name.match(/\d{4,8}/g) ?? []) {
    for (const [ylen, base] of [
      [4, 0],
      [2, 2000],
    ]) {
      if (run.length <= ylen) continue
      const y = base + +run.slice(-ylen)
      if (y < 2015 || y > 2035) continue
      const md = run.slice(0, -ylen)
      const splits =
        md.length === 4
          ? [[2, 2]]
          : md.length === 3
            ? [
                [1, 2],
                [2, 1],
              ]
            : md.length === 2
              ? [[1, 1]]
              : []
      // Only a remainder that parses more than one way is truly ambiguous:
      // `106` is 1/06 or 10/6, but `722` can only be 7/22 (month 72 is not
      // a month). Prefer the first valid reading and report the rest.
      const candidates = splits
        .map(([ml, dl]) => iso(y, +md.slice(0, ml), +md.slice(ml, ml + dl)))
        .filter(Boolean)
      if (candidates.length) {
        return { date: candidates[0], ambiguous: candidates.length > 1 }
      }
    }
  }
  return null
}

/** Fetch one document's media page and read its `Meeting Date` cell. */
export async function fetchMeetingDate(pageUrl) {
  const url = pageUrl.startsWith("http") ? pageUrl : ORIGIN + pageUrl
  return retrying(`fetch ${pageUrl}`, async () => {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const html = await res.text()
    const cell = html.match(/<th scope="row">\s*Meeting Date\s*<\/th>\s*<td>([^<]*)<\/td>/)
    return cell ? cell[1].trim() : null
  })
}

/** Run `worker` over `items` with bounded concurrency, preserving order. */
export async function mapLimit(items, limit, worker) {
  const out = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++
        out[i] = await worker(items[i], i)
      }
    }),
  )
  return out
}

/**
 * Split a category like `City Council Minutes` into board + document kind.
 * Some entries carry no category at all (the `Agenda and Minutes (N)` rows), so
 * fall back to sniffing the title and then the PDF filename, which is often the
 * only place the owning board is named.
 */
export function classify({ category, title, fileUrl, description }) {
  const primary = (category || "").split(",")[0].trim()
  const hay = [primary, title, description, filenameOf(fileUrl)].filter(Boolean).join(" ")
  const kind = /minute/i.test(hay) ? "minutes" : /agenda/i.test(hay) ? "agenda" : "other"
  let board = primary
    .replace(/\s*(Meeting\s*)?(Agendas?|Minutes)\s*$/i, "")
    .replace(/\s*Meeting\s*$/i, "")
    .trim()
  if (!board)
    board = guessBoard([title, description, filenameOf(fileUrl)].filter(Boolean).join(" "))
  return { board: board || "Other", kind }
}

const filenameOf = (url) =>
  url ? decodeURIComponent(url.split("/").pop() ?? "").replace(/\.[a-z]+$/i, "") : ""

function guessBoard(text) {
  const t = text.toLowerCase()
  const table = [
    ["city council", "City Council"],
    ["citycouncil", "City Council"],
    ["conservation", "Conservation Commission"],
    ["license", "License Commission"],
    ["planning", "Planning Board"],
    ["registrar", "Board of Registrars"],
    ["assessor", "Board of Assessors"],
    [/\bboa\b/, "Board of Assessors"],
    ["health", "Health Department"],
    ["water", "Water Department"],
    ["cultural", "Cultural Council"],
    ["admifin", "Administration & Finance Committee"],
    ["administration", "Administration & Finance Committee"],
  ]
  for (const [needle, name] of table) {
    if (needle instanceof RegExp ? needle.test(t) : t.includes(needle)) return name
  }
  return ""
}

/**
 * Stable identity for a listing row.
 *
 * Neither field is unique on its own: the city's CMS has two distinct documents
 * sharing the media page `agenda-and-minutes-5`, and five PDFs that appear under
 * two pages each. The pair is unique across the whole listing.
 */
export function documentKey(doc) {
  return `${doc.pageUrl}::${doc.fileUrl ?? ""}`
}

/**
 * Resolve a document's date, preferring the authoritative media-page field and
 * falling back to the title then the filename. Returns the enriched record.
 */
export async function resolveDocument(doc, { fetchPage = true } = {}) {
  let raw = null
  if (fetchPage) {
    try {
      raw = await fetchMeetingDate(doc.pageUrl)
    } catch {
      raw = null
    }
  }
  const fromMeeting = parseMeetingDate(raw)
  const fromTitle = parseDateFromTitle(doc.title)
  const fromFile = parseDateFromFilename(doc.fileUrl)

  const date = fromMeeting?.date ?? fromTitle ?? fromFile?.date ?? null
  const dateSource = fromMeeting
    ? "meeting-date"
    : fromTitle
      ? "title"
      : fromFile
        ? "filename"
        : "none"

  // Where a shared media page lends its date to the wrong document, the PDF
  // filename disagrees with it. Surface that rather than trusting either.
  const crossCheck = fromFile && !fromFile.ambiguous ? fromFile.date : null
  const dateConflict = Boolean(date && crossCheck && crossCheck !== date)

  return {
    ...doc,
    ...classify(doc),
    date,
    dateSource,
    rawMeetingDate: raw,
    dateAdjusted: fromMeeting?.adjusted ?? false,
    dateConflict,
    filenameDate: crossCheck,
    needsReview:
      !date || dateConflict || (dateSource === "filename" && fromFile?.ambiguous === true),
  }
}
