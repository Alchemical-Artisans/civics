/**
 * The School Committee's own meeting page, on the Haverhill Public Schools site.
 *
 * The School Committee is the one major Haverhill body the rest of the pipeline
 * cannot see. The "Agendas and Minutes" listing and its two archives cover five
 * boards and the committee is not among them; the events-calendar notices carry
 * a School Committee agenda only from June 2026 and never the packet behind it;
 * HC Media has the video and nothing else. What the committee actually takes in
 * -- the clerk's posting, the agenda, the "portfolio" of materials, the
 * presentations and warrants and minutes -- it publishes on
 * <https://www.haverhill-ps.org/meeting-schedule-and-agenda-packet>, a
 * different host on a different CMS, and nowhere else.
 *
 * The page is a run of dated sections, one per sitting, back to 2023. Each
 * heading is a meeting date and under it is a list of that sitting's documents,
 * in one of two shapes: a newer `ss-document-list` whose items carry a posted
 * date and an `aria-label`, and an older `stack-links-container` that is bare
 * `<a>` text. The heading is the sitting's date -- better evidence than any
 * string in a filename, the same reasoning `fetchNoticeDocuments` follows -- so
 * records are built here directly rather than run through `resolveDocument`.
 *
 * **One `source` of its own**, so `calendar:update --prune` leaves these alone,
 * exactly as it does the board pages and the notice agendas.
 */
import { USER_AGENT, retrying, parseDateFromTitle, parseDateFromFilename } from "./haverhill.mjs"

/**
 * The page, used as every record's `pageUrl` as well as its `source`: there is
 * no per-document page on this host -- a link goes straight to the PDF -- so
 * `documentPage()` in `src/lib/meetings.ts` sees the two match and returns null,
 * and the calendar links the file.
 */
export const HPS_PAGE = "https://www.haverhill-ps.org/meeting-schedule-and-agenda-packet"

/** Every document link on the page is a PDF on the ParentSquare file host. */
const FILE_HOST = "files.smartsites.parentsquare.com"

const CATEGORY = {
  agenda: "School Committee Agendas",
  minutes: "School Committee Minutes",
  other: "School Committee Documents",
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&ndash;|&mdash;/gi, "-")
    .replace(/&hellip;/gi, "...")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/g, " ")

const text = (s) =>
  decode(s.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()

/**
 * The meeting date a section heading states, or null.
 *
 * Most headings are a plain date -- "September 10, 2026". Some are prose ("Public
 * Hearing on FY26 Budget", "School Committee Links"), a bare year ("2023"), or a
 * week range ("Week of February 23-27, 2026"); none of those names a single
 * sitting, so the section is skipped and counted. One heading puts a full stop
 * where the comma belongs ("November 20. 2025"), normalised here rather than
 * taught to the shared date parser.
 */
export function sectionDate(heading) {
  const normalised = heading.replace(/(\d)\.\s+((?:19|20)\d{2}\b)/, "$1, $2")
  return parseDateFromTitle(normalised)
}

/**
 * Whether an undated heading is a continuation of the sitting above it rather
 * than a section of its own.
 *
 * A few sittings' materials spill into a second block -- "Due to the volume of
 * materials, the meeting materials have been attached as separate documents",
 * "Presentations at the ... Meeting" -- headed with no date because it is the
 * same meeting as the block just above. Only those exact spillover phrasings
 * carry the preceding date forward; anything else with no date of its own is a
 * section the page has misfiled or worded loosely ("Public Hearing on FY26
 * Budget" sits between two unrelated dates) and is skipped rather than guessed.
 */
export const isContinuation = (heading) =>
  /^presentations\b|due to the volume|attached as separate document|included separately/i.test(
    heading,
  )

/** The document kind, from the link's own label. The packet reads as `other`. */
export const kindOf = (label) =>
  /\bminutes?\b/i.test(label) ? "minutes" : /\bagenda\b/i.test(label) ? "agenda" : "other"

const ANCHOR = new RegExp(
  `<a\\b([^>]*)href="(https://${FILE_HOST.replace(/\./g, "\\.")}/[^"]+)"([^>]*)>([\\s\\S]*?)</a>`,
  "gi",
)

const fromAria = (aria) =>
  decode(aria)
    .replace(/^\s*Download\s+/i, "")
    .replace(/,\s*PDF file(?:,\s*added\s+[\d-]+)?\s*$/i, "")
    .trim()

/**
 * Every PDF link under one section heading, as `{ label, fileUrl, posted }`.
 *
 * The label is the item's own title where the newer markup gives one, the bare
 * `<a>` text where the older markup does, then the `aria-label` (stripped of its
 * "Download ..., PDF file, added ..." wrapper), then the filename. `posted` is
 * the day the file was put up -- only the newer markup carries it -- and is used
 * to break a tie between several copies of one agenda.
 */
export function sectionDocuments(html) {
  const out = []
  const seen = new Set()
  for (const m of html.matchAll(ANCHOR)) {
    const [, before, fileUrl, after, inner] = m
    if (seen.has(fileUrl)) continue
    seen.add(fileUrl)

    const titled = inner.match(/ss-document-title[^>]*>([\s\S]*?)<\/div>/i)
    const aria = `${before} ${after}`.match(/aria-label="([^"]*)"/i)?.[1]
    const label =
      (titled && text(titled[1])) ||
      (!titled && text(inner)) ||
      (aria && fromAria(aria)) ||
      decodeURIComponent(fileUrl.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "")

    const posted = inner.match(/ss-document-date[^>]*>\s*(\d{4}-\d{2}-\d{2})/i)?.[1] ?? null
    out.push({ label, fileUrl, posted })
  }
  return out
}

/** Split the page into its `{ heading, body }` sections. */
export function parseSections(html) {
  const out = []
  for (const part of html.split(/<h2 class="ss-component-header-title">/i).slice(1)) {
    const end = part.indexOf("</h2>")
    if (end === -1) continue
    out.push({ heading: text(part.slice(0, end)), body: part.slice(end + 5) })
  }
  return out
}

/**
 * One agenda per sitting.
 *
 * The city posts the agenda several times over -- the city clerk's Open Meeting
 * Law posting, the "Final for Posting" copy, then "Updated" reissues when an
 * item moves -- and they carry the same items. The site wants one. Prefer a
 * "Final for Posting" copy, then the most recently posted, then the first
 * listed; the rest are dropped and counted. Minutes and everything else are
 * kept as they are.
 */
export function pickAgenda(docs) {
  const agendas = docs.filter((d) => kindOf(d.label) === "agenda")
  if (agendas.length <= 1) return { kept: docs, dropped: [] }
  const [best] = [...agendas].sort(
    (a, b) =>
      Number(/final for posting/i.test(b.label)) - Number(/final for posting/i.test(a.label)) ||
      (b.posted ?? "").localeCompare(a.posted ?? "") ||
      agendas.indexOf(a) - agendas.indexOf(b),
  )
  const dropped = agendas.filter((d) => d !== best)
  const drop = new Set(dropped)
  return { kept: docs.filter((d) => !drop.has(d)), dropped }
}

function toRecord({ label, fileUrl, date, kind, dateConflict = false, filenameDate = null }) {
  return {
    title: label,
    // The city's own filename, which is the only other name the document has.
    description: decodeURIComponent(fileUrl.split("/").pop() ?? ""),
    pageUrl: HPS_PAGE,
    fileUrl,
    // One body. Named here rather than guessed -- `classify` would read "boa" or
    // "planning" out of an attached policy's filename and misfile it.
    board: "School Committee",
    kind,
    category: CATEGORY[kind],
    date,
    // The heading is the authority; the title/filename chain is not walked, the
    // same as a notice's date. `filename` here would be a different meaning.
    dateSource: "schedule-page",
    rawMeetingDate: null,
    dateAdjusted: false,
    dateConflict,
    filenameDate,
    needsReview: dateConflict,
    // The one `source` this scrape owns; each run replaces only its own.
    source: HPS_PAGE,
  }
}

const defaultFetch = () =>
  retrying("fetch the School Committee meeting page", async () => {
    const res = await fetch(HPS_PAGE, { headers: { "User-Agent": USER_AGENT } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text()
  })

/**
 * Every document the School Committee page carries, as records.
 *
 * `fetchPage` is injectable for the tests. An empty parse throws rather than
 * returning nothing -- a file written from it would drop every record this
 * scrape owns -- the same guard the other document scrapes use.
 */
export async function fetchSchoolCommitteeDocuments({ fetchPage = defaultFetch } = {}) {
  const html = await fetchPage()
  const sections = parseSections(html)
  if (!sections.length)
    throw new Error("no sections on the School Committee page; its markup changed")

  const skippedHeadings = []
  const carriedHeadings = []
  let droppedAgendas = 0
  let carried = null
  const raw = []

  for (const { heading, body } of sections) {
    const own = sectionDate(heading)
    if (own) carried = own
    const date = own ?? (carried && isContinuation(heading) ? carried : null)
    const docs = sectionDocuments(body)
    if (!date) {
      if (docs.length) skippedHeadings.push({ heading, files: docs.length })
      continue
    }
    if (!own && docs.length) carriedHeadings.push({ heading, date, files: docs.length })
    const { kept, dropped } = pickAgenda(docs)
    droppedAgendas += dropped.length
    for (const d of kept) raw.push({ label: d.label, fileUrl: d.fileUrl, posted: d.posted, date })
  }

  if (!raw.length) throw new Error("no documents on the School Committee page; its markup changed")

  // A PDF listed under more than one date heading -- the page does this, an
  // April 30 agenda also sits under April 9. Keep the occurrence whose heading
  // matches the document's own filename date; if none does, keep the first and
  // flag it the way a title/filename disagreement is flagged anywhere else.
  const byFile = new Map()
  for (const d of raw) byFile.set(d.fileUrl, [...(byFile.get(d.fileUrl) ?? []), d])

  const documents = []
  for (const [fileUrl, list] of byFile) {
    let chosen = list[0]
    let dateConflict = false
    let filenameDate = null
    if (list.length > 1) {
      const fromName = parseDateFromFilename(fileUrl)?.date ?? null
      const match = fromName ? list.find((d) => d.date === fromName) : null
      if (match) chosen = match
      else {
        dateConflict = true
        filenameDate = fromName
      }
    }
    documents.push(toRecord({ ...chosen, kind: kindOf(chosen.label), dateConflict, filenameDate }))
  }

  return {
    documents: documents.sort(
      (a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title),
    ),
    sections: sections.length,
    skippedHeadings,
    carriedHeadings,
    droppedAgendas,
  }
}
