/**
 * Records a version of an issue guide for its page history.
 *
 *   npm run drought:snapshot                       # record the drought guide as it stands today
 *   npm run alpr:snapshot                          # ... or the ALPR guide
 *   npm run drought:snapshot -- --note "..."       # ... with a line of your own about it
 *   npm run drought:snapshot -- --check            # exit 1 if the page has moved on from the last version
 *   npm run drought:snapshot -- --backfill         # rebuild the history from git (first run only)
 *
 * Both are `node scripts/snapshot-issue.mjs <issue>`; `ISSUES` below says
 * where each guide's page, timeline and history are.
 *
 * **Publishing an update is this command.** The history is
 * `src/lib/data/<issue>-history.json`, committed, because the build is offline
 * and a CI checkout has no history to read; and a version is a deliberate act
 * rather than a commit, because most commits to the page are not new
 * information -- they are a link tidied, a heading reworded, a figure
 * re-read -- and a reader scrolling past thirty of those would stop looking.
 * The page's "Published" and "Updated" lines are read off this file, so a
 * change the reader has not been shown a version for is also a change the page
 * does not claim to have updated for.
 *
 * One version a day: a second run on the same day replaces that day's version,
 * keeping its note unless a new one is given, so fixing a typo an hour after
 * publishing does not mint a second entry.
 *
 * A note is the author's own words and is optional. Nothing here writes one;
 * the diff is what says what changed.
 */
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { articleBlocks, printedDate, timelineBlocks } from "./lib/article-text.mjs"

const ROOT = new URL("../", import.meta.url).pathname

/**
 * Each guide with a history. `oldPage`/`oldTimeline` are where the page lived
 * before it moved, read by `--backfill` alone; `firstPublished` is the commit
 * the guide first went public in, which is where a backfill starts.
 */
const ISSUES = {
  drought: {
    page: "src/routes/issues/drought/+page.svelte",
    timeline: "src/routes/issues/drought/timeline.ts",
    // Before the move to /issues/drought, which is as far back as the page was public.
    oldPage: "src/routes/drought/+page.svelte",
    oldTimeline: "src/routes/drought/timeline.ts",
    // "Let /drought be shared, and publish it with today's date".
    firstPublished: "5316c75",
  },
  alpr: {
    page: "src/routes/issues/ALPR/+page.svelte",
    timeline: "src/routes/issues/ALPR/timeline.ts",
    // The page's printed "Published" day, 11 November 2026, is this commit;
    // the draft of the day before was never public.
    firstPublished: "dba6c85",
  },
}

const args = process.argv.slice(2)
const issue = args.find((a) => !a.startsWith("--") && ISSUES[a])
if (!issue) {
  console.error(`Name the guide: one of ${Object.keys(ISSUES).join(", ")}.`)
  process.exit(1)
}
const {
  page: PAGE,
  timeline: TIMELINE,
  oldPage: OLD_PAGE,
  oldTimeline: OLD_TIMELINE,
} = ISSUES[issue]
const FIRST_PUBLISHED = ISSUES[issue].firstPublished
const HISTORY = `${ROOT}src/lib/data/${issue}-history.json`

const flag = (name) => args.includes(`--${name}`)
const option = (name) => {
  const at = args.indexOf(`--${name}`)
  return at === -1 ? null : (args[at + 1] ?? null)
}

/** Today in Haverhill, which is the date a reader there would call it. */
function easternDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
  return parts
}

function load() {
  return existsSync(HISTORY) ? JSON.parse(readFileSync(HISTORY, "utf8")) : { versions: [] }
}

function save(history) {
  writeFileSync(HISTORY, JSON.stringify(history, null, 2) + "\n")
}

const sameContent = (a, b) =>
  JSON.stringify([a.blocks, a.timeline]) === JSON.stringify([b.blocks, b.timeline])

function fromSources(page, timeline) {
  return { blocks: articleBlocks(page), timeline: timelineBlocks(timeline) }
}

const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", stdio: "pipe" })
// A file that was not at that path then is an answer, not an error.
const show = (rev, path) => {
  try {
    return git("show", `${rev}:${path}`)
  } catch {
    return null
  }
}

function backfill() {
  if (load().versions.length && !flag("force")) {
    console.error("The history already has versions; --backfill --force rebuilds it from git.")
    process.exit(1)
  }
  // Oldest first, from the first publication on, a commit a line.
  const lines = git(
    "log",
    "--reverse",
    "--format=%h %ad",
    "--date=format-local:%Y-%m-%d",
    `${FIRST_PUBLISHED}^..HEAD`,
    "--",
    PAGE,
    ...(OLD_PAGE ? [OLD_PAGE] : []),
  )
    .trim()
    .split("\n")
    .map((line) => line.split(" "))
  // The last commit of each day is that day's state.
  const perDay = new Map()
  for (const [rev, date] of lines) perDay.set(date, rev)

  const versions = []
  for (const [date, rev] of perDay) {
    const page = show(rev, PAGE) ?? (OLD_PAGE && show(rev, OLD_PAGE))
    const timeline = show(rev, TIMELINE) ?? (OLD_TIMELINE && show(rev, OLD_TIMELINE)) ?? ""
    if (!page) continue
    const version = { id: date, date, ...fromSources(page, timeline) }
    const last = versions.at(-1)
    if (last && sameContent(last, version)) continue
    // The page's own printed date is the day it was first published, which can
    // differ from the commit that said so.
    if (!last) version.id = version.date = printedDate(page) ?? date
    versions.push(version)
  }
  save({ versions })
  console.log(`Wrote ${versions.length} versions: ${versions.map((v) => v.id).join(", ")}`)
}

function snapshot() {
  const history = load()
  const now = fromSources(
    readFileSync(`${ROOT}${PAGE}`, "utf8"),
    readFileSync(`${ROOT}${TIMELINE}`, "utf8"),
  )
  const latest = history.versions.at(-1)

  if (flag("check")) {
    if (latest && sameContent(latest, now)) {
      console.log(`The page matches its ${latest.id} version.`)
      return
    }
    console.error("The page has changed since its last recorded version.")
    process.exit(1)
  }

  const date = option("date") ?? easternDate()
  const note = option("note")
  if (latest && sameContent(latest, now) && !note) {
    console.log(`Nothing new since the ${latest.id} version.`)
    return
  }
  if (latest && latest.date > date) {
    console.error(`The latest version is dated ${latest.date}, after ${date}.`)
    process.exit(1)
  }

  const version = { id: date, date, ...(note ? { note } : {}), ...now }
  if (latest?.id === date) {
    // Keep the day's note through a correction made later the same day.
    if (!note && latest.note) version.note = latest.note
    history.versions[history.versions.length - 1] = version
    console.log(`Replaced the ${date} version.`)
  } else {
    history.versions.push(version)
    console.log(`Recorded a version for ${date}.`)
  }
  save(history)
}

if (flag("backfill")) backfill()
else snapshot()
