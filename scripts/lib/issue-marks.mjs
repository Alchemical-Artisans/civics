/**
 * Answer a lead or a changed source on an issue page.
 *
 * `npm run issues:mark` and the dev-only attention page both land here, so the
 * two cannot disagree about what "incorporated" or "ignore" does to the files.
 * A lead and a source are told apart by their id, which is unique across
 * issues, so a caller names only the id.
 */
import path from "node:path"
import { writeDataFile } from "./data-file.mjs"
import { loadLeads, sortLeads, watchedIssues } from "./issue-watch.mjs"
import { acceptSource, loadSources } from "./source-hashes.mjs"

/**
 * @param {string[]} ids
 * @param {{ status?: "new" | "incorporated" | "irrelevant", ignore?: boolean }} [how]
 *   `status` is what a lead becomes; `ignore` stops watching a source rather
 *   than accepting its new version.
 * @returns {Promise<{ done: { id: string, slug: string, kind: "lead" | "source", now: string, label: string }[], missing: string[] }>}
 */
export async function markIssueItems(ids, { status = "incorporated", ignore = false } = {}) {
  const missing = new Set(ids)
  /** @type {{ id: string, slug: string, kind: "lead" | "source", now: string, label: string }[]} */
  const done = []
  for (const { slug, dir } of watchedIssues()) {
    const leads = loadLeads(dir)
    const sources = loadSources(dir)
    let leadsChanged = false
    let sourcesChanged = false
    for (const id of ids) {
      if (leads[id]) {
        leads[id].status = status
        missing.delete(id)
        leadsChanged = true
        done.push({ id, slug, kind: "lead", now: status, label: leads[id].title })
      }
      // A source id: the page has been checked against what the address says
      // now, so what it says now is the version the page rests on.
      if (sources[id]) {
        sources[id] = acceptSource(sources[id], { ignore })
        missing.delete(id)
        sourcesChanged = true
        done.push({ id, slug, kind: "source", now: sources[id].status, label: sources[id].url })
      }
    }
    if (leadsChanged) await writeDataFile(path.join(dir, "leads.json"), sortLeads(leads))
    if (sourcesChanged) await writeDataFile(path.join(dir, "sources.json"), sources)
  }
  return { done, missing: [...missing] }
}
