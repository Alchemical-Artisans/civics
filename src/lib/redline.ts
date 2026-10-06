import { wordEdits, type Run } from "$lib/word-diff"

/**
 * An amended text as a strike-through copy prints it: one run of paragraphs,
 * each carrying the words it keeps, the words it strikes and the words it adds,
 * in the order the marked-up copy sets them down.
 *
 * This is the one shape every amendment on the site is drawn from. Sometimes
 * the packet carries the marked-up copy itself -- an ordinance that amends an
 * article in place usually comes with "the deletions struck through and the
 * additions in italic" -- and the transcription is then a straight copy of its
 * marks. Sometimes it carries only the two versions, the order and the text it
 * repeals and replaces "in its entirety", and `fromComparison` writes the marks
 * out of a word diff instead. Either way the page then draws two things from
 * it: a diff, the way GitHub draws one, and the strike-through itself -- linked
 * to in the packet where the city published one, rendered here where it did
 * not.
 */

/**
 * A stretch of one paragraph. Spacing is as the copy prints it: a struck
 * passage carries its own leading or trailing space where the print does, and
 * `before` and `after` tidy the gaps a removed passage leaves behind.
 */
export type Segment = string | { struck: string } | { added: string }

export type Block = {
  /**
   * A section's own number and title, a defined term printed on its own line,
   * or ordinary text. Only a renderer's business: the diff counts each the
   * same as any other paragraph.
   */
  kind?: "heading" | "term" | "text"
  /** How far in the copy sets the paragraph -- a lettered list under a numbered one. */
  indent?: number
  text: Segment[]
}

export type Redline = Block[]

/**
 * Collapsed spacing, and no gap before a stop or comma: striking "... engine"
 * out of "engine . A motorized" leaves exactly that gap.
 */
const tidy = (text: string) =>
  text
    .replace(/\s+/g, " ")
    .replace(/ ([.,;:])/g, "$1")
    .trim()

/** The paragraph as it stands today: kept and struck words, added ones left out. */
export const before = (block: Block): string =>
  tidy(block.text.map((s) => (typeof s === "string" ? s : "struck" in s ? s.struck : "")).join(""))

/** The paragraph as amended: kept and added words, struck ones left out. */
export const after = (block: Block): string =>
  tidy(block.text.map((s) => (typeof s === "string" ? s : "added" in s ? s.added : "")).join(""))

/**
 * One side of a paragraph as runs, a run being changed where it is that side's
 * own -- struck on the before side, added on the after side. These are the
 * words a diff line highlights.
 */
const side = (block: Block, own: "struck" | "added"): Run[] => {
  // Character by character, so the same tidying `before` and `after` do can
  // be applied without moving a mark: a gap keeps the unchanged flag where it
  // straddles a mark's edge, since the gap belongs to neither version alone.
  const chars: Array<{ c: string; changed: boolean }> = []
  for (const segment of block.text) {
    const [text, changed] =
      typeof segment === "string"
        ? [segment, false]
        : own === "struck" && "struck" in segment
          ? [segment.struck, true]
          : own === "added" && "added" in segment
            ? [segment.added, true]
            : [null, false]
    if (text !== null) for (const c of text) chars.push({ c, changed })
  }

  const tidied: typeof chars = []
  for (let i = 0; i < chars.length; i++) {
    const { c, changed } = chars[i]
    if (!/\s/.test(c)) {
      tidied.push({ c, changed })
      continue
    }
    let j = i
    let mixed = changed
    while (j < chars.length && /\s/.test(chars[j].c)) {
      mixed = mixed && chars[j].changed
      j++
    }
    const next = chars[j]?.c
    // Marked only between two marked words: a highlight that runs on into the
    // gap after a word reads as if the space itself had changed.
    if (tidied.length && next !== undefined && !/[.,;:]/.test(next))
      tidied.push({
        c: " ",
        changed: mixed && tidied[tidied.length - 1].changed && chars[j].changed,
      })
    i = j - 1
  }

  const out: Run[] = []
  for (const { c, changed } of tidied) {
    const last = out[out.length - 1]
    if (last && last.changed === changed) last.text += c
    else out.push({ text: c, changed })
  }
  return out
}

/** One line of a diff: a paragraph either version has, or both share. */
export type DiffLine = {
  type: "context" | "removed" | "added"
  /** The paragraph's number in today's text, on a line today's text has. */
  old?: number
  /** Its number in the amended text, on a line the amended text has. */
  new?: number
  kind: NonNullable<Block["kind"]>
  indent: number
  runs: Run[]
  /** Which paragraph of the redline the line was drawn from. */
  block: number
}

/**
 * The redline as a diff, a paragraph to a line.
 *
 * A paragraph both versions print identically is a context line; one that
 * differs is a removed line and an added line, one after the other, each with
 * its own side's marks as the highlighted words -- GitHub's word highlighting,
 * except that the words highlighted are exactly the ones the copy marks. A
 * paragraph only one version has is a line on that side alone.
 */
/**
 * A line that is all one side's own -- a paragraph wholly new or wholly gone,
 * or a rewritten one struck and added whole -- highlights nothing, as GitHub
 * draws a line with nothing in common with its neighbour: the line's own
 * colour already says all of it changed, and a highlight over every word would
 * only say it again louder.
 */
const unlessWhole = (runs: Run[]): Run[] =>
  runs.every((r) => r.changed) ? runs.map((r) => ({ ...r, changed: false })) : runs

export const diffLines = (redline: Redline): DiffLine[] => {
  const lines: DiffLine[] = []
  let old = 0
  let now = 0
  redline.forEach((block, at) => {
    const kind = block.kind ?? "text"
    const indent = block.indent ?? 0
    const was = before(block)
    const is = after(block)
    if (was === is) {
      lines.push({
        type: "context",
        old: ++old,
        new: ++now,
        kind,
        indent,
        block: at,
        runs: side(block, "added"),
      })
      return
    }
    if (was)
      lines.push({
        type: "removed",
        old: ++old,
        kind,
        indent,
        block: at,
        runs: unlessWhole(side(block, "struck")),
      })
    if (is)
      lines.push({
        type: "added",
        new: ++now,
        kind,
        indent,
        block: at,
        runs: unlessWhole(side(block, "added")),
      })
  })
  return lines
}

/** One row of a split diff: today's paragraph on the left, the amended on the right. */
export type SplitRow = { left?: DiffLine; right?: DiffLine }

/**
 * Lines laid out side by side, as GitHub's split view lays them out.
 *
 * An unchanged paragraph is the same line on both sides, and an amended one
 * puts its removed and added lines on one row. Where a stretch strikes some
 * paragraphs whole and adds others whole -- a rewritten provision, a defined
 * term renamed -- the removed run and the added run after it are set beside
 * each other in order, the way GitHub pairs a run of deleted lines with the
 * run added in their place; whichever run is longer finishes against a blank.
 */
export const splitRows = (lines: DiffLine[]): SplitRow[] => {
  const rows: SplitRow[] = []
  let removed: DiffLine[] = []
  let added: DiffLine[] = []
  const flush = () => {
    for (let k = 0; k < Math.max(removed.length, added.length); k++)
      rows.push({ left: removed[k], right: added[k] })
    removed = []
    added = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const next = lines[i + 1]
    if (line.type === "context") {
      flush()
      rows.push({ left: line, right: line })
    } else if (line.type === "removed" && next?.type === "added" && next.block === line.block) {
      flush()
      rows.push({ left: line, right: next })
      i++
    } else if (line.type === "removed") {
      // A removal after additions starts a new pairing rather than reaching
      // back to set itself beside text that came before it.
      if (added.length) flush()
      removed.push(line)
    } else added.push(line)
  }
  flush()
  return rows
}

/**
 * What a diff shows: runs of changed lines with a little unchanged text either
 * side, and the unchanged stretches between them folded away.
 *
 * `hidden` is the unchanged text folded away just above the hunk, which a
 * reader can open; `section` is the nearest heading at or above the hunk's
 * first line, which GitHub prints after a hunk's `@@` ranges as the function
 * the hunk is in.
 */
export type Hunk = {
  hidden: DiffLine[]
  lines: DiffLine[]
  section?: string
  old: { start: number; count: number }
  new: { start: number; count: number }
}

export type Diff = { hunks: Hunk[]; trailing: DiffLine[]; added: number; removed: number }

const text = (line: DiffLine) => line.runs.map((r) => r.text).join("")

/**
 * `context` paragraphs either side of a change, against GitHub's three lines:
 * a paragraph of legal prose is a good deal more than a line of code, and one
 * is enough to say where in the text a change falls.
 */
export const diff = (redline: Redline, context = 1): Diff => {
  const lines = diffLines(redline)
  const changed = lines.map((l) => l.type !== "context")

  // A line is shown when it is a change or within `context` of one.
  const shown = lines.map((_, i) => {
    for (let k = Math.max(0, i - context); k <= Math.min(lines.length - 1, i + context); k++)
      if (changed[k]) return true
    return false
  })

  const hunks: Hunk[] = []
  let hidden: DiffLine[] = []
  let current: DiffLine[] | null = null
  let heading: string | undefined

  const close = () => {
    if (!current) return
    const olds = current.filter((l) => l.old !== undefined)
    const news = current.filter((l) => l.new !== undefined)
    hunks.push({
      hidden,
      lines: current,
      section: heading,
      // An empty side starts where the other side's text would have been, as
      // a unified diff's own header does.
      old: { start: olds[0]?.old ?? 0, count: olds.length },
      new: { start: news[0]?.new ?? 0, count: news.length },
    })
    hidden = []
    current = null
  }

  let lastHeading: string | undefined
  lines.forEach((line, i) => {
    if (shown[i]) {
      if (!current) {
        current = []
        heading = line.kind === "heading" ? text(line) : lastHeading
      }
      current.push(line)
    } else {
      close()
      hidden.push(line)
    }
    if (line.kind === "heading" && line.type !== "removed") lastHeading = text(line)
  })
  close()

  return {
    hunks,
    trailing: hidden,
    added: lines.filter((l) => l.type === "added").length,
    removed: lines.filter((l) => l.type === "removed").length,
  }
}

/** One provision of a two-version comparison, as `ordinances.ts` keeps it. */
type Row = {
  label?: string
  now?: string[]
  proposed?: string[]
  rewritten?: boolean
}

type Part = {
  now?: { number: string; title: string }
  proposed?: { number: string; title: string }
  rows: Row[]
}

/** Marks for one paragraph from the word diff of its two versions. */
const marked = (was: string, is: string): Segment[] =>
  wordEdits(was, is).flatMap((e): Segment[] => {
    if (e.op === "same") return [e.text]
    // The gap after a marked passage is left unmarked, as a person marking up
    // a copy draws the line through the word and not the space beside it.
    const [, text, gap] = /^([\s\S]*?)(\s*)$/.exec(e.text) ?? ["", e.text, ""]
    const mark = e.op === "removed" ? { struck: text } : { added: text }
    return gap ? [mark, gap] : [mark]
  })

const whole = (was: string | undefined, is: string | undefined): Segment[] =>
  marked(was ?? "", is ?? "")

/**
 * A letter or number that leads its provision -- "A.", "(3)" -- rather than a
 * defined term or a table's row heading, which the copy prints on a line of
 * its own.
 */
const lettered = (label: string) => /^\(?[A-Za-z0-9]{1,3}[.)]$/.test(label)

/**
 * The redline an order that replaces a text "in its entirety" never prints,
 * written out from a transcription of both versions.
 *
 * Each provision is marked word by word where it was amended; where it was
 * rewritten -- the judgement the comparison already states by hand -- today's
 * paragraphs are struck whole and the order's added whole after them, which is
 * how a person marking up a copy would do it and how GitHub draws a line that
 * shares nothing with the one it replaces. A section's number and title are a
 * heading of their own, marked the same way, so § 250-25 becoming § 250-25.1
 * reads as the one character it is.
 */
export const fromComparison = (parts: Part[]): Redline => {
  const out: Redline = []
  const heading = (h?: { number: string; title: string }) =>
    h ? `${h.number} ${h.title}` : undefined

  for (const part of parts) {
    out.push({ kind: "heading", text: whole(heading(part.now), heading(part.proposed)) })

    for (const row of part.rows) {
      const label = row.label
      const inline = label !== undefined && lettered(label)
      const prefix = (side: string[] | undefined, i: number) =>
        inline && side?.length && i === 0 ? `${label} ` : ""

      if (label !== undefined && !inline) {
        out.push({
          kind: "term",
          text: whole(row.now?.length ? label : "", row.proposed?.length ? label : ""),
        })
      }

      if (row.rewritten && row.now?.length && row.proposed?.length) {
        row.now.forEach((p, i) => out.push({ text: [{ struck: prefix(row.now, i) + p }] }))
        row.proposed.forEach((p, i) => out.push({ text: [{ added: prefix(row.proposed, i) + p }] }))
        continue
      }

      const pairs = Math.max(row.now?.length ?? 0, row.proposed?.length ?? 0)
      for (let i = 0; i < pairs; i++) {
        const was = row.now?.[i]
        const is = row.proposed?.[i]
        out.push({
          text: whole(
            was === undefined ? undefined : prefix(row.now, i) + was,
            is === undefined ? undefined : prefix(row.proposed, i) + is,
          ),
        })
      }
    }
  }
  return out
}
