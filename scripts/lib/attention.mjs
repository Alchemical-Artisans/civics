/**
 * What a run found that a person has to settle, and where to find it.
 *
 * The scrapers can tell when something is wrong but never what the answer is:
 * a title and a filename that disagree about a date, a link the city has since
 * broken. Those need someone to open the document, and the run's job is to make
 * that easy rather than to print fifteen of them and say "and 62 more".
 *
 * So the console gets counts and a path, and the full list -- every record, with
 * the file to open for each -- is written out where it can be read, searched and
 * kept open beside the work. It lands in `.cache/`, which is gitignored and
 * disposable, because it describes this run rather than the data.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { reviewKey } from "./reviews.mjs"

const CACHE = path.join(import.meta.dirname, "..", "..", ".cache")
export const REPORT_FILE = path.join(CACHE, "needs-attention.txt")
export const LINK_STATUS_FILE = path.join(CACHE, "link-status.json")

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
      note: "These cannot go on the calendar. Open the document and put the date in reviews.json.",
      records: meetings.filter((m) => !m.date && unanswered(m)),
    },
    {
      key: "conflict",
      title: "The document's own filename contradicts its date",
      note: "Usually the filename is the day it was scanned, not the day of the meeting -- but not always. Open it and see.",
      records: meetings.filter((m) => m.dateConflict && unanswered(m)),
    },
    {
      key: "ambiguous",
      title: "The date was read from a filename that splits more than one way",
      note: "`106` is 1/06 or 10/6. The first reading was taken; open the document to confirm it.",
      records: meetings.filter(
        (m) => unanswered(m) && !m.dateConflict && m.date && m.dateSource === "filename",
      ),
    },
    {
      key: "dead",
      title: "The city's own link is broken",
      note: "The calendar sends a reader to a 404. Nothing here can fix it; the city has moved or dropped the file. `needsReview` does not apply -- the date is fine -- so silence one with `settled`.",
      records: dead.size ? meetings.filter((m) => m.fileUrl && dead.has(m.fileUrl) && live(m)) : [],
    },
    {
      key: "orphan-recording",
      title: "A recording matched no sitting on the calendar",
      note: "HC Media filmed a meeting the city has published nothing for, or the day or body in its title is wrong. Check the video, then either add the missing agenda's board to the right date -- or `settled` this to keep it off the calendar. `needsReview` does not apply; there is no date in question, only whether the sitting exists.",
      records: meetings.filter((m) => m.kind === "recording" && m.orphan && live(m)),
    },
  ]
  return groups.filter((g) => g.records.length)
}

/**
 * Printed at the head of the report, because someone reading it should not have
 * to go and find out how to answer what it says.
 */
const HOW_TO = `${"-".repeat(74)}
HOW TO ANSWER ONE OF THESE

  npm run cache -- --review        download these documents to .cache/
  find .cache -name <filename>     open the one you want to check

Then record what you decided in src/lib/data/reviews.json, keyed by the "key:"
line under each record below. It survives a full rebuild; editing meetings.json
does not.

  "<key>": { "needsReview": false, "date": "2026-08-19" }
      the date was wrong, and this is the right one

  "<key>": { "needsReview": false }
      the date was already right; stop asking about it

  "<key>": { "settled": true }
      nothing more to do with this record, whatever the reason. This is the
      only one that silences a broken link, where the date is not in question.

Nothing here is ever removed automatically: a decision has to outlive the
scrape that prompted it.
${"-".repeat(74)}
`

const line = (m) =>
  `  ${(m.date ?? "????-??-??").padEnd(12)}${(m.board ?? "").padEnd(28)}${m.title}\n` +
  `${" ".repeat(16)}file: ${filenameOf(m.fileUrl)}` +
  (m.filenameDate ? `  (which says ${m.filenameDate})` : "") +
  `\n${" ".repeat(16)}${m.fileUrl ?? m.pageUrl ?? ""}\n` +
  // The reviews.json key, ready to paste. It is the media page's slug and the
  // PDF's filename, and working it out by hand for each record is exactly the
  // friction that stops anyone answering these.
  `${" ".repeat(16)}key:  ${reviewKey(m)}\n`

/** Write the full report and return the short block for the console. */
export function report(meetings, { linkStatus = loadLinkStatus() } = {}) {
  const groups = collect(meetings, linkStatus)

  const body = groups
    .map(
      (g) =>
        `${"=".repeat(74)}\n${g.title} -- ${g.records.length}\n${g.note}\n${"=".repeat(74)}\n\n` +
        g.records
          .slice()
          .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
          .map(line)
          .join("\n"),
    )
    .join("\n\n")

  mkdirSync(CACHE, { recursive: true })
  writeFileSync(
    REPORT_FILE,
    `Needs attention, as of ${new Date().toISOString()}\n\n${HOW_TO}\n` +
      (body || "Nothing. Every record has a date its own file agrees with.\n"),
  )
  return { groups, file: REPORT_FILE, linkStatus }
}

/** Print the block. Deliberately the last thing a run says. */
export function printAttention(meetings) {
  const { groups, file, linkStatus } = report(meetings)
  const total = new Set(groups.flatMap((g) => g.records)).size

  console.log(`\n${"─".repeat(74)}`)
  if (!total) {
    console.log("  Nothing needs your attention.")
  } else {
    console.log(`  NEEDS YOUR ATTENTION -- ${total} record(s)\n`)
    for (const g of groups) console.log(`    ${String(g.records.length).padStart(5)}  ${g.title}`)
    console.log(`\n  Every one of them, with the file to open:`)
    console.log(`    ${file}`)
    console.log(`\n  To fetch those documents:   npm run cache -- --review`)
    console.log(`  To record what you decide:  src/lib/data/reviews.json`)
  }
  if (!linkStatus) {
    console.log(`\n  Broken links are not counted: run \`npm run links:check\` to find them.`)
  } else {
    console.log(`\n  Links last checked ${linkStatus.checkedAt?.slice(0, 10) ?? "?"}.`)
  }
  console.log(`${"─".repeat(74)}`)
}
