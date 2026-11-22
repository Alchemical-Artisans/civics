/**
 * Whether anything an issue page cites has changed since the page cited it.
 *
 * A guide rests on the pages it links: a city release, an agency's drought
 * page, a news story, a PDF. Any of them can be edited after the guide quotes
 * it -- a release corrected, a status page moved on a level, a story updated
 * with the city's response -- and nothing tells the guide. `leads.json` finds
 * what is new; this watches what is already there.
 *
 * **An MD5 of each linked address, kept in `sources.json` beside the page.**
 * The hash recorded there is the version the page was written against. When a
 * run fetches a different one and the next run fetches it again, the entry
 * turns `changed`, keeps both hashes, and is listed in the attention report
 * until a person has read the new version, brought the page into line if it
 * needs it, and accepted the new hash with `npm run issues:mark -- <id>`.
 *
 * **What is hashed is what a reader reads, not the bytes served.** A PDF, a
 * spreadsheet or an image is hashed whole, since every byte of it is the
 * document. A web page is not: the HTML around an article carries ads,
 * timestamps, anti-forgery tokens and a list of related stories that differ
 * on every load, and hashing them would report every news site as changed on
 * every run -- a report that is always full is one nobody reads. So a page is
 * reduced to its text, in three steps:
 *
 *   - the largest `<article>` -- not first-to-last, since CBS and EFF print
 *     eleven, ten of them teasers for other stories -- else `<main>`, else
 *     `<body>`. Fifteen of the seventy-two pages the guides cited when this
 *     was written (aclu.org, congress.gov, courtlistener, census.gov…) carry
 *     neither semantic element, so the body case is not a corner;
 *   - without the site's own furniture: `<header>`, `<nav>`, `<footer>`,
 *     `<aside>`, forms and embeds, and any element whose class or id names
 *     itself as a menu, sidebar, share bar, related-stories list, cookie
 *     banner or ad. A heuristic, and the rest of this file is built on the
 *     assumption that it will sometimes be wrong;
 *   - without scripts, styles or markup.
 *
 * **A change has to hold for two runs before it is reported.** Measured
 * across two fetches thirty seconds apart, Wikipedia, ABC, KATV and
 * Cambridge Day each hashed differently with the same sentences in them --
 * the server answering from different caches, not anybody editing. A new
 * hash is recorded as `pending` and becomes `changed` only when the next run
 * fetches the same one; a page that flickers between two versions never
 * settles on either and is never reported.
 *
 * **And a reported change says what changed.** Each version's text is kept
 * in `.cache/issue-sources/<md5>.txt`, so the attention report can print the
 * sentences that went and the ones that arrived. Where the heuristic above
 * let a "most read" list through, that is plain at a glance and costs one
 * `issues:mark` rather than a reread of the whole source. The cache is
 * gitignored, so on a fresh checkout the first change has no old text to
 * compare and says so.
 *
 * **A page that cannot be fetched is not a change.** A 404 or 410 is treated
 * as a version of its own, `gone:404`, under the same two-run rule, and
 * reported as `gone` -- a cited source disappearing is the strongest reason
 * there is to look again. Anything else (a timeout, a 403 from a site that
 * refuses scripts -- mass.gov, findlaw, congress.gov and muckrock all do) is
 * `unreachable`, keeps its last good hash, and is listed in the report file
 * without being counted on the console, since it is the same answer every
 * run and nothing the guide can act on. `--ignore` stops one being fetched.
 */
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { ROOT, normalizeUrl, plainText } from "./issue-watch.mjs"

export const SOURCE_STATUSES = ["ok", "changed", "gone", "unreachable", "ignored"]
export const TEXT_CACHE = path.join(ROOT, ".cache", "issue-sources")

/**
 * A source's handle. Salted apart from `leadId`, because a lead the page has
 * cited is also one of its sources, and one id must not name two things
 * `issues:mark` would treat differently.
 */
export const sourceId = (slug, url) =>
  createHash("sha1")
    .update(`source\n${slug}\n${normalizeUrl(url)}`)
    .digest("hex")
    .slice(0, 7)

export const md5 = (data) => createHash("md5").update(data).digest("hex")

export function loadSources(dir) {
  try {
    return JSON.parse(readFileSync(path.join(dir, "sources.json"), "utf8"))
  } catch {
    return {}
  }
}

/**
 * Every outside address the page's source links, once each.
 *
 * Taken from the source text rather than the built page, the same as
 * `isCited`: the guide's own words are what cite. A fragment is dropped --
 * `file.pdf#page=3` and `#page=9` are one document -- and so is anything that
 * is not a real absolute address: a URL in a comment cut off by a backtick,
 * or the front half of a template literal (`video/${slug}` reads as
 * `video/$`). This site's own pages and schema.org, which the page names as
 * a vocabulary rather than cites, are left out.
 */
export function linkedUrls(source) {
  const urls = new Map()
  for (const raw of source.match(/https?:\/\/[^\s"'`)<>{}\]]+/g) ?? []) {
    const url = raw.replace(/#.*$/, "").replace(/[.,;:]+$/, "")
    if (url.endsWith("$")) continue
    try {
      const u = new URL(url)
      if (!u.hostname.includes(".")) continue
      if (/(^|\.)schema\.org$|alchemicalartisans\.com$/.test(u.hostname)) continue
    } catch {
      continue
    }
    const key = normalizeUrl(url)
    if (!urls.has(key)) urls.set(key, url)
  }
  return [...urls.values()].sort()
}

/* ------------------------------------------------------------------ */
/* Reducing a page to its words                                        */
/* ------------------------------------------------------------------ */

/**
 * Every element of these names, with all it contains. Matched by counting
 * nested tags of the same name rather than by a lazy regex, which would stop
 * at the first `</div>` inside a sidebar and leave the rest of it behind.
 */
const VOID = new Set([
  "img",
  "input",
  "br",
  "hr",
  "meta",
  "link",
  "source",
  "wbr",
  "area",
  "col",
  "embed",
  "track",
])

function elements(html, test) {
  const found = []
  const open = /<([a-z][a-z0-9]*)\b([^>]*)>/gi
  let m
  while ((m = open.exec(html))) {
    const [whole, name, attrs] = m
    if (whole.endsWith("/>") || VOID.has(name.toLowerCase()) || !test(name.toLowerCase(), attrs))
      continue
    const tag = new RegExp(`<(/?)${name}\\b[^>]*>`, "gi")
    tag.lastIndex = m.index + whole.length
    let depth = 1
    let t
    while (depth && (t = tag.exec(html))) depth += t[1] ? -1 : t[0].endsWith("/>") ? 0 : 1
    const end = t ? tag.lastIndex : html.length
    found.push({
      start: m.index,
      end,
      inner: html.slice(m.index + whole.length, t ? t.index : end),
    })
    open.lastIndex = end
  }
  return found
}

const CHROME_TAGS = new Set([
  "header",
  "nav",
  "footer",
  "aside",
  "form",
  "noscript",
  "iframe",
  "dialog",
])
/**
 * Class and id words a site's furniture calls itself, as whole words. A name
 * is split on hyphens, underscores and camelCase humps, so `share-bar`,
 * `site_footer` and a CSS module's `TeasersBlockSidebar_teaserBlock__wUrKC`
 * (how the Sinclair stations' pages, CBS12 and KATV, name their "Trending"
 * column) all match, while `shareholder` and `adoption` do not.
 */
const CHROME_WORDS = new Set(
  (
    "nav navbar navigation menu header footer sidebar breadcrumb breadcrumbs cookie consent " +
    "share sharing social follow related recommended recommendations trending newsletter " +
    "subscribe promo ad ads advert advertisement banner modal popup skip teaser teasers " +
    "taboola outbrain comments commenting"
  ).split(" "),
)
export const nameWords = (names) =>
  names
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

const isChrome = (name, attrs) => {
  if (CHROME_TAGS.has(name)) return true
  if (/\brole\s*=\s*"(navigation|banner|contentinfo|complementary)"/i.test(attrs)) return true
  const names = [...attrs.matchAll(/\b(?:class|id)\s*=\s*"([^"]*)"/gi)].map((a) => a[1]).join(" ")
  return nameWords(names).some((w) => CHROME_WORDS.has(w))
}

/**
 * Remove every chrome element, outermost first, so nothing nested is cut
 * twice.
 *
 * Except one holding most of the words: furniture is the lesser part of a
 * page by definition, and a wrapper that names itself after it --
 * `<div class="page has-sidebar">` round everything -- is not furniture. That
 * one is kept and searched inside instead, so the sidebar it mentions still
 * goes.
 */
function withoutChrome(html, total = plainText(html).length) {
  let out = ""
  let at = 0
  for (const { start, end, inner } of elements(html, isChrome)) {
    out += html.slice(at, start) + " "
    if (plainText(inner).length > total / 2) out += withoutChrome(inner, total)
    at = end
  }
  return out + html.slice(at)
}

/** The words a reader reads on an HTML page, by the rule at the head of this file. */
export function readableText(html) {
  const largest = (name) =>
    elements(html, (n) => n === name)
      .map((e) => e.inner)
      .sort((a, b) => plainText(b).length - plainText(a).length)[0]
  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1]
  return plainText(withoutChrome(largest("article") ?? largest("main") ?? body ?? html))
}

/** A fetched response's hash and, for a web page, the text the hash is of. */
export function hashBody(contentType, buffer) {
  if (!/html/i.test(contentType ?? "")) return { hash: md5(buffer) }
  const text = readableText(buffer.toString("utf8"))
  return { hash: md5(text), text }
}

/* ------------------------------------------------------------------ */
/* Keeping each version's words, to say what changed                   */
/* ------------------------------------------------------------------ */

export function saveText(hash, text) {
  if (!text) return
  mkdirSync(TEXT_CACHE, { recursive: true })
  const file = path.join(TEXT_CACHE, `${hash}.txt`)
  if (!existsSync(file)) writeFileSync(file, text)
}

const loadText = (hash) => {
  try {
    return readFileSync(path.join(TEXT_CACHE, `${hash}.txt`), "utf8")
  } catch {
    return null
  }
}

/** A page's text cut into sentences, which is the grain a reader notices a change at. */
const sentences = (text) =>
  text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/)
    .map((s) => s.trim())
    .filter(Boolean)

/**
 * The sentences one version has that the other lacks, a few of each.
 * Returns null where either version's text was never kept (a file, or a
 * cache emptied since).
 */
export function textDiff(fromHash, toHash, limit = 4) {
  const a = fromHash && loadText(fromHash)
  const b = toHash && loadText(toHash)
  if (!a || !b) return null
  const sa = new Set(sentences(a))
  const sb = new Set(sentences(b))
  const removed = [...sa].filter((s) => !sb.has(s))
  const added = [...sb].filter((s) => !sa.has(s))
  return {
    removed: removed.slice(0, limit),
    added: added.slice(0, limit),
    more: Math.max(0, removed.length - limit) + Math.max(0, added.length - limit),
  }
}

/* ------------------------------------------------------------------ */
/* Merging into sources.json                                           */
/* ------------------------------------------------------------------ */

const statusOf = (version) => (version.startsWith("gone:") ? "gone" : "changed")

/**
 * Fold one run's fetches into the stored hashes.
 *
 * `results` maps url to `{ hash }`, `{ gone: status }` or `{ error }`. A new
 * address is recorded as it stands, which is the baseline: the page was
 * written against whatever is there the first time it is seen -- unless it
 * is already dead, which is reported at once, there being no version to
 * wait for. An address the page no longer links is dropped, being no longer
 * a source.
 */
export function mergeSources(slug, stored, urls, results, today) {
  const out = {}
  for (const url of urls) {
    const id = sourceId(slug, url)
    const prev = stored[id]
    const r = results.get(url)
    if (prev?.status === "ignored" || !r) {
      if (prev) out[id] = prev
      continue
    }
    const e = prev ? { ...prev, url } : { url, status: "ok", md5: null }
    const version = r.hash ?? (r.gone ? `gone:${r.gone}` : null)

    if (!version) {
      // One failed fetch says nothing about the document: keep what it was.
      if (e.status === "ok") e.status = "unreachable"
      e.error = r.error
    } else {
      delete e.error
      e.checked = today
      if (!e.md5) {
        // Dead the first time it is seen: there is no version the page was
        // written against, so nothing is taken as the baseline and it stays
        // reported until a person accepts it -- which records the 404 itself.
        if (r.gone)
          Object.assign(e, { status: "gone", current: version, changed: e.changed ?? today })
        else Object.assign(e, { md5: version, since: today, status: "ok" })
        if (!r.gone) delete e.current
      } else if (version === e.md5) {
        e.status = "ok"
        for (const k of ["current", "changed", "pending", "pendingSince"]) delete e[k]
      } else if (e.current) {
        // Already reported; a further edit moves what it is reported as.
        if (version !== e.current) Object.assign(e, { current: version, changed: today })
        e.status = statusOf(version)
      } else if (version === e.pending) {
        Object.assign(e, { current: version, changed: today, status: statusOf(version) })
        delete e.pending
        delete e.pendingSince
      } else {
        Object.assign(e, { pending: version, pendingSince: today, status: "ok" })
      }
    }
    out[id] = e
  }
  return Object.fromEntries(Object.entries(out).sort(([, a], [, b]) => a.url.localeCompare(b.url)))
}

/**
 * Accept a source as the page now stands against it: the version last
 * fetched becomes the one the page was written against -- a dead link
 * included, which is how a person says they have seen it go. With
 * `ignore`, stop watching it at all.
 */
export function acceptSource(entry, { ignore = false } = {}) {
  if (ignore) return { ...entry, status: "ignored" }
  const next = { ...entry, status: "ok", md5: entry.current ?? entry.md5 }
  for (const k of ["current", "changed", "pending", "pendingSince", "error"]) delete next[k]
  return next
}

/** Every source a person has to look at, across every watched issue. */
export function sourcesNeedingAttention(issues) {
  return issues.flatMap(({ slug, dir }) =>
    Object.entries(loadSources(dir))
      .filter(([, s]) => ["changed", "gone", "unreachable"].includes(s.status))
      .map(([id, s]) => ({ slug, id, ...s })),
  )
}
