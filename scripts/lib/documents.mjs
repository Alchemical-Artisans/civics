/**
 * Build the readable HTML copy of each meeting document.
 *
 * The calendar used to link straight out to the city's PDFs. Now every document
 * gets a page on the site, so the text has to be extracted ahead of time and
 * committed alongside meetings.json -- same reasoning as the scraped data
 * itself: the build stays offline, and a refresh shows up as a reviewable diff.
 *
 * Conversion is incremental by design. Only documents with no HTML on disk are
 * fetched, which keeps a routine `calendar:update` cheap: the check is one stat
 * per document, and the first full run is the only expensive one.
 *
 * Roughly half this corpus is scanned images with no text layer at all -- most
 * of the City Council's output, including agenda packets in the tens of
 * megabytes. Those cannot be converted, so they are recorded as `scanned` and
 * the page falls back to an embedded PDF viewer.
 */
import { execFile } from "node:child_process"
import { createHash } from "node:crypto"
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import { USER_AGENT, mapLimit, retrying } from "./haverhill.mjs"
import { convertXmlToHtml, hasReadableText } from "./pdf-html.mjs"

const execFileAsync = promisify(execFile)

export const DOCUMENTS_DIR = path.join(
  import.meta.dirname,
  "..",
  "..",
  "src",
  "lib",
  "data",
  "documents",
)

/**
 * Every document the city publishes is kept here rather than thrown away.
 *
 * Only the converted HTML is committed; these files are the city's to serve and
 * come to a couple of gigabytes, so the directory is gitignored. Keeping them
 * means changing a heuristic in pdf-html.mjs and re-running with `--recheck` is
 * a local operation instead of re-downloading the whole corpus, and it gives
 * you a local copy of anything the run flags for review. Delete the directory
 * whenever you want the space back.
 *
 * Files are named by document id, not by the city's filename: two documents can
 * share a filename, and the id is what every other part of this pipeline uses.
 */
export const CACHE_DIR = path.join(import.meta.dirname, "..", "..", ".cache", "documents")

/**
 * A second view of the cache, named the way the city names its files.
 *
 * The canonical copies are named by document id, which is stable and unique but
 * is not what you have in your hand when a run flags something for review -- the
 * summary prints the city's filename. So every cached document also gets a
 * symlink here under that filename, and `find .cache -name full-agenda-73026.pdf`
 * does what you would expect.
 *
 * Filenames are not unique: 18 of them are used by two different documents. The
 * first by id keeps the plain name and the rest get ` (2)`, ` (3)` appended, so
 * an exact-name search always finds something.
 */
export const BY_NAME_DIR = path.join(CACHE_DIR, "..", "by-name")

/** Cached copy of a document, keeping whatever extension the city published. */
export function cachedFilePath(id, fileUrl) {
  const ext = (
    decodeURIComponent(fileUrl ?? "").match(/\.[a-z0-9]+$/i)?.[0] ?? ".pdf"
  ).toLowerCase()
  return path.join(CACHE_DIR, `${id}${ext}`)
}

/** Downloads are large, so run fewer at once than the listing scrape does. */
const CONCURRENCY = 4
/**
 * No size limit by default: every document gets fetched, however large. Pass
 * `--max-mb` to opt into a cap. See docs/operations.md.
 */
export const DEFAULT_MAX_MB = Infinity
/**
 * A single transfer may not run longer than this. With no size cap, this rather
 * than a megabyte count is what stops one stalled download hanging a run.
 */
const DOWNLOAD_TIMEOUT_MS = 300_000
/** No single document may hold up a run indefinitely. */
const CONVERT_TIMEOUT_MS = 180_000

/**
 * Statuses that describe the file itself rather than a mishap, so there is
 * nothing to gain from trying again.
 *
 * `failed` is absent because a network blip should be retried. So is
 * `too-large`, which is not a property of the document at all but of the
 * document measured against whatever `--max-mb` this run was given -- re-judging
 * it costs one HEAD request and means raising the cap takes effect immediately.
 */
const TERMINAL = new Set(["scanned", "unsupported"])

export const ALL_STATUSES = ["converted", "scanned", "unsupported", "too-large", "failed"]

/** Fail early and legibly rather than with an ENOENT stack trace mid-run. */
export async function ensurePoppler() {
  try {
    await execFileAsync("pdftohtml", ["-v"])
  } catch {
    console.error(
      "pdftohtml not found. The calendar scripts convert meeting PDFs to HTML\n" +
        "using poppler. Install it and try again:\n\n" +
        "  Debian/Ubuntu  sudo apt install poppler-utils\n" +
        "  macOS          brew install poppler\n",
    )
    process.exit(1)
  }
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

const lastSegment = (url) => (url ?? "").replace(/\/+$/, "").split("/").pop() ?? ""

/**
 * What makes two listing rows the same document.
 *
 * Five PDFs in the listing are published under two media pages each. They are
 * one document and deserve one page, so the file is the identity -- matching how
 * src/routes/calendar/+page.ts de-duplicates before rendering.
 */
export const documentGroupKey = (record) => record.fileUrl ?? record.pageUrl

/**
 * A readable slug with a hash of the file URL appended.
 *
 * The hash is what makes the id permanent. Slugs alone collide -- the city has
 * two different documents under `agenda-and-minutes-5` today -- and resolving a
 * collision by suffixing whichever arrived second would silently change an
 * existing document's URL the day a new one lands. These pages are the kind of
 * thing people cite, so eight ugly characters buy something worth having.
 */
export function documentId(record) {
  const base = slugify(lastSegment(record.pageUrl)) || "document"
  const hash = createHash("sha256").update(documentGroupKey(record)).digest("hex").slice(0, 8)
  return `${base}-${hash}`
}

export const htmlPathFor = (id) => path.join(DOCUMENTS_DIR, `${id}.html`)

/**
 * Give every record a `docId`, sharing one id between rows that are the same
 * document. Returns one entry per distinct document.
 */
export function assignIds(meetings) {
  const groups = new Map()
  for (const record of meetings) {
    if (!record.fileUrl) {
      // Nothing to convert, so no page: the calendar keeps linking this one to
      // the city's media page.
      record.docId = null
      continue
    }
    const key = documentGroupKey(record)
    if (groups.has(key)) groups.get(key).push(record)
    else groups.set(key, [record])
  }

  const documents = []
  for (const group of groups.values()) {
    // Sorted rather than "first unflagged wins" so the id does not depend on
    // the order the listing happened to arrive in.
    const primary = [...group].sort(
      (a, b) =>
        Number(Boolean(a.needsReview)) - Number(Boolean(b.needsReview)) ||
        a.pageUrl.localeCompare(b.pageUrl),
    )[0]
    const id = documentId(primary)
    for (const record of group) record.docId = id
    documents.push({ id, record: primary, group })
  }
  return documents
}

const exists = (file) =>
  stat(file).then(
    () => true,
    () => false,
  )

/** Content-Length without pulling the body, so oversize files cost nothing. */
async function remoteSize(url) {
  try {
    const res = await fetch(url, { method: "HEAD", headers: { "User-Agent": USER_AGENT } })
    const length = Number(res.headers.get("content-length"))
    return Number.isFinite(length) && length > 0 ? length : null
  } catch {
    return null
  }
}

async function download(url, file) {
  const body = await retrying(`download ${url}`, async () => {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return Buffer.from(await res.arrayBuffer())
  })
  // Written under a temporary name and renamed into place, so a run killed
  // mid-download cannot leave a truncated PDF for the next one to trust.
  const partial = `${file}.part`
  await writeFile(partial, body)
  await rename(partial, file)
}

/** How much disk the document cache is using, for the run summary. */
export async function cacheSize() {
  let files = 0
  let bytes = 0
  try {
    for (const name of await readdir(CACHE_DIR)) {
      if (name.endsWith(".part")) continue
      files++
      bytes += (await stat(path.join(CACHE_DIR, name))).size
    }
  } catch {
    // No cache directory yet.
  }
  return { files, bytes }
}

/**
 * Fetch every document that is not already on disk.
 *
 * Deliberately separate from conversion, and run over *all* documents rather
 * than only the ones needing conversion: the cache is meant to be a complete
 * local copy of what the city publishes, including the scans and word-processor
 * files that will never convert to anything. Being able to open the file a run
 * flagged for review is the point.
 *
 * Returns the documents it could not fetch, so conversion can report why.
 */
export async function cacheAll(documents, { maxMb, noCache, concurrency, onProgress } = {}) {
  await mkdir(CACHE_DIR, { recursive: true })

  const missing = []
  for (const document of documents) {
    const file = cachedFilePath(document.id, document.record.fileUrl)
    if (noCache || !(await exists(file))) missing.push(document)
  }

  const problems = new Map()
  let done = 0
  await mapLimit(missing, concurrency, async (document) => {
    const { fileUrl } = document.record
    let outcome = "fetched"
    if (maxMb !== Infinity) {
      // Only worth a HEAD request when there is a cap to measure against.
      const size = await remoteSize(fileUrl)
      if (size !== null && size > maxMb * 1024 * 1024) {
        problems.set(document.id, "too-large")
        outcome = "too-large"
      }
    }
    if (outcome === "fetched") {
      try {
        await download(fileUrl, cachedFilePath(document.id, fileUrl))
      } catch (err) {
        problems.set(document.id, "failed")
        document.error = err.message
        outcome = "failed"
      }
    }
    onProgress?.(++done, missing.length, document, outcome)
  })

  await linkByName(documents, problems)
  return { problems, fetched: missing.length }
}

/**
 * Rebuild the by-name index. Cheap enough to redo from scratch each run, which
 * keeps it from accumulating links to documents the listing has dropped.
 */
async function linkByName(documents, problems) {
  await rm(BY_NAME_DIR, { recursive: true, force: true })
  await mkdir(BY_NAME_DIR, { recursive: true })

  const used = new Set()
  // Sorted so the document that keeps the plain name does not depend on the
  // order the listing happened to arrive in.
  for (const document of [...documents].sort((a, b) => a.id.localeCompare(b.id))) {
    if (problems.has(document.id)) continue
    const target = cachedFilePath(document.id, document.record.fileUrl)
    if (!(await exists(target))) continue

    const original = decodeURIComponent(document.record.fileUrl.split("/").pop() ?? "")
    const ext = original.match(/\.[a-z0-9]+$/i)?.[0] ?? ""
    const stem = ext ? original.slice(0, -ext.length) : original
    let name = original
    for (let n = 2; used.has(name); n++) name = `${stem} (${n})${ext}`
    used.add(name)

    try {
      // Relative, so the cache directory can be moved without breaking.
      await symlink(
        path.join("..", "documents", path.basename(target)),
        path.join(BY_NAME_DIR, name),
      )
    } catch {
      // A filesystem that will not symlink is not worth failing a run over;
      // the canonical copies under documents/ are unaffected.
      return
    }
  }
}

async function convertOne({ id, record }, { scratch }) {
  // The file is already on disk: cacheAll runs before any conversion.
  if (!/\.pdf(\?|$)/i.test(record.fileUrl)) return "unsupported"

  const pdf = cachedFilePath(id, record.fileUrl)
  const xml = path.join(scratch, `${id}.xml`)
  try {
    // `-i` skips images, which is what keeps a 200-page scan cheap to reject;
    // the XML goes to a file rather than stdout so a large document cannot
    // overflow the child process buffer, and into the scratch directory so the
    // cache holds only what the city published.
    await execFileAsync(
      "pdftohtml",
      ["-xml", "-i", "-q", "-enc", "UTF-8", pdf, path.join(scratch, id)],
      {
        timeout: CONVERT_TIMEOUT_MS,
      },
    )
    const html = convertXmlToHtml(await readFile(xml, "utf8"))
    // Either no text layer at all, or one holding nothing but stray glyphs off
    // a scanned drawing. Both are scans, not failures.
    if (!hasReadableText(html)) return "scanned"
    await writeFile(htmlPathFor(id), html)
    return "converted"
  } finally {
    await rm(xml, { force: true })
  }
}

/**
 * Convert every document that does not already have HTML on disk, annotating
 * each record with `docId` and `docStatus`.
 *
 * A document is skipped when its HTML is already on disk, and `known` carries
 * statuses forward from a previous run so that a rebuild does not re-download
 * the scans it already knows it cannot use. `recheck` overrides both and
 * converts everything again, which is what you want after changing a heuristic
 * in pdf-html.mjs.
 *
 * Every document is fetched into CACHE_DIR first, whether or not it needs
 * converting; pass `noCache` to ignore the local copies and download afresh.
 */
export async function convertMissing(
  meetings,
  {
    maxMb = DEFAULT_MAX_MB,
    concurrency = CONCURRENCY,
    known = new Map(),
    noCache = false,
    recheck = false,
    onProgress,
    onDownload,
  } = {},
) {
  await mkdir(DOCUMENTS_DIR, { recursive: true })
  const documents = assignIds(meetings)

  const carried = new Map(known)
  for (const record of meetings) {
    if (record.docId && record.docStatus && !carried.has(record.docId)) {
      carried.set(record.docId, record.docStatus)
    }
  }

  const status = new Map()
  const pending = []
  for (const document of documents) {
    // `recheck` skips both shortcuts: converting everything again is the point
    // of it, and with the PDF cache warm that costs no network at all.
    if (!recheck && (await exists(htmlPathFor(document.id)))) {
      status.set(document.id, "converted")
    } else if (!recheck && TERMINAL.has(carried.get(document.id))) {
      status.set(document.id, carried.get(document.id))
    } else {
      pending.push(document)
    }
  }

  // Fetch first, and fetch everything -- including documents nothing will be
  // done with -- so the cache is a complete local copy of what the city
  // publishes and any flagged document can be opened.
  const { problems, fetched } = await cacheAll(documents, {
    maxMb,
    noCache,
    concurrency,
    onProgress: onDownload,
  })

  const errors = new Map()
  for (const document of documents) {
    if (document.error) errors.set(document.id, document.error)
  }

  let done = 0
  const scratch = await mkdtemp(path.join(tmpdir(), "civics-pdf-"))
  try {
    await mapLimit(pending, concurrency, async (document) => {
      // A document that could not be fetched cannot be converted; report why.
      let result = problems.get(document.id)
      if (!result) {
        try {
          result = await convertOne(document, { scratch })
        } catch (err) {
          result = "failed"
          errors.set(document.id, err.message)
        }
      }
      status.set(document.id, result)
      onProgress?.(++done, pending.length, document, result)
    })
  } finally {
    await rm(scratch, { recursive: true, force: true })
  }

  for (const record of meetings) {
    record.docStatus = record.docId ? (status.get(record.docId) ?? null) : null
    // Cleared rather than left behind, so a document that failed once and then
    // converted does not keep a stale explanation attached to it.
    const error = record.docId ? errors.get(record.docId) : undefined
    if (error) record.docError = error
    else delete record.docError
  }
  return {
    converted: pending.length,
    documents: documents.length,
    fetched,
    status,
    cache: await cacheSize(),
  }
}

/** Count documents by status, for the run summary. */
export function summarizeDocuments(meetings) {
  const seen = new Map()
  for (const record of meetings) {
    if (record.docId && !seen.has(record.docId)) seen.set(record.docId, record.docStatus)
  }
  const counts = {}
  for (const value of seen.values()) counts[value ?? "none"] = (counts[value ?? "none"] ?? 0) + 1
  return counts
}
