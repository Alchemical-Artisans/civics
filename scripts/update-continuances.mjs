#!/usr/bin/env node
/**
 * Ask whether any permit on a sitting still to come has been continued, and
 * hand what comes back to Claude Code to write up.
 *
 *   npm run continuances:update                 ask about each, write up what is found
 *   npm run continuances:update -- --list       print the links and stop
 *   npm run continuances:update -- --as-of=2026-09-01   treat that day as today
 *   npm run continuances:update -- --prompt-only  write a prompt per find, launch nothing
 *
 * **This is the one step of a run that cannot be automated at all**, and the
 * reason is in `src/lib/permits.ts`: every read of the portal's data service
 * needs an `x-turnstile-proof` header minted by passing a Cloudflare
 * challenge, so a script cannot see a permit's record and is not going to
 * forge its way in. A person can, in their own browser, as the portal
 * intends. So the run does everything either side of the looking -- works out
 * which permits could have been continued, prints the record link for each,
 * takes down the answer, and launches Claude Code on the document -- and
 * stops in the middle to be told.
 *
 * It is worth that interruption because of what the gap costs a reader. The
 * agenda is published, then the hearing is continued, and the Council does
 * not reissue the agenda; somebody who reads the published agenda and comes
 * to the hearing finds nothing happening, and the portal is the only place
 * that was ever said. A continuance is also the first evidence a permit spans
 * sittings, which is the moment it becomes a project -- see
 * `prompts/record-continuance.md`, and the Marshland entry in
 * `src/lib/projects.ts` for why the transcriber cannot make that call.
 *
 * `scripts/lib/continuances.mjs` is everything here that is a pure function
 * of the pages; this file is the part that touches the filesystem, the
 * terminal and another process.
 */
import { spawn } from "node:child_process"
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import readline from "node:readline/promises"
import {
  permitItems,
  sittingDate,
  soonest,
  toCheck,
  upcoming,
  validate,
} from "./lib/continuances.mjs"

const ROOT = path.join(import.meta.dirname, "..")
const MEETINGS = path.join(ROOT, "src", "routes", "calendar", "meetings")
const PERMITS = path.join(ROOT, "src", "lib", "data", "permits.json")
const CACHE = path.join(ROOT, ".cache", "continuances")
const PROMPT = path.join(import.meta.dirname, "prompts", "record-continuance.md")

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)

/**
 * Today in Haverhill, not in UTC -- `easternDate()` on the site side, copied
 * here for the same reason `transcribe-meeting.mjs` copies it: a script
 * cannot import the TypeScript. `toISOString()` names tomorrow from eight in
 * the evening here, which would drop a sitting on the evening it is held.
 */
const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date())

/**
 * The day to treat as today. `--as-of=2026-10-01` is what makes this run
 * checkable at all: most of the year no permit is on a sitting still to come,
 * so without it the only observable behaviour is "nothing to check" and a
 * broken page scan would look exactly the same. It also answers what the run
 * would have asked on the day an agenda was published.
 */
function asOf() {
  const given = args.find((a) => a.startsWith("--as-of="))?.slice("--as-of=".length)
  if (!given) return today()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(given)) {
    console.error(`--as-of wants YYYY-MM-DD, not ${given}`)
    process.exit(1)
  }
  return given
}

/** Every item page under a meeting, as `{ path, source }` for `permitItems`. */
async function itemPages() {
  const pages = []
  for (const meeting of await readdir(MEETINGS, { withFileTypes: true })) {
    if (!meeting.isDirectory()) continue
    const dir = path.join(MEETINGS, meeting.name)
    for (const item of await readdir(dir, { withFileTypes: true })) {
      if (!item.isDirectory()) continue
      const file = path.join(dir, item.name, "+page.svelte")
      if (!existsSync(file)) continue
      pages.push({
        path: path.relative(ROOT, file),
        source: await readFile(file, "utf8"),
      })
    }
  }
  return pages
}

const readableDate = (date) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

const permits = JSON.parse(await readFile(PERMITS, "utf8"))
const items = soonest(upcoming(permitItems(await itemPages()), asOf()))
const { checkable, unknown } = toCheck(items, permits)

console.log(`${"=".repeat(60)}\n  permits on sittings still to come\n${"=".repeat(60)}`)

if (!checkable.length && !unknown.length) {
  console.log("\n  No permit is on an upcoming sitting; nothing to check.\n")
  process.exit(0)
}

for (const item of checkable) {
  console.log(`\n  ${item.number} — ${readableDate(sittingDate(item.meeting))}`)
  console.log(`  ${item.url}`)
}

/**
 * A permit nobody has copied an id for cannot be checked, and saying nothing
 * would read as "nothing has been continued" when what happened is that
 * nobody could look. The fix is one line of `permits.json`, so the report
 * says exactly that.
 */
if (unknown.length) {
  console.log(`\n  ${unknown.length} permit(s) have no id in src/lib/data/permits.json:`)
  for (const item of unknown) {
    console.log(`    ${item.number} — on ${sittingDate(item.meeting)}, in ${item.item}`)
  }
  console.log("  Open the portal, find the record, and add its number and id to that file.")
}

if (flag("list")) process.exit(0)

/**
 * Nothing to ask if there is no one to ask. `metadata:update` is run by hand
 * and never in CI, but a run whose output is being piped should print its
 * links and finish rather than block on a prompt nobody will see.
 */
if (!process.stdin.isTTY) {
  console.log("\n  Not a terminal; printed the links and stopped. Run it yourself to record one.\n")
  process.exit(0)
}

console.log(
  [
    "",
    "  Open each link and look for a continuance filed since the agenda was published.",
    "  For each, give the new hearing date, or press enter to pass over it.",
    "",
  ].join("\n"),
)

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const found = []

/**
 * One question, where closing the input is an answer too.
 *
 * Ctrl+D (and Ctrl+C) at a prompt rejects `rl.question` with an `AbortError`,
 * which unhandled takes the process down with a stack trace -- and inside
 * `metadata:update` that reads as a step that failed rather than a person who
 * decided they had seen enough. Walking away in the middle is a perfectly
 * ordinary way to use this, so it ends the questions and keeps whatever has
 * already been answered.
 */
const ASKED_TO_STOP = Symbol("stop")
async function ask(question) {
  try {
    return (await rl.question(question)).trim()
  } catch {
    return ASKED_TO_STOP
  }
}

for (const item of checkable) {
  console.log(`\n  ${item.number} — heard ${readableDate(sittingDate(item.meeting))}`)
  console.log(`  ${item.url}`)

  const date = await ask("  Continued to [YYYY-MM-DD, or enter to skip]: ")
  if (date === ASKED_TO_STOP) break
  if (!date) continue

  const file = await ask("  Path to the continuance document [enter for none]: ")
  if (file === ASKED_TO_STOP) break

  // Every judgement about the two answers is `validate`, so it can be tested
  // without a terminal; this loop only reads and reports.
  const checked = validate({ item, date, file, exists: Boolean(file) && existsSync(file) })
  if (!checked.ok) {
    if (checked.reason !== "skipped") console.log(`  ${checked.reason}`)
    continue
  }

  found.push(checked.continuance)
}

rl.close()
console.log("")

if (!found.length) {
  console.log("\n  Nothing recorded.\n")
  process.exit(0)
}

await mkdir(CACHE, { recursive: true })
const durable = (await readFile(PROMPT, "utf8")).trimEnd()
let failed = 0

for (const item of found) {
  /**
   * What the person typed is passed as what they typed, not as fact. Claude
   * is asked to read the document and contradict it where the two disagree,
   * because the failure that matters is one-sided: a reader told a hearing is
   * continued when it is not stays home and misses it, where a reader told it
   * stands when it does not has merely made a trip.
   */
  const material = [
    "",
    "---",
    "",
    "## The continuance to record",
    "",
    `- **Permit:** \`${item.number}\``,
    `- **Portal record:** ${item.url}`,
    `- **Was on:** ${readableDate(sittingDate(item.meeting))} (\`${item.meeting}\`)`,
    `- **Item page:** \`src/routes/calendar/meetings/${item.meeting}/${item.item}/\``,
    `- **Continued to, as entered by hand:** ${readableDate(item.date)} (\`${item.date}\`)`,
    `- **The document:** ${item.file ? `\`${item.file}\`` : "none supplied — record the date alone"}`,
    "",
    item.file
      ? "Read the document first and check it against the date above before you change anything."
      : "No document was supplied, so the date above is unverified: say so in your report, and do not state on any page that the document says anything.",
    "",
  ].join("\n")

  const prompt = `${durable}\n${material}`
  const promptPath = path.join(CACHE, `${item.meeting}-${item.number}.md`)
  await writeFile(promptPath, prompt)

  console.log(`\n${"=".repeat(60)}\n  ${item.number} → ${item.date}\n${"=".repeat(60)}`)
  console.log(`  prompt: ${path.relative(ROOT, promptPath)}`)

  if (flag("prompt-only")) continue

  const code = await new Promise((resolve) => {
    const claude = spawn("claude", [prompt], { stdio: "inherit", cwd: ROOT })
    claude.on("error", (err) => {
      console.error(
        err.code === "ENOENT"
          ? `  Claude Code is not on PATH. The prompt is written; run it yourself:\n    claude "$(cat ${path.relative(ROOT, promptPath)})"`
          : `  ${err.message}`,
      )
      resolve(1)
    })
    claude.on("exit", (status) => resolve(status ?? 0))
  })
  if (code !== 0) failed++
}

console.log(
  failed
    ? `\n  ${failed} of ${found.length} write-ups exited non-zero; review the diff before committing\n`
    : `\n  ${found.length} continuance(s) recorded; review the diff before committing\n`,
)
process.exit(failed ? 1 : 0)
