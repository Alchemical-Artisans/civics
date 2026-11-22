/**
 * Keeping an issue page current: a saved search per page, run on every
 * `metadata:update`, whose hits wait in a committed list until a person has
 * folded them into the page or ruled them out.
 *
 * An issue page (`/issues/drought`, `/issues/ALPR`) is authored, not scraped,
 * and so it is the one part of the site a refresh cannot bring up to date. It
 * falls behind silently: the city posts a release, the Council takes an item
 * up, WHAV writes it up, and nothing anywhere says the page has not heard. This
 * is that something.
 *
 * **Two files beside each page.** `watch.json` is the search, written when the
 * page is -- what the page is about, put the ways each source can be asked.
 * `leads.json` is what the search has turned up, one entry per thing found,
 * with a `status` a person sets:
 *
 *   - `new`           found, not yet looked at -- the only status reported
 *   - `incorporated`  the page now reflects it
 *   - `irrelevant`    looked at, not about this, or not worth a line
 *
 * plus `cited`, which nobody sets: a lead whose address the page's own source
 * already contains is incorporated by definition, and the run says so rather
 * than asking. Nothing is ever removed from `leads.json`, for the reason
 * `reviews.json` keeps its answers -- a decision has to outlive the run that
 * prompted it, or the next run asks again.
 *
 * **`since` is when the page was last brought current.** Everything dated
 * before it is presumed to be what the page was written from, so it never
 * becomes a lead; the search represents what was available when the page was
 * written, and only what came after is news to it. A lead with no date at all
 * is kept, since there is no telling.
 *
 * **Five places are asked**, each the way it can be:
 *
 *   - the site's own record -- the titles in `meetings.json`, and the words of
 *     every meeting and item page written under `calendar/meetings/`, matched
 *     on `terms`. Offline and free.
 *   - the city's news releases at haverhillma.gov/news, each release's own
 *     text matched on `terms`, the bodies cached in `.cache/city-news/` so a
 *     release is fetched once.
 *   - Google News, one RSS search per `news` query. Free, keyless, and where
 *     WHAV, the Eagle-Tribune and the Boston stations turn up.
 *   - the open web and Facebook, handed to Claude Code (`claude -p`, web
 *     search only) with the page's `brief`, its `web` queries and the
 *     `facebook` pages to look at. The only source that judges relevance
 *     rather than matching words, the only one that costs anything, and the
 *     only one whose answer varies run to run, so `--no-web` skips it.
 *     Facebook does not let a script read a page, so the posts it finds are
 *     the ones a search engine has indexed and no more.
 */
import { createHash } from "node:crypto"
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs"
import path from "node:path"

export const ROOT = path.join(import.meta.dirname, "..", "..")
export const ISSUES_DIR = path.join(ROOT, "src", "routes", "issues")
const MEETINGS_DIR = path.join(ROOT, "src", "routes", "calendar", "meetings")
export const STATUSES = ["new", "incorporated", "irrelevant", "cited"]

/** Every issue directory with a `watch.json` in it. */
export function watchedIssues() {
  if (!existsSync(ISSUES_DIR)) return []
  return readdirSync(ISSUES_DIR)
    .filter((slug) => existsSync(path.join(ISSUES_DIR, slug, "watch.json")))
    .map((slug) => ({
      slug,
      dir: path.join(ISSUES_DIR, slug),
      watch: JSON.parse(readFileSync(path.join(ISSUES_DIR, slug, "watch.json"), "utf8")),
    }))
}

export function loadLeads(dir) {
  try {
    return JSON.parse(readFileSync(path.join(dir, "leads.json"), "utf8"))
  } catch {
    return {}
  }
}

/**
 * One address, however a source spells it -- so the same release found by two
 * sources, or quoted in the page with a trailing slash the listing lacks, is
 * one lead and is recognised as cited.
 */
export function normalizeUrl(url) {
  try {
    const u = new URL(url)
    for (const k of [...u.searchParams.keys()])
      if (/^(utm_|fbclid|gclid|oc$|hl$|gl$|ceid$)/.test(k)) u.searchParams.delete(k)
    u.hash = ""
    const s = `${u.host.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}${u.search}`
    return s.toLowerCase()
  } catch {
    return url.replace(/\/+$/, "").toLowerCase()
  }
}

/**
 * A short handle for a lead, stable across runs -- what the report prints and
 * `issues:mark` takes, since the address itself can be two hundred characters
 * of Google News redirect.
 */
export const leadId = (slug, url) =>
  createHash("sha1")
    .update(`${slug}\n${normalizeUrl(url)}`)
    .digest("hex")
    .slice(0, 7)

/** One pattern for a watch's `terms`: whole words, any case, any of them. */
export function termPattern(terms) {
  const esc = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"))
  return new RegExp(`\\b(?:${esc.join("|")})\\b`, "i")
}

/** The words around a match, so a lead can be judged from the report alone. */
export function excerpt(text, pattern, width = 90) {
  const m = pattern.exec(text)
  if (!m) return null
  const from = Math.max(0, m.index - width)
  const to = Math.min(text.length, m.index + m[0].length + width)
  return `${from > 0 ? "…" : ""}${text.slice(from, to).trim()}${to < text.length ? "…" : ""}`
}

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  lbrace: "{",
  rbrace: "}",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
  mdash: "—",
  ndash: "–",
}

export function plainText(html) {
  return html
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, n) =>
      n[0] === "#"
        ? String.fromCodePoint(n[1].toLowerCase() === "x" ? parseInt(n.slice(2), 16) : +n.slice(1))
        : (ENTITIES[n.toLowerCase()] ?? whole),
    )
    .replace(/\s+/g, " ")
    .trim()
}

/** Every file of an issue's own source, as one string, for spotting what it already cites. */
export function issueSource(dir) {
  const parts = []
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = path.join(d, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (
        /\.(svelte|ts|js|json|md)$/.test(name) &&
        !/^(watch|leads|sources)\.json$/.test(name)
      )
        parts.push(readFileSync(p, "utf8"))
    }
  }
  walk(dir)
  return parts.join("\n")
}

/** Whether the page's source already carries this lead's address. */
export function isCited(lead, source) {
  if (lead.sitePath) return source.includes(lead.sitePath.replace(/^\/calendar\/meetings\//, ""))
  const n = normalizeUrl(lead.url)
  return normalizeUrl(source).includes(n) || source.toLowerCase().includes(n)
}

/* ------------------------------------------------------------------ */
/* The site's own record                                               */
/* ------------------------------------------------------------------ */

const SITE = "https://haverhill.alchemicalartisans.com"

/**
 * Meeting and item pages under `calendar/meetings/` whose words match.
 *
 * Where an item page matches, its meeting page is not reported as well: the
 * meeting page lists the item's title, so it would match for the same reason
 * and say nothing the item does not.
 */
export function searchWrittenPages(pattern, { dir = MEETINGS_DIR } = {}) {
  const found = []
  if (!existsSync(dir)) return found
  for (const meeting of readdirSync(dir)) {
    const mdir = path.join(dir, meeting)
    if (!statSync(mdir).isDirectory() || meeting.startsWith("[")) continue
    const date = meeting.match(/(\d{4}-\d{2}-\d{2})$/)?.[1] ?? null
    const items = []
    for (const item of readdirSync(mdir)) {
      const page = path.join(mdir, item, "+page.svelte")
      if (!existsSync(page)) continue
      const text = plainText(readFileSync(page, "utf8"))
      if (!pattern.test(text)) continue
      const ts = path.join(mdir, item, "+page.ts")
      const title =
        (existsSync(ts) && readFileSync(ts, "utf8").match(/title:\s*["'`]([^"'`]+)/)?.[1]) || item
      items.push({ sitePath: `/calendar/meetings/${meeting}/${item}`, title, date, text })
    }
    if (items.length) found.push(...items)
    else {
      const page = path.join(mdir, "+page.svelte")
      if (!existsSync(page)) continue
      const text = plainText(readFileSync(page, "utf8"))
      if (pattern.test(text))
        found.push({ sitePath: `/calendar/meetings/${meeting}`, title: meeting, date, text })
    }
  }
  return found.map(({ sitePath, title, date, text }) => ({
    url: SITE + sitePath,
    sitePath,
    title,
    date,
    source: "meeting page",
    excerpt: excerpt(text, pattern),
  }))
}

/** Records in `meetings.json` whose own title or filename match. */
export function searchRecords(meetings, pattern) {
  return meetings
    .filter((m) => !m.orphan && pattern.test(`${m.title ?? ""} ${m.description ?? ""}`))
    .map((m) => ({
      url: m.fileUrl ?? m.pageUrl,
      title: `${m.board ?? ""}: ${m.title}`,
      date: m.date ?? null,
      source: m.kind === "recording" ? "recording" : "city document",
      excerpt: null,
    }))
    .filter((l) => l.url)
}

/* ------------------------------------------------------------------ */
/* The city's news releases                                            */
/* ------------------------------------------------------------------ */

export const NEWS_ORIGIN = "https://www.haverhillma.gov"

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

/** "Sep 21, 2026" as `2026-09-21`. */
export function newsDate(s) {
  const m = s?.match(/([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),\s*(\d{4})/)
  if (!m || !MONTHS[m[1].toLowerCase()]) return null
  return `${m[3]}-${String(MONTHS[m[1].toLowerCase()]).padStart(2, "0")}-${m[2].padStart(2, "0")}`
}

/** One page of haverhillma.gov/news: each release's address, title and date. */
export function parseNewsListing(html) {
  const out = []
  const re =
    /<a href="(\/news\/posts\/[^"]+)"[^>]*class="gs-feed-list-title[^"]*"[^>]*>([\s\S]*?)<\/a>[\s\S]*?gs-feed-list-date">([^<]*)</g
  for (const m of html.matchAll(re))
    out.push({ url: NEWS_ORIGIN + m[1], title: plainText(m[2]), date: newsDate(m[3]) })
  return out
}

/** A release's own words: the content column, without the sidebar beside it. */
export function parseNewsBody(html) {
  const from = html.indexOf('class="content-col')
  const to = html.indexOf("gs-news-second-column", from)
  if (from < 0) return ""
  return plainText(html.slice(from, to < 0 ? undefined : to).replace(/^[^>]*>/, ""))
}

/* ------------------------------------------------------------------ */
/* Google News                                                         */
/* ------------------------------------------------------------------ */

export const googleNewsUrl = (query) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`

/**
 * An RSS search result. The link is Google's own redirect -- the article's
 * address is not in the feed -- so a lead from here is identified by that,
 * and the publisher is kept beside it to say whose story it is.
 */
export function parseGoogleNews(xml) {
  const tag = (s, t) =>
    s.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`))?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "")
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const pub = tag(item, "pubDate")
    const d = pub ? new Date(pub) : null
    return {
      url: plainText(tag(item, "link") ?? ""),
      title: plainText(tag(item, "title") ?? ""),
      publisher: plainText(tag(item, "source") ?? ""),
      date: d && !isNaN(d) ? d.toISOString().slice(0, 10) : null,
      source: "news",
      excerpt: null,
    }
  })
}

/* ------------------------------------------------------------------ */
/* Merging into leads.json                                             */
/* ------------------------------------------------------------------ */

/**
 * Fold one run's hits into the stored leads.
 *
 * A hit already stored keeps its status and its first-found date -- whatever
 * a person decided stands. A new one is `cited` where the page already links
 * it and `new` otherwise. Hits dated before `since` are dropped, being what
 * the page was written from. Returns the merged leads and the ids added.
 */
export function mergeLeads(slug, stored, hits, { since, source, today }) {
  const leads = { ...stored }
  const added = []
  const byUrl = new Map(Object.values(leads).map((l) => [normalizeUrl(l.url), l]))
  // Google News gives one story a different redirect link per edition it
  // carries, so a story is also known by its headline: the same title from
  // the same publisher is the same lead however it was reached.
  const headline = (l) =>
    l.source === "news" ? l.title.toLowerCase().replace(/\W+/g, " ").trim() : null
  const byTitle = new Set(Object.values(leads).map(headline).filter(Boolean))
  for (const hit of hits) {
    if (since && hit.date && hit.date < since) continue
    const id = leadId(slug, hit.url)
    if (leads[id] || byUrl.has(normalizeUrl(hit.url))) continue
    if (headline(hit) && byTitle.has(headline(hit))) continue
    if (headline(hit)) byTitle.add(headline(hit))
    const lead = {
      status: isCited(hit, source) ? "cited" : "new",
      found: today,
      date: hit.date ?? null,
      source: hit.source,
      title: hit.title,
      ...(hit.publisher ? { publisher: hit.publisher } : {}),
      url: hit.url,
      ...(hit.excerpt ? { excerpt: hit.excerpt } : {}),
      ...(hit.note ? { note: hit.note } : {}),
    }
    leads[id] = lead
    byUrl.set(normalizeUrl(hit.url), lead)
    added.push(id)
  }
  // Re-check every lead still waiting: a person who cited it in the page has
  // answered it, whether or not they came back here to say so.
  for (const lead of Object.values(leads))
    if (lead.status === "new" && isCited(lead, source)) lead.status = "cited"
  return { leads: sortLeads(leads), added }
}

/** Newest first, so the file reads the way the report does. */
export function sortLeads(leads) {
  return Object.fromEntries(
    Object.entries(leads).sort(
      ([, a], [, b]) =>
        (b.date ?? b.found ?? "").localeCompare(a.date ?? a.found ?? "") ||
        a.url.localeCompare(b.url),
    ),
  )
}

/** Every lead still `new`, across every watched issue, for the attention report. */
export function openLeads() {
  return watchedIssues().flatMap(({ slug, dir }) =>
    Object.entries(loadLeads(dir))
      .filter(([, l]) => l.status === "new")
      .map(([id, l]) => ({ slug, id, ...l })),
  )
}
