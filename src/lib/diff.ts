import type { Redline } from "$lib/redline"

/**
 * What a diff here can be made of.
 *
 * `redline.ts` is the text model -- an amended run of paragraphs, which is
 * what an ordinance is. Not every amendment is prose: the snow plowing order
 * amends a four-column rate schedule, and flattening a row of it to
 * "7,001 to 9,000 lbs. GVWR $91 $5 $96" would lose which column each figure
 * sits in, which is the whole of what the schedule says. So a table is a
 * second shape a diff can be drawn from, and `Diff.svelte` draws either, or
 * both of one document, inside one box.
 */

/** A cell of a table: a value the amendment leaves alone, or one it replaces. */
export type Cell = string | { was: string; now: string }

/** A line of a table: a group's own heading, or a labelled row of cells. */
export type TableLine = { heading: string } | { label: string; cells: Cell[] }

/** One part of a diff: a run of paragraphs, or a table. */
export type DiffPart =
  | { kind: "text"; redline: Redline }
  | {
      kind: "table"
      /** The table's own caption, where the document prints one. */
      caption?: string
      /** The headed columns, as the document prints them. */
      columns: string[]
      lines: TableLine[]
    }

export const isHeading = (line: TableLine): line is { heading: string } => "heading" in line

/** Whether the amendment touches this line at all. */
export const amended = (line: TableLine) =>
  !isHeading(line) && line.cells.some((cell) => typeof cell !== "string")

/**
 * One drawn line of a table.
 *
 * The headed columns are the table's first line, so the lines of the schedule
 * are numbered from two -- the gutter counts what is printed, as the gutter
 * beside a paragraph does. An amended line carries `old` or `new` alone in
 * the unified layout, the way a diff line of text does; unamended, it is a
 * context line and carries both.
 */
export type TableRow = {
  type: "context" | "removed" | "added"
  old?: number
  new?: number
  line: TableLine
}

/** Every line numbered, as the split layout draws them: one row per line. */
export const tableLines = (lines: TableLine[]) =>
  lines.map((line, i) => ({ n: i + 2, line, changed: amended(line) }))

/** Every line again, an amended one twice, as the unified layout draws them. */
export const tableRows = (lines: TableLine[]): TableRow[] =>
  tableLines(lines).flatMap(({ n, line, changed }): TableRow[] =>
    changed
      ? [
          { type: "removed", old: n, line },
          { type: "added", new: n, line },
        ]
      : [{ type: "context", old: n, new: n, line }],
  )

/** What the header counts: a line the amendment adds, and one it removes. */
export const tableCounts = (lines: TableLine[]) => {
  const changed = lines.filter(amended).length
  return { added: changed, removed: changed }
}
