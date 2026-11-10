#!/usr/bin/env node
/**
 * Moves the excerpt store between the local `excerpts/` directory and its
 * bucket.
 *
 *   npm run excerpts:upload              publish what is here
 *   npm run excerpts:upload -- --prune   ...and withdraw what is not
 *   npm run excerpts:download            fetch the corpus
 *   npm run excerpts:download -- --prune ...and drop local strays
 *
 * **Neither direction deletes anything unless asked.** The bucket is the only
 * copy of these 622 files -- they are gitignored, and a clone does not carry
 * them -- so whichever side of the sync is empty, a run with deletion on
 * destroys the corpus. Upward that is a checkout without the files emptying
 * the store; downward it is an empty store emptying the checkout, which is
 * exactly the state the bucket is in before its first upload. Deletion is
 * useful in both directions and it is `--prune` in both.
 *
 * `--prune` also refuses to run when the side it would read from holds fewer
 * than a hundred files, which is what tells an incomplete checkout or an
 * unpopulated bucket apart from a genuine withdrawal. The bucket keeps every
 * version for a year (`infra/main.tf`), so even a mistake is recoverable, but
 * a check that costs nothing beats a restore that costs an afternoon.
 *
 * Everything else about the store -- the bucket, its name, the prefix, the
 * cache header -- is `scripts/lib/excerpt-store.mjs`.
 */
import { spawnSync } from "node:child_process"
import { existsSync, readdirSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { BUCKET_URI, CACHE_CONTROL, ORIGIN, PREFIX } from "./lib/excerpt-store.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const local = join(root, PREFIX)

const args = process.argv.slice(2)
const down = args.includes("--download")
const prune = args.includes("--prune")
const dryRun = args.includes("--dry-run")

/**
 * Every file under a directory, counted rather than listed: the only question
 * is whether the directory holds a corpus or is a fresh checkout's empty
 * space, and 622 paths is not worth building to answer it.
 */
const countFiles = (dir) => {
  if (!existsSync(dir)) return 0

  return readdirSync(dir, { withFileTypes: true }).reduce((n, entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return n + countFiles(path)

    return statSync(path).isFile() ? n + 1 : n
  }, 0)
}

/**
 * `gcloud` rather than a client library: this is 483 MB of parallel transfer
 * with resumption, which `gcloud storage rsync` already does well, and adding
 * a dependency to re-implement it would be the only reason the project needed
 * one.
 */
const run = (argv) => {
  // Quoted where a value holds a space, so the line printed is one a person
  // can paste: `--cache-control=public, max-age=86400` is a single argument
  // here, and run through a shell unquoted it would be two.
  const shown = argv.map((a) => (/\s/.test(a) ? `'${a}'` : a)).join(" ")
  console.log(`$ gcloud ${shown}\n`)
  const { status, error } = spawnSync("gcloud", argv, { stdio: "inherit" })

  if (error?.code === "ENOENT") {
    console.error(
      "\ngcloud is not on PATH. The store is in Google Cloud Storage; see infra/README.md.",
    )
    process.exit(1)
  }
  if (status !== 0) process.exit(status ?? 1)
}

/**
 * One object fetched over plain HTTPS once the upload is done.
 *
 * The bucket is public because `infra/main.tf` grants `allUsers` read, and
 * nothing in an upload would fail if that grant were missing -- the files
 * would be there and every link on the site would 403. So the run ends by
 * reading one of them back the way a reader would, as the one check that the
 * store is actually serving.
 */
const checkPubliclyReadable = async () => {
  const [first] = readdirSync(local, { withFileTypes: true }).filter((e) => e.isDirectory())
  if (!first) return

  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        const found = walk(path)
        if (found) return found
      } else if (entry.isFile()) {
        return path
      }
    }
    return null
  }

  const sample = walk(join(local, first.name))
  if (!sample) return

  const url = `${ORIGIN}/${PREFIX}/${sample
    .slice(local.length + 1)
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`

  try {
    const response = await fetch(url, { method: "HEAD" })
    if (response.ok) {
      console.log(`\nServing: ${url}`)
      console.log(`  cache-control: ${response.headers.get("cache-control") ?? "(none)"}`)
    } else {
      console.error(`\nUploaded, but the store is not readable: HTTP ${response.status} on`)
      console.error(`  ${url}`)
      console.error("Check that infra/ has been applied -- the public read grant is in main.tf.")
      process.exit(1)
    }
  } catch (cause) {
    console.error(`\nCould not reach ${url}: ${cause.message}`)
    process.exit(1)
  }
}

const flags = ["--recursive", ...(dryRun ? ["--dry-run"] : [])]

/**
 * How many objects the store holds, so a prune downward can tell an
 * unpopulated bucket from a real withdrawal. Counted with `ls` rather than
 * assumed, because the answer decides whether local files are deleted.
 */
const countObjects = () => {
  const { status, stdout } = spawnSync(
    "gcloud",
    ["storage", "ls", "--recursive", `${BUCKET_URI}/**`],
    { encoding: "utf8" },
  )
  if (status !== 0) return 0

  return stdout.split("\n").filter((line) => line.trim() && !line.trim().endsWith("/")).length
}

if (down) {
  if (prune) {
    const remote = countObjects()

    if (remote < 100) {
      console.error(`Refusing to prune: the store lists only ${remote} objects.`)
      console.error("Deleting local files to match an empty or unreadable bucket would")
      console.error("destroy the only copy. Upload first, or drop --prune.")
      process.exit(1)
    }
  }

  run([
    "storage",
    "rsync",
    BUCKET_URI,
    local,
    ...flags,
    ...(prune ? ["--delete-unmatched-destination-objects"] : []),
  ])
  console.log(`\n${countFiles(local)} files in ${PREFIX}/`)
} else {
  const count = countFiles(local)

  if (count === 0) {
    console.error(`Nothing to upload: ${local} is empty or missing.`)
    console.error("Run `npm run excerpts:download` to fetch the corpus first.")
    process.exit(1)
  }

  if (prune && count < 100) {
    console.error(`Refusing to prune: ${PREFIX}/ holds only ${count} files.`)
    console.error("The store has hundreds, so this checkout is probably incomplete, and")
    console.error("pruning from it would delete the rest. `npm run excerpts:download` first.")
    process.exit(1)
  }

  console.log(`Uploading ${count} files from ${PREFIX}/\n`)
  run([
    "storage",
    "rsync",
    local,
    BUCKET_URI,
    ...flags,
    `--cache-control=${CACHE_CONTROL}`,
    ...(prune ? ["--delete-unmatched-destination-objects"] : []),
  ])

  if (!dryRun) await checkPubliclyReadable()
}
