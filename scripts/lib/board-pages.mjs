/**
 * The agendas and minutes some boards keep on their own pages.
 *
 * Most boards' documents reach the calendar through the city's "Agendas and
 * Minutes" listing. Two do not: the Planning Board and the Zoning Board of
 * Appeals publish theirs on their own pages as plain links to the CDN, back to
 * 2017 and 2018, and the listing holds one of the Planning Board's and none of
 * the Zoning Board's. Without this the calendar shows two boards that meet
 * every month as having met once and never.
 *
 * There are no media pages here, so there is no `Meeting Date` field to read --
 * the date comes from the link's own label, which is how a board names its
 * documents. Everything after that is the ordinary pipeline: `resolveDocument`
 * reads the date and classifies the record, `assignIds` gives it an id.
 *
 * **The board is named here rather than guessed.** It is passed through as the
 * record's `category`, which is the field the listing names a board in, so
 * `classify` derives it the same way for both. Letting it guess instead works
 * for the Planning Board and fails badly for the Zoning Board: its files are
 * named `boa-...`, and `boa` is how the Board of Assessors is spelled
 * everywhere else in this data.
 */
import { USER_AGENT, parseDateFromTitle, retrying } from "./haverhill.mjs"

export const BOARD_PAGES = [
  {
    board: "Planning Board",
    url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/planning-board/",
    // Labels name the board and the kind, then the date: "Planning Board
    // Agenda 2.11.26". Anchored, so the meeting schedules -- "Planning Board
    // Meeting Schedule 2026" -- are left for `schedule.mjs`.
    document: /^Planning Board\s+(?:Meeting\s+)?(?:Agenda|Minutes)/i,
  },
  {
    board: "Zoning Board of Appeals",
    url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/zoning-board-of-appeals/",
    // Labels are the date and then the kind: "January 21, 2026 Agenda". The
    // board is not named in them at all, which is why it is named above.
    document: /\b(?:Agenda|Minutes)\b/i,
  },
]

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
 * A document link, or null.
 *
 * The label has to say which of the two kinds it is, which keeps out everything
 * else a board page links -- the meeting schedules, the zoning map, the master
 * plan's ten sections, an application form. It also has to carry a date: an
 * agenda with no date in its label cannot be placed on a calendar, and there is
 * nowhere else here to look for one.
 *
 * Labels sometimes carry a note after the date -- "Amended", "Cancelled",
 * "N/A". Those stay in the title exactly as the board wrote them. A cancelled
 * meeting's agenda is still a document the city published, and the title is
 * where a reader learns which it is. An entry with the note and *no link* is a
 * different thing: no agenda exists, and `schedule.mjs` reads those as sittings
 * the board has called off.
 */
export function documentFromLink(label, fileUrl, page) {
  if (!page.document.test(label)) return null
  if (!parseDateFromTitle(label)) return null
  return {
    title: label,
    // No media page exists for these; the board page is where they are
    // published, and it is what a reader would open to find them.
    pageUrl: new URL(page.url).pathname,
    fileUrl,
    // The board, in the field the listing states it in. `classify` derives
    // `board` from this and `kind` from the title, exactly as it does for a
    // listing row -- rather than a second path that could disagree with it.
    category: page.board,
    description: "",
  }
}

/**
 * Every agenda and minutes link on a board's page, in the order it lists them.
 *
 * A link's own text is the label, except where the board left it empty -- the
 * Zoning Board has thirteen such -- in which case the `title` attribute carries
 * the name ("Minutes February 192025"), and failing that the filename does.
 */
export function parseDocumentLinks(html, page) {
  const out = []
  const seen = new Set()
  for (const m of html.matchAll(/<a([^>]+href="([^"]+\.pdf[^"]*)")[^>]*>([\s\S]*?)<\/a>/gi)) {
    const label =
      text(m[3]) ||
      text(m[0].match(/title="([^"]*)"/)?.[1] ?? "") ||
      decodeURIComponent(m[2].split("/").pop() ?? "").replace(/\.[a-z]+$/i, "")
    const doc = documentFromLink(label, m[2], page)
    // The page links a few documents twice, in a section and again in an
    // archive. One file is one document.
    if (doc && !seen.has(doc.fileUrl)) {
      seen.add(doc.fileUrl)
      out.push(doc)
    }
  }
  return out
}

/** Fetch every board page that keeps its own documents, and read them. */
export async function fetchBoardDocuments() {
  const out = []
  for (const page of BOARD_PAGES) {
    const html = await retrying(`fetch ${page.board} page`, async () => {
      const res = await fetch(page.url, { headers: { "User-Agent": USER_AGENT } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.text()
    })
    const docs = parseDocumentLinks(html, page)
    console.log(`  ${page.board}: ${docs.length} documents`)
    out.push(...docs)
  }
  return out
}
