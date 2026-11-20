import history from "$lib/data/drought-history.json"
import { diffBlocks, summarize, type Block, type Change } from "$lib/text-diff"

/**
 * The drought guide's recorded versions, and what changed between them.
 *
 * `src/lib/data/drought-history.json` is written by
 * `scripts/snapshot-drought.mjs` (`npm run drought:snapshot`) and nothing else,
 * oldest first. Diffs are not stored: they are cheap, and a stored one could
 * only ever disagree with the two versions it is between.
 *
 * Under `$lib/server` because the file holds every version's whole text -- the
 * page history is read at build time and carries only the version being
 * viewed, the same arrangement the rainfall chart makes with its station files.
 */

interface Version {
  id: string
  date: string
  note?: string
  blocks: Block[]
  timeline: Block[]
}

const versions = history.versions as Version[]

export const VERSION_IDS = versions.map((v) => v.id)

/** A change with where it fell: the heading above it in the newer version. */
export interface Located {
  change: Change
  section: string | null
}

/**
 * Only what differs, each with its section for context. Walking the newer
 * version's own order, a removal is placed under whatever heading was last
 * passed -- where it used to be, as near as the newer text can say.
 */
function located(before: Block[], after: Block[]): Located[] {
  const out: Located[] = []
  let section: string | null = null
  for (const change of diffBlocks(before, after)) {
    if (change.kind !== "removed" && /^h[1-4]$/.test(change.tag)) {
      section = textOf(change)
      if (change.kind === "same") continue
    }
    if (change.kind !== "same") out.push({ change, section })
  }
  return out
}

function textOf(change: Change): string {
  const tokens =
    change.kind === "changed"
      ? change.parts.filter((p) => p.kind !== "removed").flatMap((p) => p.tokens)
      : change.tokens
  return tokens.map((t, i) => (i && t.gap ? " " : "") + t.word).join("")
}

/** Every version, newest first, with how much each moved from the one before. */
export function versionList() {
  return versions
    .map((v, i) => {
      const before = versions[i - 1]
      const article = before ? located(before.blocks, v.blocks) : []
      const timeline = before ? located(before.timeline, v.timeline) : []
      return {
        id: v.id,
        date: v.date,
        note: v.note ?? null,
        first: !before,
        article: summarize(article.map((l) => l.change)),
        timeline: summarize(timeline.map((l) => l.change)),
      }
    })
    .reverse()
}

/** One version: its whole text, and what it changed from the version before. */
export function versionPage(id: string) {
  const i = versions.findIndex((v) => v.id === id)
  if (i === -1) throw new Error(`No drought version ${id}`)
  const v = versions[i]
  const before = versions[i - 1]
  return {
    id: v.id,
    date: v.date,
    note: v.note ?? null,
    previous: before ? { id: before.id, date: before.date } : null,
    next: versions[i + 1] ? { id: versions[i + 1].id, date: versions[i + 1].date } : null,
    latest: i === versions.length - 1,
    article: before ? located(before.blocks, v.blocks) : null,
    timeline: before ? located(before.timeline, v.timeline) : null,
    blocks: v.blocks,
    timelineBlocks: v.timeline,
  }
}

/** When the guide first went up and when it last changed, for the page's own byline. */
export function publication() {
  return { published: versions[0].date, updated: versions.at(-1)!.date, count: versions.length }
}
