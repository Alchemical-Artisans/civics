/**
 * Scraper for the Haverhill, MA "Budget and Audit Reports" page.
 *
 * Far simpler than the meeting listing next door: this is one ordinary HTML
 * page, no Umbraco endpoint and no per-document page to resolve, because every
 * row is a fiscal year and two links. One request gets the whole thing.
 *
 * What makes it fiddly is that the markup carries no structure at all. The
 * years are not rows, or list items, or anything else addressable -- the city
 * pastes them into a handful of <p> blocks, and eleven consecutive years share
 * one of those. So the parse works on the flattened run of text and links and
 * segments it on "FY####" markers, which is the only thing that reliably
 * separates one year from the next.
 */
import { USER_AGENT, retrying } from "./haverhill.mjs"

export const BUDGET_URL =
  "https://www.haverhillma.gov/government/budget-and-finance/financial-reports/budget-and-audit-reports/"

/**
 * The fewest years that can plausibly be on the page.
 *
 * The city adds a year at a time and has never removed one, so a parse
 * returning fewer than this means the markup changed shape rather than that
 * the city deleted two decades of budgets. Without the guard, a redesign would
 * quietly replace the data file with an empty list and the site would build
 * fine with nothing on it.
 */
const MIN_YEARS = 20

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&nbsp;/g, " ")

const text = (s) =>
  decode(s.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()

/**
 * The page's content, with every <nav> removed.
 *
 * There is a nav before the content (the breadcrumb) and another after it (the
 * section menu, then a mega-menu carrying a couple of hundred links), so
 * cutting at the first one loses everything. Removing them all leaves the
 * reports and nothing else.
 */
export function contentRegion(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html
  return main.replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
}

/** The flattened run of text and links, in document order. */
function segments(region) {
  const link = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi
  const out = []
  let at = 0
  for (let m; (m = link.exec(region));) {
    out.push({ type: "text", value: text(region.slice(at, m.index)) })
    out.push({ type: "link", href: decode(m[1]), text: text(m[2]) })
    at = m.index + m[0].length
  }
  out.push({ type: "text", value: text(region.slice(at)) })
  return out
}

/**
 * The last fiscal year named in a run of text, or null.
 *
 * The last rather than the first because a run can name several -- the text
 * between two links is often "FY2023 Mayor's Budget" followed by the next
 * year's label -- and it is the most recent marker that owns the links coming
 * after it. Both "FY2027" and "FY 2014" appear on the page.
 */
export function lastYearIn(value) {
  const years = [...value.matchAll(/\bFY\s?(\d{4})\b/g)]
  return years.length ? Number(years.at(-1)[1]) : null
}

/**
 * Which of the two reports a link is, or null if it is neither.
 *
 * The anchor text is asked first because it is what a reader sees and it is
 * consistent -- every audit link says "Audit Report" whether or not the word
 * "City" was left outside the anchor. The filename is the fallback, and it
 * needs three spellings: the city has called these "financial statements",
 * "audited financials" and "GASB FS" over twenty years.
 */
export function classifyReport(anchor, href) {
  const file = decodeURIComponent(href.split("/").pop() ?? "")
  for (const candidate of [anchor, file]) {
    if (/audit|financial|gasb/i.test(candidate)) return "audit"
    if (/budget/i.test(candidate)) return "budget"
  }
  return null
}

const isReport = (href) => /\.pdf(\?|#|$)/i.test(href)

/**
 * Every fiscal year on the page, newest first.
 *
 * A year with no link behind one of its two reports gets null for it, which is
 * a real state rather than an omission: the city prints "Mayor's Budget" as
 * plain text for FY2022 and FY2023, and lists no audit for a year it has not
 * finished auditing.
 */
export function parseBudgetListing(html) {
  const years = new Map()
  const unclassified = []
  let current = null

  const use = (year) => {
    if (!years.has(year)) years.set(year, { year, budget: null, audit: null })
    return years.get(year)
  }

  for (const seg of segments(contentRegion(html))) {
    // A link can carry its own year -- FY2027's whole label sits inside the
    // anchor -- so the marker is read off both kinds of segment.
    const year = lastYearIn(seg.type === "link" ? seg.text : seg.value)
    if (year) current = use(year)

    if (seg.type !== "link" || !current || !isReport(seg.href)) continue

    const kind = classifyReport(seg.text, seg.href)
    if (!kind) {
      unclassified.push({ year: current.year, href: seg.href, text: seg.text })
      continue
    }
    // First link of each kind wins, so a duplicate cannot silently replace the
    // one the page leads with.
    current[kind] ??= seg.href
  }

  const parsed = [...years.values()].sort((a, b) => b.year - a.year)
  if (parsed.length < MIN_YEARS) {
    throw new Error(
      `Budget page yielded ${parsed.length} fiscal years, expected at least ${MIN_YEARS}. ` +
        `The page markup has probably changed -- check ${BUDGET_URL} before trusting a rewrite.`,
    )
  }
  return { years: parsed, unclassified }
}

/** Fetch the page and parse it. */
export async function fetchBudgetListing() {
  const html = await retrying("budget listing", async () => {
    const res = await fetch(BUDGET_URL, { headers: { "User-Agent": USER_AGENT } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text()
  })
  return parseBudgetListing(html)
}

/**
 * What changed between two runs, for the summary a refresh prints.
 *
 * The point of the report is that this data is small enough to check by eye:
 * twenty-two rows, of which a normal year moves one. A run that claims to have
 * changed nine of them is a parser regression, and saying so out loud is the
 * only thing standing between that and a committed diff nobody reads.
 */
export function diffYears(before, after) {
  const was = new Map((before ?? []).map((y) => [y.year, y]))
  const now = new Map(after.map((y) => [y.year, y]))

  const added = after.filter((y) => !was.has(y.year)).map((y) => y.year)
  const removed = [...was.keys()].filter((year) => !now.has(year))
  const changed = []

  for (const year of now.keys()) {
    const old = was.get(year)
    if (!old) continue
    for (const field of ["budget", "audit"]) {
      if (old[field] !== now.get(year)[field]) {
        changed.push({ year, field, from: old[field], to: now.get(year)[field] })
      }
    }
  }

  return { added, removed, changed }
}
