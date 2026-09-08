/**
 * The Planning Board's agendas and minutes, which are not in the city's listing.
 *
 * Every other board's documents reach the calendar through the "Agendas and
 * Minutes" listing. The Planning Board's do not: its own page carries them as
 * plain links to the CDN, going back to November 2017, and the listing holds
 * exactly one of them. Without this the calendar shows a board that meets every
 * month as having met once.
 *
 * There are no media pages here, so there is no `Meeting Date` field to read --
 * the date comes from the link's own label, which is how the board names its
 * documents ("Planning Board Agenda 2.11.26"). Everything after that is the
 * ordinary pipeline: `resolveDocument` reads the date and classifies the
 * record, `assignIds` gives it a permanent id.
 */
import { USER_AGENT, parseDateFromTitle, retrying } from "./haverhill.mjs"

export const PLANNING_BOARD_URL =
  "https://www.haverhillma.gov/government/boards-committees-and-commissions/planning-board/"

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
 * The label has to name the board and say which of the two kinds it is, which
 * keeps out everything else the page links -- the meeting schedules, the zoning
 * map, the master plan's ten sections, an application form. It also has to
 * carry a date: an agenda with no date in its label cannot be placed on a
 * calendar, and there is nowhere else here to look for one.
 *
 * Labels sometimes carry a note after the date -- "Amended", "Cancelled",
 * "N/A". Those stay in the title exactly as the board wrote them. A cancelled
 * meeting's agenda is still a document the city published, and the title is
 * where a reader learns which it is.
 */
export function documentFromLink(label, fileUrl) {
  if (!/^Planning Board\s+(Meeting\s+)?(Agenda|Minutes)/i.test(label)) return null
  if (!parseDateFromTitle(label)) return null
  return {
    title: label,
    // No media page exists for these; the board page is where they are
    // published, and it is what a reader would open to find them.
    pageUrl: new URL(PLANNING_BOARD_URL).pathname,
    fileUrl,
    category: "",
    description: "",
  }
}

/** Every agenda and minutes link on the board's page, in the order it lists them. */
export function parseDocumentLinks(html) {
  const out = []
  const seen = new Set()
  for (const m of html.matchAll(/<a[^>]+href="([^"]+\.pdf[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const doc = documentFromLink(text(m[2]), m[1])
    // The page links a few documents twice, in a section and again in an
    // archive. One file is one document.
    if (doc && !seen.has(doc.fileUrl)) {
      seen.add(doc.fileUrl)
      out.push(doc)
    }
  }
  return out
}

/** Fetch the board's page and read its documents. One request. */
export async function fetchPlanningBoardDocuments() {
  const html = await retrying("fetch Planning Board page", async () => {
    const res = await fetch(PLANNING_BOARD_URL, { headers: { "User-Agent": USER_AGENT } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text()
  })
  return parseDocumentLinks(html)
}
