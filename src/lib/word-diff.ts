/**
 * Word-level difference between two versions of the same sentence.
 *
 * Written for the side-by-side of an ordinance against the one it would
 * replace: two drafts of the same paragraph, where a reader's whole question
 * is which words moved. A character-level diff answers that badly -- "MGL"
 * against "M.G.L." comes back as two inserted dots rather than as a changed
 * citation -- so the unit here is the word, punctuation and all, and the gaps
 * between words travel with them.
 *
 * Both sides come back as runs, so a renderer marks a changed run once rather
 * than marking every word in it separately.
 */

/** A run of text, either common to both versions or peculiar to this one. */
export type Run = { text: string; changed: boolean }

export type WordDiff = { before: Run[]; after: Run[] }

/**
 * Words with their trailing whitespace attached, so joining the tokens back
 * together reproduces the input exactly. The leading whitespace of the string,
 * if any, rides on the first token.
 */
const tokenize = (text: string): string[] => text.match(/\s*\S+\s*/g) ?? []

/** Whitespace and case are not what a reader means by a changed word. */
const same = (a: string, b: string) => a.trim() === b.trim()

const runs = (tokens: string[], changed: boolean[]): Run[] => {
  const out: Run[] = []
  tokens.forEach((token, i) => {
    const last = out[out.length - 1]
    if (last && last.changed === changed[i]) last.text += token
    else out.push({ text: token, changed: changed[i] })
  })
  return out
}

/**
 * The longest common subsequence of two token runs, as the index pairs that
 * match.
 *
 * Plain O(n*m) dynamic programming, which is affordable here because the
 * caller has already stripped the common head and tail: these paragraphs are
 * mostly identical, so what reaches this is a clause or two rather than the
 * whole section. The table is built over the *trimmed* middles for that
 * reason, and the caller adds the offset back.
 */
const matches = (a: string[], b: string[]): Array<[number, number]> => {
  const lengths: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  )

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lengths[i][j] = same(a[i], b[j])
        ? lengths[i + 1][j + 1] + 1
        : Math.max(lengths[i + 1][j], lengths[i][j + 1])
    }
  }

  const pairs: Array<[number, number]> = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (same(a[i], b[j])) {
      pairs.push([i, j])
      i++
      j++
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) i++
    else j++
  }
  return pairs
}

/**
 * Which words of `before` are gone and which words of `after` are new.
 *
 * A word that both versions carry in the same order is unchanged on both
 * sides; everything else is marked. A rewritten paragraph therefore comes back
 * marked almost end to end, which is the signal to show it plain instead --
 * see the `rewritten` flag on a comparison row.
 */
export const wordDiff = (before: string, after: string): WordDiff => {
  const a = tokenize(before)
  const b = tokenize(after)

  // The common head and tail, which no table needs to be built over. Most of
  // these paragraphs differ in one clause, so this is the whole of the work
  // for most of them.
  let head = 0
  while (head < a.length && head < b.length && same(a[head], b[head])) head++

  let tail = 0
  while (
    tail < a.length - head &&
    tail < b.length - head &&
    same(a[a.length - 1 - tail], b[b.length - 1 - tail])
  )
    tail++

  const changedA = new Array<boolean>(a.length).fill(false)
  const changedB = new Array<boolean>(b.length).fill(false)
  for (let i = head; i < a.length - tail; i++) changedA[i] = true
  for (let j = head; j < b.length - tail; j++) changedB[j] = true

  for (const [i, j] of matches(a.slice(head, a.length - tail), b.slice(head, b.length - tail))) {
    changedA[head + i] = false
    changedB[head + j] = false
  }

  return { before: runs(a, changedA), after: runs(b, changedB) }
}

/**
 * How much of the two versions is the same word, 0 to 1, counting unchanged
 * words against the longer side.
 *
 * Not used to decide anything at build time -- whether a section was rewritten
 * or merely amended is a judgement the comparison states by hand -- but it is
 * what the test pins that judgement against, so a transcription edited later
 * cannot quietly leave a rewritten section marked as amended.
 */
export const similarity = (before: string, after: string): number => {
  const { before: b, after: a } = wordDiff(before, after)
  const words = (runs: Run[], changed: boolean) =>
    runs.filter((r) => r.changed === changed).reduce((n, r) => n + tokenize(r.text).length, 0)

  const total = Math.max(words(b, true) + words(b, false), words(a, true) + words(a, false))
  return total === 0 ? 1 : words(b, false) / total
}
