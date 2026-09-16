#!/usr/bin/env node
/**
 * Re-scrape the city's budget and audit report listing.
 *
 * There is no incremental mode and no `budget:rebuild` to go with it, because
 * the whole listing is one request and twenty-two rows -- the distinction the
 * calendar draws between a cheap refresh and an expensive full rebuild has no
 * meaning here. Every run replaces the file.
 *
 * Nothing here touches the budget section pages. Those are written by hand
 * under src/routes/budget/<year>/; a refresh only re-derives which years the
 * city publishes and where its PDFs are.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { BUDGET_URL, diffYears, fetchBudgetListing } from "./lib/budget.mjs"
import { createLog } from "./lib/log.mjs"

export const DATA_FILE = path.join(import.meta.dirname, "..", "src", "lib", "data", "budget.json")

const before = await readFile(DATA_FILE, "utf8")
  .then((raw) => JSON.parse(raw).years)
  .catch((err) => {
    if (err.code === "ENOENT") return null
    throw err
  })

const log = createLog("budget")
console.log("  reading the budget and audit listing...")

const { years, unclassified } = await fetchBudgetListing()

const payload = {
  generatedAt: new Date().toISOString(),
  source: BUDGET_URL,
  count: years.length,
  years,
}
await mkdir(path.dirname(DATA_FILE), { recursive: true })
await writeFile(DATA_FILE, JSON.stringify(payload, null, 2) + "\n")

const withBudget = years.filter((y) => y.budget).length
const withAudit = years.filter((y) => y.audit).length
log.write(`\n  ${years.length} fiscal years, FY${years.at(-1).year} -> FY${years[0].year}`)
log.write(
  `  ${withBudget} with a budget book, ${withAudit} with an audit report; ` +
    `${years.length - withBudget} and ${years.length - withAudit} listed with no file`,
)

const { added, removed, changed } = diffYears(before, years)
if (!before) {
  log.write("  no previous file; everything is new")
} else if (!added.length && !removed.length && !changed.length) {
  log.write("  unchanged since the last run")
} else {
  if (added.length) log.write(`  added: ${added.map((y) => `FY${y}`).join(", ")}`)
  if (removed.length) log.write(`  no longer listed: ${removed.map((y) => `FY${y}`).join(", ")}`)
  for (const c of changed) {
    // Printed in full rather than counted: a changed URL is either the city
    // reposting a file (fine) or the parser attaching it to the wrong year
    // (not), and the two are only distinguishable by looking.
    log.write(
      `  FY${c.year} ${c.field}: ${c.from ?? "(none)"}\n              -> ${c.to ?? "(none)"}`,
    )
  }
}

if (unclassified.length) {
  console.log(`\n  ${unclassified.length} link(s) on the page are neither budget nor audit:`)
  for (const u of unclassified) console.log(`    FY${u.year}  ${u.text}  ${u.href}`)
  console.log("  If the city has started publishing a third kind of report, teach classifyReport.")
}

log.write(`\n  wrote ${DATA_FILE}`)
console.log(`  full run detail: ${log.file}`)
