#!/usr/bin/env node
/**
 * Check that every document the calendar links still exists.
 *
 * The scrapers only ever read what a link *says*. Whether it resolves is a
 * different question, and one the site cannot answer for the reader: a calendar
 * entry pointing at a 404 looks exactly like one pointing at an agenda until
 * somebody clicks it.
 *
 * A HEAD request each, cached in `.cache/link-status.json` so a second run is
 * nearly free and only new documents are fetched. `--recheck` ignores the cache,
 * which is what to run when the city has reorganised something.
 *
 * Nothing here edits `meetings.json`. A broken link is a fact about the city's
 * site today, not about the record, so it lives in the cache and is reported by
 * the run summary rather than stored.
 */
import { loadStore } from "./lib/store.mjs"
import { mapLimit, USER_AGENT } from "./lib/haverhill.mjs"
import { loadLinkStatus, printAttention, saveLinkStatus } from "./lib/attention.mjs"

const recheck = process.argv.includes("--recheck")
const CONCURRENCY = 10
const TIMEOUT_MS = 20_000

const store = await loadStore()
if (!store) {
  console.error("No calendar data. Run `npm run calendar:rebuild` first.")
  process.exit(1)
}

const previous = (!recheck && loadLinkStatus()?.urls) || {}
const urls = [...new Set(store.meetings.map((m) => m.fileUrl).filter(Boolean))]
const todo = urls.filter((u) => !(u in previous))

console.log(
  `${urls.length} distinct files; ${todo.length} to check, ${urls.length - todo.length} already known`,
)

const status = { ...previous }
let done = 0
await mapLimit(todo, CONCURRENCY, async (url) => {
  let ok
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    ok = res.ok
  } catch {
    ok = false
  }
  status[url] = ok ? "ok" : "dead"
  if (++done % 200 === 0 || done === todo.length) console.log(`  ${done}/${todo.length}`)
})

// Anything no longer linked stops being interesting.
for (const url of Object.keys(status)) if (!urls.includes(url)) delete status[url]

saveLinkStatus({ checkedAt: new Date().toISOString(), urls: status })

const dead = Object.entries(status).filter(([, v]) => v === "dead")
console.log(`\n  ${urls.length - dead.length} live, ${dead.length} dead`)
if (dead.length) {
  // Grouped by host, because a whole retired domain is one problem and not
  // fifty-nine: haverhill's old cityofhaverhill.com is exactly that case.
  const byHost = {}
  for (const [u] of dead) {
    const host = new URL(u).host
    byHost[host] = (byHost[host] ?? 0) + 1
  }
  for (const [host, n] of Object.entries(byHost).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(n).padStart(4)}  ${host}`)
  }
}

printAttention(store.meetings)
