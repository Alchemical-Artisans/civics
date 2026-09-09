#!/usr/bin/env node
/**
 * Hand a sitting to Claude Code with everything it needs to write the page.
 *
 * Transcribing a meeting is the one job here that cannot be scripted: most of
 * what the city publishes is scanned paper, so the document has to be read by
 * eye and turned into markup by hand. What *can* be scripted is everything
 * around that -- working out the meeting id, fetching the PDF, deciding whether
 * it has a text layer, rendering the pages when it does not, and stating the
 * rules that the last transcription had to be corrected against.
 *
 * ```sh
 * npm run transcribe -- planning-board-2026-09-09   # a meeting id
 * npm run transcribe -- 2026-09-09                  # everything that sat that day
 * npm run transcribe -- planning-board              # a board, most recent last
 * npm run transcribe -- --today
 * npm run transcribe -- --today --prompt-only       # print it, launch nothing
 * ```
 *
 * The prompt is `scripts/prompts/transcribe-meeting.md`, which is prose worth
 * editing when a transcription needs correcting; the per-run details are
 * appended by `lib/transcribe.mjs`. Everything downloaded or rendered lands in
 * `.cache/`, which is gitignored and disposable.
 */
import { execFile, spawn } from "node:child_process"
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { promisify } from "node:util"
import { loadStore } from "./lib/store.mjs"
import { MEETINGS_DIR, assignIds } from "./lib/documents.mjs"
import { cacheAll, cachedFilePath } from "./lib/cache.mjs"
import { hasTextLayer, material, readableDate, select, sittings } from "./lib/transcribe.mjs"

const run = promisify(execFile)
const ROOT = path.join(import.meta.dirname, "..")
const CACHE = path.join(ROOT, ".cache", "transcribe")
const PROMPT = path.join(import.meta.dirname, "prompts", "transcribe-meeting.md")

/**
 * Rendering is what makes a scan readable, and a City Council packet runs to
 * hundreds of pages at about half a megabyte each. Only the outline is ever
 * transcribed, and the outline is at the front, so render the front and say so.
 */
const MAX_PAGES_RENDERED = 40
const RENDER_DPI = 200

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const targets = args.filter((a) => !a.startsWith("--"))

if (flag("help") || (!targets.length && !flag("today"))) {
  console.log(
    [
      "Usage: npm run transcribe -- <meeting id | date | board> [options]",
      "       npm run transcribe -- --today",
      "",
      "  --today          the sittings dated today in Haverhill",
      "  --prompt-only    write the prompt and print its path; launch nothing",
      "  --print          run Claude Code headless (claude -p) instead of interactively",
      "  --accept-edits   let Claude Code write files without asking each time",
      "",
      "A date or a board name can match several sittings; you will be shown them.",
    ].join("\n"),
  )
  process.exit(flag("help") ? 0 : 1)
}

/**
 * Today in Haverhill, not in UTC. `toISOString()` names tomorrow from eight in
 * the evening here, which is the whole reason `easternDate()` exists on the site
 * side; this is that function, for a script that cannot import it.
 */
const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date())

const store = await loadStore()
if (!store) {
  console.error("No calendar data. Run `npm run calendar:rebuild` first.")
  process.exit(1)
}

const all = sittings(assignIds(store.meetings))
const target = flag("today") ? today() : targets[0]
const matches = select(all, target)

if (!matches.length) {
  console.error(`Nothing matches ${target}.`)
  if (flag("today")) console.error("No document is filed for a sitting today.")
  else console.error("Try a date (2026-09-09), a meeting id, or part of a board's name.")
  process.exit(1)
}
if (matches.length > 1) {
  console.error(`${matches.length} sittings match ${target}. Name one:\n`)
  for (const sitting of matches) {
    console.error(`  ${sitting.id}`)
    console.error(`    ${sitting.board}, ${readableDate(sitting.date)}`)
    for (const document of sitting.documents) console.error(`    - ${document.record.title}`)
  }
  process.exit(1)
}

const sitting = matches[0]
const written = existsSync(path.join(MEETINGS_DIR, sitting.id))
console.log(`${sitting.board}, ${readableDate(sitting.date)}`)
console.log(`  ${sitting.id}${written ? "  (a page is already written)" : ""}`)

// Only what is missing is fetched, so a second run on the same sitting costs
// nothing.
const { problems } = await cacheAll(sitting.documents, {
  onProgress: (done, total, document, outcome) =>
    console.log(`  [${done}/${total}] ${outcome}: ${document.record.title}`),
})

/**
 * Put one document where it can be read: its text if it has any, its pages as
 * images if it does not.
 *
 * Both are written under `.cache/transcribe/<document id>/` rather than beside
 * the PDF, so deleting that directory re-does the reading material without
 * throwing away a download.
 */
async function prepareDocument(document) {
  const { record } = document
  const base = {
    title: record.title,
    kind: record.kind,
    fileUrl: record.fileUrl,
  }
  if (problems.has(document.id)) {
    return { ...base, cached: null, problem: problems.get(document.id) }
  }

  const pdf = cachedFilePath(document.id, record.fileUrl)
  const relative = (file) => path.relative(ROOT, file)
  const out = path.join(CACHE, document.id)
  await rm(out, { recursive: true, force: true })
  await mkdir(out, { recursive: true })

  let pages = 0
  try {
    const { stdout } = await run("pdfinfo", [pdf])
    pages = Number(stdout.match(/^Pages:\s+(\d+)$/m)?.[1] ?? 0)
  } catch {
    // Not a PDF, or poppler is not installed. Either way the file is cached and
    // Claude can be told where it is; the checks below just find nothing.
  }

  let text
  const textPath = path.join(out, "text.txt")
  try {
    await run("pdftotext", ["-layout", pdf, textPath])
    text = await readFile(textPath, "utf8")
  } catch {
    // Something poppler will not read -- a Word document, or a PDF it chokes
    // on. Treated as a scan, which is what it gets rendered as below.
    text = ""
  }

  if (hasTextLayer(text, pages)) {
    return { ...base, cached: relative(pdf), pages, textPath: relative(textPath) }
  }

  // A scan. Render the front of it and let Claude read the pages.
  await rm(textPath, { force: true })
  const last = pages ? Math.min(pages, MAX_PAGES_RENDERED) : MAX_PAGES_RENDERED
  try {
    await run("pdftoppm", [
      "-r",
      String(RENDER_DPI),
      "-png",
      "-f",
      "1",
      "-l",
      String(last),
      pdf,
      path.join(out, "page"),
    ])
  } catch (err) {
    return { ...base, cached: relative(pdf), pages, problem: `could not render: ${err.message}` }
  }
  const rendered = (await readdir(out)).filter((f) => f.endsWith(".png")).length
  return {
    ...base,
    cached: relative(pdf),
    pages,
    imageDir: relative(out),
    imagesRendered: rendered,
    imagesTruncated: pages > rendered,
  }
}

const prepared = []
for (const document of sitting.documents) prepared.push(await prepareDocument(document))

const prompt =
  (await readFile(PROMPT, "utf8")).trimEnd() + "\n" + material(sitting, prepared, { written })
const promptPath = path.join(CACHE, `${sitting.id}.md`)
await mkdir(CACHE, { recursive: true })
await writeFile(promptPath, prompt)

for (const document of prepared) {
  if (document.imageDir) console.log(`  ${document.imagesRendered} page image(s) rendered`)
  else if (document.textPath) console.log("  text layer extracted")
  else console.log(`  ${document.problem}`)
}
console.log(`  prompt: ${path.relative(ROOT, promptPath)}`)

if (flag("prompt-only")) process.exit(0)

const claudeArgs = []
if (flag("print")) claudeArgs.push("--print")
if (flag("accept-edits")) claudeArgs.push("--permission-mode", "acceptEdits")
claudeArgs.push(prompt)

console.log("\nHanding it to Claude Code.\n")
const claude = spawn("claude", claudeArgs, { stdio: "inherit", cwd: ROOT })
claude.on("error", (err) => {
  console.error(
    err.code === "ENOENT"
      ? `Claude Code is not on PATH. The prompt is written; run it yourself:\n  claude "$(cat ${path.relative(ROOT, promptPath)})"`
      : err.message,
  )
  process.exit(1)
})
claude.on("exit", (code) => process.exit(code ?? 0))
