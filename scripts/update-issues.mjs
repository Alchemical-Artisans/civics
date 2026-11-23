#!/usr/bin/env node
/**
 * Run every issue page's saved search, and record what it finds.
 *
 *   npm run issues:update                      every issue, every source
 *   npm run issues:update -- --issue=drought   one issue
 *   npm run issues:update -- --no-web          skip the Claude Code web search
 *   npm run issues:update -- --no-sources      skip re-hashing the pages each guide links
 *   npm run issues:mark -- <id>... [--irrelevant | --new]   a lead
 *   npm run issues:mark -- <id>... [--ignore]               a changed source: accept it
 *
 * See `scripts/lib/issue-watch.mjs` for what the files mean and why. This is a
 * step of `metadata:update`, ahead of the links check, so the leads it leaves
 * open are in the "needs your attention" block that ends the run. It reads the
 * meeting pages as they stand when it runs, so a sitting written up by the
 * transcribe step at the end of that same run is searched on the next one.
 *
 * A source that fails is reported and skipped rather than stopping the run --
 * Google throttling a query is no reason to lose what the city's own pages
 * turned up -- and the step exits non-zero so `metadata:update` repeats it.
 */
import { spawn } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"
import { USER_AGENT, retrying } from "./lib/haverhill.mjs"
import { loadStore } from "./lib/store.mjs"
import { writeDataFile } from "./lib/data-file.mjs"
import {
  NEWS_ORIGIN,
  ROOT,
  googleNewsUrl,
  issueSource,
  loadLeads,
  mergeLeads,
  parseGoogleNews,
  parseNewsBody,
  parseNewsListing,
  searchRecords,
  searchWrittenPages,
  termPattern,
  watchedIssues,
  excerpt,
} from "./lib/issue-watch.mjs"
import { hashBody, linkedUrls, loadSources, mergeSources, saveText } from "./lib/source-hashes.mjs"
import { markIssueItems } from "./lib/issue-marks.mjs"

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const option = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1]
// Today in Haverhill, as every other script here computes it.
const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" })
const NEWS_CACHE = path.join(ROOT, ".cache", "city-news")
const WEB_CACHE = path.join(ROOT, ".cache", "issue-web")

const issues = watchedIssues().filter((i) => !option("issue") || i.slug === option("issue"))
if (!issues.length) {
  console.log(
    option("issue")
      ? `No issue "${option("issue")}" has a watch.json.`
      : "No issue has a watch.json.",
  )
  process.exit(option("issue") ? 1 : 0)
}

/* ---------------------------- marking ---------------------------- */

if (flag("mark")) {
  const status = flag("irrelevant") ? "irrelevant" : flag("new") ? "new" : "incorporated"
  const ids = args.filter((a) => !a.startsWith("--"))
  if (!ids.length) {
    console.log("Usage: npm run issues:mark -- <id>... [--irrelevant | --new | --ignore]")
    process.exit(1)
  }
  const { done, missing } = await markIssueItems(ids, { status, ignore: flag("ignore") })
  for (const d of done) console.log(`  ${d.id}  ${d.slug}  ${d.kind} -> ${d.now}   ${d.label}`)
  for (const id of missing) console.log(`  ${id}  no such lead or source`)
  process.exit(missing.length ? 1 : 0)
}

/* ---------------------------- searching -------------------------- */

const failures = []
const attempt = async (label, fn) => {
  try {
    return await fn()
  } catch (err) {
    failures.push(`${label}: ${err.message}`)
    console.log(`  ! ${label}: ${err.message}`)
    return []
  }
}

const get = (url, headers = {}) =>
  retrying(url, async () => {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, ...headers } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text()
  })

/**
 * The city's releases from the earliest `since` any issue cares about, each
 * with its text. The listing is read a page at a time until it passes that
 * date; a release's body is fetched once and cached by address, since a
 * release is not edited often enough to be worth fetching every run.
 */
async function cityNews(earliest) {
  const posts = []
  for (let page = 1; page <= 40; page++) {
    const html = await get(`${NEWS_ORIGIN}/news/${page > 1 ? `?page=${page}` : ""}`)
    const listed = parseNewsListing(html)
    if (!listed.length) break
    posts.push(...listed)
    if (listed.every((p) => p.date && p.date < earliest)) break
  }
  mkdirSync(NEWS_CACHE, { recursive: true })
  for (const post of posts) {
    if (post.date && post.date < earliest) continue
    const file = path.join(NEWS_CACHE, createHash("sha1").update(post.url).digest("hex") + ".txt")
    if (existsSync(file)) post.body = readFileSync(file, "utf8")
    else {
      post.body = parseNewsBody(await get(post.url))
      writeFileSync(file, post.body)
    }
  }
  return posts
}

/**
 * The open web and Facebook, by way of Claude Code.
 *
 * Web search only -- no file access, no shell -- and a JSON schema for the
 * answer, so what comes back is a list rather than prose. Every address the
 * issue already knows of goes in the prompt, so the search is spent on what
 * is new rather than re-finding what the page cites.
 */
function webSearch({ slug, watch, known, headlines }) {
  const schema = {
    type: "object",
    properties: {
      results: {
        type: "array",
        items: {
          type: "object",
          properties: {
            url: { type: "string" },
            title: { type: "string" },
            publisher: { type: "string" },
            date: { type: ["string", "null"], description: "YYYY-MM-DD, or null if not stated" },
            note: { type: "string", description: "One line: what it adds" },
          },
          required: ["url", "title", "date", "note"],
        },
      },
    },
    required: ["results"],
  }
  const prompt = `You are keeping a local civics web page about Haverhill, Massachusetts current.

The page's subject:
${watch.brief}

Find material published on or after ${watch.since} that bears on this subject and that the page does not yet have. Search the open web with these queries and any others the subject suggests:
${(watch.web ?? []).map((q) => `- ${q}`).join("\n")}
${
  watch.facebook?.length
    ? `\nAlso look for public posts on these Facebook pages (search e.g. site:facebook.com with the page's name):\n${watch.facebook.map((f) => `- ${f}`).join("\n")}\n`
    : ""
}
Run the searches before deciding anything. Prefer primary sources -- government records, agency pages, official statements, recordings -- and named news outlets. Only include something you have actually seen in a search result or fetched page, with its real address; never guess an address.

Then leave out anything published before ${watch.since}, anything outside the subject as described above (which may reach beyond Haverhill where it says so), anything at one of these addresses, which the page already knows:
${known.map((u) => `- ${u}`).join("\n")}
${
  headlines.length
    ? `\nand any news story carrying one of these headlines, already found through Google News:\n${headlines.map((h) => `- ${h}`).join("\n")}\n`
    : ""
}
Return an empty list only if nothing is left after that.`

  return new Promise((resolve, reject) => {
    const claude = spawn(
      "claude",
      [
        "-p",
        "--output-format",
        "json",
        "--json-schema",
        JSON.stringify(schema),
        "--allowedTools",
        "WebSearch,WebFetch",
        "--model",
        watch.model ?? "sonnet",
        prompt,
      ],
      { cwd: ROOT, stdio: ["ignore", "pipe", "inherit"] },
    )
    let out = ""
    claude.stdout.on("data", (d) => (out += d))
    const timer = setTimeout(() => claude.kill(), 15 * 60 * 1000)
    claude.on("error", (err) =>
      reject(new Error(err.code === "ENOENT" ? "Claude Code is not on PATH" : err.message)),
    )
    claude.on("exit", (code) => {
      clearTimeout(timer)
      try {
        // Kept, so a run that comes back empty can be checked rather than
        // taken on trust.
        mkdirSync(WEB_CACHE, { recursive: true })
        writeFileSync(path.join(WEB_CACHE, `${slug}.json`), out)
        const res = JSON.parse(out)
        if (res.is_error || !res.structured_output) throw new Error(res.result || `exited ${code}`)
        resolve(
          res.structured_output.results
            .filter((r) => /^https?:\/\//.test(r.url))
            .map((r) => ({
              ...r,
              source: /facebook\.com/.test(r.url) ? "facebook" : "web",
              excerpt: null,
            })),
        )
      } catch (err) {
        reject(new Error(`no usable answer (${err.message.slice(0, 200)})`))
      }
    })
  })
}

const store = await loadStore()
const earliest = issues.map((i) => i.watch.since).sort()[0]
console.log(`Reading the city's news releases back to ${earliest}…`)
const news = await attempt("city news", () => cityNews(earliest))
console.log(`  ${news.length} release(s) listed`)

for (const { slug, dir, watch } of issues) {
  console.log(`\n${slug} -- since ${watch.since}`)
  const pattern = termPattern(watch.terms)
  const source = issueSource(dir)
  const stored = loadLeads(dir)
  const hits = []
  const tally = (label, found) => {
    console.log(`  ${String(found.length).padStart(4)}  ${label}`)
    hits.push(...found)
  }

  tally("meeting pages", searchWrittenPages(pattern))
  tally("city documents", searchRecords(store?.meetings ?? [], pattern))
  tally(
    "city news releases",
    news
      .filter((p) => pattern.test(`${p.title} ${p.body ?? ""}`))
      .map((p) => ({
        url: p.url,
        title: p.title,
        date: p.date,
        source: "city news",
        excerpt: excerpt(p.body ?? "", pattern) ?? excerpt(p.title, pattern),
      })),
  )
  const fromNews = []
  for (const q of watch.news ?? []) {
    const found = await attempt(`google news "${q}"`, async () =>
      parseGoogleNews(await get(googleNewsUrl(`${q} after:${watch.since}`))),
    )
    fromNews.push(...found)
  }
  // Google searches loosely -- "Haverhill drought" turns up flooding in Palm
  // Beach -- and the feed carries a headline and nothing else to check it
  // against. So a story is kept only where its headline matches the issue's
  // own terms or names the city; what slips through that is a lead a person
  // marks irrelevant, which costs less than a story missed.
  tally(
    "Google News",
    fromNews.filter((h) => pattern.test(h.title) || /\bHaverhill\b/i.test(h.title)),
  )

  if (!flag("no-web") && watch.brief) {
    const known = [
      ...new Set([
        ...Object.values(stored).map((l) => l.url),
        ...hits.map((h) => h.url),
        ...(source.match(/https?:\/\/[^\s"'`)<>]+/g) ?? []),
      ]),
    ].filter((u) => !u.includes("news.google.com"))
    // A Google News lead is a redirect, not the story's address, so the story
    // is named to Claude by its headline instead -- otherwise the same WHAV
    // piece comes back a second time under its real address.
    const headlines = [
      ...new Set(
        [...Object.values(stored), ...hits].filter((l) => l.source === "news").map((l) => l.title),
      ),
    ]
    console.log(`        asking Claude Code to search the web…`)
    tally(
      "web and Facebook",
      await attempt("web search", () => webSearch({ slug, watch, known, headlines })),
    )
  }

  const { leads, added } = mergeLeads(slug, stored, hits, { since: watch.since, source, today })
  await writeDataFile(path.join(dir, "leads.json"), leads)
  const open = Object.values(leads).filter((l) => l.status === "new").length
  const cited = added.filter((id) => leads[id].status === "cited").length
  console.log(
    `  ${added.length} new lead(s)${cited ? `, ${cited} already cited by the page` : ""}; ${open} waiting in ${path.relative(ROOT, dir)}/leads.json`,
  )
}

/* ------------------------ what the guides cite -------------------- */

/**
 * HC Media rate-limits browser user-agents and answers an honest one, where
 * the city's host 502s anything but a browser -- the same split
 * `recordings.mjs` and `haverhill.mjs` each make for their own host.
 */
const HONEST_AGENT = "civics-calendar/1.0 (+https://haverhill.alchemicalartisans.com)"
const agentFor = (url) => (/haverhillcommunitytv\.org/.test(url) ? HONEST_AGENT : USER_AGENT)

/** One address, read and hashed; a failure is an answer, never a throw. */
async function fetchHash(url) {
  let last
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": agentFor(url) },
        redirect: "follow",
        signal: AbortSignal.timeout(45_000),
      })
      if (res.status === 404 || res.status === 410) return { gone: res.status }
      if (!res.ok) return { error: `HTTP ${res.status}` }
      const body = Buffer.from(await res.arrayBuffer())
      const { hash, text } = hashBody(res.headers.get("content-type"), body)
      saveText(hash, text)
      return { hash }
    } catch (err) {
      last = err
    }
  }
  return { error: last?.cause?.code ?? last?.message ?? "failed" }
}

if (!flag("no-sources")) {
  const perIssue = issues.map(({ slug, dir }) => {
    const stored = loadSources(dir)
    const ignored = new Set(
      Object.values(stored)
        .filter((s) => s.status === "ignored")
        .map((s) => s.url),
    )
    return { slug, dir, stored, urls: linkedUrls(issueSource(dir)), ignored }
  })
  // Fetched once each however many guides link it. Six hosts at a time but
  // one request per host: the city's own server timed out pages it serves
  // happily one by one when six arrived together, and the drought guide
  // cites it more than any other.
  const urls = [
    ...new Set(perIssue.flatMap(({ urls, ignored }) => urls.filter((u) => !ignored.has(u)))),
  ]
  const hosts = Object.values(Object.groupBy(urls, (u) => new URL(u).hostname))
  const results = new Map()
  console.log(`\nHashing the ${urls.length} page(s) the guides link…`)
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      for (let host; (host = hosts.shift());)
        for (const url of host) results.set(url, await fetchHash(url))
    }),
  )
  // A connection that timed out or reset under six parallel downloads -- the
  // USGS reports run to tens of megabytes -- is usually fine on its own, so
  // each gets one more try once the rest have finished. A 403 is not retried:
  // that is the site's answer, not the network's.
  for (const [url, r] of results)
    if (r.error && !r.error.startsWith("HTTP")) results.set(url, await fetchHash(url))
  for (const { slug, dir, stored, urls } of perIssue) {
    const sources = mergeSources(slug, stored, urls, results, today)
    await writeDataFile(path.join(dir, "sources.json"), sources)
    const count = (s) => Object.values(sources).filter((e) => e.status === s).length
    console.log(
      `  ${slug}: ${urls.length} linked -- ${count("changed")} changed, ${count("gone")} gone, ` +
        `${count("unreachable")} unreachable, ${count("ignored")} ignored`,
    )
  }
}

if (failures.length) {
  console.log(`\n${failures.length} source(s) failed; the rest were recorded.`)
  process.exit(1)
}
