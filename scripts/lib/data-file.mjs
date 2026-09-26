/**
 * Write one of the committed data files, formatted the way the rest of the
 * repository is.
 *
 * `JSON.stringify(value, null, 2)` and Prettier disagree about exactly one
 * thing: a short array of scalars, which Prettier puts on one line where it
 * fits inside the hundred columns and `stringify` always breaks. Nothing in
 * `meetings.json` had ever tripped it, so every scrape wrote a file that passed
 * `npm run lint` by luck rather than by rule -- until the schedule scrape
 * started recording the dates a board has called off, and three short dates of
 * `cancelled` failed the repository's own lint the moment they were scraped.
 *
 * The fix belongs here rather than in that one file: a data file is committed
 * and read in diffs like any other source, and the rule for how it is written
 * should not depend on whether a particular run happened to produce an array
 * short enough to notice. So the writers hand their value here and this formats
 * it with the project's own Prettier config -- the same config `npm run lint`
 * checks it against, read from disk rather than restated, so the two cannot
 * drift apart.
 *
 * Only the committed files under `src/lib/data/` go through this. The caches
 * under `.cache/` are gitignored, nobody reads them in a diff, and formatting
 * a six-hundred-entry notice cache would cost a second for nothing.
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { format, resolveConfig } from "prettier"

export async function writeDataFile(file, value) {
  const config = await resolveConfig(file)
  const json = await format(JSON.stringify(value, null, 2), { ...config, filepath: file })
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, json)
  return value
}
