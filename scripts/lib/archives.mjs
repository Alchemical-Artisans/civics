/**
 * The city's own archives of past agendas and minutes.
 *
 * The "Agendas and Minutes" listing only reaches back to 2025. Under it sit two
 * more pages -- "Agenda Archive" and "Minutes Archive" -- holding some 1,660
 * further documents back to 2012, and the listing links to them in a sentence
 * the scraper reads past. They are the bulk of the city's published record.
 *
 * Neither is a document listing. Both are one long run of links separated by
 * headings in bare text, so a link's board and kind come from the heading above
 * it rather than from anything about the link. Two levels of heading: a board
 * ("2019 Council Meeting Minutes", "LICENSE COMMISSION MINUTES") and, beneath
 * the License Commission's, a bare year.
 *
 * **A heading is trusted only as far as it can be checked.** The minutes
 * archive carries 268 Board of Assessors minutes under a Council heading, named
 * `boa-mtg-min-*` and titled "1.07.2025.BOA.Mtg.Min" -- the same series the
 * city's own listing files under that board, and nothing the Council ever sat
 * for. So every link is cross-checked against what its own title and filename
 * say, and where the two disagree the link wins: it is the more specific
 * evidence, and the heading is a section they were dropped into rather than a
 * claim anyone checked. `reattributed` reports how many, and `skipped` the
 * handful with no readable date at all -- both numbers to watch if the page is
 * ever restructured.
 */
import { USER_AGENT, classify, parseDateFromTitle, retrying } from "./haverhill.mjs"

const ORIGIN = "https://www.haverhillma.gov"

export const ARCHIVE_PAGES = [
  { path: "/government/agendas-and-minutes/agenda-archive/", kind: "agenda" },
  { path: "/government/agendas-and-minutes/minutes-archive/", kind: "minutes" },
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
 * What a heading says, or null if it is not one.
 *
 * A bare year keeps whichever board is in force -- the License Commission's
 * section is split by year that way.
 */
export function readHeading(label) {
  if (/toggle menu/i.test(label)) return null
  const year = label.match(/\b(20\d{2})\b/)?.[1]
  if (/license commission\s+(agendas?|minutes)/i.test(label)) {
    return { board: "License Commission", year: year && Number(year) }
  }
  if (/(city )?council\s+(meeting\s+)?(agendas?|minutes)/i.test(label)) {
    return { board: "City Council", year: year && Number(year) }
  }
  if (/^\s*(20\d{2})\s*$/.test(label)) return { year: Number(RegExp.$1) }
  return null
}

/**
 * Every archived document on one page, with the board its heading claims.
 *
 * The date is the link's own label where it carries one, and the heading's year
 * fills in where it does not: the older Council sections write "Jan 5" and
 * leave the year to the heading above.
 */
export function parseArchive(html, kind) {
  const body = html.slice(Math.max(0, html.indexOf("content-col")))

  // Links and headings in one pass, so both are positions in the same string.
  // Reading them separately and sorting by offset is wrong twice over: blanking
  // the links to keep their labels out of the headings shifts every offset
  // after it, and the two sets then interleave in an order that has nothing to
  // do with the page. The alternation consumes an anchor whole, which is what
  // keeps a link's own label from being read as a heading.
  const events = []
  const token = /<a[^>]+href="([^"]+\.pdf[^"]*)"[^>]*>([\s\S]*?)<\/a>|>([^<>]{3,90})</gi
  for (const m of body.matchAll(token)) {
    if (m[1]) events.push({ link: { label: text(m[2]), url: m[1] } })
    else {
      const head = readHeading(text(m[3]))
      if (head) events.push({ head })
    }
  }

  const out = []
  const skipped = []
  const reattributed = []
  let board = null
  let year = null
  for (const e of events) {
    if (e.head) {
      if (e.head.board) board = e.head.board
      if (e.head.year) year = e.head.year
      continue
    }
    if (!board) continue
    const { label, url } = e.link
    const title = label || decodeURIComponent(url.split("/").pop() ?? "").replace(/\.[a-z]+$/i, "")

    // The heading is a claim about the link; what the link itself says is the
    // better evidence where it says anything. The minutes archive carries 268
    // Board of Assessors minutes under a Council heading, named
    // `boa-mtg-min-*` and titled "1.07.2025.BOA.Mtg.Min" -- the same series the
    // city's listing files under that board, and nothing the Council ever sat
    // for. The heading is a section they were dropped into, not a claim anyone
    // checked.
    const guessed = classify({ category: "", title, fileUrl: url, description: "" }).board
    const owner = guessed !== "Other" && guessed !== board ? guessed : board
    if (owner !== board) reattributed.push({ title, url, from: board, to: owner })

    if (!parseDateFromTitle(title) && !parseDateFromTitle(`${title}, ${year}`)) {
      skipped.push({ title, url, claimed: board, why: "no date in the label" })
      continue
    }
    out.push({
      // The year the heading supplies, where the label leaves it off.
      title: parseDateFromTitle(title) ? title : `${title}, ${year}`,
      pageUrl: null,
      fileUrl: url,
      category: `${owner} ${kind === "agenda" ? "Agendas" : "Minutes"}`,
      description: "",
    })
  }
  return { documents: out, skipped, reattributed }
}

/** Fetch both archives and read them. Two requests. */
export async function fetchArchives() {
  const documents = []
  const skipped = []
  const reattributed = []
  for (const page of ARCHIVE_PAGES) {
    const url = ORIGIN + page.path
    const html = await retrying(`fetch ${page.path}`, async () => {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.text()
    })
    const found = parseArchive(html, page.kind)
    for (const doc of found.documents) documents.push({ ...doc, pageUrl: page.path, source: url })
    skipped.push(...found.skipped)
    reattributed.push(...found.reattributed)
    console.log(
      `  ${page.path}: ${found.documents.length} documents, ${found.skipped.length} skipped`,
    )
  }
  return { documents, skipped, reattributed }
}
