/**
 * What a run found that a person has to settle, and the means of settling it.
 *
 * The scrapers can tell when something is wrong but never what the answer is:
 * a title and a filename that disagree about a date, a link the city has since
 * broken, a lead an issue page has not caught up with. Those need someone to
 * open the document.
 *
 * This used to be a text file under `.cache/` that a person read and then
 * answered by hand-editing `reviews.json`. It had outgrown that -- hundreds of
 * entries in one scroll, each answer a JSON key to paste. So the report is now
 * data: `attentionReport()` gathers it, the dev-only page at `/attention`
 * (`src/routes/attention/`) draws it and answers it through `resolveRecord`
 * and `markIssueItems`, and the console is left with counts and the address of
 * that page. The page cannot exist in a production build -- see its layout --
 * which is what makes it safe to give it buttons that write to the repository.
 */
// Plain JavaScript shared with the command-line scripts, which are not typed;
// the page draws from `src/routes/attention/types.ts` instead.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { loadReviews, reviewKey, saveReviews } from "./reviews.mjs"
import { loadStore, DATA_FILE } from "./store.mjs"
import { writeDataFile } from "./data-file.mjs"
import { openLeads, watchedIssues } from "./issue-watch.mjs"
import { sourcesNeedingAttention, textDiff } from "./source-hashes.mjs"

const CACHE = path.join(import.meta.dirname, "..", "..", ".cache")
export const LINK_STATUS_FILE = path.join(CACHE, "link-status.json")

/** Where the page lives when `npm run dev` is up on Vite's default port. */
export const ATTENTION_URL = "http://localhost:5173/attention"

/** The PDF's own filename, which is how you find the document to check it. */
export const filenameOf = (fileUrl) =>
  fileUrl ? decodeURIComponent(fileUrl.split("/").pop() ?? "") : "(no file)"

/** What `links:check` last found, or null if it has never run. */
export function loadLinkStatus() {
  try {
    return JSON.parse(readFileSync(LINK_STATUS_FILE, "utf8"))
  } catch {
    return null
  }
}

export function saveLinkStatus(status) {
  mkdirSync(CACHE, { recursive: true })
  writeFileSync(LINK_STATUS_FILE, JSON.stringify(status, null, 1) + "\n")
}

/**
 * Group the records needing a person into the reasons they need one.
 *
 * A record can want attention for more than one reason -- a broken link and a
 * contradicted date -- and is listed under each, because they are answered
 * separately and by different means.
 *
 * `answers` names the ways the page offers to settle a group, in the order it
 * draws them; each is a key of `RECORD_ANSWERS`.
 */
export function collect(meetings, linkStatus) {
  const dead = new Set(
    Object.entries(linkStatus?.urls ?? {})
      .filter(([, v]) => v === "dead")
      .map(([k]) => k),
  )

  // `settled: true` in reviews.json means a person has looked and wants no more
  // of it, whatever the reason -- the one marker that silences every group. The
  // date groups additionally honour `needsReview: false`, which is the older and
  // more specific way of saying the same thing about a date.
  const live = (m) => !m.settled
  const unanswered = (m) => live(m) && m.needsReview !== false

  const groups = [
    {
      key: "undated",
      title: "No date could be resolved at all",
      note: "These cannot go on the calendar. Open the document and give the date.",
      answers: ["set-date", "settle"],
      records: meetings.filter((m) => !m.date && unanswered(m)),
    },
    {
      key: "conflict",
      title: "The document's own filename contradicts its date",
      note: "Usually the filename is the day it was scanned, not the day of the meeting -- but not always. Open it and see.",
      answers: ["date-right", "set-date", "settle"],
      records: meetings.filter((m) => m.dateConflict && unanswered(m)),
    },
    {
      key: "ambiguous",
      title: "The date was read from a filename that splits more than one way",
      note: "`106` is 1/06 or 10/6. The first reading was taken; open the document to confirm it.",
      answers: ["date-right", "set-date", "settle"],
      records: meetings.filter(
        (m) => unanswered(m) && !m.dateConflict && m.date && m.dateSource === "filename",
      ),
    },
    {
      key: "dead",
      title: "The city's own link is broken",
      note: "The calendar sends a reader to a 404. Nothing here can fix it; the city has moved or dropped the file. Silence one to keep it listed on the calendar, or drop it from the site.",
      answers: ["settle", "drop"],
      records: dead.size ? meetings.filter((m) => m.fileUrl && dead.has(m.fileUrl) && live(m)) : [],
    },
    {
      key: "orphan-recording",
      title: "A recording matched no sitting on the calendar",
      note: "HC Media filmed a meeting the city has published nothing for, or the day or body in its title is wrong. Check the video. If the title is right and the city just never documented the sitting, promote it to let the recording stand as the meeting's only document; otherwise settle it to keep it off the calendar.",
      answers: ["promote", "settle"],
      records: meetings.filter((m) => m.kind === "recording" && m.orphan && live(m)),
    },
  ]
  return groups.filter((g) => g.records.length)
}

/**
 * The ways to settle a record, each as the entry it adds to `reviews.json`.
 *
 * Every one of them is also applied to the stored `meetings.json`, because the
 * site reads that file and not the reviews: `reviews.json` is what survives a
 * rebuild, `meetings.json` is what the next build publishes, and an answer that
 * reached only the first would change nothing until the next scrape.
 */
export const RECORD_ANSWERS = {
  "date-right": () => ({ needsReview: false }),
  "set-date": ({ date }) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") || Number.isNaN(Date.parse(`${date}T00:00:00Z`)))
      throw new Error(`"${date}" is not a date; expected YYYY-MM-DD`)
    if (new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date)
      throw new Error(`"${date}" is not a real day`)
    return { needsReview: false, date }
  },
  settle: () => ({ settled: true }),
  // `gone` beside `settled` is what takes the document off the site.
  drop: () => ({ settled: true, gone: true }),
  promote: () => ({ orphan: false }),
}

/**
 * Record a person's answer for the record with this review key.
 * Returns the entry now in `reviews.json`.
 */
export async function resolveRecord(key, answer, options = {}) {
  const make = RECORD_ANSWERS[answer]
  if (!make) throw new Error(`no such answer "${answer}"`)
  const patch = make(options)

  const store = await loadStore()
  const target = store?.meetings.filter((m) => reviewKey(m) === key) ?? []
  if (!target.length) throw new Error(`no record has the key ${key}`)

  const reviews = await loadReviews()
  reviews[key] = { ...reviews[key], ...patch }
  await saveReviews(reviews)

  for (const m of target) Object.assign(m, patch)
  // The file is kept newest first, so a date that moved has to move with it;
  // `generatedAt` is left alone, being when the scrape ran and not when a
  // person answered it.
  store.meetings.sort(
    (a, b) => (b.date ?? "").localeCompare(a.date ?? "") || a.title.localeCompare(b.title),
  )
  await writeDataFile(DATA_FILE, store)
  return reviews[key]
}

/** A record as the page needs it, with the key an answer is addressed by. */
const recordView = (m) => ({
  key: reviewKey(m),
  date: m.date ?? null,
  board: m.board ?? "",
  title: m.title,
  kind: m.kind ?? null,
  filename: filenameOf(m.fileUrl),
  filenameDate: m.filenameDate ?? null,
  dateSource: m.dateSource ?? null,
  url: m.fileUrl ?? m.pageUrl ?? null,
  pageUrl: m.pageUrl ?? null,
})

/**
 * Everything awaiting a person, as plain data: what the page draws, and what
 * `printAttention` counts from.
 *
 * Reviews are overlaid on the stored records first, so an answer already in
 * `reviews.json` counts even if the scrape that would copy it across has not
 * run since.
 */
export async function attentionReport({ meetings, reviews, linkStatus = loadLinkStatus() } = {}) {
  meetings ??= (await loadStore())?.meetings ?? []
  reviews ??= await loadReviews()
  const overlaid = meetings.map((m) => ({ ...m, ...reviews[reviewKey(m)] }))

  const groups = collect(overlaid, linkStatus).map((g) => ({
    ...g,
    records: g.records
      .slice()
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
      .map(recordView),
  }))
  const leads = openLeads()
  const sources = sourcesNeedingAttention(watchedIssues()).map((s) => {
    const diff = s.status === "changed" ? textDiff(s.md5, s.current) : null
    return { ...s, diff }
  })
  return { groups, leads, sources, linkStatus }
}

/** Print the block. Deliberately the last thing a run says. */
export async function printAttention(meetings) {
  const { groups, leads, sources, linkStatus } = await attentionReport({ meetings })
  const moved = sources.filter((s) => s.status !== "unreachable")
  const total = new Set(groups.flatMap((g) => g.records.map((r) => r.key))).size

  console.log(`\n${"─".repeat(74)}`)
  if (leads.length) {
    console.log(
      `  NEW INFORMATION MISSING FROM ISSUE PAGES -- ${leads.length} lead(s) not yet incorporated\n`,
    )
    for (const [slug, ls] of Object.entries(Object.groupBy(leads, (l) => l.slug)))
      console.log(`    ${String(ls.length).padStart(5)}  /issues/${slug}`)
    console.log()
  }
  if (moved.length) {
    console.log(`  CITED PAGES CHANGED -- ${moved.length} source(s) an issue guide links\n`)
    for (const [slug, ss] of Object.entries(Object.groupBy(moved, (s) => s.slug)))
      console.log(`    ${String(ss.length).padStart(5)}  /issues/${slug}`)
    console.log()
  }
  if (!total) {
    if (!leads.length && !moved.length) console.log("  Nothing needs your attention.")
  } else {
    console.log(`  NEEDS YOUR ATTENTION -- ${total} record(s)\n`)
    for (const g of groups) console.log(`    ${String(g.records.length).padStart(5)}  ${g.title}`)
    console.log()
  }
  if (total || leads.length || moved.length) {
    console.log(`  Read and settle every one of them, with the document one click away:`)
    console.log(`    npm run dev   then   ${ATTENTION_URL}`)
  }
  if (!linkStatus) {
    console.log(`\n  Broken links are not counted: run \`npm run links:check\` to find them.`)
  } else {
    console.log(`\n  Links last checked ${linkStatus.checkedAt?.slice(0, 10) ?? "?"}.`)
  }
  console.log(`${"─".repeat(74)}`)
}
