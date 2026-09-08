#!/usr/bin/env node
/**
 * Download the city's documents so a flagged date can be checked by hand.
 *
 * A run flags a record when its sources disagree -- the title says one date,
 * the PDF's filename another. Neither the scrape nor anyone reading the summary
 * can settle that; only the document can, and only by being opened. So:
 *
 * ```sh
 * npm run cache -- --review      # just the flagged ones, which is the usual case
 * find .cache -name doc081426.pdf
 * ```
 *
 * Then read the date off the first page and record the answer in
 * `src/lib/data/reviews.json`, which is what survives a rebuild. See
 * docs/data-format.md.
 *
 * With no flags it fetches everything the city publishes, which is now a couple
 * of thousand documents and some gigabytes -- worth doing once if you want the
 * whole corpus to hand, but `--review` is what a triage session wants. `--all`
 * says the same thing explicitly. `--max-mb=N` skips anything larger, for the
 * agenda packets that run to hundreds of pages.
 *
 * Everything lands in `.cache/`, which is gitignored and disposable.
 */
import { loadStore } from "./lib/store.mjs"
import { assignIds } from "./lib/documents.mjs"
import { BY_NAME_DIR, cacheAll } from "./lib/cache.mjs"

const args = process.argv.slice(2)
const reviewOnly = args.includes("--review")
const maxMb = Number(args.find((a) => a.startsWith("--max-mb="))?.split("=")[1] ?? Infinity)

const store = await loadStore()
if (!store) {
  console.error("No calendar data. Run `npm run calendar:rebuild` first.")
  process.exit(1)
}

// `assignIds` returns one entry per distinct document, which is the unit the
// cache is keyed on -- two listing rows for one PDF share an id and a file.
const documents = assignIds(store.meetings)
const wanted = reviewOnly ? documents.filter((d) => d.group.some((r) => r.needsReview)) : documents

console.log(
  `${wanted.length} document(s) to consider` +
    (reviewOnly ? " (flagged for review)" : "") +
    (maxMb === Infinity ? "" : `, skipping anything over ${maxMb}MB`),
)

const { problems, fetched } = await cacheAll(wanted, {
  maxMb,
  onProgress: (done, total, document, outcome) => {
    const name = document.record.fileUrl.split("/").pop()
    if (outcome !== "fetched") console.log(`  [${done}/${total}] ${outcome}: ${name}`)
    else if (done % 25 === 0 || done === total) console.log(`  [${done}/${total}]`)
  },
})

console.log(`\n  ${fetched} fetched, ${wanted.length - fetched - problems.size} already cached`)
if (problems.size) {
  const by = {}
  for (const why of problems.values()) by[why] = (by[why] ?? 0) + 1
  console.log(`  ${problems.size} could not be fetched:`, by)
}
console.log(`  indexed by the city's own filenames under ${BY_NAME_DIR}`)

if (reviewOnly && wanted.length) {
  console.log("\n  The flagged records, and the file to open for each:\n")
  for (const document of wanted) {
    for (const record of document.group.filter((r) => r.needsReview)) {
      console.log(`    ${record.date ?? "no date"}  ${record.title}`)
      console.log(
        `      says ${record.filenameDate ?? "nothing"} in ${record.fileUrl.split("/").pop()}`,
      )
    }
  }
}
