/**
 * Where a script's routine detail goes, so the console is left with only the
 * one line saying what a step is doing and whatever wants a person's
 * attention. Full detail -- the counts, the per-record breakdowns, all of it
 * -- lands in its own file under `.cache/logs/`, one per script so a run of
 * `metadata:update` doesn't have one step's log overwrite another's.
 *
 * Gitignored and disposable, the same bargain `needs-attention.txt` and the
 * unrecognised-title files already make: it describes this run, not the data.
 */
import { mkdirSync, writeFileSync, appendFileSync } from "node:fs"
import path from "node:path"

const DIR = path.join(import.meta.dirname, "..", "..", ".cache", "logs")

export function createLog(name) {
  const file = path.join(DIR, `${name}.log`)
  mkdirSync(DIR, { recursive: true })
  writeFileSync(file, `${name} -- ${new Date().toISOString()}\n\n`)
  return { file, write: (line = "") => appendFileSync(file, `${line}\n`) }
}
