/**
 * A table as a budget book prints it, and the helpers a chart needs to read one.
 *
 * Cells are the strings the book sets, not numbers: "$988,666", "–", "$(0)",
 * "4.2%". A transcription has to reproduce what is on the page, and a figure
 * held as a number and formatted back out is a figure that can come back
 * different -- the book writes a parenthesised zero, an en dash for a year with
 * no entry, and percentages in the same row as dollars. So the strings are the
 * record, and `amount` reads numbers back out of them for the one consumer that
 * needs numbers.
 *
 * That is what lets a table live in exactly one place. Before this, the page-78
 * figures were transcribed in the section page and typed again in the chart's
 * data, with a test parsing the first to check the second; now the chart reads
 * the transcription's own module and the two cannot disagree.
 */

export interface BudgetRow {
  /** The row heading, exactly as the book prints it. */
  label: string
  /** True where the book italicises the heading, as it does for a memo line. */
  emphasis?: boolean
  /** One cell per column after the heading, verbatim. */
  cells: string[]
}

export interface BudgetTableData {
  /**
   * Every column heading, the row-heading column first.
   *
   * Where `unheaded` is set the book prints none of these and neither does the
   * page: the names are then handles for `column` and `cell` to find a column
   * by, and nothing a reader sees.
   */
  columns: string[]
  /** The book's own caption, where it sets one over the table. */
  caption?: string
  /**
   * True for a table the book prints with no header row -- the reserve dials
   * and the debt-by-function list are a label and a figure per line, with
   * nothing over the columns.
   */
  unheaded?: boolean
  rows: BudgetRow[]
}

/**
 * The number a cell holds, or null if it holds no money.
 *
 * Null covers an empty cell, the en dash the book uses for a year with no
 * entry, and a percentage -- a chart asking for a dollar column should get
 * nothing rather than 4.2 if it asks for the wrong one. Parentheses are the
 * book's negative sign, so "$(1,781,111)" is negative and "$(0)" is zero.
 *
 * It is the cell's *dollar figure* and not every digit in the cell: the reserve
 * dials print the share beside the money in one cell, "$13,985,452 (7.85%)",
 * and reading the digits off the whole string made that thirteen billion and,
 * because of the parentheses around the share, negative. A space inside the
 * figure is part of it, because the city's documents print them that way.
 */
export function amount(cell: string): number | null {
  // `\(?` after the dollar sign for the book's "$(617,924)"; the parentheses
  // that mean a negative are always inside the figure, never around a share.
  //
  // A space inside the digits is allowed because the documents put them there:
  // the Council's own order prints "$15, 967,043" and "$ 5,150,000". A run of
  // digits is only continued across a space when digits follow it, so a cell
  // holding a figure and then something else -- "$13,985,452 (7.85%)" -- still
  // ends at the figure.
  const figure = cell.match(/\$\s*(\()?\s*(\d[\d,]*(?:\s\d[\d,]*)*)/)
  if (!figure) return null

  const value = Number(figure[2].replace(/[,\s]/g, ""))
  if (!Number.isFinite(value)) return null

  // `-0` otherwise, for the book's "$(0)" -- which is a real cell, the 2027
  // surplus line. It compares equal to 0 but not identically, so it would fail
  // a strict equality check and serialise as "-0" in prerendered JSON.
  return figure[1] && value !== 0 ? -value : value
}

/**
 * One column of a table, as label/amount pairs, for charting.
 *
 * Rows holding no money in that column drop out. `exclude` is for the rows a
 * chart should not draw as categories -- a grand total, a memo line -- named
 * rather than guessed at, so adding a row to the table cannot silently add a
 * bar that double-counts everything above it.
 */
export function column(
  table: BudgetTableData,
  heading: string,
  { exclude = [] }: { exclude?: string[] } = {},
): { label: string; amount: number }[] {
  const at = table.columns.indexOf(heading)
  if (at < 1) throw new Error(`No column "${heading}" in [${table.columns.join(", ")}]`)

  const skip = new Set(exclude)
  const out: { label: string; amount: number }[] = []

  for (const row of table.rows) {
    if (skip.has(row.label)) continue
    // `at` counts the heading column, which is not in `cells`.
    const value = amount(row.cells[at - 1] ?? "")
    if (value !== null) out.push({ label: row.label, amount: value })
  }
  return out
}

/** One cell, by row and column heading. */
export function cell(table: BudgetTableData, label: string, heading: string): string {
  const at = table.columns.indexOf(heading)
  if (at < 1) throw new Error(`No column "${heading}" in [${table.columns.join(", ")}]`)

  const row = table.rows.find((r) => r.label === label)
  if (!row) throw new Error(`No row "${label}"`)

  return row.cells[at - 1] ?? ""
}

/** What a column adds up to, for checking a table against its own total. */
export const sum = (rows: { amount: number }[]) => rows.reduce((n, r) => n + r.amount, 0)
