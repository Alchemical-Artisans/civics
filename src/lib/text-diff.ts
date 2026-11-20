/**
 * What changed between two revisions of an article, block by block and then
 * word by word.
 *
 * A block is a heading, paragraph, list item or table row, its links written
 * inline as `[label](address)` (see `scripts/lib/article-text.mjs`, which
 * produces them). **A link's address is part of its word**: a token is equal
 * to another only if both text and address are, so an edit that swaps a source
 * for a better one reads as the old words struck and the new ones added,
 * instead of vanishing because the label did not move.
 *
 * Written here rather than bought: the input is a few dozen paragraphs, the
 * algorithms are two small dynamic programs, and the one thing a general diff
 * library would not do is treat a link as a unit.
 */

export interface Block {
  tag: string
  text: string
}

/** One word, and the address it links to where it is inside a link. */
export interface Token {
  word: string
  href?: string
  /** Whether space came before it, so spacing survives being cut into runs. */
  gap: boolean
}

export type Kind = "same" | "added" | "removed"

/** A stretch of tokens that all share one fate. */
export interface Part {
  kind: Kind
  tokens: Token[]
}

export type Change =
  | { kind: "same"; tag: string; tokens: Token[] }
  | { kind: "added"; tag: string; tokens: Token[] }
  | { kind: "removed"; tag: string; tokens: Token[] }
  | { kind: "changed"; tag: string; parts: Part[] }

const LINK = /\[([^\]]*)\]\(([^)\s]*)\)/g

export function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  // Whether space is owed before the next word: a chunk's own edge spaces
  // decide it, so a link butts against a comma that follows it.
  let gap = false
  const push = (chunk: string, href?: string) => {
    const words = chunk.split(/\s+/).filter(Boolean)
    if (!words.length) {
      gap ||= /\s/.test(chunk)
      return
    }
    gap ||= /^\s/.test(chunk)
    words.forEach((word, i) => {
      const spaced = i > 0 || gap
      tokens.push(href === undefined ? { word, gap: spaced } : { word, href, gap: spaced })
    })
    gap = /\s$/.test(chunk)
  }
  let last = 0
  for (const m of text.matchAll(LINK)) {
    push(text.slice(last, m.index))
    push(m[1], m[2])
    last = m.index + m[0].length
  }
  push(text.slice(last))
  return tokens
}

const same = (a: Token, b: Token) => a.word === b.word && a.href === b.href

/** Longest common subsequence of two lists, as index pairs. */
function lcs<T>(a: T[], b: T[], equal: (x: T, y: T) => boolean): [number, number][] {
  const n = a.length
  const m = b.length
  const table = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] = equal(a[i], b[j])
        ? table[i + 1][j + 1] + 1
        : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }
  const pairs: [number, number][] = []
  for (let i = 0, j = 0; i < n && j < m;) {
    if (equal(a[i], b[j])) {
      pairs.push([i, j])
      i++
      j++
    } else if (table[i + 1][j] >= table[i][j + 1]) i++
    else j++
  }
  return pairs
}

/** The words of two versions of one block, marked by what happened to each. */
export function diffTokens(before: Token[], after: Token[]): Part[] {
  const parts: Part[] = []
  const add = (kind: Kind, token: Token) => {
    const tail = parts.at(-1)
    if (tail?.kind === kind) tail.tokens.push(token)
    else parts.push({ kind, tokens: [token] })
  }
  let i = 0
  let j = 0
  for (const [x, y] of lcs(before, after, same)) {
    while (i < x) add("removed", before[i++])
    while (j < y) add("added", after[j++])
    add("same", after[j])
    i++
    j++
  }
  while (i < before.length) add("removed", before[i++])
  while (j < after.length) add("added", after[j++])
  return parts
}

/** How alike two blocks are, 0 to 1: shared words over all distinct words. */
function similarity(a: Token[], b: Token[]): number {
  const key = (t: Token) => `${t.word}\u0000${t.href ?? ""}`
  const left = new Set(a.map(key))
  const right = new Set(b.map(key))
  let shared = 0
  for (const k of left) if (right.has(k)) shared++
  const union = left.size + right.size - shared
  return union === 0 ? 1 : shared / union
}

/** Below this, two blocks are different paragraphs rather than one edited. */
const SAME_BLOCK = 0.4

/**
 * Pair the blocks of a gap -- ones the outline matching left over on each side
 * -- so that an edited paragraph is shown as one edited paragraph. Order is
 * kept: a pairing never crosses another, so the result reads in page order.
 */
function align(removed: Block[], added: Block[]): Change[] {
  const a = removed.map((b) => tokenize(b.text))
  const b = added.map((x) => tokenize(x.text))
  const n = a.length
  const m = b.length
  const score = a.map((x, i) =>
    b.map((y, j) => (removed[i].tag === added[j].tag ? similarity(x, y) : 0)),
  )
  const best = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      const pair = score[i][j] >= SAME_BLOCK ? score[i][j] + best[i + 1][j + 1] : -1
      best[i][j] = Math.max(best[i + 1][j], best[i][j + 1], pair)
    }
  }
  const out: Change[] = []
  let i = 0
  let j = 0
  while (i < n || j < m) {
    if (
      i < n &&
      j < m &&
      score[i][j] >= SAME_BLOCK &&
      best[i][j] === score[i][j] + best[i + 1][j + 1]
    ) {
      out.push({ kind: "changed", tag: added[j].tag, parts: diffTokens(a[i], b[j]) })
      i++
      j++
    } else if (i < n && (j >= m || best[i][j] === best[i + 1][j])) {
      out.push({ kind: "removed", tag: removed[i].tag, tokens: a[i] })
      i++
    } else {
      out.push({ kind: "added", tag: added[j].tag, tokens: b[j] })
      j++
    }
  }
  return out
}

/** The whole revision, in the order of the newer version with removals set where they were. */
export function diffBlocks(before: Block[], after: Block[]): Change[] {
  const out: Change[] = []
  const gap = { removed: [] as Block[], added: [] as Block[] }
  const flush = () => {
    out.push(...align(gap.removed, gap.added))
    gap.removed = []
    gap.added = []
  }
  let i = 0
  let j = 0
  const equal = (x: Block, y: Block) => x.tag === y.tag && x.text === y.text
  for (const [x, y] of lcs(before, after, equal)) {
    while (i < x) gap.removed.push(before[i++])
    while (j < y) gap.added.push(after[j++])
    flush()
    out.push({ kind: "same", tag: after[j].tag, tokens: tokenize(after[j].text) })
    i++
    j++
  }
  while (i < before.length) gap.removed.push(before[i++])
  while (j < after.length) gap.added.push(after[j++])
  flush()
  return out
}

/** Consecutive tokens under one address, for drawing a link once. */
export interface Run {
  text: string
  href?: string
}

export function runs(tokens: Token[]): Run[] {
  const out: Run[] = []
  tokens.forEach((token) => {
    // A run starting a part keeps its space: the part before it ended a word.
    const space = token.gap ? " " : ""
    const tail = out.at(-1)
    if (tail && tail.href === token.href && token.href !== undefined)
      tail.text += space + token.word
    else out.push({ text: space + token.word, href: token.href })
  })
  return out
}

/** How many blocks a revision touched, for the list of revisions. */
export function summarize(changes: Change[]) {
  let added = 0
  let removed = 0
  let changed = 0
  for (const c of changes) {
    if (c.kind === "added") added++
    else if (c.kind === "removed") removed++
    else if (c.kind === "changed") changed++
  }
  return { added, removed, changed }
}
