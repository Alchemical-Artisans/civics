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
import { openLeads, watchedIssues } from "./issue-watch.mjs"
import { sourcesNeedingAttention, textDiff } from "./source-hashes.mjs"

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
      note: "HC Media filmed a meeting the city has published nothing for, or the day or body in its title is wrong. Check the video, then either add the missing agenda's board to the right date, `settled` this to keep it off the calendar, or -- if the title is right and the city just never documented the sitting -- set `\"orphan\": false` to let the recording stand as the meeting's only document. `needsReview` does not apply; there is no date in question, only whether the sitting exists.",
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

/**
 * Something an issue page's saved search turned up that nobody has yet folded
 * in or ruled out. Not a record of the calendar's at all, but the same kind of
 * thing this report exists for: a run can find it and only a person can
 * answer it, and an issue page that has quietly fallen behind is the failure
 * it guards against. See `issue-watch.mjs`.
 */
const leadLine = (l) =>
  `  [${l.id}]  ${(l.date ?? "????-??-??").padEnd(12)}${l.source}${l.publisher ? ` -- ${l.publisher}` : ""}\n` +
  `${" ".repeat(11)}${l.title}\n` +
  (l.excerpt ? `${" ".repeat(11)}"${l.excerpt}"\n` : "") +
  (l.note ? `${" ".repeat(11)}${l.note}\n` : "") +
  `${" ".repeat(11)}${l.url}\n`

function leadsSection(leads) {
  if (!leads.length) return ""
  const bySlug = Object.groupBy(leads, (l) => l.slug)
  return Object.entries(bySlug)
    .map(
      ([slug, ls]) =>
        `${"=".repeat(74)}\n/issues/${slug} has not caught up with -- ${ls.length}\n` +
        `Found by its saved search (src/routes/issues/${slug}/watch.json). Read each, bring the page\n` +
        `up to date, then: npm run issues:mark -- <id>...   (or --irrelevant)\n${"=".repeat(74)}\n\n` +
        ls.map(leadLine).join("\n"),
    )
    .join("\n\n")
}

/**
 * A page an issue guide cites that is no longer the page it cited. With the
 * sentences that went and came, where both versions' text was kept, so a
 * change in a "most read" box the heuristic let through costs a glance
 * rather than a reread of the source.
 */
function sourceLine(s) {
  const pad = " ".repeat(11)
  let out = `  [${s.id}]  ${s.status}${s.changed ? ` ${s.changed}` : ""}${s.error ? ` (${s.error})` : ""}\n${pad}${s.url}\n`
  if (s.status !== "changed") return out
  const diff = textDiff(s.md5, s.current)
  if (!diff) return out + `${pad}(no earlier text kept to compare -- a file, or a fresh .cache/)\n`
  for (const r of diff.removed) out += `${pad}- ${r.slice(0, 220)}\n`
  for (const a of diff.added) out += `${pad}+ ${a.slice(0, 220)}\n`
  if (diff.more) out += `${pad}  …and ${diff.more} more sentence(s)\n`
  if (!diff.removed.length && !diff.added.length)
    out += `${pad}(same sentences, reordered or re-spaced)\n`
  return out
}

function sourcesSection(sources) {
  if (!sources.length) return ""
  const acted = sources.filter((s) => s.status !== "unreachable")
  const blocked = sources.filter((s) => s.status === "unreachable")
  return (
    (acted.length
      ? `${"=".repeat(74)}\nA page an issue guide cites has changed or gone -- ${acted.length}\n` +
        `Read it, bring the guide into line if it needs it, then accept the new version:\n` +
        `npm run issues:mark -- <id>...   (--ignore to stop watching it)\n${"=".repeat(74)}\n\n` +
        acted.map((s) => `  /issues/${s.slug}\n${sourceLine(s)}`).join("\n")
      : "") +
    (blocked.length
      ? `\n\n${"=".repeat(74)}\nA cited page refused or timed out, so it was not checked -- ${blocked.length}\n` +
        `Usually a site that turns scripts away, and the same every run. Not counted on the\n` +
        `console; --ignore the ones that will never answer.\n${"=".repeat(74)}\n\n` +
        blocked.map((s) => `  /issues/${s.slug}\n${sourceLine(s)}`).join("\n")
      : "")
  )
}

/** Write the full report and return the short block for the console. */
export function report(
  meetings,
  {
    linkStatus = loadLinkStatus(),
    leads = openLeads(),
    sources = sourcesNeedingAttention(watchedIssues()),
  } = {},
) {
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
      (body || "Nothing. Every record has a date its own file agrees with.\n") +
      (leads.length ? `\n\n${leadsSection(leads)}` : "") +
      (sources.length ? `\n\n${sourcesSection(sources)}` : ""),
  )
  return { groups, leads, sources, file: REPORT_FILE, linkStatus }
}

/** Print the block. Deliberately the last thing a run says. */
export function printAttention(meetings) {
  const { groups, leads, sources, file, linkStatus } = report(meetings)
  const moved = sources.filter((s) => s.status !== "unreachable")
  const total = new Set(groups.flatMap((g) => g.records)).size

  console.log(`\n${"─".repeat(74)}`)
  if (leads.length) {
    console.log(`  ISSUE PAGES BEHIND -- ${leads.length} lead(s) not yet incorporated\n`)
    for (const [slug, ls] of Object.entries(Object.groupBy(leads, (l) => l.slug)))
      console.log(`    ${String(ls.length).padStart(5)}  /issues/${slug}`)
    console.log(`\n  Listed in full, with ids, in ${file}`)
    console.log(`  Once one is in the page:  npm run issues:mark -- <id>...  (or --irrelevant)\n`)
  }
  if (moved.length) {
    console.log(`  CITED PAGES CHANGED -- ${moved.length} source(s) an issue guide links\n`)
    for (const [slug, ss] of Object.entries(Object.groupBy(moved, (s) => s.slug)))
      console.log(`    ${String(ss.length).padStart(5)}  /issues/${slug}`)
    console.log(`\n  What changed in each, in ${file}`)
    console.log(`  Once the guide agrees:  npm run issues:mark -- <id>...  (or --ignore)\n`)
  }
  if (!total) {
    if (!leads.length && !moved.length) console.log("  Nothing needs your attention.")
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
