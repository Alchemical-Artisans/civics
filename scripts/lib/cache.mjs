/**
 * A local copy of the documents the city publishes, for checking them by hand.
 *
 * The scrape can only ever say what a document's *label* claims. When a run
 * flags a record -- the filename says one date, the title another -- the only
 * way to settle it is to open the document and read the date off the first
 * page. This is what puts it where you can open it.
 *
 * The cache used to be a side effect of converting every PDF to HTML. That
 * pipeline was removed when pages became hand-written, and the downloader went
 * with it; the flags stayed, and so did the need to answer them. This is that
 * downloader on its own, which is the part that was worth keeping.
 *
 * Everything here is gitignored and disposable. Delete `.cache/` whenever you
 * want the space back; the next run fetches only what is missing.
 */
import { mkdir, rename, rm, stat, symlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { USER_AGENT, mapLimit, retrying } from "./haverhill.mjs"

/**
 * Files are named by document id, not by the city's filename: two documents can
 * share a filename, and the id is what every other part of this pipeline uses.
 */
export const CACHE_DIR = path.join(import.meta.dirname, "..", "..", ".cache", "documents")

/**
 * A second view of the cache, named the way the city names its files.
 *
 * The canonical copies are named by document id, which is stable and unique but
 * is not what you have in your hand when a run flags something for review --
 * the summary prints the city's filename. So every cached document also gets a
 * symlink here under that filename, and `find .cache -name doc081426.pdf` does
 * what you would expect.
 *
 * Filenames are not unique -- a good many are used by two different documents,
 * which is exactly how some records come to be flagged in the first place. The
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
const DOWNLOAD_TIMEOUT_MS = 300_000

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

/**
 * Fetch every document in `documents` that is not already on disk.
 *
 * Run over whatever set the caller hands it -- everything, or only the records
 * a run flagged. Nothing is skipped for being unreadable: a scan and a
 * word-processor file are exactly the ones you need to open yourself, which is
 * the whole point of having them locally.
 */
export async function cacheAll(
  documents,
  { maxMb = Infinity, concurrency = CONCURRENCY, onProgress } = {},
) {
  await mkdir(CACHE_DIR, { recursive: true })

  const missing = []
  for (const document of documents) {
    if (!document.record.fileUrl) continue
    if (!(await exists(cachedFilePath(document.id, document.record.fileUrl)))) {
      missing.push(document)
    }
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
  return { problems, fetched: missing.length - problems.size }
}

/**
 * Rebuild the by-name index. Cheap enough to redo from scratch each run, which
 * keeps it from accumulating links to documents the city has since dropped.
 */
async function linkByName(documents, problems) {
  await rm(BY_NAME_DIR, { recursive: true, force: true })
  await mkdir(BY_NAME_DIR, { recursive: true })

  const used = new Set()
  // Sorted so the document that keeps the plain name does not depend on the
  // order the listing happened to arrive in.
  for (const document of [...documents].sort((a, b) => a.id.localeCompare(b.id))) {
    if (problems.has(document.id) || !document.record.fileUrl) continue
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
